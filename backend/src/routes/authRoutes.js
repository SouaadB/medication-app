const express = require('express');
const router = express.Router();
const { 
    register, 
    login, 
    getMe, 
    logout,
    forgotPassword,
    resetPassword,
    requestResetCode,
    verifyResetCode,
    resetPasswordWithCode
} = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');

router.post('/register', register);
router.post('/login', login);  // ← Maintenant accepte email OU téléphone
router.post('/logout', logout);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);
router.post('/request-reset-code', requestResetCode);      // ← Nouvelle
router.post('/verify-reset-code', verifyResetCode);        // ← Nouvelle
router.post('/reset-password-code', resetPasswordWithCode); // ← Nouvelle
router.get('/me', protect, getMe);

module.exports = router;