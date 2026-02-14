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
        const query = 'SELECT id, chifa_card_registration_number, date_of_birth, smartphone_skill_level, is_active FROM patients WHERE id = ?';
        const [rows] = await db.execute(query, [userId]);
        return rows[0];
    }

    // Check if CHIFA number already exists
    static async findByChifaNumber(chifaNumber) {
        const query = 'SELECT id FROM patients WHERE chifa_card_registration_number = ?';
        const [rows] = await db.execute(query, [chifaNumber]);
        return rows[0];
    }
}

module.exports = Patient;