const Patient = require('../models/Patient');
const db = require('../config/database');

// Get all conditions for patient with adherence rate
exports.getPatientConditions = async (req, res) => {
    try {
        const patientId = req.user.id;
        
        const conditions = await Patient.getConditionsWithAdherence(patientId);
        
        res.json({
            success: true,
            data: conditions
        });
        
    } catch (error) {
        console.error('Error in getPatientConditions:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Error fetching conditions' 
        });
    }
};

// Get all available chronic conditions (for adding)
exports.getAvailableConditions = async (req, res) => {
    try {
        const patientId = req.user.id;
        
        // REMOVED description column from SELECT
        const [conditions] = await db.execute(`
            SELECT cc.id, cc.name
            FROM chronic_conditions cc
            WHERE cc.id NOT IN (
                SELECT condition_id 
                FROM patient_conditions 
                WHERE patient_id = ?
            )
        `, [patientId]);
        
        res.json({
            success: true,
            data: conditions
        });
        
    } catch (error) {
        console.error('Error in getAvailableConditions:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Error fetching available conditions' 
        });
    }
};

// Add condition to patient
exports.addCondition = async (req, res) => {
    try {
        const patientId = req.user.id;
        const { condition_id } = req.body;
        
        // Check if condition exists
        const [condition] = await db.execute(
            'SELECT id FROM chronic_conditions WHERE id = ?',
            [condition_id]
        );
        
        if (condition.length === 0) {
            return res.status(404).json({ 
                success: false, 
                message: 'Condition not found' 
            });
        }
        
        // Check if already added
        const [existing] = await db.execute(
            'SELECT * FROM patient_conditions WHERE patient_id = ? AND condition_id = ?',
            [patientId, condition_id]
        );
        
        if (existing.length > 0) {
            return res.status(400).json({ 
                success: false, 
                message: 'Condition already added' 
            });
        }
        
        await db.execute(
            'INSERT INTO patient_conditions (patient_id, condition_id) VALUES (?, ?)',
            [patientId, condition_id]
        );
        
        res.json({ 
            success: true, 
            message: 'Condition added successfully' 
        });
        
    } catch (error) {
        console.error('Error adding condition:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

// Remove condition from patient
exports.removeCondition = async (req, res) => {
    try {
        const patientId = req.user.id;
        const conditionId = req.params.conditionId;

        // 1. Soft-delete all active treatments for this condition
        //    (mirrors exactly what deleteTreatment does individually)
        const [activeTreatments] = await db.execute(
            `SELECT id FROM treatments 
             WHERE patient_id = ? AND condition_id = ? AND deleted_at IS NULL`,
            [patientId, conditionId]
        );

        for (const treatment of activeTreatments) {
            const treatmentId = treatment.id;

            // Delete only future SCHEDULED doses — keep TAKEN/MISSED/SKIPPED history
            await db.execute(
                `DELETE FROM medication_schedules
                 WHERE treatment_id = ?
                 AND status = 'SCHEDULED'
                 AND scheduled_date_time > NOW()`,
                [treatmentId]
            );

            // Clear notifications for this treatment
            const NotificationService = require('../services/notificationService');
            await NotificationService.clearNotificationsByTreatment(treatmentId);

            // Soft-delete the treatment row
            await db.execute(
                `UPDATE treatments
                 SET is_active = 0, deleted_at = NOW()
                 WHERE id = ? AND patient_id = ?`,
                [treatmentId, patientId]
            );
        }

        // 2. Now remove the condition link
        await db.execute(
            'DELETE FROM patient_conditions WHERE patient_id = ? AND condition_id = ?',
            [patientId, conditionId]
        );

        res.json({ 
            success: true, 
            message: 'Condition and associated medications removed successfully' 
        });

    } catch (error) {
        console.error('Error removing condition:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};