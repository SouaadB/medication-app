const db = require('../config/database');

class Achievement {
    static async findAll() {
        const query = 'SELECT * FROM achievements ORDER BY criteria_value ASC';
        const [rows] = await db.execute(query);
        return rows;
    }

    static async findById(id) {
        const query = 'SELECT * FROM achievements WHERE id = ?';
        const [rows] = await db.execute(query, [id]);
        return rows[0];
    }

    static async findByCriteria(criteriaType, criteriaValue) {
        const query = 'SELECT * FROM achievements WHERE criteria_type = ? AND criteria_value <= ?';
        const [rows] = await db.execute(query, [criteriaType, criteriaValue]);
        return rows;
    }
}

module.exports = Achievement;