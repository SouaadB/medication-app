const db = require('../config/database');

class CaregiverNotificationService {

    // ── CREATE ────────────────────────────────────────────────────────────────

    static async create(caregiverId, patientId, type, title, message) {
        try {
            await db.execute(
                `INSERT INTO caregiver_notifications
                 (caregiver_id, patient_id, type, title, message)
                 VALUES (?, ?, ?, ?, ?)`,
                [caregiverId, patientId, type, title, message]
            );

            // Send Firebase push notification
            const [[caregiver]] = await db.execute(
                'SELECT fcm_token FROM caregivers WHERE id = ?',
                [caregiverId]
            );

            if (caregiver?.fcm_token) {
                const FirebaseService = require('./firebaseService');
                await FirebaseService.sendPushNotification(
                    caregiver.fcm_token,
                    title,
                    message,
                    { type, patient_id: String(patientId) },
                    type === 'emergency'
                );
                console.log(`[CaregiverNotif] 🔔 Push sent to caregiver ${caregiverId}`);
            }
        } catch (error) {
            console.error('[CaregiverNotif] create error:', error);
        }
    }


    // ── DEDUP CHECK ───────────────────────────────────────────────────────────
    // Prevents duplicate notifications within a time window

    static async alreadySent(caregiverId, patientId, type, windowHours = 2) {
        try {
            const [rows] = await db.execute(
                `SELECT id FROM caregiver_notifications
                 WHERE caregiver_id = ? AND patient_id = ? AND type = ?
                 AND created_at > DATE_SUB(NOW(), INTERVAL ? HOUR)`,
                [caregiverId, patientId, type, windowHours]
            );
            return rows.length > 0;
        } catch (_) { return false; }
    }

    // ── 1. EMERGENCY ALERTS ───────────────────────────────────────────────────

    static async sendEmergencyAlerts() {
        try {
            // ── A: HIGH priority missed dose ──────────────────────────────────
            const [highMissed] = await db.execute(`
                SELECT
                    ms.id AS schedule_id,
                    ms.patient_id,
                    u.name AS patient_name,
                    t.medication_name,
                    t.dosage,
                    DATE_FORMAT(ms.scheduled_date_time, '%H:%i') AS scheduled_time,
                    ca.caregiver_id,
                    ca.receive_alerts
                FROM medication_schedules ms
                JOIN treatments t ON ms.treatment_id = t.id
                JOIN patients p   ON ms.patient_id   = p.id
                JOIN users u      ON p.id             = u.id
                JOIN caregiver_assignment ca ON ca.patient_id = p.id
                WHERE ms.status     = 'MISSED'
                  AND t.priority    = 'HIGH'
                  AND ca.status     = 'ACTIVE'
                  AND ca.receive_alerts = 1
                  AND ms.scheduled_date_time BETWEEN DATE_SUB(NOW(), INTERVAL 30 MINUTE) AND NOW()
            `);

            for (const row of highMissed) {
                const alreadySent = await this.alreadySent(
                    row.caregiver_id, row.patient_id, 'emergency', 1
                );
                if (alreadySent) continue;

                await this.create(
                    row.caregiver_id,
                    row.patient_id,
                    'emergency',
                    `🚨 Critical missed dose — ${row.patient_name}`,
                    `${row.patient_name} missed their critical medication: ${row.medication_name}${row.dosage ? ' ' + row.dosage : ''} scheduled at ${row.scheduled_time}. Please check on them.`
                );
                console.log(`[CaregiverNotif] ⚠️ HIGH missed alert sent to caregiver ${row.caregiver_id} for patient ${row.patient_name}`);
            }

            // ── B: 3+ consecutive missed doses today ──────────────────────────
            const [consecutiveMissed] = await db.execute(`
                SELECT
                    ms.patient_id,
                    u.name AS patient_name,
                    COUNT(*) AS missed_count,
                    ca.caregiver_id,
                    ca.receive_alerts
                FROM medication_schedules ms
                JOIN patients p   ON ms.patient_id = p.id
                JOIN users u      ON p.id           = u.id
                JOIN caregiver_assignment ca ON ca.patient_id   = p.id
                WHERE ms.status   = 'MISSED'
                  AND DATE(ms.scheduled_date_time) = CURDATE()
                  AND ca.status    = 'ACTIVE'
                  AND ca.receive_alerts = 1
                GROUP BY ms.patient_id, u.name, ca.caregiver_id
                HAVING missed_count >= 3
            `);

            for (const row of consecutiveMissed) {
                const alreadySent = await this.alreadySent(
                    row.caregiver_id, row.patient_id, 'emergency', 4
                );
                if (alreadySent) continue;

                await this.create(
                    row.caregiver_id,
                    row.patient_id,
                    'emergency',
                    `❗ ${row.patient_name} has missed ${row.missed_count} doses today`,
                    `${row.patient_name} has missed ${row.missed_count} medications today. This pattern needs attention — please check in with them.`
                );
                console.log(`[CaregiverNotif] ❗ ${row.missed_count} missed doses alert → caregiver ${row.caregiver_id}`);
            }

            // ── C: Location not updated in 2h during waking hours ────────────
            const currentHour = new Date().getHours();
            if (currentHour >= 8 && currentHour <= 21) {
                const [staleLocation] = await db.execute(`
                    SELECT
                        p.id AS patient_id,
                        u.name AS patient_name,
                        p.last_location_timestamp,
                        TIMESTAMPDIFF(MINUTE, p.last_location_timestamp, NOW()) AS minutes_ago,
                        ca.caregiver_id,
                        ca.view_location
                    FROM patients p
                    JOIN users u      ON p.id         = u.id
                    JOIN caregiver_assignment ca ON ca.patient_id = p.id
                    WHERE p.location_sharing_enabled = 1
                      AND p.last_location_timestamp IS NOT NULL
                      AND TIMESTAMPDIFF(MINUTE, p.last_location_timestamp, NOW()) > 120
                      AND ca.status       = 'ACTIVE'
                      AND ca.view_location = 1
                `);

                for (const row of staleLocation) {
                    const alreadySent = await this.alreadySent(
                        row.caregiver_id, row.patient_id, 'emergency', 3
                    );
                    if (alreadySent) continue;

                    const hoursAgo = Math.floor(row.minutes_ago / 60);
                    await this.create(
                        row.caregiver_id,
                        row.patient_id,
                        'emergency',
                        `📍 ${row.patient_name}'s location not updated`,
                        `${row.patient_name}'s location hasn't been updated for ${hoursAgo} hour${hoursAgo > 1 ? 's' : ''}. Their location's tracking may be off.`
                    );
                    console.log(`[CaregiverNotif] 📍 Stale location alert → caregiver ${row.caregiver_id}`);
                }
            }

            return true;
        } catch (error) {
            console.error('[CaregiverNotif] sendEmergencyAlerts error:', error);
            return false;
        }
    }

    // ── 2. DAILY SUMMARY ──────────────────────────────────────────────────────

    static async sendDailySummary() {
        try {
            const [pairs] = await db.execute(`
                SELECT
                    ca.caregiver_id,
                    ca.patient_id,
                    u.name AS patient_name,
                    COUNT(*) AS total,
                    SUM(CASE WHEN ms.status = 'TAKEN'  THEN 1 ELSE 0 END) AS taken,
                    SUM(CASE WHEN ms.status = 'MISSED' THEN 1 ELSE 0 END) AS missed
                FROM caregiver_assignment ca
                JOIN patients p   ON ca.patient_id = p.id
                JOIN users u      ON p.id          = u.id
                JOIN medication_schedules ms ON ms.patient_id = p.id
                WHERE ca.status   = 'ACTIVE'
                  AND ca.receive_alerts = 1
                  AND DATE(ms.scheduled_date_time) = CURDATE()
                  AND ms.scheduled_date_time      <= NOW()
                GROUP BY ca.caregiver_id, ca.patient_id, u.name
                HAVING missed > 0
            `);

            for (const row of pairs) {
                const alreadySent = await this.alreadySent(
                    row.caregiver_id, row.patient_id, 'summary', 20
                );
                if (alreadySent) continue;

                const adherencePct = Math.round((row.taken / row.total) * 100);
                const emoji = adherencePct >= 80 ? '✅' : adherencePct >= 50 ? '⚠️' : '❌';

                await this.create(
                    row.caregiver_id,
                    row.patient_id,
                    'summary',
                    `${emoji} Daily summary — ${row.patient_name}`,
                    `${row.patient_name} took ${row.taken} out of ${row.total} medications today (${adherencePct}% adherence). ${row.missed} dose${row.missed > 1 ? 's were' : ' was'} missed.`
                );
                console.log(`[CaregiverNotif] 📊 Daily summary sent to caregiver ${row.caregiver_id} for ${row.patient_name}`);
            }

            return true;
        } catch (error) {
            console.error('[CaregiverNotif] sendDailySummary error:', error);
            return false;
        }
    }

    // ── 3. MILESTONE ──────────────────────────────────────────────────────────

    static async sendMilestone(patientId, streakDays) {
        // Only send for meaningful milestones
        if (![7, 14, 30].includes(streakDays)) return;

        try {
            const [[patient]] = await db.execute(
                'SELECT u.name FROM patients p JOIN users u ON p.id = u.id WHERE p.id = ?',
                [patientId]
            );
            if (!patient) return;

            const [caregivers] = await db.execute(
                `SELECT caregiver_id FROM caregiver_assignment
                 WHERE patient_id = ? AND status = 'ACTIVE' AND receive_alerts = 1`,
                [patientId]
            );

            const emoji   = streakDays >= 30 ? '🏆' : streakDays >= 14 ? '🏅' : '⭐';
            const title   = `${emoji} ${patient.name} reached a ${streakDays}-day streak!`;
            const message = `Great news! ${patient.name} has taken all their medications on time for ${streakDays} consecutive days. Keep encouraging them!`;

            for (const c of caregivers) {
                const alreadySent = await this.alreadySent(c.caregiver_id, patientId, 'milestone', 24 * 7);
                if (alreadySent) continue;
                await this.create(c.caregiver_id, patientId, 'milestone', title, message);
                console.log(`[CaregiverNotif] ${emoji} Milestone ${streakDays}d sent to caregiver ${c.caregiver_id}`);
            }
        } catch (error) {
            console.error('[CaregiverNotif] sendMilestone error:', error);
        }
    }

    // ── GET NOTIFICATIONS ─────────────────────────────────────────────────────

    static async getForCaregiver(caregiverId, limit = 50) {
        try {
            const [rows] = await db.execute(
                `SELECT cn.*, u.name AS patient_name
                 FROM caregiver_notifications cn
                 JOIN patients p ON cn.patient_id = p.id
                 JOIN users u    ON p.id           = u.id
                 WHERE cn.caregiver_id = ?
                 ORDER BY cn.created_at DESC
                 LIMIT ${parseInt(limit)}`,
                [caregiverId]
            );
            const unreadCount = rows.filter(r => !r.is_read).length;
            return { notifications: Array.isArray(rows) ? rows : [], unreadCount };
        } catch (error) {
            console.error('[CaregiverNotif] getForCaregiver error:', error);
            return { notifications: [], unreadCount: 0 };
        }
    }

    static async markAllRead(caregiverId) {
        try {
            await db.execute(
                'UPDATE caregiver_notifications SET is_read = 1 WHERE caregiver_id = ? AND is_read = 0',
                [caregiverId]
            );
        } catch (error) {
            console.error('[CaregiverNotif] markAllRead error:', error);
        }
    }

    static async getUnreadCount(caregiverId) {
        try {
            const [[row]] = await db.execute(
                'SELECT COUNT(*) AS cnt FROM caregiver_notifications WHERE caregiver_id = ? AND is_read = 0',
                [caregiverId]
            );
            return row?.cnt || 0;
        } catch (_) { return 0; }
    }
}

module.exports = CaregiverNotificationService;
