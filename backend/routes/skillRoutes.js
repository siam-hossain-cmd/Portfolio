const express = require('express');
const router = express.Router();
const { db } = require('../config/firebase');

const skillsCollection = db.collection('skills');

// GET all skills
router.get('/', async (req, res) => {
    try {
        const snapshot = await skillsCollection.get();
        const skills = snapshot.docs.map(doc => ({
            _id: doc.id,
            ...doc.data()
        }));
        res.json(skills);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// POST a new skill
router.post('/', async (req, res) => {
    try {
        const skillData = { ...req.body };
        const docRef = await skillsCollection.add(skillData);
        res.status(201).json({ _id: docRef.id, ...skillData });
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

module.exports = router;
