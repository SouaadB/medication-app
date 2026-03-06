const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { 
    createTreatment, 
    getPatientTreatments, 
    getTreatmentsByCondition,
    getNextDose,
    deleteTreatment,
    processPrescriptionOCR
} = require('../controllers/treatmentController');

// Multer for OCR image upload
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });

router.use(protect);

// Dashboard / General
router.get('/next-dose', getNextDose);
router.get('/my-treatments', getPatientTreatments);

// Condition Specific
router.get('/condition/:conditionId', getTreatmentsByCondition);

// CRUD
router.post('/', createTreatment);
router.delete('/:id', deleteTreatment);

// OCR
router.post('/ocr', upload.single('prescription'), processPrescriptionOCR);

module.exports = router;
