import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import { ExternalLink, Github, Folder, Search, X } from 'lucide-react';
import axios from 'axios';
import API_URL from '../../config/api';
import SectionHeader from './SectionHeader';

const CATEGORIES = ['All', 'Web App', 'Mobile App', 'Full-Stack', 'Frontend', 'Backend', 'DevOps', 'CLI Tool', 'API', 'Other'];

const fadeInUp = {
    hidden: { opacity: 0, y: 60 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] }
    }
};

const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1,
            delayChildren: 0.2
        }
    }
};

const staggerItem = {
    hidden: { opacity: 0, y: 30 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] }
    }
};

// Helper to get color-coded styles based on technology name
function getTagColor(tech) {
    const name = tech.toLowerCase();
    
    // Frontend / UI
    if (name.includes('react') || name.includes('next') || name.includes('vue') || name.includes('svelte') || name.includes('frontend') || name.includes('flutter') || name.includes('dart') || name.includes('html') || name.includes('css') || name.includes('tailwind') || name.includes('ui')) {
        return {
            bg: 'hsl(199 89% 48% / 0.1)',
            text: 'hsl(199 89% 55%)',
            border: 'hsl(199 89% 48% / 0.2)'
        };
    }
    // Backend / Languages
    if (name.includes('node') || name.includes('express') || name.includes('python') || name.includes('django') || name.includes('fastapi') || name.includes('backend') || name.includes('go') || name.includes('java') || name.includes('c#') || name.includes('c++') || name.includes('php') || name.includes('api')) {
        return {
            bg: 'hsl(142 76% 45% / 0.1)',
            text: 'hsl(142 76% 55%)',
            border: 'hsl(142 76% 45% / 0.2)'
        };
    }
    // Databases / State
    if (name.includes('mongo') || name.includes('postgres') || name.includes('sql') || name.includes('prisma') || name.includes('firebase') || name.includes('db') || name.includes('redis') || name.includes('graphql')) {
        return {
            bg: 'hsl(270 76% 55% / 0.1)',
            text: 'hsl(270 76% 65%)',
            border: 'hsl(270 76% 55% / 0.2)'
        };
    }
    // DevOps / Cloud / Tools
    if (name.includes('aws') || name.includes('docker') || name.includes('cloud') || name.includes('gcp') || name.includes('devops') || name.includes('git') || name.includes('ci/cd') || name.includes('stripe') || name.includes('stripe') || name.includes('redis') || name.includes('linux')) {
        return {
            bg: 'hsl(30 92% 50% / 0.1)',
            text: 'hsl(30 92% 60%)',
            border: 'hsl(30 92% 50% / 0.2)'
        };
    }
    
    // Default cyan styling
    return {
        bg: 'hsl(187 94% 43% / 0.1)',
        text: 'var(--accent)',
        border: 'hsl(187 94% 43% / 0.2)'
    };
}

export default function ProjectsSection({ isDarkMode }) {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: "-100px" });
    
    const [allProjects, setAllProjects] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProjects = async () => {
            try {
                const res = await axios.get(`${API_URL}/projects`);
                if (res.data) {
                    const mapped = res.data.map(p => ({
                        ...p,
                        title: p.title,
                        description: p.description,
                        image: p.image,
                        technologies: p.tags || p.technologies || [],
                        github: p.isPrivateCode ? '#' : (p.githubLink || '#'),
                        live: p.liveLink || '#'
                    }));
                    setAllProjects(mapped);
                }
            } catch (err) {
                console.error("Error fetching real-time projects:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchProjects();
    }, []);

    // Filter projects based on category and search query
    const filteredProjects = allProjects.filter(p => {
        const matchesCategory = selectedCategory === 'All' || p.category === selectedCategory;
        const matchesSearch = !searchQuery || 
            p.title?.toLowerCase().includes(searchQuery.toLowerCase()) || 
            p.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            p.technologies?.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));
        return matchesCategory && matchesSearch;
    });

    const featuredProjectsList = filteredProjects.filter(p => p.isFeatured);
    const otherProjectsList = filteredProjects.filter(p => !p.isFeatured);

    return (
        <section id="projects" ref={ref} style={{ padding: '100px 24px' }}>
            <motion.div
                variants={fadeInUp}
                initial="hidden"
                animate={isInView ? "visible" : "hidden"}
                style={{ maxWidth: '1200px', margin: '0 auto' }}
            >
                <SectionHeader number="03" title="Featured Work" />

                {/* Filter and Search Bar */}
                <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '20px',
                    margin: '40px 0 32px',
                    padding: '24px',
                    borderRadius: '20px',
                    background: 'var(--bg-secondary)',
                    border: '1px solid var(--border)',
                }}>
                    <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', alignItems: 'center' }}>
                        {/* Search Input */}
                        <div style={{ position: 'relative', flex: 1, minWidth: '280px' }}>
                            <Search size={18} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={e => setSearchQuery(e.target.value)}
                                placeholder="Search by name, description or skill..."
                                style={{
                                    width: '100%',
                                    padding: '14px 16px 14px 48px',
                                    background: 'var(--bg-card)',
                                    border: '1px solid var(--border)',
                                    borderRadius: '12px',
                                    color: 'var(--text-primary)',
                                    fontFamily: 'inherit',
                                    fontSize: '0.95rem',
                                    outline: 'none',
                                    transition: 'border-color 0.25s',
                                    boxSizing: 'border-box'
                                }}
                                onFocus={e => e.target.style.borderColor = 'var(--accent)'}
                                onBlur={e => e.target.style.borderColor = 'var(--border)'}
                            />
                            {searchQuery && (
                                <button 
                                    onClick={() => setSearchQuery('')}
                                    style={{
                                        position: 'absolute', right: '16px', top: '50%', transform: 'translateY(-50%)',
                                        background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer'
                                    }}
                                >
                                    <X size={16} />
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Category Tabs */}
                    <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', overflowX: 'auto', paddingBottom: '4px' }}>
                        {CATEGORIES.map(cat => {
                            const isSelected = selectedCategory === cat;
                            return (
                                <motion.button
                                    key={cat}
                                    onClick={() => setSelectedCategory(cat)}
                                    whileHover={{ y: -2 }}
                                    whileTap={{ scale: 0.97 }}
                                    style={{
                                        padding: '10px 18px',
                                        borderRadius: '10px',
                                        border: '1px solid var(--border)',
                                        cursor: 'pointer',
                                        background: isSelected ? 'var(--accent)' : 'var(--bg-card)',
                                        color: isSelected ? 'hsl(222 47% 5%)' : 'var(--text-secondary)',
                                        fontFamily: 'inherit',
                                        fontSize: '0.85rem',
                                        fontWeight: 600,
                                        whiteSpace: 'nowrap',
                                        transition: 'all 0.25s',
                                        boxShadow: isSelected ? '0 4px 12px hsl(187 94% 43% / 0.25)' : 'none'
                                    }}
                                >
                                    {cat}
                                </motion.button>
                            );
                        })}
                    </div>
                </div>

                {loading ? (
                    <div style={{ textAlign: 'center', padding: '60px', color: 'var(--text-secondary)' }}>
                        <div className="glow" style={{
                            width: '40px', height: '40px', borderRadius: '50%', border: '3px solid var(--border)',
                            borderTopColor: 'var(--accent)', animation: 'spin 1s linear infinite', margin: '0 auto 16px'
                        }} />
                        <p style={{ fontSize: '0.9rem' }}>Loading work showcase...</p>
                    </div>
                ) : filteredProjects.length === 0 ? (
                    <div className="glass" style={{ textAlign: 'center', padding: '60px 24px', borderRadius: '20px', maxWidth: '600px', margin: '40px auto 0' }}>
                        <p style={{ color: 'var(--text-secondary)', fontSize: '1.05rem', lineHeight: 1.6, margin: 0 }}>
                            No projects match your current filters or search query. Try another combination!
                        </p>
                    </div>
                ) : (
                    <>
                        {/* Project Cards Grid */}
                        {featuredProjectsList.length > 0 && (
                            <motion.div
                                variants={staggerContainer}
                                initial="hidden"
                                animate="visible"
                                style={{
                                    display: 'grid',
                                    gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
                                    gap: '32px',
                                    marginBottom: '80px'
                                }}
                            >
                                {featuredProjectsList.map((project) => (
                                    <motion.div
                                        key={project._id || project.title}
                                        variants={staggerItem}
                                        whileHover={{ 
                                            y: -8, 
                                            borderColor: 'var(--accent)',
                                            boxShadow: '0 12px 30px -10px hsl(187 94% 43% / 0.15)',
                                            transition: { duration: 0.3 } 
                                        }}
                                        style={{
                                            borderRadius: '20px',
                                            overflow: 'hidden',
                                            background: 'var(--bg-secondary)',
                                            border: '1px solid var(--border)',
                                            cursor: 'default',
                                            transition: 'border-color 0.3s, box-shadow 0.3s'
                                        }}
                                    >
                                        {/* Image Container */}
                                        <div style={{
                                            position: 'relative',
                                            height: '220px',
                                            overflow: 'hidden'
                                        }}>
                                            <img
                                                src={project.image || 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&h=500&fit=crop'}
                                                alt={project.title}
                                                loading="lazy"
                                                className="project-card-image"
                                                style={{
                                                    width: '100%',
                                                    height: '100%',
                                                    objectFit: 'cover',
                                                    transition: 'transform 0.5s cubic-bezier(0.25, 1, 0.5, 1)'
                                                }}
                                            />
                                            {/* Gradient Overlay */}
                                            <div style={{
                                                position: 'absolute',
                                                inset: 0,
                                                background: `linear-gradient(to top, var(--bg-secondary) 0%, transparent 60%)`
                                            }} />
                                            {/* Icon Badge */}
                                            <div style={{
                                                position: 'absolute',
                                                top: '16px',
                                                left: '16px',
                                                width: '48px',
                                                height: '48px',
                                                borderRadius: '12px',
                                                background: 'var(--bg-secondary)',
                                                backdropFilter: 'blur(10px)',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                fontSize: '1.5rem',
                                                border: '1px solid var(--border)'
                                            }}>
                                                {project.icon || '💻'}
                                            </div>
                                        </div>

                                        {/* Content */}
                                        <div style={{ padding: '24px' }}>
                                            <h3 style={{
                                                fontSize: '1.25rem',
                                                fontWeight: 700,
                                                marginBottom: '12px',
                                                color: 'var(--text-primary)'
                                            }}>
                                                {project.title}
                                            </h3>
                                            <p style={{
                                                color: 'var(--text-secondary)',
                                                fontSize: '0.95rem',
                                                lineHeight: 1.6,
                                                marginBottom: '20px',
                                                minHeight: '4.8em',
                                                display: '-webkit-box',
                                                WebkitLineClamp: 3,
                                                WebkitBoxOrient: 'vertical',
                                                overflow: 'hidden'
                                            }}>
                                                {project.description}
                                            </p>

                                            {/* Technology Tags */}
                                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '24px', minHeight: '66px' }}>
                                                {project.technologies.slice(0, 5).map(tech => {
                                                    const colors = getTagColor(tech);
                                                    return (
                                                        <span
                                                            key={tech}
                                                            style={{
                                                                padding: '6px 14px',
                                                                borderRadius: '20px',
                                                                background: colors.bg,
                                                                color: colors.text,
                                                                fontSize: '0.8rem',
                                                                fontWeight: 500,
                                                                border: `1px solid ${colors.border}`
                                                            }}
                                                        >
                                                            {tech}
                                                        </span>
                                                    );
                                                })}
                                                {project.technologies.length > 5 && (
                                                    <span style={{ padding: '6px 10px', fontSize: '0.8rem', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center' }}>
                                                        +{project.technologies.length - 5} more
                                                    </span>
                                                )}
                                            </div>

                                            {/* Action Buttons */}
                                            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                                                <Link
                                                    to={`/project/${project.slug}`}
                                                    style={{
                                                        flex: 1,
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        justifyContent: 'center',
                                                        gap: '8px',
                                                        padding: '12px 20px',
                                                        background: 'var(--bg-card)',
                                                        color: 'var(--text-primary)',
                                                        borderRadius: '10px',
                                                        fontWeight: 600,
                                                        fontSize: '0.9rem',
                                                        textDecoration: 'none',
                                                        border: '1px solid var(--border)',
                                                        textAlign: 'center',
                                                        transition: 'all 0.2s'
                                                    }}
                                                    className="case-study-btn"
                                                >
                                                    Case Study
                                                </Link>
                                                {project.live && project.live !== '#' && (
                                                    <motion.a
                                                        href={project.live}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        whileHover={{ scale: 1.02 }}
                                                        whileTap={{ scale: 0.98 }}
                                                        style={{
                                                            flex: 1,
                                                            display: 'flex',
                                                            alignItems: 'center',
                                                            justifyContent: 'center',
                                                            gap: '8px',
                                                            padding: '12px 20px',
                                                            background: 'var(--accent)',
                                                            color: isDarkMode ? 'hsl(222 47% 5%)' : 'white',
                                                            borderRadius: '10px',
                                                            fontWeight: 600,
                                                            fontSize: '0.9rem',
                                                            textDecoration: 'none',
                                                            border: 'none',
                                                            textAlign: 'center'
                                                        }}
                                                    >
                                                        <ExternalLink size={16} />
                                                        Live Demo
                                                    </motion.a>
                                                )}
                                                {project.github && project.github !== '#' && !project.isPrivateCode && (
                                                    <motion.a
                                                        href={project.github}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        whileHover={{ scale: 1.02 }}
                                                        whileTap={{ scale: 0.98 }}
                                                        style={{
                                                            flex: 1,
                                                            display: 'flex',
                                                            alignItems: 'center',
                                                            justifyContent: 'center',
                                                            gap: '8px',
                                                            padding: '12px 20px',
                                                            background: 'var(--bg-card)',
                                                            color: 'var(--text-primary)',
                                                            borderRadius: '10px',
                                                            fontWeight: 600,
                                                            fontSize: '0.9rem',
                                                            textDecoration: 'none',
                                                            border: '1px solid var(--border)',
                                                            textAlign: 'center'
                                                        }}
                                                    >
                                                        <Github size={16} />
                                                        Code
                                                    </motion.a>
                                                )}
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}
                            </motion.div>
                        )}

                        {/* Other Projects */}
                        {otherProjectsList.length > 0 && (
                            <>
                                <motion.h3
                                    variants={fadeInUp}
                                    initial="hidden"
                                    animate="visible"
                                    style={{ fontSize: '1.5rem', fontWeight: 700, textAlign: 'center', marginBottom: '32px', marginTop: '60px' }}
                                >
                                    Other Noteworthy Projects
                                </motion.h3>
                                <motion.div
                                    variants={staggerContainer}
                                    initial="hidden"
                                    animate="visible"
                                    style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}
                                >
                                    {otherProjectsList.map((project) => (
                                        <motion.div
                                            key={project._id || project.title}
                                            variants={staggerItem}
                                            whileHover={{ 
                                                y: -8, 
                                                borderColor: 'var(--accent)',
                                                boxShadow: '0 12px 24px -10px hsl(187 94% 43% / 0.15)',
                                                transition: { duration: 0.3 } 
                                            }}
                                            style={{
                                                borderRadius: '20px',
                                                overflow: 'hidden',
                                                background: 'var(--bg-secondary)',
                                                border: '1px solid var(--border)',
                                                cursor: 'default',
                                                transition: 'border-color 0.3s, box-shadow 0.3s',
                                                display: 'flex',
                                                flexDirection: 'column'
                                            }}
                                        >
                                            {/* Image Header */}
                                            <div style={{
                                                position: 'relative',
                                                height: '180px',
                                                overflow: 'hidden',
                                                background: 'linear-gradient(135deg, hsl(222 47% 10%) 0%, hsl(187 94% 43% / 0.15) 100%)'
                                            }}>
                                                <img
                                                    src={project.image || 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=600&h=380&fit=crop'}
                                                    alt={project.title}
                                                    loading="lazy"
                                                    className="project-card-image"
                                                    style={{
                                                        width: '100%',
                                                        height: '100%',
                                                        objectFit: 'cover',
                                                        transition: 'transform 0.5s cubic-bezier(0.25, 1, 0.5, 1)'
                                                    }}
                                                />
                                                {/* Gradient Overlay */}
                                                <div style={{
                                                    position: 'absolute',
                                                    inset: 0,
                                                    background: `linear-gradient(to top, var(--bg-secondary) 0%, transparent 60%)`
                                                }} />
                                                {/* Icon Badge */}
                                                <div style={{
                                                    position: 'absolute',
                                                    top: '16px',
                                                    left: '16px',
                                                    width: '40px',
                                                    height: '40px',
                                                    borderRadius: '10px',
                                                    background: 'var(--bg-secondary)',
                                                    backdropFilter: 'blur(10px)',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    fontSize: '1.25rem',
                                                    border: '1px solid var(--border)'
                                                }}>
                                                    {project.icon || <Folder size={18} style={{ color: 'var(--accent)' }} />}
                                                </div>
                                            </div>

                                            {/* Content Padding */}
                                            <div style={{ padding: '24px', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                                                <div>
                                                    <span style={{
                                                        padding: '2px 8px', borderRadius: '4px', background: 'hsl(187 94% 43% / 0.1)',
                                                        color: 'var(--accent)', fontSize: '0.7rem', fontWeight: 600, border: '1px solid hsl(187 94% 43% / 0.2)'
                                                    }}>
                                                        {project.category || 'Project'}
                                                    </span>
                                                    <h4 style={{ fontSize: '1.15rem', fontWeight: 700, margin: '10px 0', color: 'var(--text-primary)' }}>
                                                        {project.title}
                                                    </h4>
                                                    <p style={{ 
                                                        color: 'var(--text-secondary)', 
                                                        fontSize: '0.9rem', 
                                                        marginBottom: '20px', 
                                                        lineHeight: 1.6, 
                                                        minHeight: '4.8em', 
                                                        display: '-webkit-box', 
                                                        WebkitLineClamp: 3, 
                                                        WebkitBoxOrient: 'vertical', 
                                                        overflow: 'hidden' 
                                                    }}>
                                                        {project.description}
                                                    </p>

                                                    {/* Technology Tags */}
                                                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '24px' }}>
                                                        {project.technologies.slice(0, 3).map(tech => {
                                                            const colors = getTagColor(tech);
                                                            return (
                                                                <span
                                                                    key={tech}
                                                                    style={{
                                                                        fontSize: '0.75rem',
                                                                        padding: '4px 10px',
                                                                        borderRadius: '6px',
                                                                        background: colors.bg,
                                                                        color: colors.text,
                                                                        border: `1px solid ${colors.border}`
                                                                    }}
                                                                >
                                                                    {tech}
                                                                </span>
                                                            );
                                                        })}
                                                    </div>
                                                </div>

                                                {/* Action Buttons */}
                                                <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                                                    <Link
                                                        to={`/project/${project.slug}`}
                                                        style={{
                                                            flex: 1,
                                                            display: 'flex',
                                                            alignItems: 'center',
                                                            justifyContent: 'center',
                                                            gap: '6px',
                                                            padding: '10px 16px',
                                                            background: 'var(--bg-card)',
                                                            color: 'var(--text-primary)',
                                                            borderRadius: '8px',
                                                            fontWeight: 600,
                                                            fontSize: '0.85rem',
                                                            textDecoration: 'none',
                                                            border: '1px solid var(--border)',
                                                            textAlign: 'center',
                                                            transition: 'all 0.2s'
                                                        }}
                                                        className="case-study-btn"
                                                    >
                                                        Case Study
                                                    </Link>
                                                    {project.github && project.github !== '#' && !project.isPrivateCode && (
                                                        <motion.a
                                                            whileHover={{ scale: 1.05 }}
                                                            whileTap={{ scale: 0.95 }}
                                                            href={project.github}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            style={{
                                                                display: 'flex',
                                                                alignItems: 'center',
                                                                justifyContent: 'center',
                                                                width: '38px',
                                                                height: '38px',
                                                                background: 'var(--bg-card)',
                                                                border: '1px solid var(--border)',
                                                                borderRadius: '8px',
                                                                color: 'var(--text-secondary)'
                                                            }}
                                                        >
                                                            <Github size={16} />
                                                        </motion.a>
                                                    )}
                                                </div>
                                            </div>
                                        </motion.div>
                                    ))}
                                </motion.div>
                            </>
                        )}
                    </>
                )}
            </motion.div>
            <style>{`
                /* Add a zoom on image hover */
                #projects div:hover > div > .project-card-image {
                    transform: scale(1.05) !important;
                }
                
                /* Spin animation for spinner */
                @keyframes spin {
                    from { transform: rotate(0deg); }
                    to { transform: rotate(360deg); }
                }
                
                /* Case study button hover effect */
                .case-study-btn:hover {
                    background: var(--bg-secondary) !important;
                    border-color: var(--accent) !important;
                    color: var(--accent) !important;
                }
            `}</style>
        </section>
    );
}

