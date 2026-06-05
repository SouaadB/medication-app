const express = require('express');
const router = express.Router();
const assessmentController = require('../controllers/assessmentController');
const { protect } = require('../middleware/authMiddleware');

// Test route (no auth)
router.get('/test', (req, res) => {
    res.json({ success: true, message: 'Assessment API is working' });
});

// Protected routes
router.use(protect);

router.post('/generate/:patientId', assessmentController.generateAssessment);
router.get('/:patientId', assessmentController.getLatestAssessment);
router.get('/:patientId/history', assessmentController.getAssessmentHistory);

module.exports = router;