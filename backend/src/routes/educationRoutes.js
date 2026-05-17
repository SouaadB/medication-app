const express = require('express');
const router = express.Router();
const { searchDictionary, getMedicationDetail } = require('../controllers/educationController');
const { protect } = require('../middleware/authMiddleware');
const algerianMedications = require('../data/algerianMedications');




router.use(protect);

router.get('/dictionary', searchDictionary);
router.get('/dictionary/:id', getMedicationDetail);

module.exports = router;
