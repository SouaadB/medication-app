const express = require('express');
const router = express.Router();
const { 
    getCaregivers, 
    addCaregiver, 
    removeCaregiver, 
    updateCaregiverStatus 
} = require('../controllers/caregiverController');
const { protect } = require('../middleware/authMiddleware');

router.use(protect);

router.get('/', getCaregivers);
router.post('/', addCaregiver);
router.put('/:id/status', updateCaregiverStatus);
router.delete('/:id', removeCaregiver);

module.exports = router;
