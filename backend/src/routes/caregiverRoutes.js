const express = require('express');
const router = express.Router();
const { 
    getCaregivers, 
    addCaregiver, 
    removeCaregiver, 
    updateCaregiverStatus,
    acceptInvitation,
    getPatientsForCaregiver,
    getPatientDetails,
    toggleFollowPatient
} = require('../controllers/caregiverController');
const { protect } = require('../middleware/authMiddleware');

// Public route (no authentication needed)
router.post('/accept-invitation', acceptInvitation);

// All routes below require authentication
router.use(protect);

// Caregiver management
router.get('/', getCaregivers);
router.post('/', addCaregiver);
router.put('/:id/status', updateCaregiverStatus);
router.delete('/:id', removeCaregiver);

// Patient management for caregivers
router.get('/patients', getPatientsForCaregiver);
router.get('/patient/:id', getPatientDetails);
router.put('/patients/:id/follow', toggleFollowPatient);  // Follow/Unfollow patient

module.exports = router;