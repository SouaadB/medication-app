// routes/educationRoutes.js
const express = require('express');
const router  = express.Router();
const {
    searchDictionary,
    getMedicationDetail,
    trackMedicationView,       // ← NEW
} = require('../controllers/educationController');
const { protect } = require('../middleware/authMiddleware');

router.use(protect);

router.get('/dictionary',          searchDictionary);
router.get('/dictionary/:id',      getMedicationDetail);
router.post('/track-view',         trackMedicationView);  // ← NEW

module.exports = router;