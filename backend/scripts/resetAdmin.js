const { db } = require('../config/firebase');
const bcrypt = require('bcryptjs');

async function resetAdminPassword(username, newPassword) {
    try {
        const snapshot = await db.collection('admins').where('username', '==', username).get();

        if (snapshot.empty) {
            // Create new admin if not exists
            console.log(`Admin user '${username}' not found. Creating new admin...`);
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(newPassword, salt);

            await db.collection('admins').add({
                username,
                password: hashedPassword,
                createdAt: new Date()
            });
            console.log(`Admin user '${username}' created with password: ${newPassword}`);
        } else {
            // Update existing admin
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(newPassword, salt);

            const promises = snapshot.docs.map(doc => doc.ref.update({ password: hashedPassword }));
            await Promise.all(promises);

            console.log(`Password for admin user '${username}' has been reset to: ${newPassword}`);
        }
    } catch (error) {
        console.error('Error resetting password:', error);
    }
}

// Default to 'admin' and 'admin123' if not provided
const username = process.argv[2] || 'admin';
const password = process.argv[3] || 'admin123';

resetAdminPassword(username, password);
