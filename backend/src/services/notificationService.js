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

    // Générer des notifications de rappel 30 minutes avant chaque dose
    static async generateReminders() {
        try {
            console.log('🔍 Checking for upcoming doses in next 30 minutes...');
            
            const query = `
                SELECT 
                    ms.id as schedule_id,
                    ms.patient_id,
                    ms.scheduled_date_time,
                    t.medication_name,
                    t.dosage,
                    t.id as treatment_id
                FROM medication_schedules ms
                JOIN treatments t ON ms.treatment_id = t.id
                WHERE ms.status = 'SCHEDULED'
                AND ms.scheduled_date_time BETWEEN NOW() AND DATE_ADD(NOW(), INTERVAL 30 MINUTE)
                AND NOT EXISTS (
                    SELECT 1 FROM notifications n 
                    WHERE n.patient_id = ms.patient_id 
                    AND n.type = 'reminder' 
                    AND JSON_EXTRACT(n.data, '$.schedule_id') = ms.id
                    AND n.created_at > DATE_SUB(NOW(), INTERVAL 12 HOUR)
                )
            `;
            
            const [reminders] = await db.execute(query);
            
            if (reminders.length > 0) {
                console.log(`📋 Found ${reminders.length} upcoming doses`);
                
                for (const reminder of reminders) {
                    const scheduledTime = new Date(reminder.scheduled_date_time);
                    const hours = scheduledTime.getHours().toString().padStart(2, '0');
                    const minutes = scheduledTime.getMinutes().toString().padStart(2, '0');
                    
                    await this.createNotification(
                        reminder.patient_id,
                        'reminder',
                        '💊 Rappel de médicament',
                        `Il est temps de prendre ${reminder.medication_name} ${reminder.dosage || ''} (${hours}:${minutes})`,
                        { 
                            schedule_id: reminder.schedule_id,
                            treatment_id: reminder.treatment_id,
                            scheduled_time: reminder.scheduled_date_time
                        }
                    );
                    
                    console.log(`✅ Reminder created for patient ${reminder.patient_id} at ${hours}:${minutes}`);
                }
            }
            
            return reminders.length;
        } catch (error) {
            console.error('Error in generateReminders:', error);
            throw error;
        }
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