const express = require('express');
const router  = express.Router();
const { protect } = require('../middleware/authMiddleware');
const {
  getPatientSignals,
  generateSignals,
  getPatientHistory,
  getCaregiverSignals,
} = require('../controllers/signalController');

// ─────────────────────────────────────────────────────────────────────────────
// SIGNAL ROUTES — Early Warning System
// All routes require authentication
// Base path: /api/signals  (registered in app.js)
// ─────────────────────────────────────────────────────────────────────────────

// Patient routes
router.get('/patient/:patientId',         protect , getPatientSignals);
router.get('/patient/:patientId/history', protect , getPatientHistory);

// Force-generate (used by cron + manual testing)
router.post('/generate/:patientId',       protect , generateSignals);

// Caregiver route
router.get('/caregiver/:email',           protect , getCaregiverSignals);

module.exports = router;