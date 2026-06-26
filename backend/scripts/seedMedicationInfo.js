/*
 * Full replace of medication_info from algerianMedications.js, which is the
 * single source of truth for medication reference data going forward.
 * Run after medication_info columns were converted to JSON and truncated:
 *   node backend/scripts/seedMedicationInfo.js
 */
require('dotenv').config({ path: require('path').join(__dirname, '..', '.env') });
const db = require('../src/config/database');
const medications = require('../src/data/algerianMedications');

async function main() {
    let inserted = 0;
    for (const m of medications) {
        await db.execute(
            `INSERT INTO medication_info
             (name, scientific_name, category, description, how_to_take, side_effects, warnings, interactions, algeria_brands, emoji, pharmnet)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [
                m.name,
                m.scientific_name || null,
                m.category || null,
                m.description || null,
                m.how_to_take || null,
                JSON.stringify(m.side_effects || []),
                JSON.stringify(m.warnings || []),
                JSON.stringify(m.interactions || []),
                JSON.stringify(m.algeria_brands || []),
                m.emoji || '💊',
                m.pharmnet ? JSON.stringify(m.pharmnet) : null,
            ]
        );
        inserted++;
    }
    console.log(`Inserted ${inserted} medication_info rows from algerianMedications.js`);
    process.exit(0);
}

main().catch(err => {
    console.error('seedMedicationInfo failed:', err);
    process.exit(1);
});
