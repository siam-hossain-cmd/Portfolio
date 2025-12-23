const admin = require('firebase-admin');

// Initialize Firebase Admin SDK
// In production, set FIREBASE_SERVICE_ACCOUNT as a JSON string in environment variables
let serviceAccount;

if (process.env.FIREBASE_SERVICE_ACCOUNT) {
    serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
} else {
    // For local development, you can use a local file
    throw new Error('FIREBASE_SERVICE_ACCOUNT environment variable is required');
}

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

module.exports = { admin, db };
