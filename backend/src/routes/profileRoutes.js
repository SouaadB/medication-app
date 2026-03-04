const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { 
    getProfile, 
    updateProfile, 
    changePassword,
    setupPatientProfile,
    getAllChronicConditions
} = require('../controllers/profileController');

// Toutes les routes sont protégées
router.use(protect);

// GET /profile/me
router.get('/me', getProfile);

// GET /profile/conditions
router.get('/conditions', getAllChronicConditions);

// POST /profile/setup
router.post('/setup', setupPatientProfile);

// PUT /profile/update
router.put('/update', updateProfile);

// PUT /profile/password (garde celle-ci)
router.put('/password', changePassword);

module.exports = router;
