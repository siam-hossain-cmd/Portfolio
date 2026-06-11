import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Search, Calendar, Tag, Clock } from 'lucide-react';
import useApiData from '../hooks/useApiData';

export default function BlogList() {
    const { data: blogs, loading, error } = useApiData('blogs', []);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedTag, setSelectedTag] = useState(null);

    // Get all unique tags from published blogs
    const publishedBlogs = (blogs || []).filter(b => b.status === 'published');
    const allTags = Array.from(new Set(publishedBlogs.flatMap(b => b.tags || [])));

    // Filtered blogs
    const filteredBlogs = publishedBlogs.filter(blog => {
        const matchesSearch = blog.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                              blog.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesTag = !selectedTag || blog.tags?.includes(selectedTag);
        return matchesSearch && matchesTag;
    });

    const formatDate = (dateString) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
    };

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
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Loading articles...</p>
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

    return (
        <div style={{ minHeight: '100vh', background: 'var(--bg-primary)', paddingBottom: '80px' }}>
            {/* Header */}
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
                    <span style={{ fontWeight: 800, fontSize: '1.25rem', tracking: '-0.03em' }} className="text-gradient">
                        Insights & Articles
                    </span>
                </div>
            </header>

            {/* Hero area */}
            <section style={{ padding: '60px 24px 40px', textAlign: 'center', maxWidth: '800px', margin: '0 auto' }}>
                <h1 style={{ fontSize: '3rem', fontWeight: 800, marginBottom: '16px', tracking: '-0.02em' }}>
                    Writing on Software Design, Architecture, & Technology
                </h1>
                <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem', lineHeight: 1.6, marginBottom: '32px' }}>
                    Here, I share my thoughts, guides, and learnings gained from building products and tackling complex technical challenges.
                </p>

                {/* Search Bar */}
                <div style={{ position: 'relative', maxWidth: '500px', margin: '0 auto' }}>
                    <Search size={18} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
                    <input 
                        type="text" 
                        placeholder="Search articles..." 
                        value={searchQuery}
                        onChange={e => setSearchQuery(e.target.value)}
                        style={{
                            width: '100%', padding: '14px 16px 14px 48px', background: 'var(--bg-secondary)',
                            border: '1px solid var(--border)', borderRadius: '12px', color: 'var(--text-primary)',
                            fontFamily: 'inherit', fontSize: '0.95rem', outline: 'none', boxSizing: 'border-box'
                        }}
                    />
                </div>
            </section>

            {/* Content list */}
            <main style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 24px', display: 'grid', gridTemplateColumns: '3fr 1fr', gap: '48px' }}>
                
                {/* Column 1: Blogs list */}
                <div>
                    {filteredBlogs.length === 0 ? (
                        <div className="glass" style={{ padding: '48px', borderRadius: '20px', textAlign: 'center' }}>
                            <p style={{ color: 'var(--text-secondary)', margin: 0, fontSize: '1rem' }}>
                                No articles found matching your criteria.
                            </p>
                        </div>
                    ) : (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
                            {filteredBlogs.map(blog => (
                                <article key={blog._id} className="glass animate-card" style={{
                                    display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '28px',
                                    borderRadius: '20px', overflow: 'hidden', padding: '20px',
                                    transition: 'transform 0.2s, border-color 0.2s',
                                    cursor: 'pointer'
                                }} onClick={() => window.location.href = `/blog/${blog.slug}`}>
                                    <div style={{ borderRadius: '12px', overflow: 'hidden', height: '180px' }}>
                                        <img 
                                            src={blog.coverImage || 'https://images.unsplash.com/photo-1516259762381-22954d7d3ad2?w=600&fit=crop'} 
                                            alt={blog.title} 
                                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                        />
                                    </div>
                                    <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', color: 'var(--text-secondary)', fontSize: '0.8rem', marginBottom: '12px' }}>
                                            <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                                <Calendar size={12} style={{ color: 'var(--accent)' }} />
                                                {formatDate(blog.publishedAt || blog.createdAt)}
                                            </span>
                                            <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                                <Clock size={12} />
                                                {Math.max(1, Math.ceil((blog.content?.length || 500) / 1000))} min read
                                            </span>
                                        </div>
                                        <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '12px', color: 'var(--text-primary)', lineHeight: 1.25 }}>
                                            {blog.title}
                                        </h2>
                                        <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: 1.5, marginBottom: '16px' }}>
                                            {blog.excerpt}
                                        </p>
                                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                                            {blog.tags?.map(t => (
                                                <span key={t} style={{
                                                    padding: '2px 8px', borderRadius: '4px', background: 'var(--bg-secondary)',
                                                    border: '1px solid var(--border)', fontSize: '0.75rem', color: 'var(--text-secondary)'
                                                }}>{t}</span>
                                            ))}
                                        </div>
                                    </div>
                                </article>
                            ))}
                        </div>
                    )}
                </div>

                {/* Column 2: Tag Sidebar */}
                <div>
                    <div className="glass" style={{ padding: '24px', borderRadius: '16px', position: 'sticky', top: '100px' }}>
                        <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <Tag size={16} style={{ color: 'var(--accent)' }} /> Topics
                        </h3>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                            <button 
                                onClick={() => setSelectedTag(null)}
                                style={{
                                    padding: '8px 12px', borderRadius: '8px', border: 'none', cursor: 'pointer', textAlign: 'left',
                                    background: !selectedTag ? 'var(--accent)' : 'transparent',
                                    color: !selectedTag ? 'hsl(222 47% 5%)' : 'var(--text-secondary)',
                                    fontWeight: 600, fontSize: '0.85rem', width: '100%'
                                }}
                            >
                                All Topics
                            </button>
                            {allTags.map(tag => (
                                <button 
                                    key={tag}
                                    onClick={() => setSelectedTag(tag)}
                                    style={{
                                        padding: '8px 12px', borderRadius: '8px', border: 'none', cursor: 'pointer', textAlign: 'left',
                                        background: selectedTag === tag ? 'var(--accent)' : 'transparent',
                                        color: selectedTag === tag ? 'hsl(222 47% 5%)' : 'var(--text-secondary)',
                                        fontWeight: 600, fontSize: '0.85rem', width: '100%'
                                    }}
                                >
                                    #{tag}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

            </main>
            <style>{`
                .animate-card:hover {
                    transform: translateY(-4px);
                    border-color: var(--accent);
                }
            `}</style>
        </div>
    );
}
