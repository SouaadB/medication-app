const express    = require('express');
const router     = express.Router();
const { protect } = require('../middleware/authMiddleware');
const notificationController = require('../controllers/notificationController');
const db = require('../config/database');

router.use(protect);

// ── Read ──────────────────────────────────────────────────────────────────────
router.get('/',       notificationController.getNotifications);
router.get('/unread', notificationController.getUnreadNotifications);

// ── Mark read ─────────────────────────────────────────────────────────────────
router.put('/read/:notificationId', notificationController.markAsRead);
router.put('/read-all',             notificationController.markAllAsRead);

// ── Snooze ────────────────────────────────────────────────────────────────────
// Body: { minutes: 15 | 30 | 60 }
router.post('/snooze/:scheduleId', notificationController.snoozeNotification);

// ── Save FCM token ─────────────────────────────────────────────────────────────
router.post('/save-token', async (req, res) => {
    try {
        const { token } = req.body;
        const userId    = req.user.id;

        if (!token) {
            return res.status(400).json({ success: false, message: 'Token is required' });
        }

        const [result] = await db.execute(
    'UPDATE patients SET fcm_token = ? WHERE id = ?',
    [token, userId]
);

console.log(`FCM token update: userId=${userId}, affectedRows=${result.affectedRows}, token=${token.substring(0, 20)}...`);

res.json({ success: true, message: 'Token saved successfully' });

    } catch (error) {
        console.error('Save token error:', error);
        res.status(500).json({ success: false, message: 'Error saving token' });
    }
});

module.exports = router;