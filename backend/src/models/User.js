const db = require('../config/database');

class User {
    static async create(userData) {
        const { name, email, password, phone, role } = userData;
        const query = 'INSERT INTO users (name, email, password, phone, role) VALUES (?, ?, ?, ?, ?)';
        const [result] = await db.execute(query, [name, email, password, phone, role || 'patient']);
        return result.insertId;
    }

    static async findByEmail(email) {
        const query = 'SELECT * FROM users WHERE email = ?';
        const [rows] = await db.execute(query, [email]);
        return rows[0];
    }

    static async findById(id) {
        const query = 'SELECT id, name, email, phone, role, created_at FROM users WHERE id = ?';
        const [rows] = await db.execute(query, [id]);
        return rows[0];
    }
    static async findByPhone(phone) {
    const cleanPhone = phone.replace(/\D/g, '');
    const query = 'SELECT * FROM users WHERE phone = ?';
    const [rows] = await db.execute(query, [cleanPhone]);
    return rows[0];
}
}

module.exports = User;