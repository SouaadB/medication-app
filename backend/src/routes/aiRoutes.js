const express = require('express');
const router = express.Router();
const { handleChatQuery } = require('../controllers/aiController');
const { protect } = require('../middleware/authMiddleware');

// All AI routes are protected
router.use(protect);

// POST /api/ai/chat
router.post('/chat', handleChatQuery);

module.exports = router;
