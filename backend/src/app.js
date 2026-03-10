const express = require('express');
const cors = require('cors');
const authRoutes = require('./routes/authRoutes');
const adminRoutes = require('./routes/adminRoutes');
const profileRoutes = require('./routes/profileRoutes');
const treatmentRoutes = require('./routes/treatmentRoutes');
const healthReviewRoutes = require('./routes/healthReviewRoutes'); // ADD THIS
const conditionsRoutes = require('./routes/conditionsRoutes'); // ADD THIS

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/treatments', treatmentRoutes);
app.use('/api/health-review', healthReviewRoutes); // ADD THIS
app.use('/api/conditions', conditionsRoutes); // ADD THIS

app.get('/', (req, res) => {
    res.json({ 
        message: 'Medication App API is running!', 
        version: '1.0.0',
        endpoints: {
            auth: ['/api/auth/register', '/api/auth/login', '/api/auth/me', '/api/auth/logout'],
            admin: ['/api/admin/patients', '/api/admin/statistics'],
            healthReview: ['/api/health-review/dashboard', '/api/health-review/emergency-contact'],
            conditions: ['/api/conditions', '/api/conditions/available', '/api/conditions/add', '/api/conditions/remove/:id'],
            treatments: ['/api/treatments', '/api/treatments/condition/:conditionId/add']
        }
    });
});

app.use((req, res) => {
    res.status(404).json({ success: false, message: 'Route not found' });
});

module.exports = app;