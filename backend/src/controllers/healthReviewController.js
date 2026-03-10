const Patient = require('../models/Patient');
const EmergencyContact = require('../models/EmergencyContact');
const PatientAchievement = require('../models/PatientAchievement');

// Get health review dashboard data
exports.getDashboard = async (req, res) => {
    try {
        const patientId = req.user.id;
        
        // Get all dashboard data in parallel
        const [
            overallAdherence,
            conditions,
            currentStreak,
            achievements,
            emergencyContact
        ] = await Promise.all([
            Patient.getOverallAdherence(patientId),
            Patient.getConditionsWithAdherence(patientId),
            Patient.getCurrentStreak(patientId),
            PatientAchievement.findByPatientId(patientId),
            EmergencyContact.findByPatientId(patientId)
        ]);
        
        res.json({
            success: true,
            data: {
                overallAdherence,
                activeConditions: conditions.length,
                conditions, // for detailed view if needed
                currentStreak,
                achievements: achievements.slice(0, 5), // last 5 achievements
                emergencyContact: emergencyContact || null
            }
        });
        
    } catch (error) {
        console.error('Error in getDashboard:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Error fetching health review data' 
        });
    }
};

// Emergency contact routes
exports.saveEmergencyContact = async (req, res) => {
    try {
        const patientId = req.user.id;
        const { name, relationship, phone_number, is_active } = req.body;
        
        // Validate required fields
        if (!name || !relationship || !phone_number) {
            return res.status(400).json({
                success: false,
                message: 'Name, relationship, and phone number are required'
            });
        }
        
        // Check if contact already exists
        const existing = await EmergencyContact.findByPatientId(patientId);
        
        if (existing) {
            await EmergencyContact.update(patientId, { name, relationship, phone_number, is_active });
        } else {
            await EmergencyContact.create(patientId, { name, relationship, phone_number, is_active });
        }
        
        res.json({ 
            success: true, 
            message: 'Emergency contact saved successfully' 
        });
        
    } catch (error) {
        console.error('Error saving emergency contact:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

exports.toggleEmergencyContact = async (req, res) => {
    try {
        const patientId = req.user.id;
        const { is_active } = req.body;
        
        await EmergencyContact.toggle(patientId, is_active);
        
        res.json({ 
            success: true, 
            message: `Emergency contact ${is_active ? 'activated' : 'deactivated'}` 
        });
        
    } catch (error) {
        console.error('Error toggling emergency contact:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

exports.deleteEmergencyContact = async (req, res) => {
    try {
        const patientId = req.user.id;
        
        await EmergencyContact.delete(patientId);
        
        res.json({ 
            success: true, 
            message: 'Emergency contact deleted successfully' 
        });
        
    } catch (error) {
        console.error('Error deleting emergency contact:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};