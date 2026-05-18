// controllers/rewardsController.js
const db = require('../config/database');

// ─────────────────────────────────────────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Calculate real progress for each achievement type.
 * Queries medication_schedules directly (status is UPPERCASE in your DB:
 * 'TAKEN', 'MISSED', 'SCHEDULED').
 */
async function _calculateProgress(userId, achievement) {
  const type   = achievement.criteria_type;
  const target = achievement.criteria_value || 1;

  try {
    switch (type) {

      // ── Has the patient ever taken at least one dose? ──────────────────────
      case 'FIRST_MEDICATION': {
        const [rows] = await db.execute(
          `SELECT COUNT(*) AS cnt
           FROM medication_schedules
           WHERE patient_id = ? AND status = 'TAKEN'`,
          [userId]
        );
        return { current: Math.min(rows[0].cnt, target), target };
      }

      // ── Current consecutive-day streak ────────────────────────────────────
      case 'STREAK_DAYS': {
        const [rows] = await db.execute(
          `SELECT current_streak FROM patient_streaks WHERE patient_id = ?`,
          [userId]
        );
        const streak = rows.length > 0 ? (rows[0].current_streak || 0) : 0;
        return { current: Math.min(streak, target), target };
      }

      // ── Total doses ever taken ─────────────────────────────────────────────
      case 'TOTAL_INTAKES': {
        const [rows] = await db.execute(
          `SELECT COUNT(*) AS cnt
           FROM medication_schedules
           WHERE patient_id = ? AND status = 'TAKEN'`,
          [userId]
        );
        return { current: Math.min(rows[0].cnt, target), target };
      }

      // ── Number of fully completed days (all doses taken) ──────────────────
      case 'PERFECT_WEEK': {
        const [rows] = await db.execute(
          `SELECT COUNT(*) AS cnt FROM (
              SELECT DATE(scheduled_date_time) AS day
              FROM medication_schedules
              WHERE patient_id = ?
              GROUP BY DATE(scheduled_date_time)
              HAVING COUNT(*) > 0
                 AND SUM(CASE WHEN status = 'TAKEN' THEN 1 ELSE 0 END) = COUNT(*)
           ) AS perfect_days`,
          [userId]
        );
        return { current: Math.min(rows[0].cnt, target), target };
      }

      // ── Distinct days with a TAKEN dose scheduled before 10:00 ───────────
      case 'EARLY_BIRD': {
        const [rows] = await db.execute(
          `SELECT COUNT(DISTINCT DATE(scheduled_date_time)) AS cnt
           FROM medication_schedules
           WHERE patient_id = ?
             AND status = 'TAKEN'
             AND TIME(scheduled_date_time) < '10:00:00'`,
          [userId]
        );
        return { current: Math.min(rows[0].cnt, target), target };
      }

      // ── Days (out of last 90) with >= 90% adherence ───────────────────────
      case 'ADHERENCE_MONTH': {
        const [rows] = await db.execute(
          `SELECT COUNT(*) AS cnt FROM (
              SELECT DATE(scheduled_date_time) AS day
              FROM medication_schedules
              WHERE patient_id = ?
                AND scheduled_date_time >= DATE_SUB(CURDATE(), INTERVAL 90 DAY)
              GROUP BY DATE(scheduled_date_time)
              HAVING COUNT(*) > 0
                 AND (SUM(CASE WHEN status = 'TAKEN' THEN 1 ELSE 0 END) / COUNT(*)) >= 0.9
           ) AS good_days`,
          [userId]
        );
        return { current: Math.min(rows[0].cnt, target), target };
      }

      // ── Distinct medication names viewed ──────────────────────────────────
      case 'KNOWLEDGE_SEEKER': {
        try {
          const [rows] = await db.execute(
            `SELECT COUNT(DISTINCT medication_name) AS cnt
             FROM medication_views
             WHERE patient_id = ?`,
            [userId]
          );
          return { current: Math.min(rows[0].cnt, target), target };
        } catch (_) {
          return { current: 0, target }; // table not yet created
        }
      }

      default:
        return { current: 0, target };
    }
  } catch (err) {
    console.error(`[rewardsController] Progress calc error for ${type}:`, err.message);
    return { current: 0, target };
  }
}

// ─────────────────────────────────────────────────────────────────────────────
/**
 * Weekly progress: last 7 calendar days (today + 6 days back).
 * completed = every scheduled dose was TAKEN
 * failed    = at least one MISSED dose
 * empty     = nothing was scheduled that day
 */
async function _getWeeklyProgress(userId) {
  const days  = [];
  const today = new Date();

  for (let i = 6; i >= 0; i--) {
    const date    = new Date(today);
    date.setDate(today.getDate() - i);
    const dateStr = date.toISOString().split('T')[0]; // 'YYYY-MM-DD'

    const [rows] = await db.execute(
      `SELECT
          COUNT(*)                                                    AS total,
          SUM(CASE WHEN status = 'TAKEN'  THEN 1 ELSE 0 END)         AS taken,
          SUM(CASE WHEN status = 'MISSED' THEN 1 ELSE 0 END)         AS missed
       FROM medication_schedules
       WHERE patient_id = ?
         AND DATE(scheduled_date_time) = ?`,
      [userId, dateStr]
    );

    const total     = parseInt(rows[0].total  || 0);
    const taken     = parseInt(rows[0].taken  || 0);
    const missed    = parseInt(rows[0].missed || 0);
    const hasData   = total > 0;
    const completed = hasData && taken === total;
    const failed    = hasData && missed > 0 && !completed;

    days.push({
      date:      dateStr,
      day_label: date.toLocaleDateString('en-US', { weekday: 'short' }), // Mon…Sun
      completed,
      failed,
      has_data:  hasData,
      is_today:  i === 0,
      total,
      taken,
      missed,
    });
  }

  const daysWithData  = days.filter(d => d.has_data).length;
  const completedDays = days.filter(d => d.completed).length;
  const progressPct   = daysWithData > 0
    ? Math.round((completedDays / daysWithData) * 100)
    : 0;

  return {
    days,
    progress_pct:   progressPct,
    completed_days: completedDays,
    total_days:     daysWithData,
  };
}

// ─────────────────────────────────────────────────────────────────────────────
/**
 * "Your Impact" — all values derived from real medication_schedules data.
 * Excludes still-SCHEDULED rows so future doses don't skew the percentage.
 */
async function _getImpact(userId, longestStreak) {

  // This month adherence (last 30 days, past doses only)
  const [last30] = await db.execute(
    `SELECT
        COUNT(*)                                                    AS total,
        SUM(CASE WHEN status = 'TAKEN' THEN 1 ELSE 0 END)          AS taken
     FROM medication_schedules
     WHERE patient_id = ?
       AND scheduled_date_time >= DATE_SUB(CURDATE(), INTERVAL 30 DAY)
       AND scheduled_date_time <= NOW()
       AND status IN ('TAKEN', 'MISSED')`,
    [userId]
  );
  const total30      = parseInt(last30[0].total || 0);
  const taken30      = parseInt(last30[0].taken || 0);
  const thisMonthPct = total30 > 0 ? Math.round((taken30 / total30) * 100) : 0;

  // Previous month adherence (30-60 days ago)
  const [prev30] = await db.execute(
    `SELECT
        COUNT(*)                                                    AS total,
        SUM(CASE WHEN status = 'TAKEN' THEN 1 ELSE 0 END)          AS taken
     FROM medication_schedules
     WHERE patient_id = ?
       AND scheduled_date_time >= DATE_SUB(CURDATE(), INTERVAL 60 DAY)
       AND scheduled_date_time <  DATE_SUB(CURDATE(), INTERVAL 30 DAY)
       AND status IN ('TAKEN', 'MISSED')`,
    [userId]
  );
  const prevTotal    = parseInt(prev30[0].total || 0);
  const prevTaken    = parseInt(prev30[0].taken || 0);
  const lastMonthPct = prevTotal > 0 ? Math.round((prevTaken / prevTotal) * 100) : 0;

  const improvement  = lastMonthPct > 0
    ? Math.round(thisMonthPct - lastMonthPct)
    : 0;

  return {
    longest_streak:          longestStreak || 0,
    health_improvement:      improvement,
    medications_on_time_pct: thisMonthPct,
  };
}

// ─────────────────────────────────────────────────────────────────────────────
/**
 * Dynamic motivational message based on real streak + next locked achievement.
 */
function _getMotivationMessage(streak, nextAchievement) {
  if (!nextAchievement) {
    return {
      emoji:   '🏆',
      title:   'Outstanding!',
      message: "You've unlocked every achievement. You're a true Health Champion!",
    };
  }

  const remaining = Math.max(nextAchievement.target - nextAchievement.current, 0);
  const name      = nextAchievement.title;

  if (streak === 0) {
    return {
      emoji:   '🌱',
      title:   'Start Your Journey!',
      message: `Take your medication today to start your streak and work towards "${name}".`,
    };
  }
  if (remaining <= 3) {
    return {
      emoji:   '🔥',
      title:   'Almost There!',
      message: `Just ${remaining} more step${remaining !== 1 ? 's' : ''} to unlock "${name}". Keep it up!`,
    };
  }
  return {
    emoji:   '💪',
    title:   'Keep Going!',
    message: `${remaining} more to unlock "${name}". Stay consistent — every day counts!`,
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// GET /api/rewards/status
// ─────────────────────────────────────────────────────────────────────────────
exports.getRewardsStatus = async (req, res) => {
  try {
    const userId = req.user.id;

    // Guarantee a patient_streaks row exists (safe if already there)
    await db.execute(
      `INSERT IGNORE INTO patient_streaks
         (patient_id, current_streak, longest_streak, last_completion_date, total_points)
       VALUES (?, 0, 0, NULL, 0)`,
      [userId]
    );

    // ── 1. Streak & points ────────────────────────────────────────────────────
    const [streakRows] = await db.execute(
      `SELECT current_streak, longest_streak, total_points
       FROM patient_streaks WHERE patient_id = ?`,
      [userId]
    );
    const sd             = streakRows[0] || {};
    const points         = parseInt(sd.total_points   || 0);
    const currentStreak  = parseInt(sd.current_streak || 0);
    const longestStreak  = parseInt(sd.longest_streak || 0);

    // ── 2. All achievements ───────────────────────────────────────────────────
    const [allAchievements] = await db.execute(
      `SELECT * FROM achievements ORDER BY criteria_value ASC`
    );

    // ── 3. Already unlocked ───────────────────────────────────────────────────
    const [unlockedRows] = await db.execute(
      `SELECT a.*, pa.earned_at
       FROM achievements a
       JOIN patient_achievements pa ON a.id = pa.achievement_id
       WHERE pa.patient_id = ?`,
      [userId]
    );
    const unlockedIds = new Set(unlockedRows.map(r => r.id));

    // ── 4. Progress for every achievement ────────────────────────────────────
    const achievementsWithProgress = await Promise.all(
      allAchievements.map(async (ach) => {
        const isUnlocked          = unlockedIds.has(ach.id);
        const { current, target } = await _calculateProgress(userId, ach);
        const displayCurrent      = isUnlocked ? target : current;
        const progressPct         = target > 0
          ? Math.min(Math.round((displayCurrent / target) * 100), 100)
          : 0;

        return {
          id:               ach.id,
          title:            ach.title,
          description:      ach.description,
          icon_emoji:       ach.icon_emoji,
          criteria_type:    ach.criteria_type,
          criteria_value:   ach.criteria_value,
          points_reward:    ach.points_reward,
          is_unlocked:      isUnlocked,
          earned_at:        isUnlocked
                              ? (unlockedRows.find(u => u.id === ach.id)?.earned_at ?? null)
                              : null,
          progress_current: displayCurrent,
          progress_target:  target,
          progress_pct:     progressPct,
        };
      })
    );

    // ── 5. Weekly progress ────────────────────────────────────────────────────
    const weekly = await _getWeeklyProgress(userId);

    // ── 6. Impact ─────────────────────────────────────────────────────────────
    const impact = await _getImpact(userId, longestStreak);

    // ── 7. Motivation message ─────────────────────────────────────────────────
    const nextAch    = achievementsWithProgress.find(a => !a.is_unlocked) || null;
    const motivation = _getMotivationMessage(
      currentStreak,
      nextAch
        ? { title: nextAch.title, current: nextAch.progress_current, target: nextAch.progress_target }
        : null
    );

    // ── 8. Badge tier ─────────────────────────────────────────────────────────
    const badgeTier = points >= 2500 ? 'platinum'
                    : points >= 1000 ? 'gold'
                    : points >= 500  ? 'silver'
                    : points >= 100  ? 'bronze'
                    : 'none';

    res.json({
      success:               true,
      level:                 Math.floor(points / 500) + 1,
      points,
      current_streak:        currentStreak,
      longest_streak:        longestStreak,
      badge_tier:            badgeTier,
      weekly_progress:       weekly,
      impact,
      motivation,
      all_achievements:      achievementsWithProgress,
      unlocked_achievements: unlockedRows,
    });

  } catch (error) {
    console.error('[rewardsController] getRewardsStatus error:', error);
    res.status(500).json({ success: false, message: 'Error fetching rewards status' });
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// GET /api/rewards/achievements
// ─────────────────────────────────────────────────────────────────────────────
exports.getAchievements = async (req, res) => {
  try {
    const [rows] = await db.execute(
      `SELECT * FROM achievements ORDER BY criteria_value ASC`
    );
    res.json({ success: true, achievements: rows });
  } catch (error) {
    console.error('[rewardsController] getAchievements error:', error);
    res.status(500).json({ success: false, message: 'Error fetching achievements' });
  }
};