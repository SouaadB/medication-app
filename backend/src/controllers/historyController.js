const HistoryService = require('../services/historyService');

// Récupérer l'historique groupé
exports.getGroupedHistory = async (req, res) => {
    try {
        const patientId = req.user.id;
        const days = req.query.days || 30;
        
        console.log('📅 Requête historique - Patient:', patientId, 'Jours:', days);
        
        const history = await HistoryService.getGroupedHistory(patientId, days);
        
        console.log('✅ Historique renvoyé - Nombre de jours:', history.length);
        
        res.json({
            success: true,
            data: history
        });
    } catch (error) {
        console.error('Error in getGroupedHistory:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Erreur lors du chargement de l\'historique' 
        });
    }
};

// Récupérer l'historique pour une date spécifique
exports.getHistoryByDate = async (req, res) => {
    try {
        const patientId = req.user.id;
        const { date } = req.params;
        
        const history = await HistoryService.getHistoryByDate(patientId, date);
        
        res.json({
            success: true,
            data: history
        });
    } catch (error) {
        console.error('Error in getHistoryByDate:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Erreur lors du chargement de l\'historique' 
        });
    }
};

// Récupérer les statistiques d'observance
exports.getAdherenceStats = async (req, res) => {
    try {
        const patientId = req.user.id;
        const days = req.query.days || 30;
        
        const stats = await HistoryService.getAdherenceStats(patientId, days);
        
        res.json({
            success: true,
            data: stats
        });
    } catch (error) {
        console.error('Error in getAdherenceStats:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Erreur lors du chargement des statistiques' 
        });
    }
};

// Récupérer les tendances hebdomadaires
exports.getWeeklyTrends = async (req, res) => {
    try {
        const patientId = req.user.id;
        const weeks = req.query.weeks || 4;
        
        const trends = await HistoryService.getWeeklyTrends(patientId, weeks);
        
        res.json({
            success: true,
            data: trends
        });
    } catch (error) {
        console.error('Error in getWeeklyTrends:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Erreur lors du chargement des tendances' 
        });
    }
};

// Récupérer les médicaments les plus manqués
exports.getMostMissedMedications = async (req, res) => {
    try {
        const patientId = req.user.id;
        const limit = req.query.limit || 5;
        
        const missed = await HistoryService.getMostMissedMedications(patientId, limit);
        
        res.json({
            success: true,
            data: missed
        });
    } catch (error) {
        console.error('Error in getMostMissedMedications:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Erreur lors du chargement des médicaments manqués' 
        });
    }
};

// ─────────────────────────────────────────────────────────────────────────────

const db = require('../config/database');
const PDFDocument = require('pdfkit');

// ── COLORS ────────────────────────────────────────────────────────────────────
const BLUE   = '#1565C0';
const GREEN  = '#2E7D32';
const RED    = '#C62828';
const ORANGE = '#E65100';
const GREY   = '#757575';
const LIGHT  = '#F5F5F5';
const WHITE  = '#FFFFFF';
const DARK   = '#1A237E';

exports.exportPdf = async (req, res) => {
    try {
        const patientId = req.user.id;
        const months    = parseInt(req.query.months) || 3;

        // ── Fetch patient info ──────────────────────────────────────────────
        const [[patient]] = await db.execute(
       `SELECT u.name, u.email, u.phone 
         FROM patients p 
         JOIN users u ON p.id = u.id 
         WHERE p.id = ?`,
         [patientId]
          );

        // ── Fetch overall stats ─────────────────────────────────────────────
        const [[stats]] = await db.execute(`
            SELECT
                COUNT(*)                                                              AS total,
                SUM(CASE WHEN status = 'TAKEN'   THEN 1 ELSE 0 END)                  AS taken,
                SUM(CASE WHEN status = 'MISSED'  THEN 1 ELSE 0 END)                  AS missed,
                SUM(CASE WHEN status = 'SKIPPED' THEN 1 ELSE 0 END)                  AS skipped,
                ROUND(SUM(CASE WHEN status = 'TAKEN' THEN 1 ELSE 0 END)
                    / NULLIF(COUNT(*),0) * 100, 1)                                    AS adherence_rate
            FROM medication_schedules
            WHERE patient_id = ?
              AND DATE(scheduled_date_time) <= CURDATE()
              AND DATE(scheduled_date_time) >= DATE_SUB(CURDATE(), INTERVAL ? MONTH)
        `, [patientId, months]);

        // ── Fetch weekly trend ──────────────────────────────────────────────
        const [weeklyRows] = await db.execute(`
            SELECT
                DAYNAME(scheduled_date_time)                                         AS day_name,
                COUNT(*)                                                              AS total,
                SUM(CASE WHEN status = 'TAKEN' THEN 1 ELSE 0 END)                    AS taken,
                ROUND(SUM(CASE WHEN status='TAKEN' THEN 1 ELSE 0 END)
                    / NULLIF(COUNT(*),0)*100,1)                                       AS pct
            FROM medication_schedules
            WHERE patient_id = ?
              AND DATE(scheduled_date_time) <= CURDATE()
              AND DATE(scheduled_date_time) >= DATE_SUB(CURDATE(), INTERVAL ? MONTH)
            GROUP BY DAYNAME(scheduled_date_time), DAYOFWEEK(scheduled_date_time)
            ORDER BY DAYOFWEEK(scheduled_date_time)
        `, [patientId, months]);

        // ── Fetch most missed ───────────────────────────────────────────────
        const [missedRows] = await db.execute(`
            SELECT t.medication_name, t.dosage, c.name AS condition_name,
                   COUNT(*) AS missed_count
            FROM medication_schedules ms
            JOIN treatments t ON ms.treatment_id = t.id
            LEFT JOIN chronic_conditions c ON t.condition_id = c.id
            WHERE ms.patient_id = ? AND ms.status = 'MISSED'
              AND DATE(ms.scheduled_date_time) >= DATE_SUB(CURDATE(), INTERVAL ? MONTH)
            GROUP BY t.id, t.medication_name, t.dosage, c.name
            ORDER BY missed_count DESC LIMIT 10
        `, [patientId, months]);

        // ── Fetch monthly breakdown ─────────────────────────────────────────
        const [monthlyRows] = await db.execute(`
            SELECT
                DATE_FORMAT(scheduled_date_time, '%Y-%m')                            AS month,
                COUNT(*)                                                              AS total,
                SUM(CASE WHEN status = 'TAKEN'   THEN 1 ELSE 0 END)                  AS taken,
                SUM(CASE WHEN status = 'MISSED'  THEN 1 ELSE 0 END)                  AS missed,
                ROUND(SUM(CASE WHEN status='TAKEN' THEN 1 ELSE 0 END)
                    / NULLIF(COUNT(*),0)*100,1)                                       AS pct
            FROM medication_schedules
            WHERE patient_id = ?
              AND DATE(scheduled_date_time) <= CURDATE()
              AND DATE(scheduled_date_time) >= DATE_SUB(CURDATE(), INTERVAL ? MONTH)
            GROUP BY DATE_FORMAT(scheduled_date_time, '%Y-%m')
            ORDER BY month DESC
        `, [patientId, months]);

        // ── Fetch individual dose log (what the history UI shows) ──────────
        const [doseRows] = await db.execute(`
            SELECT
                DATE(ms.scheduled_date_time)                       AS dose_date,
                DATE_FORMAT(ms.scheduled_date_time, '%H:%i')       AS scheduled_time,
                t.medication_name,
                t.dosage,
                ms.status,
                TIME_FORMAT(ms.taken_time, '%H:%i')                AS taken_time_str
            FROM medication_schedules ms
            JOIN treatments t ON ms.treatment_id = t.id
            WHERE ms.patient_id = ?
              AND ms.scheduled_date_time >= DATE_SUB(CURDATE(), INTERVAL ? MONTH)
              AND ms.scheduled_date_time <= NOW()
            ORDER BY ms.scheduled_date_time DESC
        `, [patientId, months]);

        // Group doses by date for display
        const dosesByDate = {};
        doseRows.forEach(row => {
            const d = String(row.dose_date).split('T')[0];
            if (!dosesByDate[d]) dosesByDate[d] = [];
            dosesByDate[d].push(row);
        });

        // ── Build PDF ───────────────────────────────────────────────────────
        const doc = new PDFDocument({ size: 'A4', margin: 50, bufferPages: true });

        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition',
            `attachment; filename="medication-report-${new Date().toISOString().split('T')[0]}.pdf"`);
        doc.pipe(res);

        const pageW  = doc.page.width;
        const margin = 50;
        const inner  = pageW - margin * 2;

        // ── helpers ─────────────────────────────────────────────────────────

        const adherencePct = parseFloat(stats?.adherence_rate || 0);
        const adherenceColor = adherencePct >= 80 ? GREEN : adherencePct >= 50 ? ORANGE : RED;

        function sectionTitle(text) {
            doc.moveDown(0.8);
            doc.rect(margin, doc.y, inner, 28).fill(BLUE);
            doc.fillColor(WHITE).fontSize(13).font('Helvetica-Bold')
               .text(text, margin + 12, doc.y - 22);
            doc.fillColor('#000000').moveDown(0.6);
        }

        function statBox(x, y, w, h, label, value, color) {
            doc.rect(x, y, w, h).fill(LIGHT);
            doc.rect(x, y, 4, h).fill(color);
            doc.fillColor(GREY).fontSize(9).font('Helvetica')
               .text(label, x + 12, y + 8, { width: w - 16 });
            doc.fillColor(color).fontSize(22).font('Helvetica-Bold')
               .text(value, x + 12, y + 22, { width: w - 16 });
            doc.fillColor('#000000');
        }

        function tableHeader(cols, y) {
            doc.rect(margin, y, inner, 22).fill(DARK);
            let x = margin;
            cols.forEach(({ label, width }) => {
                doc.fillColor(WHITE).fontSize(9).font('Helvetica-Bold')
                   .text(label, x + 4, y + 6, { width: width - 8, align: 'left' });
                x += width;
            });
            doc.fillColor('#000000');
            return y + 22;
        }

        function tableRow(cols, values, y, isEven) {
            if (doc.y > doc.page.height - 80) { doc.addPage(); y = margin; }
            const rowY = doc.y;
            doc.rect(margin, rowY, inner, 20).fill(isEven ? '#EEF2FF' : WHITE);
            let x = margin;
            cols.forEach(({ width }, i) => {
                const val = values[i] || '';
                const color = val === 'TAKEN' ? GREEN : val === 'MISSED' ? RED :
                              val === 'SKIPPED' ? ORANGE : '#333333';
                doc.fillColor(color).fontSize(9).font('Helvetica')
                   .text(String(val), x + 4, rowY + 5, { width: width - 8, align: 'left' });
                x += width;
            });
            doc.fillColor('#000000').moveDown(0);
            doc.y = rowY + 20;
            return doc.y;
        }

        // ── PAGE 1: HEADER ──────────────────────────────────────────────────

        // Blue gradient header bar
        doc.rect(0, 0, pageW, 100).fill(BLUE);
        doc.rect(0, 0, pageW, 100).fill(BLUE);

        // Heart icon area
        doc.circle(margin + 25, 50, 22).fill('#1E88E5');
        doc.fillColor(WHITE).fontSize(20).text('❤', margin + 13, 38);

        doc.fillColor(WHITE).fontSize(22).font('Helvetica-Bold')
           .text('MediCare', margin + 56, 28);
        doc.fontSize(11).font('Helvetica')
           .text('Medication Adherence Report', margin + 56, 52);

        // Date range badge
        const dateLabel = `Last ${months} months  ·  Generated ${new Date().toLocaleDateString('en-GB')}`;
        doc.fontSize(9).fillColor('#BBDEFB').text(dateLabel, margin + 56, 70);

        doc.y = 118;

        // Patient info card
        doc.rect(margin, doc.y, inner, 52).fill(LIGHT);
        doc.rect(margin, doc.y, 3, 52).fill(BLUE);
        const piY = doc.y + 10;
        doc.fillColor(DARK).fontSize(14).font('Helvetica-Bold')
           .text(patient?.name || 'Patient', margin + 16, piY);
        doc.fillColor(GREY).fontSize(9).font('Helvetica')
           .text([patient?.email, patient?.phone].filter(Boolean).join('   ·   '),
               margin + 16, piY + 20);
        doc.y += 62;

        // ── Stats row ───────────────────────────────────────────────────────
        doc.moveDown(0.4);
        const boxW = (inner - 12) / 4;
        const bY   = doc.y;
        statBox(margin,               bY, boxW, 68, 'Adherence Rate', `${adherencePct}%`, adherenceColor);
        statBox(margin + boxW + 4,    bY, boxW, 68, 'Doses Taken',    String(stats?.taken || 0), GREEN);
        statBox(margin + (boxW+4)*2,  bY, boxW, 68, 'Doses Missed',   String(stats?.missed || 0), RED);
        statBox(margin + (boxW+4)*3,  bY, boxW, 68, 'Total Doses',    String(stats?.total || 0), BLUE);
        doc.y = bY + 78;

        // ── Monthly breakdown ───────────────────────────────────────────────
        sectionTitle('Monthly Breakdown');

        const mCols = [
            { label: 'Month',     width: inner * 0.28 },
            { label: 'Total',     width: inner * 0.15 },
            { label: 'Taken',     width: inner * 0.15 },
            { label: 'Missed',    width: inner * 0.15 },
            { label: 'Adherence', width: inner * 0.27 },
        ];
        tableHeader(mCols, doc.y);
        doc.moveDown(0);
        monthlyRows.forEach((row, i) => {
            const pct = parseFloat(row.pct || 0);
            const bar = `${'|'.repeat(Math.round(pct / 10))}${'.'.repeat(10 - Math.round(pct / 10))} ${pct}%`;
            tableRow(mCols, [
                row.month, row.total, row.taken, row.missed, bar
            ], doc.y, i % 2 === 0);
        });

        // ── Weekly trends ───────────────────────────────────────────────────
        if (doc.y > 500) doc.addPage();
        sectionTitle('Performance by Day of Week');

        const wCols = [
            { label: 'Day',       width: inner * 0.25 },
            { label: 'Total',     width: inner * 0.15 },
            { label: 'Taken',     width: inner * 0.15 },
            { label: 'Adherence', width: inner * 0.45 },
        ];
        tableHeader(wCols, doc.y);
        doc.moveDown(0);
        weeklyRows.forEach((row, i) => {
            const pct = parseFloat(row.pct || 0);
           const bar = `${'|'.repeat(Math.round(pct / 10))}${'.'.repeat(10 - Math.round(pct / 10))} ${pct}%`;
            tableRow(wCols, [row.day_name, row.total, row.taken, bar], doc.y, i % 2 === 0);
        });

        // ── Most missed ─────────────────────────────────────────────────────
        if (missedRows.length > 0) {
            sectionTitle('Most Missed Medications');

            const mmCols = [
                { label: '#',          width: inner * 0.08 },
                { label: 'Medication', width: inner * 0.35 },
                { label: 'Condition',  width: inner * 0.30 },
                { label: 'Missed',     width: inner * 0.27 },
            ];
            tableHeader(mmCols, doc.y);
            doc.moveDown(0);
            missedRows.forEach((row, i) => {
                const name = `${row.medication_name}${row.dosage ? ' ' + row.dosage : ''}`;
                tableRow(mmCols, [
                    String(i + 1), name, row.condition_name || '—', String(row.missed_count) + ' times'
                ], doc.y, i % 2 === 0);
            });
        }

        // ── Detailed Dose Log (mirrors the history UI) ─────────────────────
        if (doseRows.length > 0) {
            doc.addPage();
            sectionTitle('Detailed Dose Log');

            const dCols = [
                { label: 'Medication',      width: inner * 0.35 },
                { label: 'Scheduled',       width: inner * 0.15 },
                { label: 'Status',          width: inner * 0.18 },
                { label: 'Taken at',        width: inner * 0.15 },
                { label: 'Dosage',          width: inner * 0.17 },
            ];

            const sortedDates = Object.keys(dosesByDate).sort((a, b) => b.localeCompare(a));
            for (const date of sortedDates) {
                // Date header row
                if (doc.y > doc.page.height - 100) doc.addPage();
                doc.rect(margin, doc.y, inner, 20).fill('#E3F2FD');
                doc.fillColor(BLUE).fontSize(10).font('Helvetica-Bold')
                   .text(new Date(date + 'T12:00:00').toLocaleDateString('en-GB', {
                       weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
                   }), margin + 8, doc.y - 15, { width: inner - 16 });
                doc.fillColor('#000000').moveDown(0);
                doc.y += 5;

                tableHeader(dCols, doc.y);
                doc.moveDown(0);

                dosesByDate[date].forEach((dose, i) => {
                    tableRow(dCols, [
                        dose.medication_name || '—',
                        dose.scheduled_time  || '—',
                        dose.status          || '—',
                        dose.taken_time_str  || '—',
                        dose.dosage          || '—',
                    ], doc.y, i % 2 === 0);
                });
                doc.moveDown(0.4);
            }
        }

        // ── Footer on all pages ─────────────────────────────────────────────
        const totalPages = doc.bufferedPageRange().count;
        for (let i = 0; i < totalPages; i++) {
            doc.switchToPage(i);
            doc.rect(0, doc.page.height - 36, pageW, 36).fill(DARK);
            doc.fillColor(WHITE).fontSize(8).font('Helvetica')
               .text('MediCare — Confidential Patient Report', margin, doc.page.height - 22,
                   { width: inner / 2 });
            doc.fillColor(WHITE).fontSize(8)
               .text(`Page ${i + 1} of ${totalPages}`, margin, doc.page.height - 22,
                   { width: inner, align: 'right' });
        }

        doc.end();

    } catch (error) {
        console.error('exportPdf error:', error);
        if (!res.headersSent) {
            res.status(500).json({ success: false, message: 'Error generating PDF report' });
        }
    }
};