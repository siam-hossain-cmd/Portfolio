const express = require('express');
const router = express.Router();
const { db } = require('../config/firebase');
const { auth, authorize } = require('../middleware/auth');
const logAudit = require('../utils/auditLogger');

const projectsCollection = db.collection('projects');

// Helper: generate slug from title
function generateSlug(title) {
    return title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '')
        .slice(0, 80);
}

// GET all projects (Public)
router.get('/', async (req, res, next) => {
    try {
        const snapshot = await projectsCollection.orderBy('createdAt', 'desc').get();
        const projects = snapshot.docs.map(doc => ({
            _id: doc.id,
            ...doc.data()
        }));
        res.json(projects);
    } catch (err) {
        next(err);
    }
});

// GET single project by slug (Public)
router.get('/slug/:slug', async (req, res, next) => {
    try {
        const snapshot = await projectsCollection.where('slug', '==', req.params.slug).limit(1).get();
        if (snapshot.empty) return res.status(404).json({ message: 'Project not found' });
        const doc = snapshot.docs[0];
        res.json({ _id: doc.id, ...doc.data() });
    } catch (err) {
        next(err);
    }
});

// GET single project by ID (Public)
router.get('/:id', async (req, res, next) => {
    try {
        const doc = await projectsCollection.doc(req.params.id).get();
        if (!doc.exists) return res.status(404).json({ message: 'Project not found' });
        res.json({ _id: doc.id, ...doc.data() });
    } catch (err) {
        next(err);
    }
});

// POST a new project (Admin)
router.post('/', auth, authorize(['Super Admin', 'Admin', 'Editor']), async (req, res, next) => {
    try {
        const slug = req.body.slug || generateSlug(req.body.title || 'untitled');
        
        // Check slug uniqueness
        const existing = await projectsCollection.where('slug', '==', slug).limit(1).get();
        const finalSlug = existing.empty ? slug : `${slug}-${Date.now()}`;

        const projectData = {
            title: req.body.title || '',
            slug: finalSlug,
            description: req.body.description || '',
            category: req.body.category || '',
            status: req.body.status || 'Completed',
            client: req.body.client || '',
            timeline: req.body.timeline || { startDate: '', endDate: '' },
            problemStatement: req.body.problemStatement || '',
            solution: req.body.solution || '',
            features: req.body.features || [],
            image: req.body.image || '',
            screenshots: req.body.screenshots || [],
            architectureDiagrams: req.body.architectureDiagrams || [],
            databaseDiagrams: req.body.databaseDiagrams || [],
            apiEndpoints: req.body.apiEndpoints || [],
            techStack: req.body.techStack || { frontend: [], backend: [], database: [], cloud: [], devOps: [] },
            tags: req.body.tags || [],
            githubLink: req.body.githubLink || '',
            liveLink: req.body.liveLink || '',
            isPrivateCode: req.body.isPrivateCode || false,
            isFeatured: req.body.isFeatured || false,
            order: req.body.order || 0,
            createdAt: new Date()
        };
        const docRef = await projectsCollection.add(projectData);
        
        await logAudit(
            'CREATE_PROJECT',
            `Created project: ${projectData.title} (${docRef.id})`,
            req.admin.id,
            req.admin.username || 'admin'
        );

        res.status(201).json({ _id: docRef.id, ...projectData });
    } catch (err) {
        next(err);
    }
});

// PUT (update) a project (Admin)
router.put('/:id', auth, authorize(['Super Admin', 'Admin', 'Editor']), async (req, res, next) => {
    try {
        const docRef = projectsCollection.doc(req.params.id);
        const doc = await docRef.get();

        if (!doc.exists) {
            return res.status(404).json({ message: 'Project not found' });
        }

        const updatedData = {
            ...req.body,
            updatedAt: new Date()
        };
        
        await docRef.update(updatedData);

        await logAudit(
            'UPDATE_PROJECT',
            `Updated project: ${doc.data().title || req.params.id}`,
            req.admin.id,
            req.admin.username || 'admin'
        );

        res.json({ _id: req.params.id, ...doc.data(), ...updatedData });
    } catch (err) {
        next(err);
    }
});

// DELETE a project (Admin only)
router.delete('/:id', auth, authorize(['Super Admin', 'Admin']), async (req, res, next) => {
    try {
        const docRef = projectsCollection.doc(req.params.id);
        const doc = await docRef.get();

        if (!doc.exists) {
            return res.status(404).json({ message: 'Project not found' });
        }

        const projectTitle = doc.data().title;
        await docRef.delete();

        await logAudit(
            'DELETE_PROJECT',
            `Deleted project: ${projectTitle} (${req.params.id})`,
            req.admin.id,
            req.admin.username || 'admin'
        );

        res.json({ message: 'Project deleted' });
    } catch (err) {
        next(err);
    }
});

module.exports = router;
