const express = require('express');
const router = express.Router();
const { db } = require('../config/firebase');

const projectsCollection = db.collection('projects');

// GET all projects
router.get('/', async (req, res) => {
    try {
        const snapshot = await projectsCollection.orderBy('createdAt', 'desc').get();
        const projects = snapshot.docs.map(doc => ({
            _id: doc.id,
            ...doc.data()
        }));
        res.json(projects);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// POST a new project
router.post('/', async (req, res) => {
    try {
        const projectData = {
            ...req.body,
            createdAt: new Date()
        };
        const docRef = await projectsCollection.add(projectData);
        res.status(201).json({ _id: docRef.id, ...projectData });
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// DELETE a project
router.delete('/:id', async (req, res) => {
    try {
        const docRef = projectsCollection.doc(req.params.id);
        const doc = await docRef.get();

        if (!doc.exists) {
            return res.status(404).json({ message: 'Project not found' });
        }

        await docRef.delete();
        res.json({ message: 'Project deleted' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
