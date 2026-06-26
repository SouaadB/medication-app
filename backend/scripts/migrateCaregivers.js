/*
 * One-off data migration: unify caregivers/caregiver_users into users+caregivers,
 * build caregiver_assignment from caregivers_old, backfill caregiver_id on
 * caregiver_notifications/caregiver_assessments, and remap caregiver-side ids
 * in chat_messages from the old (caregivers_old.id / caregiver_users.id) space
 * to the new caregivers.id (= users.id) space.
 *
 * Run once against defaultdb_local: node backend/scripts/migrateCaregivers.js
 */
require('dotenv').config({ path: require('path').join(__dirname, '..', '.env') });
const db = require('../src/config/database');

const report = {
    identitiesCreated: [],
    forcedPasswordResets: [],
    assignmentsCreated: [],
    notificationsBackfilled: 0,
    assessmentsBackfilled: 0,
    chatMessagesRemapped: 0,
    chatOrphansRemoved: [],
    unmatched: [],
};

function generateCode() {
    return String(Math.floor(100000 + Math.random() * 900000));
}

async function main() {
    const conn = await db.getConnection();
    try {
        await conn.beginTransaction();

        const [oldRows] = await conn.execute('SELECT * FROM caregivers_old');
        const [cuRows] = await conn.execute('SELECT * FROM caregiver_users');
        const cuByEmail = new Map(cuRows.map(r => [r.email, r]));

        // distinct emails across both legacy tables
        const emails = new Set([...oldRows.map(r => r.email), ...cuRows.map(r => r.email)]);

        // email -> new caregivers.id (= users.id)
        const emailToNewId = new Map();
        // old id (caregivers_old.id or caregiver_users.id) -> email, for chat_messages remap
        const oldCaregiverUserIdToEmail = new Map(cuRows.map(r => [r.id, r.email]));
        const oldAssignmentIdToEmail = new Map(oldRows.map(r => [r.id, r.email]));

        for (const email of emails) {
            const cu = cuByEmail.get(email);
            const oldMatches = oldRows.filter(r => r.email === email);

            let name, passwordHash, fcmToken, needsForcedReset = false;

            if (cu) {
                // caregiver_users is the canonical login credential source today
                // (confirmed: authController.login checks bcrypt.compare against
                // caregiver_users.password, never caregivers.temp_password once
                // an account exists).
                name = cu.name;
                passwordHash = cu.password;
                fcmToken = cu.fcm_token || null;

                if (oldMatches.some(r => r.temp_password && r.temp_password !== cu.password)) {
                    // Divergent hash exists in caregivers_old.temp_password, but it is
                    // provably not what login uses — not a real ambiguity, just stale
                    // invite-secret leftover. Logged for visibility, no reset forced.
                    report.unmatched.push({
                        email,
                        note: 'caregivers_old.temp_password differs from caregiver_users.password; caregiver_users.password kept as canonical (confirmed login source)',
                    });
                }
            } else {
                // Never completed signup — no real password ever existed.
                // Do not promote temp_password to a permanent credential.
                name = oldMatches[0]?.name?.trim() || email;
                passwordHash = await require('bcryptjs').hash(require('crypto').randomBytes(32).toString('hex'), 10);
                fcmToken = null;
                needsForcedReset = true;
            }

            const [existingUserRow] = await conn.execute(
                "SELECT id FROM users WHERE email = ? AND role = 'caregiver'",
                [email]
            );
            if (existingUserRow.length > 0) {
                report.unmatched.push({ email, note: 'users(email,role=caregiver) already existed pre-migration — unexpected, reused existing id' });
                emailToNewId.set(email, existingUserRow[0].id);
                continue;
            }

            const [userResult] = await conn.execute(
                `INSERT INTO users (name, email, password, phone, role, is_verified)
                 VALUES (?, ?, ?, NULL, 'caregiver', 1)`,
                [name, email, passwordHash]
            );
            const newId = userResult.insertId;
            emailToNewId.set(email, newId);

            await conn.execute(
                'INSERT INTO caregivers (id, fcm_token) VALUES (?, ?)',
                [newId, fcmToken]
            );

            report.identitiesCreated.push({ newId, email, name, source: cu ? 'caregiver_users' : 'caregivers_old (no account)' });

            if (needsForcedReset) {
                const code = generateCode();
                const expiresAt = new Date(Date.now() + 15 * 60 * 1000);
                await conn.execute(
                    'INSERT INTO reset_codes (user_id, code, type, expires_at) VALUES (?, ?, ?, ?)',
                    [newId, code, 'email', expiresAt]
                );
                report.forcedPasswordResets.push({ email, newId, reason: 'no caregiver_users account ever existed; temp_password was invite-only, never a real credential' });
            }
        }

        // caregiver_assignment from caregivers_old
        for (const row of oldRows) {
            const caregiverId = emailToNewId.get(row.email);
            if (!caregiverId) {
                report.unmatched.push({ email: row.email, note: 'caregivers_old row had no resolvable identity (should not happen)' });
                continue;
            }
            const [result] = await conn.execute(
                `INSERT INTO caregiver_assignment
                 (patient_id, caregiver_id, relationship, status, view_location, view_medications, receive_alerts, created_at, expires_at)
                 VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
                [row.patient_id, caregiverId, row.relationship.trim(), row.status,
                 row.view_location, row.view_medications, row.receive_alerts,
                 row.created_at, row.expires_at]
            );
            report.assignmentsCreated.push({ assignmentId: result.insertId, patient_id: row.patient_id, caregiverId, email: row.email, status: row.status });
        }

        // Backfill caregiver_notifications.caregiver_id
        for (const [email, newId] of emailToNewId) {
            const [r1] = await conn.execute(
                'UPDATE caregiver_notifications SET caregiver_id = ? WHERE caregiver_email = ?',
                [newId, email]
            );
            report.notificationsBackfilled += r1.affectedRows;

            const [r2] = await conn.execute(
                'UPDATE caregiver_assessments SET caregiver_id = ? WHERE caregiver_email = ?',
                [newId, email]
            );
            report.assessmentsBackfilled += r2.affectedRows;
        }

        const [unmatchedNotif] = await conn.execute('SELECT DISTINCT caregiver_email FROM caregiver_notifications WHERE caregiver_id IS NULL');
        const [unmatchedAssess] = await conn.execute('SELECT DISTINCT caregiver_email FROM caregiver_assessments WHERE caregiver_id IS NULL');
        for (const r of unmatchedNotif) report.unmatched.push({ email: r.caregiver_email, note: 'orphan caregiver_notifications.caregiver_email — no matching identity' });
        for (const r of unmatchedAssess) report.unmatched.push({ email: r.caregiver_email, note: 'orphan caregiver_assessments.caregiver_email — no matching identity' });

        // Remap chat_messages caregiver-side ids (old id space -> new caregivers.id)
        const [chatRows] = await conn.execute(
            "SELECT DISTINCT sender_id AS id FROM chat_messages WHERE sender_role='caregiver' " +
            "UNION SELECT DISTINCT receiver_id AS id FROM chat_messages WHERE receiver_role='caregiver'"
        );
        const oldIdToNewId = new Map();
        for (const { id } of chatRows) {
            const email = oldCaregiverUserIdToEmail.get(id) || oldAssignmentIdToEmail.get(id);
            const newId = email ? emailToNewId.get(email) : null;
            if (newId) {
                oldIdToNewId.set(id, newId);
            } else {
                report.unmatched.push({ note: `chat_messages caregiver-side id ${id} could not be resolved to any known caregiver email` });
            }
        }
        for (const [oldId, newId] of oldIdToNewId) {
            if (oldId === newId) continue;
            const [r1] = await conn.execute(
                "UPDATE chat_messages SET sender_id = ? WHERE sender_role='caregiver' AND sender_id = ?",
                [newId, oldId]
            );
            const [r2] = await conn.execute(
                "UPDATE chat_messages SET receiver_id = ? WHERE receiver_role='caregiver' AND receiver_id = ?",
                [newId, oldId]
            );
            report.chatMessagesRemapped += r1.affectedRows + r2.affectedRows;
        }

        // Orphan chat_messages referencing a deleted patient (no users/patients row) —
        // required for the new chat_messages FK to users.id to be addable at all.
        const [orphanChat] = await conn.execute(
            `SELECT cm.id, cm.sender_id, cm.sender_role, cm.receiver_id, cm.receiver_role
             FROM chat_messages cm
             LEFT JOIN users su ON su.id = cm.sender_id
             LEFT JOIN users ru ON ru.id = cm.receiver_id
             WHERE su.id IS NULL OR ru.id IS NULL`
        );
        for (const row of orphanChat) {
            report.chatOrphansRemoved.push(row);
        }
        if (orphanChat.length > 0) {
            const ids = orphanChat.map(r => r.id);
            await conn.execute(`DELETE FROM chat_messages WHERE id IN (${ids.join(',')})`);
        }

        await conn.commit();
        console.log(JSON.stringify(report, null, 2));
    } catch (err) {
        await conn.rollback();
        console.error('Migration failed, rolled back:', err);
        process.exitCode = 1;
    } finally {
        conn.release();
        process.exit();
    }
}

main();
