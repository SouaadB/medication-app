const cron                     = require('node-cron');
const NotificationService      = require('../services/notificationService');
const { generateDailySummary } = require('../controllers/notificationController');
const CaregiverNotificationService  = require('../services/caregiverNotificationService');

function startNotificationJobs() {
    console.log('🔔 Starting notification cron jobs...');

    // Job 1: Smart reminders — every minute
cron.schedule('* * * * *', async () => {
    try {
        const sent = await NotificationService.generateSmartReminders();
        console.log(`[Job 1] ✅ ran at ${new Date().toLocaleTimeString()} — ${sent} reminders sent`);
    } catch (e) { console.error('[Job 1] ❌', e.message); }
});

    // Job 2: Missed doses — every 5 minutes
    cron.schedule('*/5 * * * *', async () => {
        try {
            const count = await NotificationService.markMissedDoses();
            if (count > 0) console.log(`[Job 2] ⏰ ${count} doses marked MISSED`);
        } catch (e) { console.error('[Job 2] ❌', e.message); }
    });

    // Job 3: Achievements — every 30 minutes
    cron.schedule('*/30 * * * *', async () => {
        try {
            const db = require('../config/database');
            const [patients] = await db.execute('SELECT id FROM patients WHERE is_active = true AND all_notifications = true');
            let total = 0;
            for (const p of patients) total += await NotificationService.checkProgress(p.id);
            if (total > 0) console.log(`[Job 3] 🏆 ${total} achievements sent`);
        } catch (e) { console.error('[Job 3] ❌', e.message); }
    });

    // Job 4: Daily summary — every day at 20:00
    cron.schedule('0 20 * * *', async () => {
        try {
            const sent = await generateDailySummary();
            console.log(`[Job 4] 📊 Daily summary sent to ${sent} patients`);
        } catch (e) { console.error('[Job 4] ❌', e.message); }
    });
    // Job 5: Caregiver emergency alerts — every 5 minutes
    cron.schedule('*/5 * * * *', async () => {
        try {
            await CaregiverNotificationService.sendEmergencyAlerts();
        } catch (e) { console.error('[Job 5] ❌', e.message); }
    });

    // Job 6: Caregiver daily summary — every day at 20:30
    cron.schedule('30 20 * * *', async () => {
        try {
            await CaregiverNotificationService.sendDailySummary();
            console.log('[Job 6] 📊 Caregiver daily summaries sent');
        } catch (e) { console.error('[Job 6] ❌', e.message); }
    });

  
    console.log('✅ Jobs: reminders(1min) | missed(5min) | achievements(30min) | summary(20:00) | caregiver-emergency(5min) | caregiver-summary(20:30)');

   
}

module.exports = { startNotificationJobs };