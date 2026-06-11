/**
 * One-time setup script: Creates the Super Admin in Firebase Auth + Firestore
 * Run: node scripts/createAdmin.js
 */
const admin = require('firebase-admin');
const path = require('path');
const fs = require('fs');

// Load service account
const localKeyPath = path.join(__dirname, '..', 'firebase-service-account.json');
if (!fs.existsSync(localKeyPath)) {
    console.error('❌ firebase-service-account.json not found in backend/');
    process.exit(1);
}
const serviceAccount = require(localKeyPath);

// --- CONFIG ---
const ADMIN_EMAIL    = 's.siamhossain.h@gmail.com';
const ADMIN_PASSWORD = 'admin123';
const ADMIN_USERNAME = 'siam';
// --------------

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();
db.settings({ databaseId: 'default' }); // DB was created as 'default' not '(default)'
const authClient = admin.auth();

async function createAdmin() {
    console.log(`\n🔧 Connecting to Firebase project: ${serviceAccount.project_id}`);

    // 1. Check if admins collection already has docs
    console.log('📋 Checking for existing admins...');
    const existing = await db.collection('admins').limit(1).get();
    if (!existing.empty) {
        console.log('⚠️  Admin already exists! To reset, delete the admins collection in Firebase Console.');
        const doc = existing.docs[0].data();
        console.log(`   Existing admin: ${doc.username} (${doc.email}) — Role: ${doc.role}`);
        process.exit(0);
    }

    // 2. Create Firebase Auth user
    console.log(`\n🔐 Creating Firebase Auth user for ${ADMIN_EMAIL}...`);
    let userRecord;
    try {
        // Check if user already exists in Auth
        try {
            userRecord = await authClient.getUserByEmail(ADMIN_EMAIL);
            console.log(`   ℹ️  Auth user already exists (UID: ${userRecord.uid}) — reusing.`);
        } catch (notFound) {
            userRecord = await authClient.createUser({
                email: ADMIN_EMAIL,
                password: ADMIN_PASSWORD,
                displayName: ADMIN_USERNAME,
                emailVerified: true
            });
            console.log(`   ✅ Firebase Auth user created (UID: ${userRecord.uid})`);
        }
    } catch (err) {
        console.error('❌ Failed to create Auth user:', err.message);
        process.exit(1);
    }

    // 3. Write to Firestore admins collection
    console.log(`\n🗄️  Writing to Firestore admins collection...`);
    try {
        await db.collection('admins').doc(userRecord.uid).set({
            username: ADMIN_USERNAME,
            email: ADMIN_EMAIL,
            role: 'Super Admin',
            createdAt: admin.firestore.FieldValue.serverTimestamp(),
            twoFactorEnabled: false
        });
        console.log(`   ✅ Firestore document created.`);
    } catch (err) {
        console.error('❌ Failed to write to Firestore:', err.code, err.message);
        process.exit(1);
    }

    console.log('\n🎉 Setup complete!');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log(`   Email:    ${ADMIN_EMAIL}`);
    console.log(`   Password: ${ADMIN_PASSWORD}`);
    console.log(`   Role:     Super Admin`);
    console.log(`   UID:      ${userRecord.uid}`);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('\n👉 Go to http://localhost:5174 to log in.\n');
    process.exit(0);
}

createAdmin().catch(err => {
    console.error('❌ Unexpected error:', err);
    process.exit(1);
});
