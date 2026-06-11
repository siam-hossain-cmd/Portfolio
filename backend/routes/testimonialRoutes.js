const express = require('express');
const router = express.Router();
const { db } = require('../config/firebase');
const { auth, authorize } = require('../middleware/auth');
const logAudit = require('../utils/auditLogger');

const collection = db.collection('testimonials');

// GET all testimonials (Public)
router.get('/', async (req, res, next) => {
    try {
        const snapshot = await collection.orderBy('createdAt', 'desc').get();
        const items = snapshot.docs.map(doc => ({ _id: doc.id, ...doc.data() }));
        res.json(items);
    } catch (err) {
        next(err);
    }
});

// POST create testimonial (Admin)
router.post('/', auth, authorize(['Super Admin', 'Admin', 'Editor']), async (req, res, next) => {
    try {
        const data = {
            name: req.body.name || '',
            position: req.body.position || '',
            company: req.body.company || '',
            content: req.body.content || '',
            image: req.body.image || '',
            rating: req.body.rating || 5,
            createdAt: new Date()
        };
        const docRef = await collection.add(data);
        await logAudit('CREATE_TESTIMONIAL', `Created testimonial from: ${data.name}`, req.admin.id, req.admin.username || 'admin');
        res.status(201).json({ _id: docRef.id, ...data });
    } catch (err) {
        next(err);
    }
});

// PUT update testimonial (Admin)
router.put('/:id', auth, authorize(['Super Admin', 'Admin', 'Editor']), async (req, res, next) => {
    try {
        const docRef = collection.doc(req.params.id);
        const doc = await docRef.get();
        if (!doc.exists) return res.status(404).json({ message: 'Testimonial not found' });

        const updatedData = { ...req.body, updatedAt: new Date() };
        await docRef.update(updatedData);
        await logAudit('UPDATE_TESTIMONIAL', `Updated testimonial from: ${doc.data().name || req.params.id}`, req.admin.id, req.admin.username || 'admin');
        res.json({ _id: req.params.id, ...doc.data(), ...updatedData });
    } catch (err) {
        next(err);
    }
});

// DELETE testimonial (Admin)
router.delete('/:id', auth, authorize(['Super Admin', 'Admin']), async (req, res, next) => {
    try {
        const docRef = collection.doc(req.params.id);
        const doc = await docRef.get();
        if (!doc.exists) return res.status(404).json({ message: 'Testimonial not found' });

        await docRef.delete();
        await logAudit('DELETE_TESTIMONIAL', `Deleted testimonial from: ${doc.data().name}`, req.admin.id, req.admin.username || 'admin');
        res.json({ message: 'Testimonial deleted' });
    } catch (err) {
        next(err);
    }
});

module.exports = router;
