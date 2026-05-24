const User            = require('../models/User');
const Patient         = require('../models/Patient');
const bcrypt          = require('bcryptjs');
const RegisterRequest = require('../dto/RegisterRequest');
const db              = require('../config/database');

// ── GET full profile ──────────────────────────────────────────────────────────
exports.getProfile = async (req, res) => {
    try {
        const userId = req.user.id;
        const user   = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ success: false, message: 'Utilisateur non trouvé' });
        }

        let patientData = null;
        if (user.role === 'patient') {
            patientData = await Patient.findByUserId(userId);
            if (patientData?.date_of_birth) {
                const d = new Date(patientData.date_of_birth);
                patientData.date_of_birth_formatted =
                    `${String(d.getDate()).padStart(2,'0')}-${String(d.getMonth()+1).padStart(2,'0')}-${d.getFullYear()}`;
            }
            patientData.conditions = await Patient.getPatientConditions(userId);
        }

        res.json({ success: true, profile: { id: user.id, name: user.name, email: user.email, phone: user.phone, role: user.role, ...patientData } });

    } catch (error) {
        console.error('Erreur getProfile:', error);
        res.status(500).json({ success: false, message: 'Erreur lors de la récupération du profil' });
    }
};

// ── POST /profile/setup ───────────────────────────────────────────────────────
exports.setupPatientProfile = async (req, res) => {
    try {
        const userId = req.user.id;
        const { age, conditions } = req.body;
        if (!age || !conditions) {
            return res.status(400).json({ success: false, message: 'L\'âge et les conditions sont requis' });
        }
        await Patient.setupProfile(userId, { age, conditions });
        res.json({ success: true, message: 'Profil configuré avec succès' });
    } catch (error) {
        console.error('Erreur setupPatientProfile:', error);
        res.status(500).json({ success: false, message: 'Erreur lors de la configuration du profil' });
    }
};

// ── PUT /profile/update ───────────────────────────────────────────────────────
exports.updateProfile = async (req, res) => {
    try {
        const userId = req.user.id;
        const { name, phone, chifaCardRegistrationNumber, dateOfBirth, smartphoneSkillLevel } = req.body;

        const user = await User.findById(userId);
        if (!user) return res.status(404).json({ success: false, message: 'Utilisateur non trouvé' });

        // Update users table
        const updateFields = [];
        const updateValues = [];
        if (name)  { updateFields.push('name = ?');  updateValues.push(name);  }
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
                    `${String(d.getDate()).padStart(2,'0')}-${String(d.getMonth()+1).padStart(2,'0')}-${d.getFullYear()}`;
            }
        }

        res.json({ success: true, message: 'Profil mis à jour avec succès',
            profile: { id: updated.id, name: updated.name, email: updated.email, phone: updated.phone, role: updated.role, ...updatedPatient } });

    } catch (error) {
        console.error('Erreur updateProfile:', error);
        res.status(500).json({ success: false, message: 'Erreur lors de la mise à jour du profil', error: error.message });
    }
};

// ── GET /profile/conditions ───────────────────────────────────────────────────
exports.getAllChronicConditions = async (req, res) => {
    try {
        const conditions = await Patient.getAllConditions();
        res.json({ success: true, conditions });
    } catch (error) {
        console.error('Erreur getAllChronicConditions:', error);
        res.status(500).json({ success: false, message: 'Erreur lors de la récupération des maladies chroniques' });
    }
};

// ── PUT /profile/password ─────────────────────────────────────────────────────
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

        const salt   = await bcrypt.genSalt(10);
        const hashed = await bcrypt.hash(newPassword, salt);
        await db.execute('UPDATE users SET password = ? WHERE id = ?', [hashed, userId]);

        res.json({ success: true, message: 'Mot de passe modifié avec succès' });

    } catch (error) {
        console.error('Erreur changePassword:', error);
        res.status(500).json({ success: false, message: 'Erreur lors du changement de mot de passe' });
    }
};

// ── PUT /profile/settings ─────────────────────────────────────────────────────
exports.updateSettings = async (req, res) => {
    try {
        const userId  = req.user.id;
        const settings = req.body;

        const allowedFields = [
            'all_notifications', 'medication_reminders', 'adherence_alerts',
            'smart_insights', 'sound_enabled', 'vibration_enabled',
            'dark_mode', 'auto_refill_reminders',
            'quiet_hours_enabled', 'quiet_hours_start', 'quiet_hours_end',
            'quiet_hours_days', 'critical_alerts_enabled',
        ];

        const updates = [];
        const values  = [];
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

// ── PUT /profile/daily-schedule (legacy — keep for backward compat) ───────────
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

// ── DELETE /profile/account ───────────────────────────────────────────────────
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

// ─────────────────────────────────────────────────────────────────────────────
// GET /profile/schedule
// Used by DailySchedulePage to load current saved times
// ─────────────────────────────────────────────────────────────────────────────
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

// ─────────────────────────────────────────────────────────────────────────────
// PATCH /profile/schedule
// Used by DailySchedulePage Save button
// ─────────────────────────────────────────────────────────────────────────────
exports.updateSchedule = async (req, res) => {
    try {
        const patientId = req.user.id;
        const { smart_scheduling_enabled, wake_time, bedtime, breakfast_time, lunch_time, dinner_time } = req.body;

        await db.execute(
            `UPDATE patients SET
                smart_scheduling_enabled = ?,
                wake_time                = ?,
                bedtime                  = ?,
                breakfast_time           = ?,
                lunch_time               = ?,
                dinner_time              = ?
             WHERE id = ?`,
            [
                smart_scheduling_enabled ?? true,
                wake_time      || '07:00',
                bedtime        || '23:00',
                breakfast_time || '08:00',
                lunch_time     || '12:30',
                dinner_time    || '18:30',
                patientId,
            ]
        );

        res.json({ success: true, message: 'Schedule updated successfully' });
    } catch (error) {
        console.error('updateSchedule error:', error);
        res.status(500).json({ success: false, message: 'Error updating schedule' });
    }
};

// ─────────────────────────────────────────────────────────────────────────────
// GET /profile/quiet-hours
// Used by QuietHoursPage to load current settings
// ─────────────────────────────────────────────────────────────────────────────
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
                enabled:                 row.quiet_hours_enabled,
                start:                   row.quiet_hours_start   || '23:00',
                end:                     row.quiet_hours_end     || '07:00',
                days:                    quietDays               || [],
                critical_alerts_enabled: row.critical_alerts_enabled,
            }
        });
    } catch (error) {
        console.error('getQuietHours error:', error);
        res.status(500).json({ success: false, message: 'Error fetching quiet hours' });
    }
};

// ─────────────────────────────────────────────────────────────────────────────
// PATCH /profile/quiet-hours
// Used by QuietHoursPage Save button
// ─────────────────────────────────────────────────────────────────────────────
exports.updateQuietHours = async (req, res) => {
    try {
        const patientId = req.user.id;
        const { enabled, start, end, days, critical_alerts_enabled } = req.body;

        await db.execute(
            `UPDATE patients SET
                quiet_hours_enabled     = ?,
                quiet_hours_start       = ?,
                quiet_hours_end         = ?,
                quiet_hours_days        = ?,
                critical_alerts_enabled = ?
             WHERE id = ?`,
            [
                enabled                 ?? true,
                start                   || '23:00',
                end                     || '07:00',
                JSON.stringify(days     || []),
                critical_alerts_enabled ?? true,
                patientId,
            ]
        );

        res.json({ success: true, message: 'Quiet hours updated successfully' });
    } catch (error) {
        console.error('updateQuietHours error:', error);
        res.status(500).json({ success: false, message: 'Error updating quiet hours' });
    }
};