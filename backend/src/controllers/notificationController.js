const NotificationService = require('../services/notificationService');
const FirebaseService     = require('../services/firebaseService');
const db                  = require('../config/database');

exports.getNotifications = async (req, res) => {
    try {
        const patientId = req.user.id;
        const limit     = req.query.limit || 50;
        const result    = await NotificationService.getAllNotifications(patientId, limit);
        res.json({ success: true, data: result });
    } catch (error) {
        console.error('Error in getNotifications:', error);
        res.status(500).json({ success: false, message: 'Error loading notifications' });
    }
};

exports.getUnreadNotifications = async (req, res) => {
    try {
        const patientId     = req.user.id;
        const notifications = await NotificationService.getUnreadNotifications(patientId);
        res.json({ success: true, data: { notifications, count: notifications.length } });
    } catch (error) {
        console.error('Error in getUnreadNotifications:', error);
        res.status(500).json({ success: false, message: 'Error loading notifications' });
    }
};

exports.markAsRead = async (req, res) => {
    try {
        const { notificationId } = req.params;
        const success = await NotificationService.markAsRead(notificationId);
        if (success) {
            res.json({ success: true, message: 'Notification marked as read' });
        } else {
            res.status(404).json({ success: false, message: 'Notification not found' });
        }
    } catch (error) {
        console.error('Error in markAsRead:', error);
        res.status(500).json({ success: false, message: 'Error updating notification' });
    }
};

exports.markAllAsRead = async (req, res) => {
    try {
        const patientId = req.user.id;
        const count     = await NotificationService.markAllAsRead(patientId);
        res.json({ success: true, message: `${count} notifications marked as read`, count });
    } catch (error) {
        console.error('Error in markAllAsRead:', error);
        res.status(500).json({ success: false, message: 'Error updating notifications' });
    }
};

// ── SNOOZE ────────────────────────────────────────────────────────────────────
exports.snoozeNotification = async (req, res) => {
    try {
        const patientId  = req.user.id;
        const scheduleId = req.params.scheduleId;
        const minutes    = parseInt(req.body.minutes) || 15;

        if (![15, 30, 60].includes(minutes)) {
            return res.status(400).json({ success: false, message: 'Invalid snooze duration. Use 15, 30, or 60.' });
        }

        const [rows] = await db.execute(
            `SELECT ms.id, ms.patient_id, ms.scheduled_date_time,
                    t.medication_name, t.dosage, t.priority, t.id AS treatment_id,
                    p.fcm_token
             FROM medication_schedules ms
             JOIN treatments t ON ms.treatment_id = t.id
             JOIN patients p   ON ms.patient_id   = p.id
             WHERE ms.id = ? AND ms.patient_id = ?`,
            [scheduleId, patientId]
        );

        if (rows.length === 0) {
            return res.status(404).json({ success: false, message: 'Schedule not found' });
        }

        const dose = rows[0];

        // Calculate snooze time in Algeria timezone (UTC+2 in summer)
        const snoozeTime    = new Date(Date.now() + minutes * 60 * 1000);
        const algeriaOffset = 2 * 60 * 60 * 1000;
        const localSnooze   = new Date(snoozeTime.getTime() + algeriaOffset);
        const snoozeHour    = String(localSnooze.getUTCHours()).padStart(2, '0');
        const snoozeMin     = String(localSnooze.getUTCMinutes()).padStart(2, '0');
        const snoozeTimeStr = `${snoozeHour}:${snoozeMin}`;

        await db.execute(
            `INSERT INTO notifications
             (patient_id, type, title, message, data, scheduled_time)
             VALUES (?, 'reminder', ?, ?, ?, ?)`,
            [
                patientId,
                `⏰ Reminder: ${dose.medication_name}`,
                `Your dose of ${dose.medication_name}${dose.dosage ? ' ' + dose.dosage : ''} has been snoozed until ${snoozeTimeStr}.`,
                JSON.stringify({
                    schedule_id:  dose.id,
                    treatment_id: dose.treatment_id,
                    stage:        'SNOOZE',
                    priority:     dose.priority,
                    snooze_until: snoozeTime.toISOString(),
                }),
                snoozeTime,
            ]
        );

        if (dose.fcm_token) {
            await FirebaseService.sendPushNotification(
                dose.fcm_token,
                `😴 Snoozed ${minutes} min`,
                `Reminder for ${dose.medication_name} set for ${snoozeTimeStr}`,
                {
                    schedule_id:  String(dose.id),
                    type:         'snooze_confirm',
                    snooze_until: snoozeTime.toISOString(),
                }
            );
        }

        res.json({ success: true, message: `Snoozed for ${minutes} minutes`, snooze_until: snoozeTime });

    } catch (error) {
        console.error('snoozeNotification error:', error);
        res.status(500).json({ success: false, message: 'Error snoozing notification' });
    }
};

// ── DAILY SUMMARY ─────────────────────────────────────────────────────────────
exports.generateDailySummary = async () => {
    try {
        const today = new Date().toISOString().split('T')[0];

        const [patients] = await db.execute(
            `SELECT id, fcm_token, all_notifications
             FROM patients
             WHERE is_active = true AND all_notifications = true`
        );

        let sent = 0;

        for (const patient of patients) {
            const [statsRows] = await db.execute(
                `SELECT
                    COUNT(*) AS total,
                    SUM(CASE WHEN status = 'TAKEN'     THEN 1 ELSE 0 END) AS taken,
                    SUM(CASE WHEN status = 'MISSED'    THEN 1 ELSE 0 END) AS missed,
                    SUM(CASE WHEN status = 'SKIPPED'   THEN 1 ELSE 0 END) AS skipped,
                    SUM(CASE WHEN status = 'SCHEDULED' AND scheduled_date_time < NOW() THEN 1 ELSE 0 END) AS overdue
                 FROM medication_schedules
                 WHERE patient_id = ? AND DATE(scheduled_date_time) = ?`,
                [patient.id, today]
            );

            const s = statsRows[0];
            if (!s || s.total === 0) continue;

            const [existing] = await db.execute(
                `SELECT 1 FROM notifications
                 WHERE patient_id = ? AND type = 'summary' AND DATE(created_at) = ?`,
                [patient.id, today]
            );
            if (existing.length > 0) continue;

            const pct   = Math.round((s.taken / s.total) * 100);
            const emoji = pct >= 90 ? '🌟' : pct >= 70 ? '👍' : pct >= 50 ? '⚠️' : '❌';
            const title = `${emoji} Daily Summary`;

            let message;
            const remaining = parseInt(s.total) - parseInt(s.taken) - parseInt(s.missed || 0) - parseInt(s.skipped || 0);
            if (remaining > 0) {
                message = `${s.taken}/${s.total} doses taken. ${remaining} still to take this evening.`;
            } else if (parseInt(s.missed) === 0 && parseInt(s.skipped || 0) === 0) {
                message = `🎉 Perfect! All ${s.total} doses taken today (${pct}%).`;
            } else {
                message = `${s.taken}/${s.total} doses taken (${pct}%). ${s.missed || 0} missed, ${s.skipped || 0} skipped.`;
            }

            await db.execute(
                `INSERT INTO notifications (patient_id, type, title, message, data, scheduled_time)
                 VALUES (?, 'summary', ?, ?, ?, NOW())`,
                [
                    patient.id,
                    title,
                    message,
                    JSON.stringify({ date: today, taken: s.taken, total: s.total, pct }),
                ]
            );

            if (patient.fcm_token) {
                await FirebaseService.sendPushNotification(
                    patient.fcm_token, title, message,
                    { type: 'daily_summary', date: today, pct: String(pct) }
                );
                sent++;
            }
        }

        console.log(`[DailySummary] ✅ Sent to ${sent} patients`);
        return sent;

    } catch (error) {
        console.error('[DailySummary] Error:', error.message);
        return 0;
    }
};