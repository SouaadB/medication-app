const db = require('../config/database');

class ScheduleService {
    // Récupérer le planning pour une date spécifique
    static async getScheduleByDate(patientId, date) {
        try {
            const query = `
                SELECT 
                    ms.id,
                    DATE_FORMAT(ms.scheduled_date_time, '%h:%i %p') as time,
                    ms.scheduled_date_time as full_datetime,
                    ms.status,
                    ms.taken_time,
                    TIME_FORMAT(ms.taken_time, '%h:%i %p') as taken_time_formatted,
                    t.medication_name,
                    t.dosage,
                    c.name as condition_name,
                    CASE 
                        WHEN ms.status = 'TAKEN' THEN 'completed'
                        WHEN ms.status = 'MISSED' THEN 'missed'
                        ELSE 'pending'
                    END as status_type
                FROM medication_schedules ms
                JOIN treatments t ON ms.treatment_id = t.id
                LEFT JOIN chronic_conditions c ON t.condition_id = c.id
                WHERE ms.patient_id = ? 
                AND DATE(ms.scheduled_date_time) = DATE(?)
                ORDER BY ms.scheduled_date_time ASC
            `;
            
            const [rows] = await db.execute(query, [patientId, date]);
            
            // Calculer les statistiques
            const total = rows.length;
            const completed = rows.filter(r => r.status === 'TAKEN').length;
            const pending = rows.filter(r => r.status === 'SCHEDULED').length;
            const missed = rows.filter(r => r.status === 'MISSED').length;
            
            return {
                date,
                total,
                completed,
                pending,
                missed,
                medications: rows
            };
        } catch (error) {
            console.error('Error in getScheduleByDate:', error);
            throw error;
        }
    }

    // Récupérer le planning pour plusieurs jours
    static async getScheduleRange(patientId, startDate, endDate) {
        try {
            const query = `
                SELECT 
                    DATE(ms.scheduled_date_time) as schedule_date,
                    COUNT(*) as total,
                    SUM(CASE WHEN ms.status = 'TAKEN' THEN 1 ELSE 0 END) as completed,
                    SUM(CASE WHEN ms.status = 'SCHEDULED' THEN 1 ELSE 0 END) as pending,
                    SUM(CASE WHEN ms.status = 'MISSED' THEN 1 ELSE 0 END) as missed
                FROM medication_schedules ms
                WHERE ms.patient_id = ? 
                AND DATE(ms.scheduled_date_time) BETWEEN DATE(?) AND DATE(?)
                GROUP BY DATE(ms.scheduled_date_time)
                ORDER BY schedule_date ASC
            `;
            
            const [rows] = await db.execute(query, [patientId, startDate, endDate]);
            return rows;
        } catch (error) {
            console.error('Error in getScheduleRange:', error);
            throw error;
        }
    }

    // Marquer une dose comme prise (avec taken_time)
    static async markAsTaken(scheduleId) {
        try {
            const now = new Date();
            
            // D'abord, récupérer les infos pour la notification
            const [scheduleInfo] = await db.execute(
                `SELECT ms.patient_id, t.medication_name, t.dosage, ms.scheduled_date_time
                 FROM medication_schedules ms
                 JOIN treatments t ON ms.treatment_id = t.id
                 WHERE ms.id = ?`,
                [scheduleId]
            );
            
            if (scheduleInfo.length === 0) {
                return false;
            }
            
            // Mettre à jour le statut
            const [result] = await db.execute(
                `UPDATE medication_schedules 
                 SET status = 'TAKEN', taken_time = ? 
                 WHERE id = ? AND status = 'SCHEDULED'`,
                [now, scheduleId]
            );
            
            if (result.affectedRows > 0) {
                // Vérifier si c'était en retard
                const scheduledTime = new Date(scheduleInfo[0].scheduled_date_time);
                const minutesLate = Math.round((now - scheduledTime) / (1000 * 60));
                
                if (minutesLate > 30) {
                    // Créer une notification pour dose en retard
                    await db.execute(
                        `INSERT INTO notifications 
                         (patient_id, type, title, message, data, scheduled_time)
                         VALUES (?, 'reminder', ?, ?, ?, ?)`,
                        [
                            scheduleInfo[0].patient_id,
                            '⏰ Dose prise en retard',
                            `Vous avez pris ${scheduleInfo[0].medication_name} ${scheduleInfo[0].dosage || ''} avec ${minutesLate} minutes de retard`,
                            JSON.stringify({ scheduleId, minutesLate }),
                            now
                        ]
                    );
                }
            }
            
            return result.affectedRows > 0;
        } catch (error) {
            console.error('Error marking as taken:', error);
            throw error;
        }
    }

    // Vérifier la streak actuelle
    static async getCurrentStreak(patientId) {
        try {
            const query = `
                WITH daily_status AS (
                    SELECT 
                        DATE(scheduled_date_time) as dose_date,
                        MAX(CASE WHEN status = 'TAKEN' THEN 1 ELSE 0 END) as all_taken
                    FROM medication_schedules
                    WHERE patient_id = ? 
                    AND scheduled_date_time >= DATE_SUB(NOW(), INTERVAL 60 DAY)
                    GROUP BY DATE(scheduled_date_time)
                    ORDER BY dose_date DESC
                ),
                streak_calc AS (
                    SELECT 
                        dose_date,
                        all_taken,
                        SUM(CASE WHEN all_taken = 0 THEN 1 ELSE 0 END) 
                            OVER (ORDER BY dose_date DESC) as break_group
                    FROM daily_status
                    WHERE dose_date <= CURDATE()
                )
                SELECT COUNT(*) as current_streak
                FROM streak_calc
                WHERE break_group = 0 AND all_taken = 1
            `;
            
            const [rows] = await db.execute(query, [patientId]);
            return rows[0]?.current_streak || 0;
        } catch (error) {
            console.error('Error in getCurrentStreak:', error);
            return 0;
        }
    }
}

module.exports = ScheduleService;