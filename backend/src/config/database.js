require('dotenv').config();
const mysql = require('mysql2');

const pool = mysql.createPool({
    host: process.env.DB_HOST || '127.0.0.1',
    port: process.env.DB_PORT || 3306,
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '38018599',
    database: process.env.DB_NAME || 'medication_app',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
    timezone:  '+01:00', // Use the machine's local timezone
    dateStrings: true,  // Critical: return dates as raw strings, NOT Date objects
    ssl: process.env.DB_CA_CERT
        ? { ca: process.env.DB_CA_CERT, rejectUnauthorized: true }
        : undefined,
});

const promisePool = pool.promise();
module.exports = promisePool;