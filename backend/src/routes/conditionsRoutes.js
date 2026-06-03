const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const conditionsController = require('../controllers/conditionsController');

// All routes are protected
router.use(protect);

// Get patient's conditions
router.get('/', conditionsController.getPatientConditions);

// Get available conditions to add
router.get('/available', conditionsController.getAvailableConditions);

// Add condition
router.post('/add', conditionsController.addCondition);

// Remove condition
router.delete('/remove/:conditionId', conditionsController.removeCondition);

module.exports = router;