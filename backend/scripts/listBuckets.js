const { admin } = require('../config/firebase');

async function listBuckets() {
    try {
        console.log('Listing buckets...');
        // admin.storage().bucket() returns a Bucket object. 
        // The Bucket object has a reference to the storage client via .storage
        const [buckets] = await admin.storage().bucket().storage.getBuckets();
        console.log('Buckets found:');
        if (buckets.length === 0) {
            console.log('No buckets found. Please ensure Storage is enabled in Firebase Console.');
        } else {
            buckets.forEach(bucket => {
                console.log(`- ${bucket.name}`);
            });
        }
    } catch (error) {
        console.error('Error listing buckets:', error);
    }
}

listBuckets();
