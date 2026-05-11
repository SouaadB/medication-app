const db = require('../config/database');

class Caregiver {
    static async create(caregiverData) {
        const { patient_id, name, relationship, email, view_location, view_medications, receive_alerts } = caregiverData;
        const query = `
            INSERT INTO caregivers (patient_id, name, relationship, email, view_location, view_medications, receive_alerts) 
            VALUES (?, ?, ?, ?, ?, ?, ?)
        `;
        const [result] = await db.execute(query, [
            patient_id, 
            name, 
            relationship, 
            email, 
            view_location || false, 
            view_medications !== undefined ? view_medications : true, 
            receive_alerts !== undefined ? receive_alerts : true
        ]);
        return result.insertId;
    }

    static async findByPatientId(patientId) {
        const query = 'SELECT * FROM caregivers WHERE patient_id = ? ORDER BY created_at DESC';
        const [rows] = await db.execute(query, [patientId]);
        return rows;
    }

    static async updateStatus(id, patientId, status) {
        const query = 'UPDATE caregivers SET status = ? WHERE id = ? AND patient_id = ?';
        const [result] = await db.execute(query, [status, id, patientId]);
        return result;
    }

    static async delete(id, patientId) {
        const query = 'DELETE FROM caregivers WHERE id = ? AND patient_id = ?';
        const [result] = await db.execute(query, [id, patientId]);
        return result;
    }
}

module.exports = Caregiver;
