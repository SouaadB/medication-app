const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { 
    getProfile, 
    updateProfile, 
    changePassword,
    setupPatientProfile,
    getAllChronicConditions,
    updateSettings,
    updateDailySchedule,
    deleteAccount,
    getCaregiverProfile,
    updateCaregiverProfile,
    changeCaregiverPassword
} = require('../controllers/profileController');

// Toutes les routes sont protégées
router.use(protect);

// Patient routes
router.get('/me', getProfile);
router.get('/conditions', getAllChronicConditions);
router.post('/setup', setupPatientProfile);
router.put('/update', updateProfile);
router.put('/password', changePassword);
router.put('/settings', updateSettings);
router.put('/daily-schedule', updateDailySchedule);
router.delete('/account', deleteAccount);

// Caregiver routes
router.get('/caregiver/me', getCaregiverProfile);
router.put('/caregiver/update', updateCaregiverProfile);
router.post('/caregiver/change-password', changeCaregiverPassword);

module.exports = router;