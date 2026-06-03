const ScheduleService     = require('../services/scheduleService');
const NotificationService = require('../services/notificationService');
const db                  = require('../config/database');

// ── GET today's schedule ──────────────────────────────────────────────────────
exports.getTodaySchedule = async (req, res) => {
    try {
        const patientId = req.user.id;
        const today     = new Date();
        const todayStr  = `${today.getFullYear()}-${String(today.getMonth()+1).padStart(2,'0')}-${String(today.getDate()).padStart(2,'0')}`;

        const schedule = await ScheduleService.getScheduleByDate(patientId, todayStr);

        res.json({
            success: true,
            data: {
                ...schedule,
                dayName:       today.toLocaleDateString('fr-FR', { weekday: 'long' }),
                formattedDate: today.toLocaleDateString('fr-FR', { year: 'numeric', month: 'long', day: 'numeric' }),
            }
        });
    } catch (error) {
        console.error('Error in getTodaySchedule:', error);
        res.status(500).json({ success: false, message: 'Erreur lors du chargement du planning' });
    }
};

// ── GET schedule for a specific date ─────────────────────────────────────────
exports.getScheduleByDate = async (req, res) => {
    try {
        const patientId  = req.user.id;
        const targetDate = new Date(req.params.date);
        const formatted  = `${targetDate.getFullYear()}-${String(targetDate.getMonth()+1).padStart(2,'0')}-${String(targetDate.getDate()).padStart(2,'0')}`;

        const schedule = await ScheduleService.getScheduleByDate(patientId, formatted);

        const today    = new Date();
        const todayStr = `${today.getFullYear()}-${String(today.getMonth()+1).padStart(2,'0')}-${String(today.getDate()).padStart(2,'0')}`;

        res.json({
            success: true,
            data: {
                ...schedule,
                isToday:       formatted === todayStr,
                isFuture:      targetDate > today,
                dayName:       targetDate.toLocaleDateString('fr-FR', { weekday: 'long' }),
                formattedDate: targetDate.toLocaleDateString('fr-FR', { year: 'numeric', month: 'long', day: 'numeric' }),
            }
        });
    } catch (error) {
        console.error('Error in getScheduleByDate:', error);
        res.status(500).json({ success: false, message: 'Erreur lors du chargement du planning' });
    }
};

// ── GET adherence stats ───────────────────────────────────────────────────────
exports.getStats = async (req, res) => {
    try {
        const patientId = req.user.id;
        const days      = req.query.days || 30;
        const stats     = await ScheduleService.getAdherenceStats(patientId, days);
        const streak    = await ScheduleService.getCurrentStreak(patientId);
        res.json({ success: true, data: { ...stats, currentStreak: streak, days } });
    } catch (error) {
        console.error('Error in getStats:', error);
        res.status(500).json({ success: false, message: 'Erreur lors du chargement des statistiques' });
    }
};

// ── PUT /schedule/take/:scheduleId ────────────────────────────────────────────
exports.markAsTaken = async (req, res) => {
    try {
        const { scheduleId } = req.params;
        const success = await ScheduleService.markAsTaken(scheduleId);
        if (success) {
            res.json({ success: true, message: '✅ Dose marquée comme prise' });
        } else {
            res.status(400).json({ success: false, message: 'Impossible de marquer cette dose' });
        }
    } catch (error) {
        console.error('Error in markAsTaken:', error);
        res.status(500).json({ success: false, message: 'Erreur lors de la confirmation' });
    }
};

// ─────────────────────────────────────────────────────────────────────────────
// PUT /schedule/skip/:scheduleId
// Patient consciously skips a dose (different from MISSED which is automatic)
// ─────────────────────────────────────────────────────────────────────────────
exports.skipDose = async (req, res) => {
    try {
        const patientId  = req.user.id;
        const scheduleId = req.params.scheduleId;

        const [result] = await db.execute(
            `UPDATE medication_schedules
             SET status = 'SKIPPED'
             WHERE id = ? AND patient_id = ? AND status IN ('SCHEDULED', 'MISSED')`,
            [scheduleId, patientId]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({
                success: false,
                message: 'Schedule not found, already taken, or not yours'
            });
        }

        res.json({ success: true, message: 'Dose skipped' });

    } catch (error) {
        console.error('Error in skipDose:', error);
        res.status(500).json({ success: false, message: 'Error skipping dose' });
    }
};