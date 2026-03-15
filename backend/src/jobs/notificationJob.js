const cron = require('node-cron');
const NotificationService = require('../services/notificationService');

// Exécuter toutes les 15 minutes
cron.schedule('*/15 * * * *', async () => {
    console.log('🔄 Génération des notifications...');
    
    try {
        // Générer les rappels
        const reminders = await NotificationService.generateReminders();
        if (reminders > 0) {
            console.log(`✅ ${reminders} rappels générés`);
        }
        
        // Marquer les doses manquées
        const missed = await NotificationService.markMissedDoses();
        if (missed > 0) {
            console.log(`✅ ${missed} doses marquées comme manquées`);
        }
        
    } catch (error) {
        console.error('❌ Erreur dans le job:', error);
    }
});

console.log('⏰ Job de notifications démarré');