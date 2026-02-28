const User = require('../models/User');
const Patient = require('../models/Patient');
const Admin = require('../models/Admin');
const RegisterRequest = require('../dto/RegisterRequest');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const emailVerificationService = require('../services/emailVerificationService');
const phoneVerificationService = require('../services/phoneVerificationService');
const codeService = require('../services/codeService');
const db = require('../config/database');
// Register new patient
exports.register = async (req, res) => {
    try {
        const { name, email, password, phone, chifaCardRegistrationNumber, dateOfBirth, smartphoneSkillLevel } = req.body;

    // ============ VALIDATIONS ============

// 1. Check required fields
if (!name || !email || !password || !phone || !chifaCardRegistrationNumber || !dateOfBirth || !smartphoneSkillLevel) {
    return res.status(400).json({ 
        success: false, 
        message: 'All fields are required: name, email, password, phone, chifaCardRegistrationNumber, dateOfBirth, smartphoneSkillLevel' 
    });
}

// 2. Validate email format
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
if (!emailRegex.test(email)) {
    return res.status(400).json({ 
        success: false, 
        message: 'Please provide a valid email address' 
    });
}

// 3. Validate email existence (Mailboxlayer)
console.log('🔍 Vérification email avec Mailboxlayer...');
const emailVerification = await emailVerificationService.verifyEmail(email);
if (!emailVerification.isValid) {
    let message = "L'adresse email semble invalide.";
    if (emailVerification.details?.disposable) {
        message = "Les emails jetables ne sont pas autorisés.";
    } else if (emailVerification.details && !emailVerification.details.mxFound) {
        message = "Le domaine de l'email n'existe pas.";
    }
    return res.status(400).json({ success: false, message });
}

// 4. Validate password strength
const passwordValidation = RegisterRequest.isValidPassword(password);
if (!passwordValidation.valid) {
    return res.status(400).json({ 
        success: false, 
        message: passwordValidation.message 
    });
}

// 5. Validate phone format (10 digits, starts with 05/06/07)
if (!RegisterRequest.isValidPhoneNumber(phone)) {
    return res.status(400).json({ 
        success: false, 
        message: 'Phone number must be exactly 10 digits and start with 05, 06, or 07' 
    });
}

// 6. Validate phone existence (NumVerify)
console.log('🔍 Vérification téléphone avec NumVerify...');
const phoneVerification = await phoneVerificationService.verifyPhone(phone);
if (!phoneVerification.isValid) {
    return res.status(400).json({ 
        success: false, 
        message: 'Numéro de téléphone invalide ou inexistant' 
    });
}

// 7. Validate CHIFA number (exactly 9 digits)
if (!RegisterRequest.isValidChifaNumber(chifaCardRegistrationNumber)) {
    return res.status(400).json({ 
        success: false, 
        message: 'CHIFA registration number must be exactly 9 digits' 
    });
}

// 8. Validate date format (DD-MM-YYYY)
if (!RegisterRequest.isValidDateFormat(dateOfBirth)) {
    return res.status(400).json({ 
        success: false, 
        message: 'Date of birth must be in format DD-MM-YYYY (example: 15-05-1990)' 
    });
}

// 9. Validate smartphone skill level
if (!RegisterRequest.isValidSkillLevel(smartphoneSkillLevel)) {
    return res.status(400).json({ 
        success: false, 
        message: 'Smartphone skill level must be one of: BASIC, INTERMEDIATE, ADVANCED' 
    });
}

// 10. Check if user already exists by email
const existingUserByEmail = await User.findByEmail(email);
if (existingUserByEmail) {
    return res.status(400).json({ 
        success: false, 
        message: 'Email already registered' 
    });
}

// 11. Check if user already exists by phone
const existingUserByPhone = await User.findByPhone(phone);
if (existingUserByPhone) {
    return res.status(400).json({ 
        success: false, 
        message: 'Phone number already registered' 
    });
}

// 12. Check if CHIFA already exists
const existingChifa = await Patient.findByChifaNumber(chifaCardRegistrationNumber);
if (existingChifa) {
    return res.status(400).json({ 
        success: false, 
        message: 'Ce numéro CHIFA est déjà utilisé' 
    });
}

        // ============ CREATE USER ============
        
        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create user with role 'patient'
        const userId = await User.create({
            name,
            email,
            password: hashedPassword,
            phone,
            role: 'patient'
        });

        // Convert date from DD-MM-YYYY to YYYY-MM-DD for MySQL
        const mysqlDate = RegisterRequest.convertToMySQLDate(dateOfBirth);

        // Create patient profile
        await Patient.create({
            id: userId,
            chifaCardRegistrationNumber,
            dateOfBirth: mysqlDate,
            smartphoneSkillLevel: smartphoneSkillLevel.toUpperCase()
        });

        // Generate JWT token
        const token = jwt.sign(
            { id: userId, email, role: 'patient' },
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_EXPIRE }
        );

        res.status(201).json({
            success: true,
            message: 'Registration successful',
            token,
            user: { 
                id: userId, 
                name, 
                email, 
                role: 'patient',
                phone,
                chifaCardRegistrationNumber,
                dateOfBirth,
                smartphoneSkillLevel
            }
        });

    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Registration failed', 
            error: error.message 
        });
    }
};

// Login - Accepte email OU téléphone
exports.login = async (req, res) => {
    try {
        const { identifier, password } = req.body;

        if (!identifier || !password) {
            return res.status(400).json({ 
                success: false, 
                message: 'Identifiant (email ou téléphone) et mot de passe requis' 
            });
        }

        // Vérifier si c'est un email ou un téléphone
        const isEmail = identifier.includes('@');
        let user;

        if (isEmail) {
            user = await User.findByEmail(identifier);
        } else {
            const cleanPhone = identifier.replace(/\D/g, '');
            user = await User.findByPhone(cleanPhone);
        }

        if (!user) {
            return res.status(401).json({ 
                success: false, 
                message: 'Identifiant ou mot de passe incorrect' 
            });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ 
                success: false, 
                message: 'Identifiant ou mot de passe incorrect' 
            });
        }

        const token = jwt.sign(
            { id: user.id, email: user.email, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_EXPIRE }
        );

        let profile = null;
        if (user.role === 'patient') {
            profile = await Patient.findByUserId(user.id);
            if (profile && profile.date_of_birth) {
                const date = new Date(profile.date_of_birth);
                const day = String(date.getDate()).padStart(2, '0');
                const month = String(date.getMonth() + 1).padStart(2, '0');
                const year = date.getFullYear();
                profile.date_of_birth_formatted = `${day}-${month}-${year}`;
            }
        } else if (user.role === 'admin') {
            profile = await Admin.findByUserId(user.id);
        }

        res.json({
            success: true,
            message: 'Login successful',
            token,
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role,
                phone: user.phone,
                profile
            }
        });

    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Login failed', 
            error: error.message 
        });
    }
};
// Get current user
exports.getMe = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        
        let profile = null;
        if (user.role === 'patient') {
            profile = await Patient.findByUserId(user.id);
            // Format date if needed
            if (profile && profile.date_of_birth) {
                const date = new Date(profile.date_of_birth);
                const day = String(date.getDate()).padStart(2, '0');
                const month = String(date.getMonth() + 1).padStart(2, '0');
                const year = date.getFullYear();
                profile.date_of_birth_formatted = `${day}-${month}-${year}`;
            }
        }

        res.json({ 
            success: true, 
            user: {
                ...user,
                profile
            }
        });
    } catch (error) {
        console.error('GetMe error:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Failed to get user info' 
        });
    }
};

// Logout
exports.logout = (req, res) => {
    res.json({ 
        success: true, 
        message: 'Logged out successfully' 
    });
};  // ← Cette accolade ferme correctement la fonction logout

// Forgot password - Demande de réinitialisation
exports.forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({
                success: false,
                message: 'Email is required'
            });
        }

        // Vérifier si l'utilisateur existe
        const user = await User.findByEmail(email);
        
        if (!user) {
            // Pour des raisons de sécurité, on ne dit pas si l'email existe ou pas
            return res.json({
                success: true,
                message: 'If your email is registered, you will receive a reset link'
            });
        }

        // Générer un token de réinitialisation (valable 1 heure)
        const resetToken = jwt.sign(
            { id: user.id, email: user.email },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );

        // Ici, tu enverrais un email avec le lien
        console.log(`🔐 Reset token for ${email}: ${resetToken}`);
        console.log(`🔗 Reset link: http://localhost:5000/api/auth/reset-password?token=${resetToken}`);

        // En production, ne pas renvoyer le token dans la réponse !
        res.json({
            success: true,
            message: 'If your email is registered, you will receive a reset link',
            // Les lignes suivantes sont POUR TESTS UNIQUEMENT :
            debug_token: resetToken,  // À retirer en production
            debug_link: `http://localhost:5000/api/auth/reset-password?token=${resetToken}`  // À retirer en production
        });

    } catch (error) {
        console.error('Forgot password error:', error);
        res.status(500).json({
            success: false,
            message: 'An error occurred. Please try again later.'
        });
    }
};

// Reset password - Réinitialisation avec le token
exports.resetPassword = async (req, res) => {
    try {
        const { token, newPassword } = req.body;

        if (!token || !newPassword) {
            return res.status(400).json({
                success: false,
                message: 'Token and new password are required'
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

        // Vérifier le token
        let decoded;
        try {
            decoded = jwt.verify(token, process.env.JWT_SECRET);
        } catch (err) {
            if (err.name === 'TokenExpiredError') {
                return res.status(400).json({
                    success: false,
                    message: 'Reset token has expired. Please request a new one.'
                });
            }
            return res.status(400).json({
                success: false,
                message: 'Invalid token'
            });
        }

        // Hasher le nouveau mot de passe
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(newPassword, salt);

        // Mettre à jour le mot de passe dans la base de données
        const db = require('../config/database');
        await db.execute(
            'UPDATE users SET password = ? WHERE id = ?',
            [hashedPassword, decoded.id]
        );

        res.json({
            success: true,
            message: 'Password reset successful. You can now login with your new password.'
        });

    } catch (error) {
        console.error('Reset password error:', error);
        res.status(500).json({
            success: false,
            message: 'An error occurred. Please try again later.'
        });
    }
};
// ===========================================
// FONCTIONS DE RÉINITIALISATION (EMAIL UNIQUEMENT)
// ===========================================

// 1. Demander un code de réinitialisation (EMAIL UNIQUEMENT)
exports.requestResetCode = async (req, res) => {
    try {
        const { email } = req.body;  // ← Plus que email, plus identifier

        if (!email) {
            return res.status(400).json({
                success: false,
                message: 'Email requis pour la réinitialisation'
            });
        }

        // Vérifier si l'utilisateur existe par email
        const user = await User.findByEmail(email);
        
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'Aucun compte trouvé avec cet email'
            });
        }

        // Générer un code à 6 chiffres
        const code = codeService.generateCode();
        const expiresAt = new Date();
        expiresAt.setMinutes(expiresAt.getMinutes() + 15);

        // Sauvegarder le code dans la base
        await db.execute(
            'INSERT INTO reset_codes (user_id, code, type, expires_at) VALUES (?, ?, ?, ?)',
            [user.id, code, 'email', expiresAt]
        );

        // Envoyer le code par EMAIL uniquement
        const sendResult = await codeService.sendCodeByEmail(email, code);

        if (!sendResult.success) {
            return res.status(500).json({
                success: false,
                message: 'Erreur lors de l\'envoi du code'
            });
        }

        res.json({
            success: true,
            message: `Code de vérification envoyé à votre adresse email`,
            debug_code: code // À retirer en production
        });

    } catch (error) {
        console.error('Erreur requestResetCode:', error);
        res.status(500).json({
            success: false,
            message: 'Erreur lors de la demande de code'
        });
    }
};

// 2. Vérifier le code (EMAIL ou TÉLÉPHONE pour identifier)
exports.verifyResetCode = async (req, res) => {
    try {
        const { identifier, code } = req.body;

        if (!identifier || !code) {
            return res.status(400).json({
                success: false,
                message: 'Identifiant et code requis'
            });
        }

        // Trouver l'utilisateur (par email ou téléphone)
        const isEmail = identifier.includes('@');
        let user;

        if (isEmail) {
            user = await User.findByEmail(identifier);
        } else {
            const cleanPhone = identifier.replace(/\D/g, '');
            user = await User.findByPhone(cleanPhone);
        }

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'Utilisateur non trouvé'
            });
        }

        // Vérifier le code (seulement les codes de type 'email')
        const [codes] = await db.execute(
            'SELECT * FROM reset_codes WHERE user_id = ? AND code = ? AND type = "email" AND used = FALSE AND expires_at > NOW() ORDER BY created_at DESC LIMIT 1',
            [user.id, code]
        );

        if (codes.length === 0) {
            return res.status(400).json({
                success: false,
                message: 'Code invalide ou expiré'
            });
        }

        // Marquer le code comme utilisé
        await db.execute(
            'UPDATE reset_codes SET used = TRUE WHERE id = ?',
            [codes[0].id]
        );

        // Générer un token temporaire pour la réinitialisation
        const resetToken = jwt.sign(
            { id: user.id, type: 'reset' },
            process.env.JWT_SECRET,
            { expiresIn: '15m' }
        );

        res.json({
            success: true,
            message: 'Code vérifié avec succès',
            resetToken
        });

    } catch (error) {
        console.error('Erreur verifyResetCode:', error);
        res.status(500).json({
            success: false,
            message: 'Erreur lors de la vérification du code'
        });
    }
};

// 3. Réinitialiser le mot de passe avec le token
exports.resetPasswordWithCode = async (req, res) => {
    try {
        const { resetToken, newPassword } = req.body;

        if (!resetToken || !newPassword) {
            return res.status(400).json({
                success: false,
                message: 'Token et nouveau mot de passe requis'
            });
        }

        // Vérifier le token
        let decoded;
        try {
            decoded = jwt.verify(resetToken, process.env.JWT_SECRET);
        } catch (err) {
            return res.status(400).json({
                success: false,
                message: 'Token invalide ou expiré'
            });
        }

        if (decoded.type !== 'reset') {
            return res.status(400).json({
                success: false,
                message: 'Token invalide'
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

        // Hasher le nouveau mot de passe
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(newPassword, salt);

        // Mettre à jour le mot de passe
        await db.execute(
            'UPDATE users SET password = ? WHERE id = ?',
            [hashedPassword, decoded.id]
        );

        res.json({
            success: true,
            message: 'Mot de passe réinitialisé avec succès'
        });

    } catch (error) {
        console.error('Erreur resetPasswordWithCode:', error);
        res.status(500).json({
            success: false,
            message: 'Erreur lors de la réinitialisation du mot de passe'
        });
    }
};