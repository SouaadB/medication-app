const db = require('../config/database');

class EmergencyContact {
    static async findByPatientId(patientId) {
        const query = 'SELECT * FROM emergency_contacts WHERE patient_id = ?';
        const [rows] = await db.execute(query, [patientId]);
        return rows[0];
    }

    static async create(patientId, contactData) {
        const { name, relationship, phone_number, is_active } = contactData;
        const query = `
            INSERT INTO emergency_contacts (patient_id, name, relationship, phone_number, is_active)
            VALUES (?, ?, ?, ?, ?)
        `;
        const [result] = await db.execute(query, [patientId, name, relationship, phone_number, is_active || false]);
        return result.insertId;
    }

    static async update(patientId, contactData) {
        const { name, relationship, phone_number, is_active } = contactData;
        const query = `
            UPDATE emergency_contacts 
            SET name = ?, relationship = ?, phone_number = ?, is_active = ?
            WHERE patient_id = ?
        `;
        const [result] = await db.execute(query, [name, relationship, phone_number, is_active, patientId]);
        return result;
    }

    static async toggle(patientId, is_active) {
        const query = 'UPDATE emergency_contacts SET is_active = ? WHERE patient_id = ?';
        const [result] = await db.execute(query, [is_active, patientId]);
        return result;
    }

    static async delete(patientId) {
        const query = 'DELETE FROM emergency_contacts WHERE patient_id = ?';
        const [result] = await db.execute(query, [patientId]);
        return result;
    }
}

module.exports = EmergencyContact;