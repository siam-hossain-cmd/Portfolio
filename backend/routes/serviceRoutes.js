const express = require('express');
const router = express.Router();
const { db } = require('../config/firebase');
const { auth, authorize } = require('../middleware/auth');
const logAudit = require('../utils/auditLogger');

const collection = db.collection('services');

// GET all services (Public)
router.get('/', async (req, res, next) => {
    try {
        const snapshot = await collection.orderBy('order', 'asc').get();
        const items = snapshot.docs.map(doc => ({ _id: doc.id, ...doc.data() }));
        res.json(items);
    } catch (err) {
        next(err);
    }
});

// POST create service (Admin)
router.post('/', auth, authorize(['Super Admin', 'Admin', 'Editor']), async (req, res, next) => {
    try {
        const data = {
            title: req.body.title || '',
            description: req.body.description || '',
            icon: req.body.icon || 'Code2',
            features: req.body.features || [],
            order: req.body.order || 0,
            createdAt: new Date()
        };
        const docRef = await collection.add(data);
        await logAudit('CREATE_SERVICE', `Created service: ${data.title}`, req.admin.id, req.admin.username || 'admin');
        res.status(201).json({ _id: docRef.id, ...data });
    } catch (err) {
        next(err);
    }
});

// PUT update service (Admin)
router.put('/:id', auth, authorize(['Super Admin', 'Admin', 'Editor']), async (req, res, next) => {
    try {
        const docRef = collection.doc(req.params.id);
        const doc = await docRef.get();
        if (!doc.exists) return res.status(404).json({ message: 'Service not found' });

        const updatedData = { ...req.body, updatedAt: new Date() };
        await docRef.update(updatedData);
        await logAudit('UPDATE_SERVICE', `Updated service: ${doc.data().title || req.params.id}`, req.admin.id, req.admin.username || 'admin');
        res.json({ _id: req.params.id, ...doc.data(), ...updatedData });
    } catch (err) {
        next(err);
    }
});

// DELETE service (Admin)
router.delete('/:id', auth, authorize(['Super Admin', 'Admin']), async (req, res, next) => {
    try {
        const docRef = collection.doc(req.params.id);
        const doc = await docRef.get();
        if (!doc.exists) return res.status(404).json({ message: 'Service not found' });

        await docRef.delete();
        await logAudit('DELETE_SERVICE', `Deleted service: ${doc.data().title}`, req.admin.id, req.admin.username || 'admin');
        res.json({ message: 'Service deleted' });
    } catch (err) {
        next(err);
    }
});

module.exports = router;
