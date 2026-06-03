const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { 
    createTreatment,
    updateTreatment,
    getPatientTreatments, 
    getTreatmentsByCondition,
    getNextDose,
    getNextMedication,
    deleteTreatment,
    processPrescriptionOCR,
    getScheduleByDate
} = require('../controllers/treatmentController');

const multer = require('multer');
const upload = multer({ dest: 'uploads/' });

router.use(protect);

// ── Dashboard / General ───────────────────────────────────────────────────────
router.get('/next-dose',       getNextDose);
router.get('/next-medication', getNextMedication);
router.get('/my-treatments',   getPatientTreatments);
router.get('/schedule',        getScheduleByDate);

// ── Condition Specific ────────────────────────────────────────────────────────
router.get('/condition/:conditionId', getTreatmentsByCondition);

// ── CRUD ──────────────────────────────────────────────────────────────────────
router.post('/',   createTreatment);
router.put('/:id', updateTreatment);

// ── GET single treatment by ID (used by notifications page for barcode check) ─
router.get('/:id', async (req, res) => {
    try {
        const patientId   = req.user.id;
        const treatmentId = req.params.id;
        const db = require('../config/database');

        const [rows] = await db.execute(
            'SELECT * FROM treatments WHERE id = ? AND patient_id = ?',
            [treatmentId, patientId]
        );

        if (rows.length === 0) {
            return res.status(404).json({ success: false, message: 'Treatment not found' });
        }

        res.json({ success: true, treatment: rows[0] });

    } catch (error) {
        console.error('Get treatment by ID error:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

router.delete('/:id', deleteTreatment);

// ── OCR ───────────────────────────────────────────────────────────────────────
router.post('/ocr', upload.single('prescription'), processPrescriptionOCR);

// ── Add medication for a specific condition ───────────────────────────────────
router.post('/condition/:conditionId/add', protect, async (req, res) => {
    try {
        const patientId   = req.user.id;
        const conditionId = req.params.conditionId;
        const { medication_name, dosage, frequency, priority, start_date, end_date, barcode_data } = req.body;
        
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
            (patient_id, condition_id, medication_name, dosage, frequency, priority, start_date, end_date, is_active, barcode_data)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, 1, ?)`,
            [
                patientId,
                conditionId,
                medication_name,
                dosage,
                frequency,
                priority || 'MEDIUM',
                start_date,
                end_date || null,
                barcode_data ? JSON.stringify(barcode_data) : null
            ]
        );
        
        const treatmentId = result.insertId;
        
        const SchedulerService = require('../services/schedulerService');
        if (frequency !== 'As needed') {
            await SchedulerService.generateSchedule(patientId, treatmentId, frequency, start_date, end_date);
        }
        
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