const db = require('../config/database');  // ✅ ADD THIS IMPORT
const User = require('../models/User');
const Patient = require('../models/Patient');
const Admin = require('../models/Admin');
const bcrypt = require('bcryptjs');
const RegisterRequest = require('../dto/RegisterRequest');

// Récupérer le profil complet
exports.getProfile = async (req, res) => {
    try {
        const userId = req.user.id;
        
        // Récupérer l'utilisateur
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
            // Formater la date
            if (patientData && patientData.date_of_birth) {
                const date = new Date(patientData.date_of_birth);
                const day = String(date.getDate()).padStart(2, '0');
                const month = String(date.getMonth() + 1).padStart(2, '0');
                const year = date.getFullYear();
                patientData.date_of_birth_formatted = `${day}-${month}-${year}`;
            }

            // Récupérer les conditions du patient
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

        const result = await Patient.setupProfile(userId, { age, conditions });

        res.status(200).json({
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

// Update patient daily schedule
exports.updateDailySchedule = async (req, res) => {
    try {
        const userId = req.user.id;
        const scheduleData = req.body;
        
        const result = await Patient.updateDailySchedule(userId, scheduleData);
        
        if (!result) {
            return res.status(400).json({ success: false, message: 'No valid fields to update' });
        }

        res.json({ success: true, message: 'Daily schedule updated successfully' });
    } catch (error) {
        console.error('Error updating daily schedule:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

// Update patient settings
exports.updateSettings = async (req, res) => {
    try {
        const userId = req.user.id;
        const settings = req.body;
        
        // Allowed settings fields
        const allowedFields = [
            'all_notifications', 'medication_reminders', 'adherence_alerts', 
            'smart_insights', 'sound_enabled', 'vibration_enabled', 
            'dark_mode', 'auto_refill_reminders',
            'quiet_hours_enabled', 'quiet_hours_start', 'quiet_hours_end', 
            'quiet_hours_days', 'critical_alerts_enabled'
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
        const query = `UPDATE patients SET ${updates.join(', ')} WHERE id = ?`;
        
        await db.execute(query, values);

        res.json({ success: true, message: 'Settings updated successfully' });
    } catch (error) {
        console.error('Error updating settings:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

// Delete patient account
exports.deleteAccount = async (req, res) => {
    try {
        const userId = req.user.id;
        
        // Deleting from users table will cascade delete from patients, treatments, etc.
        await db.execute('DELETE FROM users WHERE id = ?', [userId]);

        res.json({ success: true, message: 'Account deleted successfully' });
    } catch (error) {
        console.error('Error deleting account:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

// Mettre à jour le profil
exports.updateProfile = async (req, res) => {
    try {
        const userId = req.user.id;
        const { name, phone, chifaCardRegistrationNumber, dateOfBirth, smartphoneSkillLevel } = req.body;

        // Vérifier que l'utilisateur existe
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'Utilisateur non trouvé'
            });
        }

        // Mise à jour des champs de base (users table)
        const updateFields = [];
        const updateValues = [];

        if (name) {
            updateFields.push('name = ?');
            updateValues.push(name);
        }
        if (phone) {
            updateFields.push('phone = ?');
            updateValues.push(phone);
        }

        if (updateFields.length > 0) {
            updateValues.push(userId);
            await db.execute(
                `UPDATE users SET ${updateFields.join(', ')} WHERE id = ?`,
                updateValues
            );
        }

        // Si c'est un patient, mettre à jour les champs spécifiques
        if (user.role === 'patient') {
            const patientUpdateFields = [];
            const patientUpdateValues = [];

            // Validation CHIFA
            if (chifaCardRegistrationNumber) {
                if (!RegisterRequest.isValidChifaNumber(chifaCardRegistrationNumber)) {
                    return res.status(400).json({
                        success: false,
                        message: 'Le numéro CHIFA doit contenir exactement 9 chiffres'
                    });
                }
                patientUpdateFields.push('chifa_card_registration_number = ?');
                patientUpdateValues.push(chifaCardRegistrationNumber);
            }

            // Validation date
            if (dateOfBirth) {
                if (!RegisterRequest.isValidDateFormat(dateOfBirth)) {
                    return res.status(400).json({
                        success: false,
                        message: 'Format de date invalide (JJ-MM-AAAA)'
                    });
                }
                const mysqlDate = RegisterRequest.convertToMySQLDate(dateOfBirth);
                patientUpdateFields.push('date_of_birth = ?');
                patientUpdateValues.push(mysqlDate);
            }

            // Validation niveau smartphone
            if (smartphoneSkillLevel) {
                if (!RegisterRequest.isValidSkillLevel(smartphoneSkillLevel)) {
                    return res.status(400).json({
                        success: false,
                        message: 'Le niveau doit être BASIC, INTERMEDIATE ou ADVANCED'
                    });
                }
                patientUpdateFields.push('smartphone_skill_level = ?');
                patientUpdateValues.push(smartphoneSkillLevel.toUpperCase());
            }

            if (patientUpdateFields.length > 0) {
                patientUpdateValues.push(userId);
                await db.execute(
                    `UPDATE patients SET ${patientUpdateFields.join(', ')} WHERE id = ?`,
                    patientUpdateValues
                );
            }
        }

        // Récupérer le profil mis à jour
        const updatedUser = await User.findById(userId);
        let updatedProfile = null;
        if (user.role === 'patient') {
            updatedProfile = await Patient.findByUserId(userId);
            if (updatedProfile && updatedProfile.date_of_birth) {
                const date = new Date(updatedProfile.date_of_birth);
                const day = String(date.getDate()).padStart(2, '0');
                const month = String(date.getMonth() + 1).padStart(2, '0');
                const year = date.getFullYear();
                updatedProfile.date_of_birth_formatted = `${day}-${month}-${year}`;
            }
        }

        res.json({
            success: true,
            message: 'Profil mis à jour avec succès',
            profile: {
                id: updatedUser.id,
                name: updatedUser.name,
                email: updatedUser.email,
                phone: updatedUser.phone,
                role: updatedUser.role,
                ...updatedProfile
            }
        });

    } catch (error) {
        console.error('Erreur updateProfile:', error);
        res.status(500).json({
            success: false,
            message: 'Erreur lors de la mise à jour du profil',
            error: error.message
        });
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

// Changer le mot de passe
exports.changePassword = async (req, res) => {
    try {
        const userId = req.user.id;
        const { currentPassword, newPassword } = req.body;

        // Vérifier que les champs sont présents
        if (!currentPassword || !newPassword) {
            return res.status(400).json({
                success: false,
                message: 'Mot de passe actuel et nouveau mot de passe requis'
            });
        }

        // Valider le nouveau mot de passe
        const passwordValidation = RegisterRequest.isValidPassword(newPassword);
        if (!passwordValidation.valid) {
            return res.status(400).json({
                success: false,
                message: passwordValidation.message
            });
        }

        // Récupérer l'utilisateur avec son mot de passe
        const [users] = await db.execute(
            'SELECT * FROM users WHERE id = ?',
            [userId]
        );

        if (users.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Utilisateur non trouvé'
            });
        }

        const user = users[0];

        // Vérifier l'ancien mot de passe
        const isPasswordValid = await bcrypt.compare(currentPassword, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({
                success: false,
                message: 'Mot de passe actuel incorrect'
            });
        }

        // Hasher le nouveau mot de passe
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(newPassword, salt);

        // Mettre à jour le mot de passe
        await db.execute(
            'UPDATE users SET password = ? WHERE id = ?',
            [hashedPassword, userId]
        );

        res.json({
            success: true,
            message: 'Mot de passe modifié avec succès'
        });

    } catch (error) {
        console.error('Erreur changePassword:', error);
        res.status(500).json({
            success: false,
            message: 'Erreur lors du changement de mot de passe'
        });
    }
};

// ========== CAREGIVER FUNCTIONS ==========

// Get caregiver profile
exports.getCaregiverProfile = async (req, res) => {
    try {
        const caregiverEmail = req.user.email;
        
        console.log('📋 Getting caregiver profile for:', caregiverEmail);
        
        const [caregivers] = await db.execute(
            `SELECT id, name, email, created_at 
             FROM caregiver_users 
             WHERE email = ?`,
            [caregiverEmail]
        );
        
        if (caregivers.length === 0) {
            return res.status(404).json({ 
                success: false, 
                message: 'Caregiver not found' 
            });
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
        res.status(500).json({ 
            success: false, 
            message: 'Failed to fetch caregiver profile' 
        });
    }
};

// Update caregiver profile
exports.updateCaregiverProfile = async (req, res) => {
    try {
        const caregiverEmail = req.user.email;
        const { name } = req.body;
        
        if (!name) {
            return res.status(400).json({ 
                success: false, 
                message: 'Name is required' 
            });
        }
        
        await db.execute(
            'UPDATE caregiver_users SET name = ? WHERE email = ?',
            [name, caregiverEmail]
        );
        
        res.json({
            success: true,
            message: 'Profile updated successfully'
        });
    } catch (error) {
        console.error('Update caregiver profile error:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Failed to update caregiver profile' 
        });
    }
};

// Change caregiver password
exports.changeCaregiverPassword = async (req, res) => {
    try {
        const caregiverEmail = req.user.email;
        const { current_password, new_password } = req.body;
        
        console.log('🔐 Changing password for caregiver:', caregiverEmail);
        
        // Validate input
        if (!current_password || !new_password) {
            return res.status(400).json({ 
                success: false, 
                message: 'Current password and new password are required' 
            });
        }
        
        if (new_password.length < 6) {
            return res.status(400).json({ 
                success: false, 
                message: 'New password must be at least 6 characters' 
            });
        }
        
        // Get current caregiver
        const [caregivers] = await db.execute(
            'SELECT password FROM caregiver_users WHERE email = ?',
            [caregiverEmail]
        );
        
        if (caregivers.length === 0) {
            return res.status(404).json({ 
                success: false, 
                message: 'Caregiver not found' 
            });
        }
        
        // Verify current password
        const isValid = await bcrypt.compare(current_password, caregivers[0].password);
        if (!isValid) {
            return res.status(401).json({ 
                success: false, 
                message: 'Current password is incorrect' 
            });
        }
        
        // Hash new password
        const hashedPassword = await bcrypt.hash(new_password, 10);
        
        // Update password
        await db.execute(
            'UPDATE caregiver_users SET password = ? WHERE email = ?',
            [hashedPassword, caregiverEmail]
        );
        
        console.log('✅ Password changed successfully for:', caregiverEmail);
        
        res.json({
            success: true,
            message: 'Password changed successfully'
        });
    } catch (error) {
        console.error('Change caregiver password error:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Failed to change password' 
        });
    }
};