const express = require('express');
const router = express.Router();
const { db } = require('../config/firebase');
const { auth, authorize } = require('../middleware/auth');
const logAudit = require('../utils/auditLogger');
const rateLimit = require('express-rate-limit');

const messagesCollection = db.collection('messages');

// Public Contact Form submit rate limiter (10 messages per hour per IP)
const contactLimiter = rateLimit({
    windowMs: 60 * 60 * 1000, // 1 hour
    max: 10,
    message: { message: 'Too many messages sent. Please try again later.' }
});

// POST a new message (Public, rate limited)
router.post('/', contactLimiter, async (req, res, next) => {
    try {
        // Validate input
        const { name, email, message } = req.body;
        if (!name || !email || !message) {
            return res.status(400).json({ message: 'Name, email, and message are required.' });
        }
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            return res.status(400).json({ message: 'Invalid email format.' });
        }
        if (message.length > 5000) {
            return res.status(400).json({ message: 'Message too long (max 5000 characters).' });
        }

        const messageData = {
            name: name.trim(),
            email: email.trim().toLowerCase(),
            message: message.trim(),
            status: 'new',
            createdAt: new Date(),
            readAt: null
        };
        const docRef = await messagesCollection.add(messageData);
        res.status(201).json({ _id: docRef.id, ...messageData });
    } catch (err) {
        next(err);
    }
});

// GET all messages (Admin only)
router.get('/', auth, authorize(['Super Admin', 'Admin']), async (req, res, next) => {
    try {
        const snapshot = await messagesCollection.orderBy('createdAt', 'desc').get();
        const messages = snapshot.docs.map(doc => ({
            _id: doc.id,
            ...doc.data()
        }));
        res.json(messages);
    } catch (err) {
        next(err);
    }
});

// PUT update message status (Admin only)
router.put('/:id/status', auth, authorize(['Super Admin', 'Admin']), async (req, res, next) => {
    try {
        const docRef = messagesCollection.doc(req.params.id);
        const doc = await docRef.get();
        if (!doc.exists) return res.status(404).json({ message: 'Message not found' });

        const { status } = req.body; // 'new', 'read', 'replied'
        if (!['new', 'read', 'replied'].includes(status)) {
            return res.status(400).json({ message: 'Invalid status. Must be: new, read, or replied.' });
        }

        const updateData = { status };
        if (status === 'read' && !doc.data().readAt) {
            updateData.readAt = new Date();
        }

        await docRef.update(updateData);
        res.json({ _id: req.params.id, ...doc.data(), ...updateData });
    } catch (err) {
        next(err);
    }
});

// DELETE a message (Admin only)
router.delete('/:id', auth, authorize(['Super Admin', 'Admin']), async (req, res, next) => {
    try {
        const docRef = messagesCollection.doc(req.params.id);
        const doc = await docRef.get();

        if (!doc.exists) {
            return res.status(404).json({ message: 'Message not found' });
        }

        const senderName = doc.data().name || 'unknown';
        await docRef.delete();

        await logAudit(
            'DELETE_MESSAGE',
            `Deleted message from ${senderName} (${req.params.id})`,
            req.admin.id,
            req.admin.username || 'admin'
        );

        res.json({ message: 'Message deleted successfully' });
    } catch (err) {
        next(err);
    }
});

module.exports = router;
