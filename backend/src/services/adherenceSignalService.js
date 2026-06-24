const db = require('../config/database');
const FirebaseService = require('./firebaseService');

// ─────────────────────────────────────────────────────────────────────────────
// ADHERENCE SIGNAL SERVICE — with Day 4 Intervention Logic
// Early Warning System — detects decline BEFORE doses are missed
// Feature by: Berrached Malak
// ─────────────────────────────────────────────────────────────────────────────

const SIGNAL_WEIGHTS = {
  responseTimeDegradation: 0.15,
  partialDayAdherence:     0.20,
  weekendCliff:            0.15,
  postIllnessRecovery:     0.15,
  specificMedDrift:        0.15,
  consecutiveMissedDoses:  0.20,
};

const RISK_LEVELS = {
  LOW:      { min: 0.00, max: 0.25, label: 'low' },
  MODERATE: { min: 0.25, max: 0.50, label: 'moderate' },
  HIGH:     { min: 0.50, max: 0.75, label: 'high' },
  CRITICAL: { min: 0.75, max: 1.00, label: 'critical' },
};

// ─────────────────────────────────────────────────────────────────────────────
// SIGNAL 1 — Response Time Degradation
// ─────────────────────────────────────────────────────────────────────────────
async function detectResponseTimeDegradation(patientId) {
  const [rows] = await db.query(
    `SELECT
       AVG(CASE WHEN week_num = 0 AND status = 'TAKEN' AND taken_time IS NOT NULL
           THEN TIMESTAMPDIFF(MINUTE, scheduled_date_time, taken_time) END) AS avg_response_this_week,
       AVG(CASE WHEN week_num = 1 AND status = 'TAKEN' AND taken_time IS NOT NULL
           THEN TIMESTAMPDIFF(MINUTE, scheduled_date_time, taken_time) END) AS avg_response_last_week
     FROM (
       SELECT scheduled_date_time, taken_time, status,
         CASE
           WHEN scheduled_date_time >= DATE_SUB(NOW(), INTERVAL 7 DAY)  THEN 0
           WHEN scheduled_date_time >= DATE_SUB(NOW(), INTERVAL 14 DAY) THEN 1
         END AS week_num
       FROM medication_schedules
       WHERE patient_id = ?
         AND scheduled_date_time >= DATE_SUB(NOW(), INTERVAL 14 DAY)
         AND scheduled_date_time <= NOW()
     ) AS weekly_data`,
    [patientId]
  );

  const thisWeek = parseFloat(rows[0].avg_response_this_week) || 0;
  const lastWeek = parseFloat(rows[0].avg_response_last_week) || 0;

  if (lastWeek === 0 && thisWeek === 0) {
    return { active: false, score: 0, detail: 'Insufficient data', thisWeek: 0, lastWeek: 0 };
  }

  let score = 0;
  let detail = '';

  if (lastWeek === 0 && thisWeek > 0) {
    score  = 0;
    detail = `Avg response time this week: ${Math.round(thisWeek)} min (no prior week to compare)`;
  } else {
    const degradation = (thisWeek - lastWeek) / Math.max(lastWeek, 1);
    score = Math.min(Math.max(degradation, 0), 1.0);
    if (score > 0.3) {
      detail = `Response time up from ${Math.round(lastWeek)} min to ${Math.round(thisWeek)} min avg`;
    } else if (thisWeek <= lastWeek) {
      detail = `Response time stable (${Math.round(thisWeek)} min avg this week)`;
    } else {
      detail = `Slight increase: ${Math.round(lastWeek)} min to ${Math.round(thisWeek)} min`;
    }
  }

  return {
    active:   score > 0.3,
    score:    parseFloat(score.toFixed(3)),
    detail,
    thisWeek: Math.round(thisWeek),
    lastWeek: Math.round(lastWeek),
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// SIGNAL 2 — Partial Day Adherence
// ─────────────────────────────────────────────────────────────────────────────
async function detectPartialDayAdherence(patientId) {
  const [rows] = await db.query(
    `SELECT
       SUM(CASE WHEN HOUR(scheduled_date_time) < 12 AND status = 'TAKEN' THEN 1 ELSE 0 END)              AS morning_taken,
       SUM(CASE WHEN HOUR(scheduled_date_time) < 12 THEN 1 ELSE 0 END)                                   AS morning_total,
       SUM(CASE WHEN HOUR(scheduled_date_time) BETWEEN 12 AND 16 AND status = 'TAKEN' THEN 1 ELSE 0 END) AS afternoon_taken,
       SUM(CASE WHEN HOUR(scheduled_date_time) BETWEEN 12 AND 16 THEN 1 ELSE 0 END)                      AS afternoon_total,
       SUM(CASE WHEN HOUR(scheduled_date_time) >= 17 AND status = 'TAKEN' THEN 1 ELSE 0 END)             AS evening_taken,
       SUM(CASE WHEN HOUR(scheduled_date_time) >= 17 THEN 1 ELSE 0 END)                                  AS evening_total
     FROM medication_schedules
     WHERE patient_id = ?
       AND scheduled_date_time >= DATE_SUB(NOW(), INTERVAL 7 DAY)
       AND scheduled_date_time <= NOW()`,
    [patientId]
  );

  const r = rows[0];
  const morningRate   = r.morning_total   > 0 ? r.morning_taken   / r.morning_total   : null;
  const afternoonRate = r.afternoon_total > 0 ? r.afternoon_taken / r.afternoon_total : null;
  const eveningRate   = r.evening_total   > 0 ? r.evening_taken   / r.evening_total   : null;

  const rates = [];
  if (morningRate   !== null) rates.push({ slot: 'morning',   rate: morningRate });
  if (afternoonRate !== null) rates.push({ slot: 'afternoon', rate: afternoonRate });
  if (eveningRate   !== null) rates.push({ slot: 'evening',   rate: eveningRate });

  if (rates.length === 0) return { active: false, score: 0, detail: 'Insufficient data', worstSlot: null };

  const best  = Math.max(...rates.map(r => r.rate));
  const worst = rates.reduce((a, b) => a.rate < b.rate ? a : b);
  const gap   = best - worst.rate;
  const score = Math.min(gap * 2, 1.0);

  const detail = gap > 0.2
    ? `${worst.slot.charAt(0).toUpperCase() + worst.slot.slice(1)} doses at ${Math.round(worst.rate * 100)}% vs best slot at ${Math.round(best * 100)}%`
    : `All time slots consistent (best: ${Math.round(best * 100)}%, worst: ${Math.round(worst.rate * 100)}%)`;

  return {
    active:    score > 0.3,
    score:     parseFloat(score.toFixed(3)),
    detail,
    worstSlot: worst.slot,
    rates: {
      morning:   morningRate   !== null ? Math.round(morningRate   * 100) : null,
      afternoon: afternoonRate !== null ? Math.round(afternoonRate * 100) : null,
      evening:   eveningRate   !== null ? Math.round(eveningRate   * 100) : null,
    },
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// SIGNAL 3 — Weekend Cliff
// ─────────────────────────────────────────────────────────────────────────────
async function detectWeekendCliff(patientId) {
  const [rows] = await db.query(
    `SELECT
       SUM(CASE WHEN DAYOFWEEK(scheduled_date_time) BETWEEN 2 AND 6 AND status = 'TAKEN' THEN 1 ELSE 0 END) AS weekday_taken,
       SUM(CASE WHEN DAYOFWEEK(scheduled_date_time) BETWEEN 2 AND 6 THEN 1 ELSE 0 END)                       AS weekday_total,
       SUM(CASE WHEN DAYOFWEEK(scheduled_date_time) IN (1,7) AND status = 'TAKEN' THEN 1 ELSE 0 END)         AS weekend_taken,
       SUM(CASE WHEN DAYOFWEEK(scheduled_date_time) IN (1,7) THEN 1 ELSE 0 END)                               AS weekend_total
     FROM medication_schedules
     WHERE patient_id = ?
       AND scheduled_date_time >= DATE_SUB(NOW(), INTERVAL 28 DAY)
       AND scheduled_date_time <= NOW()`,
    [patientId]
  );

  const r = rows[0];
  if (r.weekday_total === 0 || r.weekend_total === 0) {
    return { active: false, score: 0, detail: 'Insufficient data', weekdayRate: null, weekendRate: null };
  }

  const weekdayRate = r.weekday_taken / r.weekday_total;
  const weekendRate = r.weekend_taken / r.weekend_total;
  const cliff       = weekdayRate - weekendRate;
  const score       = Math.min(Math.max(cliff * 2, 0), 1.0);

  const detail = cliff > 0.15
    ? `Weekday adherence ${Math.round(weekdayRate * 100)}% vs weekend ${Math.round(weekendRate * 100)}%`
    : `Weekend adherence consistent with weekdays (${Math.round(weekendRate * 100)}%)`;

  return {
    active:      score > 0.3,
    score:       parseFloat(score.toFixed(3)),
    detail,
    weekdayRate: Math.round(weekdayRate * 100),
    weekendRate: Math.round(weekendRate * 100),
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// SIGNAL 4 — Post-Illness Recovery
// ─────────────────────────────────────────────────────────────────────────────
async function detectPostIllnessRecovery(patientId) {
  const [rows] = await db.query(
    `SELECT
       DATE(scheduled_date_time) AS day,
       SUM(CASE WHEN status = 'TAKEN' THEN 1 ELSE 0 END) AS taken,
       COUNT(*) AS total,
       SUM(CASE WHEN status = 'TAKEN' THEN 1 ELSE 0 END) / COUNT(*) AS rate
     FROM medication_schedules
     WHERE patient_id = ?
       AND scheduled_date_time >= DATE_SUB(NOW(), INTERVAL 14 DAY)
       AND scheduled_date_time <= NOW()
     GROUP BY DATE(scheduled_date_time)
     ORDER BY day ASC`,
    [patientId]
  );

  if (rows.length < 5) return { active: false, score: 0, detail: 'Insufficient data', missStreakDays: 0 };

  let maxStreakLength = 0;
  let currentStreak  = 0;
  let streakEndIndex = -1;

  for (let i = 0; i < rows.length; i++) {
    if (parseFloat(rows[i].rate) < 0.5) {
      currentStreak++;
      if (currentStreak > maxStreakLength) {
        maxStreakLength = currentStreak;
        streakEndIndex  = i;
      }
    } else {
      currentStreak = 0;
    }
  }

  if (maxStreakLength < 3) return { active: false, score: 0, detail: 'No significant missed dose streak detected', missStreakDays: maxStreakLength };

  const recoveryDays = rows.slice(streakEndIndex + 1);
  if (recoveryDays.length === 0) {
    return { active: true, score: 0.7, detail: `${maxStreakLength}-day missed streak, recovery just starting`, missStreakDays: maxStreakLength };
  }

  const recoveryAvg = recoveryDays.reduce((sum, d) => sum + parseFloat(d.rate), 0) / recoveryDays.length;
  const score       = Math.min(Math.max((0.8 - recoveryAvg) * 2, 0), 1.0);

  const detail = recoveryAvg >= 0.8
    ? `Recovered well after ${maxStreakLength}-day streak (${Math.round(recoveryAvg * 100)}% since recovery)`
    : `Slow recovery after ${maxStreakLength}-day missed streak (${Math.round(recoveryAvg * 100)}% adherence since)`;

  return {
    active:         score > 0.3,
    score:          parseFloat(score.toFixed(3)),
    detail,
    missStreakDays: maxStreakLength,
    recoveryRate:   Math.round(recoveryAvg * 100),
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// SIGNAL 5 — Specific Medication Drift
// ─────────────────────────────────────────────────────────────────────────────
async function detectSpecificMedDrift(patientId) {
  const [rows] = await db.query(
    `SELECT
       t.medication_name, t.priority, t.id AS treatment_id,
       COUNT(*)                                                           AS total_doses,
       SUM(CASE WHEN ms.status = 'TAKEN'  THEN 1 ELSE 0 END)            AS taken_doses,
       SUM(CASE WHEN ms.status = 'MISSED' THEN 1 ELSE 0 END)            AS missed_doses,
       SUM(CASE WHEN ms.status = 'TAKEN'  THEN 1 ELSE 0 END) / COUNT(*) AS adherence_rate,
       AVG(CASE WHEN ms.status = 'TAKEN' AND ms.taken_time IS NOT NULL
           THEN TIMESTAMPDIFF(MINUTE, ms.scheduled_date_time, ms.taken_time) END) AS avg_delay_minutes
     FROM medication_schedules ms
     JOIN treatments t ON ms.treatment_id = t.id
     WHERE ms.patient_id = ?
       AND ms.scheduled_date_time >= DATE_SUB(NOW(), INTERVAL 7 DAY)
       AND ms.scheduled_date_time <= NOW()
       AND t.is_active = 1
     GROUP BY t.id, t.medication_name, t.priority
     HAVING total_doses >= 3
     ORDER BY adherence_rate ASC`,
    [patientId]
  );

  if (rows.length === 0) return { active: false, score: 0, detail: 'Insufficient data', driftingMed: null };

  if (rows.length === 1) {
    const med   = rows[0];
    const rate  = parseFloat(med.adherence_rate);
    const score = Math.min(Math.max((0.8 - rate) * 2, 0), 1.0);
    return {
      active:      score > 0.3,
      score:       parseFloat(score.toFixed(3)),
      detail:      rate < 0.7
        ? `${med.medication_name} at ${Math.round(rate * 100)}% adherence this week`
        : `${med.medication_name} adherence stable at ${Math.round(rate * 100)}%`,
      driftingMed: score > 0.3 ? med.medication_name : null,
      priority:    med.priority,
    };
  }

  const overallAvg    = rows.reduce((sum, r) => sum + parseFloat(r.adherence_rate), 0) / rows.length;
  const worstMed      = rows[0];
  const worstRate     = parseFloat(worstMed.adherence_rate);
  const drift         = overallAvg - worstRate;
  const score         = Math.min(Math.max(drift * 2, 0), 1.0);
  const priorityBoost = worstMed.priority === 'HIGH' ? 0.2 : (worstMed.priority === 'MEDIUM' ? 0.1 : 0);
  const finalScore    = Math.min(score + (score > 0 ? priorityBoost : 0), 1.0);

  const detail = drift > 0.2
    ? `${worstMed.medication_name} at ${Math.round(worstRate * 100)}% vs overall avg ${Math.round(overallAvg * 100)}%${worstMed.priority === 'HIGH' ? ' (HIGH priority)' : ''}`
    : `All medications consistent (lowest: ${worstMed.medication_name} at ${Math.round(worstRate * 100)}%)`;

  return {
    active:      finalScore > 0.3,
    score:       parseFloat(finalScore.toFixed(3)),
    detail,
    driftingMed: finalScore > 0.3 ? worstMed.medication_name : null,
    priority:    worstMed.priority,
    worstRate:   Math.round(worstRate * 100),
    overallAvg:  Math.round(overallAvg * 100),
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// SIGNAL 6 — Consecutive Missed Doses
// Detects 2+ consecutive days where a medication was missed entirely.
// This is the strongest predictor of treatment discontinuation.
// ─────────────────────────────────────────────────────────────────────────────
async function detectConsecutiveMissedDoses(patientId) {
  const [rows] = await db.query(
    `SELECT t.medication_name, t.priority,
            DATE(ms.scheduled_date_time) AS dose_date,
            ms.status
     FROM medication_schedules ms
     JOIN treatments t ON ms.treatment_id = t.id
     WHERE ms.patient_id = ?
       AND ms.scheduled_date_time >= DATE_SUB(NOW(), INTERVAL 7 DAY)
       AND ms.scheduled_date_time <= NOW()
       AND t.is_active = 1
     ORDER BY t.id, ms.scheduled_date_time ASC`,
    [patientId]
  );

  if (rows.length === 0) return { active: false, score: 0, detail: 'Insufficient data', worstMed: null, maxStreak: 0 };

  // Group doses by medication and day
  const medGroups = {};
  for (const row of rows) {
    const key = row.medication_name;
    if (!medGroups[key]) medGroups[key] = { priority: row.priority, days: {} };
    const day = String(row.dose_date).split('T')[0];
    if (!medGroups[key].days[day]) medGroups[key].days[day] = { total: 0, missed: 0 };
    medGroups[key].days[day].total++;
    if (row.status === 'MISSED') medGroups[key].days[day].missed++;
  }

  let maxStreak = 0;
  let worstMed  = null;
  let worstPriority = 'LOW';

  for (const [name, med] of Object.entries(medGroups)) {
    const sortedDays = Object.keys(med.days).sort();
    let streak = 0;
    for (const day of sortedDays) {
      const d = med.days[day];
      if (d.missed === d.total) {
        streak++;
        if (streak > maxStreak || (streak === maxStreak && med.priority === 'HIGH')) {
          maxStreak     = streak;
          worstMed      = name;
          worstPriority = med.priority;
        }
      } else {
        streak = 0;
      }
    }
  }

  if (maxStreak < 2) return { active: false, score: 0, detail: 'No consecutive missed days detected', worstMed: null, maxStreak };

  const base          = Math.min((maxStreak - 1) * 0.35, 1.0);
  const priorityBoost = worstPriority === 'HIGH' ? 0.25 : (worstPriority === 'MEDIUM' ? 0.10 : 0);
  const finalScore    = Math.min(base + priorityBoost, 1.0);

  return {
    active:   finalScore > 0.3,
    score:    parseFloat(finalScore.toFixed(3)),
    detail:   `${worstMed} missed ${maxStreak} consecutive day${maxStreak > 1 ? 's' : ''}${worstPriority === 'HIGH' ? ' (HIGH priority)' : ''}`,
    worstMed,
    maxStreak,
    priority: worstPriority,
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// FORECAST ENGINE
// ─────────────────────────────────────────────────────────────────────────────
async function analyzePatientSignals(patientId) {
  const [signal1, signal2, signal3, signal4, signal5, signal6, streakRows] = await Promise.all([
    detectResponseTimeDegradation(patientId),
    detectPartialDayAdherence(patientId),
    detectWeekendCliff(patientId),
    detectPostIllnessRecovery(patientId),
    detectSpecificMedDrift(patientId),
    detectConsecutiveMissedDoses(patientId),
    db.query(`SELECT current_streak FROM patient_streaks WHERE patient_id = ?`, [patientId]),
  ]);

  const currentStreak = streakRows[0]?.[0]?.current_streak || 0;

  const signals = {
    responseTimeDegradation: signal1,
    partialDayAdherence:     signal2,
    weekendCliff:            signal3,
    postIllnessRecovery:     signal4,
    specificMedDrift:        signal5,
    consecutiveMissedDoses:  signal6,
  };

  const rawScore =
    signal1.score * SIGNAL_WEIGHTS.responseTimeDegradation +
    signal2.score * SIGNAL_WEIGHTS.partialDayAdherence     +
    signal3.score * SIGNAL_WEIGHTS.weekendCliff            +
    signal4.score * SIGNAL_WEIGHTS.postIllnessRecovery     +
    signal5.score * SIGNAL_WEIGHTS.specificMedDrift        +
    signal6.score * SIGNAL_WEIGHTS.consecutiveMissedDoses;

  // Streak bonus: a long streak reduces the risk score (max 15% reduction at 30+ days)
  const streakBonus   = Math.min(currentStreak / 30, 1.0) * 0.15;
  const forecastScore = Math.max(parseFloat((rawScore - streakBonus).toFixed(3)), 0);

  let riskLevel = 'low';
  if      (forecastScore >= RISK_LEVELS.CRITICAL.min) riskLevel = 'critical';
  else if (forecastScore >= RISK_LEVELS.HIGH.min)     riskLevel = 'high';
  else if (forecastScore >= RISK_LEVELS.MODERATE.min) riskLevel = 'moderate';

  const activeSignals = Object.entries(signals)
    .filter(([, s]) => s.active)
    .map(([key, s]) => ({ signal: key, detail: s.detail, score: s.score }));

  // ── Baseline adherence override ───────────────────────────────────────────
  // Prevents "low risk" for patients who are simply and consistently
  // non-adherent across all dimensions (all signals score 0 because
  // there is no pattern change to detect — everything is uniformly bad).
  const [baselineRows] = await db.query(
    `SELECT
       SUM(CASE WHEN status = 'TAKEN' THEN 1 ELSE 0 END) / COUNT(*) AS adherence_rate
     FROM medication_schedules
     WHERE patient_id = ?
       AND scheduled_date_time >= DATE_SUB(NOW(), INTERVAL 7 DAY)
       AND scheduled_date_time <= NOW()`,
    [patientId]
  );

  const overallRate = parseFloat(baselineRows[0]?.adherence_rate) || 0;

  if (overallRate < 0.5 && riskLevel === 'low') {
    riskLevel = 'moderate';
    activeSignals.push({
      signal: 'lowOverallAdherence',
      detail: `Overall adherence is ${Math.round(overallRate * 100)}% this week — below the 50% threshold`,
      score:  parseFloat((1 - overallRate).toFixed(3)),
    });
  }

  if (overallRate < 0.3 && (riskLevel === 'low' || riskLevel === 'moderate')) {
    riskLevel = 'high';
    // Update detail if signal was just added
    const existing = activeSignals.find(s => s.signal === 'lowOverallAdherence');
    if (!existing) {
      activeSignals.push({
        signal: 'lowOverallAdherence',
        detail: `Overall adherence is ${Math.round(overallRate * 100)}% this week — critically low`,
        score:  parseFloat((1 - overallRate).toFixed(3)),
      });
    } else {
      existing.detail = `Overall adherence is ${Math.round(overallRate * 100)}% this week — critically low`;
    }
  }

  // Probability of missing a dose: blend of raw adherence gap and signal score
  const missProbability = parseFloat(
    Math.min(Math.max((1 - overallRate) * 0.6 + forecastScore * 0.4, 0), 1).toFixed(3)
  );

  return {
    patientId,
    forecastScore:    parseFloat(forecastScore.toFixed(3)),
    missProbability,
    currentStreak,
    riskLevel,
    activeSignals,
    signals,
    generatedAt:      new Date().toISOString(),
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// DAY 4 — INTERVENTION LOGIC
//
// When the forecast runs, active signals trigger targeted FCM notifications
// to the patient. Each signal has a specific message explaining what's wrong
// and what to do. Only fires once per 24h per signal to avoid spam.
//
// Intervention map:
//   responseTimeDegradation → remind patient to take meds promptly
//   partialDayAdherence     → remind about the specific weak time slot
//   weekendCliff            → weekend-specific reminder
//   postIllnessRecovery     → recovery encouragement
//   specificMedDrift        → name the specific medication that's drifting
// ─────────────────────────────────────────────────────────────────────────────
async function triggerInterventions(patientId, forecastResult) {
  try {
    // Get patient FCM token and notification prefs
    const [[patient]] = await db.query(
      `SELECT p.fcm_token, p.all_notifications, p.smart_insights, u.name
       FROM patients p JOIN users u ON u.id = p.id
       WHERE p.id = ?`,
      [patientId]
    );

    if (!patient?.fcm_token || !patient.all_notifications || !patient.smart_insights) {
      console.log(`[Interventions] Patient ${patientId} has no FCM token or disabled smart insights`);
      return [];
    }

    const triggered = [];
    const { activeSignals, signals, riskLevel } = forecastResult;

    // Only intervene for moderate risk and above
    if (riskLevel === 'low') return [];

    for (const { signal } of activeSignals) {
      // Dedup: skip if this intervention was sent in the last 24h
      const alreadySent = await _interventionSentRecently(patientId, signal);
      if (alreadySent) continue;

      const message = _buildInterventionMessage(signal, signals[signal], patient.name);
      if (!message) continue;

      // Send FCM push
      await FirebaseService.sendPushNotification(
        patient.fcm_token,
        message.title,
        message.body,
        { type: 'ai_insight', signal, risk_level: riskLevel },
        false // not high priority — these are insights, not urgent reminders
      );

      // Save to notifications table so patient sees it in the app
      await db.query(
        `INSERT INTO notifications (patient_id, type, title, message, data, scheduled_time)
         VALUES (?, 'ai_insight', ?, ?, ?, NOW())`,
        [
          patientId,
          message.title,
          message.body,
          JSON.stringify({ signal, risk_level: riskLevel, type: 'ai_insight' }),
        ]
      );

      triggered.push(signal);
      console.log(`[Interventions] ✅ ${signal} intervention sent to patient ${patientId}`);
    }

    return triggered;

  } catch (error) {
    console.error('[Interventions] ❌ Error:', error);
    return [];
  }
}

// ── Intervention message templates ───────────────────────────────────────────
function _buildInterventionMessage(signal, signalData, patientName) {
  switch (signal) {

    case 'responseTimeDegradation':
      return {
        title: '⏰ Take your medications on time',
        body:  `Hi ${patientName}, we noticed you've been taking your medications later than usual lately. Try to take them as soon as the reminder appears — timing matters for your treatment to work well.`,
      };

    case 'partialDayAdherence': {
      const slot = signalData.worstSlot || 'evening';
      const slotLabel = slot === 'morning' ? 'morning' : slot === 'afternoon' ? 'afternoon' : 'evening';
      return {
        title: `💊 Don't forget your ${slotLabel} medications`,
        body:  `Hi ${patientName}, your ${slotLabel} doses are being missed more often than other times of day. Try setting a dedicated alarm to help you remember.`,
      };
    }

    case 'weekendCliff':
      return {
        title: '📅 Weekend medication reminder',
        body:  `Hi ${patientName}, your medication adherence tends to drop on weekends. Your health doesn't take weekends off — try to keep the same routine as weekdays.`,
      };

    case 'postIllnessRecovery':
      return {
        title: '💪 Getting back on track',
        body:  `Hi ${patientName}, you seem to be recovering from a difficult period. It's important to get back to your full medication routine — every dose counts for your recovery.`,
      };

    case 'specificMedDrift': {
      const medName = signalData.driftingMed || 'one of your medications';
      return {
        title: `⚠️ ${medName} — missed doses detected`,
        body:  `Hi ${patientName}, you've been missing ${medName} more than your other medications this week. This one is important for your condition — please make sure to take it as prescribed.`,
      };
    }

case 'consecutiveMissedDoses': {
      const med  = signalData.worstMed || 'your medication';
      const days = signalData.maxStreak || 2;
      return {
        title: `⚠️ ${med} — ${days} missed days in a row`,
        body:  `Hi ${patientName}, you have missed ${med} for ${days} consecutive days. Please take it today and speak with your doctor if you are having difficulties with this medication.`,
      };
    }

    case 'lowOverallAdherence': {
      const rate = signalData.score !== undefined
        ? Math.round((1 - signalData.score) * 100)
        : null;
      return {
        title: '📉 Your medication adherence needs attention',
        body:  rate !== null
          ? `Hi ${patientName}, your overall adherence this week is around ${rate}%. Let's work on getting back on track — try setting reminders for each dose and reach out to your caregiver if you need support.`
          : `Hi ${patientName}, your overall medication adherence has been low this week. Let's work on getting back on track — try setting reminders for each dose and reach out to your caregiver if you need support.`,
      };
    }

    default:
      return null;
  }
}

// ── Dedup check — was this intervention sent in the last 24h? ────────────────
async function _interventionSentRecently(patientId, signal) {
  try {
    const [rows] = await db.query(
      `SELECT id FROM notifications
       WHERE patient_id = ?
         AND type = 'ai_insight'
         AND JSON_UNQUOTE(JSON_EXTRACT(data, '$.signal')) = ?
         AND created_at > DATE_SUB(NOW(), INTERVAL 24 HOUR)`,
      [patientId, signal]
    );
    return rows.length > 0;
  } catch (_) { return false; }
}

// ─────────────────────────────────────────────────────────────────────────────
// DB — saveForecast
// ─────────────────────────────────────────────────────────────────────────────
async function saveForecast(forecastResult) {
  const { patientId, forecastScore, riskLevel, signals, activeSignals } = forecastResult;
  const interventionsTriggered = activeSignals.map(s => s.signal);

  await db.query(
    `INSERT INTO adherence_forecasts
       (patient_id, signal_data, forecast_score, risk_level, interventions_triggered)
     VALUES (?, ?, ?, ?, ?)`,
    [
      patientId,
      JSON.stringify(signals),
      forecastScore,
      riskLevel,
      JSON.stringify(interventionsTriggered),
    ]
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// DB — getLatestForecast
// ─────────────────────────────────────────────────────────────────────────────
async function getLatestForecast(patientId) {
  const [rows] = await db.query(
    `SELECT id, patient_id, forecast_score, risk_level,
            signal_data, interventions_triggered, created_at
     FROM adherence_forecasts
     WHERE patient_id = ?
     ORDER BY created_at DESC
     LIMIT 1`,
    [patientId]
  );
  if (rows.length === 0) return null;
  const row = rows[0];
  return {
    id:                     row.id,
    patientId:              row.patient_id,
    forecastScore:          row.forecast_score,
    riskLevel:              row.risk_level,
    signals:                row.signal_data,
    interventionsTriggered: row.interventions_triggered,
    createdAt:              row.created_at,
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// DB — getForecastHistory
// ─────────────────────────────────────────────────────────────────────────────
async function getForecastHistory(patientId, limit = 10) {
  const [rows] = await db.query(
    `SELECT id, forecast_score, risk_level, interventions_triggered, created_at
     FROM adherence_forecasts
     WHERE patient_id = ?
     ORDER BY created_at DESC
     LIMIT ?`,
    [patientId, limit]
  );
  return rows.map(row => ({
    id:                     row.id,
    forecastScore:          row.forecast_score,
    riskLevel:              row.risk_level,
    interventionsTriggered: row.interventions_triggered,
    createdAt:              row.created_at,
  }));
}

// ─────────────────────────────────────────────────────────────────────────────
// DB — getLatestForecastForCaregiver
// ─────────────────────────────────────────────────────────────────────────────
async function getLatestForecastForCaregiver(caregiverEmail) {
  const [rows] = await db.query(
    `SELECT af.patient_id, u.name AS patient_name,
            af.forecast_score, af.risk_level,
            af.signal_data, af.interventions_triggered, af.created_at
     FROM adherence_forecasts af
     JOIN (
       SELECT patient_id, MAX(created_at) AS latest
       FROM adherence_forecasts GROUP BY patient_id
     ) latest_per_patient
       ON af.patient_id = latest_per_patient.patient_id
      AND af.created_at = latest_per_patient.latest
     JOIN caregivers cg ON cg.patient_id = af.patient_id
                        AND cg.email = ?
                        AND cg.status = 'ACTIVE'
     JOIN users u ON u.id = af.patient_id
     WHERE af.risk_level IN ('moderate', 'high', 'critical')
     ORDER BY af.forecast_score DESC`,
    [caregiverEmail]
  );
  return rows.map(row => ({
    patientId:              row.patient_id,
    patientName:            row.patient_name,
    forecastScore:          row.forecast_score,
    riskLevel:              row.risk_level,
    signals:                row.signal_data,
    interventionsTriggered: row.interventions_triggered,
    createdAt:              row.created_at,
  }));
}

// ─────────────────────────────────────────────────────────────────────────────
// MAIN ENTRY POINT — analyzeAndSave
// Runs full pipeline: signals → forecast → DB save → interventions
// ─────────────────────────────────────────────────────────────────────────────
async function analyzeAndSave(patientId) {
  const result = await analyzePatientSignals(patientId);
  await saveForecast(result);
  // Day 4: trigger interventions after saving
  const triggered = await triggerInterventions(patientId, result);
  result.triggeredInterventions = triggered;
  return result;
}

module.exports = {
  analyzeAndSave,
  analyzePatientSignals,
  triggerInterventions,
  getLatestForecast,
  getForecastHistory,
  getLatestForecastForCaregiver,
  detectResponseTimeDegradation,
  detectPartialDayAdherence,
  detectWeekendCliff,
  detectPostIllnessRecovery,
  detectSpecificMedDrift,
  detectConsecutiveMissedDoses,
};