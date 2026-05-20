const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const locationController = require('../controllers/locationController');

// All routes require authentication
router.use(protect);

// Patient updates their location
router.post('/update', locationController.updateLocation);

// Caregiver gets patient location
router.get('/patient/:patient_id', locationController.getPatientLocation);

// Patient toggles location sharing
router.put('/patient/:patient_id/toggle', locationController.toggleLocationSharing);

module.exports = router;