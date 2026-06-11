import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
    Folder, Plus, Edit2, Trash2, Loader2, Star, Github, 
    ExternalLink, Search, Filter, Calendar, Shield, Terminal, 
    Layers, Image as ImageIcon 
} from 'lucide-react';
import axiosInstance from '../../config/axiosInstance';
import Modal, { fieldStyle, labelStyle, buttonPrimaryStyle } from '../ui/Modal';
import ImageUploader from '../ui/ImageUploader';
import { showToast } from '../ui/Toast';

const CATEGORIES = ['Web App', 'Mobile App', 'Full-Stack', 'Frontend', 'Backend', 'DevOps', 'CLI Tool', 'API', 'Other'];
const STATUSES = ['Completed', 'In Progress', 'Maintenance'];

const PRESETS = {
    ecommerce: {
        title: 'E-Commerce Hub',
        category: 'Full-Stack',
        status: 'Completed',
        client: 'Global Retailers Ltd',
        description: 'A scalable e-commerce microservices platform with real-time inventory management, stripe checkouts, and an analytics admin console.',
        problemStatement: 'Sellers suffer from inventory sync delays, leading to overselling, slow page loading, and high transaction failure rates during flash sales.',
        solution: 'A distributed system combining Redis-based queue locks, server-sent events (SSE) for inventory sync, and a decoupled Next.js storefront.',
        features: ['Real-time inventory synchronization', 'Stripe checkout and webhook handling', 'Analytics admin reporting dashboard', 'Dynamic product search with Elasticsearch'],
        techStack: {
            frontend: ['Next.js', 'React', 'Tailwind CSS', 'Redux Toolkit'],
            backend: ['Node.js', 'Express', 'Socket.io'],
            database: ['MongoDB', 'Redis'],
            cloud: ['AWS ECS', 'Docker', 'GCP Storage'],
            devOps: ['GitHub Actions', 'Terraform', 'Prometheus']
        },
        tags: ['E-Commerce', 'Microservices', 'Stripe', 'Sockets'],
        apiEndpoints: [
            { method: 'GET', endpoint: '/api/products', description: 'List all products with pagination and category filters', auth: false, requestExample: '', responseExample: '{\n  "products": [...],\n  "total": 128\n}' },
            { method: 'POST', endpoint: '/api/checkout/session', description: 'Create a Stripe checkout session for shopping cart', auth: true, requestExample: '{\n  "items": [{ "id": "p1", "qty": 2 }]\n}', responseExample: '{\n  "sessionId": "cs_test_abc123",\n  "url": "https://checkout.stripe.com/..."\n}' }
        ]
    },
    chatbot: {
        title: 'AI Chatbot Assistant',
        category: 'Full-Stack',
        status: 'Completed',
        client: 'TechSupport Corp',
        description: 'An intelligent support chatbot utilizing retrieval-augmented generation (RAG), vector database search, and real-time response streaming.',
        problemStatement: 'Support teams are overloaded with basic repeated queries, resulting in long response times and low customer satisfaction scores.',
        solution: 'A vector-indexing pipeline that ingests company docs and exposes a streaming LLM chat agent to solve customer issues instantly.',
        features: ['Streaming chat responses (Server-Sent Events)', 'Retrieval-Augmented Generation (RAG) pipeline', 'Interactive Chat History and Session Cache', 'Feedback collection & sentiment classification'],
        techStack: {
            frontend: ['React', 'Framer Motion', 'Vite', 'Markdown-Preview'],
            backend: ['Python', 'FastAPI', 'LangChain'],
            database: ['Pinecone', 'Redis', 'PostgreSQL'],
            cloud: ['GCP Run', 'Docker'],
            devOps: ['GitHub Actions', 'Weights & Biases']
        },
        tags: ['AI', 'LLM', 'Vector DB', 'LangChain'],
        apiEndpoints: [
            { method: 'POST', endpoint: '/api/chat/stream', description: 'Stream chat response from LLM assistant (SSE)', auth: false, requestExample: '{\n  "query": "How do I reset my password?",\n  "sessionId": "session_987"\n}', responseExample: 'data: Hello! To reset your password...\ndata: [DONE]' },
            { method: 'GET', endpoint: '/api/chat/sessions', description: 'Retrieve previous chat session history for user', auth: true, requestExample: '', responseExample: '[\n  { "sessionId": "session_987", "title": "Password Reset Help" }\n]' }
        ]
    },
    realestate: {
        title: 'Real Estate Platform',
        category: 'Full-Stack',
        status: 'Completed',
        client: 'Horizon Properties',
        description: 'A property marketplace with interactive geospatial maps, virtual tour embeds, and direct client-agent messaging channels.',
        problemStatement: 'Buyers struggle to visualize property locations relative to amenities and communicate efficiently with multiple agents.',
        solution: 'A map-centric platform using Mapbox overlays, WebRTC chat, and virtual tours combined with an admin property dashboard.',
        features: ['Mapbox interactive geospatial search', 'WebRTC video and text chat with agents', '360 virtual tour embeddings', 'Client appointment scheduler and reminder pipeline'],
        techStack: {
            frontend: ['Next.js', 'Mapbox GL', 'Tailwind CSS'],
            backend: ['Node.js', 'Express', 'Socket.io'],
            database: ['PostgreSQL', 'Prisma', 'Redis'],
            cloud: ['AWS S3', 'AWS RDS'],
            devOps: ['Docker', 'Vercel']
        },
        tags: ['Real Estate', 'Geospatial', 'Mapbox', 'WebRTC'],
        apiEndpoints: [
            { method: 'GET', endpoint: '/api/properties/search', description: 'Filter properties by coordinates, price, and rooms', auth: false, requestExample: '', responseExample: '[\n  { "id": "prop_1", "title": "Luxury Villa", "lat": 40.7128, "lng": -74.0060 }\n]' }
        ]
    },
    fitness: {
        title: 'Health & Fitness Tracker',
        category: 'Mobile App',
        status: 'In Progress',
        client: 'ActiveLife Inc',
        description: 'A cross-platform mobile app using machine learning to log workouts, auto-track steps, and provide custom nutrition forecasts.',
        problemStatement: 'Users download multiple apps for steps, weight logs, and food tracking, which lack consolidated dashboards.',
        solution: 'A unified Flutter application that syncs with Apple Health/Google Fit and runs local on-device ML models for pose detection.',
        features: ['Apple Health and Google Fit syncing', 'On-device camera ML pose detection', 'Calorie intake scan via OCR camera', 'Goal tracking & push notifications'],
        techStack: {
            frontend: ['Flutter', 'Dart', 'BLoC State Manager'],
            backend: ['Node.js', 'Fastify'],
            database: ['Firebase Firestore', 'SQLite'],
            cloud: ['GCP Cloud Functions', 'Firebase Storage'],
            devOps: ['Codemagic', 'Fastlane']
        },
        tags: ['Mobile', 'Flutter', 'Pose Detection', 'Apple Health'],
        apiEndpoints: [
            { method: 'POST', endpoint: '/api/user/sync-health', description: 'Sync mobile step count and workout data with DB', auth: true, requestExample: '{\n  "steps": 12450,\n  "caloriesBurned": 420\n}', responseExample: '{\n  "status": "success",\n  "currentStreak": 5\n}' }
        ]
    },
    devops: {
        title: 'DevOps Automation Hub',
        category: 'DevOps',
        status: 'Completed',
        client: 'Internal Tooling',
        description: 'A centralized dashboard for orchestrating Kubernetes deployments, running webhooks, and tracking infrastructure CPU costs.',
        problemStatement: 'Engineering teams lack visibility into staging resource consumption and run multiple commands to deploy services.',
        solution: 'A dashboard that talks to Kubernetes API to provision test namespaces and visualizes live Prometheus telemetry logs.',
        features: ['One-click environment provisioning', 'Live cluster logs and resource utilization charting', 'AWS/GCP cloud billing aggregation', 'Slack integrations for deployment alerts'],
        techStack: {
            frontend: ['React', 'Recharts', 'Tailwind CSS'],
            backend: ['Go', 'Gin Gonic'],
            database: ['Prometheus Timeseries', 'PostgreSQL'],
            cloud: ['Kubernetes', 'AWS EKS', 'Helm'],
            devOps: ['Docker', 'ArgoCD', 'Terraform']
        },
        tags: ['DevOps', 'Go', 'Kubernetes', 'Prometheus'],
        apiEndpoints: [
            { method: 'POST', endpoint: '/api/cluster/deploy', description: 'Trigger staging namespace deployment via Helm', auth: true, requestExample: '{\n  "serviceName": "auth-service",\n  "tag": "v1.4.2"\n}', responseExample: '{\n  "jobId": "helm-job-773",\n  "status": "triggered"\n}' }
        ]
    }
};

const emptyForm = {
    title: '', slug: '', description: '', category: '', status: 'Completed',
    client: '', timeline: { startDate: '', endDate: '' },
    problemStatement: '', solution: '', features: [],
    image: '', screenshots: [],
    architectureDiagrams: [], databaseDiagrams: [], apiEndpoints: [],
    techStack: { frontend: [], backend: [], database: [], cloud: [], devOps: [] },
    tags: [], githubLink: '', liveLink: '',
    isPrivateCode: false, isFeatured: false, order: 0
};

export default function ProjectsTab() {
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [form, setForm] = useState(emptyForm);
    const [saving, setSaving] = useState(false);
    const [search, setSearch] = useState('');
    const [filterCat, setFilterCat] = useState('');
    const [tagInput, setTagInput] = useState('');
    const [featureInput, setFeatureInput] = useState('');
    const [techInputs, setTechInputs] = useState({ frontend: '', backend: '', database: '', cloud: '', devOps: '' });
    
    // Custom sub-editor states
    const [newArch, setNewArch] = useState({ title: '', description: '', imageUrl: '' });
    const [newDbDiag, setNewDbDiag] = useState({ title: '', description: '', imageUrl: '' });
    const [newApi, setNewApi] = useState({ endpoint: '', method: 'GET', description: '', auth: false, requestExample: '', responseExample: '' });

    useEffect(() => { fetchItems(); }, []);

    const fetchItems = async () => {
        try { const res = await axiosInstance.get('/projects'); setItems(res.data); }
        catch (err) { console.error(err); }
        finally { setLoading(false); }
    };

    const generateSlug = (title) => title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 80);

    const openAdd = () => { 
        setForm(emptyForm); 
        setEditingId(null); 
        setTagInput(''); 
        setFeatureInput(''); 
        setTechInputs({ frontend: '', backend: '', database: '', cloud: '', devOps: '' }); 
        setNewArch({ title: '', description: '', imageUrl: '' });
        setNewDbDiag({ title: '', description: '', imageUrl: '' });
        setNewApi({ endpoint: '', method: 'GET', description: '', auth: false, requestExample: '', responseExample: '' });
        setShowModal(true); 
    };

    const openEdit = (item) => {
        setForm({
            ...emptyForm,
            ...item,
            timeline: { ...emptyForm.timeline, ...(item.timeline || {}) },
            techStack: { ...emptyForm.techStack, ...(item.techStack || {}) },
            features: item.features || [],
            screenshots: item.screenshots || [],
            architectureDiagrams: item.architectureDiagrams || [],
            databaseDiagrams: item.databaseDiagrams || [],
            apiEndpoints: item.apiEndpoints || [],
            tags: item.tags || []
        });
        setEditingId(item._id);
        setTagInput(''); setFeatureInput('');
        setTechInputs({ frontend: '', backend: '', database: '', cloud: '', devOps: '' });
        setNewArch({ title: '', description: '', imageUrl: '' });
        setNewDbDiag({ title: '', description: '', imageUrl: '' });
        setNewApi({ endpoint: '', method: 'GET', description: '', auth: false, requestExample: '', responseExample: '' });
        setShowModal(true);
    };

    const handleSave = async () => {
        if (!form.title) return showToast('Project title is required', 'error');
        setSaving(true);
        const data = { ...form };
        if (!data.slug) data.slug = generateSlug(data.title);
        try {
            if (editingId) {
                await axiosInstance.put(`/projects/${editingId}`, data);
                showToast('Project updated!', 'success');
            } else {
                await axiosInstance.post('/projects', data);
                showToast('Project created!', 'success');
            }
            setShowModal(false);
            fetchItems();
        } catch (err) { showToast(err.response?.data?.message || 'Failed to save', 'error'); }
        setSaving(false);
    };

    const handleDelete = async (id) => {
        if (!confirm('Delete this project?')) return;
        try {
            await axiosInstance.delete(`/projects/${id}`);
            showToast('Project deleted', 'success');
            fetchItems();
        } catch (err) { showToast('Failed to delete', 'error'); }
    };

    const toggleFeatured = async (item) => {
        try {
            await axiosInstance.put(`/projects/${item._id}`, { isFeatured: !item.isFeatured });
            showToast(item.isFeatured ? 'Unfeatured' : 'Featured!', 'success');
            fetchItems();
        } catch (err) { showToast('Failed', 'error'); }
    };

    const handlePresetSelect = (presetKey) => {
        if (!presetKey) return;
        const preset = PRESETS[presetKey];
        if (preset) {
            setForm(f => ({
                ...f,
                title: preset.title,
                slug: generateSlug(preset.title),
                category: preset.category,
                status: preset.status,
                client: preset.client,
                description: preset.description,
                problemStatement: preset.problemStatement,
                solution: preset.solution,
                features: preset.features,
                techStack: preset.techStack,
                tags: preset.tags,
                apiEndpoints: preset.apiEndpoints
            }));
            showToast(`Loaded ${preset.title} preset!`, 'success');
        }
    };

    // List helpers
    const addToList = (key, input, setInput) => {
        if (input.trim()) {
            setForm(f => ({ ...f, [key]: [...(f[key] || []), input.trim()] }));
            setInput('');
        }
    };
    const removeFromList = (key, idx) => {
        setForm(f => ({ ...f, [key]: f[key].filter((_, i) => i !== idx) }));
    };

    const addTechStack = (category) => {
        const val = techInputs[category];
        if (val.trim()) {
            setForm(f => ({ ...f, techStack: { ...f.techStack, [category]: [...(f.techStack[category] || []), val.trim()] } }));
            setTechInputs(t => ({ ...t, [category]: '' }));
        }
    };
    const removeTechStack = (category, idx) => {
        setForm(f => ({ ...f, techStack: { ...f.techStack, [category]: f.techStack[category].filter((_, i) => i !== idx) } }));
    };

    const filtered = items.filter(p => {
        const matchSearch = !search || p.title?.toLowerCase().includes(search.toLowerCase()) || p.description?.toLowerCase().includes(search.toLowerCase());
        const matchCat = !filterCat || p.category === filterCat;
        return matchSearch && matchCat;
    });

    if (loading) return <div style={{ textAlign: 'center', padding: '60px', color: 'hsl(215 20% 50%)' }}><Loader2 size={32} style={{ animation: 'spin 1s linear infinite' }} /> Loading...</div>;

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
                <h2 style={{ fontSize: '1.5rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <Folder size={24} style={{ color: 'hsl(187 94% 43%)' }} /> Projects
                    <span style={{ fontSize: '0.875rem', color: 'hsl(215 20% 50%)', fontWeight: 400 }}>({filtered.length})</span>
                </h2>
                <motion.button onClick={openAdd} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} style={buttonPrimaryStyle}>
                    <Plus size={18} /> Add Project
                </motion.button>
            </div>

            {/* Filters */}
            <div style={{ display: 'flex', gap: '12px', marginBottom: '20px', flexWrap: 'wrap' }}>
                <div style={{ position: 'relative', flex: 1, minWidth: '200px' }}>
                    <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'hsl(215 20% 40%)' }} />
                    <input value={search} onChange={e => setSearch(e.target.value)} style={{ ...fieldStyle, paddingLeft: '36px' }} placeholder="Search projects..." />
                </div>
                <select value={filterCat} onChange={e => setFilterCat(e.target.value)} style={{ ...fieldStyle, width: 'auto', minWidth: '140px', cursor: 'pointer' }}>
                    <option value="">All Categories</option>
                    {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
            </div>

            {/* Project Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '16px' }}>
                {filtered.map((p, i) => (
                    <motion.div key={p._id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}
                        whileHover={{ y: -4 }}
                        style={{ background: 'hsl(222 47% 8%)', border: '1px solid hsl(222 30% 18%)', borderRadius: '16px', overflow: 'hidden' }}>
                        {p.image && <img src={p.image} alt="" style={{ width: '100%', height: '160px', objectFit: 'cover' }} />}
                        <div style={{ padding: '20px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    <h3 style={{ fontWeight: 700, fontSize: '1.05rem' }}>{p.title}</h3>
                                    {p.isFeatured && <Star size={14} fill="hsl(45 98% 52%)" style={{ color: 'hsl(45 98% 52%)' }} />}
                                </div>
                                <div style={{ display: 'flex', gap: '4px' }}>
                                    <motion.button onClick={() => toggleFeatured(p)} whileHover={{ scale: 1.1 }} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '4px', color: p.isFeatured ? 'hsl(45 98% 52%)' : 'hsl(215 20% 40%)' }}>
                                        <Star size={14} fill={p.isFeatured ? 'hsl(45 98% 52%)' : 'none'} />
                                    </motion.button>
                                    <motion.button onClick={() => openEdit(p)} whileHover={{ scale: 1.1 }} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '4px', color: 'hsl(187 94% 43%)' }}><Edit2 size={14} /></motion.button>
                                    <motion.button onClick={() => handleDelete(p._id)} whileHover={{ scale: 1.1 }} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '4px', color: 'hsl(0 84% 60%)' }}><Trash2 size={14} /></motion.button>
                                </div>
                            </div>
                            <div style={{ display: 'flex', gap: '6px', marginBottom: '8px' }}>
                                {p.category && <span style={{ padding: '2px 8px', background: 'hsl(187 94% 43% / 0.1)', color: 'hsl(187 94% 50%)', borderRadius: '4px', fontSize: '0.7rem', fontWeight: 600 }}>{p.category}</span>}
                                {p.status && <span style={{ padding: '2px 8px', background: p.status === 'Completed' ? 'hsl(142 76% 36% / 0.15)' : 'hsl(38 92% 50% / 0.15)', color: p.status === 'Completed' ? 'hsl(142 76% 50%)' : 'hsl(38 92% 60%)', borderRadius: '4px', fontSize: '0.7rem', fontWeight: 600 }}>{p.status}</span>}
                            </div>
                            <p style={{ color: 'hsl(215 20% 55%)', fontSize: '0.8rem', lineHeight: 1.5, marginBottom: '12px' }}>{p.description?.slice(0, 100)}{p.description?.length > 100 ? '...' : ''}</p>
                            <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                                {p.tags?.slice(0, 4).map(t => <span key={t} style={{ padding: '2px 8px', background: 'hsl(222 30% 15%)', borderRadius: '4px', fontSize: '0.7rem', color: 'hsl(215 20% 60%)' }}>{t}</span>)}
                            </div>
                        </div>
                    </motion.div>
                ))}
                {filtered.length === 0 && <p style={{ textAlign: 'center', padding: '40px', color: 'hsl(215 20% 50%)', gridColumn: '1/-1' }}>No projects found.</p>}
            </div>

            {/* Project Modal */}
            <Modal isOpen={showModal} onClose={() => setShowModal(false)} title={editingId ? 'Edit Project' : 'Add Project'} maxWidth="780px">
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    
                    {/* Preset Load Select (Only when adding a new project) */}
                    {!editingId && (
                        <div style={{ padding: '12px', background: 'hsl(222 30% 12%)', borderRadius: '10px', border: '1px solid hsl(222 30% 18%)' }}>
                            <label style={{ ...labelStyle, color: 'hsl(187 94% 43%)' }}>Load Template Preset</label>
                            <select onChange={e => handlePresetSelect(e.target.value)} style={{ ...fieldStyle, cursor: 'pointer', background: 'hsl(222 47% 16%)' }}>
                                <option value="">-- Choose a standard project template --</option>
                                <option value="ecommerce">E-Commerce Hub (Node/React/Stripe)</option>
                                <option value="chatbot">AI Chatbot Assistant (Python/RAG/Streaming)</option>
                                <option value="realestate">Real Estate Platform (Next.js/Maps/WebRTC)</option>
                                <option value="fitness">Health & Fitness Tracker (Flutter/Pose Detection)</option>
                                <option value="devops">DevOps Automation Hub (Go/Gin/Kubernetes)</option>
                            </select>
                            <p style={{ color: 'hsl(215 20% 50%)', fontSize: '0.72rem', margin: '6px 0 0' }}>💡 Choosing a preset automatically pre-fills title, features, problem/solution, tech stack, and API endpoints!</p>
                        </div>
                    )}

                    {/* Basic Info */}
                    <div><label style={labelStyle}>Title *</label><input value={form.title} onChange={e => setForm({ ...form, title: e.target.value, slug: generateSlug(e.target.value) })} style={fieldStyle} placeholder="Project name" /></div>
                    <div><label style={labelStyle}>Slug</label><input value={form.slug} onChange={e => setForm({ ...form, slug: e.target.value })} style={{ ...fieldStyle, color: 'hsl(215 20% 50%)' }} /></div>
                    
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px' }}>
                        <div><label style={labelStyle}>Category</label>
                            <select value={form.category} onChange={e => setForm({ ...form, category: e.target.value })} style={{ ...fieldStyle, cursor: 'pointer' }}>
                                <option value="">Select...</option>
                                {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                            </select>
                        </div>
                        <div><label style={labelStyle}>Status</label>
                            <select value={form.status} onChange={e => setForm({ ...form, status: e.target.value })} style={{ ...fieldStyle, cursor: 'pointer' }}>
                                {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
                            </select>
                        </div>
                        <div><label style={labelStyle}>Client</label><input value={form.client} onChange={e => setForm({ ...form, client: e.target.value })} style={fieldStyle} placeholder="Client name" /></div>
                    </div>

                    {/* Timeline */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                        <div>
                            <label style={labelStyle}>Start Date</label>
                            <input type="month" value={form.timeline?.startDate || ''} 
                                onChange={e => setForm({ ...form, timeline: { ...(form.timeline || {}), startDate: e.target.value } })} 
                                style={fieldStyle} />
                        </div>
                        <div>
                            <label style={labelStyle}>End Date</label>
                            <input type="month" value={form.timeline?.endDate || ''} 
                                onChange={e => setForm({ ...form, timeline: { ...(form.timeline || {}), endDate: e.target.value } })} 
                                style={fieldStyle} placeholder="Leave blank if Present" />
                        </div>
                    </div>

                    <div><label style={labelStyle}>Description</label><textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} style={{ ...fieldStyle, minHeight: '80px', resize: 'vertical' }} /></div>
                    
                    {/* Cover Image */}
                    <ImageUploader value={form.image} onChange={url => setForm({ ...form, image: url })} folder="portfolio/projects" label="Cover Image" />

                    {/* Links */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                        <div><label style={labelStyle}>GitHub Link</label><input value={form.githubLink} onChange={e => setForm({ ...form, githubLink: e.target.value })} style={fieldStyle} placeholder="https://github.com/..." /></div>
                        <div><label style={labelStyle}>Live Link</label><input value={form.liveLink} onChange={e => setForm({ ...form, liveLink: e.target.value })} style={fieldStyle} placeholder="https://..." /></div>
                    </div>

                    {/* Case Study Section */}
                    <details style={{ background: 'hsl(222 30% 10%)', borderRadius: '10px', padding: '16px', border: '1px solid hsl(222 30% 18%)' }}>
                        <summary style={{ cursor: 'pointer', color: 'hsl(187 94% 43%)', fontWeight: 600, fontSize: '0.85rem' }}>Case Study Details (Problem, Solution, Features)</summary>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '12px' }}>
                            <div><label style={labelStyle}>Problem Statement</label><textarea value={form.problemStatement} onChange={e => setForm({ ...form, problemStatement: e.target.value })} style={{ ...fieldStyle, minHeight: '80px', resize: 'vertical' }} /></div>
                            <div><label style={labelStyle}>Solution</label><textarea value={form.solution} onChange={e => setForm({ ...form, solution: e.target.value })} style={{ ...fieldStyle, minHeight: '80px', resize: 'vertical' }} /></div>
                            <div>
                                <label style={labelStyle}>Features</label>
                                <div style={{ display: 'flex', gap: '8px' }}>
                                    <input value={featureInput} onChange={e => setFeatureInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addToList('features', featureInput, setFeatureInput))} style={{ ...fieldStyle, flex: 1 }} placeholder="Feature description" />
                                    <button onClick={() => addToList('features', featureInput, setFeatureInput)} type="button" style={{ ...buttonPrimaryStyle, padding: '10px 14px' }}>+</button>
                                </div>
                                {form.features?.map((f, j) => (
                                    <div key={j} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '6px 10px', background: 'hsl(222 30% 12%)', borderRadius: '6px', marginTop: '4px' }}>
                                        <span style={{ fontSize: '0.8rem', color: 'hsl(215 20% 70%)' }}>{f}</span>
                                        <button onClick={() => removeFromList('features', j)} style={{ background: 'none', border: 'none', color: 'hsl(0 84% 60%)', cursor: 'pointer' }}>×</button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </details>

                    {/* Screenshots Gallery Editor */}
                    <details style={{ background: 'hsl(222 30% 10%)', borderRadius: '10px', padding: '16px', border: '1px solid hsl(222 30% 18%)' }}>
                        <summary style={{ cursor: 'pointer', color: 'hsl(187 94% 43%)', fontWeight: 600, fontSize: '0.85rem' }}>Screenshot Gallery ({form.screenshots?.length || 0})</summary>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '12px' }}>
                            <label style={labelStyle}>Upload or Add Screenshot URL</label>
                            <ImageUploader folder="portfolio/project-screenshots" onUpload={url => {
                                if (url) setForm(f => ({ ...f, screenshots: [...(f.screenshots || []), url] }));
                            }} />
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(80px, 1fr))', gap: '8px', marginTop: '8px' }}>
                                {form.screenshots?.map((url, idx) => (
                                    <div key={idx} style={{ position: 'relative', height: '60px', borderRadius: '6px', overflow: 'hidden', border: '1px solid hsl(222 30% 22%)' }}>
                                        <img src={url} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                        <button type="button" onClick={() => setForm(f => ({ ...f, screenshots: f.screenshots.filter((_, i) => i !== idx) }))}
                                            style={{ position: 'absolute', top: '2px', right: '2px', background: 'rgba(0,0,0,0.7)', border: 'none', borderRadius: '50%', width: '16px', height: '16px', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', fontSize: '10px' }}>
                                            ×
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </details>

                    {/* Diagrams Editor */}
                    <details style={{ background: 'hsl(222 30% 10%)', borderRadius: '10px', padding: '16px', border: '1px solid hsl(222 30% 18%)' }}>
                        <summary style={{ cursor: 'pointer', color: 'hsl(187 94% 43%)', fontWeight: 600, fontSize: '0.85rem' }}>Architecture & Database Diagrams</summary>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', marginTop: '12px' }}>
                            
                            {/* Architecture Diagrams */}
                            <div style={{ borderBottom: '1px solid hsl(222 30% 18%)', paddingBottom: '16px' }}>
                                <h4 style={{ ...labelStyle, color: 'white' }}>Architecture Diagrams ({form.architectureDiagrams?.length || 0})</h4>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginBottom: '8px' }}>
                                    <input value={newArch.title} onChange={e => setNewArch({ ...newArch, title: e.target.value })} style={fieldStyle} placeholder="Diagram title (e.g. System Flow)" />
                                    <input value={newArch.description} onChange={e => setNewArch({ ...newArch, description: e.target.value })} style={fieldStyle} placeholder="Description" />
                                </div>
                                <ImageUploader folder="portfolio/architecture" currentImage={newArch.imageUrl} onUpload={url => setNewArch(prev => ({ ...prev, imageUrl: url }))} />
                                <button type="button" onClick={() => {
                                    if (!newArch.title || !newArch.imageUrl) return showToast('Title and Image are required', 'error');
                                    setForm(f => ({ ...f, architectureDiagrams: [...(f.architectureDiagrams || []), newArch] }));
                                    setNewArch({ title: '', description: '', imageUrl: '' });
                                }} style={{ ...buttonPrimaryStyle, padding: '8px 16px', fontSize: '0.8rem', marginTop: '8px' }}>Add Architecture Diagram</button>
                                
                                {form.architectureDiagrams?.length > 0 && (
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginTop: '10px' }}>
                                        {form.architectureDiagrams?.map((d, idx) => (
                                            <div key={idx} style={{ display: 'flex', gap: '10px', alignItems: 'center', background: 'hsl(222 30% 12%)', padding: '8px', borderRadius: '8px' }}>
                                                <img src={d.imageUrl} style={{ width: '40px', height: '40px', objectFit: 'cover', borderRadius: '4px' }} />
                                                <div style={{ flex: 1 }}>
                                                    <p style={{ margin: 0, fontSize: '0.825rem', fontWeight: 600 }}>{d.title}</p>
                                                    <p style={{ margin: 0, fontSize: '0.725rem', color: 'hsl(215 20% 55%)' }}>{d.description}</p>
                                                </div>
                                                <button type="button" onClick={() => setForm(f => ({ ...f, architectureDiagrams: (f.architectureDiagrams || []).filter((_, i) => i !== idx) }))} style={{ background: 'none', border: 'none', color: 'hsl(0 84% 60%)', cursor: 'pointer', fontSize: '1.1rem' }}>×</button>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* Database Diagrams */}
                            <div>
                                <h4 style={{ ...labelStyle, color: 'white' }}>Database Diagrams ({form.databaseDiagrams?.length || 0})</h4>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginBottom: '8px' }}>
                                    <input value={newDbDiag.title} onChange={e => setNewDbDiag({ ...newDbDiag, title: e.target.value })} style={fieldStyle} placeholder="Diagram title (e.g. ER Schema)" />
                                    <input value={newDbDiag.description} onChange={e => setNewDbDiag({ ...newDbDiag, description: e.target.value })} style={fieldStyle} placeholder="Description" />
                                </div>
                                <ImageUploader folder="portfolio/database-schema" currentImage={newDbDiag.imageUrl} onUpload={url => setNewDbDiag(prev => ({ ...prev, imageUrl: url }))} />
                                <button type="button" onClick={() => {
                                    if (!newDbDiag.title || !newDbDiag.imageUrl) return showToast('Title and Image are required', 'error');
                                    setForm(f => ({ ...f, databaseDiagrams: [...(f.databaseDiagrams || []), newDbDiag] }));
                                    setNewDbDiag({ title: '', description: '', imageUrl: '' });
                                }} style={{ ...buttonPrimaryStyle, padding: '8px 16px', fontSize: '0.8rem', marginTop: '8px' }}>Add Database Diagram</button>
                                
                                {form.databaseDiagrams?.length > 0 && (
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginTop: '10px' }}>
                                        {form.databaseDiagrams?.map((d, idx) => (
                                            <div key={idx} style={{ display: 'flex', gap: '10px', alignItems: 'center', background: 'hsl(222 30% 12%)', padding: '8px', borderRadius: '8px' }}>
                                                <img src={d.imageUrl} style={{ width: '40px', height: '40px', objectFit: 'cover', borderRadius: '4px' }} />
                                                <div style={{ flex: 1 }}>
                                                    <p style={{ margin: 0, fontSize: '0.825rem', fontWeight: 600 }}>{d.title}</p>
                                                    <p style={{ margin: 0, fontSize: '0.725rem', color: 'hsl(215 20% 55%)' }}>{d.description}</p>
                                                </div>
                                                <button type="button" onClick={() => setForm(f => ({ ...f, databaseDiagrams: (f.databaseDiagrams || []).filter((_, i) => i !== idx) }))} style={{ background: 'none', border: 'none', color: 'hsl(0 84% 60%)', cursor: 'pointer', fontSize: '1.1rem' }}>×</button>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>

                        </div>
                    </details>

                    {/* API Documentation Editor */}
                    <details style={{ background: 'hsl(222 30% 10%)', borderRadius: '10px', padding: '16px', border: '1px solid hsl(222 30% 18%)' }}>
                        <summary style={{ cursor: 'pointer', color: 'hsl(187 94% 43%)', fontWeight: 600, fontSize: '0.85rem' }}>API Documentation ({form.apiEndpoints?.length || 0})</summary>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '12px' }}>
                            <div style={{ display: 'grid', gridTemplateColumns: '120px 1fr', gap: '8px', marginBottom: '4px' }}>
                                <select value={newApi.method} onChange={e => setNewApi({ ...newApi, method: e.target.value })} style={fieldStyle}>
                                    {['GET', 'POST', 'PUT', 'DELETE', 'PATCH'].map(m => <option key={m} value={m}>{m}</option>)}
                                </select>
                                <input value={newApi.endpoint} onChange={e => setNewApi({ ...newApi, endpoint: e.target.value })} style={fieldStyle} placeholder="Path e.g. /api/chat" />
                            </div>
                            <textarea value={newApi.description} onChange={e => setNewApi({ ...newApi, description: e.target.value })} style={{ ...fieldStyle, minHeight: '60px' }} placeholder="Endpoint description..." />
                            
                            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', color: 'hsl(215 20% 65%)', fontSize: '0.85rem' }}>
                                <input type="checkbox" checked={newApi.auth} onChange={e => setNewApi({ ...newApi, auth: e.target.checked })} /> Auth Required
                            </label>

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                                <div>
                                    <label style={labelStyle}>Request Example</label>
                                    <textarea value={newApi.requestExample} onChange={e => setNewApi({ ...newApi, requestExample: e.target.value })} style={{ ...fieldStyle, minHeight: '60px', fontFamily: 'monospace', fontSize: '0.75rem' }} placeholder='{ "id": "p_01" }' />
                                </div>
                                <div>
                                    <label style={labelStyle}>Response Example</label>
                                    <textarea value={newApi.responseExample} onChange={e => setNewApi({ ...newApi, responseExample: e.target.value })} style={{ ...fieldStyle, minHeight: '60px', fontFamily: 'monospace', fontSize: '0.75rem' }} placeholder='{ "status": "ok" }' />
                                </div>
                            </div>

                            <button type="button" onClick={() => {
                                if (!newApi.endpoint) return showToast('Path is required', 'error');
                                setForm(f => ({ ...f, apiEndpoints: [...(f.apiEndpoints || []), newApi] }));
                                setNewApi({ endpoint: '', method: 'GET', description: '', auth: false, requestExample: '', responseExample: '' });
                            }} style={{ ...buttonPrimaryStyle, padding: '8px 16px', fontSize: '0.8rem', width: 'fit-content' }}>Add API Endpoint</button>

                            {form.apiEndpoints?.length > 0 && (
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginTop: '10px' }}>
                                    {form.apiEndpoints?.map((api, idx) => (
                                        <div key={idx} style={{ display: 'flex', gap: '10px', alignItems: 'center', background: 'hsl(222 30% 12%)', padding: '8px', borderRadius: '8px' }}>
                                            <span style={{
                                                padding: '2px 6px', background: api.method === 'GET' ? 'hsl(142 76% 36% / 0.15)' : 'hsl(199 89% 48% / 0.15)',
                                                color: api.method === 'GET' ? 'hsl(142 76% 50%)' : 'hsl(199 89% 60%)',
                                                borderRadius: '4px', fontSize: '0.7rem', fontWeight: 700
                                            }}>{api.method}</span>
                                            <code style={{ fontSize: '0.8rem', color: 'white', flex: 1 }}>{api.endpoint}</code>
                                            <button type="button" onClick={() => setForm(f => ({ ...f, apiEndpoints: (f.apiEndpoints || []).filter((_, i) => i !== idx) }))} style={{ background: 'none', border: 'none', color: 'hsl(0 84% 60%)', cursor: 'pointer', fontSize: '1.1rem' }}>×</button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </details>

                    {/* Tech Stack */}
                    <details style={{ background: 'hsl(222 30% 10%)', borderRadius: '10px', padding: '16px', border: '1px solid hsl(222 30% 18%)' }}>
                        <summary style={{ cursor: 'pointer', color: 'hsl(187 94% 43%)', fontWeight: 600, fontSize: '0.85rem' }}>Tech Stack</summary>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '12px' }}>
                            {['frontend', 'backend', 'database', 'cloud', 'devOps'].map(cat => (
                                <div key={cat}>
                                    <label style={labelStyle}>{cat.charAt(0).toUpperCase() + cat.slice(1)}</label>
                                    <div style={{ display: 'flex', gap: '8px' }}>
                                        <input value={techInputs[cat]} onChange={e => setTechInputs(t => ({ ...t, [cat]: e.target.value }))} onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addTechStack(cat))} style={{ ...fieldStyle, flex: 1 }} placeholder={`e.g. React`} />
                                        <button onClick={() => addTechStack(cat)} type="button" style={{ ...buttonPrimaryStyle, padding: '10px 14px' }}>+</button>
                                    </div>
                                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px', marginTop: '4px' }}>
                                        {form.techStack[cat]?.map((t, j) => (
                                            <span key={j} onClick={() => removeTechStack(cat, j)} style={{ padding: '3px 8px', background: 'hsl(187 94% 43% / 0.1)', color: 'hsl(187 94% 50%)', borderRadius: '4px', fontSize: '0.7rem', cursor: 'pointer' }}>{t} ×</span>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </details>

                    {/* Tags */}
                    <div>
                        <label style={labelStyle}>Tags</label>
                        <div style={{ display: 'flex', gap: '8px' }}>
                            <input value={tagInput} onChange={e => setTagInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addToList('tags', tagInput, setTagInput))} style={{ ...fieldStyle, flex: 1 }} />
                            <button onClick={() => addToList('tags', tagInput, setTagInput)} type="button" style={{ ...buttonPrimaryStyle, padding: '10px 14px' }}>+</button>
                        </div>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px', marginTop: '6px' }}>
                            {form.tags?.map((t, j) => (
                                <span key={j} onClick={() => removeFromList('tags', j)} style={{ padding: '3px 8px', background: 'hsl(222 30% 15%)', borderRadius: '4px', fontSize: '0.7rem', color: 'hsl(215 20% 65%)', cursor: 'pointer' }}>{t} ×</span>
                            ))}
                        </div>
                    </div>

                    {/* Flags */}
                    <div style={{ display: 'flex', gap: '24px' }}>
                        <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', color: 'hsl(215 20% 65%)', fontSize: '0.875rem' }}>
                            <input type="checkbox" checked={form.isFeatured} onChange={e => setForm({ ...form, isFeatured: e.target.checked })} /> Featured
                        </label>
                        <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', color: 'hsl(215 20% 65%)', fontSize: '0.875rem' }}>
                            <input type="checkbox" checked={form.isPrivateCode} onChange={e => setForm({ ...form, isPrivateCode: e.target.checked })} /> Private Code
                        </label>
                    </div>

                    {/* Actions */}
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
