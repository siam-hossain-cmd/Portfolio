const express = require('express');
const router = express.Router();
const multer = require('multer');
const { bucket } = require('../config/firebase');

// Configure multer for memory storage
const upload = multer({
    storage: multer.memoryStorage(),
    limits: {
        fileSize: 5 * 1024 * 1024 // 5MB limit
    }
});

router.post('/', upload.single('file'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: 'No file uploaded' });
        }

        const file = req.file;
        const filename = `uploads/${Date.now()}_${file.originalname}`;
        const fileUpload = bucket.file(filename);

        const blobStream = fileUpload.createWriteStream({
            metadata: {
                contentType: file.mimetype
            }
        });

        blobStream.on('error', (error) => {
            console.error('Upload error:', error);
            res.status(500).json({ message: 'Something went wrong uploading the file' });
        });

        blobStream.on('finish', async () => {
            // Include token to allow access if rule requires it, or make public
            // For now, generate a signed URL valid for a long time (e.g., 1 year)
            // Or make it public. Let's try making it public for simplicity if rules allow.
            // But Portfolio rules usually default to private. Signed URL is safer.

            const [url] = await fileUpload.getSignedUrl({
                action: 'read',
                expires: '03-01-2500' // Far future
            });

            res.status(200).json({
                message: 'File uploaded successfully',
                url: url,
                filename: filename
            });
        });

        blobStream.end(file.buffer);

    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
