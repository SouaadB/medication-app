const db = require('../config/database');

/**
 * Search medications in the dictionary
 * GET /api/education/dictionary?query=...
 */
exports.searchDictionary = async (req, res) => {
    try {
        const { query } = req.query;
        let sql = 'SELECT * FROM medication_info';
        let params = [];

        if (query) {
            sql += ' WHERE name LIKE ? OR scientific_name LIKE ? OR category LIKE ?';
            const searchVal = `%${query}%`;
            params = [searchVal, searchVal, searchVal];
        }

        const [rows] = await db.execute(sql, params);
        
        // Parse JSON fields if necessary (like side_effects if stored as JSON)
        const medications = rows.map(row => ({
            ...row,
            side_effects: row.side_effects ? row.side_effects.split(',').map(s => s.trim()) : [],
            warnings: row.warnings ? row.warnings.split(',').map(s => s.trim()) : []
        }));

        res.json({
            success: true,
            count: medications.length,
            medications
        });
    } catch (error) {
        console.error('Search Dictionary Error:', error);
        res.status(500).json({ success: false, message: 'Error fetching medication dictionary' });
    }
};

/**
 * Get single medication detail
 * GET /api/education/dictionary/:id
 */
exports.getMedicationDetail = async (req, res) => {
    try {
        const { id } = req.params;
        const [rows] = await db.execute('SELECT * FROM medication_info WHERE id = ?', [id]);

        if (rows.length === 0) {
            return res.status(404).json({ success: false, message: 'Medication not found' });
        }

        const med = rows[0];
        res.json({
            success: true,
            medication: {
                ...med,
                side_effects: med.side_effects ? med.side_effects.split(',').map(s => s.trim()) : [],
                warnings: med.warnings ? med.warnings.split(',').map(s => s.trim()) : []
            }
        });
    } catch (error) {
        console.error('Get Medication Detail Error:', error);
        res.status(500).json({ success: false, message: 'Error fetching medication detail' });
    }
};
