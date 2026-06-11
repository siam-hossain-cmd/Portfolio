const express = require('express');
const router = express.Router();
const { db } = require('../config/firebase');
const { auth, authorize } = require('../middleware/auth');
const logAudit = require('../utils/auditLogger');

const collection = db.collection('blogs');

// Helper: generate slug from title
function generateSlug(title) {
    return title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '')
        .slice(0, 80);
}

// GET all published blogs (Public)
router.get('/', async (req, res, next) => {
    try {
        const isAdmin = req.header('x-auth-token') || req.header('Authorization');
        let query;
        if (isAdmin) {
            // Admin can see all blogs including drafts
            query = collection.orderBy('createdAt', 'desc');
        } else {
            query = collection.where('status', '==', 'published').orderBy('createdAt', 'desc');
        }
        const snapshot = await query.get();
        const items = snapshot.docs.map(doc => ({ _id: doc.id, ...doc.data() }));
        res.json(items);
    } catch (err) {
        next(err);
    }
});

// GET single blog by slug (Public)
router.get('/slug/:slug', async (req, res, next) => {
    try {
        const snapshot = await collection.where('slug', '==', req.params.slug).limit(1).get();
        if (snapshot.empty) return res.status(404).json({ message: 'Blog not found' });
        const doc = snapshot.docs[0];
        res.json({ _id: doc.id, ...doc.data() });
    } catch (err) {
        next(err);
    }
});

// POST create blog (Admin)
router.post('/', auth, authorize(['Super Admin', 'Admin', 'Editor']), async (req, res, next) => {
    try {
        const slug = req.body.slug || generateSlug(req.body.title || 'untitled');
        
        // Check slug uniqueness
        const existing = await collection.where('slug', '==', slug).limit(1).get();
        const finalSlug = existing.empty ? slug : `${slug}-${Date.now()}`;

        const data = {
            title: req.body.title || '',
            slug: finalSlug,
            content: req.body.content || '',
            excerpt: req.body.excerpt || '',
            coverImage: req.body.coverImage || '',
            tags: req.body.tags || [],
            status: req.body.status || 'draft',
            seoTitle: req.body.seoTitle || '',
            seoDescription: req.body.seoDescription || '',
            author: req.admin.username || 'admin',
            publishedAt: req.body.status === 'published' ? new Date() : null,
            createdAt: new Date()
        };
        const docRef = await collection.add(data);
        await logAudit('CREATE_BLOG', `Created blog: ${data.title}`, req.admin.id, req.admin.username || 'admin');
        res.status(201).json({ _id: docRef.id, ...data });
    } catch (err) {
        next(err);
    }
});

// PUT update blog (Admin)
router.put('/:id', auth, authorize(['Super Admin', 'Admin', 'Editor']), async (req, res, next) => {
    try {
        const docRef = collection.doc(req.params.id);
        const doc = await docRef.get();
        if (!doc.exists) return res.status(404).json({ message: 'Blog not found' });

        const updatedData = { ...req.body, updatedAt: new Date() };
        
        // If publishing for the first time, set publishedAt
        if (req.body.status === 'published' && doc.data().status !== 'published') {
            updatedData.publishedAt = new Date();
        }

        await docRef.update(updatedData);
        await logAudit('UPDATE_BLOG', `Updated blog: ${doc.data().title || req.params.id}`, req.admin.id, req.admin.username || 'admin');
        res.json({ _id: req.params.id, ...doc.data(), ...updatedData });
    } catch (err) {
        next(err);
    }
});

// DELETE blog (Admin)
router.delete('/:id', auth, authorize(['Super Admin', 'Admin']), async (req, res, next) => {
    try {
        const docRef = collection.doc(req.params.id);
        const doc = await docRef.get();
        if (!doc.exists) return res.status(404).json({ message: 'Blog not found' });

        await docRef.delete();
        await logAudit('DELETE_BLOG', `Deleted blog: ${doc.data().title}`, req.admin.id, req.admin.username || 'admin');
        res.json({ message: 'Blog deleted' });
    } catch (err) {
        next(err);
    }
});

module.exports = router;
