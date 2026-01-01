import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Mail, Phone, Linkedin, Send, CheckCircle, AlertCircle, ChevronDown, Paperclip } from 'lucide-react'
import axios from 'axios'
import API_URL from '../config/api'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

export default function HireMe() {
    const [isScrolled, setIsScrolled] = useState(false)
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        projectType: 'Web Development',
        budget: '',
        details: '',
        attachmentUrl: ''
    })
    const [file, setFile] = useState(null)
    const [loading, setLoading] = useState(false)
    const [status, setStatus] = useState(null)

    // Theme state management (default dark)
    const [isDarkMode, setIsDarkMode] = useState(true)

    useEffect(() => {
        const handleScroll = () => setIsScrolled(window.scrollY > 50)
        window.addEventListener('scroll', handleScroll)
        return () => window.removeEventListener('scroll', handleScroll)
    }, [])

    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)
        setStatus(null)

        try {
            let attachmentUrl = ''
            if (file) {
                const uploadData = new FormData()
                uploadData.append('file', file)

                // Upload file to backend
                const uploadRes = await axios.post(`${API_URL}/upload`, uploadData, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                })
                attachmentUrl = uploadRes.data.url
            }

            await axios.post(`${API_URL}/messages`, {
                ...formData,
                attachmentUrl,
                subject: `New Hire Inquiry: ${formData.projectType}`
            })

            setStatus('success')
            setFormData({ name: '', email: '', projectType: 'Web Development', budget: '', details: '', attachmentUrl: '' })
            setFile(null)
            // Reset file input manually
            const fileInput = document.getElementById('file-input')
            if (fileInput) fileInput.value = ''

            setTimeout(() => setStatus(null), 5000)
        } catch (err) {
            console.error(err)
            setStatus('error')
        }
        setLoading(false)
    }

    const inputStyle = {
        width: '100%',
        padding: '12px 16px',
        background: 'hsl(222 47% 12%)',
        border: '1px solid hsl(222 30% 18%)',
        borderRadius: '8px',
        color: 'white',
        fontSize: '1rem',
        outline: 'none',
        transition: 'border-color 0.3s'
    }

    return (
        <div style={{ minHeight: '100vh', background: 'hsl(222 47% 5%)', color: 'white', overflowX: 'hidden' }}>
            <Navbar isScrolled={isScrolled} isDarkMode={true} toggleTheme={() => { }} />

            <div style={{ paddingTop: '120px', paddingBottom: '80px', maxWidth: '1200px', margin: '0 auto', paddingLeft: '24px', paddingRight: '24px' }}>
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    style={{ textAlign: 'center', marginBottom: '60px' }}
                >
                    <span style={{ color: 'var(--accent)', fontSize: '0.875rem', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '16px', display: 'inline-block' }}>
                        Hire Me
                    </span>
                    <h1 style={{ fontSize: '3.5rem', fontWeight: 700, marginBottom: '24px', background: 'linear-gradient(135deg, white 0%, hsl(215 20% 65%) 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                        Let's Work Together
                    </h1>
                    <p style={{ fontSize: '1.125rem', color: 'hsl(215 20% 65%)', maxWidth: '600px', margin: '0 auto' }}>
                        I help businesses and individuals turn their ideas into reality with modern web and mobile solutions.
                    </p>
                </motion.div>

                <div style={{ maxWidth: '700px', margin: '0 auto', background: 'hsl(222 47% 8%)', padding: '40px', borderRadius: '20px', border: '1px solid hsl(222 30% 18%)' }}>
                    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '24px' }}>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                <label style={{ fontSize: '0.875rem', fontWeight: 500, color: 'hsl(215 20% 80%)' }}>Name</label>
                                <input
                                    type="text"
                                    placeholder="John Doe"
                                    value={formData.name}
                                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                                    required
                                    style={inputStyle}
                                />
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                <label style={{ fontSize: '0.875rem', fontWeight: 500, color: 'hsl(215 20% 80%)' }}>Email</label>
                                <input
                                    type="email"
                                    placeholder="john@example.com"
                                    value={formData.email}
                                    onChange={e => setFormData({ ...formData, email: e.target.value })}
                                    required
                                    style={inputStyle}
                                />
                            </div>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '24px' }}>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                <label style={{ fontSize: '0.875rem', fontWeight: 500, color: 'hsl(215 20% 80%)' }}>Project Type</label>
                                <div style={{ position: 'relative' }}>
                                    <select
                                        value={formData.projectType}
                                        onChange={e => setFormData({ ...formData, projectType: e.target.value })}
                                        style={{ ...inputStyle, appearance: 'none', cursor: 'pointer' }}
                                    >
                                        <option>Web Development</option>
                                        <option>Mobile App</option>
                                        <option>UI/UX Design</option>
                                        <option>Consultation</option>
                                        <option>Other</option>
                                    </select>
                                    <ChevronDown size={20} style={{ position: 'absolute', right: '16px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', color: 'hsl(215 20% 65%)' }} />
                                </div>
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                <label style={{ fontSize: '0.875rem', fontWeight: 500, color: 'hsl(215 20% 80%)' }}>Budget Range (USD)</label>
                                <input
                                    type="text"
                                    placeholder="e.g. $500 - $1,000"
                                    value={formData.budget}
                                    onChange={e => setFormData({ ...formData, budget: e.target.value })}
                                    style={inputStyle}
                                />
                            </div>
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                            <label style={{ fontSize: '0.875rem', fontWeight: 500, color: 'hsl(215 20% 80%)' }}>Project Details</label>
                            <textarea
                                placeholder="Tell me about your project, goals, and timeline..."
                                value={formData.details}
                                onChange={e => setFormData({ ...formData, details: e.target.value })}
                                required
                                rows={5}
                                style={{ ...inputStyle, resize: 'vertical' }}
                            />
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                            <label style={{ fontSize: '0.875rem', fontWeight: 500, color: 'hsl(215 20% 80%)' }}>Attachment (Optional)</label>
                            <div style={{ position: 'relative' }}>
                                <input
                                    id="file-input"
                                    type="file"
                                    onChange={e => setFile(e.target.files[0])}
                                    style={{ ...inputStyle, paddingLeft: '48px', cursor: 'pointer' }}
                                    accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                                />
                                <Paperclip size={20} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'hsl(215 20% 65%)', pointerEvents: 'none' }} />
                            </div>
                            <span style={{ fontSize: '0.75rem', color: 'hsl(215 20% 50%)' }}>Accepted formats: PDF, DOC, JPG, PNG</span>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="glow"
                            style={{
                                width: '100%',
                                padding: '18px',
                                background: loading ? 'hsl(187 94% 35%)' : 'var(--accent)',
                                color: 'white',
                                borderRadius: '12px',
                                fontWeight: 600,
                                fontSize: '1rem',
                                border: 'none',
                                cursor: loading ? 'not-allowed' : 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: '10px',
                                opacity: loading ? 0.8 : 1,
                                transition: 'all 0.3s'
                            }}
                        >
                            {loading ? 'Sending Request...' : 'Send Request'} {!loading && <Send size={20} />}
                        </button>

                        {status === 'success' && (
                            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} style={{ padding: '16px', background: 'hsl(142 76% 36% / 0.15)', border: '1px solid hsl(142 76% 36% / 0.3)', borderRadius: '12px', color: 'hsl(142 76% 36%)', textAlign: 'center', fontWeight: 500, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                                <CheckCircle size={20} /> Request sent successfully! I'll be in touch.
                            </motion.div>
                        )}
                        {status === 'error' && (
                            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} style={{ padding: '16px', background: 'hsl(0 84% 60% / 0.15)', border: '1px solid hsl(0 84% 60% / 0.3)', borderRadius: '12px', color: 'hsl(0 84% 60%)', textAlign: 'center', fontWeight: 500, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                                <AlertCircle size={20} /> Something went wrong. Please try again.
                            </motion.div>
                        )}
                    </form>
                </div>

                <div style={{ marginTop: '60px', textAlign: 'center' }}>
                    <p style={{ color: 'hsl(215 20% 65%)', marginBottom: '24px' }}>Or reach out directly via</p>
                    <div style={{ display: 'flex', justifyContent: 'center', gap: '24px', flexWrap: 'wrap' }}>
                        <a href="mailto:s.siamhossain.h@gmail.com" style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'white', textDecoration: 'none', fontWeight: 500 }}><Mail size={20} style={{ color: 'var(--accent)' }} /> Email</a>
                        <a href="https://wa.me/601123501201" target="_blank" rel="noopener noreferrer" style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'white', textDecoration: 'none', fontWeight: 500 }}><Phone size={20} style={{ color: 'var(--accent)' }} /> WhatsApp</a>
                        <a href="https://www.linkedin.com/in/siam-hossain-66295439b" target="_blank" rel="noopener noreferrer" style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'white', textDecoration: 'none', fontWeight: 500 }}><Linkedin size={20} style={{ color: 'var(--accent)' }} /> LinkedIn</a>
                    </div>
                </div>

                <Footer />
            </div>
        </div>
    )
}
