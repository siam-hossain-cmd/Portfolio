require('dotenv').config();
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const logger = require('./config/logger');
const errorHandler = require('./middleware/errorHandler');

// Initialize Firebase
require('./config/firebase');

const app = express();
const PORT = process.env.PORT || 5001;

// Setup Morgan HTTP logging to Winston stream
const morganStream = {
    write: (message) => logger.info(message.trim())
};
app.use(morgan(':remote-addr - :method :url :status :res[content-length] - :response-time ms', { stream: morganStream }));

// Middleware
const allowedOrigins = [
    'http://localhost:5173',  // Public portfolio frontend
    'http://localhost:5174',  // Admin panel frontend
    'http://localhost:3000',
    'https://www.siamhossain.me',
    'https://siamhossain.me',
    process.env.FRONTEND_URL,
    process.env.ADMIN_URL
].filter(Boolean);

app.use(cors({
    origin: function (origin, callback) {
        // Allow requests with no origin (mobile apps, curl, etc)
        if (!origin) return callback(null, true);
        
        // Dynamically allow any localhost port in development
        if (/^http:\/\/localhost(:\d+)?$/.test(origin)) {
            return callback(null, true);
        }

        if (allowedOrigins.includes(origin)) {
            return callback(null, true);
        }
        return callback(new Error('Not allowed by CORS'));
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'x-auth-token']
}));
app.use(express.json());

// Routes
const projectRoutes = require('./routes/projectRoutes');
const skillRoutes = require('./routes/skillRoutes');
const messageRoutes = require('./routes/messageRoutes');
const authRoutes = require('./routes/authRoutes');
const uploadRoutes = require('./routes/uploadRoutes');
const settingsRoutes = require('./routes/settingsRoutes');
const experienceRoutes = require('./routes/experienceRoutes');
const serviceRoutes = require('./routes/serviceRoutes');
const testimonialRoutes = require('./routes/testimonialRoutes');
const blogRoutes = require('./routes/blogRoutes');
const analyticsRoutes = require('./routes/analyticsRoutes');

// Public overview of audit logs (Admin only)
const { auth, authorize } = require('./middleware/auth');
app.get('/api/audit-logs', auth, authorize(['Super Admin']), async (req, res, next) => {
    try {
        const snapshot = await require('./config/firebase').db
            .collection('audit_logs')
            .orderBy('timestamp', 'desc')
            .limit(100)
            .get();
        const logs = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));
        res.json(logs);
    } catch (err) {
        next(err);
    }
});

app.use('/api/projects', projectRoutes);
app.use('/api/skills', skillRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/settings', settingsRoutes);
app.use('/api/experience', experienceRoutes);
app.use('/api/services', serviceRoutes);
app.use('/api/testimonials', testimonialRoutes);
app.use('/api/blogs', blogRoutes);
app.use('/api/analytics', analyticsRoutes);

// Health check
app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Main route
app.get('/', (req, res) => {
    res.send('Portfolio Backend API is running (Firebase - Enterprise)');
});

// Error handling middleware (Must be registered last)
app.use(errorHandler);

app.listen(PORT, () => {
    logger.info(`Server is running on port ${PORT}`);
});
