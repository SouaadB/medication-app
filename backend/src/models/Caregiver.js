const db = require('../config/database');

// Thin identity table, FK'd to users.id — same pattern as Admin/Patient.
class Caregiver {
    static async create(id, fcmToken = null) {
        const query = 'INSERT INTO caregivers (id, fcm_token) VALUES (?, ?)';
        const [result] = await db.execute(query, [id, fcmToken]);
        return result;
    }

    static async findByUserId(id) {
        const query = 'SELECT * FROM caregivers WHERE id = ?';
        const [rows] = await db.execute(query, [id]);
        return rows[0];
    }

    static async updateFcmToken(id, fcmToken) {
        const query = 'UPDATE caregivers SET fcm_token = ? WHERE id = ?';
        const [result] = await db.execute(query, [fcmToken, id]);
        return result;
    }
}

module.exports = Caregiver;
