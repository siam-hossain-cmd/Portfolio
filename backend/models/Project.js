const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    image: { type: String, required: true },
    liveLink: { type: String },
    githubLink: { type: String },
    tags: [{ type: String }],
    createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Project', projectSchema);
