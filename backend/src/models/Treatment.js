const db = require('../config/database');

class Treatment {

    static async create(treatmentData) {
        const {
            patient_id,
            condition_id,
            medication_name,
            dosage,
            frequency,
            priority,
            start_date,
            end_date,
            barcode_data      // ← ADDED
        } = treatmentData;

        const query = `
            INSERT INTO treatments
                (patient_id, condition_id, medication_name, dosage, frequency, priority, start_date, end_date, barcode_data)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;

        const values = [
            patient_id,
            condition_id  ?? null,
            medication_name,
            dosage        ?? null,
            frequency,
            priority      || 'MEDIUM',
            start_date,
            end_date      ?? null,
            barcode_data  ?? null   // ← ADDED (already JSON-stringified by controller)
        ];

        console.log('Executing treatment query with values:', values);

        const [result] = await db.execute(query, values);
        return result.insertId;
    }

    static async findById(id) {
        const query = 'SELECT * FROM treatments WHERE id = ?';
        const [rows] = await db.execute(query, [id]);
        return rows[0];
    }

    static async findByPatientId(patientId) {
        const query = `
            SELECT t.*, c.name as condition_name
            FROM treatments t
            LEFT JOIN chronic_conditions c ON t.condition_id = c.id
            WHERE t.patient_id = ? AND t.is_active = true
            ORDER BY t.created_at DESC
        `;
        const [rows] = await db.execute(query, [patientId]);
        return rows;
    }

    // ── FIXED: removed is_active filter so the detail page shows ALL medications
    // (active and inactive) for a condition — the card already shows the status badge
    static async findByConditionId(patientId, conditionId) {
        const query = `
            SELECT t.*, c.name as condition_name
            FROM treatments t
            LEFT JOIN chronic_conditions c ON t.condition_id = c.id
            WHERE t.patient_id = ? AND t.condition_id = ?
            ORDER BY t.is_active DESC, t.created_at DESC
        `;
        const [rows] = await db.execute(query, [patientId, conditionId]);
        return rows;
    }

    static async update(id, updateData) {
        const fields = Object.keys(updateData).map(key => `${key} = ?`).join(', ');
        const values = [...Object.values(updateData), id];
        const query  = `UPDATE treatments SET ${fields} WHERE id = ?`;
        const [result] = await db.execute(query, values);
        return result;
    }

    // Soft delete — sets is_active to false instead of removing the row
    static async delete(id) {
        const query = 'UPDATE treatments SET is_active = false WHERE id = ?';
        const [result] = await db.execute(query, [id]);
        return result;
    }

    static async getNextDose(patientId) {
        const query = `
            SELECT ms.*, t.medication_name, t.dosage, c.name as condition_name
            FROM medication_schedules ms
            JOIN treatments t ON ms.treatment_id = t.id
            LEFT JOIN chronic_conditions c ON t.condition_id = c.id
            WHERE ms.patient_id = ?
            AND ms.scheduled_date_time > NOW()
            AND ms.status = 'SCHEDULED'
            ORDER BY ms.scheduled_date_time ASC
            LIMIT 1
        `;
        const [rows] = await db.execute(query, [patientId]);
        return rows[0];
    }
}

module.exports = Treatment;