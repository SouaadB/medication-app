const express = require('express');
const router = express.Router();
const { 
    getCaregivers, 
    addCaregiver, 
    removeCaregiver, 
    updateCaregiverStatus,
    acceptInvitation,
    getPatientsForCaregiver,
    getProfile, updateProfile,
    changePassword ,
    getPatientDetails, 
     unfollowPatient,
    getNotifications,
    getNotificationCount, 
    sendReminder 
} = require('../controllers/caregiverController');
const { protect } = require('../middleware/authMiddleware');

router.post('/accept-invitation', acceptInvitation);
router.get('/test-notifs', async (req, res) => {
    const CaregiverNotificationService = require('../services/caregiverNotificationService');
    await CaregiverNotificationService.sendEmergencyAlerts();
    res.json({ success: true, message: 'Emergency alerts triggered' });
});

router.get('/test-summary', async (req, res) => {
    const CaregiverNotificationService = require('../services/caregiverNotificationService');
    await CaregiverNotificationService.sendDailySummary();
    res.json({ success: true, message: 'Daily summary triggered' });
});

router.use(protect);
router.post('/remind/:patientId', sendReminder);

router.get('/notifications',       getNotifications);
router.get('/notifications/count', getNotificationCount);

router.get('/profile',  getProfile);
router.put('/profile',  updateProfile);
router.put('/password', changePassword);
router.get('/', getCaregivers);
router.post('/', addCaregiver);
router.put('/:id/status', updateCaregiverStatus);
router.delete('/:id', removeCaregiver);
router.delete('/unfollow/:patientId', unfollowPatient);

router.get('/patients', getPatientsForCaregiver);
router.get('/patient/:id', getPatientDetails);

module.exports = router;