// controllers/educationController.js
const db = require('../config/database');
const algerianMedications = require('../data/algerianMedications');

// ─────────────────────────────────────────────────────────────
// GET /api/education/dictionary?query=...
// Merges 3 sources:
//   1. Built-in Algerian medications (algerianMedications.js)
//   2. Your existing medication_info DB table
//   3. Patient's own treatments (auto-added as "My med")
// ─────────────────────────────────────────────────────────────
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

        // ── Source 2: Your existing medication_info DB table ─
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
                    side_effects: _parseList(row.side_effects),
                    warnings:     _parseList(row.warnings),
                    interactions: _parseList(row.interactions),
                    algeria_brands: _parseList(row.algeria_brands),
                }))
                .filter(row => {
                    // Skip if already in built-in list (avoid duplicates)
                    return !builtIn.some(
                        b => b.name.toLowerCase() === (row.name || '').toLowerCase()
                    );
                });
        } catch (dbErr) {
            // If medication_info table doesn't exist yet, just skip it
            console.warn('[educationController] medication_info table not found or error:', dbErr.message);
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
                        // Skip if query doesn't match
                        if (query && query.trim().length > 0) {
                            if (!r.name.toLowerCase().includes(query.toLowerCase())) return false;
                        }
                        // Skip if already in built-in or DB list
                        const inBuiltIn = builtIn.some(b => b.name.toLowerCase() === r.name.toLowerCase());
                        const inDb = dbMeds.some(b => (b.name || '').toLowerCase() === r.name.toLowerCase());
                        return !inBuiltIn && !inDb;
                    })
                    .map(r => ({
                        name: r.name,
                        scientific_name: '',
                        category: _guessCategory(r.condition_name),
                        emoji: _guessEmoji(r.condition_name),
                        description: `${r.name} is one of your prescribed medications${r.condition_name ? ` for ${r.condition_name}` : ''}. Ask your doctor or pharmacist for detailed information.`,
                        how_to_take: r.dosage
                            ? `Prescribed dosage: ${r.dosage}. Follow your doctor's instructions exactly.`
                            : 'Follow your doctor\'s instructions.',
                        side_effects: ['Ask your pharmacist about possible side effects for this medication'],
                        warnings: ['Always take as prescribed', 'Do not stop without consulting your doctor'],
                        interactions: ['Ask your pharmacist about interactions with your other medications'],
                        algeria_brands: [r.name],
                        user_added: true,
                    }));
            } catch (treatErr) {
                console.warn('[educationController] Error fetching user treatments:', treatErr.message);
            }
        }

        // ── Combine all 3 sources ────────────────────────────
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

// ─────────────────────────────────────────────────────────────
// GET /api/education/dictionary/:id
// Kept for backward compatibility — checks built-in list first,
// then falls back to DB by id
// ─────────────────────────────────────────────────────────────
exports.getMedicationDetail = async (req, res) => {
    try {
        const { id } = req.params;

        // Check if id is a name (string) or numeric DB id
        const isNumeric = /^\d+$/.test(id);

        if (!isNumeric) {
            // Search built-in list by name
            const found = algerianMedications.find(
                m => m.name.toLowerCase() === id.toLowerCase() ||
                     m.scientific_name.toLowerCase() === id.toLowerCase()
            );
            if (found) return res.json({ success: true, medication: found });
        }

        // Fall back to DB
        const [rows] = await db.execute(
            'SELECT * FROM medication_info WHERE id = ?',
            [id]
        );

        if (rows.length === 0) {
            return res.status(404).json({ success: false, message: 'Medication not found' });
        }

        const med = rows[0];
        res.json({
            success: true,
            medication: {
                ...med,
                side_effects:   _parseList(med.side_effects),
                warnings:       _parseList(med.warnings),
                interactions:   _parseList(med.interactions),
                algeria_brands: _parseList(med.algeria_brands),
            }
        });

    } catch (error) {
        console.error('getMedicationDetail error:', error);
        res.status(500).json({ success: false, message: 'Error fetching medication detail' });
    }
};

// ─────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────

// Parse comma-separated string OR JSON array from DB
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
    if (c.includes('diabet')) return 'Diabetes';
    if (c.includes('hypertension') || c.includes('blood pressure')) return 'Hypertension';
    if (c.includes('heart') || c.includes('cholesterol')) return 'Heart';
    if (c.includes('thyroid')) return 'Thyroid';
    if (c.includes('asthma') || c.includes('lung') || c.includes('copd')) return 'Respiratory';
    if (c.includes('pain') || c.includes('arthritis')) return 'Pain';
    return 'Other';
}

function _guessEmoji(conditionName) {
    if (!conditionName) return '💊';
    const c = conditionName.toLowerCase();
    if (c.includes('diabet')) return '💉';
    if (c.includes('heart') || c.includes('hypertension')) return '❤️';
    if (c.includes('thyroid')) return '🦋';
    if (c.includes('asthma')) return '🫁';
    if (c.includes('pain')) return '🩹';
    if (c.includes('cholesterol')) return '🩸';
    return '💊';
}