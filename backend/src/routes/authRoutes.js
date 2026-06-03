const express = require('express');
const router = express.Router();
const { 
    register, 
    verifyEmail,
    login, 
    getMe, 
    logout,
    forgotPassword,
    resetPassword,
    requestResetCode,
    verifyResetCode,
    resetPasswordWithCode,
    // New caregiver password reset functions
    requestCaregiverResetCode,
    verifyCaregiverResetCode,
    resetCaregiverPassword
} = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');

router.post('/register', register);
router.get('/verify-email',verifyEmail);
router.post('/login', login);
router.post('/logout', logout);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);
router.post('/request-reset-code', requestResetCode);
router.post('/verify-reset-code', verifyResetCode);
router.post('/reset-password-code', resetPasswordWithCode);
router.get('/me', protect, getMe);


// ✅ NEW: Caregiver password reset routes
router.post('/caregiver/request-reset-code', requestCaregiverResetCode);
router.post('/caregiver/verify-reset-code', verifyCaregiverResetCode);
router.post('/caregiver/reset-password', resetCaregiverPassword);

module.exports = router;