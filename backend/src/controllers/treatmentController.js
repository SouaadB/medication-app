const Treatment = require('../models/Treatment');
const OCRService = require('../services/ocrService');
const SchedulerService = require('../services/schedulerService');
const ScheduleService = require('../services/scheduleService');
const NotificationService = require('../services/notificationService');
const db = require('../config/database');

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
            rawText: rawText
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
        let { condition_id, medication_name, dosage, frequency, priority, start_date, end_date } = req.body;

        console.log('Received treatment data:', req.body);

        if (!medication_name || !start_date || !frequency) {
            return res.status(400).json({
                success: false,
                message: 'Medication name, start date, and frequency are required'
            });
        }

        if (condition_id === undefined || condition_id === null) {
            condition_id = null;
        }

        const treatmentData = {
            patient_id: patientId,
            condition_id: condition_id,
            medication_name: medication_name || '',
            dosage: dosage || null,
            frequency: frequency || 'Once daily',
            priority: priority || 'MEDIUM',
            start_date: start_date,
            end_date: end_date || null
        };

        console.log('Saving treatment:', treatmentData);

        const treatmentId = await Treatment.create(treatmentData);

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

// NOUVEAU - Get Next Medication for Dashboard (format compatible avec le frontend)
exports.getNextMedication = async (req, res) => {
    try {
        const patientId = req.user.id;
        
        const query = `
            SELECT 
                ms.id,
                ms.scheduled_date_time,
                DATE_FORMAT(ms.scheduled_date_time, '%H:%i') as time,
                t.medication_name as name,
                t.dosage,
                c.name as condition_name
            FROM medication_schedules ms
            JOIN treatments t ON ms.treatment_id = t.id
            LEFT JOIN chronic_conditions c ON t.condition_id = c.id
            WHERE ms.patient_id = ? 
            AND ms.scheduled_date_time > NOW()
            AND ms.status = 'SCHEDULED'
            ORDER BY ms.scheduled_date_time ASC
            LIMIT 1
        `;
        
        const [rows] = await db.execute(query, [patientId]);
        
        if (rows.length > 0) {
            res.json({ 
                success: true, 
                medication: rows[0] 
            });
        } else {
            res.json({ 
                success: true, 
                medication: null 
            });
        }
    } catch (error) {
        console.error('Error in getNextMedication:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Error fetching next medication' 
        });
    }
};

// Delete Treatment
exports.deleteTreatment = async (req, res) => {
    try {
        const { id } = req.params;
        await Treatment.delete(id);
        await SchedulerService.clearFutureSchedules(id);
        await NotificationService.clearNotificationsByTreatment(id);
        res.json({ success: true, message: 'Treatment deleted and related data cleared' });
    } catch (error) {
        console.error('Delete Treatment Error:', error);
        res.status(500).json({ success: false, message: 'Error deleting treatment' });
    }
};

// Récupérer le planning pour une date spécifique
exports.getScheduleByDate = async (req, res) => {
    try {
        const patientId = req.user.id;
        const { date } = req.query;
        
        if (!date) {
            return res.status(400).json({ 
                success: false, 
                message: 'Date parameter is required' 
            });
        }

        console.log(`📅 Fetching schedule for patient ${patientId} on date ${date}`);
        
        const schedule = await ScheduleService.getScheduleByDate(patientId, date);
        
        res.json({
            success: true,
            medications: schedule.medications,
            stats: {
                total: schedule.total,
                completed: schedule.completed,
                pending: schedule.pending,
                missed: schedule.missed
            }
        });
    } catch (error) {
        console.error('Error in getScheduleByDate:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Erreur lors du chargement du planning' 
        });
    }
};

// Récupérer le planning du jour
exports.getTodaySchedule = async (req, res) => {
    try {
        const patientId = req.user.id;
        const today = new Date().toISOString().split('T')[0];
        
        console.log(`📅 Fetching today's schedule for patient ${patientId}`);
        
        const schedule = await ScheduleService.getScheduleByDate(patientId, today);
        
        res.json({
            success: true,
            medications: schedule.medications,
            stats: {
                total: schedule.total,
                completed: schedule.completed,
                pending: schedule.pending,
                missed: schedule.missed
            },
            date: today,
            dayName: new Date().toLocaleDateString('fr-FR', { weekday: 'long' }),
            formattedDate: new Date().toLocaleDateString('fr-FR', { 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
            })
        });
    } catch (error) {
        console.error('Error in getTodaySchedule:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Erreur lors du chargement du planning' 
        });
    }
};