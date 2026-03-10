const db = require('../config/database');

class PatientAchievement {
    static async findByPatientId(patientId) {
        const query = `
            SELECT a.*, pa.earned_at
            FROM patient_achievements pa
            JOIN achievements a ON pa.achievement_id = a.id
            WHERE pa.patient_id = ?
            ORDER BY pa.earned_at DESC
        `;
        const [rows] = await db.execute(query, [patientId]);
        return rows;
    }

    static async award(patientId, achievementId) {
        const query = `
            INSERT IGNORE INTO patient_achievements (patient_id, achievement_id)
            VALUES (?, ?)
        `;
        const [result] = await db.execute(query, [patientId, achievementId]);
        return result;
    }

    static async checkAndAward(patientId, criteriaType, criteriaValue) {
        const [achievements] = await db.execute(
            'SELECT id FROM achievements WHERE criteria_type = ? AND criteria_value <= ?',
            [criteriaType, criteriaValue]
        );
        
        for (const achievement of achievements) {
            await this.award(patientId, achievement.id);
        }
    }
}

module.exports = PatientAchievement;