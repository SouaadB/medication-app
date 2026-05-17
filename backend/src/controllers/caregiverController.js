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
            location = {
                enabled: true,
                address: 'Location sharing enabled - Last seen: ' + lastActive,
                last_updated: new Date().toISOString()
            };
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