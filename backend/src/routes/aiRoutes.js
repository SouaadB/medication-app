const express = require('express');
const router = express.Router();
const { handleChatQuery, getChatHistory } = require('../controllers/aiController');
const { protect } = require('../middleware/authMiddleware');

// All AI routes are protected
router.use(protect);

// POST /api/ai/chat
router.post('/chat', handleChatQuery);

// GET /api/ai/chat/history
router.get('/chat/history', getChatHistory);

module.exports = router;