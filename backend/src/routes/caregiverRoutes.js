const express = require('express');
const router = express.Router();
const { 
    getCaregivers, 
    addCaregiver, 
    removeCaregiver, 
    updateCaregiverStatus,
    acceptInvitation,
    getPatientsForCaregiver,
    getPatientDetails
} = require('../controllers/caregiverController');
const { protect } = require('../middleware/authMiddleware');

router.post('/accept-invitation', acceptInvitation);

router.use(protect);
router.get('/', getCaregivers);
router.post('/', addCaregiver);
router.put('/:id/status', updateCaregiverStatus);
router.delete('/:id', removeCaregiver);

router.get('/patients', getPatientsForCaregiver);
router.get('/patient/:id', getPatientDetails);

module.exports = router;