const db = require('../config/database');
const ScheduleService = require('./scheduleService');

class NotificationService {
    // Récupérer toutes les notifications
    static async getAllNotifications(patientId, limit = 50) {
        try {
            const query = `
                SELECT * FROM notifications 
                WHERE patient_id = ? 
                ORDER BY created_at DESC
            `;
            const [rows] = await db.execute(query, [patientId]);
            
            const limitedRows = rows.slice(0, limit);
            const unreadCount = rows.filter(n => !n.is_read).length;
            
            return {
                notifications: limitedRows,
                unreadCount
            };
        } catch (error) {
            console.error('Error in getAllNotifications:', error);
            throw error;
        }
    }

    // Récupérer les notifications non lues
    static async getUnreadNotifications(patientId) {
        try {
            const query = `
                SELECT * FROM notifications 
                WHERE patient_id = ? AND is_read = false
                ORDER BY created_at DESC
            `;
            const [rows] = await db.execute(query, [patientId]);
            return rows;
        } catch (error) {
            console.error('Error in getUnreadNotifications:', error);
            throw error;
        }
    }

    // Marquer une notification comme lue
    static async markAsRead(notificationId) {
        try {
            const query = 'UPDATE notifications SET is_read = true WHERE id = ?';
            const [result] = await db.execute(query, [notificationId]);
            return result.affectedRows > 0;
        } catch (error) {
            console.error('Error in markAsRead:', error);
            throw error;
        }
    }

    // Marquer toutes les notifications comme lues
    static async markAllAsRead(patientId) {
        try {
            const query = 'UPDATE notifications SET is_read = true WHERE patient_id = ? AND is_read = false';
            const [result] = await db.execute(query, [patientId]);
            return result.affectedRows;
        } catch (error) {
            console.error('Error in markAllAsRead:', error);
            throw error;
        }
    }

    // Supprimer les notifications liées à un traitement
    static async clearNotificationsByTreatment(treatmentId) {
        try {
            const query = `
                DELETE FROM notifications 
                WHERE JSON_EXTRACT(data, '$.treatment_id') = ?
            `;
            await db.execute(query, [treatmentId]);
        } catch (error) {
            console.error('Error in clearNotificationsByTreatment:', error);
        }
    }

    // Créer une notification
    static async createNotification(patientId, type, title, message, data = {}) {
        try {
            const query = `
                INSERT INTO notifications 
                (patient_id, type, title, message, data, scheduled_time)
                VALUES (?, ?, ?, ?, ?, NOW())
            `;
            const [result] = await db.execute(query, [
                patientId, 
                type, 
                title, 
                message, 
                JSON.stringify(data)
            ]);
            return result.insertId;
        } catch (error) {
            console.error('Error in createNotification:', error);
            throw error;
        }
    }

    /**
     * Générer des notifications intelligentes en 3 étapes (Early, Main, Missed)
     */
    static async generateSmartReminders() {
        try {
            // Set timezone for the current connection session
            await db.execute("SET time_zone = '+01:00'");

            // 1. Récupérer les doses prévues pour aujourd'hui
            const query = `
                SELECT 
                    ms.id as schedule_id,
                    ms.patient_id,
                    ms.scheduled_date_time,
                    t.medication_name,
                    t.dosage,
                    t.frequency,
                    t.priority,
                    t.id as treatment_id,
                    p.wake_time,
                    p.bedtime,
                    p.quiet_hours_start,
                    p.quiet_hours_end
                FROM medication_schedules ms
                JOIN treatments t ON ms.treatment_id = t.id
                JOIN patients p ON ms.patient_id = p.id
                WHERE ms.status = 'SCHEDULED'
                AND DATE(ms.scheduled_date_time) = CURDATE()
            `;
            
            const [doses] = await db.execute(query);
            let notificationsCreated = 0;

            for (const dose of doses) {
                // Vérifier les heures de silence (Quiet Hours)
                // Sauf pour les médicaments critiques (HIGH priority)
                if (this._shouldSuppress(dose, dose)) { // Using dose object as it contains patient fields from the join
                    continue;
                }

                const now = new Date();
                const scheduledTime = new Date(dose.scheduled_date_time);
                const diffMinutes = Math.floor((scheduledTime - now) / (1000 * 60));
                
                // Déterminer les types de notifications à envoyer en fonction de la priorité et du type
                const stages = this._getNotificationStages(dose);
                
                for (const stage of stages) {
                    // Vérifier si c'est le moment d'envoyer cette notification
                    if (diffMinutes === stage.offset) {
                        // Vérifier si cette notification spécifique a déjà été envoyée
                        const exists = await this._checkNotificationExists(dose.schedule_id, stage.type);
                        if (!exists) {
                            const template = this._getTemplate(dose, stage.template);
                            await this.createNotification(
                                dose.patient_id,
                                'reminder',
                                template.title,
                                template.message,
                                { 
                                    schedule_id: dose.schedule_id,
                                    treatment_id: dose.treatment_id,
                                    stage: stage.type,
                                    priority: dose.priority
                                }
                            );
                            notificationsCreated++;
                        }
                    }
                }
            }
            
            return notificationsCreated;
        } catch (error) {
            console.error('Error in generateSmartReminders:', error);
            throw error;
        }
    }

    /**
     * Production-grade Notification Timeline Logic
     * Handles 3-stage reminders, critical escalation, and quiet hours
     */
    static _getNotificationStages(dose) {
        const priority = dose.priority || 'MEDIUM';
        const freq = dose.frequency || '';
        
        // 1. CRITICAL MEDICINES (High Priority)
        // System: Early (-30) -> Main (0) -> Follow-up (+15) -> Escalation (+45)
        if (priority === 'HIGH') {
            return [
                { type: 'EARLY', offset: 30, template: 'EARLY' },
                { type: 'MAIN', offset: 0, template: 'MAIN' },
                { type: 'FOLLOW_UP', offset: -15, template: 'FOLLOW_UP' },
                { type: 'ESCALATION', offset: -45, template: 'ESCALATION' }
            ];
        }

        // 2. BEDTIME MEDICINES
        // System: Prep (-45) -> Main (-15) | NO missed alerts after sleep
        if (freq.includes('Before sleeping') || freq.includes('Bedtime')) {
            return [
                { type: 'PREP', offset: 45, template: 'BEDTIME_PREP' },
                { type: 'MAIN', offset: 15, template: 'BEDTIME_MAIN' }
            ];
        }

        // 3. EMPTY STOMACH MEDICINES
        // System: Prep (-30) -> Main (0) -> "Safe to eat" (+60)
        if (freq.includes('Empty stomach')) {
            return [
                { type: 'PREP', offset: 30, template: 'EMPTY_STOMACH_PREP' },
                { type: 'MAIN', offset: 0, template: 'MAIN' },
                { type: 'SAFE_TO_EAT', offset: -60, template: 'EMPTY_STOMACH_SAFE' }
            ];
        }

        // 4. INTERVAL MEDICINES (Every X hours)
        // System: Main (0) -> Missed (-30) | No early reminders for intervals
        if (freq.includes('Every')) {
            return [
                { type: 'MAIN', offset: 0, template: 'MAIN' },
                { type: 'MISSED', offset: -30, template: 'MISSED' }
            ];
        }

        // 5. STANDARD MEDICINES (Medium)
        // System: Early (-15) -> Main (0) -> Missed (-30)
        if (priority === 'MEDIUM') {
            return [
                { type: 'EARLY', offset: 15, template: 'EARLY' },
                { type: 'MAIN', offset: 0, template: 'MAIN' },
                { type: 'MISSED', offset: -30, template: 'MISSED' }
            ];
        }

        // 6. LOW PRIORITY (Vitamins/Supplements)
        // System: Main (0) only
        return [{ type: 'MAIN', offset: 0, template: 'MAIN' }];
    }

    /**
     * Dynamic Template Engine for Personalized Notifications
     */
    static _getTemplate(dose, templateKey) {
        const name = dose.medication_name;
        const relation = this._getRelationText(dose.frequency);
        
        const library = {
            MAIN: {
                title: '💊 Time to take your medicine',
                message: `It's time to take ${name} ${dose.dosage || ''} ${relation}.`
            },
            EARLY: {
                title: '🕒 Upcoming dose',
                message: `Prepare to take ${name} ${relation} in 15 minutes.`
            },
            MISSED: {
                title: '❗ Missed dose',
                message: `You missed your ${name} ${relation}. Please take it now.`
            },
            FOLLOW_UP: {
                title: '⚠️ Still pending',
                message: `Don't forget your dose of ${name}. Adherence is key!`
            },
            ESCALATION: {
                title: '🚨 CRITICAL ALERT',
                message: `URGENT: Dose of ${name} is 45 minutes overdue. Please confirm.`
            },
            BEDTIME_PREP: {
                title: '🌙 Preparing for bed',
                message: `Take ${name} in 45 minutes before you go to sleep.`
            },
            BEDTIME_MAIN: {
                title: '💤 Bedtime medicine',
                message: `Time for your bedtime dose of ${name}. Sleep well!`
            },
            EMPTY_STOMACH_PREP: {
                title: '🥣 Preparation required',
                message: `Take ${name} in 30 minutes on an empty stomach.`
            },
            EMPTY_STOMACH_SAFE: {
                title: '🍽️ Ready to eat',
                message: `You can now eat your meal. Hope you took your ${name}!`
            }
        };

        return library[templateKey] || library.MAIN;
    }

    /**
     * Smart Suppression Logic
     */
    static _shouldSuppress(dose, patient) {
        // Rule: Never suppress high priority
        if (dose.priority === 'HIGH') return false;

        const now = new Date();
        const hour = now.getHours();
        
        // Quiet Hours: 23:00 -> 07:00 (Can be customized from patient profile)
        const qStart = patient.quiet_hours_start ? parseInt(patient.quiet_hours_start) : 23;
        const qEnd = patient.quiet_hours_end ? parseInt(patient.quiet_hours_end) : 7;

        const isNight = (qStart > qEnd) 
            ? (hour >= qStart || hour < qEnd)
            : (hour >= qStart && hour < qEnd);

        return isNight;
    }

    static _getRelationText(freq) {
        if (freq.includes('Before breakfast')) return 'avant le petit-déjeuner';
        if (freq.includes('After breakfast')) return 'après le petit-déjeuner';
        if (freq.includes('Before lunch')) return 'avant le déjeuner';
        if (freq.includes('After lunch')) return 'après le déjeuner';
        if (freq.includes('Before dinner')) return 'avant le dîner';
        if (freq.includes('After dinner')) return 'après le dîner';
        if (freq.includes('Before sleeping')) return 'avant de dormir';
        return '';
    }

    static async _checkNotificationExists(scheduleId, stageType) {
        const query = `
            SELECT 1 FROM notifications 
            WHERE JSON_UNQUOTE(JSON_EXTRACT(data, '$.schedule_id')) = ? 
            AND JSON_UNQUOTE(JSON_EXTRACT(data, '$.stage')) = ?
            AND created_at > DATE_SUB(NOW(), INTERVAL 24 HOUR)
        `;
        const [rows] = await db.execute(query, [scheduleId.toString(), stageType]);
        return rows.length > 0;
    }

    // Garder les anciennes méthodes pour compatibilité si nécessaire
    static async generateReminders() {
        return this.generateSmartReminders();
    }

    // Marquer les doses manquées
    static async markMissedDoses() {
        try {
            // Marquer les doses comme manquées si elles datent de plus de 1 heure
            const [missedResult] = await db.execute(
                `UPDATE medication_schedules 
                 SET status = 'MISSED' 
                 WHERE status = 'SCHEDULED' 
                 AND scheduled_date_time < DATE_SUB(NOW(), INTERVAL 1 HOUR)`
            );
            
            if (missedResult.affectedRows > 0) {
                console.log(`⏰ ${missedResult.affectedRows} doses marked as missed`);
                
                // Créer des notifications pour les doses manquées récentes
                const query = `
                    SELECT 
                        ms.id as schedule_id,
                        ms.patient_id,
                        ms.scheduled_date_time,
                        t.medication_name,
                        t.dosage
                    FROM medication_schedules ms
                    JOIN treatments t ON ms.treatment_id = t.id
                    WHERE ms.status = 'MISSED'
                    AND ms.scheduled_date_time BETWEEN DATE_SUB(NOW(), INTERVAL 24 HOUR) AND NOW()
                    AND NOT EXISTS (
                        SELECT 1 FROM notifications n 
                        WHERE n.patient_id = ms.patient_id 
                        AND n.type = 'missed' 
                        AND JSON_EXTRACT(n.data, '$.schedule_id') = ms.id
                    )
                `;
                
                const [missed] = await db.execute(query);
                
                for (const dose of missed) {
                    const timeStr = new Date(dose.scheduled_date_time).toLocaleTimeString('fr-FR', { 
                        hour: '2-digit', 
                        minute: '2-digit' 
                    });
                    
                    await this.createNotification(
                        dose.patient_id,
                        'missed',
                        '❌ Dose manquée',
                        `Vous avez oublié de prendre ${dose.medication_name} ${dose.dosage || ''} à ${timeStr}`,
                        { schedule_id: dose.schedule_id, can_take_now: true }
                    );
                }
            }
            
            return missedResult.affectedRows;
        } catch (error) {
            console.error('Error in markMissedDoses:', error);
            throw error;
        }
    }

    // Vérifier et créer des notifications de progression
    static async checkProgress(patientId) {
        try {
            const stats = await ScheduleService.getAdherenceStats(patientId, 7);
            const streak = await ScheduleService.getCurrentStreak(patientId);
            
            const notifications = [];
            
            if (streak >= 7) {
                const exists = await this._notificationExists(patientId, 'achievement', 'streak_7');
                if (!exists) {
                    await this.createNotification(
                        patientId,
                        'achievement',
                        '🏃‍♀️ 7 jours de suite !',
                        'Vous avez pris tous vos médicaments à l\'heure pendant 7 jours',
                        { streak: 7 }
                    );
                    notifications.push('streak_7');
                }
            }
            
            if (stats && stats.adherenceRate >= 90) {
                const exists = await this._notificationExists(patientId, 'achievement', 'adherence_90');
                if (!exists) {
                    await this.createNotification(
                        patientId,
                        'achievement',
                        '🌟 Excellente observance !',
                        `Vous avez ${stats.adherenceRate}% d'observance cette semaine`,
                        { adherence: stats.adherenceRate }
                    );
                    notifications.push('adherence_90');
                }
            }
            
            return notifications.length;
        } catch (error) {
            console.error('Error in checkProgress:', error);
            return 0;
        }
    }

    // Vérifier si une notification existe déjà
    static async _notificationExists(patientId, type, key) {
        try {
            const query = `
                SELECT id FROM notifications 
                WHERE patient_id = ? AND type = ? 
                AND JSON_EXTRACT(data, '$.${key}') IS NOT NULL
                AND created_at > DATE_SUB(NOW(), INTERVAL 30 DAY)
            `;
            const [rows] = await db.execute(query, [patientId, type]);
            return rows.length > 0;
        } catch (error) {
            return false;
        }
    }
}

module.exports = NotificationService;