const db = require('../config/database');

// Represents the patient<->caregiver relationship/permissions, separate from
// caregiver identity (which lives in users/caregivers). One caregiver can be
// assigned to many patients via separate rows here.
class CaregiverAssignment {
    static async create(data) {
        const { patient_id, caregiver_id, relationship, status, view_location, view_medications, receive_alerts, expires_at, invite_token } = data;
        const query = `
            INSERT INTO caregiver_assignment
            (patient_id, caregiver_id, relationship, status, view_location, view_medications, receive_alerts, invite_token, expires_at)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;
        const [result] = await db.execute(query, [
            patient_id, caregiver_id, relationship, status || 'PENDING',
            view_location || 0, view_medications !== undefined ? view_medications : 1,
            receive_alerts !== undefined ? receive_alerts : 1,
            invite_token || null, expires_at || null
        ]);
        return result;
    }

    static async findByPatientId(patientId) {
        const query = `
            SELECT ca.id, ca.caregiver_id, u.name, u.email, ca.relationship, ca.status,
                   ca.view_location, ca.view_medications, ca.receive_alerts, ca.created_at
            FROM caregiver_assignment ca
            JOIN users u ON u.id = ca.caregiver_id
            WHERE ca.patient_id = ? AND ca.status != 'REVOKED'
            ORDER BY ca.created_at DESC
        `;
        const [rows] = await db.execute(query, [patientId]);
        return rows;
    }

    static async findOne(patientId, caregiverId) {
        const query = 'SELECT * FROM caregiver_assignment WHERE patient_id = ? AND caregiver_id = ?';
        const [rows] = await db.execute(query, [patientId, caregiverId]);
        return rows[0];
    }

    static async updateStatus(patientId, caregiverId, status) {
        const query = 'UPDATE caregiver_assignment SET status = ? WHERE patient_id = ? AND caregiver_id = ?';
        const [result] = await db.execute(query, [status, patientId, caregiverId]);
        return result;
    }

    static async revoke(patientId, caregiverId) {
        return this.updateStatus(patientId, caregiverId, 'REVOKED');
    }

    static async reactivate(patientId, caregiverId, { relationship, view_location, view_medications, receive_alerts }) {
        const query = `
            UPDATE caregiver_assignment
            SET relationship = ?, view_location = ?, view_medications = ?, receive_alerts = ?,
                status = 'ACTIVE'
            WHERE patient_id = ? AND caregiver_id = ?
        `;
        const [result] = await db.execute(query, [
            relationship, view_location || 0, view_medications || 1, receive_alerts || 1,
            patientId, caregiverId
        ]);
        return result;
    }

    static async findActiveForCaregiver(caregiverId) {
        const query = `
            SELECT ca.patient_id, ca.relationship, ca.view_location, ca.view_medications, ca.receive_alerts
            FROM caregiver_assignment ca
            WHERE ca.caregiver_id = ? AND ca.status = 'ACTIVE'
        `;
        const [rows] = await db.execute(query, [caregiverId]);
        return rows;
    }
}

module.exports = CaregiverAssignment;
