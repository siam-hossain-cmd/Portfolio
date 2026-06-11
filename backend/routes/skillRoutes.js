const express = require('express');
const router = express.Router();
const { db } = require('../config/firebase');
const { auth, authorize } = require('../middleware/auth');
const logAudit = require('../utils/auditLogger');

const skillsCollection = db.collection('skills');

// GET all skills (Public)
router.get('/', async (req, res, next) => {
    try {
        const snapshot = await skillsCollection.get();
        const skills = snapshot.docs.map(doc => ({
            _id: doc.id,
            ...doc.data()
        }));
        res.json(skills);
    } catch (err) {
        next(err);
    }
});

// POST a new skill (Admin)
router.post('/', auth, authorize(['Super Admin', 'Admin', 'Editor']), async (req, res, next) => {
    try {
        const skillData = {
            name: req.body.name || '',
            category: req.body.category || 'Frontend',
            icon: req.body.icon || '',
            experienceLevel: req.body.experienceLevel || 'Intermediate',
            yearsExperience: req.body.yearsExperience || 0,
            order: req.body.order || 0
        };
        const docRef = await skillsCollection.add(skillData);

        await logAudit(
            'CREATE_SKILL',
            `Added skill: ${skillData.name} (${docRef.id})`,
            req.admin.id,
            req.admin.username || 'admin'
        );

        res.status(201).json({ _id: docRef.id, ...skillData });
    } catch (err) {
        next(err);
    }
});

// PUT update a skill (Admin)
router.put('/:id', auth, authorize(['Super Admin', 'Admin', 'Editor']), async (req, res, next) => {
    try {
        const docRef = skillsCollection.doc(req.params.id);
        const doc = await docRef.get();
        if (!doc.exists) return res.status(404).json({ message: 'Skill not found' });

        const updatedData = { ...req.body, updatedAt: new Date() };
        await docRef.update(updatedData);

        await logAudit(
            'UPDATE_SKILL',
            `Updated skill: ${doc.data().name || req.params.id}`,
            req.admin.id,
            req.admin.username || 'admin'
        );

        res.json({ _id: req.params.id, ...doc.data(), ...updatedData });
    } catch (err) {
        next(err);
    }
});

// DELETE a skill (Admin only)
router.delete('/:id', auth, authorize(['Super Admin', 'Admin']), async (req, res, next) => {
    try {
        const docRef = skillsCollection.doc(req.params.id);
        const doc = await docRef.get();

        if (!doc.exists) {
            return res.status(404).json({ message: 'Skill not found' });
        }

        const skillName = doc.data().name;
        await docRef.delete();

        await logAudit(
            'DELETE_SKILL',
            `Deleted skill: ${skillName} (${req.params.id})`,
            req.admin.id,
            req.admin.username || 'admin'
        );

        res.json({ message: 'Skill deleted' });
    } catch (err) {
        next(err);
    }
});

module.exports = router;
