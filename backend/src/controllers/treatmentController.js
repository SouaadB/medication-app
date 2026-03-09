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
        const { condition_id, medication_name, dosage, frequency, start_date, end_date } = req.body;

        if (!medication_name || !start_date || !frequency) {
            return res.status(400).json({
                success: false,
                message: 'Medication name, start date, and frequency are required'
            });
        }

        const treatmentId = await Treatment.create({
            patient_id: patientId,
            condition_id,
            medication_name,
            dosage,
            frequency,
            start_date,
            end_date
        });

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
        res.status(500).json({ success: false, message: 'Error creating treatment' });
    }
};

// Get all treatments for patient
exports.getPatientTreatments = async (req, res) => {
    try {
        const patientId = req.user.id;
        const treatments = await Treatment.findByPatientId(patientId);
        res.json({ success: true, treatments });
    } catch (error) {
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
        res.status(500).json({ success: false, message: 'Error deleting treatment' });
    }
};