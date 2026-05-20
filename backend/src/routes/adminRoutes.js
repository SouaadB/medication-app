const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/authMiddleware');
const db = require('../config/database');

// Get all patients with their caregivers (admin only)
router.get('/patients', protect, authorize('admin'), async (req, res) => {
    try {
        const [patients] = await db.execute(`
            SELECT 
                u.id, 
                u.name, 
                u.email, 
                u.phone, 
                u.created_at,
                p.chifa_card_registration_number, 
                p.date_of_birth, 
                p.smartphone_skill_level, 
                p.is_active,
                COALESCE(
                    (SELECT ROUND(AVG(CASE WHEN ms.status = 'TAKEN' THEN 100 ELSE 0 END), 1) 
                     FROM medication_schedules ms 
                     WHERE ms.patient_id = p.id 
                       AND ms.scheduled_date_time > DATE_SUB(NOW(), INTERVAL 30 DAY)), 
                    0
                ) as adherence_rate
            FROM users u
            JOIN patients p ON u.id = p.id
            WHERE u.role = 'patient'
            ORDER BY u.created_at DESC
        `);

        // Get caregivers for each patient
        for (let patient of patients) {
            const [caregivers] = await db.execute(`
                SELECT c.id, c.name, c.email, c.relationship, c.status, c.created_at
                FROM caregivers c
                WHERE c.patient_id = ? AND c.status = 'ACTIVE'
            `, [patient.id]);
            patient.caregivers = caregivers;
        }

        res.json({
            success: true,
            count: patients.length,
            patients
        });
    } catch (error) {
        console.error('Error fetching patients:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch patients',
            error: error.message
        });
    }
});

// Get all caregivers with their patients (admin only)
router.get('/caregivers', protect, authorize('admin'), async (req, res) => {
    try {
        const [caregivers] = await db.execute(`
            SELECT 
                cu.id, 
                cu.name, 
                cu.email, 
                cu.created_at,
                COALESCE(
                    (SELECT COUNT(*) FROM caregivers WHERE email = cu.email AND status = 'ACTIVE'), 
                    0
                ) as patients_count
            FROM caregiver_users cu
            ORDER BY cu.created_at DESC
        `);

        // Get patients for each caregiver
        for (let caregiver of caregivers) {
            const [patients] = await db.execute(`
                SELECT p.id, u.name, u.email
                FROM caregivers c
                JOIN patients p ON c.patient_id = p.id
                JOIN users u ON p.id = u.id
                WHERE c.email = ? AND c.status = 'ACTIVE'
            `, [caregiver.email]);
            caregiver.patients = patients;
        }

        res.json({
            success: true,
            count: caregivers.length,
            caregivers
        });
    } catch (error) {
        console.error('Error fetching caregivers:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch caregivers',
            error: error.message
        });
    }
});

// Get statistics (admin only)
router.get('/statistics', protect, authorize('admin'), async (req, res) => {
    try {
        // Get total patients
        const [patientCount] = await db.execute('SELECT COUNT(*) as total FROM patients');
        
        // Get total admins
        const [adminCount] = await db.execute('SELECT COUNT(*) as total FROM admins');
        
        // Get total caregivers
        const [caregiverCount] = await db.execute('SELECT COUNT(*) as total FROM caregiver_users');

        // Get active patients
        const [activePatients] = await db.execute('SELECT COUNT(*) as total FROM patients WHERE is_active = 1');

        // Get total treatments
        const [treatmentCount] = await db.execute('SELECT COUNT(*) as total FROM treatments WHERE is_active = 1');

        res.json({
            success: true,
            statistics: {
                totalPatients: patientCount[0].total,
                totalAdmins: adminCount[0].total,
                totalCaregivers: caregiverCount[0].total,
                activePatients: activePatients[0].total,
                activeTreatments: treatmentCount[0].total
            }
        });
    } catch (error) {
        console.error('Error fetching statistics:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch statistics',
            error: error.message
        });
    }
});

// Get single patient details (admin only)
router.get('/patients/:id', protect, authorize('admin'), async (req, res) => {
    const { id } = req.params;
    
    try {
        const [patients] = await db.execute(`
            SELECT 
                u.id, 
                u.name, 
                u.email, 
                u.phone, 
                u.created_at,
                p.chifa_card_registration_number, 
                p.date_of_birth, 
                p.age,
                p.smartphone_skill_level, 
                p.is_active,
                COALESCE(
                    (SELECT ROUND(AVG(CASE WHEN ms.status = 'TAKEN' THEN 100 ELSE 0 END), 1) 
                     FROM medication_schedules ms 
                     WHERE ms.patient_id = p.id 
                       AND ms.scheduled_date_time > DATE_SUB(NOW(), INTERVAL 30 DAY)), 
                    0
                ) as adherence_rate,
                (SELECT COUNT(*) FROM treatments WHERE patient_id = p.id AND is_active = 1) as active_treatments
            FROM users u
            JOIN patients p ON u.id = p.id
            WHERE u.id = ? AND u.role = 'patient'
        `, [id]);
        
        if (patients.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Patient not found'
            });
        }
        
        const patient = patients[0];
        
        // Get patient's treatments
        const [treatments] = await db.execute(`
            SELECT t.id, t.medication_name, t.dosage, t.frequency, t.start_date, t.end_date, t.priority, t.is_active
            FROM treatments t
            WHERE t.patient_id = ?
            ORDER BY t.created_at DESC
        `, [id]);
        patient.treatments = treatments;
        
        // Get patient's caregivers
        const [caregivers] = await db.execute(`
            SELECT c.id, c.name, c.email, c.relationship, c.status, c.created_at
            FROM caregivers c
            WHERE c.patient_id = ? AND c.status = 'ACTIVE'
        `, [id]);
        patient.caregivers = caregivers;
        
        res.json({
            success: true,
            patient
        });
    } catch (error) {
        console.error('Error fetching patient details:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch patient details',
            error: error.message
        });
    }
});

// Delete a patient (admin only)
router.delete('/patients/:id', protect, authorize('admin'), async (req, res) => {
    const { id } = req.params;
    
    try {
        // Check if patient exists
        const [patient] = await db.execute(
            'SELECT id, name FROM users WHERE id = ? AND role = "patient"',
            [id]
        );
        
        if (patient.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Patient not found'
            });
        }
        
        // Delete user (cascades to patient, treatments, schedules, etc.)
        await db.execute('DELETE FROM users WHERE id = ? AND role = "patient"', [id]);
        
        res.json({
            success: true,
            message: `Patient "${patient[0].name}" deleted successfully`
        });
    } catch (error) {
        console.error('Error deleting patient:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to delete patient',
            error: error.message
        });
    }
});

// Delete a caregiver (admin only)
router.delete('/caregivers/:id', protect, authorize('admin'), async (req, res) => {
    const { id } = req.params;
    
    try {
        // Get caregiver info
        const [caregiver] = await db.execute(
            'SELECT id, name, email FROM caregiver_users WHERE id = ?',
            [id]
        );
        
        if (caregiver.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Caregiver not found'
            });
        }
        
        // Delete caregiver user
        await db.execute('DELETE FROM caregiver_users WHERE id = ?', [id]);
        
        // Update caregivers table to revoke access
        await db.execute(
            'UPDATE caregivers SET status = "REVOKED" WHERE email = ?',
            [caregiver[0].email]
        );
        
        res.json({
            success: true,
            message: `Caregiver "${caregiver[0].name}" deleted successfully`
        });
    } catch (error) {
        console.error('Error deleting caregiver:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to delete caregiver',
            error: error.message
        });
    }
});

// Deactivate/Activate a patient (admin only)
router.put('/patients/:id/toggle-status', protect, authorize('admin'), async (req, res) => {
    const { id } = req.params;
    const { is_active } = req.body;
    
    try {
        await db.execute(
            'UPDATE patients SET is_active = ? WHERE id = ?',
            [is_active ? 1 : 0, id]
        );
        
        res.json({
            success: true,
            message: `Patient ${is_active ? 'activated' : 'deactivated'} successfully`
        });
    } catch (error) {
        console.error('Error toggling patient status:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to update patient status',
            error: error.message
        });
    }
});

// Get system health (admin only)
router.get('/health', protect, authorize('admin'), async (req, res) => {
    try {
        // Test database connection
        await db.execute('SELECT 1');
        
        res.json({
            success: true,
            status: 'healthy',
            timestamp: new Date().toISOString(),
            uptime: process.uptime()
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            status: 'unhealthy',
            error: error.message
        });
    }
});

module.exports = router;