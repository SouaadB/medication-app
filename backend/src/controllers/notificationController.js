const NotificationService = require('../services/notificationService');

// Récupérer toutes les notifications
exports.getNotifications = async (req, res) => {
    try {
        const patientId = req.user.id;
        const limit = req.query.limit || 50;
        
        const result = await NotificationService.getAllNotifications(patientId, limit);
        
        res.json({
            success: true,
            data: result
        });
    } catch (error) {
        console.error('Error in getNotifications:', error);
        res.status(500).json({ success: false, message: 'Erreur lors du chargement des notifications' });
    }
};

// Récupérer les notifications non lues
exports.getUnreadNotifications = async (req, res) => {
    try {
        const patientId = req.user.id;
        
        const notifications = await NotificationService.getUnreadNotifications(patientId);
        
        res.json({
            success: true,
            data: {
                notifications,
                count: notifications.length
            }
        });
    } catch (error) {
        console.error('Error in getUnreadNotifications:', error);
        res.status(500).json({ success: false, message: 'Erreur lors du chargement des notifications' });
    }
};

// Marquer une notification comme lue
exports.markAsRead = async (req, res) => {
    try {
        const { notificationId } = req.params;
        
        const success = await NotificationService.markAsRead(notificationId);
        
        if (success) {
            res.json({ success: true, message: 'Notification marquée comme lue' });
        } else {
            res.status(404).json({ success: false, message: 'Notification non trouvée' });
        }
    } catch (error) {
        console.error('Error in markAsRead:', error);
        res.status(500).json({ success: false, message: 'Erreur lors de la mise à jour' });
    }
};

// Marquer toutes les notifications comme lues
exports.markAllAsRead = async (req, res) => {
    try {
        const patientId = req.user.id;
        
        const count = await NotificationService.markAllAsRead(patientId);
        
        res.json({ 
            success: true, 
            message: `${count} notifications marquées comme lues`,
            count
        });
    } catch (error) {
        console.error('Error in markAllAsRead:', error);
        res.status(500).json({ success: false, message: 'Erreur lors de la mise à jour' });
    }
};