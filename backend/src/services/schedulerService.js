const db = require('../config/database');

class SchedulerService {
    /**
     * Generate medication schedules based on frequency
     * @param {number} patientId 
     * @param {number} treatmentId 
     * @param {string} frequency - enum('Once daily', 'Twice daily', etc.)
     * @param {string} startDate - YYYY-MM-DD
     * @param {string} endDate - YYYY-MM-DD
     */
    static async generateSchedule(patientId, treatmentId, frequency, startDate, endDate) {
        const start = new Date(startDate);
        const end = endDate ? new Date(endDate) : new Date(start);
        
        // If no end date, we might want to schedule for a default period (e.g., 30 days)
        // but based on the UI, end_date is usually provided or calculated.
        if (!endDate) {
            end.setDate(start.getDate() + 30); // Default to 30 days if null
        }

        const schedules = [];

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
        if (selectedTimes.length === 0) return;

        let currentDate = new Date(start);
        // Ensure we include the end date in the loop
        while (currentDate <= end) {
            for (const time of selectedTimes) {
                const [hours, minutes] = time.split(':');
                const scheduledTime = new Date(currentDate);
                scheduledTime.setHours(parseInt(hours), parseInt(minutes), 0);

                // For the start day, only schedule future times
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
            const query = 'INSERT INTO medication_schedules (patient_id, treatment_id, scheduled_date_time, status) VALUES ?';
            await db.query(query, [schedules]);
        }
    }

    /**
     * Clear future schedules for a treatment
     */
    static async clearFutureSchedules(treatmentId) {
        const query = 'DELETE FROM medication_schedules WHERE treatment_id = ? AND scheduled_date_time > NOW() AND status = "SCHEDULED"';
        await db.execute(query, [treatmentId]);
    }
}

module.exports = SchedulerService;
