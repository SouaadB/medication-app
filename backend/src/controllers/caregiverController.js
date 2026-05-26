const Caregiver = require('../models/Caregiver');
const emailSenderService = require('../services/emailSenderService');
const db = require('../config/database');
const bcrypt = require('bcryptjs');

exports.getCaregivers = async (req, res) => {
    try {
        const caregivers = await Caregiver.findByPatientId(req.user.id);
        res.json({
            success: true,
            count: caregivers.length,
            caregivers
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

        const result = await Caregiver.create({
            patient_id: req.user.id,
            name,
            relationship,
            email,
            view_location,
            view_medications,
            receive_alerts
        });

        const emailSent = await emailSenderService.sendCaregiverInvitation(email, name, result.tempPassword);

        res.status(201).json({
            success: true,
            message: emailSent ? 'Caregiver invitation sent successfully' : 'Caregiver added but email failed to send',
            caregiverId: result.insertId
        });
    } catch (error) {
        console.error('Add Caregiver Error:', error);
        res.status(500).json({ success: false, message: 'Error adding caregiver' });
    }
};

exports.removeCaregiver = async (req, res) => {
    try {
        const { id } = req.params;
        const result = await Caregiver.delete(id, req.user.id);

        if (result.affectedRows === 0) {
            return res.status(404).json({ success: false, message: 'Caregiver not found' });
        }

        res.json({
            success: true,
            message: 'Caregiver removed successfully'
        });
    } catch (error) {
        console.error('Remove Caregiver Error:', error);
        res.status(500).json({ success: false, message: 'Error removing caregiver' });
    }
};

exports.updateCaregiverStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        if (!['PENDING', 'ACTIVE', 'REVOKED'].includes(status)) {
            return res.status(400).json({ success: false, message: 'Invalid status' });
        }

        const result = await Caregiver.updateStatus(id, req.user.id, status);

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

// Accept caregiver invitation (creates user account) - PUBLIC ROUTE
exports.acceptInvitation = async (req, res) => {
    try {
        const { email, password } = req.body;
        
        console.log('📧 Accept invitation request for email:', email);
        
        if (!email || !password) {
            return res.status(400).json({ success: false, message: 'Email and password required' });
        }
        
        const [invitations] = await db.execute(
            'SELECT * FROM caregivers WHERE email = ? AND status = "PENDING" AND expires_at > NOW()',
            [email]
        );
        
        if (invitations.length === 0) {
            return res.status(404).json({ 
                success: false, 
                message: 'No pending invitation found. The invitation may have expired.' 
            });
        }
        
        const invitation = invitations[0];
        
        const isValid = await bcrypt.compare(password, invitation.temp_password);
        if (!isValid) {
            return res.status(401).json({ 
                success: false, 
                message: 'Invalid password' 
            });
        }
        
        const [existingUser] = await db.execute(
            'SELECT id FROM caregiver_users WHERE email = ?',
            [email]
        );
        
        if (existingUser.length === 0) {
            await db.execute(
                'INSERT INTO caregiver_users (email, name, password) VALUES (?, ?, ?)',
                [email, invitation.name, invitation.temp_password]
            );
            console.log('✅ Caregiver user created for:', email);
        }
        
        await db.execute(
            'UPDATE caregivers SET status = "ACTIVE" WHERE id = ?',
            [invitation.id]
        );
        
        console.log('✅ Invitation accepted for:', email);
        
        res.json({ 
            success: true, 
            message: 'Invitation accepted! You can now login as caregiver.'
        });
        
    } catch (error) {
        console.error('Accept Invitation Error:', error);
        res.status(500).json({ success: false, message: 'Error accepting invitation' });
    }
};
 // ── ADD THESE 3 FUNCTIONS to caregiverController.js ──────────────────────────
 

 
// GET /caregivers/profile
exports.getProfile = async (req, res) => {
    try {
        const caregiverEmail = req.user.email;
        const [rows] = await db.execute(
            'SELECT id, email, name, created_at FROM caregiver_users WHERE email = ?',
            [caregiverEmail]
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
        const caregiverEmail = req.user.email;
        const { name } = req.body;
        if (!name || name.trim() === '') {
            return res.status(400).json({ success: false, message: 'Name is required' });
        }
        await db.execute(
            'UPDATE caregiver_users SET name = ? WHERE email = ?',
            [name.trim(), caregiverEmail]
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
        const caregiverEmail = req.user.email;
        const { currentPassword, newPassword } = req.body;
 
        if (!currentPassword || !newPassword) {
            return res.status(400).json({ success: false, message: 'Both passwords are required' });
        }
        if (newPassword.length < 6) {
            return res.status(400).json({ success: false, message: 'New password must be at least 6 characters' });
        }
 
        // Get current hashed password
        const [rows] = await db.execute(
            'SELECT password FROM caregiver_users WHERE email = ?',
            [caregiverEmail]
        );
        if (rows.length === 0) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }
 
        // Verify current password
        const isValid = await bcrypt.compare(currentPassword, rows[0].password);
        if (!isValid) {
            return res.status(401).json({ success: false, message: 'Current password is incorrect' });
        }
 
        // Hash and save new password
        const hashed = await bcrypt.hash(newPassword, 10);
        await db.execute(
            'UPDATE caregiver_users SET password = ? WHERE email = ?',
            [hashed, caregiverEmail]
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
        const caregiverEmail = req.user.email;
        
        console.log('========================================');
        console.log('🔍 Caregiver Email:', caregiverEmail);
        
        const [patients] = await db.execute(
            `SELECT 
                p.id, 
                u.name, 
                u.email, 
                u.phone,
                u.created_at,
                c.relationship,
                c.view_location, 
                c.view_medications, 
                c.receive_alerts,
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
             FROM caregivers c
             JOIN patients p ON c.patient_id = p.id
             JOIN users u ON p.id = u.id
             WHERE c.email = ? AND c.status = 'ACTIVE'`,
            [caregiverEmail]
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
        
        console.log(`📊 Found ${processedPatients.length} patients`);
        console.log('========================================');
        
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
        const caregiverEmail = req.user.email;
        const { patientId }  = req.params;

        const [result] = await db.execute(
            'DELETE FROM caregivers WHERE email = ? AND patient_id = ?',
            [caregiverEmail, patientId]
        );

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
        const caregiverEmail = req.user.email;
        const patientId = req.params.id;
        
        console.log('🔍 Getting patient details for ID:', patientId);
        
        const [accessCheck] = await db.execute(
            'SELECT * FROM caregivers WHERE email = ? AND patient_id = ? AND status = "ACTIVE"',
            [caregiverEmail, patientId]
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
                    p.chifa_card_registration_number, p.date_of_birth, p.age,
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
        
        // Get today's medications
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
        
        // Get recent alerts (last 3)
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
        const result = await CaregiverNotificationService.getForCaregiver(req.user.email);
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
            'UPDATE caregiver_notifications SET is_read = 1 WHERE id = ? AND caregiver_email = ?',
            [id, req.user.email]
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
        const count = await CaregiverNotificationService.getUnreadCount(req.user.email);
        res.json({ success: true, count });
    } catch (error) {
        res.status(500).json({ success: false, count: 0 });
    }
};
// POST /caregivers/remind/:patientId
exports.sendReminder = async (req, res) => {
    try {
        const caregiverEmail = req.user.email;
        const { patientId }  = req.params;

        // Check caregiver has access to this patient
const [access] = await db.execute(
    `SELECT c.*, cu.name AS caregiver_name 
     FROM caregivers c 
     JOIN caregiver_users cu ON c.email = cu.email
     WHERE c.email = ? AND c.patient_id = ? AND c.status = 'ACTIVE'`,
    [caregiverEmail, patientId]
);

        if (access.length === 0) {
            return res.status(403).json({ success: false, message: 'No access to this patient' });
        }

        const caregiverName = access[0].caregiver_name || 'Your caregiver';

        // Get patient FCM token
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

        // Send Firebase push to patient
        const FirebaseService = require('../services/firebaseService');
        await FirebaseService.sendPushNotification(
            patient.fcm_token,
            `💊 Reminder from ${caregiverName}`,
            `${caregiverName} is checking on you. Please don't forget to take your medication!`,
            { type: 'caregiver_reminder' },
            false
        );

        // Also create a notification in patient's notifications table
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

        console.log(`[Caregiver] 💬 Reminder sent from ${caregiverEmail} to patient ${patientId}`);
        res.json({ success: true, message: 'Reminder sent successfully' });

    } catch (error) {
        console.error('sendReminder error:', error);
        res.status(500).json({ success: false, message: 'Error sending reminder' });
    }
};