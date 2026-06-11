import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Award, Plus, Edit2, Trash2, Loader2 } from 'lucide-react';
import axiosInstance from '../../config/axiosInstance';
import Modal, { fieldStyle, labelStyle, buttonPrimaryStyle, dangerButtonStyle } from '../ui/Modal';
import { showToast } from '../ui/Toast';

const CATEGORIES = ['Frontend', 'Backend', 'Mobile', 'Database', 'DevOps & Tools', 'Tools'];
const LEVELS = ['Beginner', 'Intermediate', 'Advanced', 'Expert'];

const PREDEFINED_SKILLS = [
    // Frontend
    { name: 'React', category: 'Frontend', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg' },
    { name: 'Next.js', category: 'Frontend', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nextjs/nextjs-original.svg' },
    { name: 'TypeScript', category: 'Frontend', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/typescript/typescript-original.svg' },
    { name: 'JavaScript', category: 'Frontend', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg' },
    { name: 'HTML5', category: 'Frontend', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/html5/html5-original.svg' },
    { name: 'CSS3', category: 'Frontend', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/css3/css3-original.svg' },
    { name: 'Tailwind CSS', category: 'Frontend', icon: 'https://cdn.jsdelivr.net/gh/devicons@latest/icons/tailwindcss/tailwindcss-original.svg' },
    { name: 'Vue.js', category: 'Frontend', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/vuejs/vuejs-original.svg' },
    { name: 'Angular', category: 'Frontend', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/angularjs/angularjs-original.svg' },
    { name: 'Svelte', category: 'Frontend', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/svelte/svelte-original.svg' },
    { name: 'Redux', category: 'Frontend', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/redux/redux-original.svg' },
    { name: 'Bootstrap', category: 'Frontend', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/bootstrap/bootstrap-original.svg' },
    
    // Backend
    { name: 'Node.js', category: 'Backend', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg' },
    { name: 'Express.js', category: 'Backend', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/express/express-original.svg' },
    { name: 'Python', category: 'Backend', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg' },
    { name: 'Django', category: 'Backend', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/django/django-plain.svg' },
    { name: 'Flask', category: 'Backend', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/flask/flask-original.svg' },
    { name: 'Go', category: 'Backend', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/go/go-original-wordmark.svg' },
    { name: 'Java', category: 'Backend', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/java/java-original.svg' },
    { name: 'Spring Boot', category: 'Backend', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/spring/spring-original.svg' },
    { name: 'PHP', category: 'Backend', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/php/php-original.svg' },
    { name: 'Laravel', category: 'Backend', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/laravel/laravel-original.svg' },
    { name: 'Ruby', category: 'Backend', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/ruby/ruby-original.svg' },
    { name: 'Rails', category: 'Backend', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/rails/rails-original-wordmark.svg' },
    { name: 'C#', category: 'Backend', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/csharp/csharp-original.svg' },
    { name: '.NET', category: 'Backend', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/dot-net/dot-net-original.svg' },
    
    // Mobile
    { name: 'Flutter', category: 'Mobile', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/flutter/flutter-original.svg' },
    { name: 'Dart', category: 'Mobile', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/dart/dart-original.svg' },
    { name: 'React Native', category: 'Mobile', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg' },
    { name: 'Swift', category: 'Mobile', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/swift/swift-original.svg' },
    { name: 'Kotlin', category: 'Mobile', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/kotlin/kotlin-original.svg' },
    { name: 'Objective-C', category: 'Mobile', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/objectivec/objectivec-plain.svg' },
    
    // Database
    { name: 'MongoDB', category: 'Database', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mongodb/mongodb-original.svg' },
    { name: 'MySQL', category: 'Database', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mysql/mysql-original.svg' },
    { name: 'PostgreSQL', category: 'Database', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/postgresql/postgresql-original.svg' },
    { name: 'Firebase', category: 'Database', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/firebase/firebase-plain.svg' },
    { name: 'SQLite', category: 'Database', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/sqlite/sqlite-original.svg' },
    { name: 'Redis', category: 'Database', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/redis/redis-original.svg' },
    { name: 'Cassandra', category: 'Database', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/cassandra/cassandra-original.svg' },
    { name: 'Oracle', category: 'Database', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/oracle/oracle-original.svg' },
    
    // DevOps & Tools
    { name: 'Git', category: 'DevOps & Tools', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/git/git-original.svg' },
    { name: 'Docker', category: 'DevOps & Tools', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/docker/docker-original.svg' },
    { name: 'Kubernetes', category: 'DevOps & Tools', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/kubernetes/kubernetes-plain.svg' },
    { name: 'AWS', category: 'DevOps & Tools', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/amazonwebservices/amazonwebservices-original-wordmark.svg' },
    { name: 'Google Cloud', category: 'DevOps & Tools', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/googlecloud/googlecloud-original.svg' },
    { name: 'Azure', category: 'DevOps & Tools', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/azure/azure-original.svg' },
    { name: 'DigitalOcean', category: 'DevOps & Tools', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/digitalocean/digitalocean-original.svg' },
    { name: 'Vercel', category: 'DevOps & Tools', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/vercel/vercel-original.svg' },
    { name: 'Netlify', category: 'DevOps & Tools', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/netlify/netlify-original.svg' },
    { name: 'Heroku', category: 'DevOps & Tools', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/heroku/heroku-original.svg' },
    { name: 'GitHub Actions', category: 'DevOps & Tools', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/github/github-original.svg' },
    { name: 'Jenkins', category: 'DevOps & Tools', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/jenkins/jenkins-original.svg' },
    { name: 'Linux', category: 'DevOps & Tools', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/linux/linux-original.svg' }
];

const emptyForm = { name: '', category: 'Frontend', icon: '', experienceLevel: 'Intermediate', yearsExperience: 0, order: 0 };

export default function SkillsTab() {
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [form, setForm] = useState(emptyForm);
    const [saving, setSaving] = useState(false);
    const [filterCat, setFilterCat] = useState('');

    useEffect(() => { fetchItems(); }, []);

    const fetchItems = async () => {
        try { const res = await axiosInstance.get('/skills'); setItems(res.data); }
        catch (err) { console.error(err); }
        finally { setLoading(false); }
    };

    const openAdd = () => { setForm(emptyForm); setEditingId(null); setShowModal(true); };
    const openEdit = (item) => { setForm({ ...emptyForm, ...item }); setEditingId(item._id); setShowModal(true); };

    const handleSave = async () => {
        if (!form.name) return showToast('Skill name is required', 'error');
        setSaving(true);
        try {
            if (editingId) {
                await axiosInstance.put(`/skills/${editingId}`, form);
                showToast('Skill updated!', 'success');
            } else {
                await axiosInstance.post('/skills', form);
                showToast('Skill added!', 'success');
            }
            setShowModal(false);
            fetchItems();
        } catch (err) { showToast(err.response?.data?.message || 'Failed to save', 'error'); }
        setSaving(false);
    };

    const handleDelete = async (id) => {
        if (!confirm('Delete this skill?')) return;
        try {
            await axiosInstance.delete(`/skills/${id}`);
            showToast('Skill deleted', 'success');
            fetchItems();
        } catch (err) { showToast('Failed to delete', 'error'); }
    };

    const filtered = filterCat ? items.filter(s => s.category === filterCat) : items;

    const levelColor = (lvl) => {
        const colors = { Beginner: 'hsl(215 20% 55%)', Intermediate: 'hsl(187 94% 43%)', Advanced: 'hsl(142 76% 45%)', Expert: 'hsl(38 92% 50%)' };
        return colors[lvl] || 'hsl(215 20% 55%)';
    };

    if (loading) return <div style={{ textAlign: 'center', padding: '60px', color: 'hsl(215 20% 50%)' }}><Loader2 size={32} style={{ animation: 'spin 1s linear infinite' }} /> Loading...</div>;

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
                <h2 style={{ fontSize: '1.5rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <Award size={24} style={{ color: 'hsl(187 94% 43%)' }} /> Skills
                    <span style={{ fontSize: '0.875rem', color: 'hsl(215 20% 50%)', fontWeight: 400 }}>({items.length})</span>
                </h2>
                <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                    <select value={filterCat} onChange={e => setFilterCat(e.target.value)} style={{ ...fieldStyle, width: 'auto', minWidth: '120px', cursor: 'pointer', padding: '8px 12px' }}>
                        <option value="">All</option>
                        {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                    <motion.button onClick={openAdd} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} style={buttonPrimaryStyle}>
                        <Plus size={18} /> Add Skill
                    </motion.button>
                </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '12px' }}>
                {filtered.map((skill, i) => (
                    <motion.div key={skill._id} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.03 }}
                        whileHover={{ scale: 1.03, y: -4 }}
                        style={{ padding: '20px', borderRadius: '14px', background: 'hsl(222 47% 8%)', border: '1px solid hsl(222 30% 18%)', textAlign: 'center', position: 'relative' }}>
                        <div style={{ position: 'absolute', top: '8px', right: '8px', display: 'flex', gap: '4px' }}>
                            <button onClick={() => openEdit(skill)} style={{ background: 'none', border: 'none', color: 'hsl(187 94% 43%)', cursor: 'pointer', padding: '4px' }}><Edit2 size={14} /></button>
                            <button onClick={() => handleDelete(skill._id)} style={{ background: 'none', border: 'none', color: 'hsl(0 84% 60%)', cursor: 'pointer', padding: '4px' }}><Trash2 size={14} /></button>
                        </div>
                        {skill.icon && <img src={skill.icon} alt={skill.name} style={{ width: '40px', height: '40px', margin: '0 auto 10px', display: 'block' }} />}
                        <h4 style={{ fontWeight: 600, marginBottom: '4px', fontSize: '0.9rem' }}>{skill.name}</h4>
                        <p style={{ fontSize: '0.7rem', color: 'hsl(187 94% 43%)', marginBottom: '6px' }}>{skill.category}</p>
                        {skill.experienceLevel && (
                            <span style={{ padding: '2px 8px', borderRadius: '4px', fontSize: '0.65rem', fontWeight: 600, background: `${levelColor(skill.experienceLevel)}20`, color: levelColor(skill.experienceLevel) }}>
                                {skill.experienceLevel}
                            </span>
                        )}
                    </motion.div>
                ))}
                {filtered.length === 0 && <p style={{ textAlign: 'center', padding: '40px', color: 'hsl(215 20% 50%)', gridColumn: '1/-1' }}>No skills found.</p>}
            </div>

            <Modal isOpen={showModal} onClose={() => setShowModal(false)} title={editingId ? 'Edit Skill' : 'Add Skill'}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    {!editingId && (
                        <div>
                            <label style={labelStyle}>Quick Select Preset (Auto-fills Category & Icon)</label>
                            <select 
                                value="" 
                                onChange={e => {
                                    const selected = PREDEFINED_SKILLS.find(s => s.name === e.target.value);
                                    if (selected) {
                                        setForm(f => ({
                                            ...f,
                                            name: selected.name,
                                            category: selected.category,
                                            icon: selected.icon
                                        }));
                                    }
                                }} 
                                style={{ ...fieldStyle, cursor: 'pointer' }}
                            >
                                <option value="">-- Choose a predefined skill --</option>
                                {PREDEFINED_SKILLS.map(s => <option key={s.name} value={s.name}>{s.name} ({s.category})</option>)}
                            </select>
                        </div>
                    )}
                    <div><label style={labelStyle}>Name *</label><input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} style={fieldStyle} placeholder="e.g. React" /></div>
                    <div><label style={labelStyle}>Icon URL</label><input value={form.icon} onChange={e => setForm({ ...form, icon: e.target.value })} style={fieldStyle} placeholder="https://cdn.jsdelivr.net/..." /></div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                        <div><label style={labelStyle}>Category</label>
                            <select value={form.category} onChange={e => setForm({ ...form, category: e.target.value })} style={{ ...fieldStyle, cursor: 'pointer' }}>
                                {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                            </select>
                        </div>
                        <div><label style={labelStyle}>Level</label>
                            <select value={form.experienceLevel} onChange={e => setForm({ ...form, experienceLevel: e.target.value })} style={{ ...fieldStyle, cursor: 'pointer' }}>
                                {LEVELS.map(l => <option key={l} value={l}>{l}</option>)}
                            </select>
                        </div>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                        <div><label style={labelStyle}>Years of Experience</label><input type="number" value={form.yearsExperience} onChange={e => setForm({ ...form, yearsExperience: parseInt(e.target.value) || 0 })} style={fieldStyle} /></div>
                        <div><label style={labelStyle}>Display Order</label><input type="number" value={form.order} onChange={e => setForm({ ...form, order: parseInt(e.target.value) || 0 })} style={fieldStyle} /></div>
                    </div>
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
