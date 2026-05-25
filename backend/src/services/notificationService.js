const db              = require('../config/database');
const SchedulerService  = require('./schedulerService');
const ScheduleService   = require('./scheduleService');
const FirebaseService  = require('./firebaseService');
const CaregiverNotificationService = require('./caregiverNotificationService');

class NotificationService {

    static async getAllNotifications(patientId, limit = 50) {
        try {
            const [rows] = await db.execute(
                `SELECT * FROM notifications WHERE patient_id = ? ORDER BY created_at DESC`,
                [patientId]
            );
            const limitedRows = rows.slice(0, limit);
            const unreadCount = rows.filter(n => !n.is_read).length;
            return { notifications: limitedRows, unreadCount };
        } catch (error) {
            console.error('Error in getAllNotifications:', error);
            throw error;
        }
    }

    static async getUnreadNotifications(patientId) {
        try {
            const [rows] = await db.execute(
                `SELECT * FROM notifications WHERE patient_id = ? AND is_read = false ORDER BY created_at DESC`,
                [patientId]
            );
            return rows;
        } catch (error) {
            console.error('Error in getUnreadNotifications:', error);
            throw error;
        }
    }

    static async markAsRead(notificationId) {
        try {
            const [result] = await db.execute(
                'UPDATE notifications SET is_read = true WHERE id = ?',
                [notificationId]
            );
            return result.affectedRows > 0;
        } catch (error) {
            console.error('Error in markAsRead:', error);
            throw error;
        }
    }

    static async markAllAsRead(patientId) {
        try {
            const [result] = await db.execute(
                'UPDATE notifications SET is_read = true WHERE patient_id = ? AND is_read = false',
                [patientId]
            );
            return result.affectedRows;
        } catch (error) {
            console.error('Error in markAllAsRead:', error);
            throw error;
        }
    }

    static async clearNotificationsByTreatment(treatmentId) {
        try {
            await db.execute(
                `DELETE FROM notifications WHERE JSON_EXTRACT(data, '$.treatment_id') = ?`,
                [treatmentId]
            );
        } catch (error) {
            console.error('Error in clearNotificationsByTreatment:', error);
        }
    }

    static async createNotification(patientId, type, title, message, data = {}) {
        try {
            const [result] = await db.execute(
                `INSERT INTO notifications (patient_id, type, title, message, data, scheduled_time)
                 VALUES (?, ?, ?, ?, ?, NOW())`,
                [patientId, type, title, message, JSON.stringify(data)]
            );
            return result.insertId;
        } catch (error) {
            console.error('Error in createNotification:', error);
            throw error;
        }
    }

    static async generateSmartReminders() {
        try {
            await db.execute("SET time_zone = '+01:00'");

            const [doses] = await db.execute(`
                SELECT
                    ms.id                        AS schedule_id,
                    ms.patient_id,
                    ms.scheduled_date_time,
                    t.medication_name,
                    t.dosage,
                    t.frequency,
                    t.priority,
                    t.id                         AS treatment_id,
                    p.fcm_token,
                    p.quiet_hours_enabled,
                    p.quiet_hours_start,
                    p.quiet_hours_end,
                    p.quiet_hours_days,
                    p.critical_alerts_enabled,
                    p.medication_reminders,
                    p.all_notifications,
                    p.sound_enabled,
                    p.wake_time,
                    p.bedtime,
                    c.name                       AS condition_name
                FROM medication_schedules ms
                JOIN treatments t  ON ms.treatment_id = t.id
                JOIN patients p    ON ms.patient_id    = p.id
                LEFT JOIN chronic_conditions c ON t.condition_id = c.id
                WHERE ms.status = 'SCHEDULED'
                AND DATE(ms.scheduled_date_time) = CURDATE()
            `);

            let sent = 0;

            for (const dose of doses) {
                if (!dose.all_notifications || !dose.medication_reminders) continue;
                if (this._shouldSuppress(dose)) continue;
                if (!this._isWithinWakingHours(dose)) continue;

                const now           = new Date();
                const rawDate       = dose.scheduled_date_time;
                const scheduledTime = new Date(typeof rawDate === 'string'
                    ? rawDate.replace(' ', 'T')
                    : rawDate);
                const diffMinutes   = Math.round((scheduledTime - now) / (1000 * 60)) - 60;

                const stages = this._getNotificationStages(dose);

                const todayCount = await this._countTodayNotificationsForDose(dose.schedule_id);
                if (todayCount >= 3 && dose.priority !== 'HIGH') continue;

                for (const stage of stages) {
                    const withinWindow = (diffMinutes <= stage.offset) &&
                                         (diffMinutes > stage.offset - 2);
                    if (!withinWindow) continue;

                    const alreadySent = await this._checkNotificationExists(dose.schedule_id, stage.type);
                    if (alreadySent) continue;

                    const template = this._getTemplate(dose, stage.template);

                    await this.createNotification(
                        dose.patient_id,
                        'reminder',
                        template.title,
                        template.message,
                        {
                            schedule_id:    dose.schedule_id,
                            treatment_id:   dose.treatment_id,
                            stage:          stage.type,
                            priority:       dose.priority,
                            condition:      dose.condition_name || null,
                        }
                    );

                    if (dose.fcm_token) {
                        await FirebaseService.sendPushNotification(
                            dose.fcm_token,
                            template.title,
                            template.message,
                            {
                                schedule_id:  String(dose.schedule_id),
                                treatment_id: String(dose.treatment_id),
                                type:         'medication_reminder',
                                stage:        stage.type,
                                priority:     dose.priority || 'MEDIUM',
                            },
                            dose.priority === 'HIGH'
                        );
                    }

                    sent++;
                }
            }

            if (sent > 0) console.log(`[NotificationService] ✅ Sent ${sent} push notifications`);
            return sent;

        } catch (error) {
            console.error('[NotificationService] Error in generateSmartReminders:', error);
            throw error;
        }
    }

    static _getNotificationStages(dose) {
        const priority = dose.priority || 'MEDIUM';
        const freq     = dose.frequency || '';

        if (freq.includes('Before sleeping') || freq.includes('Bedtime')) {
            return [
                { type: 'PREP', offset: 45, template: 'BEDTIME_PREP' },
                { type: 'MAIN', offset: 15, template: 'BEDTIME_MAIN' },
            ];
        }

        if (freq.includes('Empty stomach')) {
            return [
                { type: 'PREP',        offset: 30,  template: 'EMPTY_STOMACH_PREP' },
                { type: 'MAIN',        offset: 0,   template: 'MAIN' },
                { type: 'SAFE_TO_EAT', offset: -60, template: 'EMPTY_STOMACH_SAFE' },
            ];
        }

        if (freq.includes('Every')) {
            return [
                { type: 'MAIN',   offset: 0,   template: 'MAIN' },
                { type: 'MISSED', offset: -30, template: 'MISSED' },
            ];
        }

        if (priority === 'HIGH') {
            return [
                { type: 'EARLY',      offset: 30,  template: 'EARLY_HIGH' },
                { type: 'MAIN',       offset: 0,   template: 'MAIN_HIGH' },
                { type: 'FOLLOW_UP',  offset: -15, template: 'FOLLOW_UP' },
                { type: 'ESCALATION', offset: -45, template: 'ESCALATION' },
            ];
        }

        if (priority === 'MEDIUM') {
            return [
                { type: 'EARLY',  offset: 15,  template: 'EARLY' },
                { type: 'MAIN',   offset: 0,   template: 'MAIN' },
                { type: 'MISSED', offset: -30, template: 'MISSED' },
            ];
        }

        return [{ type: 'MAIN', offset: 0, template: 'MAIN' }];
    }

    static _getTemplate(dose, templateKey) {
        const name     = dose.medication_name;
        const dosage   = dose.dosage ? ` ${dose.dosage}` : '';
        const relation = this._getRelationText(dose.frequency);
        const cond     = dose.condition_name ? ` (${dose.condition_name})` : '';

        const library = {
            MAIN: {
                title:   '💊 Time to take your medication',
                message: `Take ${name}${dosage}${relation ? ' ' + relation : ''}${cond}.`,
            },
            MAIN_HIGH: {
                title:   '⚠️ IMPORTANT — Critical medication',
                message: `Take ${name}${dosage}${relation ? ' ' + relation : ''}${cond} NOW.`,
            },
            EARLY: {
                title:   '🕒 Reminder in 15 minutes',
                message: `Prepare ${name}${dosage} — due in 15 min${relation ? ' ' + relation : ''}.`,
            },
            EARLY_HIGH: {
                title:   '⏰ Critical medication in 30 min',
                message: `Prepare ${name}${dosage} — critical dose due in 30 minutes.`,
            },
            MISSED: {
                title:   '❗ Missed dose',
                message: `You have not taken ${name}${dosage} yet. Take it now if possible.`,
            },
            FOLLOW_UP: {
                title:   '⚠️ Dose still pending',
                message: `Don't forget your dose of ${name}${dosage}. Adherence is essential!`,
            },
            ESCALATION: {
                title:   '🚨 CRITICAL ALERT',
                message: `URGENT: ${name}${dosage} is 45 minutes overdue. Please confirm immediately.`,
            },
            BEDTIME_PREP: {
                title:   '🌙 Bedtime medication — in 45 min',
                message: `Prepare ${name}${dosage} — take it in 45 minutes before sleeping.`,
            },
            BEDTIME_MAIN: {
                title:   '💤 Bedtime medication',
                message: `Time to take ${name}${dosage} before sleeping. Good night!`,
            },
            EMPTY_STOMACH_PREP: {
                title:   '🥣 Empty stomach — in 30 minutes',
                message: `Prepare ${name}${dosage} — take it in 30 minutes on an empty stomach.`,
            },
            EMPTY_STOMACH_SAFE: {
                title:   '🍽️ You can eat now',
                message: `You can now have your breakfast. Did you take ${name}?`,
            },
        };

        return library[templateKey] || library.MAIN;
    }

    static _shouldSuppress(dose) {
            if (dose.priority === 'HIGH') {
        const criticalEnabled = dose.critical_alerts_enabled === 1 || 
                                dose.critical_alerts_enabled === true ||
                                dose.critical_alerts_enabled == null;
        if (criticalEnabled) return false; // never suppress HIGH when critical alerts on
        // if patient explicitly disabled critical alerts, fall through to quiet hours check
    }
        if (!dose.quiet_hours_enabled) return false;

        const now        = new Date();
        const currentDay = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'][now.getDay()];
        const nowMinutes = now.getHours() * 60 + now.getMinutes();

        let quietDays = [];
        try {
            quietDays = typeof dose.quiet_hours_days === 'string'
                ? JSON.parse(dose.quiet_hours_days)
                : (dose.quiet_hours_days || []);
        } catch (_) { quietDays = []; }

        if (quietDays.length > 0 && !quietDays.includes(currentDay)) return false;

        const parseTime = (t) => {
            if (!t) return 0;
            const parts = t.toString().split(':');
            return parseInt(parts[0]) * 60 + parseInt(parts[1] || 0);
        };

        const qStart = parseTime(dose.quiet_hours_start) || 23 * 60;
        const qEnd   = parseTime(dose.quiet_hours_end)   || 7 * 60;

        if (qStart > qEnd) return nowMinutes >= qStart || nowMinutes < qEnd;
        return nowMinutes >= qStart && nowMinutes < qEnd;
    }

    static _isWithinWakingHours(dose) {
        if (dose.priority === 'HIGH') return true;

        const now        = new Date();
        const nowMinutes = now.getHours() * 60 + now.getMinutes();

        const parseTime = (t, fallback) => {
            if (!t) return fallback;
            const parts = t.toString().split(':');
            return parseInt(parts[0]) * 60 + parseInt(parts[1] || 0);
        };

        const wakeMinutes    = parseTime(dose.wake_time, 7 * 60);
        const bedtimeMinutes = parseTime(dose.bedtime,   23 * 60);

        if (wakeMinutes <= bedtimeMinutes) {
            return nowMinutes >= wakeMinutes && nowMinutes < bedtimeMinutes;
        }
        return nowMinutes >= wakeMinutes || nowMinutes < bedtimeMinutes;
    }

    static async _countTodayNotificationsForDose(scheduleId) {
        try {
            const [rows] = await db.execute(
                `SELECT COUNT(*) AS cnt FROM notifications
                 WHERE JSON_UNQUOTE(JSON_EXTRACT(data, '$.schedule_id')) = ?
                 AND DATE(created_at) = CURDATE()`,
                [scheduleId.toString()]
            );
            return parseInt(rows[0]?.cnt || 0);
        } catch (_) {
            return 0;
        }
    }

    static async markMissedDoses() {
        try {
            const [missedResult] = await db.execute(
                `UPDATE medication_schedules
                 SET status = 'MISSED'
                 WHERE status = 'SCHEDULED'
                 AND scheduled_date_time < DATE_SUB(NOW(), INTERVAL 1 HOUR)`
            );

            if (missedResult.affectedRows > 0) {
                console.log(`[NotificationService] ⏰ ${missedResult.affectedRows} doses marked MISSED`);

                const [missed] = await db.execute(`
                    SELECT
                        ms.id       AS schedule_id,
                        ms.patient_id,
                        ms.scheduled_date_time,
                        t.medication_name,
                        t.dosage,
                        t.priority,
                        t.frequency,
                        p.fcm_token,
                        p.all_notifications,
                        p.medication_reminders
                    FROM medication_schedules ms
                    JOIN treatments t ON ms.treatment_id = t.id
                    JOIN patients p   ON ms.patient_id   = p.id
                    WHERE ms.status = 'MISSED'
                    AND ms.scheduled_date_time BETWEEN DATE_SUB(NOW(), INTERVAL 2 HOUR) AND NOW()
                    AND NOT EXISTS (
                        SELECT 1 FROM notifications n
                        WHERE n.patient_id = ms.patient_id
                        AND n.type = 'missed'
                        AND JSON_UNQUOTE(JSON_EXTRACT(n.data, '$.schedule_id')) = CAST(ms.id AS CHAR)
                    )
                `);

                for (const dose of missed) {
                    if (!dose.all_notifications || !dose.medication_reminders) continue;

                    const freq = dose.frequency || '';
                    if (freq.includes('Before sleeping') || freq.includes('Bedtime')) continue;
                    if (dose.priority === 'LOW') continue;

                    const d = new Date(dose.scheduled_date_time);
                    const timeStr = `${String(d.getHours()).padStart(2,'0')}:${String(d.getMinutes()).padStart(2,'0')}`;

                    const title   = '❌ Missed dose';
                    const message = `You missed ${dose.medication_name}${dose.dosage ? ' ' + dose.dosage : ''} scheduled at ${timeStr}`;

                    await this.createNotification(
                        dose.patient_id, 'missed', title, message,
                        { schedule_id: dose.schedule_id, can_take_now: true }
                    );

                    if (dose.fcm_token) {
                        await FirebaseService.sendPushNotification(
                            dose.fcm_token, title, message,
                            { schedule_id: String(dose.schedule_id), type: 'missed_dose', can_take_now: 'true' },
                            dose.priority === 'HIGH'
                        );
                    }
                }
            }

            return missedResult.affectedRows;

        } catch (error) {
            console.error('[NotificationService] Error in markMissedDoses:', error);
            throw error;
        }
    }

    static async checkProgress(patientId) {
        try {
            const stats  = await SchedulerService.getAdherenceStats(patientId, 7);
            const streak = await ScheduleService.getCurrentStreak(patientId);

            const [[patient]] = await db.execute(
                'SELECT fcm_token, all_notifications FROM patients WHERE id = ?',
                [patientId]
            );

            let count = 0;

            const streakMilestones = [
                { days: 3,  key: 'streak_3',  emoji: '🔥', label: '3 days in a row' },
                { days: 7,  key: 'streak_7',  emoji: '⭐', label: '7 days in a row' },
                { days: 14, key: 'streak_14', emoji: '🏅', label: '14 days in a row' },
                { days: 30, key: 'streak_30', emoji: '🏆', label: '30 days in a row' },
            ];

            for (const milestone of streakMilestones) {
                if (streak >= milestone.days) {
                    const exists = await this._notificationExists(patientId, 'achievement', milestone.key);
                    if (!exists) {
                        const title   = `${milestone.emoji} ${milestone.label}!`;
                        const message = `Well done! You have taken all your medications on time for ${milestone.days} consecutive days.`;
                        await this.createNotification(patientId, 'achievement', title, message, { streak: milestone.days });
                        if (patient?.fcm_token && patient.all_notifications) {
                            await FirebaseService.sendPushNotification(
                                patient.fcm_token, title, message,
                                { type: 'achievement', streak: String(milestone.days) }
                            );
                        }
                        count++;
                    }
                }
            }

            if (stats && stats.adherenceRate >= 90) {
                const exists = await this._notificationExists(patientId, 'achievement', 'adherence_90');
                if (!exists) {
                    const title   = '🌟 Excellent adherence!';
                    const message = `You have ${stats.adherenceRate}% adherence this week. Keep it up!`;
                    await this.createNotification(patientId, 'achievement', title, message, { adherence: stats.adherenceRate });
                    if (patient?.fcm_token && patient.all_notifications) {
                        await FirebaseService.sendPushNotification(
                            patient.fcm_token, title, message,
                            { type: 'achievement', adherence: String(stats.adherenceRate) }
                        );
                    }
                    count++;
                    await CaregiverNotificationService.sendMilestone(patientId, milestone.days);
                }
            }

            return count;

        } catch (error) {
            console.error('[NotificationService] Error in checkProgress:', error);
            return 0;
        }
    }

        static _getRelationText(freq) {
        if (!freq) return '';
        if (freq.includes('Before breakfast'))  return 'before breakfast';
        if (freq.includes('During breakfast'))  return 'with breakfast';
        if (freq.includes('After breakfast'))   return 'after breakfast';
        if (freq.includes('Before lunch'))      return 'before lunch';
        if (freq.includes('During lunch'))      return 'with lunch';
        if (freq.includes('After lunch'))       return 'after lunch';
        if (freq.includes('Before dinner'))     return 'before dinner';
        if (freq.includes('During dinner'))     return 'with dinner';
        if (freq.includes('After dinner'))      return 'after dinner';
        if (freq.includes('Before sleeping'))   return 'before sleeping';
        return '';
    }

    static async _checkNotificationExists(scheduleId, stageType) {
        const [rows] = await db.execute(
            `SELECT 1 FROM notifications
             WHERE JSON_UNQUOTE(JSON_EXTRACT(data, '$.schedule_id')) = ?
             AND JSON_UNQUOTE(JSON_EXTRACT(data, '$.stage')) = ?
             AND created_at > DATE_SUB(NOW(), INTERVAL 24 HOUR)`,
            [scheduleId.toString(), stageType]
        );
        return rows.length > 0;
    }

    static async _notificationExists(patientId, type, key) {
        try {
            const [rows] = await db.execute(
                `SELECT id FROM notifications
                 WHERE patient_id = ? AND type = ?
                 AND JSON_EXTRACT(data, '$.${key}') IS NOT NULL
                 AND created_at > DATE_SUB(NOW(), INTERVAL 30 DAY)`,
                [patientId, type]
            );
            return rows.length > 0;
        } catch (_) {
            return false;
        }
    }

    static async generateReminders() {
        return this.generateSmartReminders();
    }
}

module.exports = NotificationService;