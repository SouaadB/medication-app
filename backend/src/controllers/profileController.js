const User = require('../models/User');
const Patient = require('../models/Patient');
const Admin = require('../models/Admin');
const RegisterRequest = require('../dto/RegisterRequest');
const bcrypt = require('bcryptjs');

const db              = require('../config/database');
const SchedulerService = require('../services/schedulerService');

// Récupérer le profil complet
exports.getProfile = async (req, res) => {
    try {
        const userId = req.user.id;
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'Utilisateur non trouvé'
            });
        }

        let patientData = null;
        if (user.role === 'patient') {
            patientData = await Patient.findByUserId(userId);
            if (patientData && patientData.date_of_birth) {
                const date = new Date(patientData.date_of_birth);
                const day = String(date.getDate()).padStart(2, '0');
                const month = String(date.getMonth() + 1).padStart(2, '0');
                const year = date.getFullYear();
                patientData.date_of_birth_formatted = `${day}-${month}-${year}`;
            }

            const conditions = await Patient.getPatientConditions(userId);
            patientData.conditions = conditions;
        }

        res.json({
            success: true,
            profile: {
                id: user.id,
                name: user.name,
                email: user.email,
                phone: user.phone,
                role: user.role,
                ...patientData
            }
        });
    } catch (error) {
        console.error('Erreur getProfile:', error);
        res.status(500).json({
            success: false,
            message: 'Erreur lors de la récupération du profil'
        });
    }
};

// Setup profile for patient
exports.setupPatientProfile = async (req, res) => {
    try {
        const userId = req.user.id;
        const { age, conditions } = req.body;

        if (!age || !conditions) {
            return res.status(400).json({
                success: false,
                message: 'L\'âge et les conditions sont requis'
            });
        }

        await Patient.setupProfile(userId, { age, conditions });

        res.json({
            success: true,
            message: 'Profil configuré avec succès'
        });
    } catch (error) {
        console.error('Erreur setupPatientProfile:', error);
        res.status(500).json({
            success: false,
            message: 'Erreur lors de la configuration du profil'
        });
    }
};

// Mettre à jour le profil
exports.updateProfile = async (req, res) => {
    try {
        const userId = req.user.id;
        const { name, phone, chifaCardRegistrationNumber, dateOfBirth, smartphoneSkillLevel } = req.body;

        const user = await User.findById(userId);
        if (!user) return res.status(404).json({ success: false, message: 'Utilisateur non trouvé' });

        // Update users table
        const updateFields = [];
        const updateValues = [];
        if (name) { updateFields.push('name = ?'); updateValues.push(name); }
        if (phone) { updateFields.push('phone = ?'); updateValues.push(phone); }
        if (updateFields.length > 0) {
            await db.execute(`UPDATE users SET ${updateFields.join(', ')} WHERE id = ?`, [...updateValues, userId]);
        }

        // Update patients table
        if (user.role === 'patient') {
            const pFields = [];
            const pValues = [];

            if (chifaCardRegistrationNumber) {
                if (!RegisterRequest.isValidChifaNumber(chifaCardRegistrationNumber)) {
                    return res.status(400).json({ success: false, message: 'Le numéro CHIFA doit contenir exactement 9 chiffres' });
                }
                pFields.push('chifa_card_registration_number = ?');
                pValues.push(chifaCardRegistrationNumber);
            }
            if (dateOfBirth) {
                if (!RegisterRequest.isValidDateFormat(dateOfBirth)) {
                    return res.status(400).json({ success: false, message: 'Format de date invalide (JJ-MM-AAAA)' });
                }
                pFields.push('date_of_birth = ?');
                pValues.push(RegisterRequest.convertToMySQLDate(dateOfBirth));
            }
            if (smartphoneSkillLevel) {
                if (!RegisterRequest.isValidSkillLevel(smartphoneSkillLevel)) {
                    return res.status(400).json({ success: false, message: 'Le niveau doit être BASIC, INTERMEDIATE ou ADVANCED' });
                }
                pFields.push('smartphone_skill_level = ?');
                pValues.push(smartphoneSkillLevel.toUpperCase());
            }
            if (pFields.length > 0) {
                await db.execute(`UPDATE patients SET ${pFields.join(', ')} WHERE id = ?`, [...pValues, userId]);
            }
        }

        const updated = await User.findById(userId);
        let updatedPatient = null;
        if (user.role === 'patient') {
            updatedPatient = await Patient.findByUserId(userId);
            if (updatedPatient?.date_of_birth) {
                const d = new Date(updatedPatient.date_of_birth);
                updatedPatient.date_of_birth_formatted =
                    `${String(d.getDate()).padStart(2, '0')}-${String(d.getMonth() + 1).padStart(2, '0')}-${d.getFullYear()}`;
            }
        }

        res.json({
            success: true,
            message: 'Profil mis à jour avec succès',
            profile: {
                id: updated.id,
                name: updated.name,
                email: updated.email,
                phone: updated.phone,
                role: updated.role,
                ...updatedPatient
            }
        });
    } catch (error) {
        console.error('Erreur updateProfile:', error);
        res.status(500).json({ success: false, message: 'Erreur lors de la mise à jour du profil', error: error.message });
    }
};

// Récupérer toutes les conditions disponibles
exports.getAllChronicConditions = async (req, res) => {
    try {
        const conditions = await Patient.getAllConditions();
        res.json({
            success: true,
            conditions
        });
    } catch (error) {
        console.error('Erreur getAllChronicConditions:', error);
        res.status(500).json({
            success: false,
            message: 'Erreur lors de la récupération des maladies chroniques'
        });
    }
};

// Changer le mot de passe (patient/admin)
exports.changePassword = async (req, res) => {
    try {
        const userId = req.user.id;
        const { currentPassword, newPassword } = req.body;

        if (!currentPassword || !newPassword) {
            return res.status(400).json({ success: false, message: 'Mot de passe actuel et nouveau mot de passe requis' });
        }

        const validation = RegisterRequest.isValidPassword(newPassword);
        if (!validation.valid) return res.status(400).json({ success: false, message: validation.message });

        const [users] = await db.execute('SELECT * FROM users WHERE id = ?', [userId]);
        if (users.length === 0) return res.status(404).json({ success: false, message: 'Utilisateur non trouvé' });

        const isValid = await bcrypt.compare(currentPassword, users[0].password);
        if (!isValid) return res.status(401).json({ success: false, message: 'Mot de passe actuel incorrect' });

        const salt = await bcrypt.genSalt(10);
        const hashed = await bcrypt.hash(newPassword, salt);
        await db.execute('UPDATE users SET password = ? WHERE id = ?', [hashed, userId]);

        res.json({ success: true, message: 'Mot de passe modifié avec succès' });
    } catch (error) {
        console.error('Erreur changePassword:', error);
        res.status(500).json({ success: false, message: 'Erreur lors du changement de mot de passe' });
    }
};

// Update patient settings
exports.updateSettings = async (req, res) => {
    try {
        const userId = req.user.id;
        const settings = req.body;

        const allowedFields = [
            'all_notifications', 'medication_reminders', 'adherence_alerts',
            'smart_insights', 'sound_enabled', 'vibration_enabled',
            'dark_mode', 'auto_refill_reminders',
            'quiet_hours_enabled', 'quiet_hours_start', 'quiet_hours_end',
            'quiet_hours_days', 'critical_alerts_enabled',
        ];

        const updates = [];
        const values = [];
        for (const field of allowedFields) {
            if (settings[field] !== undefined) {
                updates.push(`${field} = ?`);
                values.push(settings[field]);
            }
        }

        if (updates.length === 0) {
            return res.status(400).json({ success: false, message: 'No settings to update' });
        }

        values.push(userId);
        await db.execute(`UPDATE patients SET ${updates.join(', ')} WHERE id = ?`, values);
        res.json({ success: true, message: 'Settings updated successfully' });
    } catch (error) {
        console.error('Error updateSettings:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

// Update patient daily schedule (legacy)
exports.updateDailySchedule = async (req, res) => {
    try {
        const userId = req.user.id;
        const result = await Patient.updateDailySchedule(userId, req.body);
        if (!result) return res.status(400).json({ success: false, message: 'No valid fields provided' });
        res.json({ success: true, message: 'Planning quotidien mis à jour' });
    } catch (error) {
        console.error('Error updateDailySchedule:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

// Delete patient account
exports.deleteAccount = async (req, res) => {
    try {
        const userId = req.user.id;
        await db.execute('DELETE FROM users WHERE id = ?', [userId]);
        res.json({ success: true, message: 'Account deleted successfully' });
    } catch (error) {
        console.error('Error deleteAccount:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

// ==================== SCHEDULE FUNCTIONS ====================

// GET /profile/schedule
exports.getSchedule = async (req, res) => {
    try {
        const patientId = req.user.id;
        const [rows] = await db.execute(
            `SELECT smart_scheduling_enabled, wake_time, bedtime,
                    breakfast_time, lunch_time, dinner_time
             FROM patients WHERE id = ?`,
            [patientId]
        );
        if (rows.length === 0) return res.status(404).json({ success: false, message: 'Patient not found' });
        res.json({ success: true, schedule: rows[0] });
    } catch (error) {
        console.error('getSchedule error:', error);
        res.status(500).json({ success: false, message: 'Error fetching schedule' });
    }
};

// PATCH /profile/schedule
exports.updateSchedule = async (req, res) => {
    try {
        const patientId = req.user.id;
        const { smart_scheduling_enabled, wake_time, bedtime, breakfast_time, lunch_time, dinner_time } = req.body;

        await db.execute(
            `UPDATE patients SET
                smart_scheduling_enabled = ?,
                wake_time = ?,
                bedtime = ?,
                breakfast_time = ?,
                lunch_time = ?,
                dinner_time = ?
             WHERE id = ?`,
            [
                smart_scheduling_enabled ?? true,
                wake_time || '07:00',
                bedtime || '23:00',
                breakfast_time || '08:00',
                lunch_time || '12:30',
                dinner_time || '18:30',
                patientId,
            ]
        );

     // Regenerate future schedules with new meal times
        try {
            const [treatments] = await db.execute(
                'SELECT id, frequency, start_date, end_date FROM treatments WHERE patient_id = ? AND is_active = 1',
                [patientId]
            );
            for (const t of treatments) {
                await SchedulerService.clearFutureSchedules(t.id);
                await SchedulerService.generateSchedule(
                    patientId, t.id, t.frequency,
                    new Date(), t.end_date || null
                );
            }
            console.log(`[Profile] ♻️ Rescheduled ${treatments.length} treatments after meal time update for patient ${patientId}`);
        } catch (rescheduleErr) {
            console.error('[Profile] Reschedule error (non-fatal):', rescheduleErr.message);
        }

        res.json({ success: true, message: 'Schedule updated successfully' });
    } catch (error) {
        console.error('updateSchedule error:', error);
        res.status(500).json({ success: false, message: 'Error updating schedule' });
    }
};

// ==================== QUIET HOURS FUNCTIONS ====================

// GET /profile/quiet-hours
exports.getQuietHours = async (req, res) => {
    try {
        const patientId = req.user.id;
        const [rows] = await db.execute(
            `SELECT quiet_hours_enabled, quiet_hours_start, quiet_hours_end,
                    quiet_hours_days, critical_alerts_enabled
             FROM patients WHERE id = ?`,
            [patientId]
        );
        if (rows.length === 0) return res.status(404).json({ success: false, message: 'Patient not found' });

        const row = rows[0];
        let quietDays = row.quiet_hours_days;
        if (typeof quietDays === 'string') {
            try { quietDays = JSON.parse(quietDays); } catch (_) { quietDays = []; }
        }

        res.json({
            success: true,
            quietHours: {
                enabled: row.quiet_hours_enabled === 1,
                start: row.quiet_hours_start || '22:00',
                end: row.quiet_hours_end || '07:00',
                days: quietDays || [],
                critical_alerts_enabled: row.critical_alerts_enabled === 1,
            }
        });
    } catch (error) {
        console.error('getQuietHours error:', error);
        res.status(500).json({ success: false, message: 'Error fetching quiet hours' });
    }
};

// PATCH /profile/quiet-hours
exports.updateQuietHours = async (req, res) => {
    try {
        const patientId = req.user.id;
        const { enabled, start, end, days, critical_alerts_enabled } = req.body;

        await db.execute(
            `UPDATE patients SET
                quiet_hours_enabled = ?,
                quiet_hours_start = ?,
                quiet_hours_end = ?,
                quiet_hours_days = ?,
                critical_alerts_enabled = ?
             WHERE id = ?`,
            [
                enabled ? 1 : 0,
                start || '22:00',
                end || '07:00',
                JSON.stringify(days || []),
                critical_alerts_enabled ? 1 : 0,
                patientId,
            ]
        );

        res.json({ success: true, message: 'Quiet hours updated successfully' });
    } catch (error) {
        console.error('updateQuietHours error:', error);
        res.status(500).json({ success: false, message: 'Error updating quiet hours' });
    }
};

// ==================== CAREGIVER FUNCTIONS ====================

// Get caregiver profile
exports.getCaregiverProfile = async (req, res) => {
    try {
        const caregiverEmail = req.user.email;
        console.log('📋 Getting caregiver profile for:', caregiverEmail);
        
        const [caregivers] = await db.execute(
            `SELECT id, name, email, created_at FROM caregiver_users WHERE email = ?`,
            [caregiverEmail]
        );
        
        if (caregivers.length === 0) {
            return res.status(404).json({ success: false, message: 'Caregiver not found' });
        }
        
        const caregiver = caregivers[0];
        res.json({
            success: true,
            profile: {
                id: caregiver.id,
                name: caregiver.name,
                email: caregiver.email,
                role: 'caregiver',
                created_at: caregiver.created_at
            }
        });
    } catch (error) {
        console.error('Get caregiver profile error:', error);
        res.status(500).json({ success: false, message: 'Failed to fetch caregiver profile' });
    }
};

// Update caregiver profile
exports.updateCaregiverProfile = async (req, res) => {
    try {
        const caregiverEmail = req.user.email;
        const { name } = req.body;
        
        if (!name) {
            return res.status(400).json({ success: false, message: 'Name is required' });
        }
        
        await db.execute('UPDATE caregiver_users SET name = ? WHERE email = ?', [name, caregiverEmail]);
        
        res.json({ success: true, message: 'Profile updated successfully' });
    } catch (error) {
        console.error('Update caregiver profile error:', error);
        res.status(500).json({ success: false, message: 'Failed to update caregiver profile' });
    }
};

// Change caregiver password
exports.changeCaregiverPassword = async (req, res) => {
    try {
        const caregiverEmail = req.user.email;
        const { current_password, new_password } = req.body;
        
        if (!current_password || !new_password) {
            return res.status(400).json({ success: false, message: 'Current password and new password are required' });
        }
        
        if (new_password.length < 6) {
            return res.status(400).json({ success: false, message: 'New password must be at least 6 characters' });
        }
        
        const [caregivers] = await db.execute('SELECT password FROM caregiver_users WHERE email = ?', [caregiverEmail]);
        if (caregivers.length === 0) {
            return res.status(404).json({ success: false, message: 'Caregiver not found' });
        }
        
        const isValid = await bcrypt.compare(current_password, caregivers[0].password);
        if (!isValid) {
            return res.status(401).json({ success: false, message: 'Current password is incorrect' });
        }
        
        const hashedPassword = await bcrypt.hash(new_password, 10);
        await db.execute('UPDATE caregiver_users SET password = ? WHERE email = ?', [hashedPassword, caregiverEmail]);
        
        res.json({ success: true, message: 'Password changed successfully' });
    } catch (error) {
        console.error('Change caregiver password error:', error);
        res.status(500).json({ success: false, message: 'Failed to change password' });
    }
};