const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const healthReviewController = require('../controllers/healthReviewController');

// All routes are protected
router.use(protect);

// Dashboard
router.get('/dashboard', healthReviewController.getDashboard);

module.exports = router;
