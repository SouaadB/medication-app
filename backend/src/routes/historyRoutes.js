const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const historyController = require('../controllers/historyController');

// Toutes les routes sont protégées
router.use(protect);

// Historique groupé
router.get('/grouped', historyController.getGroupedHistory);

// Historique par date
router.get('/date/:date', historyController.getHistoryByDate);

// Statistiques
router.get('/stats', historyController.getAdherenceStats);

// Tendances
router.get('/trends', historyController.getWeeklyTrends);

// Médicaments les plus manqués
router.get('/missed', historyController.getMostMissedMedications);

module.exports = router;