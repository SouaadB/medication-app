// controllers/educationController.js
const db = require('../config/database');
const algerianMedications = require('../data/algerianMedications');

// ─────────────────────────────────────────────────────────────────────────────
// GET /api/education/dictionary?query=...
// ─────────────────────────────────────────────────────────────────────────────
exports.searchDictionary = async (req, res) => {
    try {
        const { query } = req.query;
        const patientId = req.user?.id;

        // ── Source 1: Built-in Algerian list ─────────────────
        let builtIn = algerianMedications;
        if (query && query.trim().length > 0) {
            const q = query.toLowerCase();
            builtIn = builtIn.filter(m =>
                m.name.toLowerCase().includes(q) ||
                m.scientific_name.toLowerCase().includes(q) ||
                (m.category || '').toLowerCase().includes(q)
            );
        }

        // ── Source 2: medication_info DB table ───────────────
        let dbMeds = [];
        try {
            let sql = 'SELECT * FROM medication_info';
            let params = [];
            if (query && query.trim().length > 0) {
                sql += ' WHERE name LIKE ? OR scientific_name LIKE ? OR category LIKE ?';
                const searchVal = `%${query}%`;
                params = [searchVal, searchVal, searchVal];
            }
            const [rows] = await db.execute(sql, params);

            dbMeds = rows
                .map(row => ({
                    ...row,
                    side_effects:   _parseList(row.side_effects),
                    warnings:       _parseList(row.warnings),
                    interactions:   _parseList(row.interactions),
                    algeria_brands: _parseList(row.algeria_brands),
                }))
                .filter(row =>
                    !builtIn.some(b => b.name.toLowerCase() === (row.name || '').toLowerCase())
                );
        } catch (dbErr) {
            console.warn('[educationController] medication_info error:', dbErr.message);
        }

        // ── Source 3: Patient's own treatments ───────────────
        let userMeds = [];
        if (patientId) {
            try {
                const [rows] = await db.execute(
                    `SELECT DISTINCT
                        t.medication_name as name,
                        t.dosage,
                        c.name as condition_name
                     FROM treatments t
                     LEFT JOIN chronic_conditions c ON t.condition_id = c.id
                     WHERE t.patient_id = ? AND t.is_active = 1
                     ORDER BY t.created_at DESC`,
                    [patientId]
                );

                userMeds = rows
                    .filter(r => {
                        if (!r.name) return false;
                        if (query && query.trim().length > 0) {
                            if (!r.name.toLowerCase().includes(query.toLowerCase())) return false;
                        }
                        const inBuiltIn = builtIn.some(b => b.name.toLowerCase() === r.name.toLowerCase());
                        const inDb      = dbMeds.some(b => (b.name || '').toLowerCase() === r.name.toLowerCase());
                        return !inBuiltIn && !inDb;
                    })
                    .map(r => ({
                        name:           r.name,
                        scientific_name:'',
                        category:       _guessCategory(r.condition_name),
                        emoji:          _guessEmoji(r.condition_name),
                        description:    `${r.name} is one of your prescribed medications${r.condition_name ? ` for ${r.condition_name}` : ''}. Ask your doctor or pharmacist for detailed information.`,
                        how_to_take:    r.dosage
                                          ? `Prescribed dosage: ${r.dosage}. Follow your doctor's instructions exactly.`
                                          : "Follow your doctor's instructions.",
                        side_effects:   ['Ask your pharmacist about possible side effects for this medication'],
                        warnings:       ['Always take as prescribed', 'Do not stop without consulting your doctor'],
                        interactions:   ['Ask your pharmacist about interactions with your other medications'],
                        algeria_brands: [r.name],
                        user_added:     true,
                    }));
            } catch (treatErr) {
                console.warn('[educationController] Error fetching user treatments:', treatErr.message);
            }
        }

        const allMedications = [...builtIn, ...dbMeds, ...userMeds];

        res.json({
            success: true,
            count: allMedications.length,
            medications: allMedications
        });

    } catch (error) {
        console.error('searchDictionary error:', error);
        res.status(500).json({ success: false, message: 'Error fetching medication dictionary' });
    }
};

// ─────────────────────────────────────────────────────────────────────────────
// GET /api/education/dictionary/:id
// ─────────────────────────────────────────────────────────────────────────────
exports.getMedicationDetail = async (req, res) => {
    try {
        const { id }    = req.params;
        const patientId = req.user?.id;
        const isNumeric = /^\d+$/.test(id);

        let foundMed = null;

        if (!isNumeric) {
            foundMed = algerianMedications.find(
                m => m.name.toLowerCase() === id.toLowerCase() ||
                     m.scientific_name.toLowerCase() === id.toLowerCase()
            );
        }

        if (!foundMed) {
            const [rows] = await db.execute(
                'SELECT * FROM medication_info WHERE id = ?',
                [id]
            );
            if (rows.length === 0) {
                return res.status(404).json({ success: false, message: 'Medication not found' });
            }
            const med = rows[0];
            foundMed = {
                ...med,
                side_effects:   _parseList(med.side_effects),
                warnings:       _parseList(med.warnings),
                interactions:   _parseList(med.interactions),
                algeria_brands: _parseList(med.algeria_brands),
            };
        }

        // Record view (non-blocking)
        if (patientId && foundMed) {
            _recordMedicationView(patientId, foundMed.name).catch(err =>
                console.warn('[educationController] view tracking error:', err.message)
            );
        }

        res.json({ success: true, medication: foundMed });

    } catch (error) {
        console.error('getMedicationDetail error:', error);
        res.status(500).json({ success: false, message: 'Error fetching medication detail' });
    }
};

// ─────────────────────────────────────────────────────────────────────────────
// POST /api/education/track-view
// Called by Flutter when the user opens a medication bottom sheet.
// This is needed because _showMedicationDetail() uses LOCAL data from the
// already-fetched list — it never calls GET /dictionary/:id, so we need
// a separate lightweight endpoint just for tracking the view.
//
// Body: { medication_name: "Glucophage" }
// ─────────────────────────────────────────────────────────────────────────────
exports.trackMedicationView = async (req, res) => {
    try {
        const patientId      = req.user?.id;
        const { medication_name } = req.body;

        if (!patientId) {
            return res.status(401).json({ success: false, message: 'Unauthorized' });
        }
        if (!medication_name || medication_name.trim() === '') {
            return res.status(400).json({ success: false, message: 'medication_name is required' });
        }

        await _recordMedicationView(patientId, medication_name.trim());

        // Return updated count so Flutter can show live progress if needed
        const [countRow] = await db.execute(
            `SELECT COUNT(DISTINCT medication_name) AS total
             FROM medication_views
             WHERE patient_id = ?`,
            [patientId]
        );

        res.json({
            success: true,
            distinct_meds_viewed: countRow[0].total || 0,
        });

    } catch (error) {
        console.error('trackMedicationView error:', error);
        res.status(500).json({ success: false, message: 'Error tracking medication view' });
    }
};

// ─────────────────────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Inserts one row per patient per medication per day.
 * Opening the same card 10 times in one day = 1 view.
 */
async function _recordMedicationView(patientId, medicationName) {
    if (!patientId || !medicationName) return;

    const [existing] = await db.execute(
        `SELECT id FROM medication_views
         WHERE patient_id      = ?
           AND medication_name = ?
           AND DATE(viewed_at) = CURDATE()
         LIMIT 1`,
        [patientId, medicationName]
    );

    if (existing.length === 0) {
        await db.execute(
            'INSERT INTO medication_views (patient_id, medication_name) VALUES (?, ?)',
            [patientId, medicationName]
        );
    }
}

function _parseList(value) {
    if (!value) return [];
    if (Array.isArray(value)) return value;
    try {
        const parsed = JSON.parse(value);
        if (Array.isArray(parsed)) return parsed;
    } catch (_) {}
    return value.split(',').map(s => s.trim()).filter(Boolean);
}

function _guessCategory(conditionName) {
    if (!conditionName) return 'Other';
    const c = conditionName.toLowerCase();
    if (c.includes('diabet'))                                       return 'Diabetes';
    if (c.includes('hypertension') || c.includes('blood pressure')) return 'Hypertension';
    if (c.includes('heart') || c.includes('cholesterol'))          return 'Heart';
    if (c.includes('thyroid'))                                      return 'Thyroid';
    if (c.includes('asthma') || c.includes('lung') || c.includes('copd')) return 'Respiratory';
    if (c.includes('pain') || c.includes('arthritis'))             return 'Pain';
    return 'Other';
}

function _guessEmoji(conditionName) {
    if (!conditionName) return '💊';
    const c = conditionName.toLowerCase();
    if (c.includes('diabet'))                               return '💉';
    if (c.includes('heart') || c.includes('hypertension')) return '❤️';
    if (c.includes('thyroid'))                              return '🦋';
    if (c.includes('asthma'))                               return '🫁';
    if (c.includes('pain'))                                 return '🩹';
    if (c.includes('cholesterol'))                          return '🩸';
    return '💊';
}

 
/**
 * GET /api/education/medications/names?query=xyz
 * Returns medication names + scientific names for autocomplete.
 * No auth needed — public endpoint.
 */
exports.getMedicationNames = async (req, res) => {
  try {
    const { query = '' } = req.query;
    const q = query.toLowerCase().trim();
 
    let results = algerianMedications;
 
    if (q.length >= 2) {
      results = algerianMedications.filter(m =>
        m.name.toLowerCase().includes(q) ||
        m.scientific_name.toLowerCase().includes(q)
      );
    }
 
    // Return name + scientific_name + category for richer suggestions
    const names = results.map(m => ({
      name:            m.name,
      scientific_name: m.scientific_name,
      category:        m.category,
      emoji:           m.emoji || '💊',
    }));
 
    // Sort: starts-with first, then contains
    names.sort((a, b) => {
      const aStarts = a.name.toLowerCase().startsWith(q);
      const bStarts = b.name.toLowerCase().startsWith(q);
      if (aStarts && !bStarts) return -1;
      if (!aStarts && bStarts) return 1;
      return a.name.localeCompare(b.name);
    });
 
    res.json({ success: true, medications: names.slice(0, 8) });
 
  } catch (error) {
    console.error('getMedicationNames error:', error);
    res.status(500).json({ success: false, message: 'Error fetching medication names' });
  }
};
