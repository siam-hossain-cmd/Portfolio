const admin = require('firebase-admin');
const path = require('path');
const fs = require('fs');

// Initialize Firebase Admin SDK
let serviceAccount;

// Try environment variable first (for production/development env variables)
if (process.env.FIREBASE_SERVICE_ACCOUNT) {
    try {
        serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
    } catch (err) {
        throw new Error('Failed to parse FIREBASE_SERVICE_ACCOUNT env variable as JSON: ' + err.message);
    }
} else {
    // For local development, try to load from a generic local file name
    const localKeyPath = path.join(__dirname, '..', '..', 'firebase-service-account.json');
    const localBackendKeyPath = path.join(__dirname, '..', 'firebase-service-account.json');
    
    if (fs.existsSync(localBackendKeyPath)) {
        serviceAccount = require(localBackendKeyPath);
    } else if (fs.existsSync(localKeyPath)) {
        serviceAccount = require(localKeyPath);
    } else {
        throw new Error('Firebase credentials not found. Please set FIREBASE_SERVICE_ACCOUNT env var or place firebase-service-account.json in the backend/ or project root directory.');
    }
}

// Determine storage bucket name dynamically from env, or construct it from project_id
const bucketName = process.env.FIREBASE_STORAGE_BUCKET || `${serviceAccount.project_id}.firebasestorage.app`;

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    storageBucket: bucketName
});

// Database created with ID 'default' (not the standard '(default)')
// Must specify explicitly so Admin SDK connects to the right database
const db = admin.firestore();
db.settings({ databaseId: 'default' });
const bucket = admin.storage().bucket();

console.log(`[Firebase] Project: ${serviceAccount.project_id} | Bucket: ${bucketName}`);

module.exports = { admin, db, bucket };

