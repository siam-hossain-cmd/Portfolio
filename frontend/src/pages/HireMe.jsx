import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Send, Phone, Mail, Github, Linkedin, MapPin, CheckCircle, AlertCircle } from 'lucide-react'
import axios from 'axios'
import API_URL from '../config/api'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

// Animation Variants
const fadeInUp = {
    hidden: { opacity: 0, y: 40 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] }
    }
}

export default function HireMe() {
    const [isScrolled, setIsScrolled] = useState(false)
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        projectType: 'Web Development',
        budget: '',
        message: ''
    })
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [submitStatus, setSubmitStatus] = useState(null)

    // Theme state management
    const [isDarkMode, setIsDarkMode] = useState(() => {
        const saved = localStorage.getItem('theme')
        return saved ? saved === 'dark' : true
    })

    useEffect(() => {
        const handleScroll = () => setIsScrolled(window.scrollY > 50)
        window.addEventListener('scroll', handleScroll)
        return () => window.removeEventListener('scroll', handleScroll)
    }, [])

    useEffect(() => {
        if (isDarkMode) {
            document.body.classList.remove('light-mode')
            localStorage.setItem('theme', 'dark')
        } else {
            document.body.classList.add('light-mode')
            localStorage.setItem('theme', 'light')
        }
    }, [isDarkMode])

    const toggleTheme = () => setIsDarkMode(!isDarkMode)

    const handleSubmit = async (e) => {
        e.preventDefault()
        setIsSubmitting(true)
        setSubmitStatus(null)

        try {
            // Assuming the backend has a general message endpoint or we can add a specific one.
            // Using the same endpoint as the main contact form for now.
            await axios.post(`${API_URL}/messages`, {
                ...formData,
                subject: `New Hire Inquiry: ${formData.projectType}`
            })
            setSubmitStatus('success')
            setFormData({ name: '', email: '', projectType: 'Web Development', budget: '', message: '' })
            setTimeout(() => setSubmitStatus(null), 5000)
        } catch (error) {
            console.error('Error sending message:', error)
            setSubmitStatus('error')
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
            <Navbar isScrolled={isScrolled} isDarkMode={isDarkMode} toggleTheme={toggleTheme} />

            <main style={{ flex: 1, paddingTop: '120px', paddingBottom: '80px', paddingLeft: '24px', paddingRight: '24px' }}>
                <motion.div
                    initial="hidden"
                    animate="visible"
                    variants={fadeInUp}
                    style={{ maxWidth: '800px', margin: '0 auto' }}
                >
                    <div style={{ textAlign: 'center', marginBottom: '60px' }}>
                        <span className="font-mono" style={{ color: 'var(--accent)', fontSize: '0.875rem', display: 'block', marginBottom: '16px' }}>
                            Available for Freelance
                        </span>
                        <h1 style={{ fontSize: 'clamp(2.5rem, 5vw, 3.5rem)', fontWeight: 700, marginBottom: '24px', lineHeight: 1.1 }}>
                            Let's Build Something <br /><span className="text-gradient">Amazing Together</span>
                        </h1>
                        <p style={{ color: 'var(--text-secondary)', fontSize: '1.25rem', maxWidth: '600px', margin: '0 auto' }}>
                            I help businesses and individuals turn their ideas into reality with modern web and mobile solutions.
                        </p>
                    </div>

                    <div className="glass" style={{ padding: '40px', borderRadius: '24px', border: '1px solid var(--border)' }}>
                        <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '24px' }}>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '24px' }}>
                                <div>
                                    <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: 500, marginBottom: '8px', color: 'var(--text-primary)' }}>Name</label>
                                    <input
                                        type="text"
                                        value={formData.name}
                                        onChange={e => setFormData({ ...formData, name: e.target.value })}
                                        required
                                        placeholder="John Doe"
                                        style={{ width: '100%', padding: '16px', borderRadius: '12px', background: 'var(--bg-secondary)', border: '1px solid var(--border)', color: 'var(--text-primary)', outline: 'none' }}
                                    />
                                </div>
                                <div>
                                    <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: 500, marginBottom: '8px', color: 'var(--text-primary)' }}>Email</label>
                                    <input
                                        type="email"
                                        value={formData.email}
                                        onChange={e => setFormData({ ...formData, email: e.target.value })}
                                        required
                                        placeholder="john@example.com"
                                        style={{ width: '100%', padding: '16px', borderRadius: '12px', background: 'var(--bg-secondary)', border: '1px solid var(--border)', color: 'var(--text-primary)', outline: 'none' }}
                                    />
                                </div>
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '24px' }}>
                                <div>
                                    <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: 500, marginBottom: '8px', color: 'var(--text-primary)' }}>Project Type</label>
                                    <select
                                        value={formData.projectType}
                                        onChange={e => setFormData({ ...formData, projectType: e.target.value })}
                                        style={{ width: '100%', padding: '16px', borderRadius: '12px', background: 'var(--bg-secondary)', border: '1px solid var(--border)', color: 'var(--text-primary)', outline: 'none', appearance: 'none', backgroundImage: 'url("data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%23007CB2%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.5-12.8z%22%2F%3E%3C%2Fsvg%3E")', backgroundRepeat: 'no-repeat', backgroundPosition: 'right 16px center', backgroundSize: '12px' }}
                                    >
                                        <option>Web Development</option>
                                        <option>Mobile App (Flutter)</option>
                                        <option>UI/UX Design</option>
                                        <option>Consultation</option>
                                        <option>Other</option>
                                    </select>
                                </div>
                                <div>
                                    <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: 500, marginBottom: '8px', color: 'var(--text-primary)' }}>Budget Range (USD)</label>
                                    <input
                                        type="text"
                                        value={formData.budget}
                                        onChange={e => setFormData({ ...formData, budget: e.target.value })}
                                        placeholder="e.g. $500 - $1,000"
                                        style={{ width: '100%', padding: '16px', borderRadius: '12px', background: 'var(--bg-secondary)', border: '1px solid var(--border)', color: 'var(--text-primary)', outline: 'none' }}
                                    />
                                </div>
                            </div>

                            <div>
                                <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: 500, marginBottom: '8px', color: 'var(--text-primary)' }}>Project Details</label>
                                <textarea
                                    value={formData.message}
                                    onChange={e => setFormData({ ...formData, message: e.target.value })}
                                    required
                                    placeholder="Tell me about your project, goals, and timeline..."
                                    rows={6}
                                    style={{ width: '100%', padding: '16px', borderRadius: '12px', background: 'var(--bg-secondary)', border: '1px solid var(--border)', color: 'var(--text-primary)', outline: 'none', resize: 'vertical' }}
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="glow"
                                style={{
                                    width: '100%',
                                    padding: '18px',
                                    background: isSubmitting ? 'hsl(187 94% 35%)' : 'var(--accent)',
                                    color: 'white',
                                    borderRadius: '12px',
                                    fontWeight: 600,
                                    fontSize: '1rem',
                                    border: 'none',
                                    cursor: isSubmitting ? 'not-allowed' : 'pointer',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    gap: '10px',
                                    opacity: isSubmitting ? 0.8 : 1,
                                    transition: 'all 0.3s'
                                }}
                            >
                                {isSubmitting ? 'Sending Request...' : 'Send Request'} {!isSubmitting && <Send size={20} />}
                            </button>

                            {submitStatus === 'success' && (
                                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} style={{ padding: '16px', background: 'hsl(142 76% 36% / 0.15)', border: '1px solid hsl(142 76% 36% / 0.3)', borderRadius: '12px', color: 'hsl(142 76% 36%)', textAlign: 'center', fontWeight: 500, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                                    <CheckCircle size={20} /> Request sent successfully! I'll be in touch.
                                </motion.div>
                            )}
                            {submitStatus === 'error' && (
                                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} style={{ padding: '16px', background: 'hsl(0 84% 60% / 0.15)', border: '1px solid hsl(0 84% 60% / 0.3)', borderRadius: '12px', color: 'hsl(0 84% 60%)', textAlign: 'center', fontWeight: 500, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                                    <AlertCircle size={20} /> Something went wrong. Please try again.
                                </motion.div>
                            )}
                        </form>
                    </div>

                    <div style={{ marginTop: '60px', textAlign: 'center' }}>
                        <p style={{ color: 'var(--text-secondary)', marginBottom: '24px' }}>Or reach out directly via</p>
                        <div style={{ display: 'flex', justifyContent: 'center', gap: '24px', flexWrap: 'wrap' }}>
                            <a href="mailto:s.siamhossain.h@gmail.com" style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-primary)', textDecoration: 'none', fontWeight: 500 }}><Mail size={20} style={{ color: 'var(--accent)' }} /> Email</a>
                            <a href="https://wa.me/601123501201" target="_blank" rel="noopener noreferrer" style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-primary)', textDecoration: 'none', fontWeight: 500 }}><Phone size={20} style={{ color: 'var(--accent)' }} /> WhatsApp</a>
                            <a href="https://www.linkedin.com/in/siam-hossain-66295439b" target="_blank" rel="noopener noreferrer" style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-primary)', textDecoration: 'none', fontWeight: 500 }}><Linkedin size={20} style={{ color: 'var(--accent)' }} /> LinkedIn</a>
                        </div>
                    </div>
                </motion.div>
            </main>

            <Footer />
        </div>
    )
}
