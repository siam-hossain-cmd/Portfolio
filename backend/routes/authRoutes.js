const express = require('express');
const router = express.Router();
const { db } = require('../config/firebase');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const adminsCollection = db.collection('admins');

// Login
router.post('/login', async (req, res) => {
    const { username, password } = req.body;
    try {
        const snapshot = await adminsCollection.where('username', '==', username).limit(1).get();

        if (snapshot.empty) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        const adminDoc = snapshot.docs[0];
        const admin = { id: adminDoc.id, ...adminDoc.data() };

        const isMatch = await bcrypt.compare(password, admin.password);
        if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

        const token = jwt.sign({ id: admin.id }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.json({ token });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Setup Initial Admin (Run once)
router.post('/setup', async (req, res) => {
    const { username, password } = req.body;
    try {
        const snapshot = await adminsCollection.where('username', '==', username).limit(1).get();

        if (!snapshot.empty) {
            return res.status(400).json({ message: 'Admin already exists' });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        await adminsCollection.add({
            username,
            password: hashedPassword,
            createdAt: new Date()
        });

        res.status(201).json({ message: 'Admin created successfully' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
