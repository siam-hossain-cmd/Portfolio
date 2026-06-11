const express = require('express');
const router = express.Router();
const multer = require('multer');
const { bucket } = require('../config/firebase');
const { auth } = require('../middleware/auth');
const logAudit = require('../utils/auditLogger');
const path = require('path');
const rateLimit = require('express-rate-limit');

// Rate limiter for uploads (10 uploads per minute)
const uploadLimiter = rateLimit({
    windowMs: 60 * 1000,
    max: 10,
    message: { message: 'Too many uploads. Please try again later.' }
});

// Configure multer for memory storage and file type validation
const upload = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
    fileFilter: (req, file, cb) => {
        const allowedMimeTypes = ['image/png', 'image/jpeg', 'image/webp', 'image/gif', 'image/svg+xml'];
        const allowedExtensions = ['.png', '.jpg', '.jpeg', '.webp', '.gif', '.svg'];
        const ext = path.extname(file.originalname).toLowerCase();
        if (allowedMimeTypes.includes(file.mimetype) && allowedExtensions.includes(ext)) {
            cb(null, true);
        } else {
            cb(new Error('Invalid file type. Allowed: PNG, JPEG, WebP, GIF, SVG.'), false);
        }
    }
});

// Helper: detect billing errors and return user-friendly message
function isBillingError(err) {
    return err && err.message && (
        err.message.includes('billing account') ||
        err.message.includes('accountDisabled') ||
        err.message.includes('billing')
    );
}

const BILLING_ERROR_RESPONSE = {
    message: 'Firebase Storage requires the Blaze (pay-as-you-go) plan. Please upgrade your Firebase project or paste an external image URL instead.',
    code: 'BILLING_REQUIRED',
    upgradeUrl: 'https://console.firebase.google.com/project/portfolio-50e4a/usage/details'
};

// Helper: upload file to Firebase Storage and return public URL
async function uploadToStorage(file, folder) {
    const sanitizedName = file.originalname
        .replace(/[^a-zA-Z0-9.\-_]/g, '')
        .replace(/\s+/g, '_');

    const filename = `${folder}/${Date.now()}_${sanitizedName}`;
    const fileUpload = bucket.file(filename);

    return new Promise((resolve, reject) => {
        const blobStream = fileUpload.createWriteStream({
            metadata: { contentType: file.mimetype }
        });
        blobStream.on('error', reject);
        blobStream.on('finish', async () => {
            try {
                const [url] = await fileUpload.getSignedUrl({
                    action: 'read',
                    expires: '03-01-2500'
                });
                resolve({ url, filename });
            } catch (err) { reject(err); }
        });
        blobStream.end(file.buffer);
    });
}

// POST /api/upload — single file upload
router.post('/', auth, uploadLimiter, upload.single('file'), async (req, res, next) => {
    try {
        if (!req.file) return res.status(400).json({ message: 'No file uploaded' });

        const folder = req.body.folder || 'portfolio/uploads';
        const result = await uploadToStorage(req.file, folder);

        await logAudit('UPLOAD_FILE', `Uploaded: ${result.filename}`, req.admin.id, req.admin.username || 'admin');

        res.status(200).json({ message: 'File uploaded successfully', url: result.url, filename: result.filename });
    } catch (error) {
        if (isBillingError(error)) return res.status(402).json(BILLING_ERROR_RESPONSE);
        next(error);
    }
});

// POST /api/upload/multiple — multiple file upload
router.post('/multiple', auth, uploadLimiter, upload.array('files', 10), async (req, res, next) => {
    try {
        if (!req.files || req.files.length === 0) return res.status(400).json({ message: 'No files uploaded' });

        const folder = req.body.folder || 'portfolio/uploads';
        const results = await Promise.all(req.files.map(file => uploadToStorage(file, folder)));

        await logAudit('UPLOAD_FILES', `Uploaded ${results.length} files to ${folder}`, req.admin.id, req.admin.username || 'admin');

        res.status(200).json({ message: `${results.length} files uploaded successfully`, files: results });
    } catch (error) {
        if (isBillingError(error)) return res.status(402).json(BILLING_ERROR_RESPONSE);
        next(error);
    }
});

module.exports = router;
