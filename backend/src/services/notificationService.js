const db                           = require('../config/database');
const SchedulerService             = require('./schedulerService');
const ScheduleService              = require('./scheduleService');
const FirebaseService              = require('./firebaseService');
const CaregiverNotificationService = require('./caregiverNotificationService');

// ─────────────────────────────────────────────────────────────────────────────
// NOTIFICATION STAGE REFERENCE
// ─────────────────────────────────────────────────────────────────────────────
//
//  Every stage that can appear in notifications.data.stage, and what it means:
//
//  PREP            — heads-up before a standard dose (MEDIUM: 15min, HIGH: 30min)
//  MAIN            — it is time to take the dose right now
//  MAIN_HIGH       — same but critical/urgent wording for HIGH priority
//  FOLLOW_UP       — HIGH priority dose not yet taken, 15min overdue
//  MISSED          — dose not taken 30min after schedule (MEDIUM / interval)
//  ESCALATION      — HIGH priority dose 45min overdue, maximum urgency
//
//  BEDTIME_PREP    — 30min before bedtime, prepare sleeping medication
//  BEDTIME_MAIN    — exactly at bedtime, take sleeping medication now
//  BEDTIME_LATE    — 20min past bedtime, gentle final nudge
//
//  EMPTY_STOMACH_PREP  — 30min before empty-stomach dose time
//  SAFE_TO_EAT         — 60min after empty-stomach dose = breakfast time (informational)
//
//  BEFORE_MEAL_EARLY   — 10-15min before a before-meal dose (window opening)
//  BEFORE_MEAL_MAIN    — exactly at the before-meal dose time
//  BEFORE_MEAL_FOLLOWUP— HIGH only: ~10min after, still time if not eaten yet
//  INFORM_LATE         — window has fully passed, do NOT take now (informational)
//
// ─────────────────────────────────────────────────────────────────────────────
//
//  COMPLETE STAGE MATRIX BY (frequency_type × priority):
//
//  ┌──────────────────────┬────────────────────────────────────────────────────┐
//  │ Frequency            │ LOW        │ MEDIUM              │ HIGH             │
//  ├──────────────────────┼────────────┼─────────────────────┼──────────────────┤
//  │ Standard             │ MAIN       │ PREP→MAIN→MISSED    │ PREP→MAIN→       │
//  │                      │            │                     │ FOLLOW_UP→       │
//  │                      │            │                     │ ESCALATION       │
//  ├──────────────────────┼────────────┼─────────────────────┼──────────────────┤
//  │ Every Xh (interval)  │ MAIN→      │ MAIN→MISSED         │ MAIN→FOLLOW_UP→  │
//  │                      │ MISSED     │                     │ ESCALATION       │
//  ├──────────────────────┼────────────┼─────────────────────┼──────────────────┤
//  │ Before meal          │ MAIN only  │ BEFORE_MEAL_EARLY→  │ BEFORE_MEAL_EARLY│
//  │ (bkfst/lunch/dinner) │            │ BEFORE_MEAL_MAIN→   │ →BEFORE_MEAL_MAIN│
//  │                      │            │ INFORM_LATE         │ →BEFORE_MEAL_    │
//  │                      │            │                     │ FOLLOWUP→        │
//  │                      │            │                     │ INFORM_LATE      │
//  ├──────────────────────┼────────────┼─────────────────────┼──────────────────┤
//  │ During / After meal  │ MAIN       │ PREP→MAIN→MISSED    │ PREP→MAIN→       │
//  │                      │            │                     │ FOLLOW_UP→       │
//  │                      │            │                     │ ESCALATION       │
//  ├──────────────────────┼────────────┼─────────────────────┼──────────────────┤
//  │ Empty stomach        │ MAIN→      │ PREP→MAIN→          │ PREP→MAIN_HIGH→  │
//  │                      │ SAFE_TO_EAT│ SAFE_TO_EAT         │ SAFE_TO_EAT      │
//  ├──────────────────────┼────────────┼─────────────────────┼──────────────────┤
//  │ Bedtime / Before     │ BEDTIME_   │ BEDTIME_PREP→       │ BEDTIME_PREP→    │
//  │ sleeping             │ PREP→      │ BEDTIME_MAIN→       │ BEDTIME_MAIN→    │
//  │                      │ BEDTIME_   │ BEDTIME_LATE        │ BEDTIME_LATE→    │
//  │                      │ MAIN       │                     │ ESCALATION       │
//  └──────────────────────┴────────────┴─────────────────────┴──────────────────┘
//
//  Flutter _getStyle() handles every stage above explicitly.
//  markMissedDoses() (Job 2) skips: Before-meal, Bedtime, LOW priority.
// ─────────────────────────────────────────────────────────────────────────────

class NotificationService {

    // ─────────────────────────────────────────────────────────────────────────
    // CRUD
    // ─────────────────────────────────────────────────────────────────────────

    static async getAllNotifications(patientId, limit = 50) {
        try {
            const [rows] = await db.execute(
                `SELECT * FROM notifications WHERE patient_id = ? ORDER BY created_at DESC`,
                [patientId]
            );
            const limitedRows = rows.slice(0, limit);
            const unreadCount = rows.filter(n => !n.is_read).length;
            return { notifications: limitedRows, unreadCount };
        } catch (error) {
            console.error('Error in getAllNotifications:', error);
            throw error;
        }
    }

    static async getUnreadNotifications(patientId) {
        try {
            const [rows] = await db.execute(
                `SELECT * FROM notifications
                 WHERE patient_id = ? AND is_read = false
                 ORDER BY created_at DESC`,
                [patientId]
            );
            return rows;
        } catch (error) {
            console.error('Error in getUnreadNotifications:', error);
            throw error;
        }
    }

    static async markAsRead(notificationId) {
        try {
            const [result] = await db.execute(
                'UPDATE notifications SET is_read = true WHERE id = ?',
                [notificationId]
            );
            return result.affectedRows > 0;
        } catch (error) {
            console.error('Error in markAsRead:', error);
            throw error;
        }
    }

    static async markAllAsRead(patientId) {
        try {
            const [result] = await db.execute(
                `UPDATE notifications SET is_read = true
                 WHERE patient_id = ? AND is_read = false`,
                [patientId]
            );
            return result.affectedRows;
        } catch (error) {
            console.error('Error in markAllAsRead:', error);
            throw error;
        }
    }

    static async clearNotificationsByTreatment(treatmentId) {
        try {
            await db.execute(
                `DELETE FROM notifications WHERE JSON_EXTRACT(data, '$.treatment_id') = ?`,
                [treatmentId]
            );
        } catch (error) {
            console.error('Error in clearNotificationsByTreatment:', error);
        }
    }

    static async createNotification(patientId, type, title, message, data = {}) {
        try {
            const [result] = await db.execute(
                `INSERT INTO notifications (patient_id, type, title, message, data, scheduled_time)
                 VALUES (?, ?, ?, ?, ?, NOW())`,
                [patientId, type, title, message, JSON.stringify(data)]
            );
            return result.insertId;
        } catch (error) {
            console.error('Error in createNotification:', error);
            throw error;
        }
    }

    // ─────────────────────────────────────────────────────────────────────────
    // JOB 1 — SMART REMINDERS  (runs every minute)
    // ─────────────────────────────────────────────────────────────────────────

    static async generateSmartReminders() {
        try {
            const [doses] = await db.execute(`
                SELECT
                    ms.id                     AS schedule_id,
                    ms.patient_id,
                    ms.scheduled_date_time,
                    t.medication_name,
                    t.dosage,
                    t.frequency,
                    t.priority,
                    t.id                      AS treatment_id,
                    p.fcm_token,
                    p.quiet_hours_enabled,
                    p.quiet_hours_start,
                    p.quiet_hours_end,
                    p.quiet_hours_days,
                    p.critical_alerts_enabled,
                    p.medication_reminders,
                    p.all_notifications,
                    p.sound_enabled,
                    p.wake_time,
                    p.bedtime,
                    c.name                    AS condition_name
                FROM medication_schedules ms
                JOIN treatments t  ON ms.treatment_id = t.id
                JOIN patients   p  ON ms.patient_id   = p.id
                LEFT JOIN chronic_conditions c ON t.condition_id = c.id
                WHERE ms.status IN ('SCHEDULED', 'MISSED')
                AND DATE(ms.scheduled_date_time) = CURDATE()
                 AND ms.scheduled_date_time > DATE_SUB(NOW(), INTERVAL 90 MINUTE)
            `);

            let sent = 0;

            for (const dose of doses) {
                // ── Patient-level guards ──────────────────────────────────
                if (!dose.all_notifications || !dose.medication_reminders) continue;
                if (this._shouldSuppress(dose))        continue;
                if (!this._isWithinWakingHours(dose))  continue;

                // ── Timing ────────────────────────────────────────────────
                // diffMinutes > 0  → dose is in the future
                // diffMinutes < 0  → dose is overdue
                const now           = new Date();
                const scheduledTime = new Date(
                    (typeof dose.scheduled_date_time === 'string'
                        ? dose.scheduled_date_time
                        : dose.scheduled_date_time.toISOString()
                    ).replace(' ', 'T') + 'Z'
                );
                const diffMinutes = Math.round((scheduledTime - now) / 60000);

                // ── Cap non-HIGH at 3 notifications per dose per day ──────
                const todayCount = await this._countTodayNotificationsForDose(dose.schedule_id);
                if (todayCount >= 3 && dose.priority !== 'HIGH') continue;

                const stages = this._getNotificationStages(dose);

                for (const stage of stages) {
                    // Each stage fires in a strict 2-minute window to prevent
                    // repeated firing every minute
                    const withinWindow = diffMinutes <= stage.offset &&
                                         diffMinutes >  stage.offset - 2;
                    if (!withinWindow) continue;

                    // Deduplication: one notification per (schedule_id, stage) per 24h
                    if (await this._checkNotificationExists(dose.schedule_id, stage.type)) continue;

                    const template = this._getTemplate(dose, stage.template);
                    const isHigh   = dose.priority === 'HIGH';

                    await this.createNotification(
                        dose.patient_id,
                        'reminder',
                        template.title,
                        template.message,
                        {
                            schedule_id:         dose.schedule_id,
                            treatment_id:        dose.treatment_id,
                            stage:               stage.type,
                            priority:            dose.priority,
                            condition:           dose.condition_name || null,
                            scheduled_date_time: dose.scheduled_date_time,
                        }
                    );

                    if (dose.fcm_token) {
                        await FirebaseService.sendPushNotification(
                            dose.fcm_token,
                            template.title,
                            template.message,
                            {
                                schedule_id:  String(dose.schedule_id),
                                treatment_id: String(dose.treatment_id),
                                type:         'medication_reminder',
                                stage:        stage.type,
                                priority:     dose.priority || 'MEDIUM',
                            },
                            isHigh  // high-priority flag for FCM (wakes phone)
                        );
                    }

                    sent++;
                }
            }

            if (sent > 0) console.log(`[SmartReminders] ✅ ${sent} notifications sent`);
            return sent;

        } catch (error) {
            console.error('[SmartReminders] ❌', error);
            throw error;
        }
    }

    // ─────────────────────────────────────────────────────────────────────────
    // STAGE DEFINITIONS
    //
    // Rules:
    //   1. Frequency type is checked FIRST — it defines the medical context.
    //   2. Priority UPGRADES urgency WITHIN each frequency type.
    //   3. No frequency type silently drops priority — HIGH always escalates.
    // ─────────────────────────────────────────────────────────────────────────

    static _getNotificationStages(dose) {
        const priority = dose.priority || 'MEDIUM';
        const freq     = dose.frequency || '';

        // ── 1. BEDTIME / BEFORE SLEEPING ─────────────────────────────────────
        //
        //  SchedulerService stores scheduled_date_time = bedtime exactly.
        //  (Previously it stored bedtime-30, causing a double-offset.)
        //
        //  LOW    : PREP(+30) → MAIN(0)
        //           No BEDTIME_LATE — LOW priority sleeping meds don't warrant
        //           a late-night push that could wake the patient.
        //
        //  MEDIUM : PREP(+30) → MAIN(0) → BEDTIME_LATE(-20)
        //           Gentle nudge 20min after bedtime if not yet confirmed.
        //
        //  HIGH   : PREP(+30) → MAIN(0) → BEDTIME_LATE(-20) → ESCALATION(-45)
        //           Critical sleeping medication (e.g. anti-seizure) must escalate.
        if (freq.includes('Before sleeping') || freq.includes('Bedtime')) {
            if (priority === 'HIGH') return [
                { type: 'BEDTIME_PREP', offset:  30, template: 'BEDTIME_PREP'  },
                { type: 'BEDTIME_MAIN', offset:   0, template: 'BEDTIME_MAIN'  },
                { type: 'BEDTIME_LATE', offset: -20, template: 'BEDTIME_LATE'  },
                { type: 'ESCALATION',   offset: -45, template: 'ESCALATION'    },
            ];
            if (priority === 'MEDIUM') return [
                { type: 'BEDTIME_PREP', offset:  30, template: 'BEDTIME_PREP'  },
                { type: 'BEDTIME_MAIN', offset:   0, template: 'BEDTIME_MAIN'  },
                { type: 'BEDTIME_LATE', offset: -20, template: 'BEDTIME_LATE'  },
            ];
            // LOW
            return [
                { type: 'BEDTIME_PREP', offset: 30, template: 'BEDTIME_PREP' },
                { type: 'BEDTIME_MAIN', offset:  0, template: 'BEDTIME_MAIN' },
            ];
        }

        // ── 2. EMPTY STOMACH ─────────────────────────────────────────────────
        //
        //  scheduled_date_time = breakfast_time - 60 min.
        //  SAFE_TO_EAT fires 60min after the dose = exactly at breakfast time.
        //  This is informational — Flutter shows no action buttons for it.
        //
        //  Priority does NOT add ESCALATION here because missing an empty-stomach
        //  dose means the patient already ate — the window is gone, escalating
        //  would be confusing. HIGH just upgrades the MAIN wording.
        if (freq.includes('Empty stomach')) {
            // scheduled_date_time = wake_time + 20min (set by SchedulerService).
            // EMPTY_STOMACH_PREP fires 15min before dose = wake + 5min.
            // MAIN fires at dose time = wake + 20min.
            // SAFE_TO_EAT fires 40min after dose = exactly breakfast_time.
            // Example: wake=07:00, breakfast=08:00
            //   EMPTY_STOMACH_PREP: 07:05
            //   MAIN:               07:20
            //   SAFE_TO_EAT:        08:00
          return [
          { type: 'EMPTY_STOMACH_PREP',
           offset:   15, template: 'EMPTY_STOMACH_PREP' },
          { type:     priority === 'HIGH' ? 'MAIN_HIGH' : 'EMPTY_STOMACH_MAIN',
          offset:    0, template: priority === 'HIGH' ? 'MAIN_HIGH' : 'MAIN' },
          { type: 'SAFE_TO_EAT',
           offset:  -40, template: 'EMPTY_STOMACH_SAFE' },
         ];
        }

        // ── 3. BEFORE MEAL (breakfast / lunch / dinner) ───────────────────────
        //
        //  scheduled_date_time = meal_time - 30 min.
        //  These doses have a STRICT window — medically they must be taken
        //  BEFORE eating. Once the meal time arrives, "take it now" is wrong.
        //
        //  LOW    : BEFORE_MEAL_MAIN(0) only.
        //           Single reminder at dose time. No INFORM_LATE overhead for
        //           a low-importance medication.
        //
        //  MEDIUM : BEFORE_MEAL_EARLY(+10) → BEFORE_MEAL_MAIN(0) → INFORM_LATE(-20)
        //           INFORM_LATE at -20min fires when the patient is already eating.
        //           It says "window has passed" — never "take it now".
        //
        //  HIGH   : BEFORE_MEAL_EARLY(+15) → BEFORE_MEAL_MAIN(0) →
        //           BEFORE_MEAL_FOLLOWUP(-10) → INFORM_LATE(-20)
        //           FOLLOWUP at -10min fires just before meal starts, giving one
        //           last chance if the patient hasn't eaten yet.
        //           No ESCALATION — once the meal window is gone, it's gone.
        if (freq.includes('Before breakfast') ||
            freq.includes('Before lunch')     ||
            freq.includes('Before dinner')) {
            if (priority === 'HIGH') return [
                { type: 'BEFORE_MEAL_EARLY',    offset:  10, template: 'BEFORE_MEAL_EARLY_HIGH' },
                { type: 'BEFORE_MEAL_MAIN_HIGH',     offset:   0, template: 'BEFORE_MEAL_MAIN_HIGH'  },
                { type: 'BEFORE_MEAL_FOLLOWUP', offset: -10, template: 'BEFORE_MEAL_FOLLOWUP'   },
                { type: 'INFORM_LATE',          offset: -15, template: 'INFORM_LATE'             },
                // INFORM_LATE fires 15min after BEFORE_MEAL_MAIN (= meal time )
            ];
            if (priority === 'LOW') return [
                { type: 'BEFORE_MEAL_MAIN', offset: 0, template: 'BEFORE_MEAL_MAIN' },
            ];
            // MEDIUM
            return [
                { type: 'BEFORE_MEAL_EARLY', offset:  10, template: 'BEFORE_MEAL_EARLY' },
                { type: 'BEFORE_MEAL_MAIN',  offset:   0, template: 'BEFORE_MEAL_MAIN'  },
                { type: 'INFORM_LATE',       offset: -15, template: 'INFORM_LATE'        },
                // INFORM_LATE fires 15min after BEFORE_MEAL_MAIN (= meal time )
            ];
        }

        // ── 4. DURING MEAL / AFTER MEAL ───────────────────────────────────────
        //
        //  These have no timing sensitivity — taking with/after a meal has a
        //  flexible window. Standard priority stages apply.
        //  Falls through to section 6 (standard priority stages) below.

        // ── 5. INTERVAL DOSES (Every 4h / 6h / 8h / 12h) ────────────────────
        //
        //  No EARLY — the patient knows interval doses are ongoing.
        //  No ESCALATION for LOW — interval LOW doses are non-critical.
        //
        //  LOW    : MAIN(0) → MISSED(-30)
        //  MEDIUM : MAIN(0) → MISSED(-30)
        //  HIGH   : MAIN(0) → FOLLOW_UP(-15) → ESCALATION(-45)
        //           Missing a HIGH interval dose (e.g. every-6h antibiotic) is serious.
        if (freq.includes('Every')) {
            if (priority === 'HIGH') return [
                { type: 'MAIN_HIGH',       offset:   0, template: 'MAIN_HIGH'  },
                { type: 'FOLLOW_UP',  offset: -15, template: 'FOLLOW_UP'  },
                { type: 'ESCALATION', offset: -45, template: 'ESCALATION' },
            ];
            // LOW + MEDIUM
            return [
                { type: 'MAIN',   offset:   0, template: 'MAIN'   },
                { type: 'MISSED', offset: -25, template: 'MISSED' },
            ];
        }

        // ── 6. STANDARD DOSES (Once/Twice/Three/Four times daily + During/After meal)
        //
        //  LOW    : MAIN(0) only — minimal interruption
        //  MEDIUM : PREP(+15) → MAIN(0) → MISSED(-30)
        //  HIGH   : PREP(+30) → MAIN(0) → FOLLOW_UP(-15) → ESCALATION(-45)
        if (priority === 'HIGH') return [
            { type: 'PREP',       offset:  20, template: 'EARLY_HIGH' },
            { type: 'MAIN_HIGH',       offset:   0, template: 'MAIN_HIGH'  },
            { type: 'FOLLOW_UP',  offset: -15, template: 'FOLLOW_UP'  },
            { type: 'ESCALATION', offset: -45, template: 'ESCALATION' },
        ];

        if (priority === 'MEDIUM') return [
            { type: 'PREP',   offset:  15, template: 'EARLY'  },
            { type: 'MAIN',   offset:   0, template: 'MAIN'   },
            { type: 'MISSED', offset: -30, template: 'MISSED' },
        ];

        // LOW
        return [{ type: 'MAIN', offset: 0, template: 'MAIN' }];
    }

    // ─────────────────────────────────────────────────────────────────────────
    // TEMPLATE LIBRARY
    //
    // Every template key used in _getNotificationStages() must exist here.
    // ─────────────────────────────────────────────────────────────────────────

    static _getTemplate(dose, templateKey) {
        const name   = dose.medication_name;
        const dosage = dose.dosage ? ` ${dose.dosage}` : '';
        const rel    = this._getRelationText(dose.frequency);  // e.g. "before breakfast"
        const cond   = dose.condition_name ? ` (${dose.condition_name})` : '';
        const relStr = rel ? ` ${rel}` : '';

        const T = {

            // ── Standard ─────────────────────────────────────────────────────
            MAIN: {
                title:   '💊 Time to take your medication',
                message: `Take ${name}${dosage}${relStr}${cond}.`,
            },
            MAIN_HIGH: {
                title:   '⚠️ IMPORTANT — Critical medication',
                message: `Take ${name}${dosage}${relStr}${cond} NOW.`,
            },
            EARLY: {
                title:   '🕒 Medication reminder — 15 min',
                message: `${name}${dosage} is due in 15 minutes${relStr}.`,
            },
            EARLY_HIGH: {
                title:   '⏰ Critical medication — 20 min',
                message: `${name}${dosage} is due in 20 minutes. Prepare now.`,
            },
            FOLLOW_UP: {
                title:   '⚠️ Dose still pending',
                message: `Don't forget ${name}${dosage}${relStr}. Adherence is essential!`,
            },
            MISSED: {
                title:   '❗ Missed dose',
                message: `You have not taken ${name}${dosage} yet. Take it now if possible.`,
            },
            ESCALATION: {
                title:   '🚨 CRITICAL ALERT',
                message: `URGENT: ${name}${dosage} is overdue. Please confirm you have taken it immediately.`,
            },

            // ── Before meal ──────────────────────────────────────────────────
            //
            // rel will be "before breakfast" / "before lunch" / "before dinner"
            // so messages contextualise the meal automatically.
            BEFORE_MEAL_EARLY: {
                title:   `🕒 Take ${name} before your meal`,
                message: `${name}${dosage} must be taken ${rel}. You have about 10 minutes.`,
            },
            BEFORE_MEAL_EARLY_HIGH: {
                title:   `⏰ Critical: take ${name} before your meal`,
                message: `${name}${dosage} must be taken ${rel}. You have about 10 minutes — do not wait.`,
            },
            BEFORE_MEAL_MAIN: {
                title:   `💊 Take ${name} now — ${rel}`,
                message: `Time to take ${name}${dosage} ${rel}${cond}. Do this before eating.`,
            },
            BEFORE_MEAL_MAIN_HIGH: {
                title:   `⚠️ IMPORTANT: take ${name} now — ${rel}`,
                message: `Take ${name}${dosage} ${rel}${cond} NOW, before your meal.`,
            },
            BEFORE_MEAL_FOLLOWUP: {
                title:   `⚠️ ${name} — meal time approaching`,
                message: `${name}${dosage} should be taken ${rel}. Take it NOW if you haven't started eating.`,
            },
            INFORM_LATE: {
                title:   `ℹ️ ${name} — optimal window has passed`,
                message: `The window to take ${name}${dosage} ${rel} has passed. Do NOT take it now. Consult your doctor if this happens regularly.`,
            },

            // ── Bedtime ──────────────────────────────────────────────────────
            //
            // scheduled_date_time = bedtime itself (SchedulerService fix applied).
            BEDTIME_PREP: {
                title:   '🌙 Bedtime medication — 30 min',
                message: `Prepare ${name}${dosage} — take it in 30 minutes before sleeping.`,
            },
            BEDTIME_MAIN: {
                title:   '💤 Bedtime medication',
                message: `Time to take ${name}${dosage} before sleeping. Good night!`,
            },
            BEDTIME_LATE: {
                title:   '🌙 Still awake? Don\'t forget your medication',
                message: `${name}${dosage} should be taken before sleeping. Take it now if you haven't yet.`,
            },

            // ── Empty stomach ────────────────────────────────────────────────
            EMPTY_STOMACH_PREP: {
                title:   '🥣 Empty stomach medication — 15 min',
                message: `Prepare ${name}${dosage} — take it in 15 minutes on an empty stomach.`,
            },
            // SAFE_TO_EAT is purely informational.
            // Flutter _getStyle() shows NO action buttons for this stage.
            EMPTY_STOMACH_SAFE: {
                title:   '🍽️ You can eat now',
                message: `40 minutes have passed since ${name}${dosage}. You can have breakfast now.`,
            },
        };

        const tmpl = T[templateKey];
        if (!tmpl) {
            console.warn(`[Templates] Unknown key "${templateKey}", falling back to MAIN`);
            return T.MAIN;
        }
        return tmpl;
    }

    // ─────────────────────────────────────────────────────────────────────────
    // JOB 2 — MARK MISSED DOSES  (runs every 5 minutes)
    //
    // DB rule: a dose is MISSED when it is still SCHEDULED after 1 hour.
    //
    // Notification rule:
    //   ✅ Standard MEDIUM/HIGH doses → insert 'missed' notification
    //   ✅ HIGH interval doses        → already escalated by Job 1; still insert
    //      so the patient sees it in the Missed tab
    //   ❌ LOW                        → no missed notification, no pressure
    //   ❌ Before-meal                → INFORM_LATE from Job 1 already fired;
    //      "take it now" is medically wrong past the meal window
    //   ❌ Bedtime / Before sleeping  → BEDTIME_LATE from Job 1 already fired;
    //      it's now deep night, a missed push would wake the patient
    // ─────────────────────────────────────────────────────────────────────────

    static async markMissedDoses() {
        try {
            // Step 1 — flip DB status for all overdue SCHEDULED doses
            const [missedResult] = await db.execute(
                `UPDATE medication_schedules
                 SET status = 'MISSED'
                 WHERE status = 'SCHEDULED'
                 AND scheduled_date_time < DATE_SUB(NOW(), INTERVAL 1 HOUR)`
            );

            if (missedResult.affectedRows === 0) return 0;

            console.log(`[MarkMissed] ⏰ ${missedResult.affectedRows} doses flipped to MISSED`);

            // Step 2 — fetch newly missed doses that don't yet have a 'missed' notification
            const [missed] = await db.execute(`
                SELECT
                    ms.id       AS schedule_id,
                    ms.patient_id,
                    ms.scheduled_date_time,
                    t.medication_name,
                    t.dosage,
                    t.priority,
                    t.frequency,
                    p.fcm_token,
                    p.all_notifications,
                    p.medication_reminders
                FROM medication_schedules ms
                JOIN treatments t ON ms.treatment_id = t.id
                JOIN patients   p ON ms.patient_id   = p.id
                WHERE ms.status = 'MISSED'
                AND ms.scheduled_date_time BETWEEN DATE_SUB(NOW(), INTERVAL 2 HOUR) AND NOW()
                AND NOT EXISTS (
                    SELECT 1 FROM notifications n
                    WHERE n.patient_id = ms.patient_id
                    AND n.type = 'missed'
                    AND JSON_UNQUOTE(JSON_EXTRACT(n.data, '$.schedule_id')) = CAST(ms.id AS CHAR)
                )
            `);

            for (const dose of missed) {
                if (!dose.all_notifications || !dose.medication_reminders) continue;

                const freq = dose.frequency || '';

                // Skip: before-meal — INFORM_LATE already handled it
                if (freq.includes('Before breakfast') ||
                    freq.includes('Before lunch')     ||
                    freq.includes('Before dinner'))   continue;

                // Skip: bedtime — BEDTIME_LATE already handled it
                if (freq.includes('Before sleeping') ||
                    freq.includes('Bedtime'))         continue;

                // Skip: LOW priority — no missed pressure
                if (dose.priority === 'LOW') continue;

                const d       = new Date(dose.scheduled_date_time);
                const timeStr = `${String(d.getHours()).padStart(2,'0')}:${String(d.getMinutes()).padStart(2,'0')}`;

                const title   = '❌ Missed dose';
                const message = `You missed ${dose.medication_name}${dose.dosage ? ' ' + dose.dosage : ''} scheduled at ${timeStr}.`;

                await this.createNotification(
                    dose.patient_id,
                    'missed',
                    title,
                    message,
                    {
                        schedule_id:         dose.schedule_id,
                        scheduled_date_time: dose.scheduled_date_time,
                        can_take_now:        true,
                    }
                );

                if (dose.fcm_token) {
                    await FirebaseService.sendPushNotification(
                        dose.fcm_token,
                        title,
                        message,
                        {
                            schedule_id:  String(dose.schedule_id),
                            type:         'missed_dose',
                            can_take_now: 'true',
                        },
                        dose.priority === 'HIGH'
                    );
                }
            }

            return missedResult.affectedRows;

        } catch (error) {
            console.error('[MarkMissed] ❌', error);
            throw error;
        }
    }

    // ─────────────────────────────────────────────────────────────────────────
    // JOB 3 — ACHIEVEMENTS  (runs every 30 minutes)
    //
    // Streak milestones: 3, 7, 14, 30 days — each fires once per 30-day window.
    // Adherence milestone: ≥ 90% this week — fires once per 30-day window.
    // ─────────────────────────────────────────────────────────────────────────

    static async checkProgress(patientId) {
        try {
            const stats  = await SchedulerService.getAdherenceStats(patientId, 7);
            const streak = await ScheduleService.getCurrentStreak(patientId);

            const [[patient]] = await db.execute(
                'SELECT fcm_token, all_notifications FROM patients WHERE id = ?',
                [patientId]
            );

            let count = 0;

            // ── Streak milestones ─────────────────────────────────────────
            const streakMilestones = [
                { days: 3,  key: 'streak_3',  emoji: '🔥', label: '3 days in a row'  },
                { days: 7,  key: 'streak_7',  emoji: '⭐', label: '7 days in a row'  },
                { days: 14, key: 'streak_14', emoji: '🏅', label: '14 days in a row' },
                { days: 30, key: 'streak_30', emoji: '🏆', label: '30 days in a row' },
            ];

            for (const milestone of streakMilestones) {
                if (streak < milestone.days) continue;

                const exists = await this._notificationExists(patientId, 'achievement', milestone.key);
                if (exists) continue;

                const title   = `${milestone.emoji} ${milestone.label}!`;
                const message = `Congratulations! You have taken all your medications on time for ${milestone.days} consecutive days.`;

                await this.createNotification(
                    patientId, 'achievement', title, message,
                    { streak: milestone.days, [milestone.key]: true }
                );

                if (patient?.fcm_token && patient.all_notifications) {
                    await FirebaseService.sendPushNotification(
                        patient.fcm_token, title, message,
                        { type: 'achievement', streak: String(milestone.days) }
                    );
                }

                // Inform caregiver of streak milestone
                try {
                    await CaregiverNotificationService.sendMilestone(patientId, milestone.days);
                } catch (e) {
                    console.warn('[checkProgress] caregiver milestone error:', e.message);
                }

                count++;
            }

            // ── Adherence ≥ 90% ──────────────────────────────────────────
            if (stats && stats.adherenceRate >= 90) {
                const exists = await this._notificationExists(patientId, 'achievement', 'adherence_90');
                if (!exists) {
                    const title   = '🌟 Excellent adherence!';
                    const message = `You have ${stats.adherenceRate}% adherence this week. Keep it up!`;

                    await this.createNotification(
                        patientId, 'achievement', title, message,
                        { adherence: stats.adherenceRate, adherence_90: true }
                    );

                    if (patient?.fcm_token && patient.all_notifications) {
                        await FirebaseService.sendPushNotification(
                            patient.fcm_token, title, message,
                            { type: 'achievement', adherence: String(stats.adherenceRate) }
                        );
                    }

                    count++;
                }
            }

            return count;

        } catch (error) {
            console.error('[checkProgress] ❌', error);
            return 0;
        }
    }

    // ─────────────────────────────────────────────────────────────────────────
    // SUPPRESSION GUARDS
    // ─────────────────────────────────────────────────────────────────────────

    // Returns true if the notification should be silenced.
    static _shouldSuppress(dose) {
        // HIGH priority + critical_alerts_enabled → NEVER suppress under any condition
        if (dose.priority === 'HIGH') {
            const criticalEnabled =
                dose.critical_alerts_enabled === 1    ||
                dose.critical_alerts_enabled === true ||
                dose.critical_alerts_enabled == null; // default = enabled
            if (criticalEnabled) return false;
            // if patient explicitly disabled critical alerts, fall through to quiet-hours check
        }

        if (!dose.quiet_hours_enabled) return false;

        const now        = new Date();
        const currentDay = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'][now.getDay()];
        const nowMinutes = now.getHours() * 60 + now.getMinutes();

        let quietDays = [];
        try {
            quietDays = typeof dose.quiet_hours_days === 'string'
                ? JSON.parse(dose.quiet_hours_days)
                : (dose.quiet_hours_days || []);
        } catch (_) { quietDays = []; }

        // If specific days are set and today is not one of them → don't suppress
        if (quietDays.length > 0 && !quietDays.includes(currentDay)) return false;

        const parseMin = (t) => {
            if (!t) return 0;
            const [h, m] = t.toString().split(':');
            return parseInt(h) * 60 + parseInt(m || 0);
        };

        const qStart = parseMin(dose.quiet_hours_start) || 23 * 60;
        const qEnd   = parseMin(dose.quiet_hours_end)   ||  7 * 60;

        // Handles overnight quiet window (e.g. 23:00 → 07:00)
        if (qStart > qEnd) return nowMinutes >= qStart || nowMinutes < qEnd;
        return nowMinutes >= qStart && nowMinutes < qEnd;
    }

    // Returns false if the current time is outside the patient's waking hours.
    // HIGH priority always passes — it may need to wake the patient.
    static _isWithinWakingHours(dose) {
        if (dose.priority === 'HIGH') return true;

        const now        = new Date();
        const nowMinutes = now.getHours() * 60 + now.getMinutes();

        const parseMin = (t, fallback) => {
            if (!t) return fallback;
            const [h, m] = t.toString().split(':');
            return parseInt(h) * 60 + parseInt(m || 0);
        };

        const wake    = parseMin(dose.wake_time,  7 * 60);
        const bedtime = parseMin(dose.bedtime,    23 * 60);

        // Normal day (wake < bedtime): must be between wake and bedtime
        if (wake <= bedtime) return nowMinutes >= wake && nowMinutes < bedtime;

        // Overnight (e.g. wake 06:00, bedtime 01:00 next day)
        return nowMinutes >= wake || nowMinutes < bedtime;
    }

    // ─────────────────────────────────────────────────────────────────────────
    // PRIVATE HELPERS
    // ─────────────────────────────────────────────────────────────────────────

    static _getRelationText(freq) {
        if (!freq) return '';
        if (freq.includes('Before breakfast'))  return 'before breakfast';
        if (freq.includes('During breakfast'))  return 'with breakfast';
        if (freq.includes('After breakfast'))   return 'after breakfast';
        if (freq.includes('Before lunch'))      return 'before lunch';
        if (freq.includes('During lunch'))      return 'with lunch';
        if (freq.includes('After lunch'))       return 'after lunch';
        if (freq.includes('Before dinner'))     return 'before dinner';
        if (freq.includes('During dinner'))     return 'with dinner';
        if (freq.includes('After dinner'))      return 'after dinner';
        if (freq.includes('Before sleeping'))   return 'before sleeping';
        return '';
    }

    static async _countTodayNotificationsForDose(scheduleId) {
        try {
            const [rows] = await db.execute(
                `SELECT COUNT(*) AS cnt FROM notifications
                 WHERE JSON_UNQUOTE(JSON_EXTRACT(data, '$.schedule_id')) = ?
                 AND DATE(created_at) = CURDATE()`,
                [scheduleId.toString()]
            );
            return parseInt(rows[0]?.cnt || 0);
        } catch (_) { return 0; }
    }

    // Returns true if this (scheduleId, stageType) pair already fired in the last 24h
    static async _checkNotificationExists(scheduleId, stageType) {
        try {
            const [rows] = await db.execute(
                `SELECT 1 FROM notifications
                 WHERE JSON_UNQUOTE(JSON_EXTRACT(data, '$.schedule_id')) = ?
                 AND JSON_UNQUOTE(JSON_EXTRACT(data, '$.stage')) = ?
                 AND created_at > DATE_SUB(NOW(), INTERVAL 24 HOUR)`,
                [scheduleId.toString(), stageType]
            );
            return rows.length > 0;
        } catch (_) { return false; }
    }

    // Returns true if a notification with data.{key} exists for this patient in last 30 days
    static async _notificationExists(patientId, type, key) {
        try {
            const [rows] = await db.execute(
                `SELECT id FROM notifications
                 WHERE patient_id = ? AND type = ?
                 AND JSON_EXTRACT(data, '$.${key}') IS NOT NULL
                 AND created_at > DATE_SUB(NOW(), INTERVAL 30 DAY)`,
                [patientId, type]
            );
            return rows.length > 0;
        } catch (_) { return false; }
    }

    // Alias kept for backward compatibility
    static async generateReminders() {
        return this.generateSmartReminders();
    }
}

module.exports = NotificationService;