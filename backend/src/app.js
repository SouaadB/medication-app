const express = require('express');
const cors = require('cors');
const authRoutes = require('./routes/authRoutes');
const adminRoutes = require('./routes/adminRoutes');
const profileRoutes = require('./routes/profileRoutes');
const treatmentRoutes = require('./routes/treatmentRoutes');
const healthReviewRoutes = require('./routes/healthReviewRoutes');
const conditionsRoutes = require('./routes/conditionsRoutes');
const scheduleRoutes = require('./routes/scheduleRoutes'); // NOUVEAU
const notificationRoutes = require('./routes/notificationRoutes'); // NOUVEAU
const historyRoutes = require('./routes/historyRoutes');
const aiRoutes = require('./routes/aiRoutes');
const educationRoutes = require('./routes/educationRoutes');
const rewardsRoutes = require('./routes/rewardsRoutes');
const caregiverRoutes = require('./routes/caregiverRoutes');

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/treatments', treatmentRoutes);
app.use('/api/health-review', healthReviewRoutes);
app.use('/api/conditions', conditionsRoutes);
app.use('/api/schedule', scheduleRoutes); // NOUVEAU
app.use('/api/notifications', notificationRoutes); // NOUVEAU
app.use('/api/history', historyRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/education', educationRoutes);
app.use('/api/rewards', rewardsRoutes);
app.use('/api/caregivers', caregiverRoutes);

app.get('/', (req, res) => {
    res.json({ 
        message: 'Medication App API is running!', 
        version: '1.0.0',
        endpoints: {
            auth: ['/api/auth/register', '/api/auth/login', '/api/auth/me', '/api/auth/logout'],
            admin: ['/api/admin/patients', '/api/admin/statistics'],
            healthReview: ['/api/health-review/dashboard'],
            conditions: ['/api/conditions', '/api/conditions/available', '/api/conditions/add', '/api/conditions/remove/:id'],
            treatments: ['/api/treatments', '/api/treatments/condition/:conditionId/add'],
            schedule: ['/api/schedule/today', '/api/schedule/date/:date', '/api/schedule/stats', '/api/schedule/take/:scheduleId'], // NOUVEAU
            notifications: ['/api/notifications', '/api/notifications/unread', '/api/notifications/read/:id', '/api/notifications/read-all'] // NOUVEAU
        }
    });
});

app.use((req, res) => {
    res.status(404).json({ success: false, message: 'Route not found' });
});

module.exports = app;