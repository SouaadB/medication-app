const db = require('./src/config/database');

async function migrate() {
    try {
        console.log('Starting migration: Adding settings and schedule columns to patients table...');

        const columns = [
            'ADD COLUMN all_notifications BOOLEAN DEFAULT TRUE',
            'ADD COLUMN medication_reminders BOOLEAN DEFAULT TRUE',
            'ADD COLUMN adherence_alerts BOOLEAN DEFAULT TRUE',
            'ADD COLUMN smart_insights BOOLEAN DEFAULT TRUE',
            'ADD COLUMN sound_enabled BOOLEAN DEFAULT TRUE',
            'ADD COLUMN vibration_enabled BOOLEAN DEFAULT TRUE',
            'ADD COLUMN dark_mode BOOLEAN DEFAULT FALSE',
            'ADD COLUMN auto_refill_reminders BOOLEAN DEFAULT TRUE',
            'ADD COLUMN smart_scheduling_enabled BOOLEAN DEFAULT TRUE',
            'ADD COLUMN bedtime TIME DEFAULT "23:00"',
            'ADD COLUMN wake_time TIME DEFAULT "07:00"',
            'ADD COLUMN breakfast_time TIME DEFAULT "08:00"',
            'ADD COLUMN lunch_time TIME DEFAULT "12:30"',
            'ADD COLUMN dinner_time TIME DEFAULT "18:30"'
        ];

        for (const column of columns) {
            try {
                await db.execute(`ALTER TABLE patients ${column}`);
                console.log(`✅ Success: ${column}`);
            } catch (err) {
                // If the column already exists, ignore the error (ER_DUP_COLUMN_NAME is 1060)
                if (err.errno === 1060) {
                    console.log(`ℹ️ Info: Column already exists, skipping...`);
                } else {
                    console.error(`❌ Error adding column: ${err.message}`);
                }
            }
        }

        console.log('✅ Migration completed successfully');
        process.exit(0);
    } catch (err) {
        console.error('❌ Migration failed:', err.message);
        process.exit(1);
    }
}

migrate();
