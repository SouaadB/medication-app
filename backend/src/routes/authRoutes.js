const express = require('express');
const router = express.Router();
const { 
    register, 
    login, 
    getMe, 
    logout,
    forgotPassword,  // ← Ajoute ceci
    resetPassword    // ← Ajoute ceci (optionnel)
} = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');

router.post('/register', register);
router.post('/login', login);
router.post('/logout', logout);
router.post('/forgot-password', forgotPassword);  // ← Ajoute ceci
router.post('/reset-password', resetPassword);    // ← Ajoute ceci (optionnel)
router.get('/me', protect, getMe);

module.exports = router;