import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FileText, Plus, Edit2, Trash2, Loader2, Eye, EyeOff, Tag } from 'lucide-react';
import axiosInstance from '../../config/axiosInstance';
import Modal, { fieldStyle, labelStyle, buttonPrimaryStyle, dangerButtonStyle } from '../ui/Modal';
import ImageUploader from '../ui/ImageUploader';
import { showToast } from '../ui/Toast';

const emptyForm = {
    title: '', slug: '', content: '', excerpt: '', coverImage: '',
    tags: [], status: 'draft', seoTitle: '', seoDescription: ''
};

export default function BlogsTab() {
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [form, setForm] = useState(emptyForm);
    const [saving, setSaving] = useState(false);
    const [tagInput, setTagInput] = useState('');
    const [filter, setFilter] = useState('all'); // 'all', 'published', 'draft'

    useEffect(() => { fetchItems(); }, []);

    const fetchItems = async () => {
        try { const res = await axiosInstance.get('/blogs'); setItems(res.data); }
        catch (err) { console.error(err); }
        finally { setLoading(false); }
    };

    const openAdd = () => { setForm(emptyForm); setEditingId(null); setTagInput(''); setShowModal(true); };
    const openEdit = (item) => { setForm({ ...emptyForm, ...item }); setEditingId(item._id); setTagInput(''); setShowModal(true); };

    const generateSlug = (title) => title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 80);

    const handleSave = async () => {
        if (!form.title) return showToast('Blog title is required', 'error');
        setSaving(true);
        const data = { ...form };
        if (!data.slug) data.slug = generateSlug(data.title);
        try {
            if (editingId) {
                await axiosInstance.put(`/blogs/${editingId}`, data);
                showToast('Blog updated!', 'success');
            } else {
                await axiosInstance.post('/blogs', data);
                showToast('Blog created!', 'success');
            }
            setShowModal(false);
            fetchItems();
        } catch (err) { showToast(err.response?.data?.message || 'Failed to save', 'error'); }
        setSaving(false);
    };

    const handleDelete = async (id) => {
        if (!confirm('Delete this blog post?')) return;
        try {
            await axiosInstance.delete(`/blogs/${id}`);
            showToast('Blog deleted', 'success');
            fetchItems();
        } catch (err) { showToast('Failed to delete', 'error'); }
    };

    const toggleStatus = async (item) => {
        const newStatus = item.status === 'published' ? 'draft' : 'published';
        try {
            await axiosInstance.put(`/blogs/${item._id}`, { status: newStatus });
            showToast(`Blog ${newStatus === 'published' ? 'published' : 'unpublished'}!`, 'success');
            fetchItems();
        } catch (err) { showToast('Failed to update status', 'error'); }
    };

    const addTag = () => {
        if (tagInput.trim()) {
            setForm(f => ({ ...f, tags: [...f.tags, tagInput.trim()] }));
            setTagInput('');
        }
    };

    const removeTag = (idx) => {
        setForm(f => ({ ...f, tags: f.tags.filter((_, i) => i !== idx) }));
    };

    const filteredItems = filter === 'all' ? items : items.filter(i => i.status === filter);

    if (loading) return <div style={{ textAlign: 'center', padding: '60px', color: 'hsl(215 20% 50%)' }}><Loader2 size={32} style={{ animation: 'spin 1s linear infinite' }} /> Loading...</div>;

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '12px' }}>
                <h2 style={{ fontSize: '1.5rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <FileText size={24} style={{ color: 'hsl(187 94% 43%)' }} /> Blog Posts
                    <span style={{ fontSize: '0.875rem', color: 'hsl(215 20% 50%)', fontWeight: 400 }}>({items.length})</span>
                </h2>
                <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                    {['all', 'published', 'draft'].map(f => (
                        <button key={f} onClick={() => setFilter(f)} style={{
                            padding: '6px 14px', borderRadius: '8px', fontFamily: 'inherit', fontSize: '0.8rem', fontWeight: 600, cursor: 'pointer',
                            background: filter === f ? 'hsl(187 94% 43%)' : 'hsl(222 30% 12%)',
                            color: filter === f ? 'hsl(222 47% 5%)' : 'hsl(215 20% 55%)',
                            border: filter === f ? 'none' : '1px solid hsl(222 30% 22%)',
                            textTransform: 'capitalize'
                        }}>{f}</button>
                    ))}
                    <motion.button onClick={openAdd} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} style={buttonPrimaryStyle}>
                        <Plus size={18} /> New Post
                    </motion.button>
                </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {filteredItems.map((item, i) => (
                    <motion.div key={item._id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}
                        style={{ padding: '20px', background: 'hsl(222 47% 8%)', border: '1px solid hsl(222 30% 18%)', borderRadius: '14px', display: 'flex', gap: '16px', alignItems: 'center' }}>
                        {item.coverImage && (
                            <img src={item.coverImage} alt="" style={{ width: '80px', height: '60px', objectFit: 'cover', borderRadius: '8px', flexShrink: 0 }} />
                        )}
                        <div style={{ flex: 1, minWidth: 0 }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                                <h3 style={{ fontWeight: 600, fontSize: '1rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item.title}</h3>
                                <span style={{
                                    padding: '2px 8px', borderRadius: '4px', fontSize: '0.65rem', fontWeight: 700, textTransform: 'uppercase', flexShrink: 0,
                                    background: item.status === 'published' ? 'hsl(142 76% 36% / 0.15)' : 'hsl(38 92% 50% / 0.15)',
                                    color: item.status === 'published' ? 'hsl(142 76% 50%)' : 'hsl(38 92% 60%)'
                                }}>{item.status}</span>
                            </div>
                            <p style={{ color: 'hsl(215 20% 50%)', fontSize: '0.8rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item.excerpt || item.content?.slice(0, 100)}</p>
                            {item.tags?.length > 0 && (
                                <div style={{ display: 'flex', gap: '4px', marginTop: '6px', flexWrap: 'wrap' }}>
                                    {item.tags.map((t, j) => (
                                        <span key={j} style={{ padding: '2px 8px', background: 'hsl(262 83% 58% / 0.1)', color: 'hsl(262 83% 65%)', borderRadius: '4px', fontSize: '0.7rem' }}>{t}</span>
                                    ))}
                                </div>
                            )}
                        </div>
                        <div style={{ display: 'flex', gap: '6px', flexShrink: 0 }}>
                            <motion.button onClick={() => toggleStatus(item)} whileHover={{ scale: 1.1 }} title={item.status === 'published' ? 'Unpublish' : 'Publish'}
                                style={{ background: 'hsl(222 30% 15%)', border: '1px solid hsl(222 30% 22%)', borderRadius: '8px', padding: '8px', cursor: 'pointer', color: item.status === 'published' ? 'hsl(142 76% 50%)' : 'hsl(38 92% 55%)' }}>
                                {item.status === 'published' ? <Eye size={16} /> : <EyeOff size={16} />}
                            </motion.button>
                            <motion.button onClick={() => openEdit(item)} whileHover={{ scale: 1.1 }} style={{ background: 'hsl(222 30% 15%)', border: '1px solid hsl(222 30% 22%)', borderRadius: '8px', padding: '8px', cursor: 'pointer', color: 'hsl(187 94% 43%)' }}><Edit2 size={16} /></motion.button>
                            <motion.button onClick={() => handleDelete(item._id)} whileHover={{ scale: 1.1 }} style={{ ...dangerButtonStyle, padding: '8px' }}><Trash2 size={16} /></motion.button>
                        </div>
                    </motion.div>
                ))}
                {filteredItems.length === 0 && <p style={{ textAlign: 'center', padding: '40px', color: 'hsl(215 20% 50%)' }}>No blog posts. Click "New Post" to start writing.</p>}
            </div>

            <Modal isOpen={showModal} onClose={() => setShowModal(false)} title={editingId ? 'Edit Blog Post' : 'New Blog Post'} maxWidth="700px">
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    <div><label style={labelStyle}>Title *</label><input value={form.title} onChange={e => setForm({ ...form, title: e.target.value, slug: generateSlug(e.target.value) })} style={fieldStyle} placeholder="Blog post title" /></div>
                    <div><label style={labelStyle}>Slug</label><input value={form.slug} onChange={e => setForm({ ...form, slug: e.target.value })} style={{ ...fieldStyle, color: 'hsl(215 20% 50%)' }} placeholder="auto-generated-from-title" /></div>
                    <div><label style={labelStyle}>Excerpt</label><textarea value={form.excerpt} onChange={e => setForm({ ...form, excerpt: e.target.value })} style={{ ...fieldStyle, minHeight: '60px', resize: 'vertical' }} placeholder="Brief summary for preview cards..." /></div>
                    <div><label style={labelStyle}>Content (Markdown)</label><textarea value={form.content} onChange={e => setForm({ ...form, content: e.target.value })} style={{ ...fieldStyle, minHeight: '250px', resize: 'vertical', fontFamily: 'JetBrains Mono, monospace', fontSize: '0.85rem' }} placeholder="Write your blog post in Markdown..." /></div>
                    <ImageUploader value={form.coverImage} onChange={url => setForm({ ...form, coverImage: url })} folder="portfolio/blogs" label="Cover Image" />
                    <div>
                        <label style={labelStyle}>Tags</label>
                        <div style={{ display: 'flex', gap: '8px' }}>
                            <input value={tagInput} onChange={e => setTagInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addTag())} style={{ ...fieldStyle, flex: 1 }} placeholder="e.g. React" />
                            <button onClick={addTag} type="button" style={{ ...buttonPrimaryStyle, padding: '12px 16px' }}>Add</button>
                        </div>
                        {form.tags?.length > 0 && (
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginTop: '8px' }}>
                                {form.tags.map((t, j) => (
                                    <span key={j} onClick={() => removeTag(j)} style={{ padding: '4px 10px', background: 'hsl(262 83% 58% / 0.15)', color: 'hsl(262 83% 65%)', borderRadius: '6px', fontSize: '0.75rem', cursor: 'pointer' }}>{t} ×</span>
                                ))}
                            </div>
                        )}
                    </div>
                    <div>
                        <label style={labelStyle}>Status</label>
                        <select value={form.status} onChange={e => setForm({ ...form, status: e.target.value })} style={{ ...fieldStyle, cursor: 'pointer' }}>
                            <option value="draft">Draft</option>
                            <option value="published">Published</option>
                        </select>
                    </div>
                    <details style={{ background: 'hsl(222 30% 10%)', borderRadius: '10px', padding: '16px', border: '1px solid hsl(222 30% 18%)' }}>
                        <summary style={{ cursor: 'pointer', color: 'hsl(187 94% 43%)', fontWeight: 600, fontSize: '0.85rem' }}>SEO Settings</summary>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '12px' }}>
                            <div><label style={labelStyle}>SEO Title</label><input value={form.seoTitle} onChange={e => setForm({ ...form, seoTitle: e.target.value })} style={fieldStyle} placeholder="Custom SEO title (optional)" /></div>
                            <div><label style={labelStyle}>SEO Description</label><textarea value={form.seoDescription} onChange={e => setForm({ ...form, seoDescription: e.target.value })} style={{ ...fieldStyle, minHeight: '60px', resize: 'vertical' }} placeholder="Meta description for search engines..." /></div>
                        </div>
                    </details>
                    <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '8px' }}>
                        <button onClick={() => setShowModal(false)} style={{ padding: '12px 24px', background: 'transparent', border: '1px solid hsl(222 30% 22%)', borderRadius: '10px', color: 'hsl(215 20% 65%)', cursor: 'pointer', fontFamily: 'inherit' }}>Cancel</button>
                        <motion.button onClick={handleSave} disabled={saving} whileHover={{ scale: saving ? 1 : 1.02 }} style={{ ...buttonPrimaryStyle, opacity: saving ? 0.6 : 1 }}>
                            {saving ? <><Loader2 size={18} style={{ animation: 'spin 1s linear infinite' }} /> Saving...</> : (editingId ? 'Update' : 'Create')}
                        </motion.button>
                    </div>
                </div>
            </Modal>
            <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
        </div>
    );
}
