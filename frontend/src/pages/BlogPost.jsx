import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, Calendar, Tag, User, Clock, AlertTriangle } from 'lucide-react';
import useApiData from '../hooks/useApiData';

export default function BlogPost() {
    const { slug } = useParams();
    const { data: blog, loading, error } = useApiData(`blogs/slug/${slug}`, null);

    const formatDate = (dateString) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
    };

    // Render markdown content to simple, beautiful styled HTML safely
    const renderContent = (content) => {
        if (!content) return '';
        // If content looks like HTML, render as HTML, else do basic Markdown replacement
        if (content.trim().startsWith('<')) {
            return { __html: content };
        }
        
        // Simple Markdown replacement helper for previewing:
        const html = content
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/^### (.*$)/gim, '<h3>$1</h3>')
            .replace(/^## (.*$)/gim, '<h2>$1</h2>')
            .replace(/^# (.*$)/gim, '<h1>$1</h1>')
            .replace(/\*\*(.*)\*\*/gim, '<strong>$1</strong>')
            .replace(/\*(.*)\*/gim, '<em>$1</em>')
            .replace(/`([^`]+)`/gim, '<code>$1</code>')
            .replace(/\n$/gim, '<br />')
            .split('\n')
            .map(para => {
                if (para.trim().startsWith('<h') || para.trim().startsWith('<pre') || para.trim().startsWith('<code')) {
                    return para;
                }
                return para.trim() ? `<p>${para}</p>` : '';
            })
            .join('\n');
            
        return { __html: html };
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
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Loading article...</p>
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

    if (error || !blog) {
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
                    <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '8px' }}>Article Not Found</h2>
                    <p style={{ color: 'var(--text-secondary)', marginBottom: '24px', fontSize: '0.95rem' }}>
                        The article you are looking for does not exist or has been moved.
                    </p>
                    <Link to="/blog" style={{
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
                        <ArrowLeft size={16} /> Back to Articles
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div style={{ minHeight: '100vh', background: 'var(--bg-primary)', paddingBottom: '100px' }}>
            {/* Header */}
            <header className="glass" style={{ position: 'sticky', top: 0, zIndex: 50, borderTop: 'none', borderLeft: 'none', borderRight: 'none' }}>
                <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '16px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Link to="/blog" style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '8px',
                        color: 'var(--text-secondary)',
                        textDecoration: 'none',
                        fontWeight: 600,
                        fontSize: '0.9rem',
                        transition: 'color 0.2s'
                    }} onMouseOver={e => e.target.style.color = 'var(--text-primary)'} onMouseOut={e => e.target.style.color = 'var(--text-secondary)'}>
                        <ArrowLeft size={16} /> Back to Articles
                    </Link>
                    <span style={{ fontWeight: 800, fontSize: '1rem', color: 'var(--text-secondary)' }}>
                        Reading: {blog.title.slice(0, 30)}{blog.title.length > 30 ? '...' : ''}
                    </span>
                </div>
            </header>

            {/* Cover image header */}
            <div style={{ maxWidth: '1000px', margin: '40px auto 0', padding: '0 24px' }}>
                {blog.coverImage && (
                    <div style={{ borderRadius: '24px', overflow: 'hidden', border: '1px solid var(--border)', height: '400px', width: '100%', marginBottom: '40px' }}>
                        <img 
                            src={blog.coverImage} 
                            alt={blog.title} 
                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        />
                    </div>
                )}

                {/* Article Header info */}
                <div style={{ marginBottom: '40px' }}>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px', alignItems: 'center', color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '16px' }}>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <Calendar size={14} style={{ color: 'var(--accent)' }} />
                            {formatDate(blog.publishedAt || blog.createdAt)}
                        </span>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <User size={14} />
                            By {blog.author || 'Admin'}
                        </span>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <Clock size={14} />
                            {Math.max(1, Math.ceil((blog.content?.length || 500) / 1000))} min read
                        </span>
                    </div>

                    <h1 style={{ fontSize: '3.25rem', fontWeight: 800, color: 'var(--text-primary)', tracking: '-0.02em', lineHeight: 1.15, marginBottom: '24px' }}>
                        {blog.title}
                    </h1>

                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                        {blog.tags?.map(t => (
                            <span key={t} style={{
                                display: 'inline-flex', alignItems: 'center', gap: '4px',
                                padding: '6px 14px', borderRadius: '20px', background: 'hsl(187 94% 43% / 0.1)',
                                color: 'var(--accent)', fontSize: '0.8rem', fontWeight: 600, border: '1px solid hsl(187 94% 43% / 0.2)'
                            }}>
                                <Tag size={12} /> {t}
                            </span>
                        ))}
                    </div>
                </div>

                <hr style={{ border: 'none', borderTop: '1px solid var(--border)', marginBottom: '40px' }} />

                {/* Article content */}
                <article 
                    className="article-content"
                    dangerouslySetInnerHTML={renderContent(blog.content)}
                    style={{
                        color: 'var(--text-primary)',
                        fontSize: '1.1rem',
                        lineHeight: 1.8,
                        maxWidth: '740px',
                        margin: '0 auto'
                    }}
                />
            </div>
            
            <style>{`
                .article-content p {
                    margin-bottom: 24px;
                }
                .article-content h2 {
                    font-size: 1.8rem;
                    font-weight: 700;
                    margin-top: 48px;
                    margin-bottom: 16px;
                    color: var(--text-primary);
                }
                .article-content h3 {
                    font-size: 1.4rem;
                    font-weight: 600;
                    margin-top: 36px;
                    margin-bottom: 12px;
                    color: var(--text-primary);
                }
                .article-content code {
                    font-family: 'JetBrains Mono', monospace;
                    background: var(--bg-secondary);
                    padding: 3px 6px;
                    border-radius: 6px;
                    font-size: 0.9em;
                    border: 1px solid var(--border);
                }
                .article-content pre {
                    background: var(--bg-secondary);
                    padding: 20px;
                    border-radius: 12px;
                    border: 1px solid var(--border);
                    overflow-x: auto;
                    margin-bottom: 28px;
                }
                .article-content pre code {
                    background: transparent;
                    padding: 0;
                    border: none;
                    font-size: 0.85em;
                }
                .article-content ul, .article-content ol {
                    margin-bottom: 24px;
                    padding-left: 24px;
                }
                .article-content li {
                    margin-bottom: 8px;
                }
                .article-content strong {
                    font-weight: 700;
                    color: var(--text-primary);
                }
            `}</style>
        </div>
    );
}
