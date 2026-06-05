const express = require('express');
const router  = express.Router();
const { protect } = require('../middleware/authMiddleware');
const {
  getPatientSignals,
  generateSignals,
  getPatientHistory,
  getCaregiverSignals,
} = require('../controllers/signalController');

router.get('/patient/:patientId',         protect, getPatientSignals);
router.get('/patient/:patientId/history', protect, getPatientHistory);
router.post('/generate/:patientId',       protect, generateSignals);
router.get('/caregiver/:email',           protect, getCaregiverSignals);

module.exports = router;