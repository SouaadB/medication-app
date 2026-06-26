process.env.TZ = 'Africa/Algiers';  // Your existing line




const express = require('express');
const path = require('path');
const cors = require('cors');
const authRoutes = require('./routes/authRoutes');
const adminRoutes = require('./routes/adminRoutes');
const profileRoutes = require('./routes/profileRoutes');
const treatmentRoutes = require('./routes/treatmentRoutes');
const healthReviewRoutes = require('./routes/healthReviewRoutes');
const conditionsRoutes = require('./routes/conditionsRoutes');
const scheduleRoutes = require('./routes/scheduleRoutes');
const notificationRoutes = require('./routes/notificationRoutes');
const historyRoutes = require('./routes/historyRoutes');
const aiRoutes = require('./routes/aiRoutes');
const educationRoutes = require('./routes/educationRoutes');
const rewardsRoutes = require('./routes/rewardsRoutes');
const caregiverRoutes = require('./routes/caregiverRoutes');
const locationRoutes = require('./routes/locationRoutes');
const { startNotificationJobs } = require('./jobs/notificationJob');
const signalRoutes = require('./routes/signalRoutes');
const assessmentRoutes = require('./routes/assessmentRoutes');

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static(path.join(__dirname, '..', 'uploads')));

app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/treatments', treatmentRoutes);
app.use('/api/health-review', healthReviewRoutes);
app.use('/api/conditions', conditionsRoutes);
app.use('/api/schedule', scheduleRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/history', historyRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/education', educationRoutes);
app.use('/api/rewards', rewardsRoutes);
app.use('/api/caregivers', caregiverRoutes);
const chatRoutes = require('./routes/chatRoutes');
app.use('/api/chat', chatRoutes);
app.use('/api/location', locationRoutes);
app.use('/api/signals', signalRoutes);
app.use('/api/assessments', assessmentRoutes);

app.get('/', (req, res) => {
    res.json({ message: 'Medication App API is running!', version: '1.0.0' });
});


app.use((req, res) => {
    res.status(404).json({ success: false, message: 'Route not found' });
});

startNotificationJobs();


module.exports = app;