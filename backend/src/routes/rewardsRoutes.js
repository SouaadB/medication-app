const express = require('express');
const router = express.Router();
const { getRewardsStatus, getAchievements } = require('../controllers/rewardsController');
const { protect } = require('../middleware/authMiddleware');

router.use(protect);

router.get('/status', getRewardsStatus);
router.get('/achievements', getAchievements);

module.exports = router;
