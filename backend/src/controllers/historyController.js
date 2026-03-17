const HistoryService = require('../services/historyService');

// Récupérer l'historique groupé
exports.getGroupedHistory = async (req, res) => {
    try {
        const patientId = req.user.id;
        const days = req.query.days || 30;
        
        const history = await HistoryService.getGroupedHistory(patientId, days);
        
        res.json({
            success: true,
            data: history
        });
    } catch (error) {
        console.error('Error in getGroupedHistory:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Erreur lors du chargement de l\'historique' 
        });
    }
};

// Récupérer l'historique pour une date spécifique
exports.getHistoryByDate = async (req, res) => {
    try {
        const patientId = req.user.id;
        const { date } = req.params;
        
        const history = await HistoryService.getHistoryByDate(patientId, date);
        
        res.json({
            success: true,
            data: history
        });
    } catch (error) {
        console.error('Error in getHistoryByDate:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Erreur lors du chargement de l\'historique' 
        });
    }
};

// Récupérer les statistiques d'observance
exports.getAdherenceStats = async (req, res) => {
    try {
        const patientId = req.user.id;
        const days = req.query.days || 30;
        
        const stats = await HistoryService.getAdherenceStats(patientId, days);
        
        res.json({
            success: true,
            data: stats
        });
    } catch (error) {
        console.error('Error in getAdherenceStats:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Erreur lors du chargement des statistiques' 
        });
    }
};

// Récupérer les tendances hebdomadaires
exports.getWeeklyTrends = async (req, res) => {
    try {
        const patientId = req.user.id;
        const weeks = req.query.weeks || 4;
        
        const trends = await HistoryService.getWeeklyTrends(patientId, weeks);
        
        res.json({
            success: true,
            data: trends
        });
    } catch (error) {
        console.error('Error in getWeeklyTrends:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Erreur lors du chargement des tendances' 
        });
    }
};

// Récupérer les médicaments les plus manqués
exports.getMostMissedMedications = async (req, res) => {
    try {
        const patientId = req.user.id;
        const limit = req.query.limit || 5;
        
        const missed = await HistoryService.getMostMissedMedications(patientId, limit);
        
        res.json({
            success: true,
            data: missed
        });
    } catch (error) {
        console.error('Error in getMostMissedMedications:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Erreur lors du chargement des médicaments manqués' 
        });
    }
};