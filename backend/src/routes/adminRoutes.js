const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/authMiddleware');
const db = require('../config/database');

// Get all patients (admin only)
router.get('/patients', protect, authorize('admin'), async (req, res) => {
    try {
        const [patients] = await db.execute(`
            SELECT u.id, u.name, u.email, u.phone, u.created_at,
                   p.chifa_card_registration_number, p.date_of_birth, 
                   p.smartphone_skill_level, p.is_active
            FROM users u
            JOIN patients p ON u.id = p.id
            WHERE u.role = 'patient'
            ORDER BY u.created_at DESC
        `);
        
        res.json({
            success: true,
            count: patients.length,
            patients
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to fetch patients',
            error: error.message
        });
    }
});

// Get statistics (admin only)
router.get('/statistics', protect, authorize('admin'), async (req, res) => {
    try {
        // Get total patients
        const [patientCount] = await db.execute(
            'SELECT COUNT(*) as total FROM patients'
        );

        // Get total admins
        const [adminCount] = await db.execute(
            'SELECT COUNT(*) as total FROM admins'
        );

        // Get today's scheduled medications
        const [todaySchedule] = await db.execute(`
            SELECT COUNT(*) as total 
            FROM medication_schedules 
            WHERE DATE(scheduled_date_time) = CURDATE()
        `);

        res.json({
            success: true,
            statistics: {
                totalPatients: patientCount[0].total,
                totalAdmins: adminCount[0].total,
                todayScheduled: todaySchedule[0].total,
                // Add more statistics as needed
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to fetch statistics',
            error: error.message
        });
    }
});

module.exports = router;