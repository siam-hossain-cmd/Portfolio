import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
    LayoutDashboard, Folder, Award, MessageSquare, Settings, LogOut,
    Briefcase, Zap, MessageSquareQuote, FileText, BarChart3, Menu, X,
    Shield, Loader2, Bell, ChevronLeft
} from 'lucide-react';
import { signOut } from 'firebase/auth';
import { auth } from '../config/firebase';
import axiosInstance from '../config/axiosInstance';

// Tab components
import OverviewTab from '../components/dashboard/OverviewTab';
import ProjectsTab from '../components/dashboard/ProjectsTab';
import SkillsTab from '../components/dashboard/SkillsTab';
import MessagesTab from '../components/dashboard/MessagesTab';
import ExperienceTab from '../components/dashboard/ExperienceTab';
import ServicesTab from '../components/dashboard/ServicesTab';
import TestimonialsTab from '../components/dashboard/TestimonialsTab';
import BlogsTab from '../components/dashboard/BlogsTab';
import AnalyticsTab from '../components/dashboard/AnalyticsTab';
import SettingsTab from '../components/dashboard/SettingsTab';

const TAB_CONFIG = [
    { key: 'overview', label: 'Overview', icon: LayoutDashboard },
    { key: 'projects', label: 'Projects', icon: Folder },
    { key: 'skills', label: 'Skills', icon: Award },
    { key: 'experience', label: 'Experience', icon: Briefcase },
    { key: 'services', label: 'Services', icon: Zap },
    { key: 'testimonials', label: 'Testimonials', icon: MessageSquareQuote },
    { key: 'blogs', label: 'Blog', icon: FileText },
    { key: 'messages', label: 'Messages', icon: MessageSquare },
    { key: 'analytics', label: 'Analytics', icon: BarChart3 },
    { key: 'settings', label: 'Settings', icon: Settings },
];

export default function Dashboard() {
    const navigate = useNavigate();
    const [tab, setTab] = useState('overview');
    const [adminRole, setAdminRole] = useState('');
    const [adminName, setAdminName] = useState('');
    const [loading, setLoading] = useState(true);
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    // Data for overview
    const [projects, setProjects] = useState([]);
    const [skills, setSkills] = useState([]);
    const [messages, setMessages] = useState([]);

    useEffect(() => {
        const fetchAll = async () => {
            const token = localStorage.getItem('adminToken');
            if (!token) { navigate('/admin'); return; }
            try {
                const [projRes, skillRes, msgRes] = await Promise.all([
                    axiosInstance.get('/projects'),
                    axiosInstance.get('/skills'),
                    axiosInstance.get('/messages')
                ]);
                setProjects(projRes.data);
                setSkills(skillRes.data);
                setMessages(msgRes.data);

                // Decode admin info from token
                try {
                    const payload = JSON.parse(atob(token.split('.')[1]));
                    setAdminRole(payload.role || 'Admin');
                    setAdminName(payload.username || payload.email || 'Admin');
                } catch { setAdminRole('Admin'); setAdminName('Admin'); }
            } catch (err) {
                if (err.response?.status === 401 || err.response?.status === 403) {
                    localStorage.removeItem('adminToken');
                    navigate('/admin');
                }
            } finally { setLoading(false); }
        };
        fetchAll();
    }, [navigate]);

    const handleLogout = async () => {
        try { await signOut(auth); } catch {}
        localStorage.removeItem('adminToken');
        navigate('/admin');
    };

    const newMessages = messages.filter(m => (m.status || 'new') === 'new').length;

    if (loading) {
        return (
            <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'hsl(222 47% 5%)' }}>
                <div style={{ textAlign: 'center' }}>
                    <Loader2 size={40} style={{ color: 'hsl(187 94% 43%)', animation: 'spin 1s linear infinite', marginBottom: '16px' }} />
                    <p style={{ color: 'hsl(215 20% 50%)' }}>Loading dashboard...</p>
                </div>
                <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
            </div>
        );
    }

    return (
        <div style={{ display: 'flex', minHeight: '100vh', background: 'hsl(222 47% 5%)', color: 'white', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
            {/* Desktop Sidebar */}
            <motion.aside
                initial={false}
                animate={{ width: sidebarOpen ? 260 : 72 }}
                transition={{ duration: 0.3 }}
                className="desktop-sidebar"
                style={{
                    height: '100vh',
                    position: 'sticky',
                    top: 0,
                    background: 'hsl(222 47% 7%)',
                    borderRight: '1px solid hsl(222 30% 15%)',
                    display: 'flex',
                    flexDirection: 'column',
                    overflow: 'hidden',
                    zIndex: 30
                }}
            >
                {/* Logo */}
                <div style={{ padding: '20px', display: 'flex', alignItems: 'center', gap: '12px', borderBottom: '1px solid hsl(222 30% 15%)' }}>
                    <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'linear-gradient(135deg, hsl(187 94% 43%), hsl(187 80% 35%))', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                        <Shield size={18} style={{ color: 'white' }} />
                    </div>
                    {sidebarOpen && (
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ overflow: 'hidden' }}>
                            <h1 style={{ fontSize: '1rem', fontWeight: 700, whiteSpace: 'nowrap' }}>Admin Panel</h1>
                            <p style={{ fontSize: '0.65rem', color: 'hsl(215 20% 45%)', whiteSpace: 'nowrap' }}>{adminRole}</p>
                        </motion.div>
                    )}
                </div>

                {/* Nav Links */}
                <nav style={{ flex: 1, padding: '12px 8px', display: 'flex', flexDirection: 'column', gap: '2px', overflowY: 'auto' }}>
                    {TAB_CONFIG.map(t => (
                        <motion.button
                            key={t.key}
                            onClick={() => setTab(t.key)}
                            whileHover={{ x: 4 }}
                            style={{
                                display: 'flex', alignItems: 'center', gap: '12px',
                                padding: sidebarOpen ? '10px 14px' : '10px',
                                justifyContent: sidebarOpen ? 'flex-start' : 'center',
                                background: tab === t.key ? 'hsl(187 94% 43% / 0.1)' : 'transparent',
                                border: 'none', borderRadius: '10px',
                                color: tab === t.key ? 'hsl(187 94% 43%)' : 'hsl(215 20% 55%)',
                                cursor: 'pointer', fontWeight: tab === t.key ? 600 : 400,
                                fontFamily: 'inherit', fontSize: '0.875rem', textAlign: 'left',
                                position: 'relative', whiteSpace: 'nowrap'
                            }}
                        >
                            <t.icon size={18} style={{ flexShrink: 0 }} />
                            {sidebarOpen && t.label}
                            {t.key === 'messages' && newMessages > 0 && (
                                <span style={{
                                    position: sidebarOpen ? 'static' : 'absolute', top: '4px', right: '4px',
                                    background: 'hsl(0 84% 60%)', color: 'white', fontSize: '0.6rem', fontWeight: 700,
                                    padding: '1px 5px', borderRadius: '10px', marginLeft: sidebarOpen ? 'auto' : 0
                                }}>{newMessages}</span>
                            )}
                        </motion.button>
                    ))}
                </nav>

                {/* Collapse Toggle */}
                <button
                    onClick={() => setSidebarOpen(!sidebarOpen)}
                    style={{
                        padding: '12px', margin: '8px', background: 'hsl(222 30% 12%)',
                        border: '1px solid hsl(222 30% 18%)', borderRadius: '8px',
                        color: 'hsl(215 20% 50%)', cursor: 'pointer', display: 'flex',
                        alignItems: 'center', justifyContent: 'center'
                    }}
                >
                    <ChevronLeft size={16} style={{ transform: sidebarOpen ? 'none' : 'rotate(180deg)', transition: 'transform 0.3s' }} />
                </button>

                {/* Logout */}
                <div style={{ padding: '12px 8px', borderTop: '1px solid hsl(222 30% 15%)' }}>
                    <motion.button
                        onClick={handleLogout}
                        whileHover={{ background: 'hsl(0 84% 60% / 0.1)' }}
                        style={{
                            display: 'flex', alignItems: 'center', gap: '10px',
                            padding: sidebarOpen ? '10px 14px' : '10px',
                            justifyContent: sidebarOpen ? 'flex-start' : 'center',
                            background: 'transparent', border: 'none', borderRadius: '10px',
                            color: 'hsl(0 84% 65%)', cursor: 'pointer', width: '100%',
                            fontFamily: 'inherit', fontSize: '0.875rem', fontWeight: 500
                        }}
                    >
                        <LogOut size={18} style={{ flexShrink: 0 }} />
                        {sidebarOpen && 'Logout'}
                    </motion.button>
                </div>
            </motion.aside>

            {/* Mobile Header */}
            <div className="mobile-header" style={{
                display: 'none', position: 'fixed', top: 0, left: 0, right: 0,
                background: 'hsl(222 47% 7%)', borderBottom: '1px solid hsl(222 30% 15%)',
                padding: '12px 16px', zIndex: 40, justifyContent: 'space-between', alignItems: 'center'
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'linear-gradient(135deg, hsl(187 94% 43%), hsl(187 80% 35%))', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Shield size={16} style={{ color: 'white' }} />
                    </div>
                    <span style={{ fontWeight: 700, fontSize: '0.95rem' }}>Admin</span>
                </div>
                <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer' }}>
                    {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
            </div>

            {/* Mobile Menu Overlay */}
            <AnimatePresence>
                {mobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, x: -300 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -300 }}
                        style={{
                            position: 'fixed', top: 0, left: 0, bottom: 0, width: '260px',
                            background: 'hsl(222 47% 7%)', borderRight: '1px solid hsl(222 30% 15%)',
                            zIndex: 50, padding: '20px 12px', paddingTop: '72px', display: 'flex',
                            flexDirection: 'column', gap: '4px'
                        }}
                    >
                        {TAB_CONFIG.map(t => (
                            <button key={t.key} onClick={() => { setTab(t.key); setMobileMenuOpen(false); }}
                                style={{
                                    display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 16px',
                                    background: tab === t.key ? 'hsl(187 94% 43% / 0.1)' : 'transparent',
                                    border: 'none', borderRadius: '10px',
                                    color: tab === t.key ? 'hsl(187 94% 43%)' : 'hsl(215 20% 55%)',
                                    cursor: 'pointer', fontWeight: tab === t.key ? 600 : 400,
                                    fontFamily: 'inherit', fontSize: '0.9rem', width: '100%', textAlign: 'left'
                                }}>
                                <t.icon size={18} /> {t.label}
                            </button>
                        ))}
                        <button onClick={handleLogout} style={{
                            display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 16px',
                            background: 'transparent', border: 'none', borderRadius: '10px',
                            color: 'hsl(0 84% 65%)', cursor: 'pointer', fontFamily: 'inherit',
                            fontSize: '0.9rem', width: '100%', textAlign: 'left', marginTop: 'auto'
                        }}>
                            <LogOut size={18} /> Logout
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>
            {mobileMenuOpen && <div onClick={() => setMobileMenuOpen(false)} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 45 }} />}

            {/* Main Content */}
            <main style={{ flex: 1, padding: '32px', overflowY: 'auto', maxHeight: '100vh' }} className="main-content">
                {/* Breadcrumb */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '28px' }}>
                    <div>
                        <h1 style={{ fontSize: '1.75rem', fontWeight: 800, marginBottom: '4px' }}>
                            {TAB_CONFIG.find(t => t.key === tab)?.label || 'Dashboard'}
                        </h1>
                        <p style={{ color: 'hsl(215 20% 50%)', fontSize: '0.85rem' }}>
                            Welcome back, <span style={{ color: 'hsl(187 94% 43%)', fontWeight: 500 }}>{adminName}</span>
                        </p>
                    </div>
                </div>

                {/* Tab Content */}
                <AnimatePresence mode="wait">
                    <motion.div
                        key={tab}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.2 }}
                    >
                        {tab === 'overview' && <OverviewTab projects={projects} skills={skills} messages={messages} setTab={setTab} adminRole={adminRole} />}
                        {tab === 'projects' && <ProjectsTab />}
                        {tab === 'skills' && <SkillsTab />}
                        {tab === 'experience' && <ExperienceTab />}
                        {tab === 'services' && <ServicesTab />}
                        {tab === 'testimonials' && <TestimonialsTab />}
                        {tab === 'blogs' && <BlogsTab />}
                        {tab === 'messages' && <MessagesTab />}
                        {tab === 'analytics' && <AnalyticsTab />}
                        {tab === 'settings' && <SettingsTab />}
                    </motion.div>
                </AnimatePresence>
            </main>

            <style>{`
                @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
                @media (max-width: 768px) {
                    .desktop-sidebar { display: none !important; }
                    .mobile-header { display: flex !important; }
                    .main-content { padding: 16px !important; padding-top: 72px !important; }
                }
            `}</style>
        </div>
    );
}
