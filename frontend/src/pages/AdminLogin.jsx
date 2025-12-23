import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { motion } from 'framer-motion'
import { Lock, User, Loader2, AlertCircle } from 'lucide-react'
import API_URL from '../config/api'

export default function AdminLogin() {
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)
    const navigate = useNavigate()

    const handleLogin = async (e) => {
        e.preventDefault()
        setLoading(true)
        setError('')
        try {
            const res = await axios.post(`${API_URL}/auth/login`, { username, password })
            localStorage.setItem('adminToken', res.data.token)
            navigate('/admin/dashboard')
        } catch (err) {
            setError('Invalid credentials. Please try again.')
        }
        setLoading(false)
    }

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
            {/* Background decoration */}
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
                {/* Logo */}
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
                        <Lock size={28} style={{ color: 'white' }} />
                    </motion.div>
                    <h1 style={{
                        fontSize: '1.75rem',
                        fontWeight: 700,
                        color: 'white',
                        marginBottom: '8px'
                    }}>
                        Admin Login
                    </h1>
                    <p style={{ color: 'hsl(215 20% 50%)', fontSize: '0.95rem' }}>
                        Enter your credentials to continue
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

                <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    <div>
                        <label style={{
                            display: 'block',
                            fontSize: '0.875rem',
                            fontWeight: 500,
                            color: 'hsl(215 20% 65%)',
                            marginBottom: '8px'
                        }}>
                            Username
                        </label>
                        <div style={{ position: 'relative' }}>
                            <User
                                size={18}
                                style={{
                                    position: 'absolute',
                                    left: '16px',
                                    top: '50%',
                                    transform: 'translateY(-50%)',
                                    color: 'hsl(215 20% 40%)'
                                }}
                            />
                            <input
                                type="text"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                placeholder="Enter username"
                                required
                                style={{
                                    width: '100%',
                                    padding: '16px 16px 16px 48px',
                                    background: 'hsl(222 47% 12%)',
                                    border: '1px solid hsl(222 30% 22%)',
                                    borderRadius: '12px',
                                    color: 'white',
                                    fontSize: '1rem',
                                    outline: 'none',
                                    transition: 'border-color 0.2s'
                                }}
                                onFocus={(e) => e.target.style.borderColor = 'hsl(187 94% 43%)'}
                                onBlur={(e) => e.target.style.borderColor = 'hsl(222 30% 22%)'}
                            />
                        </div>
                    </div>

                    <div>
                        <label style={{
                            display: 'block',
                            fontSize: '0.875rem',
                            fontWeight: 500,
                            color: 'hsl(215 20% 65%)',
                            marginBottom: '8px'
                        }}>
                            Password
                        </label>
                        <div style={{ position: 'relative' }}>
                            <Lock
                                size={18}
                                style={{
                                    position: 'absolute',
                                    left: '16px',
                                    top: '50%',
                                    transform: 'translateY(-50%)',
                                    color: 'hsl(215 20% 40%)'
                                }}
                            />
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Enter password"
                                required
                                style={{
                                    width: '100%',
                                    padding: '16px 16px 16px 48px',
                                    background: 'hsl(222 47% 12%)',
                                    border: '1px solid hsl(222 30% 22%)',
                                    borderRadius: '12px',
                                    color: 'white',
                                    fontSize: '1rem',
                                    outline: 'none',
                                    transition: 'border-color 0.2s'
                                }}
                                onFocus={(e) => e.target.style.borderColor = 'hsl(187 94% 43%)'}
                                onBlur={(e) => e.target.style.borderColor = 'hsl(222 30% 22%)'}
                            />
                        </div>
                    </div>

                    <motion.button
                        type="submit"
                        disabled={loading}
                        whileHover={{ scale: loading ? 1 : 1.02 }}
                        whileTap={{ scale: loading ? 1 : 0.98 }}
                        style={{
                            width: '100%',
                            padding: '16px',
                            background: loading ? 'hsl(187 94% 35%)' : 'hsl(187 94% 43%)',
                            color: 'hsl(222 47% 5%)',
                            border: 'none',
                            borderRadius: '12px',
                            fontWeight: 700,
                            fontSize: '1rem',
                            cursor: loading ? 'not-allowed' : 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '10px',
                            marginTop: '8px',
                            boxShadow: '0 4px 20px hsl(187 94% 43% / 0.3)'
                        }}
                    >
                        {loading ? (
                            <>
                                <Loader2 size={20} style={{ animation: 'spin 1s linear infinite' }} />
                                Signing in...
                            </>
                        ) : (
                            'Sign In'
                        )}
                    </motion.button>
                </form>

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
    )
}
