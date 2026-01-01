const { db } = require('../config/firebase');

async function listAdmins() {
    try {
        const snapshot = await db.collection('admins').get();
        if (snapshot.empty) {
            console.log('No admin users found.');
            return;
        }

        console.log('Found admin users:');
        snapshot.forEach(doc => {
            console.log(`- Username: ${doc.data().username}`);
        });
    } catch (error) {
        console.error('Error listing admins:', error);
    }
}

listAdmins();
