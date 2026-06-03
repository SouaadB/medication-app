const Patient = require('../models/Patient');
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
            achievements
        ] = await Promise.all([
            Patient.getOverallAdherence(patientId),
            Patient.getConditionsWithAdherence(patientId),
            Patient.getCurrentStreak(patientId),
            PatientAchievement.findByPatientId(patientId)
        ]);
        
        res.json({
            success: true,
            data: {
                overallAdherence,
                activeConditions: conditions.length,
                conditions, // for detailed view if needed
                currentStreak,
                achievements: achievements.slice(0, 5) // last 5 achievements
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
