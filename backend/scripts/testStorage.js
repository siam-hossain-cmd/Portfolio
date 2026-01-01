const { bucket } = require('../config/firebase');

async function testUpload() {
    try {
        console.log('Testing Firebase Storage connection...');
        console.log('Bucket name:', bucket.name);

        const filename = 'test_upload_script.txt';
        const file = bucket.file(filename);

        console.log('Attempting to save verification file...');
        await file.save('This is a test upload from the backend script.');

        console.log('File saved successfully!');

        const [url] = await file.getSignedUrl({
            action: 'read',
            expires: '03-09-2491'
        });

        console.log('Signed URL generated:', url);
        console.log('Storage configuration is CORRECT.');

    } catch (error) {
        console.error('Storage Test ERROR:', error);
    }
}

testUpload();
