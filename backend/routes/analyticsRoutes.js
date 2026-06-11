const express = require('express');
const router = express.Router();
const { db } = require('../config/firebase');
const { auth, authorize } = require('../middleware/auth');
const rateLimit = require('express-rate-limit');

const collection = db.collection('analytics');

// Rate limiter for tracking (30 per minute per IP)
const trackLimiter = rateLimit({
    windowMs: 60 * 1000,
    max: 30,
    message: { message: 'Too many requests.' }
});

// POST track page view (Public, rate limited)
router.post('/track', trackLimiter, async (req, res, next) => {
    try {
        const data = {
            page: req.body.page || '/',
            referrer: req.body.referrer || '',
            userAgent: req.headers['user-agent'] || '',
            ip: req.ip,
            date: new Date().toISOString().split('T')[0], // YYYY-MM-DD
            createdAt: new Date()
        };
        await collection.add(data);
        res.json({ tracked: true });
    } catch (err) {
        next(err);
    }
});

// GET dashboard analytics (Admin only)
router.get('/dashboard', auth, authorize(['Super Admin', 'Admin']), async (req, res, next) => {
    try {
        // Get total views
        const totalSnapshot = await collection.get();
        const totalViews = totalSnapshot.size;

        // Get views by page
        const viewsByPage = {};
        totalSnapshot.docs.forEach(doc => {
            const page = doc.data().page || '/';
            viewsByPage[page] = (viewsByPage[page] || 0) + 1;
        });

        // Get last 30 days of views
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        const recentSnapshot = await collection
            .where('createdAt', '>=', thirtyDaysAgo)
            .orderBy('createdAt', 'desc')
            .get();

        const viewsByDay = {};
        recentSnapshot.docs.forEach(doc => {
            const date = doc.data().date || new Date(doc.data().createdAt._seconds * 1000).toISOString().split('T')[0];
            viewsByDay[date] = (viewsByDay[date] || 0) + 1;
        });

        // Get messages count
        const messagesSnapshot = await db.collection('messages').get();
        const totalMessages = messagesSnapshot.size;
        const newMessages = messagesSnapshot.docs.filter(d => (d.data().status || 'new') === 'new').length;

        // Get projects count
        const projectsSnapshot = await db.collection('projects').get();
        
        // Get skills count
        const skillsSnapshot = await db.collection('skills').get();

        res.json({
            totalViews,
            totalProjects: projectsSnapshot.size,
            totalSkills: skillsSnapshot.size,
            totalMessages,
            newMessages,
            viewsByPage,
            viewsByDay,
            recentViews: recentSnapshot.size
        });
    } catch (err) {
        next(err);
    }
});

module.exports = router;
