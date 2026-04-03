const ScheduleService = require('../services/scheduleService');
const NotificationService = require('../services/notificationService');

// Récupérer le planning du jour
exports.getTodaySchedule = async (req, res) => {
    try {
        const patientId = req.user.id;
        const today = new Date();
        const year = today.getFullYear();
        const month = String(today.getMonth() + 1).padStart(2, '0');
        const day = String(today.getDate()).padStart(2, '0');
        const todayStr = `${year}-${month}-${day}`;
        
        const schedule = await ScheduleService.getScheduleByDate(patientId, todayStr);
        
        res.json({
            success: true,
            data: {
                ...schedule,
                dayName: today.toLocaleDateString('fr-FR', { weekday: 'long' }),
                formattedDate: today.toLocaleDateString('fr-FR', { 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                })
            }
        });
    } catch (error) {
        console.error('Error in getTodaySchedule:', error);
        res.status(500).json({ success: false, message: 'Erreur lors du chargement du planning' });
    }
};

// Récupérer le planning pour une date spécifique
exports.getScheduleByDate = async (req, res) => {
    try {
        const patientId = req.user.id;
        const { date } = req.params;
        
        // S'assurer que la date est au bon format
        const targetDate = new Date(date);
        const year = targetDate.getFullYear();
        const month = String(targetDate.getMonth() + 1).padStart(2, '0');
        const day = String(targetDate.getDate()).padStart(2, '0');
        const formattedDate = `${year}-${month}-${day}`;
        
        const schedule = await ScheduleService.getScheduleByDate(patientId, formattedDate);
        
        const today = new Date();
        const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
        const isToday = formattedDate === todayStr;
        const isFuture = targetDate > today;
        
        res.json({
            success: true,
            data: {
                ...schedule,
                isToday,
                isFuture,
                dayName: targetDate.toLocaleDateString('fr-FR', { weekday: 'long' }),
                formattedDate: targetDate.toLocaleDateString('fr-FR', { 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                })
            }
        });
    } catch (error) {
        console.error('Error in getScheduleByDate:', error);
        res.status(500).json({ success: false, message: 'Erreur lors du chargement du planning' });
    }
};

// Récupérer les statistiques
exports.getStats = async (req, res) => {
    try {
        const patientId = req.user.id;
        const days = req.query.days || 30;
        
        const stats = await ScheduleService.getAdherenceStats(patientId, days);
        const streak = await ScheduleService.getCurrentStreak(patientId);
        
        res.json({
            success: true,
            data: {
                ...stats,
                currentStreak: streak,
                days
            }
        });
    } catch (error) {
        console.error('Error in getStats:', error);
        res.status(500).json({ success: false, message: 'Erreur lors du chargement des statistiques' });
    }
};

// Marquer une dose comme prise
exports.markAsTaken = async (req, res) => {
    try {
        const { scheduleId } = req.params;
        
        const success = await ScheduleService.markAsTaken(scheduleId);
        
        if (success) {
            res.json({ success: true, message: '✅ Dose marquée comme prise' });
        } else {
            res.status(400).json({ success: false, message: 'Impossible de marquer cette dose' });
        }
    } catch (error) {
        console.error('Error in markAsTaken:', error);
        res.status(500).json({ success: false, message: 'Erreur lors de la confirmation' });
    }
};