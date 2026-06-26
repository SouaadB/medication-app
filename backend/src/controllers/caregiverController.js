const User = require('../models/User');
const Caregiver = require('../models/Caregiver');
const CaregiverAssignment = require('../models/CaregiverAssignment');
const emailSenderService = require('../services/emailSenderService');
const emailVerificationService = require('../services/emailVerificationService');
const db = require('../config/database');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const RegisterRequest = require('../dto/RegisterRequest');

// Helper function to generate random password
const generateTempPassword = () => {
    return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
};

const generateInviteToken = () => crypto.randomBytes(32).toString('hex');

// GET /caregivers — patient's caregiver list. `id` returned here is the
// caregiver's identity id (caregivers.id === users.id), used by the frontend
// both to remove/update the relationship and as the chat partner id.
exports.getCaregivers = async (req, res) => {
    try {
        const caregivers = await CaregiverAssignment.findByPatientId(req.user.id);
        res.json({
            success: true,
            count: caregivers.length,
            caregivers: caregivers.map(c => ({
                id: c.caregiver_id,
                name: c.name,
                email: c.email,
                relationship: c.relationship,
                status: c.status,
                view_location: c.view_location,
                view_medications: c.view_medications,
                receive_alerts: c.receive_alerts,
                created_at: c.created_at,
            })),
        });
    } catch (error) {
        console.error('Get Caregivers Error:', error);
        res.status(500).json({ success: false, message: 'Error fetching caregivers' });
    }
};

exports.addCaregiver = async (req, res) => {
    try {
        const { name, relationship, email, view_location, view_medications, receive_alerts } = req.body;

        if (!name || !relationship || !email) {
            return res.status(400).json({ success: false, message: 'Please provide name, relationship and email' });
        }

        const emailCheck = await emailVerificationService.verifyEmail(email);
        if (!emailCheck.isValid) {
            return res.status(400).json({
                success: false,
                message: emailCheck.message || 'Email adresse is not valid. Verify that the caregiver email is valid and existing before sending an invitation'
            });
        }

        if (email === req.user.email) {
            return res.status(400).json({
                success: false,
                message: 'You cannot add yourself as a caregiver'
            });
        }

        // Note if this email is also a patient elsewhere — allowed under the
        // per-role unique email model, just informational.
        const existingPatient = await User.findByEmailAndRole(email, 'patient');
        const isPatient = !!existingPatient;

        const caregiverUser = await User.findByEmailAndRole(email, 'caregiver');

        if (caregiverUser) {
            const existingAssignment = await CaregiverAssignment.findOne(req.user.id, caregiverUser.id);

            if (existingAssignment) {
                if (existingAssignment.status === 'PENDING') {
                    return res.status(409).json({
                        success: false,
                        message: 'An invitation has already been sent to this email. Please wait for them to accept.'
                    });
                }
                if (existingAssignment.status === 'ACTIVE') {
                    return res.status(409).json({
                        success: false,
                        message: 'This caregiver is already active for your account.'
                    });
                }
                // REVOKED -> re-invite. Existing account, so this goes through
                // the same accept-by-email-link path as a fresh assignment
                // below — never silently reactivated.
                const inviteToken = generateInviteToken();
                await db.execute(
                    `UPDATE caregiver_assignment
                     SET relationship = ?, view_location = ?, view_medications = ?, receive_alerts = ?,
                         status = 'PENDING', invite_token = ?, invited_at = NOW(), expires_at = DATE_ADD(NOW(), INTERVAL 7 DAY)
                     WHERE patient_id = ? AND caregiver_id = ?`,
                    [relationship, view_location || 0, view_medications || 1, receive_alerts || 1,
                     inviteToken, req.user.id, caregiverUser.id]
                );

                const [patientRows] = await db.execute('SELECT name FROM users WHERE id = ?', [req.user.id]);
                await emailSenderService.sendCaregiverAddedNotification(email, name, patientRows[0]?.name || 'A patient', inviteToken);
            } else {
                // Existing caregiver account, never linked to this patient before.
                // Do not auto-link — send an Accept Invitation link; the
                // relationship only becomes ACTIVE once they click it.
                const inviteToken = generateInviteToken();
                await CaregiverAssignment.create({
                    patient_id: req.user.id,
                    caregiver_id: caregiverUser.id,
                    relationship,
                    status: 'PENDING',
                    view_location, view_medications, receive_alerts,
                    invite_token: inviteToken,
                });

                const [patientRows] = await db.execute('SELECT name FROM users WHERE id = ?', [req.user.id]);
                await emailSenderService.sendCaregiverAddedNotification(email, name, patientRows[0]?.name || 'A patient', inviteToken);
            }

            return res.status(201).json({
                success: true,
                message: 'Caregiver invited successfully. They will see this patient once they accept the invitation by email.',
                caregiverId: caregiverUser.id,
                isPatient
            });
        }

        // Brand-new caregiver: the temp password sent by email IS the real
        // users.password from the start — no separate credential is ever
        // stored, per the "no persistent login outside users.password" rule.
        const tempPassword = generateTempPassword();
        const hashedPassword = await bcrypt.hash(tempPassword, 10);

        const [userResult] = await db.execute(
            "INSERT INTO users (name, email, password, phone, role, is_verified) VALUES (?, ?, ?, NULL, 'caregiver', 1)",
            [name, email, hashedPassword]
        );
        const newCaregiverId = userResult.insertId;
        await Caregiver.create(newCaregiverId);

        await CaregiverAssignment.create({
            patient_id: req.user.id,
            caregiver_id: newCaregiverId,
            relationship,
            status: 'PENDING',
            view_location, view_medications, receive_alerts,
        });

        await emailSenderService.sendCaregiverInvitation(email, name, tempPassword);

        res.status(201).json({
            success: true,
            message: 'Caregiver invitation sent successfully',
            caregiverId: newCaregiverId,
            isPatient
        });

    } catch (error) {
        console.error('Add Caregiver Error:', error);

        if (error.code === 'ER_DUP_ENTRY') {
            return res.status(400).json({
                success: false,
                message: 'This caregiver is already linked to your account'
            });
        }

        res.status(500).json({ success: false, message: 'Error adding caregiver' });
    }
};

exports.removeCaregiver = async (req, res) => {
    try {
        const { id } = req.params; // caregiver_id

        const result = await CaregiverAssignment.revoke(req.user.id, id);

        if (result.affectedRows === 0) {
            return res.status(404).json({ success: false, message: 'Caregiver not found' });
        }

        res.json({
            success: true,
            message: 'Caregiver removed successfully. You can add them again anytime.'
        });
    } catch (error) {
        console.error('Remove Caregiver Error:', error);
        res.status(500).json({ success: false, message: 'Error removing caregiver' });
    }
};

exports.updateCaregiverStatus = async (req, res) => {
    try {
        const { id } = req.params; // caregiver_id
        const { status } = req.body;

        if (!['PENDING', 'ACTIVE', 'REVOKED'].includes(status)) {
            return res.status(400).json({ success: false, message: 'Invalid status' });
        }

        const result = await CaregiverAssignment.updateStatus(req.user.id, id, status);

        if (result.affectedRows === 0) {
            return res.status(404).json({ success: false, message: 'Caregiver not found' });
        }

        res.json({
            success: true,
            message: 'Caregiver status updated'
        });
    } catch (error) {
        console.error('Update Caregiver Status Error:', error);
        res.status(500).json({ success: false, message: 'Error updating caregiver status' });
    }
};

// GET /caregivers/confirm-invite?token=... — PUBLIC ROUTE, opened by clicking
// "Accept Invitation" in the email sent when an EXISTING caregiver account is
// invited by a new patient. Activates only that one assignment. Renders HTML
// directly (same pattern as auth/verify-email) — no app interaction needed.
exports.confirmAssignmentInvite = async (req, res) => {
    const errorPage = (msg) => res.status(400).send(`
        <html><body style="font-family:Arial;text-align:center;padding:50px;">
            <h2 style="color:red;">❌ ${msg}</h2>
        </body></html>
    `);

    try {
        const { token } = req.query;
        if (!token) return errorPage('Invitation link is invalid.');

        const [rows] = await db.execute(
            `SELECT ca.id, ca.status, ca.expires_at, u.name AS caregiver_name, pu.name AS patient_name
             FROM caregiver_assignment ca
             JOIN users u ON u.id = ca.caregiver_id
             JOIN users pu ON pu.id = ca.patient_id
             WHERE ca.invite_token = ?`,
            [token]
        );

        if (rows.length === 0) {
            return errorPage('This invitation link is invalid or has already been used.');
        }

        const assignment = rows[0];

        if (assignment.status !== 'PENDING') {
            return res.send(`
                <html><body style="font-family:Arial;text-align:center;padding:50px;">
                    <h2 style="color:#007AFF;">✅ Already confirmed</h2>
                    <p>This invitation was already accepted.</p>
                </body></html>
            `);
        }

        if (assignment.expires_at && new Date(assignment.expires_at) < new Date()) {
            return errorPage('This invitation has expired. Ask the patient to invite you again.');
        }

        await db.execute(
            "UPDATE caregiver_assignment SET status = 'ACTIVE', invite_token = NULL WHERE id = ?",
            [assignment.id]
        );

        return res.send(`
            <html><body style="font-family:Arial;text-align:center;padding:50px;background:#f5f5f5;">
                <div style="background:white;max-width:500px;margin:0 auto;padding:40px;border-radius:12px;box-shadow:0 2px 10px rgba(0,0,0,0.1);">
                    <div style="font-size:48px;">✅</div>
                    <h2 style="color:#22C55E;">Invitation accepted!</h2>
                    <p style="color:#666;">Hello ${assignment.caregiver_name}, you are now supervising
                       <strong>${assignment.patient_name}</strong>. Open the MediCare app and log in to see them on your dashboard.</p>
                </div>
            </body></html>
        `);

    } catch (error) {
        console.error('Confirm Assignment Invite Error:', error);
        return errorPage('Something went wrong. Please try again later.');
    }
};

// GET /caregivers/profile
exports.getProfile = async (req, res) => {
    try {
        const [rows] = await db.execute(
            'SELECT id, email, name, created_at FROM users WHERE id = ? AND role = \'caregiver\'',
            [req.user.id]
        );
        if (rows.length === 0) {
            return res.status(404).json({ success: false, message: 'Profile not found' });
        }
        res.json({ success: true, profile: rows[0] });
    } catch (error) {
        console.error('getProfile error:', error);
        res.status(500).json({ success: false, message: 'Error fetching profile' });
    }
};

// PUT /caregivers/profile
exports.updateProfile = async (req, res) => {
    try {
        const { name } = req.body;
        if (!name || name.trim() === '') {
            return res.status(400).json({ success: false, message: 'Name is required' });
        }
        await db.execute(
            'UPDATE users SET name = ? WHERE id = ? AND role = \'caregiver\'',
            [name.trim(), req.user.id]
        );
        res.json({ success: true, message: 'Profile updated successfully' });
    } catch (error) {
        console.error('updateProfile error:', error);
        res.status(500).json({ success: false, message: 'Error updating profile' });
    }
};

// PUT /caregivers/password
exports.changePassword = async (req, res) => {
    try {
        const { currentPassword, newPassword } = req.body;

        if (!currentPassword || !newPassword) {
            return res.status(400).json({ success: false, message: 'Both passwords are required' });
        }
        const passwordValidation = RegisterRequest.isValidPassword(newPassword);
        if (!passwordValidation.valid) {
            return res.status(400).json({ success: false, message: passwordValidation.message });
        }

        const [rows] = await db.execute(
            'SELECT password FROM users WHERE id = ? AND role = \'caregiver\'',
            [req.user.id]
        );
        if (rows.length === 0) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        const isValid = await bcrypt.compare(currentPassword, rows[0].password);
        if (!isValid) {
            return res.status(401).json({ success: false, message: 'Current password is incorrect' });
        }

        const hashed = await bcrypt.hash(newPassword, 10);
        await db.execute(
            'UPDATE users SET password = ? WHERE id = ? AND role = \'caregiver\'',
            [hashed, req.user.id]
        );

        res.json({ success: true, message: 'Password changed successfully' });
    } catch (error) {
        console.error('changePassword error:', error);
        res.status(500).json({ success: false, message: 'Error changing password' });
    }
};

// Get patients for logged-in caregiver
exports.getPatientsForCaregiver = async (req, res) => {
    try {
        const caregiverId = req.user.id;

        const [patients] = await db.execute(
            `SELECT
                p.id,
                u.name,
                u.email,
                u.phone,
                u.created_at,
                ca.relationship,
                ca.view_location,
                ca.view_medications,
                ca.receive_alerts,
                (SELECT COUNT(*) FROM treatments WHERE patient_id = p.id AND is_active = 1) as medication_count,
                (SELECT ROUND(AVG(CASE WHEN ms.status = 'TAKEN' THEN 100 ELSE 0 END), 1)
                 FROM medication_schedules ms
                 WHERE ms.patient_id = p.id AND ms.scheduled_date_time > DATE_SUB(NOW(), INTERVAL 30 DAY)) as adherence_rate,
                (SELECT current_streak FROM patient_streaks WHERE patient_id = p.id) as current_streak,
                (SELECT COUNT(*) FROM medication_schedules
                 WHERE patient_id = p.id AND status = 'MISSED'
                 AND scheduled_date_time > DATE_SUB(NOW(), INTERVAL 7 DAY)) as missed_doses,
                (SELECT JSON_OBJECT('name', t.medication_name, 'time', DATE_FORMAT(ms.scheduled_date_time, '%H:%i'))
                 FROM medication_schedules ms
                 JOIN treatments t ON ms.treatment_id = t.id
                 WHERE ms.patient_id = p.id
                 AND ms.status = 'SCHEDULED'
                 AND ms.scheduled_date_time > NOW()
                 ORDER BY ms.scheduled_date_time ASC
                 LIMIT 1) as next_medication,
                (SELECT DATE_FORMAT(ms.scheduled_date_time, '%H:%i')
                 FROM medication_schedules ms
                 WHERE ms.patient_id = p.id
                 AND ms.status = 'SCHEDULED'
                 AND ms.scheduled_date_time > NOW()
                 ORDER BY ms.scheduled_date_time ASC
                 LIMIT 1) as next_medication_time,
                (SELECT TIMESTAMPDIFF(HOUR, MAX(ms.taken_time), NOW())
                 FROM medication_schedules ms
                 WHERE ms.patient_id = p.id AND ms.status = 'TAKEN') as last_active_hours
             FROM caregiver_assignment ca
             JOIN patients p ON ca.patient_id = p.id
             JOIN users u ON p.id = u.id
             WHERE ca.caregiver_id = ? AND ca.status = 'ACTIVE'`,
            [caregiverId]
        );

        const processedPatients = [];

        for (const patient of patients) {
            let lastActive = 'Recently';
            if (patient.last_active_hours !== null) {
                const hours = patient.last_active_hours;
                if (hours < 1) {
                    lastActive = '< 1 hour ago';
                } else if (hours < 24) {
                    lastActive = `${hours} hour${hours > 1 ? 's' : ''} ago`;
                } else {
                    const days = Math.floor(hours / 24);
                    lastActive = `${days} day${days > 1 ? 's' : ''} ago`;
                }
            }

            let nextMedicationName = null;
            if (patient.next_medication) {
                try {
                    const nextMed = typeof patient.next_medication === 'string'
                        ? JSON.parse(patient.next_medication)
                        : patient.next_medication;
                    nextMedicationName = nextMed.name;
                } catch(e) {
                    nextMedicationName = null;
                }
            }

            processedPatients.push({
                id: patient.id,
                name: patient.name,
                email: patient.email,
                phone: patient.phone,
                relationship: patient.relationship,
                view_location: patient.view_location === 1,
                view_medications: patient.view_medications === 1,
                receive_alerts: patient.receive_alerts === 1,
                medication_count: patient.medication_count || 0,
                adherence_rate: Math.round(patient.adherence_rate || 0),
                current_streak: patient.current_streak || 0,
                missed_doses: patient.missed_doses || 0,
                next_medication: nextMedicationName,
                next_medication_time: patient.next_medication_time,
                last_active: lastActive,
                created_at: patient.created_at
            });
        }

        res.json({
            success: true,
            patients: processedPatients
        });

    } catch (error) {
        console.error('Get Patients Error:', error);
        res.status(500).json({ success: false, message: 'Error fetching patients' });
    }
};

// DELETE /caregivers/unfollow/:patientId
exports.unfollowPatient = async (req, res) => {
    try {
        const { patientId } = req.params;

        const result = await CaregiverAssignment.revoke(patientId, req.user.id);

        if (result.affectedRows === 0) {
            return res.status(404).json({ success: false, message: 'Patient not found' });
        }

        res.json({ success: true, message: 'You are no longer supervising this patient' });
    } catch (error) {
        console.error('unfollowPatient error:', error);
        res.status(500).json({ success: false, message: 'Error unfollowing patient' });
    }
};

// Get detailed information for a specific patient
exports.getPatientDetails = async (req, res) => {
    try {
        const caregiverId = req.user.id;
        const patientId = req.params.id;

        const [accessCheck] = await db.execute(
            "SELECT * FROM caregiver_assignment WHERE caregiver_id = ? AND patient_id = ? AND status = 'ACTIVE'",
            [caregiverId, patientId]
        );

        if (accessCheck.length === 0) {
            return res.status(403).json({
                success: false,
                message: 'You do not have access to this patient'
            });
        }

        const permissions = accessCheck[0];

        const [patients] = await db.execute(
            `SELECT p.id, u.name, u.email, u.phone, u.created_at,
                    p.chifa_card_registration_number, p.date_of_birth,
                    (SELECT COUNT(*) FROM treatments WHERE patient_id = p.id AND is_active = 1) as medication_count,
                    (SELECT ROUND(AVG(CASE WHEN ms.status = 'TAKEN' THEN 100 ELSE 0 END), 1)
                     FROM medication_schedules ms
                     WHERE ms.patient_id = p.id AND ms.scheduled_date_time > DATE_SUB(NOW(), INTERVAL 30 DAY)) as adherence_rate,
                    (SELECT current_streak FROM patient_streaks WHERE patient_id = p.id) as current_streak,
                    (SELECT COUNT(*) FROM medication_schedules
                     WHERE patient_id = p.id AND status = 'MISSED'
                     AND scheduled_date_time > DATE_SUB(NOW(), INTERVAL 7 DAY)) as missed_doses
             FROM patients p
             JOIN users u ON p.id = u.id
             WHERE p.id = ?`,
            [patientId]
        );

        if (patients.length === 0) {
            return res.status(404).json({ success: false, message: 'Patient not found' });
        }

        const patient = patients[0];

        const [lastActiveResult] = await db.execute(
            `SELECT TIMESTAMPDIFF(HOUR, MAX(ms.taken_time), NOW()) as hours
             FROM medication_schedules ms
             WHERE ms.patient_id = ? AND ms.status = 'TAKEN'`,
            [patientId]
        );

        let lastActive = 'Recently';
        if (lastActiveResult[0]?.hours !== null) {
            const hours = lastActiveResult[0].hours;
            if (hours < 1) {
                lastActive = '< 1 hour ago';
            } else if (hours < 24) {
                lastActive = `${hours} hour${hours > 1 ? 's' : ''} ago`;
            } else {
                const days = Math.floor(hours / 24);
                lastActive = `${days} day${days > 1 ? 's' : ''} ago`;
            }
        }

        let todayMedications = [];
        if (permissions.view_medications) {
            const [medications] = await db.execute(
                `SELECT
                    t.medication_name as name,
                    t.dosage,
                    DATE_FORMAT(ms.scheduled_date_time, '%H:%i') as time,
                    CASE
                        WHEN ms.status = 'TAKEN' THEN 'taken'
                        WHEN ms.status = 'MISSED' THEN 'missed'
                        ELSE 'pending'
                    END as status
                 FROM medication_schedules ms
                 JOIN treatments t ON ms.treatment_id = t.id
                 WHERE ms.patient_id = ?
                 AND DATE(ms.scheduled_date_time) = CURDATE()
                 ORDER BY ms.scheduled_date_time ASC`,
                [patientId]
            );
            todayMedications = medications;
        }

        let recentAlerts = [];
        if (permissions.receive_alerts) {
            const [alerts] = await db.execute(
                `SELECT
                    title,
                    message,
                    DATE_FORMAT(created_at, '%H:%i') as time,
                    DATE(created_at) as date
                 FROM notifications
                 WHERE patient_id = ?
                 ORDER BY created_at DESC
                 LIMIT 3`,
                [patientId]
            );
            recentAlerts = alerts;
        }

        let location = null;
        if (permissions.view_location) {
            const [patientLocation] = await db.execute(
                `SELECT location_sharing_enabled, last_latitude, last_longitude,
                        last_location_address, last_location_timestamp
                 FROM patients WHERE id = ?`,
                [patientId]
            );

            if (patientLocation[0]?.location_sharing_enabled && patientLocation[0]?.last_latitude) {
                let timeAgo = 'Never';
                if (patientLocation[0].last_location_timestamp) {
                    const minutes = Math.floor((new Date() - new Date(patientLocation[0].last_location_timestamp)) / 60000);
                    if (minutes < 1) timeAgo = 'Just now';
                    else if (minutes < 60) timeAgo = `${minutes} min ago`;
                    else if (minutes < 1440) timeAgo = `${Math.floor(minutes / 60)} hours ago`;
                    else timeAgo = `${Math.floor(minutes / 1440)} days ago`;
                }

                location = {
                    enabled: true,
                    lat: parseFloat(patientLocation[0].last_latitude),
                    lng: parseFloat(patientLocation[0].last_longitude),
                    address: patientLocation[0].last_location_address || 'Location available',
                    last_updated: patientLocation[0].last_location_timestamp,
                    time_ago: timeAgo
                };
            } else {
                location = {
                    enabled: true,
                    address: 'Location sharing is enabled but no data yet. Patient needs to open the app.',
                    last_updated: null
                };
            }
        }

        res.json({
            success: true,
            patient: {
                id: patient.id,
                name: patient.name,
                email: patient.email,
                adherence_rate: Math.round(patient.adherence_rate || 0),
                missed_doses: patient.missed_doses || 0,
                current_streak: patient.current_streak || 0,
                medication_count: patient.medication_count || 0,
                last_active: lastActive,
                location_enabled: permissions.view_location === 1,
                medications_enabled: permissions.view_medications === 1,
                alerts_enabled: permissions.receive_alerts === 1,
                relationship: permissions.relationship
            },
            today_medications: todayMedications,
            recent_alerts: recentAlerts,
            location: location
        });

    } catch (error) {
        console.error('Get Patient Details Error:', error);
        res.status(500).json({ success: false, message: 'Error fetching patient details' });
    }
};

const CaregiverNotificationService = require('../services/caregiverNotificationService');

// GET /caregivers/notifications
exports.getNotifications = async (req, res) => {
    try {
        const result = await CaregiverNotificationService.getForCaregiver(req.user.id);
        res.json({
            success: true,
            notifications: Array.isArray(result.notifications) ? result.notifications : [],
            unreadCount: result.unreadCount || 0
        });
    } catch (error) {
        console.error('getNotifications error:', error);
        res.status(500).json({ success: false, message: 'Error fetching notifications' });
    }
};

// PUT /caregivers/notifications/read/:id
exports.markNotificationRead = async (req, res) => {
    try {
        const { id } = req.params;
        await db.execute(
            'UPDATE caregiver_notifications SET is_read = 1 WHERE id = ? AND caregiver_id = ?',
            [id, req.user.id]
        );
        res.json({ success: true });
    } catch (error) {
        console.error('markNotificationRead error:', error);
        res.status(500).json({ success: false });
    }
};

// GET /caregivers/notifications/count
exports.getNotificationCount = async (req, res) => {
    try {
        const count = await CaregiverNotificationService.getUnreadCount(req.user.id);
        res.json({ success: true, count });
    } catch (error) {
        res.status(500).json({ success: false, count: 0 });
    }
};

// POST /caregivers/remind/:patientId
exports.sendReminder = async (req, res) => {
    try {
        const caregiverId = req.user.id;
        const { patientId } = req.params;

        const [access] = await db.execute(
            `SELECT ca.*, u.name AS caregiver_name
             FROM caregiver_assignment ca
             JOIN users u ON u.id = ca.caregiver_id
             WHERE ca.caregiver_id = ? AND ca.patient_id = ? AND ca.status = 'ACTIVE'`,
            [caregiverId, patientId]
        );

        if (access.length === 0) {
            return res.status(403).json({ success: false, message: 'No access to this patient' });
        }

        const caregiverName = access[0].caregiver_name || 'Your caregiver';

        const [[patient]] = await db.execute(
            `SELECT p.fcm_token, u.name AS patient_name
             FROM patients p
             JOIN users u ON p.id = u.id
             WHERE p.id = ?`,
            [patientId]
        );

        if (!patient?.fcm_token) {
            return res.status(400).json({ success: false, message: 'Patient has no FCM token' });
        }

        const FirebaseService = require('../services/firebaseService');
        await FirebaseService.sendPushNotification(
            patient.fcm_token,
            `💊 Reminder from ${caregiverName}`,
            `${caregiverName} is checking on you. Please don't forget to take your medication!`,
            { type: 'caregiver_reminder' },
            false
        );

        await db.execute(
            `INSERT INTO notifications (patient_id, type, title, message, data)
             VALUES (?, 'reminder', ?, ?, ?)`,
            [
                patientId,
                `💊 Reminder from ${caregiverName}`,
                `${caregiverName} is checking on you. Please don't forget to take your medication!`,
                JSON.stringify({ type: 'caregiver_reminder', caregiver: caregiverName })
            ]
        );

        console.log(`[Caregiver] 💬 Reminder sent from caregiver ${caregiverId} to patient ${patientId}`);
        res.json({ success: true, message: 'Reminder sent successfully' });

    } catch (error) {
        console.error('sendReminder error:', error);
        res.status(500).json({ success: false, message: 'Error sending reminder' });
    }
};
