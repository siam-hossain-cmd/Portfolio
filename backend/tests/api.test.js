const request = require('supertest');
const jwt = require('jsonwebtoken');

// 1. Mock all external dependencies BEFORE importing the app
jest.mock('firebase-admin', () => {
    const mockDoc = {
        exists: true,
        data: () => ({
            username: 'admin',
            password: 'mocked_hashed_password',
            role: 'Super Admin',
            email: 'admin@example.com',
            twoFactorEnabled: false
        }),
        ref: {
            update: jest.fn().mockResolvedValue(true),
            delete: jest.fn().mockResolvedValue(true)
        }
    };

    const mockGet = jest.fn().mockResolvedValue({
        empty: false,
        size: 1,
        docs: [mockDoc]
    });

    const mockFirestore = {
        collection: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        limit: jest.fn().mockReturnThis(),
        orderBy: jest.fn().mockReturnThis(),
        get: mockGet,
        add: jest.fn().mockResolvedValue({ id: 'mock-doc-id' }),
        doc: jest.fn(() => mockDoc)
    };

    return {
        initializeApp: jest.fn(),
        credential: { cert: jest.fn() },
        firestore: jest.fn(() => mockFirestore),
        storage: jest.fn(() => ({
            bucket: jest.fn(() => ({
                file: jest.fn(() => ({
                    createWriteStream: jest.fn(() => ({
                        on: jest.fn((event, cb) => {
                            if (event === 'finish') setTimeout(cb, 50);
                            return this;
                        }),
                        end: jest.fn()
                    })),
                    getSignedUrl: jest.fn().mockResolvedValue(['http://mock-signed-url.com'])
                }))
            }))
        })),
        auth: jest.fn(() => ({
            verifyIdToken: jest.fn().mockResolvedValue({ email: 'admin@example.com' }),
            createUser: jest.fn().mockResolvedValue({ uid: 'mock-uid-123' }),
            updateUser: jest.fn().mockResolvedValue(true)
        }))
    };
});

// Mock otplib to prevent ES module syntax errors under CommonJS Jest
jest.mock('otplib', () => ({
    authenticator: {
        generateSecret: jest.fn(() => 'mocksecret123'),
        keyuri: jest.fn(() => 'otpauth://totp/mock'),
        verify: jest.fn(() => true)
    }
}));

// Mock qrcode
jest.mock('qrcode', () => ({
    toDataURL: jest.fn().mockResolvedValue('data:image/png;base64,mockqrcode')
}));

// Mock nodemailer
jest.mock('nodemailer', () => ({
    createTransport: jest.fn(() => ({
        sendMail: jest.fn().mockResolvedValue({ messageId: 'mock-id' })
    }))
}));

// Mock express app
const express = require('express');
const app = express();
app.use(express.json());

// Set mock environment variables
process.env.JWT_SECRET = 'test_secret_key';
process.env.GMAIL_USER = 'test@gmail.com';
process.env.GMAIL_APP_PASS = 'app_pass';
process.env.FIREBASE_SERVICE_ACCOUNT = JSON.stringify({
    type: 'service_account',
    project_id: 'mock-portfolio-project'
});

// Load routes
const projectRoutes = require('../routes/projectRoutes');
const skillRoutes = require('../routes/skillRoutes');
const messageRoutes = require('../routes/messageRoutes');
const authRoutes = require('../routes/authRoutes');
const uploadRoutes = require('../routes/uploadRoutes');
const settingsRoutes = require('../routes/settingsRoutes');

app.use('/api/projects', projectRoutes);
app.use('/api/skills', skillRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/settings', settingsRoutes);

describe('Portfolio System Integration & Hardening Tests', () => {
    let superAdminToken;
    let editorToken;

    beforeAll(() => {
        superAdminToken = jwt.sign({ id: 'admin-id', role: 'Super Admin', username: 'admin' }, process.env.JWT_SECRET);
        editorToken = jwt.sign({ id: 'editor-id', role: 'Editor', username: 'editor' }, process.env.JWT_SECRET);
    });

    // A. Route Protection & RBAC Checks
    describe('Route Protection & RBAC Roles', () => {
        it('GET /api/projects should be public', async () => {
            const res = await request(app).get('/api/projects');
            expect(res.statusCode).toBe(200);
        });

        it('POST /api/projects should reject requests without a token', async () => {
            const res = await request(app)
                .post('/api/projects')
                .send({ title: 'New Project' });
            expect(res.statusCode).toBe(401);
            expect(res.body.message).toMatch(/denied/i);
        });

        it('POST /api/projects should allow Super Admin to create a project', async () => {
            const res = await request(app)
                .post('/api/projects')
                .set('x-auth-token', superAdminToken)
                .send({ title: 'New Project', description: 'Test description', tags: ['React'] });
            expect(res.statusCode).toBe(201);
            expect(res.body.title).toBe('New Project');
        });

        it('DELETE /api/projects/:id should reject Editor role', async () => {
            const res = await request(app)
                .delete('/api/projects/some-id')
                .set('x-auth-token', editorToken);
            expect(res.statusCode).toBe(403);
            expect(res.body.message).toMatch(/denied/i);
        });
    });

    // B. Setup endpoint hardening
    describe('Setup Endpoint One-Time Enforcer', () => {
        it('POST /api/auth/setup should fail if admin already exists', async () => {
            const res = await request(app)
                .post('/api/auth/setup')
                .send({ username: 'hacker', password: 'newpassword123', email: 'hack@hack.com' });
            
            expect(res.statusCode).toBe(400);
            expect(res.body.message).toBe('System already initialized');
        });
    });

    // Firebase Auth Login Verification
    describe('Firebase Auth Login Verification', () => {
        it('POST /api/auth/login should reject request if idToken is missing', async () => {
            const res = await request(app)
                .post('/api/auth/login')
                .send({});
            expect(res.statusCode).toBe(400);
            expect(res.body.message).toMatch(/required/i);
        });

        it('POST /api/auth/login should succeed if idToken is provided and email exists in db', async () => {
            const res = await request(app)
                .post('/api/auth/login')
                .send({ idToken: 'valid-mock-token' });
            expect(res.statusCode).toBe(200);
            expect(res.body.token).toBeDefined();
        });
    });

    // C. User Enumeration protection
    describe('User Enumeration Block', () => {
        it('POST /api/auth/forgot-password should return same response for invalid and valid users', async () => {
            const res = await request(app)
                .post('/api/auth/forgot-password')
                .send({ username: 'unknown_user_abc' });
            expect(res.statusCode).toBe(200);
            expect(res.body.message).toBe('If account exists, instructions have been sent.');
        });
    });

    // D. Upload safety checks
    describe('File Upload Safety Filters', () => {
        it('POST /api/upload should reject non-authenticated users', async () => {
            const res = await request(app)
                .post('/api/upload')
                .attach('file', Buffer.from('hello world'), 'payload.exe');
            expect(res.statusCode).toBe(401);
        });
    });
});
