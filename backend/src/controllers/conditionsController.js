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
        
        // Check if there are active treatments for this condition
        const [treatments] = await db.execute(
            'SELECT id FROM treatments WHERE patient_id = ? AND condition_id = ? AND is_active = 1 AND deleted_at IS NULL',
            [patientId, conditionId]
        );
        
        if (treatments.length > 0) {
            return res.status(400).json({ 
                success: false, 
                message: 'Cannot remove condition with active treatments' 
            });
        }
        
        await db.execute(
            'DELETE FROM patient_conditions WHERE patient_id = ? AND condition_id = ?',
            [patientId, conditionId]
        );
        
        res.json({ 
            success: true, 
            message: 'Condition removed successfully' 
        });
        
    } catch (error) {
        console.error('Error removing condition:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};