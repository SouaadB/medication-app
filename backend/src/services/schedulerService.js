const db = require('../config/database');

class SchedulerService {
    /**
     * Generate medication schedules based on frequency
     * @param {number} patientId 
     * @param {number} treatmentId 
     * @param {string} frequency - enum('Once daily', 'Twice daily', etc.)
     * @param {string} startDate - YYYY-MM-DD
     * @param {string} endDate - YYYY-MM-DD (optional)
     * @returns {Promise<number>} Number of schedules created
     */
    static async generateSchedule(patientId, treatmentId, frequency, startDate, endDate) {
        try {
            const now = new Date();
            const start = new Date(startDate);
            
            const isToday = start.toDateString() === now.toDateString();
            
            if (isToday) {
                start.setHours(now.getHours(), now.getMinutes(), 0, 0);
            } else {
                start.setHours(0, 0, 0, 0);
            }
            
            let end;
            if (endDate) {
                end = new Date(endDate);
                end.setHours(23, 59, 59, 999);
            } else {
                end = new Date(start);
                end.setDate(start.getDate() + 30);
                end.setHours(23, 59, 59, 999);
            }

            // Récupérer le profil du patient pour les horaires personnalisés
            const [patientRows] = await db.execute(
                'SELECT bedtime, wake_time, breakfast_time, lunch_time, dinner_time FROM patients WHERE id = ?',
                [patientId]
            );
            const patientSchedule = patientRows[0] || {};

            console.log(`📅 Generating schedule from ${start.toISOString()} to ${end.toISOString()}`);

            // Calculer les horaires en fonction de la fréquence et du planning du patient
            const times = this._calculateTimes(frequency, start, patientSchedule);
            
            if (times.length === 0) {
                console.log(`No schedule generated for frequency: ${frequency}`);
                return 0;
            }

            console.log(`📋 Times for ${frequency}:`, times);

            const schedules = [];
            let currentDate = new Date(start);
            currentDate.setHours(0, 0, 0, 0);

            while (currentDate <= end) {
                for (const time of times) {
                    const [hours, minutes] = time.split(':').map(Number);
                    const scheduledTime = new Date(currentDate);
                    scheduledTime.setHours(hours, minutes, 0, 0);

                    const today = new Date();
                    if (scheduledTime.toDateString() === today.toDateString()) {
                        if (scheduledTime <= today) {
                            continue;
                        }
                    }

                    schedules.push([
                        patientId,
                        treatmentId,
                        scheduledTime,
                        'SCHEDULED'
                    ]);
                }
                currentDate.setDate(currentDate.getDate() + 1);
            }

            if (schedules.length > 0) {
                const query = 'INSERT INTO medication_schedules (patient_id, treatment_id, scheduled_date_time, status) VALUES ?';
                await db.query(query, [schedules]);
                return schedules.length;
            }
            
            return 0;
            
        } catch (error) {
            console.error('❌ Error generating schedule:', error);
            throw error;
        }
    }

    /**
     * Calculer les horaires en fonction de la fréquence et du planning patient
     * @param {string} frequency 
     * @param {Date} startDate 
     * @param {Object} patientSchedule
     * @returns {Array<string>} Liste des horaires au format "HH:MM"
     */
    static _calculateTimes(frequency, startDate, patientSchedule = {}) {
        const times = [];
        const startHour = startDate.getHours();
        const startMinute = startDate.getMinutes();
        
        const formatTime = (hour, minute) => {
            return `${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`;
        };

        const getMealTime = (mealKey, defaultTime, offsetMinutes = 0) => {
            let timeStr = patientSchedule[mealKey] || defaultTime;
            // timeStr est souvent au format "HH:MM:SS" depuis MySQL
            const [h, m] = timeStr.split(':').map(Number);
            let date = new Date();
            date.setHours(h, m + offsetMinutes, 0, 0);
            return formatTime(date.getHours(), date.getMinutes());
        };
        
        switch (frequency) {
            case 'Once daily':
                times.push(formatTime(startHour, startMinute));
                break;
            case 'Twice daily':
                times.push(formatTime(startHour, startMinute));
                times.push(formatTime((startHour + 12) % 24, startMinute));
                break;
            case 'Three times daily':
                times.push(formatTime(startHour, startMinute));
                times.push(formatTime((startHour + 8) % 24, startMinute));
                times.push(formatTime((startHour + 16) % 24, startMinute));
                break;
            case 'Four times daily':
                times.push(formatTime(startHour, startMinute));
                times.push(formatTime((startHour + 6) % 24, startMinute));
                times.push(formatTime((startHour + 12) % 24, startMinute));
                times.push(formatTime((startHour + 18) % 24, startMinute));
                break;
            case 'Every 12 hours':
                times.push(formatTime(startHour, startMinute));
                times.push(formatTime((startHour + 12) % 24, startMinute));
                break;
            case 'Every 8 hours':
                times.push(formatTime(startHour, startMinute));
                times.push(formatTime((startHour + 8) % 24, startMinute));
                times.push(formatTime((startHour + 16) % 24, startMinute));
                break;
            case 'Every 6 hours':
                times.push(formatTime(startHour, startMinute));
                times.push(formatTime((startHour + 6) % 24, startMinute));
                times.push(formatTime((startHour + 12) % 24, startMinute));
                times.push(formatTime((startHour + 18) % 24, startMinute));
                break;

            // Nouveaux horaires basés sur les repas
            case 'Before breakfast':
                times.push(getMealTime('breakfast_time', '08:00', -30));
                break;
            case 'After breakfast':
                times.push(getMealTime('breakfast_time', '08:00', 30));
                break;
            case 'Before lunch':
                times.push(getMealTime('lunch_time', '12:30', -30));
                break;
            case 'After lunch':
                times.push(getMealTime('lunch_time', '12:30', 30));
                break;
            case 'Before dinner':
                times.push(getMealTime('dinner_time', '18:30', -30));
                break;
            case 'After dinner':
                times.push(getMealTime('dinner_time', '18:30', 30));
                break;
            case 'Before sleeping':
                times.push(getMealTime('bedtime', '23:00', -30));
                break;

            case 'As needed':
                break;
            default:
                times.push(formatTime(startHour, startMinute));
        }
        
        times.sort((a, b) => {
            const [h1, m1] = a.split(':').map(Number);
            const [h2, m2] = b.split(':').map(Number);
            return (h1 * 60 + m1) - (h2 * 60 + m2);
        });
        
        return times;
    }

    /**
     * Mark a medication as taken
     * @param {number} scheduleId 
     * @returns {Promise<boolean>} Success status
     */
    static async markAsTaken(scheduleId) {
        try {
            const [result] = await db.execute(
                `UPDATE medication_schedules 
                 SET status = 'TAKEN' 
                 WHERE id = ? AND status = 'SCHEDULED'`,
                [scheduleId]
            );
            return result.affectedRows > 0;
        } catch (error) {
            console.error('Error marking as taken:', error);
            throw error;
        }
    }

    /**
     * Mark all past scheduled medications as missed
     * @returns {Promise<number>} Number of doses marked as missed
     */
    static async markMissedDoses() {
        try {
            const [result] = await db.execute(
                `UPDATE medication_schedules 
                 SET status = 'MISSED' 
                 WHERE status = 'SCHEDULED' 
                 AND scheduled_date_time < NOW()`
            );
            console.log(`Marked ${result.affectedRows} doses as missed`);
            return result.affectedRows;
        } catch (error) {
            console.error('Error marking missed doses:', error);
            throw error;
        }
    }

    /**
     * Get today's schedule for a patient
     * @param {number} patientId 
     * @returns {Promise<Array>} Today's medications
     */
    static async getTodaySchedule(patientId) {
        try {
            const [rows] = await db.execute(
                `SELECT ms.*, t.medication_name, t.dosage, c.name as condition_name
                 FROM medication_schedules ms
                 JOIN treatments t ON ms.treatment_id = t.id
                 LEFT JOIN chronic_conditions c ON t.condition_id = c.id
                 WHERE ms.patient_id = ? 
                 AND DATE(ms.scheduled_date_time) = CURDATE()
                 ORDER BY ms.scheduled_date_time ASC`,
                [patientId]
            );
            return rows;
        } catch (error) {
            console.error('Error getting today schedule:', error);
            throw error;
        }
    }

    /**
     * Get upcoming doses for a patient
     * @param {number} patientId 
     * @param {number} limit 
     * @returns {Promise<Array>} Upcoming medications
     */
    static async getUpcomingDoses(patientId, limit = 5) {
        try {
            const [rows] = await db.execute(
                `SELECT ms.*, t.medication_name, t.dosage, c.name as condition_name
                 FROM medication_schedules ms
                 JOIN treatments t ON ms.treatment_id = t.id
                 LEFT JOIN chronic_conditions c ON t.condition_id = c.id
                 WHERE ms.patient_id = ? 
                 AND ms.scheduled_date_time > NOW()
                 AND ms.status = 'SCHEDULED'
                 ORDER BY ms.scheduled_date_time ASC
                 LIMIT ?`,
                [patientId, limit]
            );
            return rows;
        } catch (error) {
            console.error('Error getting upcoming doses:', error);
            throw error;
        }
    }

    /**
     * Clear future schedules for a treatment
     * @param {number} treatmentId 
     * @returns {Promise<number>} Number of schedules deleted
     */
    static async clearFutureSchedules(treatmentId) {
        try {
            const [result] = await db.execute(
                `DELETE FROM medication_schedules 
                 WHERE treatment_id = ? 
                 AND scheduled_date_time > NOW() 
                 AND status = 'SCHEDULED'`,
                [treatmentId]
            );
            console.log(`Cleared ${result.affectedRows} future schedules for treatment ${treatmentId}`);
            return result.affectedRows;
        } catch (error) {
            console.error('Error clearing future schedules:', error);
            throw error;
        }
    }

    /**
     * Get adherence statistics for a patient
     * @param {number} patientId 
     * @param {number} days 
     * @returns {Promise<Object>} Adherence stats
     */
    static async getAdherenceStats(patientId, days = 30) {
        try {
            const [rows] = await db.execute(
                `SELECT 
                    COUNT(*) as total,
                    SUM(CASE WHEN status = 'TAKEN' THEN 1 ELSE 0 END) as taken,
                    SUM(CASE WHEN status = 'MISSED' THEN 1 ELSE 0 END) as missed,
                    SUM(CASE WHEN status = 'SCHEDULED' AND scheduled_date_time < NOW() THEN 1 ELSE 0 END) as overdue
                 FROM medication_schedules
                 WHERE patient_id = ?
                 AND scheduled_date_time >= DATE_SUB(NOW(), INTERVAL ? DAY)`,
                [patientId, days]
            );
            
            const stats = rows[0];
            const adherenceRate = stats.total > 0 
                ? Math.round((stats.taken / stats.total) * 100) 
                : 0;
                
            return {
                total: stats.total,
                taken: stats.taken,
                missed: stats.missed,
                overdue: stats.overdue,
                adherenceRate
            };
        } catch (error) {
            console.error('Error getting adherence stats:', error);
            throw error;
        }
    }
}

module.exports = SchedulerService;