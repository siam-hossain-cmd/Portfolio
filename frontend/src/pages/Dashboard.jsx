import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { motion, AnimatePresence } from 'framer-motion'
import {
    Plus, Trash2, LogOut, LayoutGrid, Award, MessageSquare,
    X, Github, ExternalLink, Loader2, CheckCircle, AlertCircle,
    Mail, Clock, User, Folder, Home, TrendingUp, Eye, Activity, Paperclip, Send
} from 'lucide-react'
import API_URL from '../config/api'

// Toast notification component
function Toast({ message, type, onClose }) {
    useEffect(() => {
        const timer = setTimeout(onClose, 3000)
        return () => clearTimeout(timer)
    }, [onClose])

    return (
        <motion.div
            initial={{ opacity: 0, y: -50, x: '-50%' }}
            animate={{ opacity: 1, y: 0, x: '-50%' }}
            exit={{ opacity: 0, y: -50, x: '-50%' }}
            style={{
                position: 'fixed',
                top: '24px',
                left: '50%',
                padding: '16px 24px',
                borderRadius: '12px',
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                zIndex: 100,
                background: type === 'success' ? 'hsl(142 76% 36%)' : 'hsl(0 84% 60%)',
                color: 'white',
                fontWeight: 500,
                boxShadow: '0 10px 40px rgba(0,0,0,0.3)'
            }}
        >
            {type === 'success' ? <CheckCircle size={20} /> : <AlertCircle size={20} />}
            {message}
        </motion.div>
    )
}

// Modal component
function Modal({ isOpen, onClose, title, children }) {
    if (!isOpen) return null

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            style={{
                position: 'fixed',
                inset: 0,
                background: 'rgba(0,0,0,0.8)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: 50,
                padding: '24px'
            }}
        >
            <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                onClick={e => e.stopPropagation()}
                style={{
                    background: 'hsl(222 47% 8%)',
                    borderRadius: '20px',
                    padding: '32px',
                    width: '100%',
                    maxWidth: '500px',
                    border: '1px solid hsl(222 30% 18%)'
                }}
            >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                    <h3 style={{ fontSize: '1.5rem', fontWeight: 700, color: 'white' }}>{title}</h3>
                    <button onClick={onClose} style={{ color: 'hsl(215 20% 65%)', background: 'none', border: 'none', cursor: 'pointer' }}>
                        <X size={24} />
                    </button>
                </div>
                {children}
            </motion.div>
        </motion.div>
    )
}

export default function Dashboard() {
    const [tab, setTab] = useState('overview')
    const [projects, setProjects] = useState([])
    const [skills, setSkills] = useState([])
    const [messages, setMessages] = useState([])
    const [loading, setLoading] = useState(true)
    const [toast, setToast] = useState(null)
    const [showAddModal, setShowAddModal] = useState(false)
    const [showDeleteModal, setShowDeleteModal] = useState(null)
    const navigate = useNavigate()

    // Form states
    const [projectForm, setProjectForm] = useState({
        title: '', description: '', image: '', githubLink: '', liveLink: '', tags: ''
    })
    const [skillForm, setSkillForm] = useState({
        name: '', category: 'Frontend', icon: ''
    })

    useEffect(() => {
        const token = localStorage.getItem('adminToken')
        if (!token) {
            navigate('/admin/login')
            return
        }
        fetchData()
    }, [navigate])

    const fetchData = async () => {
        setLoading(true)
        try {
            const [projectsRes, skillsRes, messagesRes] = await Promise.all([
                axios.get(`${API_URL}/projects`),
                axios.get(`${API_URL}/skills`),
                axios.get(`${API_URL}/messages`)
            ])
            setProjects(projectsRes.data)
            setSkills(skillsRes.data)
            setMessages(messagesRes.data)
        } catch (err) {
            console.error(err)
        }
        setLoading(false)
    }

    const handleLogout = () => {
        localStorage.removeItem('adminToken')
        navigate('/admin/login')
    }

    const showToast = (message, type = 'success') => {
        setToast({ message, type })
    }

    // Project CRUD
    const handleAddProject = async (e) => {
        e.preventDefault()
        try {
            const tags = projectForm.tags.split(',').map(t => t.trim()).filter(t => t)
            await axios.post(`${API_URL}/projects`, { ...projectForm, tags })
            showToast('Project added successfully!')
            setShowAddModal(false)
            setProjectForm({ title: '', description: '', image: '', githubLink: '', liveLink: '', tags: '' })
            fetchData()
        } catch (err) {
            showToast('Failed to add project', 'error')
        }
    }

    const handleDeleteProject = async (id) => {
        try {
            await axios.delete(`${API_URL}/projects/${id}`)
            showToast('Project deleted!')
            setShowDeleteModal(null)
            fetchData()
        } catch (err) {
            showToast('Failed to delete project', 'error')
        }
    }

    // Skill CRUD
    const handleAddSkill = async (e) => {
        e.preventDefault()
        try {
            await axios.post(`${API_URL}/skills`, skillForm)
            showToast('Skill added successfully!')
            setShowAddModal(false)
            setSkillForm({ name: '', category: 'Frontend', icon: '' })
            fetchData()
        } catch (err) {
            showToast('Failed to add skill', 'error')
        }
    }

    const tabs = [
        { id: 'overview', label: 'Overview', icon: Home },
        { id: 'projects', label: 'Projects', icon: LayoutGrid, count: projects.length },
        { id: 'skills', label: 'Skills', icon: Award, count: skills.length },
        { id: 'messages', label: 'Messages', icon: MessageSquare, count: messages.length }
    ]

    return (
        <div style={{ minHeight: '100vh', background: 'hsl(222 47% 5%)', color: 'white', display: 'flex' }}>
            {/* Toast */}
            <AnimatePresence>
                {toast && <Toast {...toast} onClose={() => setToast(null)} />}
            </AnimatePresence>

            {/* Delete Confirmation Modal */}
            <AnimatePresence>
                {showDeleteModal && (
                    <Modal isOpen={true} onClose={() => setShowDeleteModal(null)} title="Confirm Delete">
                        <p style={{ color: 'hsl(215 20% 65%)', marginBottom: '24px' }}>
                            Are you sure you want to delete this item? This action cannot be undone.
                        </p>
                        <div style={{ display: 'flex', gap: '12px' }}>
                            <button
                                onClick={() => setShowDeleteModal(null)}
                                style={{ flex: 1, padding: '12px', background: 'hsl(222 30% 18%)', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 600 }}
                            >
                                Cancel
                            </button>
                            <button
                                onClick={() => handleDeleteProject(showDeleteModal)}
                                style={{ flex: 1, padding: '12px', background: 'hsl(0 84% 60%)', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 600 }}
                            >
                                Delete
                            </button>
                        </div>
                    </Modal>
                )}
            </AnimatePresence>

            {/* Add Modal */}
            <AnimatePresence>
                {showAddModal && (
                    <Modal isOpen={true} onClose={() => setShowAddModal(false)} title={tab === 'projects' ? 'Add Project' : 'Add Skill'}>
                        {tab === 'projects' ? (
                            <form onSubmit={handleAddProject} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                                <input
                                    placeholder="Project Title"
                                    value={projectForm.title}
                                    onChange={e => setProjectForm({ ...projectForm, title: e.target.value })}
                                    required
                                    style={inputStyle}
                                />
                                <textarea
                                    placeholder="Description"
                                    value={projectForm.description}
                                    onChange={e => setProjectForm({ ...projectForm, description: e.target.value })}
                                    required
                                    rows={3}
                                    style={{ ...inputStyle, resize: 'none' }}
                                />
                                <input
                                    placeholder="Image URL"
                                    value={projectForm.image}
                                    onChange={e => setProjectForm({ ...projectForm, image: e.target.value })}
                                    required
                                    style={inputStyle}
                                />
                                <input
                                    placeholder="GitHub Link"
                                    value={projectForm.githubLink}
                                    onChange={e => setProjectForm({ ...projectForm, githubLink: e.target.value })}
                                    style={inputStyle}
                                />
                                <input
                                    placeholder="Live Demo Link"
                                    value={projectForm.liveLink}
                                    onChange={e => setProjectForm({ ...projectForm, liveLink: e.target.value })}
                                    style={inputStyle}
                                />
                                <input
                                    placeholder="Tags (comma separated)"
                                    value={projectForm.tags}
                                    onChange={e => setProjectForm({ ...projectForm, tags: e.target.value })}
                                    style={inputStyle}
                                />
                                <button type="submit" style={buttonStyle}>
                                    Add Project
                                </button>
                            </form>
                        ) : (
                            <form onSubmit={handleAddSkill} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                                <input
                                    placeholder="Skill Name"
                                    value={skillForm.name}
                                    onChange={e => setSkillForm({ ...skillForm, name: e.target.value })}
                                    required
                                    style={inputStyle}
                                />
                                <select
                                    value={skillForm.category}
                                    onChange={e => setSkillForm({ ...skillForm, category: e.target.value })}
                                    style={inputStyle}
                                >
                                    <option value="Frontend">Frontend</option>
                                    <option value="Backend">Backend</option>
                                    <option value="Mobile">Mobile</option>
                                    <option value="Database">Database</option>
                                    <option value="Tools">DevOps & Tools</option>
                                </select>
                                <input
                                    placeholder="Icon URL (optional)"
                                    value={skillForm.icon}
                                    onChange={e => setSkillForm({ ...skillForm, icon: e.target.value })}
                                    style={inputStyle}
                                />
                                <button type="submit" style={buttonStyle}>
                                    Add Skill
                                </button>
                            </form>
                        )}
                    </Modal>
                )}
            </AnimatePresence>

            {/* Sidebar */}
            <motion.div
                initial={{ x: -100, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                style={{
                    width: '280px',
                    borderRight: '1px solid hsl(222 30% 18%)',
                    padding: '32px 24px',
                    display: 'flex',
                    flexDirection: 'column',
                    background: 'hsl(222 47% 6%)'
                }}
            >
                <div style={{ marginBottom: '48px' }}>
                    <h1 style={{ fontSize: '1.5rem', fontWeight: 700, background: 'linear-gradient(135deg, hsl(187 94% 43%), hsl(187 80% 60%))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                        Admin Panel
                    </h1>
                    <p style={{ color: 'hsl(215 20% 50%)', fontSize: '0.875rem', marginTop: '4px' }}>Manage your portfolio</p>
                </div>

                <nav style={{ display: 'flex', flexDirection: 'column', gap: '8px', flex: 1 }}>
                    {tabs.map(t => (
                        <motion.button
                            key={t.id}
                            onClick={() => setTab(t.id)}
                            whileHover={{ x: 4 }}
                            whileTap={{ scale: 0.98 }}
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '12px',
                                padding: '14px 16px',
                                borderRadius: '12px',
                                border: 'none',
                                cursor: 'pointer',
                                background: tab === t.id ? 'hsl(187 94% 43%)' : 'transparent',
                                color: tab === t.id ? 'hsl(222 47% 5%)' : 'hsl(215 20% 65%)',
                                fontWeight: 600,
                                fontSize: '0.95rem',
                                transition: 'all 0.2s'
                            }}
                        >
                            <t.icon size={20} />
                            {t.label}
                            {t.count !== undefined && (
                                <span style={{
                                    marginLeft: 'auto',
                                    background: tab === t.id ? 'hsl(222 47% 5% / 0.2)' : 'hsl(222 30% 18%)',
                                    padding: '4px 10px',
                                    borderRadius: '20px',
                                    fontSize: '0.75rem'
                                }}>
                                    {t.count}
                                </span>
                            )}
                        </motion.button>
                    ))}
                </nav>

                <motion.button
                    onClick={handleLogout}
                    whileHover={{ x: 4 }}
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px',
                        padding: '14px 16px',
                        borderRadius: '12px',
                        border: 'none',
                        cursor: 'pointer',
                        background: 'transparent',
                        color: 'hsl(0 84% 60%)',
                        fontWeight: 600,
                        fontSize: '0.95rem'
                    }}
                >
                    <LogOut size={20} />
                    Logout
                </motion.button>
            </motion.div>

            {/* Main Content */}
            <div style={{ flex: 1, padding: '32px 48px', overflowY: 'auto' }}>
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    key={tab}
                >
                    {/* Header */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
                        <div>
                            <h2 style={{ fontSize: '2rem', fontWeight: 700, textTransform: 'capitalize' }}>{tab}</h2>
                            <p style={{ color: 'hsl(215 20% 50%)', marginTop: '4px' }}>
                                {tab === 'overview' && 'Welcome back! Here\'s your portfolio summary'}
                                {tab === 'projects' && 'Manage your portfolio projects'}
                                {tab === 'skills' && 'Manage your skills and technologies'}
                                {tab === 'messages' && 'View contact form submissions'}
                            </p>
                        </div>
                        {(tab === 'projects' || tab === 'skills') && (
                            <motion.button
                                onClick={() => setShowAddModal(true)}
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '8px',
                                    padding: '12px 24px',
                                    background: 'hsl(187 94% 43%)',
                                    color: 'hsl(222 47% 5%)',
                                    border: 'none',
                                    borderRadius: '12px',
                                    fontWeight: 700,
                                    cursor: 'pointer'
                                }}
                            >
                                <Plus size={20} />
                                Add {tab === 'projects' ? 'Project' : 'Skill'}
                            </motion.button>
                        )}
                    </div>

                    {/* Loading State */}
                    {loading ? (
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '300px' }}>
                            <Loader2 size={40} style={{ animation: 'spin 1s linear infinite', color: 'hsl(187 94% 43%)' }} />
                        </div>
                    ) : (
                        <>
                            {/* Overview Tab */}
                            {tab === 'overview' && (
                                <div>
                                    {/* Stats Cards */}
                                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '20px', marginBottom: '40px' }}>
                                        {[
                                            { label: 'Total Projects', value: projects.length, icon: Folder, color: 'hsl(187 94% 43%)', trend: '+2 this month' },
                                            { label: 'Skills Listed', value: skills.length, icon: Award, color: 'hsl(142 76% 45%)', trend: 'Growing' },
                                            { label: 'Messages', value: messages.length, icon: MessageSquare, color: 'hsl(262 83% 58%)', trend: 'New inbox' },
                                            { label: 'Profile Views', value: '1.2K', icon: Eye, color: 'hsl(31 97% 55%)', trend: '+15% this week' }
                                        ].map((stat, i) => (
                                            <motion.div
                                                key={stat.label}
                                                initial={{ opacity: 0, y: 20 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                transition={{ delay: i * 0.1 }}
                                                whileHover={{ y: -4, transition: { duration: 0.2 } }}
                                                style={{
                                                    padding: '24px',
                                                    borderRadius: '16px',
                                                    background: 'hsl(222 47% 8%)',
                                                    border: '1px solid hsl(222 30% 18%)',
                                                    position: 'relative',
                                                    overflow: 'hidden'
                                                }}
                                            >
                                                {/* Background glow */}
                                                <div style={{
                                                    position: 'absolute',
                                                    top: '-20px',
                                                    right: '-20px',
                                                    width: '80px',
                                                    height: '80px',
                                                    borderRadius: '50%',
                                                    background: stat.color,
                                                    opacity: 0.1,
                                                    filter: 'blur(20px)'
                                                }} />
                                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                                                    <div style={{
                                                        width: '48px',
                                                        height: '48px',
                                                        borderRadius: '12px',
                                                        background: `${stat.color}20`,
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        justifyContent: 'center'
                                                    }}>
                                                        <stat.icon size={24} style={{ color: stat.color }} />
                                                    </div>
                                                    <span style={{ fontSize: '0.75rem', color: 'hsl(142 76% 45%)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                                        <TrendingUp size={14} /> {stat.trend}
                                                    </span>
                                                </div>
                                                <motion.h3
                                                    initial={{ opacity: 0 }}
                                                    animate={{ opacity: 1 }}
                                                    style={{ fontSize: '2rem', fontWeight: 700, marginBottom: '4px' }}
                                                >
                                                    {stat.value}
                                                </motion.h3>
                                                <p style={{ color: 'hsl(215 20% 50%)', fontSize: '0.9rem' }}>{stat.label}</p>
                                            </motion.div>
                                        ))}
                                    </div>

                                    {/* Quick Actions & Recent Activity */}
                                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px' }}>
                                        {/* Quick Actions */}
                                        <motion.div
                                            initial={{ opacity: 0, x: -20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            style={{
                                                padding: '24px',
                                                borderRadius: '16px',
                                                background: 'hsl(222 47% 8%)',
                                                border: '1px solid hsl(222 30% 18%)'
                                            }}
                                        >
                                            <h3 style={{ fontSize: '1.125rem', fontWeight: 600, marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                                <Activity size={20} style={{ color: 'hsl(187 94% 43%)' }} />
                                                Quick Actions
                                            </h3>
                                            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                                {[
                                                    { label: 'Add New Project', action: () => { setTab('projects'); setShowAddModal(true); }, icon: Plus },
                                                    { label: 'Add New Skill', action: () => { setTab('skills'); setShowAddModal(true); }, icon: Award },
                                                    { label: 'View Messages', action: () => setTab('messages'), icon: MessageSquare }
                                                ].map((action, i) => (
                                                    <motion.button
                                                        key={action.label}
                                                        onClick={action.action}
                                                        whileHover={{ x: 4, background: 'hsl(222 30% 15%)' }}
                                                        whileTap={{ scale: 0.98 }}
                                                        style={{
                                                            display: 'flex',
                                                            alignItems: 'center',
                                                            gap: '12px',
                                                            padding: '14px 16px',
                                                            background: 'hsl(222 30% 12%)',
                                                            border: '1px solid hsl(222 30% 18%)',
                                                            borderRadius: '10px',
                                                            color: 'white',
                                                            cursor: 'pointer',
                                                            fontWeight: 500,
                                                            textAlign: 'left'
                                                        }}
                                                    >
                                                        <action.icon size={18} style={{ color: 'hsl(187 94% 43%)' }} />
                                                        {action.label}
                                                    </motion.button>
                                                ))}
                                            </div>
                                        </motion.div>

                                        {/* Recent Activity */}
                                        <motion.div
                                            initial={{ opacity: 0, x: 20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            style={{
                                                padding: '24px',
                                                borderRadius: '16px',
                                                background: 'hsl(222 47% 8%)',
                                                border: '1px solid hsl(222 30% 18%)'
                                            }}
                                        >
                                            <h3 style={{ fontSize: '1.125rem', fontWeight: 600, marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                                <Clock size={20} style={{ color: 'hsl(187 94% 43%)' }} />
                                                Recent Activity
                                            </h3>
                                            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                                                {messages.length > 0 ? messages.slice(0, 3).map((msg, i) => (
                                                    <motion.div
                                                        key={msg._id}
                                                        initial={{ opacity: 0, x: 10 }}
                                                        animate={{ opacity: 1, x: 0 }}
                                                        transition={{ delay: i * 0.1 }}
                                                        style={{
                                                            display: 'flex',
                                                            alignItems: 'center',
                                                            gap: '12px',
                                                            padding: '12px',
                                                            background: 'hsl(222 30% 12%)',
                                                            borderRadius: '10px'
                                                        }}
                                                    >
                                                        <div style={{
                                                            width: '36px',
                                                            height: '36px',
                                                            borderRadius: '50%',
                                                            background: 'hsl(187 94% 43% / 0.1)',
                                                            display: 'flex',
                                                            alignItems: 'center',
                                                            justifyContent: 'center'
                                                        }}>
                                                            <Mail size={16} style={{ color: 'hsl(187 94% 43%)' }} />
                                                        </div>
                                                        <div style={{ flex: 1 }}>
                                                            <p style={{ fontSize: '0.875rem', fontWeight: 500, marginBottom: '2px' }}>
                                                                New message from {msg.senderName}
                                                            </p>
                                                            <p style={{ fontSize: '0.75rem', color: 'hsl(215 20% 50%)' }}>
                                                                {msg.email}
                                                            </p>
                                                        </div>
                                                    </motion.div>
                                                )) : (
                                                    <p style={{ color: 'hsl(215 20% 50%)', fontSize: '0.9rem', textAlign: 'center', padding: '20px' }}>
                                                        No recent activity
                                                    </p>
                                                )}
                                            </div>
                                        </motion.div>
                                    </div>
                                </div>
                            )}

                            {/* Projects Tab */}
                            {tab === 'projects' && (
                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '20px' }}>
                                    {projects.map((project, i) => (
                                        <motion.div
                                            key={project._id}
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: i * 0.05 }}
                                            whileHover={{ y: -4 }}
                                            style={{
                                                padding: '24px',
                                                borderRadius: '16px',
                                                background: 'hsl(222 47% 8%)',
                                                border: '1px solid hsl(222 30% 18%)'
                                            }}
                                        >
                                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                                    <Folder size={24} style={{ color: 'hsl(187 94% 43%)' }} />
                                                    <h3 style={{ fontSize: '1.125rem', fontWeight: 600 }}>{project.title}</h3>
                                                </div>
                                                <motion.button
                                                    onClick={() => setShowDeleteModal(project._id)}
                                                    whileHover={{ scale: 1.1 }}
                                                    style={{ background: 'none', border: 'none', color: 'hsl(215 20% 50%)', cursor: 'pointer' }}
                                                >
                                                    <Trash2 size={18} />
                                                </motion.button>
                                            </div>
                                            <p style={{ color: 'hsl(215 20% 50%)', fontSize: '0.875rem', marginBottom: '16px', lineHeight: 1.6 }}>
                                                {project.description?.slice(0, 100)}...
                                            </p>
                                            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '16px' }}>
                                                {project.tags?.map(tag => (
                                                    <span key={tag} style={{
                                                        padding: '4px 10px',
                                                        background: 'hsl(187 94% 43% / 0.1)',
                                                        color: 'hsl(187 94% 43%)',
                                                        borderRadius: '20px',
                                                        fontSize: '0.75rem',
                                                        fontWeight: 500
                                                    }}>
                                                        {tag}
                                                    </span>
                                                ))}
                                            </div>
                                            <div style={{ display: 'flex', gap: '12px' }}>
                                                {project.githubLink && (
                                                    <a href={project.githubLink} target="_blank" rel="noopener noreferrer" style={{ color: 'hsl(215 20% 65%)' }}>
                                                        <Github size={18} />
                                                    </a>
                                                )}
                                                {project.liveLink && (
                                                    <a href={project.liveLink} target="_blank" rel="noopener noreferrer" style={{ color: 'hsl(215 20% 65%)' }}>
                                                        <ExternalLink size={18} />
                                                    </a>
                                                )}
                                            </div>
                                        </motion.div>
                                    ))}
                                    {projects.length === 0 && (
                                        <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '60px', color: 'hsl(215 20% 50%)' }}>
                                            <Folder size={48} style={{ margin: '0 auto 16px', opacity: 0.5 }} />
                                            <p>No projects yet. Add your first project!</p>
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* Skills Tab */}
                            {tab === 'skills' && (
                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '16px' }}>
                                    {skills.map((skill, i) => (
                                        <motion.div
                                            key={skill._id}
                                            initial={{ opacity: 0, scale: 0.9 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            transition={{ delay: i * 0.03 }}
                                            whileHover={{ scale: 1.02 }}
                                            style={{
                                                padding: '20px',
                                                borderRadius: '12px',
                                                background: 'hsl(222 47% 8%)',
                                                border: '1px solid hsl(222 30% 18%)',
                                                textAlign: 'center'
                                            }}
                                        >
                                            {skill.icon && (
                                                <img src={skill.icon} alt={skill.name} style={{ width: '40px', height: '40px', margin: '0 auto 12px' }} />
                                            )}
                                            <h4 style={{ fontWeight: 600, marginBottom: '4px' }}>{skill.name}</h4>
                                            <p style={{ fontSize: '0.75rem', color: 'hsl(187 94% 43%)' }}>{skill.category}</p>
                                        </motion.div>
                                    ))}
                                    {skills.length === 0 && (
                                        <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '60px', color: 'hsl(215 20% 50%)' }}>
                                            <Award size={48} style={{ margin: '0 auto 16px', opacity: 0.5 }} />
                                            <p>No skills yet. Add your first skill!</p>
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* Messages Tab */}
                            {tab === 'messages' && (
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                                    {messages.map((msg, i) => (
                                        <motion.div
                                            key={msg._id}
                                            initial={{ opacity: 0, x: -20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: i * 0.05 }}
                                            style={{
                                                padding: '24px',
                                                borderRadius: '16px',
                                                background: 'hsl(222 47% 8%)',
                                                border: '1px solid hsl(222 30% 18%)'
                                            }}
                                        >
                                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                                    <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'hsl(187 94% 43% / 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                        <User size={20} style={{ color: 'hsl(187 94% 43%)' }} />
                                                    </div>
                                                    <div>
                                                        <h4 style={{ fontWeight: 600 }}>{msg.senderName}</h4>
                                                        <p style={{ fontSize: '0.875rem', color: 'hsl(215 20% 50%)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                                                            <Mail size={14} /> {msg.email}
                                                        </p>
                                                    </div>
                                                </div>
                                                <span style={{ fontSize: '0.75rem', color: 'hsl(215 20% 50%)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                                    <Clock size={14} />
                                                    {new Date(msg.createdAt).toLocaleDateString()}
                                                </span>
                                            </div>
                                            <p style={{ color: 'hsl(215 20% 65%)', lineHeight: 1.7, marginBottom: '16px' }}>{msg.message || msg.details}</p>

                                            {msg.attachmentUrl && (
                                                <div style={{ marginBottom: '16px' }}>
                                                    <a href={msg.attachmentUrl} target="_blank" rel="noopener noreferrer" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', color: 'hsl(187 94% 43%)', textDecoration: 'none', fontSize: '0.875rem', padding: '8px 12px', background: 'hsl(187 94% 43% / 0.1)', borderRadius: '8px' }}>
                                                        <Paperclip size={16} /> View Attachment
                                                    </a>
                                                </div>
                                            )}

                                            <a
                                                href={`mailto:${msg.email}?subject=Re: ${msg.subject || 'Portfolio Inquiry'}&body=Hi ${msg.name || 'there'},%0D%0A%0D%0AThank you for your message regarding "${msg.projectType || 'your project'}".%0D%0A%0D%0ABest regards,%0D%0ASiam`}
                                                style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '8px 16px', background: 'hsl(222 30% 18%)', color: 'white', textDecoration: 'none', borderRadius: '8px', fontSize: '0.875rem', fontWeight: 500, transition: 'background 0.2s' }}
                                                onMouseOver={e => e.target.style.background = 'hsl(222 30% 25%)'}
                                                onMouseOut={e => e.target.style.background = 'hsl(222 30% 18%)'}
                                            >
                                                <Send size={16} /> Reply via Email
                                            </a>
                                        </motion.div>
                                    ))}
                                    {messages.length === 0 && (
                                        <div style={{ textAlign: 'center', padding: '60px', color: 'hsl(215 20% 50%)' }}>
                                            <MessageSquare size={48} style={{ margin: '0 auto 16px', opacity: 0.5 }} />
                                            <p>No messages yet.</p>
                                        </div>
                                    )}
                                </div>
                            )}
                        </>
                    )}
                </motion.div>
            </div>

            <style>{`
                @keyframes spin {
                    from { transform: rotate(0deg); }
                    to { transform: rotate(360deg); }
                }
            `}</style>
        </div>
    )
}

const inputStyle = {
    width: '100%',
    padding: '14px 16px',
    background: 'hsl(222 47% 12%)',
    border: '1px solid hsl(222 30% 18%)',
    borderRadius: '10px',
    color: 'white',
    fontSize: '0.95rem',
    outline: 'none'
}

const buttonStyle = {
    width: '100%',
    padding: '14px',
    background: 'hsl(187 94% 43%)',
    color: 'hsl(222 47% 5%)',
    border: 'none',
    borderRadius: '10px',
    fontWeight: 700,
    cursor: 'pointer',
    fontSize: '1rem'
}
