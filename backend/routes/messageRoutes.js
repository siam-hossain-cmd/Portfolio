const express = require('express');
const router = express.Router();
const { db } = require('../config/firebase');

const messagesCollection = db.collection('messages');

// POST a new message
router.post('/', async (req, res) => {
    try {
        const messageData = {
            ...req.body,
            createdAt: new Date()
        };
        const docRef = await messagesCollection.add(messageData);
        res.status(201).json({ _id: docRef.id, ...messageData });
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// GET all messages (Admin only)
router.get('/', async (req, res) => {
    try {
        const snapshot = await messagesCollection.orderBy('createdAt', 'desc').get();
        const messages = snapshot.docs.map(doc => ({
            _id: doc.id,
            ...doc.data()
        }));
        res.json(messages);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
