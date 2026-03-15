const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const notificationController = require('../controllers/notificationController');

router.use(protect);

// Notifications
router.get('/', notificationController.getNotifications);
router.get('/unread', notificationController.getUnreadNotifications);
router.put('/read/:notificationId', notificationController.markAsRead);
router.put('/read-all', notificationController.markAllAsRead);

module.exports = router;