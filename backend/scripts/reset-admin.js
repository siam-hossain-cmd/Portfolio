require('dotenv').config();
const { db } = require('../config/firebase');
const bcrypt = require('bcryptjs');

async function resetAdmin() {
    // New admin credentials - update these as needed
    const newUsername = process.argv[2] || 'admin';
    const newEmail    = process.argv[3] || 'siamhossain00300@gmail.com';
    const newPassword = process.argv[4] || 'Password123!';

    try {
        console.log('Clearing old admin credentials from Firebase...');

        const adminsCollection = db.collection('admins');
        const snapshot = await adminsCollection.get();

        // Delete all existing admins
        const deletePromises = snapshot.docs.map(doc => doc.ref.delete());
        await Promise.all(deletePromises);
        console.log(`Deleted ${snapshot.docs.length} old admin document(s).`);

        // Create new admin with email stored
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(newPassword, salt);

        await adminsCollection.add({
            username: newUsername,
            email: newEmail,
            password: hashedPassword,
            createdAt: new Date()
        });

        console.log('\n✅ New admin created successfully!');
        console.log('─────────────────────────────────');
        console.log(`  Username : ${newUsername}`);
        console.log(`  Email    : ${newEmail}`);
        console.log(`  Password : ${newPassword}`);
        console.log('─────────────────────────────────');
        console.log('You can log in at /admin/login with these credentials.');
        process.exit(0);
    } catch (err) {
        console.error('Error resetting admin:', err.message);
        process.exit(1);
    }
}

resetAdmin();
