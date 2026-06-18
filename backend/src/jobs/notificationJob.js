const cron                     = require('node-cron');
const NotificationService      = require('../services/notificationService');
const { generateDailySummary } = require('../controllers/notificationController');
const CaregiverNotificationService  = require('../services/caregiverNotificationService');
const { analyzeAndSave } = require('../services/adherenceSignalService');
     
let _jobsStarted = false;
function startNotificationJobs() {
    if (_jobsStarted) {
        console.warn('⚠️ Notification jobs already running — skipping duplicate start');
        return;
    }
    _jobsStarted = true;
    console.log('🔔 Starting notification cron jobs...');

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
            console.log(`[Job 2] ✅ ran at ${new Date().toLocaleTimeString()} — ${count} doses marked MISSED`);
        } catch (e) { console.error('[Job 2] ❌', e.message); }
    });

    // Job 3: Achievements — every 30 minutes
    cron.schedule('*/30 * * * *', async () => {
        try {
            const db = require('../config/database');
            const [patients] = await db.execute('SELECT id FROM patients WHERE is_active = true AND all_notifications = true');
            let total = 0;
            for (const p of patients) total += await NotificationService.checkProgress(p.id);
            console.log(`[Job 3] ✅ ran at ${new Date().toLocaleTimeString()} — ${total} achievements sent`);
        } catch (e) { console.error('[Job 3] ❌', e.message); }
    });

    // Job 4: Daily summary — every day at 21:00
    cron.schedule('0 21 * * *', async () => {
        try {
            const sent = await generateDailySummary();
            console.log(`[Job 4] ✅ ran at ${new Date().toLocaleTimeString()} — daily summary sent to ${sent} patients`);
        } catch (e) { console.error('[Job 4] ❌', e.message); }
    });

    // Job 5: Caregiver emergency alerts — every 5 minutes
    cron.schedule('*/5 * * * *', async () => {
        try {
            await CaregiverNotificationService.sendEmergencyAlerts();
            console.log(`[Job 5] ✅ ran at ${new Date().toLocaleTimeString()}`);
        } catch (e) { console.error('[Job 5] ❌', e.message); }
    });

    // Job 6: Caregiver daily summary — every day at 21:30
    cron.schedule('30 21 * * *', async () => {
        try {
            await CaregiverNotificationService.sendDailySummary();
            console.log(`[Job 6] ✅ ran at ${new Date().toLocaleTimeString()} — caregiver daily summaries sent`);
        } catch (e) { console.error('[Job 6] ❌', e.message); }
    });
    // Job 7: AI Early Warning — every 6 hours for all active patients
    cron.schedule('0 */6 * * *', async () => {
        try {
            const db = require('../config/database');
            const [patients] = await db.execute(
                'SELECT id FROM patients WHERE is_active = 1'
            );
            let count = 0;
            for (const p of patients) {
                try {
                    await analyzeAndSave(p.id);
                    count++;
                } catch (e) {
                    console.error(`[Job 7] ❌ patient ${p.id}:`, e.message);
                }
            }
            console.log(`[Job 7] ✅ ran at ${new Date().toLocaleTimeString()} — forecasts updated for ${count} patients`);
        } catch (e) { console.error('[Job 7] ❌', e.message); }
    });

   
}

module.exports = { startNotificationJobs };