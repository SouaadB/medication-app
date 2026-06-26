const db = require('../config/database');
const FirebaseService = require('./firebaseService');

// ─────────────────────────────────────────────────────────────────────────────
// ADHERENCE SIGNAL SERVICE — Early Warning System
// Detects decline BEFORE doses pile up into a crisis. Rule-based, not ML —
// every score below is a deliberately chosen, explainable formula so a
// caregiver/clinician can always see exactly why a number is what it is.
//
// This is the SINGLE SOURCE OF TRUTH for adherence risk. assessmentService.js
// (caregiver-facing narrative assessments) derives its risk level directly
// from this engine's output rather than recomputing its own — that is what
// guarantees the patient app and the caregiver app can never disagree about
// the same patient at the same moment.
//
// Conventions used by every detector below, to stay consistent and avoid the
// "today is half-finished" noise: "this week" = the 7 full calendar days
// before today (today itself is excluded — its doses aren't all resolved
// yet, so including it would understate adherence for no good reason).
// ─────────────────────────────────────────────────────────────────────────────

const SIGNAL_WEIGHTS = {
  criticalMedicationMissed: 0.25,
  consecutiveMissedDoses:   0.20,
  partialDayAdherence:      0.15,
  responseTimeDegradation:  0.10,
  weekendCliff:             0.10,
  postIllnessRecovery:      0.10,
  specificMedDrift:         0.10,
};

const RISK_LEVELS = {
  LOW:      { min: 0.00, max: 0.25, label: 'low' },
  MODERATE: { min: 0.25, max: 0.50, label: 'moderate' },
  HIGH:     { min: 0.50, max: 0.75, label: 'high' },
  CRITICAL: { min: 0.75, max: 1.00, label: 'critical' },
};

// Minimum number of data points required before a detector trusts a
// comparison enough to fire. Below this, a "signal" is just noise.
const MIN_SAMPLE = 3;

// ─────────────────────────────────────────────────────────────────────────────
// SIGNAL 1 — Response Time Degradation
// How much SLOWER is the patient taking their doses than last week, among
// doses they did take? Guards: needs >=3 taken doses in BOTH weeks to trust
// the average, and requires >=15 min absolute change before treating any
// relative ratio as meaningful (a 2min -> 5min "150% increase" is noise).
// ─────────────────────────────────────────────────────────────────────────────
async function detectResponseTimeDegradation(patientId) {
  const [rows] = await db.query(
    `SELECT
       AVG(CASE WHEN week_num = 0 AND status = 'TAKEN' AND taken_time IS NOT NULL
           THEN TIMESTAMPDIFF(MINUTE, scheduled_date_time, taken_time) END) AS avg_response_this_week,
       AVG(CASE WHEN week_num = 1 AND status = 'TAKEN' AND taken_time IS NOT NULL
           THEN TIMESTAMPDIFF(MINUTE, scheduled_date_time, taken_time) END) AS avg_response_last_week,
       SUM(CASE WHEN week_num = 0 AND status = 'TAKEN' AND taken_time IS NOT NULL THEN 1 ELSE 0 END) AS taken_this_week,
       SUM(CASE WHEN week_num = 1 AND status = 'TAKEN' AND taken_time IS NOT NULL THEN 1 ELSE 0 END) AS taken_last_week
     FROM (
       SELECT scheduled_date_time, taken_time, status,
         CASE
           WHEN scheduled_date_time >= DATE_SUB(CURDATE(), INTERVAL 7 DAY)
            AND scheduled_date_time <  CURDATE() THEN 0
           WHEN scheduled_date_time >= DATE_SUB(CURDATE(), INTERVAL 14 DAY)
            AND scheduled_date_time <  DATE_SUB(CURDATE(), INTERVAL 7 DAY) THEN 1
         END AS week_num
       FROM medication_schedules
       WHERE patient_id = ?
         AND scheduled_date_time >= DATE_SUB(CURDATE(), INTERVAL 14 DAY)
         AND scheduled_date_time <  CURDATE()
     ) AS weekly_data`,
    [patientId]
  );

  const r = rows[0];
  const thisWeek      = parseFloat(r.avg_response_this_week) || 0;
  const lastWeek       = parseFloat(r.avg_response_last_week) || 0;
  const takenThisWeek = r.taken_this_week || 0;
  const takenLastWeek = r.taken_last_week || 0;

  if (takenThisWeek < MIN_SAMPLE || takenLastWeek < MIN_SAMPLE) {
    return {
      active: false, score: 0,
      detail: 'Insufficient data (need at least 3 taken doses in each of the last two weeks to compare timing)',
      thisWeek: Math.round(thisWeek), lastWeek: Math.round(lastWeek),
    };
  }

  const absoluteDelta = thisWeek - lastWeek;
  let score = 0;
  let detail;

  if (absoluteDelta < 15) {
    // Under 15 minutes of average change isn't clinically meaningful —
    // ignore it rather than let a tiny baseline blow up a relative ratio.
    score = 0;
    detail = absoluteDelta <= 0
      ? `Response time stable or improved (${Math.round(thisWeek)} min avg this week)`
      : `Slight increase: ${Math.round(lastWeek)} min to ${Math.round(thisWeek)} min avg (not significant)`;
  } else {
    const relativeDelta = absoluteDelta / Math.max(lastWeek, 20);
    score = Math.min(Math.max(relativeDelta, 0), 1.0);
    detail = `Response time up from ${Math.round(lastWeek)} min to ${Math.round(thisWeek)} min avg`;
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
// Does one time-of-day slot lag badly behind the others? Each slot needs
// >=3 scheduled doses this week to be trusted; with fewer than 2 trustworthy
// slots there's nothing to compare.
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
       AND scheduled_date_time >= DATE_SUB(CURDATE(), INTERVAL 7 DAY)
       AND scheduled_date_time <  CURDATE()`,
    [patientId]
  );

  const r = rows[0];
  const allSlots = [
    { slot: 'morning',   taken: r.morning_taken   || 0, total: r.morning_total   || 0 },
    { slot: 'afternoon', taken: r.afternoon_taken || 0, total: r.afternoon_total || 0 },
    { slot: 'evening',   taken: r.evening_taken   || 0, total: r.evening_total   || 0 },
  ];

  // Displayed regardless of sample size — informational only.
  const ratesDisplay = {};
  for (const s of allSlots) ratesDisplay[s.slot] = s.total > 0 ? Math.round((s.taken / s.total) * 100) : null;

  // Only sufficiently-sampled slots are used to detect a real gap.
  const trustworthy = allSlots.filter(s => s.total >= MIN_SAMPLE).map(s => ({ slot: s.slot, rate: s.taken / s.total }));

  if (trustworthy.length < 2) {
    return { active: false, score: 0, detail: 'Insufficient data', worstSlot: null, rates: ratesDisplay };
  }

  const best  = Math.max(...trustworthy.map(s => s.rate));
  const worst = trustworthy.reduce((a, b) => (a.rate < b.rate ? a : b));
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
    rates:     ratesDisplay,
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// SIGNAL 3 — Weekend Cliff
// Requires a minimum amount of both weekday and weekend data over 28 days
// before trusting the comparison — a single noisy weekend shouldn't swing
// this signal.
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
       AND scheduled_date_time >= DATE_SUB(CURDATE(), INTERVAL 28 DAY)
       AND scheduled_date_time <  CURDATE()`,
    [patientId]
  );

  const r = rows[0];
  const weekdayTotal = r.weekday_total || 0;
  const weekendTotal = r.weekend_total || 0;

  if (weekdayTotal < 5 || weekendTotal < 3) {
    return { active: false, score: 0, detail: 'Insufficient data', weekdayRate: null, weekendRate: null };
  }

  const weekdayRate = r.weekday_taken / weekdayTotal;
  const weekendRate = r.weekend_taken / weekendTotal;
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
// Detects a 3+ day near-total miss streak, then checks how well the patient
// recovered afterwards. The recovery score is confidence-weighted by how
// many recovery days have actually been observed — one good day right after
// a 3-day crisis is NOT the same evidence as 5 good days in a row, and
// shouldn't be scored as if it were.
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
       AND scheduled_date_time >= DATE_SUB(CURDATE(), INTERVAL 14 DAY)
       AND scheduled_date_time <  CURDATE()
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
  const rawScore     = Math.min(Math.max((0.8 - recoveryAvg) * 2, 0), 1.0);

  // Confidence ramps from 0 (1 day of recovery data) to 1 (3+ days). At low
  // confidence, pull the score toward a cautious midpoint instead of trusting
  // a tiny sample's verdict outright.
  const confidence = Math.min(recoveryDays.length / 3, 1);
  const score      = rawScore * confidence + 0.5 * (1 - confidence);

  const detail = recoveryAvg >= 0.8
    ? `Recovered well after ${maxStreakLength}-day streak (${Math.round(recoveryAvg * 100)}% since recovery, ${recoveryDays.length} day${recoveryDays.length > 1 ? 's' : ''} observed)`
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
// Is ONE medication doing notably worse than the patient's OTHER active
// medications this week? Needs >=2 concurrently active meds with >=3 doses
// each — with only one medication, there is nothing to drift relative TO, so
// this signal stays inactive and lets the overall-adherence signal cover it
// instead (otherwise the same low adherence would be double-counted under
// two different signal names).
// ─────────────────────────────────────────────────────────────────────────────
async function detectSpecificMedDrift(patientId) {
  const [rows] = await db.query(
    `SELECT
       t.medication_name, t.priority, t.id AS treatment_id,
       COUNT(*)                                                           AS total_doses,
       SUM(CASE WHEN ms.status = 'TAKEN'  THEN 1 ELSE 0 END) / COUNT(*) AS adherence_rate
     FROM medication_schedules ms
     JOIN treatments t ON ms.treatment_id = t.id
     WHERE ms.patient_id = ?
       AND ms.scheduled_date_time >= DATE_SUB(CURDATE(), INTERVAL 7 DAY)
       AND ms.scheduled_date_time <  CURDATE()
       AND t.is_active = 1
     GROUP BY t.id, t.medication_name, t.priority
     HAVING total_doses >= 3
     ORDER BY adherence_rate ASC`,
    [patientId]
  );

  if (rows.length < 2) {
    return {
      active: false, score: 0,
      detail: rows.length === 0 ? 'Insufficient data' : 'Only one active medication with enough doses this week — not comparable',
      driftingMed: null,
    };
  }

  const worstMed  = rows[0];
  const worstRate = parseFloat(worstMed.adherence_rate);
  const otherMeds = rows.slice(1);
  const otherAvg  = otherMeds.reduce((sum, r) => sum + parseFloat(r.adherence_rate), 0) / otherMeds.length;

  const drift          = otherAvg - worstRate;
  const score          = Math.min(Math.max(drift * 2, 0), 1.0);
  const priorityBoost  = worstMed.priority === 'HIGH' ? 0.2 : (worstMed.priority === 'MEDIUM' ? 0.1 : 0);
  const finalScore     = Math.min(score + (score > 0 ? priorityBoost : 0), 1.0);

  const detail = drift > 0.2
    ? `${worstMed.medication_name} at ${Math.round(worstRate * 100)}% vs other medications averaging ${Math.round(otherAvg * 100)}%${worstMed.priority === 'HIGH' ? ' (HIGH priority)' : ''}`
    : `All medications consistent (lowest: ${worstMed.medication_name} at ${Math.round(worstRate * 100)}%)`;

  return {
    active:       finalScore > 0.3,
    score:        parseFloat(finalScore.toFixed(3)),
    detail,
    driftingMed:  finalScore > 0.3 ? worstMed.medication_name : null,
    priority:     worstMed.priority,
    worstRate:    Math.round(worstRate * 100),
    otherMedsAvg: Math.round(otherAvg * 100),
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// SIGNAL 6 — Consecutive Missed Doses
// Detects 2+ consecutive days where a SPECIFIC TREATMENT was missed entirely.
// Grouped by treatment_id (not medication name) — a patient can have two
// different treatment courses of the same drug name at different dosages,
// and merging them by name would create false streaks across courses that
// were never actually continuous.
// ─────────────────────────────────────────────────────────────────────────────
async function detectConsecutiveMissedDoses(patientId) {
  const [rows] = await db.query(
    `SELECT t.id AS treatment_id, t.medication_name, t.priority,
            DATE(ms.scheduled_date_time) AS dose_date,
            ms.status
     FROM medication_schedules ms
     JOIN treatments t ON ms.treatment_id = t.id
     WHERE ms.patient_id = ?
       AND ms.scheduled_date_time >= DATE_SUB(CURDATE(), INTERVAL 7 DAY)
       AND ms.scheduled_date_time <  CURDATE()
       AND t.is_active = 1
     ORDER BY t.id, ms.scheduled_date_time ASC`,
    [patientId]
  );

  if (rows.length === 0) return { active: false, score: 0, detail: 'Insufficient data', worstMed: null, maxStreak: 0 };

  // Group doses by treatment (not name) and day
  const medGroups = {};
  for (const row of rows) {
    const key = row.treatment_id;
    if (!medGroups[key]) medGroups[key] = { name: row.medication_name, priority: row.priority, days: {} };
    const day = String(row.dose_date).split('T')[0];
    if (!medGroups[key].days[day]) medGroups[key].days[day] = { total: 0, missed: 0 };
    medGroups[key].days[day].total++;
    if (row.status === 'MISSED') medGroups[key].days[day].missed++;
  }

  let maxStreak = 0;
  let worstMed  = null;
  let worstPriority = 'LOW';

  for (const med of Object.values(medGroups)) {
    const sortedDays = Object.keys(med.days).sort();
    let streak = 0;
    for (const day of sortedDays) {
      const d = med.days[day];
      if (d.missed === d.total) {
        streak++;
        if (streak > maxStreak || (streak === maxStreak && med.priority === 'HIGH')) {
          maxStreak     = streak;
          worstMed      = med.name;
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
// SIGNAL 7 — Critical (HIGH-priority) Medication Missed
// The medical-safety signal: missing a HIGH-priority medication is dangerous
// on its own, independent of any broader statistical pattern. This is the
// signal that forces a hard floor on the overall risk score below — and it's
// the reason the patient app and caregiver assessment can never disagree
// about a missed critical dose: both read this exact same computation.
// ─────────────────────────────────────────────────────────────────────────────
async function detectCriticalMedicationMissed(patientId) {
  const [rows] = await db.query(
    `SELECT t.medication_name, COUNT(*) AS missed_count
     FROM medication_schedules ms
     JOIN treatments t ON ms.treatment_id = t.id
     WHERE ms.patient_id = ?
       AND ms.status = 'MISSED'
       AND t.priority = 'HIGH'
       AND ms.scheduled_date_time >= DATE_SUB(CURDATE(), INTERVAL 7 DAY)
       AND ms.scheduled_date_time <  CURDATE()
     GROUP BY t.medication_name
     ORDER BY missed_count DESC`,
    [patientId]
  );

  if (rows.length === 0) {
    return { active: false, score: 0, detail: 'No high-priority medications missed this week', missedMeds: [], totalMissed: 0 };
  }

  const totalMissed = rows.reduce((sum, r) => sum + r.missed_count, 0);

  let score;
  if      (totalMissed >= 3) score = 1.0;
  else if (totalMissed === 2) score = 0.75;
  else                         score = 0.5;

  const names = rows.map(r => r.medication_name).join(', ');
  const detail = `High-priority medication${rows.length > 1 ? 's' : ''} missed: ${names} (${totalMissed} dose${totalMissed > 1 ? 's' : ''} this week)`;

  return {
    active: true,
    score:  parseFloat(score.toFixed(3)),
    detail,
    missedMeds: rows.map(r => r.medication_name),
    totalMissed,
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// FORECAST ENGINE
// ─────────────────────────────────────────────────────────────────────────────
async function analyzePatientSignals(patientId) {
  const [signal1, signal2, signal3, signal4, signal5, signal6, signal7, streakRows, baselineRows] = await Promise.all([
    detectResponseTimeDegradation(patientId),
    detectPartialDayAdherence(patientId),
    detectWeekendCliff(patientId),
    detectPostIllnessRecovery(patientId),
    detectSpecificMedDrift(patientId),
    detectConsecutiveMissedDoses(patientId),
    detectCriticalMedicationMissed(patientId),
    db.query(`SELECT current_streak FROM patient_streaks WHERE patient_id = ?`, [patientId]),
    db.query(
      `SELECT
         COUNT(*) AS total_scheduled,
         SUM(CASE WHEN status = 'TAKEN' THEN 1 ELSE 0 END) AS total_taken
       FROM medication_schedules
       WHERE patient_id = ?
         AND scheduled_date_time >= DATE_SUB(CURDATE(), INTERVAL 7 DAY)
         AND scheduled_date_time <  CURDATE()`,
      [patientId]
    ),
  ]);

  const currentStreak = streakRows[0]?.[0]?.current_streak || 0;

  const signals = {
    responseTimeDegradation:  signal1,
    partialDayAdherence:      signal2,
    weekendCliff:             signal3,
    postIllnessRecovery:      signal4,
    specificMedDrift:         signal5,
    consecutiveMissedDoses:   signal6,
    criticalMedicationMissed: signal7,
  };

  const rawScore =
    signal1.score * SIGNAL_WEIGHTS.responseTimeDegradation  +
    signal2.score * SIGNAL_WEIGHTS.partialDayAdherence      +
    signal3.score * SIGNAL_WEIGHTS.weekendCliff             +
    signal4.score * SIGNAL_WEIGHTS.postIllnessRecovery      +
    signal5.score * SIGNAL_WEIGHTS.specificMedDrift         +
    signal6.score * SIGNAL_WEIGHTS.consecutiveMissedDoses   +
    signal7.score * SIGNAL_WEIGHTS.criticalMedicationMissed;

  // Streak bonus: a long streak reduces the risk score (max 15% reduction at 30+ days)
  const streakBonus = Math.min(currentStreak / 30, 1.0) * 0.15;
  let forecastScore  = Math.max(parseFloat((rawScore - streakBonus).toFixed(3)), 0);

  const activeSignals = Object.entries(signals)
    .filter(([, s]) => s.active)
    .map(([key, s]) => ({ signal: key, detail: s.detail, score: s.score }));

  // ── Critical-medication hard floor ────────────────────────────────────────
  // Missing a HIGH-priority medication is a medical-safety concern, not just
  // a statistical one — it floors the score regardless of how the weighted
  // blend above came out, the same way it always has in this app.
  if (signal7.totalMissed >= 1) forecastScore = Math.max(forecastScore, RISK_LEVELS.MODERATE.min);
  if (signal7.totalMissed >= 2) forecastScore = Math.max(forecastScore, RISK_LEVELS.HIGH.min);
  if (signal7.totalMissed >= 3) forecastScore = Math.max(forecastScore, RISK_LEVELS.CRITICAL.min);

  let riskLevel = 'low';
  if      (forecastScore >= RISK_LEVELS.CRITICAL.min) riskLevel = 'critical';
  else if (forecastScore >= RISK_LEVELS.HIGH.min)     riskLevel = 'high';
  else if (forecastScore >= RISK_LEVELS.MODERATE.min) riskLevel = 'moderate';

  // ── Data-sufficiency guard ─────────────────────────────────────────────────
  // A patient with no scheduled doses this week (new enrollment, no active
  // treatments yet) has nothing to assess — don't let a 0/0 default read as
  // "0% adherence, moderate risk". Every detector above already returns
  // inactive/insufficient on its own when it lacks data, so the only thing
  // left to neutralize here is the baseline override below.
  const totalScheduled = baselineRows[0]?.[0]?.total_scheduled || 0;
  const totalTaken     = baselineRows[0]?.[0]?.total_taken || 0;
  const dataSufficient = totalScheduled >= MIN_SAMPLE;
  const overallRate    = totalScheduled > 0 ? totalTaken / totalScheduled : 0;

  // ── Baseline adherence override ───────────────────────────────────────────
  // Prevents "low risk" for patients who are simply and consistently
  // non-adherent across all dimensions (all signals score 0 because there is
  // no PATTERN change to detect — everything is uniformly bad). Only applies
  // when there's enough data to trust the rate in the first place.
  if (dataSufficient) {
    if (overallRate < 0.5 && riskLevel === 'low') {
      riskLevel = 'moderate';
      // Floor the numeric score to match the categorical bump — anything
      // reading forecastScore alone (e.g. the caregiver assessment) must
      // reach the exact same riskLevel, never a milder one.
      forecastScore = Math.max(forecastScore, RISK_LEVELS.MODERATE.min);
      activeSignals.push({
        signal: 'lowOverallAdherence',
        detail: `Overall adherence is ${Math.round(overallRate * 100)}% this week — below the 50% threshold`,
        score:  parseFloat((1 - overallRate).toFixed(3)),
      });
    }

    if (overallRate < 0.3 && (riskLevel === 'low' || riskLevel === 'moderate')) {
      riskLevel = 'high';
      forecastScore = Math.max(forecastScore, RISK_LEVELS.HIGH.min);
      const existing = activeSignals.find(s => s.signal === 'lowOverallAdherence');
      const detail = `Overall adherence is ${Math.round(overallRate * 100)}% this week — critically low`;
      if (!existing) {
        activeSignals.push({ signal: 'lowOverallAdherence', detail, score: parseFloat((1 - overallRate).toFixed(3)) });
      } else {
        existing.detail = detail;
      }
    }
  }
  // Note: when !dataSufficient we simply skip the overall-adherence-rate
  // override above (there's no trustworthy rate to act on) — but we do NOT
  // force riskLevel back down to 'low'. A handful of scheduled doses can
  // still contain a genuine missed critical-medication event, and that
  // signal's hard floor (applied earlier) must stand; silently clobbering it
  // here would be exactly the kind of self-contradiction this engine exists
  // to prevent.

  // Probability of missing a dose: blend of raw adherence gap and signal score
  const missProbability = dataSufficient
    ? parseFloat(Math.min(Math.max((1 - overallRate) * 0.6 + forecastScore * 0.4, 0), 1).toFixed(3))
    : 0;

  return {
    patientId,
    forecastScore:    parseFloat(forecastScore.toFixed(3)),
    missProbability,
    currentStreak,
    riskLevel,
    dataSufficient,
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

 for (const activeSignal of activeSignals) {
      const { signal } = activeSignal;

      // Dedup: skip if this intervention was sent in the last 24h
      const alreadySent = await _interventionSentRecently(patientId, signal);
      if (alreadySent) continue;

      // lowOverallAdherence lives only in activeSignals, not in `signals`
      const signalData = signals[signal] || activeSignal;
      const message = _buildInterventionMessage(signal, signalData, patient.name);
      if (!message) continue;

      // Send FCM push
      await FirebaseService.sendPushNotification(
        patient.fcm_token,
        message.title,
        message.body,
        { type: 'ai_insight', signal, risk_level: riskLevel },
        signal === 'criticalMedicationMissed' // only this one is high priority/urgent
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

    case 'criticalMedicationMissed': {
      const meds = (signalData.missedMeds || []).join(', ') || 'a critical medication';
      return {
        title: `🚨 Important: ${meds} missed`,
        body:  `Hi ${patientName}, ${meds} is a high-priority medication and you've missed ${signalData.totalMissed || 'a'} dose${(signalData.totalMissed || 0) > 1 ? 's' : ''} this week. Please take it as soon as possible and contact your doctor if you're having trouble.`,
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
     JOIN caregiver_assignment ca ON ca.patient_id = af.patient_id
                                  AND ca.status = 'ACTIVE'
     JOIN users cu ON cu.id = ca.caregiver_id AND cu.email = ? AND cu.role = 'caregiver'
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
  detectCriticalMedicationMissed,
};
