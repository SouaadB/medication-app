const db = require('../config/database');

/**
 * Get patient rewards status (points, streaks, etc.)
 * GET /api/rewards/status
 */
exports.getRewardsStatus = async (req, res) => {
    try {
        const userId = req.user.id;

        // 1. Get streak and points
        const [streakRows] = await db.execute(
            'SELECT current_streak, longest_streak, total_points FROM patient_streaks WHERE patient_id = ?',
            [userId]
        );

        let streakData = {
            current_streak: 0,
            longest_streak: 0,
            total_points: 0
        };

        if (streakRows.length > 0) {
            streakData = streakRows[0];
        }

        // 2. Get unlocked achievements
        const [unlockedRows] = await db.execute(
            `SELECT a.*, pa.earned_at 
             FROM achievements a
             JOIN patient_achievements pa ON a.id = pa.achievement_id
             WHERE pa.patient_id = ?`,
            [userId]
        );

        // 3. Get all achievements to show progress
        const [allAchievements] = await db.execute('SELECT * FROM achievements');

        res.json({
            success: true,
            level: Math.floor(streakData.total_points / 500) + 1, // Simple level logic
            points: streakData.total_points,
            current_streak: streakData.current_streak,
            longest_streak: streakData.longest_streak,
            unlocked_achievements: unlockedRows,
            all_achievements: allAchievements
        });

    } catch (error) {
        console.error('Get Rewards Status Error:', error);
        res.status(500).json({ success: false, message: 'Error fetching rewards status' });
    }
};

/**
 * Get all available achievements
 * GET /api/rewards/achievements
 */
exports.getAchievements = async (req, res) => {
    try {
        const [rows] = await db.execute('SELECT * FROM achievements');
        res.json({
            success: true,
            achievements: rows
        });
    } catch (error) {
        console.error('Get Achievements Error:', error);
        res.status(500).json({ success: false, message: 'Error fetching achievements' });
    }
};
