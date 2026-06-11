import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Settings, Plus, Edit2, Trash2, Loader2, GripVertical } from 'lucide-react';
import axiosInstance from '../../config/axiosInstance';
import Modal, { fieldStyle, labelStyle, buttonPrimaryStyle, dangerButtonStyle } from '../ui/Modal';
import { showToast } from '../ui/Toast';

const ICON_OPTIONS = ['Code2', 'Smartphone', 'Globe', 'Server', 'Database', 'Palette', 'Rocket', 'Shield', 'Zap', 'Layers', 'BarChart3', 'Cloud', 'Cpu', 'Monitor', 'PenTool', 'Search'];

const emptyForm = { title: '', description: '', icon: 'Code2', features: [], order: 0 };

export default function ServicesTab() {
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [form, setForm] = useState(emptyForm);
    const [saving, setSaving] = useState(false);
    const [featureInput, setFeatureInput] = useState('');

    useEffect(() => { fetchItems(); }, []);

    const fetchItems = async () => {
        try { const res = await axiosInstance.get('/services'); setItems(res.data); }
        catch (err) { console.error(err); }
        finally { setLoading(false); }
    };

    const openAdd = () => { setForm(emptyForm); setEditingId(null); setFeatureInput(''); setShowModal(true); };
    const openEdit = (item) => { setForm({ ...emptyForm, ...item }); setEditingId(item._id); setFeatureInput(''); setShowModal(true); };

    const handleSave = async () => {
        if (!form.title) return showToast('Service title is required', 'error');
        setSaving(true);
        try {
            if (editingId) {
                await axiosInstance.put(`/services/${editingId}`, form);
                showToast('Service updated!', 'success');
            } else {
                await axiosInstance.post('/services', form);
                showToast('Service created!', 'success');
            }
            setShowModal(false);
            fetchItems();
        } catch (err) { showToast(err.response?.data?.message || 'Failed to save', 'error'); }
        setSaving(false);
    };

    const handleDelete = async (id) => {
        if (!confirm('Delete this service?')) return;
        try {
            await axiosInstance.delete(`/services/${id}`);
            showToast('Service deleted', 'success');
            fetchItems();
        } catch (err) { showToast('Failed to delete', 'error'); }
    };

    const addFeature = () => {
        if (featureInput.trim()) {
            setForm(f => ({ ...f, features: [...f.features, featureInput.trim()] }));
            setFeatureInput('');
        }
    };

    const removeFeature = (idx) => {
        setForm(f => ({ ...f, features: f.features.filter((_, i) => i !== idx) }));
    };

    if (loading) return <div style={{ textAlign: 'center', padding: '60px', color: 'hsl(215 20% 50%)' }}><Loader2 size={32} style={{ animation: 'spin 1s linear infinite' }} /> Loading...</div>;

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                <h2 style={{ fontSize: '1.5rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <Settings size={24} style={{ color: 'hsl(187 94% 43%)' }} /> Services
                    <span style={{ fontSize: '0.875rem', color: 'hsl(215 20% 50%)', fontWeight: 400 }}>({items.length})</span>
                </h2>
                <motion.button onClick={openAdd} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} style={buttonPrimaryStyle}>
                    <Plus size={18} /> Add Service
                </motion.button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '16px' }}>
                {items.map((item, i) => (
                    <motion.div key={item._id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
                        style={{ padding: '24px', background: 'hsl(222 47% 8%)', border: '1px solid hsl(222 30% 18%)', borderRadius: '16px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                            <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'hsl(187 94% 43% / 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'hsl(187 94% 43%)', fontWeight: 700, fontSize: '0.75rem' }}>
                                {item.icon || '⚡'}
                            </div>
                            <div style={{ display: 'flex', gap: '6px' }}>
                                <motion.button onClick={() => openEdit(item)} whileHover={{ scale: 1.1 }} style={{ background: 'hsl(222 30% 15%)', border: '1px solid hsl(222 30% 22%)', borderRadius: '8px', padding: '6px', cursor: 'pointer', color: 'hsl(187 94% 43%)' }}><Edit2 size={14} /></motion.button>
                                <motion.button onClick={() => handleDelete(item._id)} whileHover={{ scale: 1.1 }} style={{ ...dangerButtonStyle, padding: '6px' }}><Trash2 size={14} /></motion.button>
                            </div>
                        </div>
                        <h3 style={{ fontWeight: 700, fontSize: '1.05rem', marginBottom: '6px' }}>{item.title}</h3>
                        <p style={{ color: 'hsl(215 20% 55%)', fontSize: '0.85rem', lineHeight: 1.5, marginBottom: '10px' }}>{item.description}</p>
                        {item.features?.length > 0 && (
                            <ul style={{ paddingLeft: '16px', color: 'hsl(215 20% 60%)', fontSize: '0.8rem' }}>
                                {item.features.slice(0, 3).map((f, j) => <li key={j} style={{ marginBottom: '4px' }}>{f}</li>)}
                                {item.features.length > 3 && <li style={{ color: 'hsl(187 94% 43%)' }}>+{item.features.length - 3} more</li>}
                            </ul>
                        )}
                    </motion.div>
                ))}
                {items.length === 0 && <p style={{ textAlign: 'center', padding: '40px', color: 'hsl(215 20% 50%)', gridColumn: '1/-1' }}>No services yet. Click "Add Service" to get started.</p>}
            </div>

            <Modal isOpen={showModal} onClose={() => setShowModal(false)} title={editingId ? 'Edit Service' : 'Add Service'}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    <div><label style={labelStyle}>Title *</label><input value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} style={fieldStyle} placeholder="e.g. Web Development" /></div>
                    <div><label style={labelStyle}>Description</label><textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} style={{ ...fieldStyle, minHeight: '100px', resize: 'vertical' }} placeholder="Describe this service..." /></div>
                    <div>
                        <label style={labelStyle}>Icon Name (Lucide)</label>
                        <select value={form.icon} onChange={e => setForm({ ...form, icon: e.target.value })} style={{ ...fieldStyle, cursor: 'pointer' }}>
                            {ICON_OPTIONS.map(icon => <option key={icon} value={icon}>{icon}</option>)}
                        </select>
                    </div>
                    <div>
                        <label style={labelStyle}>Features</label>
                        <div style={{ display: 'flex', gap: '8px' }}>
                            <input value={featureInput} onChange={e => setFeatureInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addFeature())} style={{ ...fieldStyle, flex: 1 }} placeholder="e.g. Responsive Design" />
                            <button onClick={addFeature} type="button" style={{ ...buttonPrimaryStyle, padding: '12px 16px' }}>Add</button>
                        </div>
                        {form.features?.length > 0 && (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', marginTop: '8px' }}>
                                {form.features.map((f, j) => (
                                    <div key={j} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '6px 10px', background: 'hsl(222 30% 12%)', borderRadius: '6px' }}>
                                        <span style={{ fontSize: '0.85rem', color: 'hsl(215 20% 70%)' }}>{f}</span>
                                        <button onClick={() => removeFeature(j)} style={{ background: 'none', border: 'none', color: 'hsl(0 84% 60%)', cursor: 'pointer', fontSize: '1rem' }}>×</button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                    <div><label style={labelStyle}>Display Order</label><input type="number" value={form.order} onChange={e => setForm({ ...form, order: parseInt(e.target.value) || 0 })} style={fieldStyle} /></div>
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
