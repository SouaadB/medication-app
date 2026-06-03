const db = require('./src/config/database');

async function test() {
  try {
    const [rows] = await db.query('SELECT 1');
    console.log('✅ Database connected successfully');
  } catch (err) {
    console.error('❌ DB connection failed:', err.message);
  }
}

test();