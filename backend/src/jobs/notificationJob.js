const cron = require('node-cron');
const NotificationService = require('../services/notificationService');

// Exécuter chaque minute pour une précision accrue des rappels
cron.schedule('* * * * *', async () => {
    console.log('🔄 [Job] Vérification des rappels de médicaments...');
    
    try {
        // 1. Générer les différents stages de rappels (Early, Main, Missed)
        const reminders = await NotificationService.generateSmartReminders();
        if (reminders > 0) {
            console.log(`✅ [Job] ${reminders} notifications générées`);
        }
        
        // 2. Traitement automatique des doses manquées (si pas déjà fait)
        const missed = await NotificationService.markMissedDoses();
        if (missed > 0) {
            console.log(`✅ [Job] ${missed} doses marquées comme manquées`);
        }
        
    } catch (error) {
        console.error('❌ [Job] Erreur:', error);
    }
});

console.log('⏰ Job de notifications démarré');