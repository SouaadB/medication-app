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
            const start = new Date(startDate);
            start.setHours(0, 0, 0, 0); // Set to beginning of day
            
            let end;
            if (endDate) {
                end = new Date(endDate);
                end.setHours(23, 59, 59, 999); // Set to end of day
            } else {
                // If no end date, default to 30 days from start
                end = new Date(start);
                end.setDate(start.getDate() + 30);
                end.setHours(23, 59, 59, 999);
            }

            // Define times for each frequency ENUM
            const times = {
                'Once daily': ['08:00'],
                'Twice daily': ['08:00', '20:00'],
                'Three times daily': ['08:00', '14:00', '20:00'],
                'Four times daily': ['08:00', '12:00', '18:00', '22:00'],
                'Every 12 hours': ['08:00', '20:00'],
                'Every 8 hours': ['08:00', '16:00', '00:00'],
                'Every 6 hours': ['06:00', '12:00', '18:00', '00:00'],
                'As needed': [] // No fixed schedule
            };

            const selectedTimes = times[frequency] || [];
            if (selectedTimes.length === 0) {
                console.log(`No schedule generated for PRN medication: ${frequency}`);
                return 0;
            }

            const schedules = [];
            let currentDate = new Date(start);

            // Loop through each day from start to end
            while (currentDate <= end) {
                for (const time of selectedTimes) {
                    const [hours, minutes] = time.split(':');
                    const scheduledTime = new Date(currentDate);
                    scheduledTime.setHours(parseInt(hours), parseInt(minutes), 0, 0);

                    // Only schedule future times or times on start date after start time
                    const now = new Date();
                    if (scheduledTime >= now || scheduledTime >= start) {
                        schedules.push([
                            patientId,
                            treatmentId,
                            scheduledTime,
                            'SCHEDULED'
                        ]);
                    }
                }
                // Move to next day
                currentDate.setDate(currentDate.getDate() + 1);
            }

            if (schedules.length > 0) {
                // Use db.execute for parameterized query (safer)
                const query = 'INSERT INTO medication_schedules (patient_id, treatment_id, scheduled_date_time, status) VALUES ?';
                // For bulk insert with mysql2, you need to use db.query, not db.execute
                const [result] = await db.query(query, [schedules]);
                console.log(`✅ Generated ${schedules.length} schedules for treatment ${treatmentId}`);
                return schedules.length;
            }
            
            return 0;
            
        } catch (error) {
            console.error('❌ Error generating schedule:', error);
            throw error;
        }
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

    static async getScheduleByDate(patientId, dateYmd) {
        try {
            const [rows] = await db.execute(
                `SELECT 
                    ms.id as schedule_id,
                    ms.scheduled_date_time,
                    ms.status,
                    t.medication_name,
                    t.dosage,
                    c.name as condition_name
                 FROM medication_schedules ms
                 JOIN treatments t ON ms.treatment_id = t.id
                 LEFT JOIN chronic_conditions c ON t.condition_id = c.id
                 WHERE ms.patient_id = ?
                 AND DATE(ms.scheduled_date_time) = ?
                 ORDER BY ms.scheduled_date_time ASC`,
                [patientId, dateYmd]
            );
            return rows;
        } catch (error) {
            console.error('Error getting schedule by date:', error);
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
