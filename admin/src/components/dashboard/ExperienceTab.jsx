import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Briefcase, Plus, Edit2, Trash2, Loader2, Calendar, MapPin } from 'lucide-react';
import axiosInstance from '../../config/axiosInstance';
import Modal, { fieldStyle, labelStyle, buttonPrimaryStyle, dangerButtonStyle } from '../ui/Modal';
import { showToast } from '../ui/Toast';

const emptyForm = {
    company: '', position: '', description: '', startDate: '', endDate: '',
    current: false, technologies: [], logo: '', order: 0
};

export default function ExperienceTab() {
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [form, setForm] = useState(emptyForm);
    const [saving, setSaving] = useState(false);
    const [techInput, setTechInput] = useState('');

    useEffect(() => { fetchItems(); }, []);

    const fetchItems = async () => {
        try {
            const res = await axiosInstance.get('/experience');
            setItems(res.data);
        } catch (err) { console.error(err); }
        finally { setLoading(false); }
    };

    const openAdd = () => { setForm(emptyForm); setEditingId(null); setTechInput(''); setShowModal(true); };
    const openEdit = (item) => { setForm({ ...emptyForm, ...item }); setEditingId(item._id); setTechInput(''); setShowModal(true); };

    const handleSave = async () => {
        if (!form.company || !form.position) return showToast('Company and position are required', 'error');
        setSaving(true);
        try {
            if (editingId) {
                await axiosInstance.put(`/experience/${editingId}`, form);
                showToast('Experience updated!', 'success');
            } else {
                await axiosInstance.post('/experience', form);
                showToast('Experience created!', 'success');
            }
            setShowModal(false);
            fetchItems();
        } catch (err) {
            showToast(err.response?.data?.message || 'Failed to save', 'error');
        }
        setSaving(false);
    };

    const handleDelete = async (id) => {
        if (!confirm('Delete this experience?')) return;
        try {
            await axiosInstance.delete(`/experience/${id}`);
            showToast('Experience deleted', 'success');
            fetchItems();
        } catch (err) { showToast('Failed to delete', 'error'); }
    };

    const addTech = () => {
        if (techInput.trim()) {
            setForm(f => ({ ...f, technologies: [...f.technologies, techInput.trim()] }));
            setTechInput('');
        }
    };

    const removeTech = (idx) => {
        setForm(f => ({ ...f, technologies: f.technologies.filter((_, i) => i !== idx) }));
    };

    if (loading) return <div style={{ textAlign: 'center', padding: '60px', color: 'hsl(215 20% 50%)' }}><Loader2 size={32} style={{ animation: 'spin 1s linear infinite' }} /> Loading...</div>;

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                <h2 style={{ fontSize: '1.5rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <Briefcase size={24} style={{ color: 'hsl(187 94% 43%)' }} /> Experience
                    <span style={{ fontSize: '0.875rem', color: 'hsl(215 20% 50%)', fontWeight: 400 }}>({items.length})</span>
                </h2>
                <motion.button onClick={openAdd} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} style={buttonPrimaryStyle}>
                    <Plus size={18} /> Add Experience
                </motion.button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {items.map((item, i) => (
                    <motion.div key={item._id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
                        style={{ padding: '20px 24px', background: 'hsl(222 47% 8%)', border: '1px solid hsl(222 30% 18%)', borderRadius: '14px', borderLeft: '4px solid hsl(187 94% 43%)' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                            <div>
                                <h3 style={{ fontWeight: 700, fontSize: '1.1rem', marginBottom: '4px' }}>{item.position}</h3>
                                <p style={{ color: 'hsl(187 94% 43%)', fontWeight: 500, fontSize: '0.95rem', marginBottom: '6px' }}>{item.company}</p>
                                <div style={{ display: 'flex', gap: '16px', color: 'hsl(215 20% 50%)', fontSize: '0.8rem' }}>
                                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><Calendar size={14} /> {item.startDate} — {item.current ? 'Present' : item.endDate}</span>
                                </div>
                                {item.description && <p style={{ color: 'hsl(215 20% 60%)', fontSize: '0.875rem', marginTop: '8px', lineHeight: 1.5, maxWidth: '600px' }}>{item.description}</p>}
                                {item.technologies?.length > 0 && (
                                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginTop: '10px' }}>
                                        {item.technologies.map((t, j) => (
                                            <span key={j} style={{ padding: '3px 10px', background: 'hsl(187 94% 43% / 0.1)', color: 'hsl(187 94% 50%)', borderRadius: '6px', fontSize: '0.75rem', fontWeight: 500 }}>{t}</span>
                                        ))}
                                    </div>
                                )}
                            </div>
                            <div style={{ display: 'flex', gap: '8px', flexShrink: 0 }}>
                                <motion.button onClick={() => openEdit(item)} whileHover={{ scale: 1.1 }} style={{ background: 'hsl(222 30% 15%)', border: '1px solid hsl(222 30% 22%)', borderRadius: '8px', padding: '8px', cursor: 'pointer', color: 'hsl(187 94% 43%)' }}><Edit2 size={16} /></motion.button>
                                <motion.button onClick={() => handleDelete(item._id)} whileHover={{ scale: 1.1 }} style={{ ...dangerButtonStyle, padding: '8px' }}><Trash2 size={16} /></motion.button>
                            </div>
                        </div>
                    </motion.div>
                ))}
                {items.length === 0 && <p style={{ textAlign: 'center', padding: '40px', color: 'hsl(215 20% 50%)' }}>No experience entries. Click "Add Experience" to get started.</p>}
            </div>

            <Modal isOpen={showModal} onClose={() => setShowModal(false)} title={editingId ? 'Edit Experience' : 'Add Experience'}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    <div><label style={labelStyle}>Position *</label><input value={form.position} onChange={e => setForm({ ...form, position: e.target.value })} style={fieldStyle} placeholder="e.g. Senior Full-Stack Developer" /></div>
                    <div><label style={labelStyle}>Company *</label><input value={form.company} onChange={e => setForm({ ...form, company: e.target.value })} style={fieldStyle} placeholder="e.g. Google" /></div>
                    <div><label style={labelStyle}>Description</label><textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} style={{ ...fieldStyle, minHeight: '100px', resize: 'vertical' }} placeholder="What did you do there?" /></div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                        <div><label style={labelStyle}>Start Date</label><input type="month" value={form.startDate} onChange={e => setForm({ ...form, startDate: e.target.value })} style={fieldStyle} /></div>
                        <div><label style={labelStyle}>End Date</label><input type="month" value={form.endDate || ''} onChange={e => setForm({ ...form, endDate: e.target.value })} style={fieldStyle} disabled={form.current} /></div>
                    </div>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', color: 'hsl(215 20% 65%)', fontSize: '0.875rem' }}>
                        <input type="checkbox" checked={form.current} onChange={e => setForm({ ...form, current: e.target.checked, endDate: e.target.checked ? null : form.endDate })} /> Currently working here
                    </label>
                    <div>
                        <label style={labelStyle}>Technologies</label>
                        <div style={{ display: 'flex', gap: '8px' }}>
                            <input value={techInput} onChange={e => setTechInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addTech())} style={{ ...fieldStyle, flex: 1 }} placeholder="e.g. React" />
                            <button onClick={addTech} type="button" style={{ ...buttonPrimaryStyle, padding: '12px 16px' }}>Add</button>
                        </div>
                        {form.technologies?.length > 0 && (
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginTop: '8px' }}>
                                {form.technologies.map((t, j) => (
                                    <span key={j} onClick={() => removeTech(j)} style={{ padding: '4px 10px', background: 'hsl(187 94% 43% / 0.15)', color: 'hsl(187 94% 50%)', borderRadius: '6px', fontSize: '0.75rem', cursor: 'pointer' }}>{t} ×</span>
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
