import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Lock, User, Loader2, AlertCircle, ShieldCheck } from 'lucide-react';
import axiosInstance from '../config/axiosInstance';
import { signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { auth } from '../config/firebase';

export default function AdminLogin() {
    const [email, setEmail] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [view, setView] = useState('login'); // 'login', 'forgot', 'reset', '2fa'
    const [otp, setOtp] = useState('');
    const [newPassword, setNewPassword] = useState('');
    
    // 2FA login states
    const [twoFactorCode, setTwoFactorCode] = useState('');
    const [tempToken, setTempToken] = useState('');

    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            // 1. Sign in with Firebase Auth client-side
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            const idToken = await userCredential.user.getIdToken();

            // 2. Send the ID Token to the backend to establish custom JWT session
            const res = await axiosInstance.post('/auth/login', { idToken });
            
            if (res.data.require2FA) {
                setTempToken(res.data.tempToken);
                setView('2fa');
            } else {
                localStorage.setItem('adminToken', res.data.token);
                navigate('/admin/dashboard');
            }
        } catch (err) {
            console.error('Firebase Login Error:', err);
            let errMsg = 'Invalid email or password.';
            if (err.response?.data?.message) {
                errMsg = err.response.data.message;
            } else if (err.code === 'auth/invalid-credential' || err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password') {
                errMsg = 'Invalid email or password. Please try again.';
            } else if (err.message) {
                errMsg = err.message;
            }
            setError(errMsg);
        }
        setLoading(false);
    };

    const handleGoogleLogin = async () => {
        setLoading(true);
        setError('');
        try {
            // 1. Trigger Firebase Google Login popup
            const provider = new GoogleAuthProvider();
            const result = await signInWithPopup(auth, provider);
            const idToken = await result.user.getIdToken();

            // 2. Send Google ID Token to backend for verification and RBAC check
            const res = await axiosInstance.post('/auth/login', { idToken });

            if (res.data.require2FA) {
                setTempToken(res.data.tempToken);
                setView('2fa');
            } else {
                localStorage.setItem('adminToken', res.data.token);
                navigate('/admin/dashboard');
            }
        } catch (err) {
            console.error('Google Sign-In Error:', err);
            setError(err.response?.data?.message || err.message || 'Google sign-in failed.');
        }
        setLoading(false);
    };

    const handleVerify2FA = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            const res = await axiosInstance.post('/auth/login/verify-2fa', { 
                code: twoFactorCode, 
                tempToken 
            });
            localStorage.setItem('adminToken', res.data.token);
            navigate('/admin/dashboard');
        } catch (err) {
            setError(err.response?.data?.message || 'Invalid 2FA code. Please try again.');
        }
        setLoading(false);
    };

    const handleForgotPassword = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            await axiosInstance.post('/auth/forgot-password', { username });
            setView('reset');
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to request reset. Try again.');
        }
        setLoading(false);
    };

    const handleResetPassword = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            await axiosInstance.post('/auth/verify-otp-and-reset', { username, otp, newPassword });
            setView('login');
            setPassword('');
            alert('Password reset successfully! Please log in with your new password.');
        } catch (err) {
            setError(err.response?.data?.message || 'Invalid OTP.');
        }
        setLoading(false);
    };

    return (
        <div style={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'hsl(222 47% 5%)',
            padding: '24px',
            position: 'relative',
            overflow: 'hidden'
        }}>
            {/* Background Orbs */}
            <div style={{
                position: 'absolute',
                top: '20%',
                left: '30%',
                width: '400px',
                height: '400px',
                background: 'hsl(187 94% 43% / 0.1)',
                borderRadius: '50%',
                filter: 'blur(100px)',
                pointerEvents: 'none'
            }} />
            <div style={{
                position: 'absolute',
                bottom: '20%',
                right: '30%',
                width: '300px',
                height: '300px',
                background: 'hsl(187 94% 43% / 0.05)',
                borderRadius: '50%',
                filter: 'blur(80px)',
                pointerEvents: 'none'
            }} />

            <motion.div
                initial={{ opacity: 0, y: 20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.5 }}
                style={{
                    width: '100%',
                    maxWidth: '420px',
                    padding: '40px',
                    borderRadius: '24px',
                    background: 'hsl(222 47% 8%)',
                    border: '1px solid hsl(222 30% 18%)',
                    position: 'relative',
                    zIndex: 1
                }}
            >
                {/* Logo Banner */}
                <div style={{ textAlign: 'center', marginBottom: '40px' }}>
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.2, type: 'spring' }}
                        style={{
                            width: '64px',
                            height: '64px',
                            borderRadius: '16px',
                            background: 'linear-gradient(135deg, hsl(187 94% 43%), hsl(187 80% 35%))',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            margin: '0 auto 20px',
                            boxShadow: '0 10px 40px hsl(187 94% 43% / 0.3)'
                        }}
                    >
                        {view === '2fa' ? <ShieldCheck size={28} style={{ color: 'white' }} /> : <Lock size={28} style={{ color: 'white' }} />}
                    </motion.div>
                    <h1 style={{
                        fontSize: '1.75rem',
                        fontWeight: 700,
                        color: 'white',
                        marginBottom: '8px'
                    }}>
                        {view === '2fa' ? '2-Step Verification' : 'Admin Login'}
                    </h1>
                    <p style={{ color: 'hsl(215 20% 50%)', fontSize: '0.95rem' }}>
                        {view === '2fa' ? 'Enter your authenticator security code' : 'Enter your credentials to continue'}
                    </p>
                </div>

                {error && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        style={{
                            marginBottom: '24px',
                            padding: '14px 16px',
                            background: 'hsl(0 84% 60% / 0.1)',
                            border: '1px solid hsl(0 84% 60% / 0.3)',
                            borderRadius: '12px',
                            color: 'hsl(0 84% 70%)',
                            fontSize: '0.875rem',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '10px'
                        }}
                    >
                        <AlertCircle size={18} />
                        {error}
                    </motion.div>
                )}

                {view === 'login' && (
                    <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                        <div>
                            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, color: 'hsl(215 20% 65%)', marginBottom: '8px' }}>Email</label>
                            <div style={{ position: 'relative' }}>
                                <User size={18} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'hsl(215 20% 40%)' }} />
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="Enter email address"
                                    required
                                    style={inputStyle}
                                />
                            </div>
                        </div>

                        <div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, color: 'hsl(215 20% 65%)' }}>Password</label>
                                <button type="button" onClick={() => setView('forgot')} style={{ background: 'none', border: 'none', color: 'hsl(187 94% 43%)', fontSize: '0.875rem', cursor: 'pointer', padding: 0 }}>Forgot Password?</button>
                            </div>
                            <div style={{ position: 'relative' }}>
                                <Lock size={18} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'hsl(215 20% 40%)' }} />
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="Enter password"
                                    required
                                    style={inputStyle}
                                />
                            </div>
                        </div>

                        <motion.button
                            type="submit" disabled={loading} whileHover={{ scale: loading ? 1 : 1.02 }} whileTap={{ scale: loading ? 1 : 0.98 }}
                            style={buttonStyle}
                        >
                            {loading ? <><Loader2 size={20} style={{ animation: 'spin 1s linear infinite' }} /> Signing in...</> : 'Sign In'}
                        </motion.button>

                        <div style={{ display: 'flex', alignItems: 'center', margin: '10px 0', color: 'hsl(215 20% 35%)', fontSize: '0.8rem' }}>
                            <div style={{ flex: 1, height: '1px', background: 'hsl(222 30% 18%)' }}></div>
                            <span style={{ padding: '0 12px', textTransform: 'uppercase', letterSpacing: '1px' }}>or</span>
                            <div style={{ flex: 1, height: '1px', background: 'hsl(222 30% 18%)' }}></div>
                        </div>

                        <motion.button
                            type="button"
                            onClick={handleGoogleLogin}
                            disabled={loading}
                            whileHover={{ scale: loading ? 1 : 1.02 }}
                            whileTap={{ scale: loading ? 1 : 0.98 }}
                            style={googleButtonStyle}
                        >
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ marginRight: '8px' }}>
                                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22c-.87-2.6-2.86-4.53-5.84-4.53z" fill="#FBBC05"/>
                                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" fill="#EA4335"/>
                            </svg>
                            Sign in with Google
                        </motion.button>
                    </form>
                )}

                {view === '2fa' && (
                    <form onSubmit={handleVerify2FA} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                        <div>
                            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, color: 'hsl(215 20% 65%)', marginBottom: '8px', textAlign: 'center' }}>6-Digit 2FA Code</label>
                            <input
                                type="text"
                                value={twoFactorCode}
                                onChange={(e) => setTwoFactorCode(e.target.value)}
                                placeholder="e.g. 123456"
                                required
                                maxLength={6}
                                style={{
                                    width: '100%',
                                    padding: '16px',
                                    background: 'hsl(222 47% 12%)',
                                    border: '1px solid hsl(222 30% 22%)',
                                    borderRadius: '12px',
                                    color: 'white',
                                    fontSize: '1.25rem',
                                    outline: 'none',
                                    letterSpacing: '6px',
                                    textAlign: 'center'
                                }}
                            />
                        </div>

                        <motion.button
                            type="submit" disabled={loading} whileHover={{ scale: loading ? 1 : 1.02 }} whileTap={{ scale: loading ? 1 : 0.98 }}
                            style={buttonStyle}
                        >
                            {loading ? <><Loader2 size={20} style={{ animation: 'spin 1s linear infinite' }} /> Verifying...</> : 'Verify & Login'}
                        </motion.button>
                        <button type="button" onClick={() => setView('login')} style={{ background: 'none', border: 'none', color: 'hsl(215 20% 50%)', fontSize: '0.9rem', cursor: 'pointer', marginTop: '8px' }}>Back to Login</button>
                    </form>
                )}

                {view === 'forgot' && (
                    <form onSubmit={handleForgotPassword} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                        <p style={{ color: 'hsl(215 20% 65%)', fontSize: '0.95rem', marginBottom: '8px' }}>Enter your username. If the account exists, we'll send a password reset OTP.</p>
                        <div>
                            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, color: 'hsl(215 20% 65%)', marginBottom: '8px' }}>Username</label>
                            <div style={{ position: 'relative' }}>
                                <User size={18} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'hsl(215 20% 40%)' }} />
                                <input
                                    type="text"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    placeholder="Enter username"
                                    required
                                    style={inputStyle}
                                />
                            </div>
                        </div>

                        <motion.button
                            type="submit" disabled={loading} whileHover={{ scale: loading ? 1 : 1.02 }} whileTap={{ scale: loading ? 1 : 0.98 }}
                            style={buttonStyle}
                        >
                            {loading ? <><Loader2 size={20} style={{ animation: 'spin 1s linear infinite' }} /> Sending...</> : 'Send Reset Request'}
                        </motion.button>
                        <button type="button" onClick={() => setView('login')} style={{ background: 'none', border: 'none', color: 'hsl(215 20% 50%)', fontSize: '0.9rem', cursor: 'pointer', marginTop: '8px' }}>Cancel</button>
                    </form>
                )}

                {view === 'reset' && (
                    <form onSubmit={handleResetPassword} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                        <p style={{ color: 'hsl(215 20% 65%)', fontSize: '0.95rem', marginBottom: '8px' }}>Enter the 6-digit OTP sent to your email and your new password.</p>
                        <div>
                            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, color: 'hsl(215 20% 65%)', marginBottom: '8px' }}>6-Digit OTP</label>
                            <input
                                type="text"
                                value={otp}
                                onChange={(e) => setOtp(e.target.value)}
                                placeholder="e.g. 123456"
                                required
                                maxLength={6}
                                style={{ width: '100%', padding: '16px', background: 'hsl(222 47% 12%)', border: '1px solid hsl(222 30% 22%)', borderRadius: '12px', color: 'white', fontSize: '1rem', outline: 'none', letterSpacing: '4px', textAlign: 'center' }}
                            />
                        </div>

                        <div>
                            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, color: 'hsl(215 20% 65%)', marginBottom: '8px' }}>New Password</label>
                            <div style={{ position: 'relative' }}>
                                <Lock size={18} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'hsl(215 20% 40%)' }} />
                                <input
                                    type="password"
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                    placeholder="Enter new password"
                                    required
                                    style={inputStyle}
                                />
                            </div>
                        </div>

                        <motion.button
                            type="submit" disabled={loading} whileHover={{ scale: loading ? 1 : 1.02 }} whileTap={{ scale: loading ? 1 : 0.98 }}
                            style={buttonStyle}
                        >
                            {loading ? <><Loader2 size={20} style={{ animation: 'spin 1s linear infinite' }} /> Resetting...</> : 'Reset Password'}
                        </motion.button>
                        <button type="button" onClick={() => setView('login')} style={{ background: 'none', border: 'none', color: 'hsl(215 20% 50%)', fontSize: '0.9rem', cursor: 'pointer', marginTop: '8px' }}>Back to Login</button>
                    </form>
                )}

                <p style={{
                    textAlign: 'center',
                    marginTop: '32px',
                    color: 'hsl(215 20% 45%)',
                    fontSize: '0.875rem'
                }}>
                    <a href="/" style={{ color: 'hsl(187 94% 43%)', textDecoration: 'none' }}>
                        ← Back to Portfolio
                    </a>
                </p>
            </motion.div>

            <style>{`
                @keyframes spin {
                    from { transform: rotate(0deg); }
                    to { transform: rotate(360deg); }
                }
            `}</style>
        </div>
    );
}

const inputStyle = {
    width: '100%',
    padding: '16px 16px 16px 48px',
    background: 'hsl(222 47% 12%)',
    border: '1px solid hsl(222 30% 22%)',
    borderRadius: '12px',
    color: 'white',
    fontSize: '1rem',
    outline: 'none'
};

const buttonStyle = {
    width: '100%',
    padding: '16px',
    background: 'hsl(187 94% 43%)',
    color: 'hsl(222 47% 5%)',
    border: 'none',
    borderRadius: '12px',
    fontWeight: 700,
    fontSize: '1rem',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '10px',
    marginTop: '8px',
    boxShadow: '0 4px 20px hsl(187 94% 43% / 0.3)'
};

const googleButtonStyle = {
    width: '100%',
    padding: '14px',
    background: 'transparent',
    color: 'white',
    border: '1px solid hsl(222 30% 22%)',
    borderRadius: '12px',
    fontWeight: 600,
    fontSize: '0.95rem',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '12px',
    marginTop: '8px',
    transition: 'background 0.2s, border-color 0.2s'
};
