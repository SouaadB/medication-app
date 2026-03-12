const Treatment = require('../models/Treatment');
const OCRService = require('../services/ocrService');
const SchedulerService = require('../services/schedulerService');

// OCR Extraction
exports.processPrescriptionOCR = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ success: false, message: 'No image provided' });
        }

        console.log('Processing prescription image:', req.file.path);
        const rawText = await OCRService.extractText(req.file.path);
        const medications = OCRService.parseMedicationText(rawText);

        res.json({
            success: true,
            count: medications.length,
            medications: medications,
            rawText: rawText // Optional: send raw text for debugging
        });
    } catch (error) {
        console.error('OCR Error:', error);
        res.status(500).json({ success: false, message: 'Error processing prescription: ' + error.message });
    }
};

// Create Treatment + Generate Schedule
exports.createTreatment = async (req, res) => {
    try {
        const patientId = req.user.id;
        let { condition_id, medication_name, dosage, frequency, start_date, end_date } = req.body;

        // Log received data for debugging
        console.log('Received treatment data:', req.body);

        // Validate required fields
        if (!medication_name || !start_date || !frequency) {
            return res.status(400).json({
                success: false,
                message: 'Medication name, start date, and frequency are required'
            });
        }

        // Handle condition_id - if it's undefined or null, set to null for database
        if (condition_id === undefined || condition_id === null) {
            condition_id = null;
        }

        // Ensure all values are defined (not undefined)
        const treatmentData = {
            patient_id: patientId,
            condition_id: condition_id,
            medication_name: medication_name || '',
            dosage: dosage || null,
            frequency: frequency || 'Once daily',
            start_date: start_date,
            end_date: end_date || null
        };

        console.log('Saving treatment:', treatmentData);

        const treatmentId = await Treatment.create(treatmentData);

        // Automatically generate schedule
        if (frequency !== 'As needed') {
            await SchedulerService.generateSchedule(patientId, treatmentId, frequency, start_date, end_date);
        }

        res.status(201).json({
            success: true,
            message: 'Treatment added and schedule generated',
            treatmentId
        });
    } catch (error) {
        console.error('Create Treatment Error:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Error creating treatment',
            error: error.message 
        });
    }
};

// Get all treatments for patient
exports.getPatientTreatments = async (req, res) => {
    try {
        const patientId = req.user.id;
        const treatments = await Treatment.findByPatientId(patientId);
        res.json({ success: true, treatments });
    } catch (error) {
        console.error('Get Treatments Error:', error);
        res.status(500).json({ success: false, message: 'Error fetching treatments' });
    }
};

// Get treatments by condition
exports.getTreatmentsByCondition = async (req, res) => {
    try {
        const patientId = req.user.id;
        const { conditionId } = req.params;
        const treatments = await Treatment.findByConditionId(patientId, conditionId);
        res.json({ success: true, treatments });
    } catch (error) {
        console.error('Get Treatments By Condition Error:', error);
        res.status(500).json({ success: false, message: 'Error fetching treatments' });
    }
};

// Get Next Dose for Dashboard
exports.getNextDose = async (req, res) => {
    try {
        const patientId = req.user.id;
        const nextDose = await Treatment.getNextDose(patientId);
        res.json({ success: true, nextDose });
    } catch (error) {
        console.error('Get Next Dose Error:', error);
        res.status(500).json({ success: false, message: 'Error fetching next dose' });
    }
};

// Delete Treatment
exports.deleteTreatment = async (req, res) => {
    try {
        const { id } = req.params;
        await Treatment.delete(id);
        await SchedulerService.clearFutureSchedules(id);
        res.json({ success: true, message: 'Treatment deleted and future schedules cleared' });
    } catch (error) {
        console.error('Delete Treatment Error:', error);
        res.status(500).json({ success: false, message: 'Error deleting treatment' });
    }
};

// Get schedule for a specific date (YYYY-MM-DD)
exports.getScheduleForDate = async (req, res) => {
    try {
        const patientId = req.user.id;
        const { date } = req.query;
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const requested = date ? new Date(date) : today;
        requested.setHours(0, 0, 0, 0);

        if (requested < today) {
            return res.status(400).json({ success: false, message: 'Cannot view past days' });
        }

        const y = requested.getFullYear().toString().padStart(4, '0');
        const m = (requested.getMonth() + 1).toString().padStart(2, '0');
        const d = requested.getDate().toString().padStart(2, '0');
        const ymd = `${y}-${m}-${d}`;

        const rows = await SchedulerService.getScheduleByDate(patientId, ymd);

        let label = ymd;
        const diffDays = Math.floor((requested.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
        if (diffDays === 0) label = 'Today';
        else if (diffDays === 1) label = 'Tomorrow';

        const total = rows.length;
        const completed = rows.filter(r => r.status === 'TAKEN').length;
        const missed = rows.filter(r => r.status === 'MISSED').length;
        const pending = rows.filter(r => r.status === 'SCHEDULED').length;

        res.json({
            success: true,
            date: ymd,
            label,
            stats: { total, completed, pending, missed },
            medications: rows
        });
    } catch (error) {
        console.error('Get Schedule For Date Error:', error);
        res.status(500).json({ success: false, message: 'Error fetching schedule' });
    }
};
