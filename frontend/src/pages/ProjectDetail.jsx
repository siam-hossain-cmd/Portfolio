import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    ArrowLeft, ExternalLink, Github, Calendar, Briefcase, 
    Layers, Settings, Database, Cloud, Terminal, Check, 
    X, AlertTriangle, Eye, Shield
} from 'lucide-react';
import useApiData from '../hooks/useApiData';

export default function ProjectDetail() {
    const { slug } = useParams();
    const { data: project, loading, error } = useApiData(`projects/slug/${slug}`, null);
    const [lightboxImage, setLightboxImage] = useState(null);

    if (loading) {
        return (
            <div style={{
                minHeight: '100vh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: 'hsl(222 47% 5%)',
                color: 'white'
            }}>
                <div style={{ textAlign: 'center' }}>
                    <div className="glow" style={{
                        width: '50px',
                        height: '50px',
                        borderRadius: '50%',
                        border: '3px solid var(--border)',
                        borderTopColor: 'var(--accent)',
                        animation: 'spin 1s linear infinite',
                        margin: '0 auto 16px'
                    }} />
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Loading project details...</p>
                    <style>{`
                        @keyframes spin {
                            from { transform: rotate(0deg); }
                            to { transform: rotate(360deg); }
                        }
                    `}</style>
                </div>
            </div>
        );
    }

    if (error || !project) {
        return (
            <div style={{
                minHeight: '100vh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: 'hsl(222 47% 5%)',
                color: 'white',
                padding: '24px'
            }}>
                <div className="glass" style={{ padding: '32px', borderRadius: '16px', maxWidth: '480px', width: '100%', textAlign: 'center' }}>
                    <AlertTriangle size={48} style={{ color: 'hsl(0 84% 60%)', marginBottom: '16px' }} />
                    <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '8px' }}>Project Not Found</h2>
                    <p style={{ color: 'var(--text-secondary)', marginBottom: '24px', fontSize: '0.95rem' }}>
                        The project you are looking for does not exist or has been moved.
                    </p>
                    <Link to="/" style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '8px',
                        padding: '12px 24px',
                        background: 'var(--accent)',
                        color: 'hsl(222 47% 5%)',
                        borderRadius: '10px',
                        fontWeight: 700,
                        textDecoration: 'none'
                    }}>
                        <ArrowLeft size={16} /> Back to Portfolio
                    </Link>
                </div>
            </div>
        );
    }

    const techStack = project.techStack || { frontend: [], backend: [], database: [], cloud: [], devOps: [] };
    const apiEndpoints = project.apiEndpoints || [];
    const screenshots = project.screenshots || [];
    const architectureDiagrams = project.architectureDiagrams || [];
    const databaseDiagrams = project.databaseDiagrams || [];

    const sectionTitleStyle = {
        fontSize: '1.75rem',
        fontWeight: 700,
        marginBottom: '20px',
        color: 'var(--text-primary)',
        display: 'flex',
        alignItems: 'center',
        gap: '12px'
    };

    return (
        <div style={{ minHeight: '100vh', background: 'var(--bg-primary)', paddingBottom: '80px' }}>
            {/* Navigation Header */}
            <header className="glass" style={{ position: 'sticky', top: 0, zIndex: 50, borderTop: 'none', borderLeft: 'none', borderRight: 'none' }}>
                <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '16px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Link to="/" style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '8px',
                        color: 'var(--text-secondary)',
                        textDecoration: 'none',
                        fontWeight: 600,
                        fontSize: '0.9rem',
                        transition: 'color 0.2s'
                    }} onMouseOver={e => e.target.style.color = 'var(--text-primary)'} onMouseOut={e => e.target.style.color = 'var(--text-secondary)'}>
                        <ArrowLeft size={16} /> Back to Portfolio
                    </Link>
                    <div style={{ display: 'flex', gap: '12px' }}>
                        {project.githubLink && !project.isPrivateCode && (
                            <a href={project.githubLink} target="_blank" rel="noreferrer" style={{
                                width: '38px', height: '38px', borderRadius: '50%', border: '1px solid var(--border)',
                                display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-primary)',
                                background: 'var(--bg-secondary)', transition: 'border-color 0.2s'
                            }}>
                                <Github size={18} />
                            </a>
                        )}
                        {project.liveLink && (
                            <a href={project.liveLink} target="_blank" rel="noreferrer" style={{
                                display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '0 16px',
                                height: '38px', borderRadius: '8px', background: 'var(--accent)', color: 'hsl(222 47% 5%)',
                                fontWeight: 700, fontSize: '0.85rem', textDecoration: 'none'
                            }}>
                                <ExternalLink size={14} /> Live Demo
                            </a>
                        )}
                    </div>
                </div>
            </header>

            {/* Hero Section */}
            <section style={{ position: 'relative', overflow: 'hidden', padding: '60px 24px' }}>
                <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '40px', alignItems: 'center' }}>
                    <div>
                        <span style={{
                            padding: '6px 14px', borderRadius: '20px', background: 'hsl(187 94% 43% / 0.1)',
                            color: 'var(--accent)', fontSize: '0.8rem', fontWeight: 600, border: '1px solid hsl(187 94% 43% / 0.2)'
                        }}>
                            {project.category}
                        </span>
                        <h1 style={{ fontSize: '3rem', fontWeight: 800, marginTop: '16px', marginBottom: '16px', lineHeight: 1.1 }}>
                            {project.title}
                        </h1>
                        <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem', lineHeight: 1.6, marginBottom: '28px' }}>
                            {project.description}
                        </p>

                        {/* Metadata Grid */}
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '24px', padding: '24px', background: 'var(--bg-secondary)', borderRadius: '16px', border: '1px solid var(--border)' }}>
                            <div>
                                <p style={{ fontSize: '0.75rem', textTransform: 'uppercase', tracking: '0.05em', color: 'var(--text-secondary)', marginBottom: '4px' }}>Client</p>
                                <p style={{ fontWeight: 600, fontSize: '0.95rem' }}>{project.client || 'Personal Project'}</p>
                            </div>
                            <div>
                                <p style={{ fontSize: '0.75rem', textTransform: 'uppercase', tracking: '0.05em', color: 'var(--text-secondary)', marginBottom: '4px' }}>Status</p>
                                <span style={{
                                    display: 'inline-block', padding: '2px 8px', borderRadius: '6px', fontSize: '0.8rem', fontWeight: 600,
                                    background: project.status === 'Completed' ? 'hsl(142 76% 36% / 0.1)' : 'hsl(45 93% 47% / 0.1)',
                                    color: project.status === 'Completed' ? 'hsl(142 76% 55%)' : 'hsl(45 93% 60%)',
                                    border: `1px solid ${project.status === 'Completed' ? 'hsl(142 76% 36% / 0.3)' : 'hsl(45 93% 47% / 0.3)'}`
                                }}>
                                    {project.status}
                                </span>
                            </div>
                            <div style={{ gridColumn: 'span 2' }}>
                                <p style={{ fontSize: '0.75rem', textTransform: 'uppercase', tracking: '0.05em', color: 'var(--text-secondary)', marginBottom: '4px' }}>Timeline</p>
                                <p style={{ fontWeight: 600, fontSize: '0.95rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
                                    <Calendar size={14} style={{ color: 'var(--accent)' }} />
                                    {project.timeline?.startDate || 'N/A'} — {project.timeline?.endDate || 'Present'}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Image Showcase */}
                    <div style={{ position: 'relative', borderRadius: '24px', overflow: 'hidden', border: '1px solid var(--border)', boxShadow: '0 20px 40px -15px rgba(0,0,0,0.5)' }}>
                        <img 
                            src={project.image || 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=1000&fit=crop'} 
                            alt={project.title} 
                            style={{ width: '100%', height: 'auto', display: 'block', maxHeight: '420px', objectFit: 'cover' }}
                        />
                    </div>
                </div>
            </section>

            {/* Main Content Area */}
            <main style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 24px', display: 'grid', gridTemplateColumns: '3fr 1fr', gap: '48px' }}>
                
                {/* Column 1: Details */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '48px' }}>
                    
                    {/* Problem & Solution */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '32px' }}>
                        {project.problemStatement && (
                            <div className="glass" style={{ padding: '32px', borderRadius: '20px' }}>
                                <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '12px', color: 'hsl(0 84% 70%)' }}>The Problem</h3>
                                <p style={{ color: 'var(--text-secondary)', lineHeight: 1.6, fontSize: '0.95rem' }}>{project.problemStatement}</p>
                            </div>
                        )}
                        {project.solution && (
                            <div className="glass" style={{ padding: '32px', borderRadius: '20px' }}>
                                <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '12px', color: 'hsl(142 76% 55%)' }}>The Solution</h3>
                                <p style={{ color: 'var(--text-secondary)', lineHeight: 1.6, fontSize: '0.95rem' }}>{project.solution}</p>
                            </div>
                        )}
                    </div>

                    {/* Key Features */}
                    {project.features && project.features.length > 0 && (
                        <div>
                            <h2 style={sectionTitleStyle}><Briefcase size={22} style={{ color: 'var(--accent)' }} /> Key Features</h2>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px' }}>
                                {project.features.map((feat, i) => (
                                    <div key={i} className="glass" style={{ padding: '16px 20px', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                                        <div style={{ width: '24px', height: '24px', borderRadius: '50%', background: 'hsl(187 94% 43% / 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--accent)', flexShrink: 0 }}>
                                            <Check size={14} />
                                        </div>
                                        <span style={{ fontSize: '0.9rem', fontWeight: 500 }}>{feat}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Technical Diagrams (Architecture & DB) */}
                    {(architectureDiagrams.length > 0 || databaseDiagrams.length > 0) && (
                        <div>
                            <h2 style={sectionTitleStyle}><Layers size={22} style={{ color: 'var(--accent)' }} /> Technical Architecture</h2>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px' }}>
                                {architectureDiagrams.map((diag, i) => (
                                    <div key={i} className="glass" style={{ borderRadius: '16px', overflow: 'hidden' }}>
                                        <div style={{ position: 'relative', cursor: 'pointer' }} onClick={() => setLightboxImage(diag.imageUrl)}>
                                            <img src={diag.imageUrl} alt={diag.title} style={{ width: '100%', height: '180px', objectFit: 'cover' }} />
                                            <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.4)', opacity: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'opacity 0.2s' }} onMouseOver={e => e.target.style.opacity = 1} onMouseOut={e => e.target.style.opacity = 0}>
                                                <Eye size={24} style={{ color: 'white' }} />
                                            </div>
                                        </div>
                                        <div style={{ padding: '16px' }}>
                                            <h4 style={{ fontWeight: 700, fontSize: '1rem', marginBottom: '4px' }}>{diag.title}</h4>
                                            <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', margin: 0 }}>{diag.description}</p>
                                        </div>
                                    </div>
                                ))}
                                {databaseDiagrams.map((diag, i) => (
                                    <div key={i} className="glass" style={{ borderRadius: '16px', overflow: 'hidden' }}>
                                        <div style={{ position: 'relative', cursor: 'pointer' }} onClick={() => setLightboxImage(diag.imageUrl)}>
                                            <img src={diag.imageUrl} alt={diag.title} style={{ width: '100%', height: '180px', objectFit: 'cover' }} />
                                            <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.4)', opacity: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'opacity 0.2s' }} onMouseOver={e => e.target.style.opacity = 1} onMouseOut={e => e.target.style.opacity = 0}>
                                                <Eye size={24} style={{ color: 'white' }} />
                                            </div>
                                        </div>
                                        <div style={{ padding: '16px' }}>
                                            <h4 style={{ fontWeight: 700, fontSize: '1rem', marginBottom: '4px' }}>{diag.title}</h4>
                                            <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', margin: 0 }}>{diag.description}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Interactive API documentation */}
                    {apiEndpoints.length > 0 && (
                        <div>
                            <h2 style={sectionTitleStyle}><Terminal size={22} style={{ color: 'var(--accent)' }} /> API Endpoints</h2>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                                {apiEndpoints.map((endpoint, i) => (
                                    <div key={i} className="glass" style={{ borderRadius: '16px', overflow: 'hidden' }}>
                                        <div style={{ padding: '16px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'var(--bg-secondary)', borderBottom: '1px solid var(--border)' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                                <span style={{
                                                    padding: '4px 10px', borderRadius: '6px', fontSize: '0.75rem', fontWeight: 800,
                                                    background: endpoint.method === 'GET' ? 'hsl(142 76% 36% / 0.1)' : 
                                                                endpoint.method === 'POST' ? 'hsl(199 89% 48% / 0.1)' : 
                                                                endpoint.method === 'PUT' ? 'hsl(45 93% 47% / 0.1)' : 'hsl(0 84% 60% / 0.1)',
                                                    color: endpoint.method === 'GET' ? 'hsl(142 76% 55%)' : 
                                                           endpoint.method === 'POST' ? 'hsl(199 89% 60%)' : 
                                                           endpoint.method === 'PUT' ? 'hsl(45 93% 60%)' : 'hsl(0 84% 70%)',
                                                    border: `1px solid ${
                                                                endpoint.method === 'GET' ? 'hsl(142 76% 36% / 0.3)' : 
                                                                endpoint.method === 'POST' ? 'hsl(199 89% 48% / 0.3)' : 
                                                                endpoint.method === 'PUT' ? 'hsl(45 93% 47% / 0.3)' : 'hsl(0 84% 60% / 0.3)'}`
                                                }}>
                                                    {endpoint.method}
                                                </span>
                                                <code style={{ fontSize: '0.9rem', color: 'var(--text-primary)', fontWeight: 600 }}>{endpoint.endpoint}</code>
                                            </div>
                                            {endpoint.auth && (
                                                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', fontSize: '0.7rem', color: 'hsl(45 93% 60%)', fontWeight: 600 }}>
                                                    <Shield size={12} /> Auth Required
                                                </span>
                                            )}
                                        </div>
                                        <div style={{ padding: '20px' }}>
                                            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '16px' }}>{endpoint.description}</p>
                                            
                                            {endpoint.requestExample && (
                                                <div style={{ marginBottom: '12px' }}>
                                                    <p style={{ fontSize: '0.75rem', textTransform: 'uppercase', tracking: '0.05em', color: 'var(--text-secondary)', marginBottom: '6px' }}>Request Body Example</p>
                                                    <pre style={{ margin: 0, padding: '12px', background: 'hsl(222 47% 3%)', borderRadius: '8px', border: '1px solid var(--border)', overflowX: 'auto', fontSize: '0.8rem', color: 'var(--accent)' }}>
                                                        <code>{endpoint.requestExample}</code>
                                                    </pre>
                                                </div>
                                            )}
                                            {endpoint.responseExample && (
                                                <div>
                                                    <p style={{ fontSize: '0.75rem', textTransform: 'uppercase', tracking: '0.05em', color: 'var(--text-secondary)', marginBottom: '6px' }}>Response Example (200 OK)</p>
                                                    <pre style={{ margin: 0, padding: '12px', background: 'hsl(222 47% 3%)', borderRadius: '8px', border: '1px solid var(--border)', overflowX: 'auto', fontSize: '0.8rem', color: 'hsl(142 76% 55%)' }}>
                                                        <code>{endpoint.responseExample}</code>
                                                    </pre>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Screenshot Gallery */}
                    {screenshots.length > 0 && (
                        <div>
                            <h2 style={sectionTitleStyle}><ImageIcon size={22} style={{ color: 'var(--accent)' }} /> Screenshot Gallery</h2>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '20px' }}>
                                {screenshots.map((shot, i) => (
                                    <div key={i} className="glass" style={{ borderRadius: '12px', overflow: 'hidden', cursor: 'pointer', position: 'relative', height: '140px' }} onClick={() => setLightboxImage(shot)}>
                                        <img src={shot} alt={`Screenshot ${i + 1}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                        <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.3)', opacity: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'opacity 0.2s' }} onMouseOver={e => e.target.style.opacity = 1} onMouseOut={e => e.target.style.opacity = 0}>
                                            <Eye size={20} style={{ color: 'white' }} />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                </div>

                {/* Column 2: Tech Stack / Sidebar */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
                    
                    {/* Tech Stack Box */}
                    <div className="glass" style={{ padding: '28px', borderRadius: '20px', position: 'sticky', top: '100px' }}>
                        <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <Settings size={18} style={{ color: 'var(--accent)' }} /> Tech Stack
                        </h3>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                            {techStack.frontend && techStack.frontend.length > 0 && (
                                <div>
                                    <p style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.75rem', textTransform: 'uppercase', tracking: '0.05em', color: 'var(--text-secondary)', marginBottom: '8px' }}>
                                        <Layers size={12} /> Frontend
                                    </p>
                                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                                        {techStack.frontend.map(t => (
                                            <span key={t} style={{ padding: '4px 10px', borderRadius: '6px', background: 'var(--bg-secondary)', border: '1px solid var(--border)', fontSize: '0.78rem', color: 'var(--text-primary)' }}>{t}</span>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {techStack.backend && techStack.backend.length > 0 && (
                                <div>
                                    <p style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.75rem', textTransform: 'uppercase', tracking: '0.05em', color: 'var(--text-secondary)', marginBottom: '8px' }}>
                                        <Terminal size={12} /> Backend
                                    </p>
                                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                                        {techStack.backend.map(t => (
                                            <span key={t} style={{ padding: '4px 10px', borderRadius: '6px', background: 'var(--bg-secondary)', border: '1px solid var(--border)', fontSize: '0.78rem', color: 'var(--text-primary)' }}>{t}</span>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {techStack.database && techStack.database.length > 0 && (
                                <div>
                                    <p style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.75rem', textTransform: 'uppercase', tracking: '0.05em', color: 'var(--text-secondary)', marginBottom: '8px' }}>
                                        <Database size={12} /> Database
                                    </p>
                                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                                        {techStack.database.map(t => (
                                            <span key={t} style={{ padding: '4px 10px', borderRadius: '6px', background: 'var(--bg-secondary)', border: '1px solid var(--border)', fontSize: '0.78rem', color: 'var(--text-primary)' }}>{t}</span>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {techStack.cloud && techStack.cloud.length > 0 && (
                                <div>
                                    <p style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.75rem', textTransform: 'uppercase', tracking: '0.05em', color: 'var(--text-secondary)', marginBottom: '8px' }}>
                                        <Cloud size={12} /> Cloud Services
                                    </p>
                                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                                        {techStack.cloud.map(t => (
                                            <span key={t} style={{ padding: '4px 10px', borderRadius: '6px', background: 'var(--bg-secondary)', border: '1px solid var(--border)', fontSize: '0.78rem', color: 'var(--text-primary)' }}>{t}</span>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {techStack.devOps && techStack.devOps.length > 0 && (
                                <div>
                                    <p style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.75rem', textTransform: 'uppercase', tracking: '0.05em', color: 'var(--text-secondary)', marginBottom: '8px' }}>
                                        <Settings size={12} /> DevOps
                                    </p>
                                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                                        {techStack.devOps.map(t => (
                                            <span key={t} style={{ padding: '4px 10px', borderRadius: '6px', background: 'var(--bg-secondary)', border: '1px solid var(--border)', fontSize: '0.78rem', color: 'var(--text-primary)' }}>{t}</span>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                </div>

            </main>

            {/* Lightbox / Modal */}
            <AnimatePresence>
                {lightboxImage && (
                    <motion.div 
                        initial={{ opacity: 0 }} 
                        animate={{ opacity: 1 }} 
                        exit={{ opacity: 0 }} 
                        onClick={() => setLightboxImage(null)}
                        style={{
                            position: 'fixed', inset: 0, zIndex: 100, background: 'rgba(5, 7, 12, 0.95)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px'
                        }}
                    >
                        <button style={{
                            position: 'absolute', top: '24px', right: '24px', width: '48px', height: '48px',
                            borderRadius: '50%', border: '1px solid var(--border)', color: 'white',
                            background: 'var(--bg-secondary)', display: 'flex', alignItems: 'center', justifyContent: 'center',
                            cursor: 'pointer'
                        }}>
                            <X size={20} />
                        </button>
                        <motion.img 
                            initial={{ scale: 0.95 }}
                            animate={{ scale: 1 }}
                            exit={{ scale: 0.95 }}
                            src={lightboxImage} 
                            alt="Fullscreen view" 
                            style={{ maxWidth: '100%', maxHeight: '90vh', objectFit: 'contain', borderRadius: '16px', boxShadow: '0 30px 60px rgba(0,0,0,0.8)' }} 
                        />
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
