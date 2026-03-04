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
        const query = 'SELECT id, chifa_card_registration_number, date_of_birth, smartphone_skill_level, is_active, age FROM patients WHERE id = ?';
        const [rows] = await db.execute(query, [userId]);
        return rows[0];
    }

    static async setupProfile(userId, profileData) {
        const { age, conditions } = profileData;
        const connection = await db.getConnection();
        
        try {
            await connection.beginTransaction();

            // 1. Update age in patients table
            await connection.execute(
                'UPDATE patients SET age = ? WHERE id = ?',
                [age, userId]
            );

            // 2. Clear existing conditions for this patient
            await connection.execute(
                'DELETE FROM patient_conditions WHERE patient_id = ?',
                [userId]
            );

            // 3. Insert new conditions
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
            SELECT c.id, c.name, c.description 
            FROM chronic_conditions c
            JOIN patient_conditions pc ON c.id = pc.condition_id
            WHERE pc.patient_id = ?
        `;
        const [rows] = await db.execute(query, [userId]);
        return rows;
    }

    static async getAllConditions() {
        const query = 'SELECT id, name, description FROM chronic_conditions';
        const [rows] = await db.execute(query);
        return rows;
    }

    // Check if CHIFA number already exists
    static async findByChifaNumber(chifaNumber) {
        const query = 'SELECT id FROM patients WHERE chifa_card_registration_number = ?';
        const [rows] = await db.execute(query, [chifaNumber]);
        return rows[0];
    }
}

module.exports = Patient;