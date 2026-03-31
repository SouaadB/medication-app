require('dotenv').config();
const mysql = require('mysql2');

const pool = mysql.createPool({
    host: process.env.DB_HOST || '127.0.0.1',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '38018599',
    database: process.env.DB_NAME || 'medication_app',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
    timezone: '+01:00' // ← AJOUTER CETTE LIGNE (fuseau horaire Algérie UTC+1)
});

const promisePool = pool.promise();
module.exports = promisePool;