import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Settings, Loader2, Save, User, Globe, FileText, Search, Layout, BarChart3 } from 'lucide-react';
import axiosInstance from '../../config/axiosInstance';
import { fieldStyle, labelStyle, buttonPrimaryStyle } from '../ui/Modal';
import ImageUploader from '../ui/ImageUploader';
import { showToast } from '../ui/Toast';

const defaultSettings = {
    personalInfo: { name: '', title: '', bio: '', profileImage: '', roles: [] },
    socialLinks: { github: '', linkedin: '', twitter: '', website: '', whatsapp: '', email: '', facebook: '' },
    resumeUrl: '',
    seo: { siteTitle: '', siteDescription: '', ogImage: '', keywords: '' },
    contactInfo: { email: '', phone: '', location: '', availability: '' },
    heroContent: { greeting: "Hi, I'm", subtitle: '', description: '', ctaText: 'See My Work' },
    stats: { projectsCompleted: 0, technologies: 0, yearsExperience: 0, clientsServed: 0 }
};

export default function SettingsTab() {
    const [settings, setSettings] = useState(defaultSettings);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [activeSection, setActiveSection] = useState('personal');
    const [roleInput, setRoleInput] = useState('');

    useEffect(() => { fetchSettings(); }, []);

    const fetchSettings = async () => {
        try {
            const res = await axiosInstance.get('/settings');
            setSettings(s => ({
                ...defaultSettings,
                ...res.data,
                personalInfo: { ...defaultSettings.personalInfo, ...res.data.personalInfo },
                socialLinks: { ...defaultSettings.socialLinks, ...res.data.socialLinks },
                seo: { ...defaultSettings.seo, ...res.data.seo },
                contactInfo: { ...defaultSettings.contactInfo, ...res.data.contactInfo },
                heroContent: { ...defaultSettings.heroContent, ...res.data.heroContent },
                stats: { ...defaultSettings.stats, ...res.data.stats }
            }));
        } catch (err) { console.error(err); }
        finally { setLoading(false); }
    };

    const handleSave = async () => {
        setSaving(true);
        try {
            await axiosInstance.put('/settings', settings);
            showToast('Settings saved!', 'success');
        } catch (err) { showToast('Failed to save settings', 'error'); }
        setSaving(false);
    };

    const updateNested = (section, key, value) => {
        setSettings(s => ({ ...s, [section]: { ...s[section], [key]: value } }));
    };

    const addRole = () => {
        if (roleInput.trim()) {
            setSettings(s => ({ ...s, personalInfo: { ...s.personalInfo, roles: [...s.personalInfo.roles, roleInput.trim()] } }));
            setRoleInput('');
        }
    };

    const removeRole = (idx) => {
        setSettings(s => ({ ...s, personalInfo: { ...s.personalInfo, roles: s.personalInfo.roles.filter((_, i) => i !== idx) } }));
    };

    const sections = [
        { key: 'personal', label: 'Personal', icon: User },
        { key: 'hero', label: 'Hero Section', icon: Layout },
        { key: 'social', label: 'Social Links', icon: Globe },
        { key: 'contact', label: 'Contact', icon: FileText },
        { key: 'stats', label: 'Statistics', icon: BarChart3 },
        { key: 'seo', label: 'SEO', icon: Search }
    ];

    if (loading) return <div style={{ textAlign: 'center', padding: '60px', color: 'hsl(215 20% 50%)' }}><Loader2 size={32} style={{ animation: 'spin 1s linear infinite' }} /> Loading...</div>;

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                <h2 style={{ fontSize: '1.5rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <Settings size={24} style={{ color: 'hsl(187 94% 43%)' }} /> Portfolio Settings
                </h2>
                <motion.button onClick={handleSave} disabled={saving} whileHover={{ scale: saving ? 1 : 1.02 }} whileTap={{ scale: 0.98 }} style={{ ...buttonPrimaryStyle, opacity: saving ? 0.6 : 1 }}>
                    {saving ? <><Loader2 size={18} style={{ animation: 'spin 1s linear infinite' }} /> Saving...</> : <><Save size={18} /> Save Settings</>}
                </motion.button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '220px 1fr', gap: '24px' }}>
                {/* Section Nav */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    {sections.map(s => (
                        <motion.button key={s.key} onClick={() => setActiveSection(s.key)} whileHover={{ x: 4 }}
                            style={{
                                display: 'flex', alignItems: 'center', gap: '10px', padding: '12px 16px',
                                background: activeSection === s.key ? 'hsl(187 94% 43% / 0.1)' : 'transparent',
                                border: 'none', borderRadius: '10px', color: activeSection === s.key ? 'hsl(187 94% 43%)' : 'hsl(215 20% 55%)',
                                cursor: 'pointer', fontWeight: activeSection === s.key ? 600 : 400, fontFamily: 'inherit', fontSize: '0.9rem', textAlign: 'left',
                                borderLeft: activeSection === s.key ? '3px solid hsl(187 94% 43%)' : '3px solid transparent'
                            }}>
                            <s.icon size={18} /> {s.label}
                        </motion.button>
                    ))}
                </div>

                {/* Section Content */}
                <div style={{ padding: '24px', background: 'hsl(222 47% 8%)', border: '1px solid hsl(222 30% 18%)', borderRadius: '16px' }}>
                    {activeSection === 'personal' && (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                            <h3 style={{ fontWeight: 700, marginBottom: '4px' }}>Personal Information</h3>
                            <ImageUploader value={settings.personalInfo.profileImage} onChange={url => updateNested('personalInfo', 'profileImage', url)} folder="portfolio/profile" label="Profile Photo" />
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                                <div><label style={labelStyle}>Full Name</label><input value={settings.personalInfo.name} onChange={e => updateNested('personalInfo', 'name', e.target.value)} style={fieldStyle} /></div>
                                <div><label style={labelStyle}>Job Title</label><input value={settings.personalInfo.title} onChange={e => updateNested('personalInfo', 'title', e.target.value)} style={fieldStyle} /></div>
                            </div>
                            <div><label style={labelStyle}>Bio</label><textarea value={settings.personalInfo.bio} onChange={e => updateNested('personalInfo', 'bio', e.target.value)} style={{ ...fieldStyle, minHeight: '100px', resize: 'vertical' }} /></div>
                            <div>
                                <label style={labelStyle}>Roles (shown in hero rotation)</label>
                                <div style={{ display: 'flex', gap: '8px' }}>
                                    <input value={roleInput} onChange={e => setRoleInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addRole())} style={{ ...fieldStyle, flex: 1 }} placeholder="e.g. Full-Stack Developer" />
                                    <button onClick={addRole} type="button" style={{ ...buttonPrimaryStyle, padding: '12px 16px' }}>Add</button>
                                </div>
                                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginTop: '8px' }}>
                                    {settings.personalInfo.roles?.map((r, i) => (
                                        <span key={i} onClick={() => removeRole(i)} style={{ padding: '4px 10px', background: 'hsl(187 94% 43% / 0.1)', color: 'hsl(187 94% 50%)', borderRadius: '6px', fontSize: '0.8rem', cursor: 'pointer' }}>{r} ×</span>
                                    ))}
                                </div>
                            </div>
                            <div><label style={labelStyle}>Resume URL</label><input value={settings.resumeUrl} onChange={e => setSettings(s => ({ ...s, resumeUrl: e.target.value }))} style={fieldStyle} placeholder="Link to resume PDF" /></div>
                        </div>
                    )}

                    {activeSection === 'hero' && (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                            <h3 style={{ fontWeight: 700, marginBottom: '4px' }}>Hero Section Content</h3>
                            <div><label style={labelStyle}>Greeting Text</label><input value={settings.heroContent.greeting} onChange={e => updateNested('heroContent', 'greeting', e.target.value)} style={fieldStyle} placeholder="Hi, I'm" /></div>
                            <div><label style={labelStyle}>Subtitle</label><input value={settings.heroContent.subtitle} onChange={e => updateNested('heroContent', 'subtitle', e.target.value)} style={fieldStyle} placeholder="I build things for the web" /></div>
                            <div><label style={labelStyle}>Description</label><textarea value={settings.heroContent.description} onChange={e => updateNested('heroContent', 'description', e.target.value)} style={{ ...fieldStyle, minHeight: '100px', resize: 'vertical' }} /></div>
                            <div><label style={labelStyle}>CTA Button Text</label><input value={settings.heroContent.ctaText} onChange={e => updateNested('heroContent', 'ctaText', e.target.value)} style={fieldStyle} /></div>
                        </div>
                    )}

                    {activeSection === 'social' && (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                            <h3 style={{ fontWeight: 700, marginBottom: '4px' }}>Social Links</h3>
                            {Object.keys(settings.socialLinks).map(key => (
                                <div key={key}><label style={labelStyle}>{key.charAt(0).toUpperCase() + key.slice(1)}</label><input value={settings.socialLinks[key]} onChange={e => updateNested('socialLinks', key, e.target.value)} style={fieldStyle} placeholder={`Your ${key} URL`} /></div>
                            ))}
                        </div>
                    )}

                    {activeSection === 'contact' && (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                            <h3 style={{ fontWeight: 700, marginBottom: '4px' }}>Contact Information</h3>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                                <div><label style={labelStyle}>Email</label><input value={settings.contactInfo.email} onChange={e => updateNested('contactInfo', 'email', e.target.value)} style={fieldStyle} /></div>
                                <div><label style={labelStyle}>Phone</label><input value={settings.contactInfo.phone} onChange={e => updateNested('contactInfo', 'phone', e.target.value)} style={fieldStyle} /></div>
                            </div>
                            <div><label style={labelStyle}>Location</label><input value={settings.contactInfo.location} onChange={e => updateNested('contactInfo', 'location', e.target.value)} style={fieldStyle} /></div>
                            <div><label style={labelStyle}>Availability Status</label><input value={settings.contactInfo.availability} onChange={e => updateNested('contactInfo', 'availability', e.target.value)} style={fieldStyle} placeholder="e.g. Available for freelance" /></div>
                        </div>
                    )}

                    {activeSection === 'stats' && (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                            <h3 style={{ fontWeight: 700, marginBottom: '4px' }}>Portfolio Statistics</h3>
                            <p style={{ color: 'hsl(215 20% 50%)', fontSize: '0.85rem' }}>These numbers are shown in the hero section of your portfolio.</p>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                                {Object.entries(settings.stats).map(([key, val]) => (
                                    <div key={key}>
                                        <label style={labelStyle}>{key.replace(/([A-Z])/g, ' $1').trim()}</label>
                                        <input type="number" value={val} onChange={e => updateNested('stats', key, parseInt(e.target.value) || 0)} style={fieldStyle} />
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {activeSection === 'seo' && (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                            <h3 style={{ fontWeight: 700, marginBottom: '4px' }}>SEO Settings</h3>
                            <div><label style={labelStyle}>Site Title</label><input value={settings.seo.siteTitle} onChange={e => updateNested('seo', 'siteTitle', e.target.value)} style={fieldStyle} /></div>
                            <div><label style={labelStyle}>Site Description</label><textarea value={settings.seo.siteDescription} onChange={e => updateNested('seo', 'siteDescription', e.target.value)} style={{ ...fieldStyle, minHeight: '80px', resize: 'vertical' }} /></div>
                            <div><label style={labelStyle}>Keywords</label><input value={settings.seo.keywords} onChange={e => updateNested('seo', 'keywords', e.target.value)} style={fieldStyle} placeholder="comma, separated, keywords" /></div>
                            <ImageUploader value={settings.seo.ogImage} onChange={url => updateNested('seo', 'ogImage', url)} folder="portfolio/seo" label="Open Graph Image" />
                        </div>
                    )}
                </div>
            </div>
            <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
        </div>
    );
}
