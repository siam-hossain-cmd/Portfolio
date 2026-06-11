const express = require('express');
const router = express.Router();
const { db } = require('../config/firebase');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const rateLimit = require('express-rate-limit');
const { authenticator } = require('otplib');
const qrcode = require('qrcode');
const { auth, authorize } = require('../middleware/auth');
const logAudit = require('../utils/auditLogger');

const adminsCollection = db.collection('admins');
const otpCollection = db.collection('otp_codes');

// Nodemailer SMTP Configuration
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_APP_PASS
    }
});

// Login, Setup, Forgot-password rate limiters (5 requests per minute per IP)
const authLimiter = rateLimit({
    windowMs: 60 * 1000, // 1 minute
    max: 5,
    message: { message: 'Too many requests. Please try again in a minute.' }
});

// 1. POST Login (Verifies Firebase ID Token and returns custom JWT if user is registered admin)
router.post('/login', authLimiter, async (req, res, next) => {
    const { idToken } = req.body;
    try {
        if (!idToken) {
            return res.status(400).json({ message: 'Firebase ID Token is required' });
        }

        // Verify the ID Token using the Admin SDK
        const firebaseAdmin = require('../config/firebase').admin;
        const decodedToken = await firebaseAdmin.auth().verifyIdToken(idToken);
        const email = decodedToken.email;

        // Check if this email exists in our Firestore "admins" collection
        const snapshot = await adminsCollection.where('email', '==', email).limit(1).get();

        if (snapshot.empty) {
            // Access Denied: Prevent automatic sign-up of unregistered users
            return res.status(403).json({ 
                message: 'Access denied. This account is not registered as an administrator.' 
            });
        }

        const adminDoc = snapshot.docs[0];
        const admin = { id: adminDoc.id, ...adminDoc.data() };

        // If 2FA is enabled, require code verification
        if (admin.twoFactorEnabled) {
            const tempToken = jwt.sign(
                { id: admin.id, require2FA: true, username: admin.username, role: admin.role || 'Admin' }, 
                process.env.JWT_SECRET, 
                { expiresIn: '5m' }
            );
            return res.json({ require2FA: true, tempToken });
        }

        // Otherwise complete login and issue session token
        const token = jwt.sign(
            { id: admin.id, username: admin.username, role: admin.role || 'Admin' }, 
            process.env.JWT_SECRET, 
            { expiresIn: '2h' }
        );

        await logAudit('LOGIN', `Admin '${admin.username}' logged in successfully via Firebase Auth`, admin.id, admin.username);

        res.json({ token });
    } catch (err) {
        console.error('Firebase Auth Verification Error:', err);
        res.status(401).json({ message: 'Authentication failed. Invalid token.' });
    }
});

// 2. POST Verify 2FA code during login
router.post('/login/verify-2fa', authLimiter, async (req, res, next) => {
    const { code, tempToken } = req.body;
    try {
        if (!tempToken) {
            return res.status(400).json({ message: 'Temporary token is required' });
        }

        const decoded = jwt.verify(tempToken, process.env.JWT_SECRET);
        if (!decoded.require2FA) {
            return res.status(400).json({ message: 'Invalid token type' });
        }

        const adminDoc = await adminsCollection.doc(decoded.id).get();
        if (!adminDoc.exists) {
            return res.status(404).json({ message: 'Admin not found' });
        }

        const admin = adminDoc.data();
        const isValid = authenticator.verify({
            token: code,
            secret: admin.twoFactorSecret
        });

        if (!isValid) {
            return res.status(400).json({ message: 'Invalid 2FA code' });
        }

        // Generate full access token
        const token = jwt.sign(
            { id: adminDoc.id, username: decoded.username, role: decoded.role }, 
            process.env.JWT_SECRET, 
            { expiresIn: '2h' }
        );

        await logAudit('LOGIN_2FA', `Admin '${decoded.username}' authenticated with 2FA`, adminDoc.id, decoded.username);

        res.json({ token });
    } catch (err) {
        next(err);
    }
});

// 3. POST Setup Initial Admin (One-time only)
router.post('/setup', authLimiter, async (req, res, next) => {
    const { username, password, email } = req.body;
    try {
        // Enforce ONE-TIME system setup check
        const totalAdminsSnapshot = await adminsCollection.limit(1).get();
        if (!totalAdminsSnapshot.empty) {
            return res.status(400).json({ success: false, message: 'System already initialized' });
        }

        if (!email || !password || !username) {
            return res.status(400).json({ success: false, message: 'Username, email, and password are required' });
        }

        // Create the user record inside Firebase Authentication
        const firebaseAdmin = require('../config/firebase').admin;
        const userRecord = await firebaseAdmin.auth().createUser({
            email: email,
            password: password,
            displayName: username
        });

        // Store role and details in Firestore admins collection with matching key
        await adminsCollection.doc(userRecord.uid).set({
            username,
            email,
            role: 'Super Admin', // First admin gets Super Admin role
            createdAt: new Date(),
            twoFactorEnabled: false
        });

        await logAudit('SYSTEM_INIT', `System initialized. Super Admin '${username}' created.`, userRecord.uid, username);

        res.status(201).json({ message: 'Super Admin created successfully. System initialized.' });
    } catch (err) {
        next(err);
    }
});

// 4. POST Forgot Password (No user enumeration)
router.post('/forgot-password', authLimiter, async (req, res, next) => {
    const { username } = req.body;
    const genericResponse = { message: 'If account exists, instructions have been sent.' };

    try {
        const snapshot = await adminsCollection.where('username', '==', username).limit(1).get();
        if (snapshot.empty) {
            // Prevent User Enumeration: return same response as success
            return res.json(genericResponse);
        }

        const adminDoc = snapshot.docs[0];
        const adminData = adminDoc.data();
        const adminEmail = adminData.email || process.env.ADMIN_EMAIL;

        if (!adminEmail) {
            return res.json(genericResponse); // Keep response identical
        }

        // Generate 6-digit OTP
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes from now

        // Store OTP in database instead of memory
        await otpCollection.add({
            username,
            otpCode: otp,
            expiresAt,
            used: false,
            createdAt: new Date()
        });

        // Send Email
        const mailOptions = {
            from: `"Portfolio Admin" <${process.env.GMAIL_USER}>`,
            to: adminEmail,
            subject: 'Admin Dashboard - Password Reset OTP',
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 480px; margin: auto; padding: 32px; background: #0a0f1e; color: white; border-radius: 12px;">
                    <h2 style="color: #06b6d4;">Password Reset OTP</h2>
                    <p style="color: #94a3b8;">You requested a password reset for your admin dashboard.</p>
                    <div style="background: #1e293b; border-radius: 8px; padding: 24px; text-align: center; margin: 24px 0;">
                        <p style="color: #94a3b8; margin: 0 0 8px;">Your OTP Code</p>
                        <h1 style="color: #06b6d4; letter-spacing: 8px; margin: 0; font-size: 36px;">${otp}</h1>
                    </div>
                    <p style="color: #64748b; font-size: 14px;">This OTP is valid for <strong>10 minutes</strong>. Do not share it with anyone.</p>
                </div>
            `
        };

        await transporter.sendMail(mailOptions);
        res.json(genericResponse);
    } catch (err) {
        next(err);
    }
});

// 5. POST Verify OTP & Reset Password
router.post('/verify-otp-and-reset', authLimiter, async (req, res, next) => {
    const { username, otp, newPassword } = req.body;
    try {
        const otpSnapshot = await otpCollection
            .where('username', '==', username)
            .where('otpCode', '==', otp)
            .where('used', '==', false)
            .orderBy('createdAt', 'desc')
            .limit(1)
            .get();

        if (otpSnapshot.empty) {
            return res.status(400).json({ message: 'Invalid or expired OTP.' });
        }

        const otpDoc = otpSnapshot.docs[0];
        const otpData = otpDoc.data();

        if (otpData.expiresAt.toDate() < new Date()) {
            return res.status(400).json({ message: 'OTP has expired. Please request a new one.' });
        }

        // OTP is valid -> Update password in Firebase Authentication
        const adminSnapshot = await adminsCollection.where('username', '==', username).limit(1).get();
        if (adminSnapshot.empty) {
            return res.status(404).json({ message: 'Admin account not found.' });
        }

        const adminDoc = adminSnapshot.docs[0];
        const uid = adminDoc.id; // Doc ID is matching with the Firebase user UID

        const firebaseAdmin = require('../config/firebase').admin;
        await firebaseAdmin.auth().updateUser(uid, {
            password: newPassword
        });

        await otpDoc.ref.update({ used: true }); // Mark OTP as used

        await logAudit('RESET_PASSWORD', `Password reset successful for '${username}' inside Firebase Auth`, uid, username);

        res.json({ message: 'Password reset successfully!' });
    } catch (err) {
        next(err);
    }
});

// 6. GET Setup 2FA (Super Admin/Admin/Editor) - protected
router.get('/2fa/setup', auth, async (req, res, next) => {
    try {
        const adminDoc = await adminsCollection.doc(req.admin.id).get();
        if (!adminDoc.exists) {
            return res.status(404).json({ message: 'Admin not found' });
        }

        const admin = adminDoc.data();
        const secret = authenticator.generateSecret();
        const otpauth = authenticator.keyuri(admin.username, 'Portfolio Admin', secret);
        const qrCodeUrl = await qrcode.toDataURL(otpauth);

        // Store temporary secret until verified
        await adminDoc.ref.update({
            tempTwoFactorSecret: secret
        });

        res.json({ secret, qrCodeUrl });
    } catch (err) {
        next(err);
    }
});

// 7. POST Verify & Enable 2FA - protected
router.post('/2fa/verify', auth, authLimiter, async (req, res, next) => {
    const { code } = req.body;
    try {
        const adminDoc = await adminsCollection.doc(req.admin.id).get();
        if (!adminDoc.exists) {
            return res.status(404).json({ message: 'Admin not found' });
        }

        const admin = adminDoc.data();
        if (!admin.tempTwoFactorSecret) {
            return res.status(400).json({ message: '2FA setup was not initiated' });
        }

        const isValid = authenticator.verify({
            token: code,
            secret: admin.tempTwoFactorSecret
        });

        if (!isValid) {
            return res.status(400).json({ message: 'Invalid 2FA verification code' });
        }

        // Enable 2FA on account
        await adminDoc.ref.update({
            twoFactorEnabled: true,
            twoFactorSecret: admin.tempTwoFactorSecret,
            tempTwoFactorSecret: null
        });

        await logAudit('ENABLE_2FA', `Enabled 2FA for '${req.admin.username}'`, req.admin.id, req.admin.username);

        res.json({ success: true, message: '2FA enabled successfully!' });
    } catch (err) {
        next(err);
    }
});

// 8. POST Disable 2FA - protected
router.post('/2fa/disable', auth, async (req, res, next) => {
    const { code } = req.body;
    try {
        const adminDoc = await adminsCollection.doc(req.admin.id).get();
        if (!adminDoc.exists) {
            return res.status(404).json({ message: 'Admin not found' });
        }

        const admin = adminDoc.data();
        
        // Verify code before disabling
        const isValid = authenticator.verify({
            token: code,
            secret: admin.twoFactorSecret
        });

        if (!isValid) {
            return res.status(400).json({ message: 'Invalid code, cannot disable 2FA' });
        }

        await adminDoc.ref.update({
            twoFactorEnabled: false,
            twoFactorSecret: null,
            tempTwoFactorSecret: null
        });

        await logAudit('DISABLE_2FA', `Disabled 2FA for '${req.admin.username}'`, req.admin.id, req.admin.username);

        res.json({ success: true, message: '2FA disabled successfully!' });
    } catch (err) {
        next(err);
    }
});

// 9. GET Verify Token
router.get('/verify-token', auth, async (req, res, next) => {
    try {
        const adminDoc = await adminsCollection.doc(req.admin.id).get();
        if (!adminDoc.exists) {
            return res.status(401).json({ message: 'Admin no longer exists' });
        }
        res.json({ valid: true, admin: { id: req.admin.id, username: req.admin.username, role: adminDoc.data().role || 'Admin' } });
    } catch (err) {
        next(err);
    }
});

// 10. POST Create Admin (Super Admin only)
router.post('/create-admin', auth, authorize(['Super Admin']), async (req, res, next) => {
    const { username, password, email, role } = req.body;
    try {
        if (!email || !password || !username) {
            return res.status(400).json({ message: 'Username, email, and password are required' });
        }

        const firebaseAdmin = require('../config/firebase').admin;
        
        // Check if user already exists in Firebase Auth
        let userRecord;
        try {
            userRecord = await firebaseAdmin.auth().createUser({
                email,
                password,
                displayName: username
            });
        } catch (authErr) {
            return res.status(400).json({ message: `Failed to create user in Firebase Auth: ${authErr.message}` });
        }

        // Store role & details in Firestore
        await adminsCollection.doc(userRecord.uid).set({
            username,
            email,
            role: role || 'Admin',
            createdAt: new Date(),
            twoFactorEnabled: false
        });

        await logAudit('CREATE_ADMIN', `Created new admin account for '${username}' (${role || 'Admin'})`, userRecord.uid, req.admin.username);

        res.status(201).json({ message: `Admin account for ${username} created successfully!` });
    } catch (err) {
        next(err);
    }
});

module.exports = router;
