const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const healthReviewController = require('../controllers/healthReviewController');

// All routes are protected
router.use(protect);

// Dashboard
router.get('/dashboard', healthReviewController.getDashboard);

// Emergency contact routes
router.post('/emergency-contact', healthReviewController.saveEmergencyContact);
router.put('/emergency-contact/toggle', healthReviewController.toggleEmergencyContact);
router.delete('/emergency-contact', healthReviewController.deleteEmergencyContact);

module.exports = router;