const express    = require('express');
const router     = express.Router();
const { protect } = require('../middleware/authMiddleware');
const {
    getProfile,
    updateProfile,
    changePassword,
    setupPatientProfile,
    getAllChronicConditions,
    updateSettings,
    updateDailySchedule,
    deleteAccount,
    // ── NEW ──
    getSchedule,
    updateSchedule,
    getQuietHours,
    updateQuietHours,
} = require('../controllers/profileController');

router.use(protect);

// ── Core profile ──────────────────────────────────────────────────────────────
router.get('/me',         getProfile);
router.get('/conditions', getAllChronicConditions);
router.post('/setup',     setupPatientProfile);
router.put('/update',     updateProfile);
router.put('/password',   changePassword);
router.delete('/account', deleteAccount);

// ── Settings ──────────────────────────────────────────────────────────────────
router.put('/settings', updateSettings);

// ── Daily schedule (legacy route — keep for backward compat) ──────────────────
router.put('/daily-schedule', updateDailySchedule);

// ── Daily schedule (new dedicated routes used by DailySchedulePage) ───────────
router.get('/schedule',   getSchedule);
router.patch('/schedule', updateSchedule);

// ── Quiet hours (new dedicated routes used by QuietHoursPage) ────────────────
router.get('/quiet-hours',   getQuietHours);
router.patch('/quiet-hours', updateQuietHours);

module.exports = router;