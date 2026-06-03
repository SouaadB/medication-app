// backend/src/controllers/assessmentController.js

const db = require('../config/database');
const assessmentService = require('../services/assessmentService');

/**
 * Generate and save assessment for a patient
 * POST /api/assessments/generate/:patientId
 */
exports.generateAssessment = async (req, res) => {
    try {
        const { patientId } = req.params;
        const caregiverEmail = req.user.email;

        const [patient] = await db.execute('SELECT name FROM users WHERE id = ?', [patientId]);
        
        const situation = await assessmentService.getPatientSituation(patientId);
        const risk = assessmentService.classifyRisk(situation);
        const actions = assessmentService.recommendActions(risk, situation);
        const assessmentText = assessmentService.generateAssessmentText(risk, situation, patient[0]?.name || 'Patient');

        const [result] = await db.execute(
            `INSERT INTO caregiver_assessments 
             (patient_id, caregiver_email, risk_level, situation_data, assessment_text, recommended_actions) 
             VALUES (?, ?, ?, ?, ?, ?)`,
            [
                patientId,
                caregiverEmail,
                risk.riskLevel,
                JSON.stringify({
                    adherence: situation.this_week_adherence,
                    trend: situation.weekly_trend,
                    missed_critical: situation.missed_critical_meds?.length || 0,
                    factors: risk.contributingFactors
                }),
                assessmentText,
                JSON.stringify(actions)
            ]
        );

        res.json({
            success: true,
            assessment: {
                id: result.insertId,
                risk_level: risk.riskLevel,
                assessment_text: assessmentText,
                recommended_actions: actions,
                situation_data: situation,
                contributing_factors: risk.contributingFactors,
                created_at: new Date()
            }
        });

    } catch (error) {
        console.error('Generate assessment error:', error);
        res.status(500).json({ success: false, message: 'Error generating assessment' });
    }
};

/**
 * Get latest assessment for a patient (auto-generates if needed)
 * GET /api/assessments/:patientId
 */
exports.getLatestAssessment = async (req, res) => {
    try {
        const { patientId } = req.params;
        const caregiverEmail = req.user.email;

        const result = await assessmentService.getOrGenerateAssessment(patientId, caregiverEmail);
        
        res.json({
            success: true,
            assessment: result
        });

    } catch (error) {
        console.error('Get latest assessment error:', error);
        res.status(500).json({ success: false, message: 'Error fetching assessment' });
    }
};

/**
 * Get assessment history for a patient
 * GET /api/assessments/:patientId/history
 */
exports.getAssessmentHistory = async (req, res) => {
    try {
        const { patientId } = req.params;

        const [assessments] = await db.execute(
            `SELECT id, risk_level, assessment_text, created_at,
                    JSON_EXTRACT(situation_data, '$.adherence') as adherence,
                    JSON_EXTRACT(situation_data, '$.trend') as trend
             FROM caregiver_assessments 
             WHERE patient_id = ? 
             ORDER BY created_at DESC 
             LIMIT 10`,
            [patientId]
        );

        res.json({
            success: true,
            history: assessments.map(a => ({
                id: a.id,
                risk_level: a.risk_level,
                adherence: parseFloat(a.adherence) || 0,
                trend: a.trend,
                created_at: a.created_at,
                summary: a.assessment_text?.substring(0, 150) + '...'
            }))
        });

    } catch (error) {
        console.error('Get assessment history error:', error);
        res.status(500).json({ success: false, message: 'Error fetching history' });
    }
};