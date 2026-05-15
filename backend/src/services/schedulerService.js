const db = require('../config/database');

/**
 * Production-grade Medication Scheduling Engine
 * Separates concerns into Rules, Calculation, and Generation
 */
class SchedulerService {
    // --- 1. CONFIGURATION & CONSTANTS ---
    static DEFAULT_SCHEDULE = {
        wake_time: '07:00',
        breakfast_time: '08:00',
        lunch_time: '12:30',
        dinner_time: '18:30',
        bedtime: '23:00'
    };

    static FREQUENCY_CONFIG = {
        'Once daily': { count: 1, type: 'daily' },
        'Twice daily': { count: 2, type: 'daily' },
        'Three times daily': { count: 3, type: 'daily' },
        'Four times daily': { count: 4, type: 'daily' },
        'Every 4 hours': { interval: 4, type: 'interval' },
        'Every 6 hours': { interval: 6, type: 'interval' },
        'Every 8 hours': { interval: 8, type: 'interval' },
        'Every 12 hours': { interval: 12, type: 'interval' },
        'Weekly': { type: 'periodic', days: 7 },
        'Monthly': { type: 'periodic', days: 30 },
        'As needed': { type: 'prn' }
    };

    // --- 2. PUBLIC API ---

    /**
     * Generates a full schedule for a treatment
     */
    static async generateSchedule(patientId, treatmentId, frequency, startDate, endDate) {
        try {
            console.log(`🚀 Starting smart generation for Treatment #${treatmentId}`);
            
            // Fetch patient preferences
            const [patients] = await db.execute(
                'SELECT wake_time, bedtime, breakfast_time, lunch_time, dinner_time FROM patients WHERE id = ?',
                [patientId]
            );
            
            const preferences = patients[0] || this.DEFAULT_SCHEDULE;
            const times = this._calculateSmartTimes(frequency, preferences);

            if (times.length === 0) return;

            // Generate daily doses between start and end date
            const start = new Date(startDate);
            const end = endDate ? new Date(endDate) : new Date(start.getTime() + 30 * 24 * 60 * 60 * 1000); // Default 30 days
            
            const doses = [];
            let current = new Date(start);

            while (current <= end) {
                const year = current.getFullYear();
                const month = String(current.getMonth() + 1).padStart(2, '0');
                const day = String(current.getDate()).padStart(2, '0');
                const dateStr = `${year}-${month}-${day}`;

                for (const timeStr of times) {
                    const scheduledDateTimeStr = `${dateStr} ${timeStr}:00`;
                    
                    // Use simple arithmetic for future check
                    const [h, m] = timeStr.split(':').map(Number);
                    const checkDate = new Date(year, current.getMonth(), current.getDate(), h, m);

                    if (checkDate > new Date()) {
                        doses.push([
                            patientId,
                            treatmentId,
                            scheduledDateTimeStr,
                            'SCHEDULED'
                        ]);
                    }
                }
                current.setDate(current.getDate() + 1);
            }

            if (doses.length > 0) {
                const query = 'INSERT INTO medication_schedules (patient_id, treatment_id, scheduled_date_time, status) VALUES ?';
                await db.query(query, [doses]);
                console.log(`✅ Generated ${doses.length} doses for Treatment #${treatmentId}`);
            }
        } catch (error) {
            console.error('❌ Scheduling Engine Error:', error);
            throw error;
        }
    }

    // --- 3. CORE CALCULATION ENGINE (PRIVATE) ---

    /**
     * Internal logic to calculate exact HH:MM times based on rules
     */
    static _calculateSmartTimes(frequencyStr, prefs) {
        const parts = frequencyStr.split('+').map(p => p.trim());
        const resultTimes = new Set();
        
        let mainFreq = null;
        const mealAnchors = [];

        // Parse parts
        for (const part of parts) {
            if (this.FREQUENCY_CONFIG[part]) mainFreq = part;
            else mealAnchors.push(part);
        }

        // Rule 1: Specific meal anchors take absolute priority
        if (mealAnchors.length > 0) {
            for (const anchor of mealAnchors) {
                const t = this._resolveAnchorToTime(anchor, prefs);
                if (t) resultTimes.add(t);
            }
        }

        // Rule 2: If we have a frequency, ensure we meet the count
        if (mainFreq) {
            const config = this.FREQUENCY_CONFIG[mainFreq];
            if (config.type === 'interval') {
                this._fillIntervalTimes(config.interval, prefs, resultTimes);
            } else if (config.type === 'daily') {
                this._fillDailyTimes(config.count, mealAnchors, prefs, resultTimes);
            }
        }

        const sorted = Array.from(resultTimes).sort((a, b) => {
            const [h1, m1] = a.split(':').map(Number);
            const [h2, m2] = b.split(':').map(Number);
            return (h1 * 60 + m1) - (h2 * 60 + m2);
        });

        console.log(`[Scheduler] Calculated times for "${frequencyStr}":`, sorted);
        return sorted;
    }

    /**
     * Resolve meal instructions to exact times with offsets
     */
    static _resolveAnchorToTime(anchor, prefs) {
        const format = (timeStr, offsetMin) => {
            if (!timeStr) return null;
            // timeStr can be HH:MM:SS from MySQL
            const parts = timeStr.split(':');
            const h = parseInt(parts[0]);
            const m = parseInt(parts[1]);
            
            let totalMinutes = h * 60 + m + offsetMin;
            // Handle wrapping around midnight
            totalMinutes = (totalMinutes + 1440) % 1440;
            
            const newH = Math.floor(totalMinutes / 60);
            const newM = totalMinutes % 60;
            
            return `${String(newH).padStart(2, '0')}:${String(newM).padStart(2, '0')}`;
        };

        switch (anchor) {
            case 'Before breakfast': return format(prefs.breakfast_time || '08:00', -30);
            case 'After breakfast':  return format(prefs.breakfast_time || '08:00', 15);
            case 'Before lunch':     return format(prefs.lunch_time || '12:30', -30);
            case 'After lunch':      return format(prefs.lunch_time || '12:30', 15);
            case 'Before dinner':    return format(prefs.dinner_time || '18:30', -30);
            case 'After dinner':     return format(prefs.dinner_time || '18:30', 15);
            case 'Before sleeping':
            case 'Bedtime':          return format(prefs.bedtime || '23:00', -30);
            case 'Empty stomach':    return format(prefs.breakfast_time || '08:00', -60);
            default: return null;
        }
    }

    /**
     * Smart distribution for daily counts (1x, 2x, etc.)
     */
    static _fillDailyTimes(count, existingAnchors, prefs, resultTimes) {
        // If anchors already satisfy the count, do nothing
        if (resultTimes.size >= count) return;

        const defaults = [];
        if (count === 1) defaults.push('After breakfast');
        else if (count === 2) defaults.push('After breakfast', 'After dinner');
        else if (count === 3) defaults.push('After breakfast', 'After lunch', 'After dinner');
        else if (count === 4) {
            resultTimes.add(prefs.wake_time || '07:00');
            defaults.push('After lunch', 'After dinner', 'Bedtime');
        }

        for (const def of defaults) {
            if (resultTimes.size < count) {
                const t = this._resolveAnchorToTime(def, prefs);
                if (t) resultTimes.add(t);
            }
        }
    }

    /**
     * Interval scheduling respecting the waking window
     */
    static _fillIntervalTimes(interval, prefs, resultTimes) {
        const wakeTime = prefs.wake_time || '07:00';
        const [wakeH, wakeM] = wakeTime.split(':').map(Number);
        
        // Interval doses are usually fixed from wake-up
        for (let i = 0; i < (24 / interval); i++) {
            const h = (wakeH + (i * interval)) % 24;
            resultTimes.add(`${String(h).padStart(2, '0')}:${String(wakeM).padStart(2, '0')}`);
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