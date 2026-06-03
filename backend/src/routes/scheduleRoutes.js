const express    = require('express');
const router     = express.Router();
const { protect } = require('../middleware/authMiddleware');
const scheduleController = require('../controllers/scheduleController');

router.use(protect);

// ── Planning ──────────────────────────────────────────────────────────────────
router.get('/today',       scheduleController.getTodaySchedule);
router.get('/date/:date',  scheduleController.getScheduleByDate);
router.get('/stats',       scheduleController.getStats);

// ── Actions ───────────────────────────────────────────────────────────────────
router.put('/take/:scheduleId', scheduleController.markAsTaken);
router.put('/skip/:scheduleId', scheduleController.skipDose);   // ← NEW

module.exports = router;