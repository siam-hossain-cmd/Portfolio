const express = require('express');
const router = express.Router();
const { db } = require('../config/firebase');
const { auth, authorize } = require('../middleware/auth');
const logAudit = require('../utils/auditLogger');

const collection = db.collection('experience');

// GET all experiences (Public)
router.get('/', async (req, res, next) => {
    try {
        const snapshot = await collection.orderBy('order', 'asc').get();
        const items = snapshot.docs.map(doc => ({ _id: doc.id, ...doc.data() }));
        res.json(items);
    } catch (err) {
        next(err);
    }
});

// POST create experience (Admin)
router.post('/', auth, authorize(['Super Admin', 'Admin', 'Editor']), async (req, res, next) => {
    try {
        const data = {
            company: req.body.company || '',
            position: req.body.position || '',
            description: req.body.description || '',
            startDate: req.body.startDate || '',
            endDate: req.body.endDate || null,
            current: req.body.current || false,
            technologies: req.body.technologies || [],
            logo: req.body.logo || '',
            order: req.body.order || 0,
            createdAt: new Date()
        };
        const docRef = await collection.add(data);
        await logAudit('CREATE_EXPERIENCE', `Created experience: ${data.position} at ${data.company}`, req.admin.id, req.admin.username || 'admin');
        res.status(201).json({ _id: docRef.id, ...data });
    } catch (err) {
        next(err);
    }
});

// PUT update experience (Admin)
router.put('/:id', auth, authorize(['Super Admin', 'Admin', 'Editor']), async (req, res, next) => {
    try {
        const docRef = collection.doc(req.params.id);
        const doc = await docRef.get();
        if (!doc.exists) return res.status(404).json({ message: 'Experience not found' });

        const updatedData = { ...req.body, updatedAt: new Date() };
        await docRef.update(updatedData);
        await logAudit('UPDATE_EXPERIENCE', `Updated experience: ${doc.data().position || req.params.id}`, req.admin.id, req.admin.username || 'admin');
        res.json({ _id: req.params.id, ...doc.data(), ...updatedData });
    } catch (err) {
        next(err);
    }
});

// DELETE experience (Admin)
router.delete('/:id', auth, authorize(['Super Admin', 'Admin']), async (req, res, next) => {
    try {
        const docRef = collection.doc(req.params.id);
        const doc = await docRef.get();
        if (!doc.exists) return res.status(404).json({ message: 'Experience not found' });

        const title = `${doc.data().position} at ${doc.data().company}`;
        await docRef.delete();
        await logAudit('DELETE_EXPERIENCE', `Deleted experience: ${title}`, req.admin.id, req.admin.username || 'admin');
        res.json({ message: 'Experience deleted' });
    } catch (err) {
        next(err);
    }
});

module.exports = router;
