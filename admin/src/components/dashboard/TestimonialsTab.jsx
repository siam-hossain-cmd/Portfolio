import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { MessageSquareQuote, Plus, Edit2, Trash2, Loader2, Star } from 'lucide-react';
import axiosInstance from '../../config/axiosInstance';
import Modal, { fieldStyle, labelStyle, buttonPrimaryStyle, dangerButtonStyle } from '../ui/Modal';
import ImageUploader from '../ui/ImageUploader';
import { showToast } from '../ui/Toast';

const emptyForm = { name: '', position: '', company: '', content: '', image: '', rating: 5 };

export default function TestimonialsTab() {
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [form, setForm] = useState(emptyForm);
    const [saving, setSaving] = useState(false);

    useEffect(() => { fetchItems(); }, []);

    const fetchItems = async () => {
        try { const res = await axiosInstance.get('/testimonials'); setItems(res.data); }
        catch (err) { console.error(err); }
        finally { setLoading(false); }
    };

    const openAdd = () => { setForm(emptyForm); setEditingId(null); setShowModal(true); };
    const openEdit = (item) => { setForm({ ...emptyForm, ...item }); setEditingId(item._id); setShowModal(true); };

    const handleSave = async () => {
        if (!form.name || !form.content) return showToast('Name and content are required', 'error');
        setSaving(true);
        try {
            if (editingId) {
                await axiosInstance.put(`/testimonials/${editingId}`, form);
                showToast('Testimonial updated!', 'success');
            } else {
                await axiosInstance.post('/testimonials', form);
                showToast('Testimonial created!', 'success');
            }
            setShowModal(false);
            fetchItems();
        } catch (err) { showToast(err.response?.data?.message || 'Failed to save', 'error'); }
        setSaving(false);
    };

    const handleDelete = async (id) => {
        if (!confirm('Delete this testimonial?')) return;
        try {
            await axiosInstance.delete(`/testimonials/${id}`);
            showToast('Testimonial deleted', 'success');
            fetchItems();
        } catch (err) { showToast('Failed to delete', 'error'); }
    };

    const renderStars = (rating) => {
        return Array.from({ length: 5 }, (_, i) => (
            <Star key={i} size={14} fill={i < rating ? 'hsl(38 92% 50%)' : 'transparent'} style={{ color: i < rating ? 'hsl(38 92% 50%)' : 'hsl(222 30% 25%)' }} />
        ));
    };

    if (loading) return <div style={{ textAlign: 'center', padding: '60px', color: 'hsl(215 20% 50%)' }}><Loader2 size={32} style={{ animation: 'spin 1s linear infinite' }} /> Loading...</div>;

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                <h2 style={{ fontSize: '1.5rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <MessageSquareQuote size={24} style={{ color: 'hsl(187 94% 43%)' }} /> Testimonials
                    <span style={{ fontSize: '0.875rem', color: 'hsl(215 20% 50%)', fontWeight: 400 }}>({items.length})</span>
                </h2>
                <motion.button onClick={openAdd} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} style={buttonPrimaryStyle}>
                    <Plus size={18} /> Add Testimonial
                </motion.button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '16px' }}>
                {items.map((item, i) => (
                    <motion.div key={item._id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
                        style={{ padding: '24px', background: 'hsl(222 47% 8%)', border: '1px solid hsl(222 30% 18%)', borderRadius: '16px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                {item.image ? (
                                    <img src={item.image} alt={item.name} style={{ width: '48px', height: '48px', borderRadius: '50%', objectFit: 'cover' }} />
                                ) : (
                                    <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: 'hsl(187 94% 43% / 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'hsl(187 94% 43%)', fontWeight: 700, fontSize: '1.1rem' }}>
                                        {item.name.charAt(0).toUpperCase()}
                                    </div>
                                )}
                                <div>
                                    <h4 style={{ fontWeight: 600, fontSize: '0.95rem' }}>{item.name}</h4>
                                    <p style={{ color: 'hsl(215 20% 50%)', fontSize: '0.8rem' }}>{item.position}{item.company && ` @ ${item.company}`}</p>
                                </div>
                            </div>
                            <div style={{ display: 'flex', gap: '6px' }}>
                                <motion.button onClick={() => openEdit(item)} whileHover={{ scale: 1.1 }} style={{ background: 'hsl(222 30% 15%)', border: '1px solid hsl(222 30% 22%)', borderRadius: '8px', padding: '6px', cursor: 'pointer', color: 'hsl(187 94% 43%)' }}><Edit2 size={14} /></motion.button>
                                <motion.button onClick={() => handleDelete(item._id)} whileHover={{ scale: 1.1 }} style={{ ...dangerButtonStyle, padding: '6px' }}><Trash2 size={14} /></motion.button>
                            </div>
                        </div>
                        <div style={{ display: 'flex', gap: '2px', marginBottom: '10px' }}>{renderStars(item.rating)}</div>
                        <p style={{ color: 'hsl(215 20% 70%)', fontSize: '0.85rem', lineHeight: 1.6, fontStyle: 'italic' }}>"{item.content}"</p>
                    </motion.div>
                ))}
                {items.length === 0 && <p style={{ textAlign: 'center', padding: '40px', color: 'hsl(215 20% 50%)', gridColumn: '1/-1' }}>No testimonials yet. Add client feedback to show on your portfolio.</p>}
            </div>

            <Modal isOpen={showModal} onClose={() => setShowModal(false)} title={editingId ? 'Edit Testimonial' : 'Add Testimonial'}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    <div><label style={labelStyle}>Name *</label><input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} style={fieldStyle} placeholder="Client name" /></div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                        <div><label style={labelStyle}>Position</label><input value={form.position} onChange={e => setForm({ ...form, position: e.target.value })} style={fieldStyle} placeholder="e.g. CEO" /></div>
                        <div><label style={labelStyle}>Company</label><input value={form.company} onChange={e => setForm({ ...form, company: e.target.value })} style={fieldStyle} placeholder="e.g. TechCorp" /></div>
                    </div>
                    <div><label style={labelStyle}>Testimonial Content *</label><textarea value={form.content} onChange={e => setForm({ ...form, content: e.target.value })} style={{ ...fieldStyle, minHeight: '120px', resize: 'vertical' }} placeholder="What did they say about your work?" /></div>
                    <div>
                        <label style={labelStyle}>Rating</label>
                        <div style={{ display: 'flex', gap: '8px' }}>
                            {[1, 2, 3, 4, 5].map(r => (
                                <motion.button key={r} onClick={() => setForm({ ...form, rating: r })} whileHover={{ scale: 1.2 }}
                                    style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '4px' }}>
                                    <Star size={24} fill={r <= form.rating ? 'hsl(38 92% 50%)' : 'transparent'} style={{ color: r <= form.rating ? 'hsl(38 92% 50%)' : 'hsl(222 30% 30%)' }} />
                                </motion.button>
                            ))}
                        </div>
                    </div>
                    <ImageUploader value={form.image} onChange={url => setForm({ ...form, image: url })} folder="portfolio/testimonials" label="Client Photo" />
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
