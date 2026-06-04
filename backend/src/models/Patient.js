const db = require('../config/database');

class Patient {
    static async create(patientData) {
        const { id, chifaCardRegistrationNumber, dateOfBirth, smartphoneSkillLevel } = patientData;
        const query = `INSERT INTO patients (id, chifa_card_registration_number, date_of_birth, smartphone_skill_level, is_active) 
                       VALUES (?, ?, ?, ?, true)`;
        const [result] = await db.execute(query, [id, chifaCardRegistrationNumber, dateOfBirth, smartphoneSkillLevel]);
        return result;
    }

    static async findByUserId(userId) {
        const query = `
            SELECT 
                id, chifa_card_registration_number, date_of_birth, smartphone_skill_level, is_active, age,
                all_notifications, medication_reminders, adherence_alerts, smart_insights,
                sound_enabled, vibration_enabled, dark_mode, auto_refill_reminders,
                smart_scheduling_enabled, bedtime, wake_time, breakfast_time, lunch_time, dinner_time
            FROM patients 
            WHERE id = ?
        `;
        const [rows] = await db.execute(query, [userId]);
        return rows[0];
    }

    static async updateSettings(userId, settings) {
        const fields = [];
        const values = [];

        const allowedSettings = [
            'all_notifications', 'medication_reminders', 'adherence_alerts', 'smart_insights',
            'sound_enabled', 'vibration_enabled', 'dark_mode', 'auto_refill_reminders'
        ];

        for (const key of allowedSettings) {
            if (settings[key] !== undefined) {
                fields.push(`${key} = ?`);
                values.push(settings[key]);
            }
        }

        if (fields.length === 0) return null;

        values.push(userId);
        const query = `UPDATE patients SET ${fields.join(', ')} WHERE id = ?`;
        const [result] = await db.execute(query, values);
        return result;
    }

    static async updateDailySchedule(userId, schedule) {
        const fields = [];
        const values = [];

        const allowedFields = [
            'smart_scheduling_enabled', 'bedtime', 'wake_time', 'breakfast_time', 'lunch_time', 'dinner_time'
        ];

        for (const key of allowedFields) {
            if (schedule[key] !== undefined) {
                fields.push(`${key} = ?`);
                values.push(schedule[key]);
            }
        }

        if (fields.length === 0) return null;

        values.push(userId);
        const query = `UPDATE patients SET ${fields.join(', ')} WHERE id = ?`;
        const [result] = await db.execute(query, values);
        return result;
    }

static async setupProfile(userId, profileData) {
    const { conditions } = profileData;
    const connection = await db.getConnection();
    
    try {
        await connection.beginTransaction();

        // 1. Clear existing conditions for this patient
        await connection.execute(
            'DELETE FROM patient_conditions WHERE patient_id = ?',
            [userId]
        );

        // 2. Insert new conditions
        if (conditions && conditions.length > 0) {
            const conditionQueries = conditions.map(conditionId => 
                connection.execute(
                    'INSERT INTO patient_conditions (patient_id, condition_id) VALUES (?, ?)',
                    [userId, conditionId]
                )
            );
            await Promise.all(conditionQueries);
        }

        await connection.commit();
        return { success: true };
    } catch (error) {
        await connection.rollback();
        throw error;
    } finally {
        connection.release();
    }
}

    static async getPatientConditions(userId) {
        const query = `
            SELECT c.id, c.name 
            FROM chronic_conditions c
            JOIN patient_conditions pc ON c.id = pc.condition_id
            WHERE pc.patient_id = ?
        `;
        const [rows] = await db.execute(query, [userId]);
        return rows;
    }

    static async getAllConditions() {
        const query = 'SELECT id, name FROM chronic_conditions';
        const [rows] = await db.execute(query);
        return rows;
    }

    // Check if CHIFA number already exists
    static async findByChifaNumber(chifaNumber) {
        const query = 'SELECT id FROM patients WHERE chifa_card_registration_number = ?';
        const [rows] = await db.execute(query, [chifaNumber]);
        return rows[0];
    }

    // Get patient's conditions with adherence rate (FIXED: using medication_schedules)
    static async getConditionsWithAdherence(patientId) {
        const query = `
            SELECT 
                cc.id,
                cc.name,
                COUNT(DISTINCT t.id) as medication_count,
                COALESCE(
                    (
                        SELECT 
                            ROUND(
                                (SUM(CASE WHEN ms.status = 'TAKEN' THEN 1 ELSE 0 END) * 100.0) / 
                                NULLIF(COUNT(*), 0)
                            )
                        FROM treatments t2
                        LEFT JOIN medication_schedules ms ON t2.id = ms.treatment_id
                        WHERE t2.patient_id = ? AND t2.condition_id = cc.id
                        AND ms.scheduled_date_time >= DATE_SUB(NOW(), INTERVAL 30 DAY)
                    ), 0
                ) as adherence_rate
            FROM patient_conditions pc
            JOIN chronic_conditions cc ON pc.condition_id = cc.id
            LEFT JOIN treatments t ON t.patient_id = pc.patient_id AND t.condition_id = cc.id AND t.is_active = 1
            WHERE pc.patient_id = ?
            GROUP BY cc.id, cc.name
        `;
        const [rows] = await db.execute(query, [patientId, patientId]);
        return rows;
    }

    // Get patient's current streak (FIXED: using medication_schedules)
    static async getCurrentStreak(patientId) {
        const query = `
            WITH daily_intakes AS (
                SELECT 
                    DATE(scheduled_date_time) as intake_date,
                    MAX(CASE 
                        WHEN status = 'TAKEN' THEN 1 ELSE 0 
                    END) as taken_on_time
                FROM medication_schedules
                WHERE patient_id = ?
                GROUP BY DATE(scheduled_date_time)
                ORDER BY intake_date DESC
            ),
            streak_calc AS (
                SELECT 
                    intake_date,
                    taken_on_time,
                    SUM(CASE WHEN taken_on_time = 0 THEN 1 ELSE 0 END) 
                        OVER (ORDER BY intake_date DESC) as break_group
                FROM daily_intakes
                WHERE intake_date <= CURDATE()
            )
            SELECT COUNT(*) as current_streak
            FROM streak_calc
            WHERE break_group = 0 AND taken_on_time = 1
        `;
        const [rows] = await db.execute(query, [patientId]);
        return rows[0]?.current_streak || 0;
    }

    // Get overall adherence percentage (FIXED: using medication_schedules)
    static async getOverallAdherence(patientId, days = 30) {
        const query = `
            SELECT 
                COUNT(*) as total_scheduled,
                SUM(CASE WHEN status = 'TAKEN' THEN 1 ELSE 0 END) as total_taken
            FROM medication_schedules 
            WHERE patient_id = ? 
            AND scheduled_date_time >= DATE_SUB(NOW(), INTERVAL ? DAY)
        `;
        const [rows] = await db.execute(query, [patientId, days]);
        
        const total = rows[0];
        if (total.total_scheduled > 0) {
            return Math.round((total.total_taken / total.total_scheduled) * 100);
        }
        return 0;
    }
}

module.exports = Patient;