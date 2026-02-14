const User = require('../models/User');
const Patient = require('../models/Patient');
const Admin = require('../models/Admin');
const RegisterRequest = require('../dto/RegisterRequest');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

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

        // 3. Validate password strength
        const passwordValidation = RegisterRequest.isValidPassword(password);
        if (!passwordValidation.valid) {
            return res.status(400).json({ 
                success: false, 
                message: passwordValidation.message 
            });
        }

        // 4. Validate phone number (10 digits, starts with 05/06/07)
        if (!RegisterRequest.isValidPhoneNumber(phone)) {
            return res.status(400).json({ 
                success: false, 
                message: 'Phone number must be exactly 10 digits and start with 05, 06, or 07' 
            });
        }

        // 5. Validate CHIFA number (exactly 9 digits)
        if (!RegisterRequest.isValidChifaNumber(chifaCardRegistrationNumber)) {
            return res.status(400).json({ 
                success: false, 
                message: 'CHIFA registration number must be exactly 9 digits' 
            });
        }

        // 6. Validate date format (DD-MM-YYYY)
        if (!RegisterRequest.isValidDateFormat(dateOfBirth)) {
            return res.status(400).json({ 
                success: false, 
                message: 'Date of birth must be in format DD-MM-YYYY (example: 15-05-1990)' 
            });
        }

        // 7. Validate smartphone skill level
        if (!RegisterRequest.isValidSkillLevel(smartphoneSkillLevel)) {
            return res.status(400).json({ 
                success: false, 
                message: 'Smartphone skill level must be one of: BASIC, INTERMEDIATE, ADVANCED' 
            });
        }

        // 8. Check if user already exists
        const existingUser = await User.findByEmail(email);
        if (existingUser) {
            return res.status(400).json({ 
                success: false, 
                message: 'Email already registered' 
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

// Login
exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ 
                success: false, 
                message: 'Email and password are required' 
            });
        }

        const user = await User.findByEmail(email);
        if (!user) {
            return res.status(401).json({ 
                success: false, 
                message: 'Invalid email or password' 
            });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ 
                success: false, 
                message: 'Invalid email or password' 
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
            // Format date if needed
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