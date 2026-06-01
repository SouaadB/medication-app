// @ts-nocheck
const db = require('../config/database');

/**
 * Production-grade Medication Scheduling Engine
 * Separates concerns into Rules, Calculation, and Generation
 */
class SchedulerService {

    // ─────────────────────────────────────────────────────────────────────────
    // CONFIGURATION
    // ─────────────────────────────────────────────────────────────────────────

    static DEFAULT_SCHEDULE = {
        wake_time:      '07:00',
        breakfast_time: '08:00',
        lunch_time:     '12:00',
        dinner_time:    '19:30',
        bedtime:        '22:00',
    };

    static FREQUENCY_CONFIG = {
        'Once daily':        { count: 1, type: 'daily' },
        'Twice daily':       { count: 2, type: 'daily' },
        'Three times daily': { count: 3, type: 'daily' },
        'Four times daily':  { count: 4, type: 'daily' },
        'Every 4 hours':     { interval: 4,  type: 'interval' },
        'Every 6 hours':     { interval: 6,  type: 'interval' },
        'Every 8 hours':     { interval: 8,  type: 'interval' },
        'Every 12 hours':    { interval: 12, type: 'interval' },
        'Weekly':            { type: 'periodic', days: 7  },
        'Monthly':           { type: 'periodic', days: 30 },
        'As needed':         { type: 'prn' },
    };

    // ─────────────────────────────────────────────────────────────────────────
    // PUBLIC API
    // ─────────────────────────────────────────────────────────────────────────

    /**
     * Generate a full schedule for a treatment between startDate and endDate.
     */
    static async generateSchedule(patientId, treatmentId, frequency, startDate, endDate) {
        try {
            console.log(`🚀 Starting smart generation for Treatment #${treatmentId}`);

            const [patients] = await db.execute(
                `SELECT wake_time, bedtime, breakfast_time, lunch_time, dinner_time
                 FROM patients WHERE id = ?`,
                [patientId]
            );

            const preferences = patients[0] || this.DEFAULT_SCHEDULE;
            const times = this._calculateSmartTimes(frequency, preferences);

            if (times.length === 0) {
                console.log(`[Scheduler] No times calculated for frequency "${frequency}" — skipping`);
                return;
            }

            const start = new Date(startDate);
            const end   = endDate
                ? new Date(endDate)
                : new Date(start.getTime() + 30 * 24 * 60 * 60 * 1000); // default 30 days

            const doses   = [];
            let   current = new Date(start);

            while (current <= end) {
                const year    = current.getFullYear();
                const month   = String(current.getMonth() + 1).padStart(2, '0');
                const day     = String(current.getDate()).padStart(2, '0');
                const dateStr = `${year}-${month}-${day}`;

                for (const timeStr of times) {
                    const scheduledDateTimeStr = `${dateStr} ${timeStr}:00`;

                    const [h, m]    = timeStr.split(':').map(Number);
                    const checkDate = new Date(year, current.getMonth(), current.getDate(), h, m);

                    if (checkDate > new Date()) {
                        doses.push([patientId, treatmentId, scheduledDateTimeStr, 'SCHEDULED']);
                    }
                }

                current.setDate(current.getDate() + 1);
            }

            if (doses.length > 0) {
                await db.query(
                    'INSERT INTO medication_schedules (patient_id, treatment_id, scheduled_date_time, status) VALUES ?',
                    [doses]
                );
                console.log(`✅ Generated ${doses.length} doses for Treatment #${treatmentId}`);
            }

        } catch (error) {
            console.error('❌ Scheduling Engine Error:', error);
            throw error;
        }
    }

    // ─────────────────────────────────────────────────────────────────────────
    // CORE CALCULATION ENGINE
    // ─────────────────────────────────────────────────────────────────────────

    /**
     * Calculate exact HH:MM times for a given frequency string and patient prefs.
     * Frequency strings can be compound: "Twice daily + After breakfast + After dinner"
     */
    static _calculateSmartTimes(frequencyStr, prefs) {
        const parts       = frequencyStr.split('+').map(p => p.trim());
        const resultTimes = new Set();

        let mainFreq     = null;
        const mealAnchors = [];

        for (const part of parts) {
            if (this.FREQUENCY_CONFIG[part]) mainFreq = part;
            else mealAnchors.push(part);
        }

        // Rule 1: Meal/time anchors take absolute priority
        if (mealAnchors.length > 0) {
            for (const anchor of mealAnchors) {
                const t = this._resolveAnchorToTime(anchor, prefs);
                if (t) resultTimes.add(t);
            }
        }

        // Rule 2: If a frequency count is specified, fill remaining slots
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

        console.log(`[Scheduler] Times for "${frequencyStr}":`, sorted);
        return sorted;
    }

    /**
     * Resolve a meal/time anchor to an exact HH:MM string.
     *
     * FIX (bedtime): 'Before sleeping' now stores the actual bedtime as
     * scheduled_date_time (offset 0), NOT bedtime-30.
     * The notification engine owns the -30 offset via the BEDTIME_PREP stage.
     * Previously storing bedtime-30 caused a double-offset that fired
     * notifications 75 and 45 minutes before bedtime instead of 30 and 0.
     */
    static _resolveAnchorToTime(anchor, prefs) {
        const format = (timeStr, offsetMin) => {
            if (!timeStr) return null;
            const parts = timeStr.split(':');
            const h = parseInt(parts[0]);
            const m = parseInt(parts[1]);

            let totalMinutes = h * 60 + m + offsetMin;
            totalMinutes = (totalMinutes + 1440) % 1440; // handle midnight wrap

            const newH = Math.floor(totalMinutes / 60);
            const newM = totalMinutes % 60;

            return `${String(newH).padStart(2, '0')}:${String(newM).padStart(2, '0')}`;
        };

        switch (anchor) {
            case 'Before breakfast':  return format(prefs.breakfast_time || '08:00', -15);
            case 'During breakfast':  return format(prefs.breakfast_time || '08:00',   5);
            case 'After breakfast':   return format(prefs.breakfast_time || '08:00',  20);
            case 'Before lunch':      return format(prefs.lunch_time     || '12:00', -15);
            case 'During lunch':      return format(prefs.lunch_time     || '12:00',   5);
            case 'After lunch':       return format(prefs.lunch_time     || '12:00',  20);
            case 'Before dinner':     return format(prefs.dinner_time    || '19:30', -15);
            case 'During dinner':     return format(prefs.dinner_time    || '19:30',   5);
            case 'After dinner':      return format(prefs.dinner_time    || '19:30',  20);
            // Empty stomach: schedule at wake_time + 20min so that:
            //   EMPTY_STOMACH_PREP fires at wake + 5min  (dose - 15min)
            //   MAIN               fires at wake + 20min (dose time)
            //   SAFE_TO_EAT        fires at wake + 60min (dose + 40min = breakfast_time)
            // This requires breakfast_time = wake_time + 60min minimum (enforced by DailySchedulePage).
            // Example: wake=07:00 → dose at 07:20, PREP at 07:05, SAFE_TO_EAT at 08:00
            case 'Empty stomach':     return format(prefs.wake_time || '07:00', 20);

            // FIX: store actual bedtime — notification engine owns all offsets
            case 'Before sleeping':   return format(prefs.bedtime        || '22:00',   0);

            default: return null;
        }
    }

    /**
     * Smart distribution for daily counts (1×, 2×, 3×, 4×).
     * If meal anchors already satisfy the count, does nothing.
     */
    static _fillDailyTimes(count, existingAnchors, prefs, resultTimes) {
        if (resultTimes.size >= count) return;

        const defaults = [];
        if      (count === 1) defaults.push('After breakfast');
        else if (count === 2) defaults.push('After breakfast', 'After dinner');
        else if (count === 3) defaults.push('After breakfast', 'After lunch', 'After dinner');
        else if (count === 4) {
            resultTimes.add(prefs.wake_time || '07:00');
            defaults.push('After lunch', 'After dinner', 'Before sleeping');
        }

        for (const def of defaults) {
            if (resultTimes.size < count) {
                const t = this._resolveAnchorToTime(def, prefs);
                if (t) resultTimes.add(t);
            }
        }
    }

    /**
     * Interval scheduling — distributes doses strictly by interval within the
     * patient's waking window (wake_time → bedtime). Never schedules past bedtime
     * or during sleep.
     *
     * Algorithm:
     *   - First dose at wake_time.
     *   - Each subsequent dose at wake_time + i * interval.
     *   - Stop when the next dose would exceed bedtime.
     *   - Handles overnight windows (e.g. wake=06:00, bed=01:00).
     *
     * Examples (wake=07:00, bed=22:00 → 15h window):
     *   Every  4h → 07:00, 11:00, 15:00, 19:00  (4 doses, strict 4h gaps)
     *   Every  6h → 07:00, 13:00, 19:00          (3 doses, strict 6h gaps)
     *   Every  8h → 07:00, 15:00                 (2 doses, next 23:00 > bed)
     *   Every 12h → 07:00, 19:00                 (2 doses, next 07:00 = next day)
     *
     * Why not redistribute evenly?
     *   "Every 8 hours" means the drug must maintain concentration for 8h.
     *   Stretching to 15h between doses defeats the medical purpose.
     *   We accept fewer doses rather than distort the interval.
     */
    static _fillIntervalTimes(interval, prefs, resultTimes) {
        const parseMin = (timeStr, fallback) => {
            if (!timeStr) return fallback;
            const parts = timeStr.toString().split(':');
            return parseInt(parts[0]) * 60 + parseInt(parts[1] || 0);
        };

        const wakeMin     = parseMin(prefs.wake_time, 7 * 60);
        const bedtimeMin  = parseMin(prefs.bedtime,   22 * 60);
        const intervalMin = interval * 60;

        // Waking window in minutes (handle overnight wrap e.g. bed=01:00)
        let windowMin = bedtimeMin - wakeMin;
        if (windowMin <= 0) windowMin += 24 * 60;

        const toTime = (totalMin) => {
            const wrapped = ((Math.round(totalMin) % 1440) + 1440) % 1440;
            const h = Math.floor(wrapped / 60);
            const m = wrapped % 60;
            return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
        };

        let offset = 0;
        while (offset <= windowMin) {
            resultTimes.add(toTime(wakeMin + offset));
            offset += intervalMin;
        }

        // Safety: if nothing was added (window = 0), add wake time
        if (resultTimes.size === 0) {
            resultTimes.add(toTime(wakeMin));
        }

        console.log(
            `[Scheduler] Every ${interval}h → ${resultTimes.size} doses:`,
            Array.from(resultTimes).sort()
        );
    }

    // ─────────────────────────────────────────────────────────────────────────
    // SCHEDULE ACTIONS
    // ─────────────────────────────────────────────────────────────────────────

    /**
     * Mark a dose as taken.
     * Records taken_time and inserts a "prise en retard" notification if > 30 min late.
     */
    static async markAsTaken(scheduleId) {
        try {
            await db.execute("SET time_zone = '+01:00'");

            const now = new Date();

            const [scheduleInfo] = await db.execute(
                `SELECT ms.patient_id, t.medication_name, t.dosage, ms.scheduled_date_time
                 FROM medication_schedules ms
                 JOIN treatments t ON ms.treatment_id = t.id
                 WHERE ms.id = ?`,
                [scheduleId]
            );

            if (scheduleInfo.length === 0) return false;

            const [result] = await db.execute(
                `UPDATE medication_schedules
                 SET status = 'TAKEN', taken_time = ?
                 WHERE id = ? AND status IN ('SCHEDULED', 'MISSED')`,
                [now, scheduleId]
            );

            if (result.affectedRows > 0) {
                const scheduledTime  = new Date(scheduleInfo[0].scheduled_date_time);
                const minutesLate    = Math.round((now - scheduledTime) / 60000);

                // Insert a late-dose notification if more than 30 min late
                if (minutesLate > 30) {
                    await db.execute(
                        `INSERT INTO notifications
                         (patient_id, type, title, message, data, scheduled_time)
                         VALUES (?, 'reminder', ?, ?, ?, ?)`,
                        [
                            scheduleInfo[0].patient_id,
                            '⏰ Dose taken late',
                            `You took ${scheduleInfo[0].medication_name}${scheduleInfo[0].dosage ? ' ' + scheduleInfo[0].dosage : ''} ${minutesLate} minutes late.`,
                            JSON.stringify({ scheduleId, minutesLate }),
                            now,
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

    /**
     * Mark all overdue SCHEDULED doses as MISSED.
     */
    static async markMissedDoses() {
        try {
            const [result] = await db.execute(
                `UPDATE medication_schedules
                 SET status = 'MISSED'
                 WHERE status = 'SCHEDULED'
                 AND scheduled_date_time < NOW()`
            );
            console.log(`Marked ${result.affectedRows} doses as MISSED`);
            return result.affectedRows;
        } catch (error) {
            console.error('Error marking missed doses:', error);
            throw error;
        }
    }

    /**
     * Clear all future SCHEDULED doses for a treatment (e.g. when treatment is updated).
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

    // ─────────────────────────────────────────────────────────────────────────
    // QUERIES
    // ─────────────────────────────────────────────────────────────────────────

    static async getTodaySchedule(patientId) {
        try {
            const [rows] = await db.execute(
                `SELECT ms.*, t.medication_name, t.dosage, c.name AS condition_name
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

    static async getUpcomingDoses(patientId, limit = 5) {
        try {
            const [rows] = await db.execute(
                `SELECT ms.*, t.medication_name, t.dosage, c.name AS condition_name
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
     * Adherence statistics for a patient over the last N days.
     */
    static async getAdherenceStats(patientId, days = 30) {
        try {
            const [rows] = await db.execute(
                `SELECT
                    COUNT(*) AS total,
                    SUM(CASE WHEN status = 'TAKEN'     THEN 1 ELSE 0 END) AS taken,
                    SUM(CASE WHEN status = 'MISSED'    THEN 1 ELSE 0 END) AS missed,
                    SUM(CASE WHEN status = 'SKIPPED'   THEN 1 ELSE 0 END) AS skipped,
                    SUM(CASE WHEN status = 'SCHEDULED'
                             AND scheduled_date_time < NOW() THEN 1 ELSE 0 END) AS overdue
                 FROM medication_schedules
                 WHERE patient_id = ?
                 AND scheduled_date_time >= DATE_SUB(NOW(), INTERVAL ? DAY)`,
                [patientId, days]
            );

            const s             = rows[0];
            const adherenceRate = s.total > 0
                ? Math.round((s.taken / s.total) * 100)
                : 0;

            return {
                total:        s.total,
                taken:        s.taken,
                missed:       s.missed,
                skipped:      s.skipped,
                overdue:      s.overdue,
                adherenceRate,
            };
        } catch (error) {
            console.error('Error getting adherence stats:', error);
            throw error;
        }
    }

    /**
     * Current consecutive-day streak (all doses taken on time).
     */
    static async getCurrentStreak(patientId) {
        try {
            const query = `
                WITH daily_status AS (
                    SELECT
                        DATE(scheduled_date_time) AS dose_date,
                        MAX(CASE WHEN status = 'TAKEN' THEN 1 ELSE 0 END) AS all_taken
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
                            OVER (ORDER BY dose_date DESC) AS break_group
                    FROM daily_status
                    WHERE dose_date <= CURDATE()
                )
                SELECT COUNT(*) AS current_streak
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

module.exports = SchedulerService;