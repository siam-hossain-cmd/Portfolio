const { db } = require('../config/firebase');

const logAudit = async (action, details, adminId = 'system', username = 'system') => {
    try {
        await db.collection('audit_logs').add({
            action,
            details,
            adminId,
            username,
            timestamp: new Date()
        });
    } catch (err) {
        // Fallback to standard console logger if DB log fails
        const logger = require('../config/logger');
        logger.error('Failed to log audit event to Firestore:', err);
    }
};

module.exports = logAudit;
