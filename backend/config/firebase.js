const admin = require('firebase-admin');
const path = require('path');
const fs = require('fs');

// Initialize Firebase Admin SDK
let serviceAccount;

// Try environment variable first (for production)
if (process.env.FIREBASE_SERVICE_ACCOUNT) {
    serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
} else {
    // For local development, try to load from local file
    const localKeyPath = path.join(__dirname, '..', '..', 'portfolio-3faa4-firebase-adminsdk-fbsvc-d5e649c9cb.json');
    if (fs.existsSync(localKeyPath)) {
        serviceAccount = require(localKeyPath);
    } else {
        throw new Error('Firebase credentials not found. Please set FIREBASE_SERVICE_ACCOUNT env var or place service account JSON in project root.');
    }
}

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

module.exports = { admin, db };

