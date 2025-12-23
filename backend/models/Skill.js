const mongoose = require('mongoose');

const skillSchema = new mongoose.Schema({
    name: { type: String, required: true },
    category: {
        type: String,
        required: true,
        enum: ['Frontend', 'Backend', 'Mobile', 'Database', 'Tools']
    },
    icon: { type: String }, // Can be a lucide-react name or a URL
});

module.exports = mongoose.model('Skill', skillSchema);
