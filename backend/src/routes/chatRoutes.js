const express    = require('express');
const router     = express.Router();
const chatCtrl   = require('../controllers/chatController');
const { protect } = require('../middleware/authMiddleware');

router.use(protect);

// POST   /api/chat/send              — send a message
// GET    /api/chat/:partner_id       — get conversation messages
// GET    /api/chat/unread/count      — get unread message count
// GET    /api/chat/conversations     — get all conversations (inbox)

router.post('/send',                   chatCtrl.sendMessage);
router.post('/send-voice',             chatCtrl.uploadVoiceMiddleware, chatCtrl.sendVoiceMessage);
router.get('/unread/count',            chatCtrl.getUnreadCount);
router.get('/conversations',           chatCtrl.getConversations);
router.get('/:partner_id',             chatCtrl.getMessages);

module.exports = router;