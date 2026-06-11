const admin = require('firebase-admin');
const path = require('path');
const fs = require('fs');

const localKeyPath = path.join(__dirname, '..', 'firebase-service-account.json');
if (!fs.existsSync(localKeyPath)) {
    console.error('❌ firebase-service-account.json not found');
    process.exit(1);
}
const serviceAccount = require(localKeyPath);

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});

const ADMIN_EMAIL = 's.siamhossain.h@gmail.com';
const ADMIN_PASSWORD = 'admin123';

async function resetPassword() {
    try {
        const user = await admin.auth().getUserByEmail(ADMIN_EMAIL);
        await admin.auth().updateUser(user.uid, {
            password: ADMIN_PASSWORD
        });
        console.log(`✅ Successfully updated password for ${ADMIN_EMAIL} to ${ADMIN_PASSWORD}`);
        
        // Also ensure the doc in Firestore is in place
        const db = admin.firestore();
        db.settings({ databaseId: 'default' });
        await db.collection('admins').doc(user.uid).set({
            username: 'siam',
            email: ADMIN_EMAIL,
            role: 'Super Admin',
            createdAt: new Date(),
            twoFactorEnabled: false
        }, { merge: true });
        console.log(`✅ Successfully verified/updated admins collection doc in Firestore.`);
        process.exit(0);
    } catch (err) {
        console.error('❌ Error resetting password:', err);
        process.exit(1);
    }
}

resetPassword();
