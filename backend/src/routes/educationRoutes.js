// routes/educationRoutes.js
const express = require('express');
const router  = express.Router();
const {
    searchDictionary,
    getMedicationDetail,
    trackMedicationView,  
    getMedicationNames,
     // ← NEW
} = require('../controllers/educationController');
const { protect } = require('../middleware/authMiddleware');

router.use(protect);

router.get('/dictionary',          searchDictionary);
router.get('/dictionary/:id',      getMedicationDetail);
router.post('/track-view',         trackMedicationView);  // ← NEW
router.get('/medications/names', getMedicationNames);

module.exports = router;