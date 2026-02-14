const db = require('../config/database');

class Admin {
    static async create(id) {
        const query = 'INSERT INTO admins (id) VALUES (?)';
        const [result] = await db.execute(query, [id]);
        return result;
    }

    static async findByUserId(userId) {
        const query = 'SELECT * FROM admins WHERE id = ?';
        const [rows] = await db.execute(query, [userId]);
        return rows[0];
    }
}

module.exports = Admin;