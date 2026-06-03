const db = require('../config/database');
const bcrypt = require('bcryptjs');

// Generate random temporary password
function generateTempPassword() {
    const length = 10;
    const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$";
    let password = "";
    for (let i = 0; i < length; i++) {
        password += charset.charAt(Math.floor(Math.random() * charset.length));
    }
    return password;
}

class Caregiver {
    static async create(caregiverData) {
        const { patient_id, name, relationship, email, view_location, view_medications, receive_alerts } = caregiverData;
        
        // Generate temporary password
        const tempPassword = generateTempPassword();
        const hashedPassword = await bcrypt.hash(tempPassword, 10);
        
        const query = `
            INSERT INTO caregivers (patient_id, name, relationship, email, view_location, view_medications, receive_alerts, temp_password, status) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'PENDING')
        `;
        const [result] = await db.execute(query, [
            patient_id, 
            name, 
            relationship, 
            email, 
            view_location || 0, 
            view_medications !== undefined ? view_medications : 1, 
            receive_alerts !== undefined ? receive_alerts : 1,
            hashedPassword
        ]);
        
        return { insertId: result.insertId, tempPassword };
    }

    static async findByPatientId(patientId) {
        const query = `SELECT id, name, relationship, email, status, view_location, view_medications, receive_alerts, created_at 
                       FROM caregivers WHERE patient_id = ? AND status != 'REVOKED' ORDER BY created_at DESC`;
        const [rows] = await db.execute(query, [patientId]);
        return rows;
    }

    static async updateStatus(id, patientId, status) {
        const query = 'UPDATE caregivers SET status = ? WHERE id = ? AND patient_id = ?';
        const [result] = await db.execute(query, [status, id, patientId]);
        return result;
    }

    static async delete(id, patientId) {
        const query = 'UPDATE caregivers SET status = "REVOKED" WHERE id = ? AND patient_id = ?';
        const [result] = await db.execute(query, [id, patientId]);
        return result;
    }
    
    // Find pending invitation by email
    static async findPendingInvitation(email) {
        const query = `SELECT * FROM caregivers WHERE email = ? AND status = 'PENDING' AND expires_at > NOW()`;
        const [rows] = await db.execute(query, [email]);
        return rows[0];
    }
    
    // Accept invitation and create caregiver user
    static async acceptInvitation(invitation, password) {
        const { id, patient_id, name, email, view_location, view_medications, receive_alerts } = invitation;
        
        // Check if caregiver user already exists
        const [existing] = await db.execute('SELECT * FROM caregiver_users WHERE email = ?', [email]);
        
        let caregiverUserId;
        
        if (existing.length === 0) {
            const hashedPassword = await bcrypt.hash(password, 10);
            const [result] = await db.execute(
                'INSERT INTO caregiver_users (email, name, password) VALUES (?, ?, ?)',
                [email, name, hashedPassword]
            );
            caregiverUserId = result.insertId;
        } else {
            caregiverUserId = existing[0].id;
        }
        
        // Update invitation status
        await db.execute('UPDATE caregivers SET status = "ACTIVE" WHERE id = ?', [id]);
        
        return caregiverUserId;
    }
    
    // Get patients for a caregiver
    static async getPatientsForCaregiver(email) {
        const query = `
            SELECT 
                p.id, 
                u.name, 
                u.email, 
                u.phone,
                c.relationship,
                c.view_location, 
                c.view_medications, 
                c.receive_alerts,
                (SELECT COUNT(*) FROM treatments WHERE patient_id = p.id AND is_active = 1) as medication_count,
                (SELECT ROUND(AVG(CASE WHEN ms.status = 'TAKEN' THEN 100 ELSE 0 END), 1) 
                 FROM medication_schedules ms 
                 WHERE ms.patient_id = p.id AND ms.scheduled_date_time > DATE_SUB(NOW(), INTERVAL 30 DAY)) as adherence_rate,
                (SELECT current_streak FROM patient_streaks WHERE patient_id = p.id) as current_streak
            FROM caregivers c
            JOIN patients p ON c.patient_id = p.id
            JOIN users u ON p.id = u.id
            WHERE c.email = ? AND c.status = 'ACTIVE'
        `;
        const [rows] = await db.execute(query, [email]);
        return rows;
    }
}

module.exports = Caregiver;