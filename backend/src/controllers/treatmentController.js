const Treatment = require('../models/Treatment');
const OCRService = require('../services/ocrService');
const SchedulerService = require('../services/schedulerService');
const ScheduleService = require('../services/scheduleService');
const NotificationService = require('../services/notificationService');
const db = require('../config/database');
const fs = require('fs');

// OCR Extraction
exports.processPrescriptionOCR = async (req, res) => {
    if (!req.file) {
        return res.status(400).json({ 
            success: false, 
            message: 'No image file uploaded.' 
        });
    }

    try {
        console.log('[OCR] Processing prescription image:', req.file.path);
        
        const result = await OCRService.extractMedications(req.file.path);

        return res.json({
            success: true,
            count: result.total_medications,
            medications: result.medications,
            prescriber: result.prescriber,
            prescriber_specialty: result.prescriber_specialty,
            ocr_quality: result.ocr_quality_estimate,
            corrections: result.corrections_made ?? []
        });

    } catch (err) {
        console.error('[OCR] Error:', err.message);
        return res.status(500).json({ 
            success: false, 
            message: 'Error processing prescription: ' + err.message 
        });

    } finally {
        if (req.file?.path && fs.existsSync(req.file.path)) {
            fs.unlinkSync(req.file.path);
        }
    }
};

// Create Treatment + Generate Schedule
exports.createTreatment = async (req, res) => {
    try {
        const patientId = req.user.id;
        let { condition_id, medication_name, dosage, frequency, priority, start_date, end_date, barcode_data } = req.body;

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
            end_date: end_date || null,
            barcode_data: barcode_data ? JSON.stringify(barcode_data) : null
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

// ─── UPDATE TREATMENT ────────────────────────────────────────────────────────
// PUT /treatments/:id
// Updates editable fields: medication_name, dosage, frequency, priority,
// is_active, start_date, end_date, barcode_data
// If frequency changed → clears future schedules and regenerates them
exports.updateTreatment = async (req, res) => {
    try {
        const patientId   = req.user.id;
        const treatmentId = req.params.id;

        // Verify ownership — patient can only edit their own treatments
        const [rows] = await db.execute(
            'SELECT * FROM treatments WHERE id = ? AND patient_id = ?',
            [treatmentId, patientId]
        );

        if (rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Treatment not found or access denied'
            });
        }

        const existing = rows[0];

        // Extract only the fields we allow to be updated
        const {
            medication_name,
            dosage,
            frequency,
            priority,
            is_active,
            start_date,
            end_date,
            barcode_data
        } = req.body;

        // Build update — fall back to existing values if not provided
        const updatedName      = medication_name  ?? existing.medication_name;
        const updatedDosage    = dosage           !== undefined ? dosage    : existing.dosage;
        const updatedFrequency = frequency        ?? existing.frequency;
        const updatedPriority  = priority         ?? existing.priority;
        const updatedIsActive  = is_active        !== undefined ? (is_active ? 1 : 0) : existing.is_active;
        const updatedStart     = start_date       ?? existing.start_date;
        const updatedEnd       = end_date         !== undefined ? end_date  : existing.end_date;

        // barcode_data: keep existing if not sent, update if sent (even if null to remove it)
        let updatedBarcode = existing.barcode_data;
        if ('barcode_data' in req.body) {
            updatedBarcode = barcode_data ? JSON.stringify(barcode_data) : null;
        }

        await db.execute(
            `UPDATE treatments SET
                medication_name = ?,
                dosage          = ?,
                frequency       = ?,
                priority        = ?,
                is_active       = ?,
                start_date      = ?,
                end_date        = ?,
                barcode_data    = ?
             WHERE id = ? AND patient_id = ?`,
            [
                updatedName,
                updatedDosage,
                updatedFrequency,
                updatedPriority,
                updatedIsActive,
                updatedStart,
                updatedEnd    || null,
                updatedBarcode,
                treatmentId,
                patientId
            ]
        );

        // If frequency or dates changed, regenerate the schedule
        const frequencyChanged  = updatedFrequency !== existing.frequency;
        const startChanged      = updatedStart     !== existing.start_date;
        const endChanged        = updatedEnd       !== existing.end_date;

        if (frequencyChanged || startChanged || endChanged) {
            console.log(`[Treatment ${treatmentId}] Schedule changed — regenerating`);
            await SchedulerService.clearFutureSchedules(treatmentId);

            if (updatedFrequency !== 'As needed' && updatedIsActive) {
                await SchedulerService.generateSchedule(
                    patientId,
                    treatmentId,
                    updatedFrequency,
                    updatedStart,
                    updatedEnd
                );
            }
        }

        // If deactivated, clear future schedules
        if (updatedIsActive === 0 && existing.is_active !== 0) {
            console.log(`[Treatment ${treatmentId}] Deactivated — clearing future schedules`);
            await SchedulerService.clearFutureSchedules(treatmentId);
        }

        // If reactivated, regenerate schedules
        if (updatedIsActive === 1 && existing.is_active === 0) {
            console.log(`[Treatment ${treatmentId}] Reactivated — regenerating schedules`);
            if (updatedFrequency !== 'As needed') {
                await SchedulerService.generateSchedule(
                    patientId,
                    treatmentId,
                    updatedFrequency,
                    updatedStart,
                    updatedEnd
                );
            }
        }

        res.json({
            success: true,
            message: 'Treatment updated successfully'
        });

    } catch (error) {
        console.error('Update Treatment Error:', error);
        res.status(500).json({
            success: false,
            message: 'Error updating treatment',
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

// Get Next Medication for Dashboard
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
        
        res.json({ 
            success: true, 
            medication: rows.length > 0 ? rows[0] : null
        });
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

// Get schedule for a specific date
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

// Get today's schedule
exports.getTodaySchedule = async (req, res) => {
    try {
        const patientId = req.user.id;
        const today = new Date().toISOString().split('T')[0];
        
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