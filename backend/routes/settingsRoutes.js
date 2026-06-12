const express = require('express');
const router = express.Router();
const { db } = require('../config/firebase');
const { auth, authorize } = require('../middleware/auth');
const logAudit = require('../utils/auditLogger');

const SETTINGS_DOC = 'admin';

// GET public settings (Public)
router.get('/', async (req, res, next) => {
    try {
        const doc = await db.collection('settings').doc(SETTINGS_DOC).get();
        if (!doc.exists) {
            // Return default settings structure
            return res.json({
                personalInfo: { name: 'Siam Hossain', title: 'Full-Stack Developer', bio: '', profileImage: '', roles: ['Full-Stack Developer', 'Flutter Developer'] },
                socialLinks: { github: '', linkedin: '', twitter: '', website: '', whatsapp: '', email: '', facebook: '' },
                resumeUrl: '',
                seo: { siteTitle: 'Siam Hossain — Portfolio', siteDescription: '', ogImage: '', keywords: '' },
                contactInfo: { email: '', phone: '', location: '', availability: 'Available for freelance' },
                heroContent: { greeting: "Hi, I'm", subtitle: 'I build things for the web', description: '', ctaText: 'See My Work' },
                stats: { projectsCompleted: 0, technologies: 0, yearsExperience: 0, clientsServed: 0 }
            });
        }
        res.json(doc.data());
    } catch (err) {
        next(err);
    }
});

// PUT update settings (Admin only)
router.put('/', auth, authorize(['Super Admin', 'Admin']), async (req, res, next) => {
    try {
        const updatedData = {
            ...req.body,
            updatedAt: new Date()
        };

        await db.collection('settings').doc(SETTINGS_DOC).set(updatedData, { merge: true });

        await logAudit(
            'UPDATE_SETTINGS',
            'Portfolio settings updated',
            req.admin.id,
            req.admin.username || 'admin'
        );

        const doc = await db.collection('settings').doc(SETTINGS_DOC).get();
        res.json(doc.data());
    } catch (err) {
        next(err);
    }
});

module.exports = router;
