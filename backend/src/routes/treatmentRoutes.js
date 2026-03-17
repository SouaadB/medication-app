const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { 
    createTreatment, 
    getPatientTreatments, 
    getTreatmentsByCondition,
    getNextDose,
    getNextMedication, // NOUVEAU
    deleteTreatment,
    processPrescriptionOCR,
    getScheduleByDate
} = require('../controllers/treatmentController');

const multer = require('multer');
const upload = multer({ dest: 'uploads/' });

router.use(protect);

// Dashboard / General
router.get('/next-dose', getNextDose);
router.get('/next-medication', getNextMedication); // NOUVEAU
router.get('/my-treatments', getPatientTreatments);
router.get('/schedule', getScheduleByDate);

// Condition Specific
router.get('/condition/:conditionId', getTreatmentsByCondition);

// CRUD
router.post('/', createTreatment);
router.delete('/:id', deleteTreatment);

// OCR
router.post('/ocr', upload.single('prescription'), processPrescriptionOCR);

// Add medication for a specific condition
router.post('/condition/:conditionId/add', protect, async (req, res) => {
    try {
        const patientId = req.user.id;
        const conditionId = req.params.conditionId;
        const { medication_name, dosage, frequency, start_date, end_date } = req.body;
        
        const db = require('../config/database');
        
        const [conditionCheck] = await db.execute(
            'SELECT * FROM patient_conditions WHERE patient_id = ? AND condition_id = ?',
            [patientId, conditionId]
        );
        
        if (conditionCheck.length === 0) {
            return res.status(400).json({ 
                success: false, 
                message: 'Patient does not have this condition' 
            });
        }
        
        const [result] = await db.execute(
            `INSERT INTO treatments 
            (patient_id, condition_id, medication_name, dosage, frequency, start_date, end_date, is_active)
            VALUES (?, ?, ?, ?, ?, ?, ?, 1)`,
            [patientId, conditionId, medication_name, dosage, frequency, start_date, end_date]
        );
        
        const treatmentId = result.insertId;
        
        const SchedulerService = require('../services/schedulerService');
        await SchedulerService.generateSchedule(patientId, treatmentId, frequency, start_date, end_date);
        
        res.json({ 
            success: true, 
            message: 'Medication added successfully',
            treatmentId 
        });
        
    } catch (error) {
        console.error('Error adding medication:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

module.exports = router;