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
const emailSenderService = require('../services/emailSenderService'); // ← NOUVEAU
const crypto = require('crypto');
// Register new patient
exports.register = async (req, res) => {
    try {
        const { name, email, password, phone, chifaCardRegistrationNumber, dateOfBirth, smartphoneSkillLevel } = req.body;

        // ============ VALIDATIONS ============

        // 1. Check required fields
        if (!name || !email || !password || !phone || !chifaCardRegistrationNumber || !dateOfBirth || !smartphoneSkillLevel) {
            console.log('❌ Registration failed: Missing fields', { name: !!name, email: !!email, password: !!password, phone: !!phone, chifa: !!chifaCardRegistrationNumber, dob: !!dateOfBirth, skill: !!smartphoneSkillLevel });
            return res.status(400).json({ 
                success: false, 
                message: 'All fields are required: name, email, password, phone, chifaCardRegistrationNumber, dateOfBirth, smartphoneSkillLevel' 
            });
        }

        // 2. Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            console.log('❌ Registration failed: Invalid email format', email);
            return res.status(400).json({ 
                success: false, 
                message: 'Please provide a valid email address' 
            });
        }

        // 3. Validate email existence (Mailboxlayer)
        console.log('🔍 Vérification email avec DNS...');
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
            console.log('❌ Registration failed: Weak password', passwordValidation.message);
            return res.status(400).json({ 
                success: false, 
                message: passwordValidation.message 
            });
        }

        // 5. Validate phone format (10 digits, starts with 05/06/07)
        if (!RegisterRequest.isValidPhoneNumber(phone)) {
            console.log('❌ Registration failed: Invalid phone format', phone);
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
            console.log('❌ Registration failed: Invalid CHIFA number', chifaCardRegistrationNumber);
            return res.status(400).json({ 
                success: false, 
                message: 'CHIFA registration number must be exactly 9 digits' 
            });
        }

        // 8. Validate date format (DD-MM-YYYY)
        if (!RegisterRequest.isValidDateFormat(dateOfBirth)) {
            console.log('❌ Registration failed: Invalid date format', dateOfBirth);
            return res.status(400).json({ 
                success: false, 
                message: 'Date of birth must be in format DD-MM-YYYY (example: 15-05-1990)' 
            });
        }

        // 9. Validate smartphone skill level
        if (!RegisterRequest.isValidSkillLevel(smartphoneSkillLevel)) {
            console.log('❌ Registration failed: Invalid skill level', smartphoneSkillLevel);
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

// REPLACE WITH:
        // Generate verification token
        const verificationToken = crypto.randomBytes(32).toString('hex');
        
        // Save token to database
        await db.execute(
            'UPDATE users SET verification_token = ? WHERE id = ?',
            [verificationToken, userId]
        );

        // Send verification email
        try {
            await emailSenderService.sendVerificationEmail(email, name, verificationToken);
            console.log(`📧 Email de vérification envoyé à ${email}`);
        } catch (emailError) {
            console.error('❌ Erreur envoi email (non bloquante):', emailError);
        }



res.status(201).json({
    success: true,
    message: 'Registration successful. Please check your email to verify your account before logging in.',
    emailSent: true,
    user: { 
        id: userId, 
        name, 
        email, 
        role: 'patient'
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
// Login - Accepte email OU téléphone - CORRECTED VERSION
// Login - Accepte email OU téléphone - CORRECTED VERSION
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

        // ✅ 1. D'ABORD vérifier les patients (cas le plus fréquent)
        if (user) {
            const isPasswordValid = await bcrypt.compare(password, user.password);
            if (isPasswordValid) {
                // Block unverified patient accounts
                if (user.is_verified === 0 && user.role === 'patient') {
                    return res.status(403).json({
                        success: false,
                        message: 'Veuillez vérifier votre adresse email avant de vous connecter. Vérifiez votre boîte mail.',
                        error_code: 'EMAIL_NOT_VERIFIED'
                    });
                }
                const authToken = jwt.sign(
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

                return res.json({
                    success: true,
                    message: 'Login successful',
                    token: authToken,
                    user: {
                        id: user.id,
                        name: user.name,
                        email: user.email,
                        role: user.role,
                        phone: user.phone,
                        profile
                    }
                });
            }
        }

        // ✅ 2. Ensuite vérifier les caregivers (si pas trouvé parmi les patients)
        try {
            console.log('🔍 Checking caregiver_users for email:', identifier);
            const [caregiverUsers] = await db.execute(
                'SELECT * FROM caregiver_users WHERE email = ?',
                [identifier]
            );

            if (caregiverUsers.length > 0) {
                console.log('👤 Caregiver found:', caregiverUsers[0].email);
                const caregiverUser = caregiverUsers[0];
                const isValidCaregiver = await bcrypt.compare(password, caregiverUser.password);
                console.log('🔐 Password valid:', isValidCaregiver);
                
                if (isValidCaregiver) {
                    console.log('✅ Caregiver login successful for:', caregiverUser.email);
                    const caregiverToken = jwt.sign(
                        { id: caregiverUser.id, email: caregiverUser.email, role: 'caregiver', name: caregiverUser.name },
                        process.env.JWT_SECRET,
                        { expiresIn: process.env.JWT_EXPIRE || '7d' }
                    );
                    // Save FCM token if provided
const fcmToken = req.body.fcmToken || req.body.fcm_token;
if (fcmToken) {
    await db.execute(
        'UPDATE caregiver_users SET fcm_token = ? WHERE email = ?',
        [fcmToken, caregiverUser.email]
    );
    console.log('🔔 Caregiver FCM token saved for:', caregiverUser.email);
}
                    return res.json({
                        success: true,
                        message: 'Login successful',
                        token: caregiverToken,
                        user: {
                            id: caregiverUser.id,
                            name: caregiverUser.name,
                            email: caregiverUser.email,
                            role: 'caregiver'
                        }
                    });
                }
            }
        } catch (caregiverError) {
            // Si la table n'existe pas, on ignore simplement l'erreur
            if (caregiverError.code !== 'ER_NO_SUCH_TABLE') {
                console.error('Caregiver check error:', caregiverError);
            }
        }

        // ✅ 3. Si aucun des deux n'a fonctionné, erreur
        return res.status(401).json({ 
            success: false, 
            message: 'Identifiant ou mot de passe incorrect' 
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
};

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
            debug_token: resetToken,
            debug_link: `http://localhost:5000/api/auth/reset-password?token=${resetToken}`
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
        const { email } = req.body;

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
            debug_code: code
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
// ===========================================
// CAREGIVER PASSWORD RESET FUNCTIONS
// ===========================================

// 1. Request reset code for caregiver
exports.requestCaregiverResetCode = async (req, res) => {
    try {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({
                success: false,
                message: 'Email requis pour la réinitialisation'
            });
        }

        // Check if caregiver exists
        const [caregivers] = await db.execute(
            'SELECT * FROM caregiver_users WHERE email = ?',
            [email]
        );
        
        if (caregivers.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Aucun compte caregiver trouvé avec cet email'
            });
        }

        const caregiver = caregivers[0];

        // Generate a 6-digit code
        const code = codeService.generateCode();
        const expiresAt = new Date();
        expiresAt.setMinutes(expiresAt.getMinutes() + 15);

        // Save code to reset_codes table
        await db.execute(
            'INSERT INTO reset_codes (user_id, code, type, expires_at, is_caregiver) VALUES (?, ?, ?, ?, ?)',
            [caregiver.id, code, 'email', expiresAt, 1]
        );

        // Send code by email
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
            debug_code: code
        });

    } catch (error) {
        console.error('Erreur requestCaregiverResetCode:', error);
        res.status(500).json({
            success: false,
            message: 'Erreur lors de la demande de code'
        });
    }
};

// 2. Verify reset code for caregiver
exports.verifyCaregiverResetCode = async (req, res) => {
    try {
        const { email, code } = req.body;

        if (!email || !code) {
            return res.status(400).json({
                success: false,
                message: 'Email et code requis'
            });
        }

        // Find caregiver by email
        const [caregivers] = await db.execute(
            'SELECT id FROM caregiver_users WHERE email = ?',
            [email]
        );

        if (caregivers.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Utilisateur non trouvé'
            });
        }

        const caregiverId = caregivers[0].id;

        // Verify the code
        const [codes] = await db.execute(
            'SELECT * FROM reset_codes WHERE user_id = ? AND code = ? AND type = "email" AND is_caregiver = 1 AND used = FALSE AND expires_at > NOW() ORDER BY created_at DESC LIMIT 1',
            [caregiverId, code]
        );

        if (codes.length === 0) {
            return res.status(400).json({
                success: false,
                message: 'Code invalide ou expiré'
            });
        }

        // Mark code as used
        await db.execute(
            'UPDATE reset_codes SET used = TRUE WHERE id = ?',
            [codes[0].id]
        );

        // Generate temporary token for password reset
        const resetToken = jwt.sign(
            { id: caregiverId, type: 'caregiver_reset' },
            process.env.JWT_SECRET,
            { expiresIn: '15m' }
        );

        res.json({
            success: true,
            message: 'Code vérifié avec succès',
            resetToken
        });

    } catch (error) {
        console.error('Erreur verifyCaregiverResetCode:', error);
        res.status(500).json({
            success: false,
            message: 'Erreur lors de la vérification du code'
        });
    }
};

// 3. Reset caregiver password
exports.resetCaregiverPassword = async (req, res) => {
    try {
        const { resetToken, newPassword } = req.body;

        if (!resetToken || !newPassword) {
            return res.status(400).json({
                success: false,
                message: 'Token et nouveau mot de passe requis'
            });
        }

        // Verify the token
        let decoded;
        try {
            decoded = jwt.verify(resetToken, process.env.JWT_SECRET);
        } catch (err) {
            return res.status(400).json({
                success: false,
                message: 'Token invalide ou expiré'
            });
        }

        if (decoded.type !== 'caregiver_reset') {
            return res.status(400).json({
                success: false,
                message: 'Token invalide'
            });
        }

        // Validate new password
        const passwordValidation = RegisterRequest.isValidPassword(newPassword);
        if (!passwordValidation.valid) {
            return res.status(400).json({
                success: false,
                message: passwordValidation.message
            });
        }

        // Hash new password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(newPassword, salt);

        // Update password
        await db.execute(
            'UPDATE caregiver_users SET password = ? WHERE id = ?',
            [hashedPassword, decoded.id]
        );

        res.json({
            success: true,
            message: 'Mot de passe réinitialisé avec succès'
        });

    } catch (error) {
        console.error('Erreur resetCaregiverPassword:', error);
        res.status(500).json({
            success: false,
            message: 'Erreur lors de la réinitialisation du mot de passe'
        });
    }
};
// Email verification endpoint
exports.verifyEmail = async (req, res) => {
    try {
        const { token } = req.query;

        if (!token) {
            return res.status(400).send(`
                <html><body style="font-family:Arial;text-align:center;padding:50px;">
                    <h2 style="color:red;">❌ Token missing</h2>
                    <p>verification link is invalid.</p>
                </body></html>
            `);
        }

        // Find user with this token
        const [users] = await db.execute(
            'SELECT id, name, email, is_verified FROM users WHERE verification_token = ?',
            [token]
        );

        if (users.length === 0) {
            return res.status(400).send(`
                <html><body style="font-family:Arial;text-align:center;padding:50px;">
                    <h2 style="color:red;">❌ invalid link or expired </h2>
                    <p>Ce verification link is not valid.</p>
                </body></html>
            `);
        }

        const user = users[0];

        if (user.is_verified === 1) {
            return res.send(`
                <html><body style="font-family:Arial;text-align:center;padding:50px;">
                    <h2 style="color:#007AFF;">✅ Email already verified</h2>
                    <p>your account is already verifed ,you can login now .</p>
                </body></html>
            `);
        }

        // Activate account
        await db.execute(
            'UPDATE users SET is_verified = 1, verification_token = NULL WHERE id = ?',
            [user.id]
        );

        // Send welcome email now that account is verified
        try {
            await emailSenderService.sendWelcomeEmail(user.email, user.name);
        } catch (_) {}

        console.log(`✅ Email verified for : ${user.email}`);

        return res.send(`
            <html><body style="font-family:Arial;text-align:center;padding:50px;background:#f5f5f5;">
                <div style="background:white;max-width:500px;margin:0 auto;padding:40px;border-radius:12px;box-shadow:0 2px 10px rgba(0,0,0,0.1);">
                    <div style="font-size:60px;">✅</div>
                    <h2 style="color:#007AFF;">Email was verified successfully !</h2>
                    <p style="color:#666;">Bonjour ${user.name}, your medicare account is now activated.</p>
                    <p style="color:#666;">You can now login to your medicare application.</p>
                    <div style="font-size:40px;margin:20px 0;">💊</div>
                    <p style="color:#999;font-size:12px;">MediCare — Votre santé, notre priorité</p>
                </div>
            </body></html>
        `);

    } catch (error) {
        console.error('Verify email error:', error);
        return res.status(500).send(`
            <html><body style="font-family:Arial;text-align:center;padding:50px;">
                <h2 style="color:red;">❌ Erreur serveur</h2>
                <p>Une erreur est survenue. Veuillez réessayer.</p>
            </body></html>
        `);
    }
};