const express = require('express');
const cors = require('cors');
const authRoutes = require('./routes/authRoutes');
const adminRoutes = require('./routes/adminRoutes'); // Add this

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes); // Add this

app.get('/', (req, res) => {
    res.json({ 
        message: 'Medication App API is running!', 
        version: '1.0.0',
        endpoints: {
            auth: ['/api/auth/register', '/api/auth/login', '/api/auth/me', '/api/auth/logout'],
            admin: ['/api/admin/patients', '/api/admin/statistics']
        }
    });
});

app.use((req, res) => {
    res.status(404).json({ success: false, message: 'Route not found' });
});

module.exports = app;