const db = require('../config/database');
const adherenceSignalService = require('./adherenceSignalService');

/**
 * ==============================================
 * DAY 2: PATIENT SITUATION ANALYZER (SQL) - FIXED
 * ==============================================
 * Narrative/contextual data only — NOT the risk-level decision itself.
 * Risk level is computed by adherenceSignalService and shared with the
 * patient app's early-warning system (see classifyRisk below) so the two
 * sides of the app can never contradict each other for the same patient.
 */

async function getPatientSituation(patientId) {
    try {
        // 1. Get adherence this week (last 7 days excluding today)
        const [thisWeek] = await db.execute(`
            SELECT
                COUNT(*) as total_doses,
                SUM(CASE WHEN status = 'TAKEN' THEN 1 ELSE 0 END) as taken_doses,
                ROUND(SUM(CASE WHEN status = 'TAKEN' THEN 1 ELSE 0 END) / COUNT(*) * 100, 1) as adherence
            FROM medication_schedules
            WHERE patient_id = ?
            AND scheduled_date_time >= DATE_SUB(CURDATE(), INTERVAL 7 DAY)
            AND scheduled_date_time < CURDATE()
        `, [patientId]);

        // 2. Get adherence last week (days 7-14 days ago)
        const [lastWeek] = await db.execute(`
            SELECT
                COUNT(*) as total_doses,
                SUM(CASE WHEN status = 'TAKEN' THEN 1 ELSE 0 END) as taken_doses,
                ROUND(SUM(CASE WHEN status = 'TAKEN' THEN 1 ELSE 0 END) / COUNT(*) * 100, 1) as adherence
            FROM medication_schedules
            WHERE patient_id = ?
            AND scheduled_date_time >= DATE_SUB(CURDATE(), INTERVAL 14 DAY)
            AND scheduled_date_time < DATE_SUB(CURDATE(), INTERVAL 7 DAY)
        `, [patientId]);

        // total_doses here is the RAW count (may be 0) — used only for the
        // data-sufficiency check. Display math below still needs a safe
        // divisor, kept separate so "no data" is never confused with "0%".
        const totalThisWeekRaw = thisWeek[0]?.total_doses || 0;
        const dataSufficient   = totalThisWeekRaw >= 3;

        const thisWeekAdherence = thisWeek[0]?.adherence || 0;
        const lastWeekAdherence = lastWeek[0]?.adherence || 0;
        const totalThisWeek = totalThisWeekRaw || 1;
        const takenThisWeek = thisWeek[0]?.taken_doses || 0;

        // 3. Get missed critical (HIGH-priority) medications, with their
        // medical category resolved from real data (medication_info /
        // chronic_conditions) instead of a hardcoded drug-name keyword list.
        const [criticalMissed] = await db.execute(`
            SELECT
                t.medication_name,
                COUNT(*) as missed_count,
                GROUP_CONCAT(DATE_FORMAT(ms.scheduled_date_time, '%Y-%m-%d')) as missed_dates,
                COALESCE(mi.category, cc.name) as category
            FROM medication_schedules ms
            JOIN treatments t ON ms.treatment_id = t.id
            LEFT JOIN medication_info mi ON mi.name = t.medication_name
            LEFT JOIN chronic_conditions cc ON cc.id = t.condition_id
            WHERE ms.patient_id = ?
            AND ms.status = 'MISSED'
            AND t.priority = 'HIGH'
            AND ms.scheduled_date_time >= DATE_SUB(CURDATE(), INTERVAL 7 DAY)
            AND ms.scheduled_date_time < CURDATE()
            GROUP BY t.medication_name, mi.category, cc.name
        `, [patientId]);

        // 4. Get all missed medications
        const [allMissed] = await db.execute(`
            SELECT
                t.medication_name,
                t.priority,
                COUNT(*) as missed_count
            FROM medication_schedules ms
            JOIN treatments t ON ms.treatment_id = t.id
            WHERE ms.patient_id = ?
            AND ms.status = 'MISSED'
            AND ms.scheduled_date_time >= DATE_SUB(CURDATE(), INTERVAL 7 DAY)
            AND ms.scheduled_date_time < CURDATE()
            GROUP BY t.medication_name, t.priority
            ORDER BY missed_count DESC
        `, [patientId]);

        // 5. Get most missed time slot
        const [missedTimeSlot] = await db.execute(`
            SELECT
                CASE
                    WHEN HOUR(scheduled_date_time) BETWEEN 5 AND 11 THEN 'Morning'
                    WHEN HOUR(scheduled_date_time) BETWEEN 12 AND 16 THEN 'Afternoon'
                    WHEN HOUR(scheduled_date_time) BETWEEN 17 AND 21 THEN 'Evening'
                    ELSE 'Night'
                END as time_slot,
                COUNT(*) as missed_count
            FROM medication_schedules
            WHERE patient_id = ?
            AND status = 'MISSED'
            AND scheduled_date_time >= DATE_SUB(CURDATE(), INTERVAL 7 DAY)
            AND scheduled_date_time < CURDATE()
            GROUP BY time_slot
            ORDER BY missed_count DESC
            LIMIT 1
        `, [patientId]);

        // 6. Calculate weekly trend using daily averages
        const [weeklyTrend] = await db.execute(`
            SELECT
                DATE(scheduled_date_time) as day,
                ROUND(SUM(CASE WHEN status = 'TAKEN' THEN 1 ELSE 0 END) / COUNT(*) * 100, 1) as adherence
            FROM medication_schedules
            WHERE patient_id = ?
            AND scheduled_date_time >= DATE_SUB(CURDATE(), INTERVAL 28 DAY)
            AND scheduled_date_time < CURDATE()
            GROUP BY DATE(scheduled_date_time)
            ORDER BY day ASC
        `, [patientId]);

        // Calculate trend (compare first week vs last week of 28-day period)
        let trend = 'stable';
        if (weeklyTrend.length >= 14) {
            const firstWeekDays = weeklyTrend.slice(0, 7);
            const lastWeekDays = weeklyTrend.slice(-7);

            const firstWeekAvg = firstWeekDays.reduce((sum, d) => sum + d.adherence, 0) / firstWeekDays.length;
            const lastWeekAvg = lastWeekDays.reduce((sum, d) => sum + d.adherence, 0) / lastWeekDays.length;

            if (lastWeekAvg < firstWeekAvg - 10) trend = 'declining';
            else if (lastWeekAvg > firstWeekAvg + 10) trend = 'improving';
        } else if (weeklyTrend.length >= 2) {
            // Fallback for less data
            const firstHalf = weeklyTrend.slice(0, Math.floor(weeklyTrend.length / 2));
            const secondHalf = weeklyTrend.slice(Math.floor(weeklyTrend.length / 2));
            const firstAvg = firstHalf.reduce((sum, d) => sum + d.adherence, 0) / firstHalf.length;
            const secondAvg = secondHalf.reduce((sum, d) => sum + d.adherence, 0) / secondHalf.length;

            if (secondAvg < firstAvg - 10) trend = 'declining';
            else if (secondAvg > firstAvg + 10) trend = 'improving';
        }

        const totalMissed = allMissed.reduce((sum, m) => sum + m.missed_count, 0);

        return {
            patient_id: patientId,
            data_sufficient: dataSufficient,
            this_week_adherence: thisWeekAdherence,
            last_week_adherence: lastWeekAdherence,
            adherence_change: thisWeekAdherence - lastWeekAdherence,
            missed_critical_meds: criticalMissed,
            all_missed_meds: allMissed,
            most_missed_time_slot: missedTimeSlot[0]?.time_slot || 'None',
            weekly_trend: trend,
            total_missed_this_week: totalMissed,
            total_scheduled_this_week: totalThisWeek,
            taken_this_week: takenThisWeek
        };
    } catch (error) {
        console.error('getPatientSituation error:', error);
        throw error;
    }
}

/**
 * ==============================================
 * DAY 3: MEDICAL RISK CLASSIFIER
 * ==============================================
 * Risk level is derived directly from adherenceSignalService's unified
 * forecast score — the SAME score and signals that drive the patient app's
 * early-warning system. The 5-level caregiver scale (good/low/moderate/
 * high/critical) is a strict refinement of the patient app's 4-level scale
 * (low/moderate/high/critical): 'good' and 'low' together exactly cover what
 * the patient app calls 'low'. This guarantees the two views can never
 * disagree — the caregiver app is never "more worried" or "less worried"
 * than the patient app's own signals say, just sometimes more specific.
 */

function classifyRisk(situation, signalResult) {
    const contributingFactors = [];

    // Skip straight to "not enough data" ONLY if the engine also found
    // nothing actionable. A handful of scheduled doses can still contain a
    // genuine missed critical-medication event — that must still surface
    // here exactly as it does on the patient side, never get silently
    // dropped just because the overall weekly volume was too low to trust
    // an adherence-rate calculation.
    if (!situation.data_sufficient && signalResult.activeSignals.length === 0) {
        return {
            riskLevel: 'good',
            contributingFactors: ['Not enough medication history yet this week to assess adherence'],
            criticalMeds: false,
            dataSufficient: false,
        };
    }

    const criticalMeds = situation.missed_critical_meds && situation.missed_critical_meds.length > 0;
    if (criticalMeds) {
        const criticalNames = situation.missed_critical_meds.map(m => m.medication_name).join(', ');
        contributingFactors.push(`Missed critical medication: ${criticalNames}`);
    }

    const score = signalResult.forecastScore;
    let riskLevel;
    if      (score >= 0.75) riskLevel = 'critical';
    else if (score >= 0.50) riskLevel = 'high';
    else if (score >= 0.25) riskLevel = 'moderate';
    else if (score >= 0.10) riskLevel = 'low';
    else                     riskLevel = 'good';

    // Narrative factors are sourced from the engine's own explanations, so
    // every factor listed here is something that actually contributed to the
    // risk level above — never a disconnected observation.
    for (const s of signalResult.activeSignals) {
        if (s.signal === 'criticalMedicationMissed') continue; // already added above with full med names
        contributingFactors.push(s.detail);
    }

    if (situation.weekly_trend === 'improving' && riskLevel !== 'good') {
        contributingFactors.push('Showing improving trend - encouraging!');
    }

    if (contributingFactors.length === 0) {
        contributingFactors.push(`Good adherence: ${situation.this_week_adherence}%`);
    }

    return {
        riskLevel,
        contributingFactors: contributingFactors.slice(0, 6),
        criticalMeds,
        dataSufficient: true,
    };
}

/**
 * ==============================================
 * DAY 4: ACTION RECOMMENDER ENGINE
 * ==============================================
 */

function _missedMatchesCategory(situation, keywords) {
    return situation.missed_critical_meds?.some(m =>
        keywords.some(k => (m.category || '').toLowerCase().includes(k))
    ) === true;
}

const ACTION_LIBRARY = {
    critical_meds_missed: {
        priority: 1,
        action: '📞 Immediate phone call required',
        reason: 'Critical medications have been missed. Patient may be at serious risk.',
        applicable: (risk) => risk.criticalMeds === true
    },
    critical_meds_multiple: {
        priority: 1,
        action: '🚨 Emergency contact recommended',
        reason: 'Multiple critical medication doses missed in the past week. Immediate intervention needed.',
        applicable: (risk, situation) => situation.missed_critical_meds &&
            situation.missed_critical_meds.some(m => m.missed_count >= 2)
    },
    very_low_adherence: {
        priority: 2,
        action: '🏥 Schedule urgent check-in call',
        reason: 'Adherence is below 50%. Patient needs immediate intervention.',
        applicable: (risk, situation) => situation.data_sufficient && situation.this_week_adherence < 50
    },
    declining_trend: {
        priority: 3,
        action: '📊 Review medication routine together',
        reason: 'Adherence is declining. Something may have changed in patient\'s routine.',
        applicable: (risk, situation) => situation.weekly_trend === 'declining'
    },
    low_adherence: {
        priority: 4,
        action: '💬 Send reminder message via app',
        reason: 'Adherence is below target. A gentle reminder may help.',
        applicable: (risk, situation) => situation.data_sufficient && situation.this_week_adherence >= 50 && situation.this_week_adherence < 70
    },
    missed_time_slot: {
        priority: 5,
        action: (slot) => `⏰ Adjust ${slot?.toLowerCase() || 'medication'} reminder timing`,
        reason: (slot) => `Patient consistently misses ${slot?.toLowerCase() || 'medication'} doses. Consider reminder adjustment.`,
        applicable: (risk, situation) => situation.most_missed_time_slot !== 'None'
    },
    moderate_adherence: {
        priority: 6,
        action: '📱 Check if patient needs refill assistance',
        reason: 'Moderate adherence may indicate medication access issues.',
        applicable: (risk, situation) => situation.data_sufficient && situation.this_week_adherence >= 70 && situation.this_week_adherence < 85
    },
    improving_trend: {
        priority: 7,
        action: '👍 Send encouragement message',
        reason: 'Patient is showing improvement! Positive reinforcement helps maintain progress.',
        applicable: (risk, situation) => situation.weekly_trend === 'improving'
    },
    multiple_missed: {
        priority: 8,
        action: '📋 Help patient create medication schedule',
        reason: 'Multiple missed doses suggest organization difficulties.',
        applicable: (risk, situation) => situation.total_missed_this_week >= 5
    },
    good_adherence: {
        priority: 9,
        action: '✨ Acknowledge good adherence with positive message',
        reason: 'Patient is doing well. Recognition encourages continued compliance.',
        applicable: (risk, situation) => situation.data_sufficient && situation.this_week_adherence >= 85
    },
    weekend_check: {
        priority: 10,
        action: '📅 Weekend routine check-in',
        reason: 'Some patients struggle with weekend medication routines.',
        applicable: (risk, situation) => new Date().getDay() === 5 && situation.data_sufficient && situation.this_week_adherence < 80
    },
    diabetes_miss: {
        priority: 11,
        action: '🩸 Check blood sugar log',
        reason: 'Diabetes medication missed. Monitor for symptoms of hyperglycemia.',
        applicable: (risk, situation) => _missedMatchesCategory(situation, ['diabet'])
    },
    heart_meds_missed: {
        priority: 11,
        action: '❤️ Monitor blood pressure',
        reason: 'Heart/cardiovascular medication missed. Watch for dizziness or chest discomfort.',
        applicable: (risk, situation) => _missedMatchesCategory(situation, ['heart', 'cardio', 'hypertension', 'cholesterol', 'coronary'])
    },
    significant_drop: {
        priority: 12,
        action: '📉 Investigate reason for adherence drop',
        reason: 'Significant decrease from previous week. Something may have changed.',
        applicable: (risk, situation) => situation.adherence_change < -15
    },
    morning_misses: {
        priority: 13,
        action: '🌅 Set up morning alarm reminders',
        reason: 'Morning doses are frequently missed. Consider earlier reminders.',
        applicable: (risk, situation) => situation.most_missed_time_slot === 'Morning'
    },
    evening_misses: {
        priority: 13,
        action: '🌙 Evening routine check',
        reason: 'Evening doses are frequently missed. Review bedtime routine.',
        applicable: (risk, situation) => situation.most_missed_time_slot === 'Evening'
    },
    stable_good: {
        priority: 14,
        action: '✅ Continue current support level',
        reason: 'Patient maintaining good adherence. Keep up the good work!',
        applicable: (risk, situation) => situation.data_sufficient && situation.this_week_adherence >= 85 && situation.weekly_trend === 'stable'
    },
    insufficient_data: {
        priority: 1,
        action: '👀 Check in once treatments are active',
        reason: 'Not enough medication history yet this week to make a reliable assessment.',
        applicable: (risk) => risk.dataSufficient === false
    }
};

function recommendActions(risk, situation) {
    const actions = [];

    for (const [key, actionDef] of Object.entries(ACTION_LIBRARY)) {
        try {
            if (actionDef.applicable(risk, situation)) {
                let actionText = actionDef.action;
                let reasonText = actionDef.reason;

                if (typeof actionDef.action === 'function') {
                    actionText = actionDef.action(situation.most_missed_time_slot);
                    reasonText = actionDef.reason(situation.most_missed_time_slot);
                }

                actions.push({
                    priority: actionDef.priority,
                    action: actionText,
                    reason: reasonText,
                    category: key
                });
            }
        } catch (e) {
            // Skip actions that error
        }
    }

    return actions.sort((a, b) => a.priority - b.priority).slice(0, 7);
}

/**
 * ==============================================
 * DAY 5: NATURAL LANGUAGE REPORT GENERATOR
 * ==============================================
 */

function generateAssessmentText(risk, situation, patientName = 'Patient') {
    const riskEmojis = {
        good: '✅',
        low: '⚠️',
        moderate: '⚡',
        high: '🔴',
        critical: '🚨'
    };

    const riskTitles = {
        good: 'Good Adherence - Keep it up!',
        low: 'Minor Concerns - Monitor Closely',
        moderate: 'Concerning Pattern - Action Needed',
        high: 'Significant Issues - Urgent Attention',
        critical: 'CRITICAL - Immediate Action Required'
    };

    if (risk.dataSufficient === false) {
        return `📋 **Not enough data yet**\n\nThis patient doesn't have enough scheduled medication history in the past week to generate a reliable assessment. Check back once their treatment schedule is active.`;
    }

    let text = `${riskEmojis[risk.riskLevel]} **${riskTitles[risk.riskLevel]}**\n\n`;

    const adherencePercent = Math.round(situation.this_week_adherence);
    text += `**📊 Adherence Overview**\n`;
    text += `• This week: ${adherencePercent}% (${situation.taken_this_week}/${situation.total_scheduled_this_week} doses taken)\n`;

    if (situation.last_week_adherence > 0) {
        const change = situation.adherence_change;
        const trendIcon = change > 0 ? '📈' : change < 0 ? '📉' : '➡️';
        const trendText = change > 0 ? `improved by +${change}%` : change < 0 ? `decreased by ${Math.abs(change)}%` : 'no change';
        text += `• Compared to last week: ${trendIcon} Adherence ${trendText}\n`;
    }
    text += `\n`;

    if (situation.missed_critical_meds && situation.missed_critical_meds.length > 0) {
        text += `**⚠️ Critical Medication Alert**\n`;
        const criticalList = situation.missed_critical_meds
            .map(m => `• ${m.medication_name}${m.category ? ` (${m.category})` : ''}: missed ${m.missed_count} time${m.missed_count > 1 ? 's' : ''}`)
            .join('\n');
        text += `${criticalList}\n\n`;
    }

    if (situation.most_missed_time_slot !== 'None') {
        text += `**⏰ Pattern Detected**\n`;
        text += `• Most frequently misses ${situation.most_missed_time_slot.toLowerCase()} doses\n`;
        text += `• Consider adjusting reminders for this time\n\n`;
    }

    if (situation.weekly_trend === 'declining') {
        text += `**📉 Declining Trend**\n`;
        text += `• Adherence has been decreasing over the past 4 weeks\n`;
        text += `• This pattern requires attention\n\n`;
    } else if (situation.weekly_trend === 'improving') {
        text += `**📈 Improving Trend**\n`;
        text += `• Adherence is showing improvement!\n`;
        text += `• Positive reinforcement will help maintain this progress\n\n`;
    }

    if (risk.contributingFactors && risk.contributingFactors.length > 0) {
        text += `**🔍 Contributing Factors**\n`;
        const factors = risk.contributingFactors.slice(0, 4)
            .map(f => `• ${f}`)
            .join('\n');
        text += `${factors}\n\n`;
    }

    text += `**🎯 Summary Recommendation**\n`;
    if (risk.riskLevel === 'critical') {
        text += `This patient requires IMMEDIATE attention. Please contact them right away.`;
    } else if (risk.riskLevel === 'high') {
        text += `This patient needs prompt follow-up. Please reach out within 24-48 hours.`;
    } else if (risk.riskLevel === 'moderate') {
        text += `This patient would benefit from a check-in call this week.`;
    } else if (risk.riskLevel === 'low') {
        text += `Monitor this patient closely over the next week. A gentle reminder may help.`;
    } else {
        text += `Continue current support. The patient is managing their medications well.`;
    }

    return text;
}

/**
 * ==============================================
 * DAY 7: AUTO-GENERATION SUPPORT
 * ==============================================
 */

function needsRegeneration(createdAt) {
    if (!createdAt) return true;
    const sixHoursInMs = 6 * 60 * 60 * 1000;
    return (new Date() - new Date(createdAt)) > sixHoursInMs;
}

async function getOrGenerateAssessment(patientId, caregiverId) {
    try {
        const [existing] = await db.execute(
            `SELECT * FROM caregiver_assessments
             WHERE patient_id = ? AND caregiver_id = ?
             ORDER BY created_at DESC
             LIMIT 1`,
            [patientId, caregiverId]
        );

        const shouldGenerate = existing.length === 0 || needsRegeneration(existing[0].created_at);

        if (shouldGenerate) {
            console.log(`🔄 Auto-generating assessment for patient ${patientId}`);

            const situation = await getPatientSituation(patientId);
            const signalResult = await adherenceSignalService.analyzePatientSignals(patientId);
            const risk = classifyRisk(situation, signalResult);
            const actions = recommendActions(risk, situation);

            const [patient] = await db.execute('SELECT name FROM users WHERE id = ?', [patientId]);
            const assessmentText = generateAssessmentText(risk, situation, patient[0]?.name || 'Patient');

            const [result] = await db.execute(
                `INSERT INTO caregiver_assessments
                 (patient_id, caregiver_id, risk_level, situation_data, assessment_text, recommended_actions)
                 VALUES (?, ?, ?, ?, ?, ?)`,
                [
                    patientId,
                    caregiverId,
                    risk.riskLevel,
                    JSON.stringify({
                        adherence: situation.this_week_adherence,
                        trend: situation.weekly_trend,
                        missed_critical: situation.missed_critical_meds?.length || 0,
                        factors: risk.contributingFactors,
                        total_missed: situation.total_missed_this_week,
                        data_sufficient: situation.data_sufficient,
                        unified_forecast_score: signalResult.forecastScore,
                        unified_risk_level: signalResult.riskLevel,
                    }),
                    assessmentText,
                    JSON.stringify(actions)
                ]
            );

            return {
                id: result.insertId,
                risk_level: risk.riskLevel,
                assessment_text: assessmentText,
                recommended_actions: actions,
                situation_data: situation,
                contributing_factors: risk.contributingFactors,
                created_at: new Date()
            };
        }

        const assessment = existing[0];

        // SAFE JSON PARSING - Fixed!
        let recommendedActions = [];
        let situationData = {};

        try {
            recommendedActions = assessment.recommended_actions
                ? JSON.parse(assessment.recommended_actions)
                : [];
        } catch (e) {
            console.error('Error parsing recommended_actions:', e.message);
            recommendedActions = [];
        }

        try {
            situationData = assessment.situation_data
                ? JSON.parse(assessment.situation_data)
                : {};
        } catch (e) {
            console.error('Error parsing situation_data:', e.message);
            situationData = {};
        }

        return {
            id: assessment.id,
            risk_level: assessment.risk_level,
            assessment_text: assessment.assessment_text,
            recommended_actions: recommendedActions,
            situation_data: situationData,
            created_at: assessment.created_at
        };

    } catch (error) {
        console.error('getOrGenerateAssessment error:', error);
        // Return a fallback assessment instead of crashing
        return {
            id: null,
            risk_level: 'moderate',
            assessment_text: 'Unable to generate full assessment at this time. Please try again later.',
            recommended_actions: [
                {
                    priority: 1,
                    action: 'Check in with patient',
                    reason: 'Assessment data temporarily unavailable',
                    category: 'fallback'
                }
            ],
            situation_data: {},
            created_at: new Date()
        };
    }
}

module.exports = {
    getPatientSituation,
    classifyRisk,
    recommendActions,
    generateAssessmentText,
    needsRegeneration,
    getOrGenerateAssessment
};
