import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { MessageSquare, Trash2, Loader2, Mail, CheckCircle, Reply, Clock, Filter } from 'lucide-react';
import axiosInstance from '../../config/axiosInstance';
import { showToast } from '../ui/Toast';
import { dangerButtonStyle } from '../ui/Modal';

export default function MessagesTab() {
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('all'); // 'all', 'new', 'read', 'replied'
    const [expandedId, setExpandedId] = useState(null);

    useEffect(() => { fetchItems(); }, []);

    const fetchItems = async () => {
        try { const res = await axiosInstance.get('/messages'); setItems(res.data); }
        catch (err) { console.error(err); }
        finally { setLoading(false); }
    };

    const updateStatus = async (id, status) => {
        try {
            await axiosInstance.put(`/messages/${id}/status`, { status });
            showToast(`Message marked as ${status}`, 'success');
            fetchItems();
        } catch (err) { showToast('Failed to update', 'error'); }
    };

    const handleDelete = async (id) => {
        if (!confirm('Delete this message?')) return;
        try {
            await axiosInstance.delete(`/messages/${id}`);
            showToast('Message deleted', 'success');
            fetchItems();
        } catch (err) { showToast('Failed to delete', 'error'); }
    };

    const filtered = filter === 'all' ? items : items.filter(m => (m.status || 'new') === filter);
    const newCount = items.filter(m => (m.status || 'new') === 'new').length;

    const statusColor = (status) => {
        const colors = { new: 'hsl(187 94% 43%)', read: 'hsl(215 20% 50%)', replied: 'hsl(142 76% 45%)' };
        return colors[status || 'new'] || 'hsl(215 20% 50%)';
    };

    const statusIcon = (status) => {
        if (status === 'replied') return <Reply size={12} />;
        if (status === 'read') return <CheckCircle size={12} />;
        return <Clock size={12} />;
    };

    if (loading) return <div style={{ textAlign: 'center', padding: '60px', color: 'hsl(215 20% 50%)' }}><Loader2 size={32} style={{ animation: 'spin 1s linear infinite' }} /> Loading...</div>;

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
                <h2 style={{ fontSize: '1.5rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <MessageSquare size={24} style={{ color: 'hsl(187 94% 43%)' }} /> Messages
                    <span style={{ fontSize: '0.875rem', color: 'hsl(215 20% 50%)', fontWeight: 400 }}>({items.length})</span>
                    {newCount > 0 && <span style={{ padding: '2px 8px', background: 'hsl(0 84% 60%)', color: 'white', borderRadius: '10px', fontSize: '0.7rem', fontWeight: 700 }}>{newCount} new</span>}
                </h2>
                <div style={{ display: 'flex', gap: '6px' }}>
                    {['all', 'new', 'read', 'replied'].map(f => (
                        <button key={f} onClick={() => setFilter(f)} style={{
                            padding: '6px 12px', borderRadius: '8px', fontFamily: 'inherit', fontSize: '0.8rem', fontWeight: 600, cursor: 'pointer',
                            background: filter === f ? 'hsl(187 94% 43%)' : 'hsl(222 30% 12%)',
                            color: filter === f ? 'hsl(222 47% 5%)' : 'hsl(215 20% 55%)',
                            border: filter === f ? 'none' : '1px solid hsl(222 30% 22%)',
                            textTransform: 'capitalize'
                        }}>{f}</button>
                    ))}
                </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {filtered.map((msg, i) => {
                    const isExpanded = expandedId === msg._id;
                    const msgStatus = msg.status || 'new';
                    return (
                        <motion.div key={msg._id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }}
                            style={{
                                padding: '16px 20px',
                                background: 'hsl(222 47% 8%)',
                                border: `1px solid ${msgStatus === 'new' ? 'hsl(187 94% 43% / 0.3)' : 'hsl(222 30% 18%)'}`,
                                borderLeft: `4px solid ${statusColor(msgStatus)}`,
                                borderRadius: '12px',
                                cursor: 'pointer'
                            }}
                            onClick={() => {
                                setExpandedId(isExpanded ? null : msg._id);
                                if (msgStatus === 'new') updateStatus(msg._id, 'read');
                            }}
                        >
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                    <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'hsl(187 94% 43% / 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'hsl(187 94% 43%)', fontWeight: 700, flexShrink: 0 }}>
                                        {msg.name?.charAt(0).toUpperCase() || '?'}
                                    </div>
                                    <div>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                            <h4 style={{ fontWeight: msgStatus === 'new' ? 700 : 500, fontSize: '0.95rem' }}>{msg.name}</h4>
                                            <span style={{ display: 'flex', alignItems: 'center', gap: '4px', padding: '1px 6px', borderRadius: '4px', fontSize: '0.6rem', fontWeight: 600, background: `${statusColor(msgStatus)}20`, color: statusColor(msgStatus), textTransform: 'uppercase' }}>
                                                {statusIcon(msgStatus)} {msgStatus}
                                            </span>
                                        </div>
                                        <p style={{ color: 'hsl(215 20% 50%)', fontSize: '0.8rem' }}>{msg.email}</p>
                                    </div>
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    <span style={{ color: 'hsl(215 20% 40%)', fontSize: '0.7rem' }}>
                                        {msg.createdAt?._seconds ? new Date(msg.createdAt._seconds * 1000).toLocaleDateString() : 'N/A'}
                                    </span>
                                </div>
                            </div>

                            {isExpanded && (
                                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} style={{ marginTop: '16px', paddingTop: '16px', borderTop: '1px solid hsl(222 30% 18%)' }}>
                                    <p style={{ color: 'hsl(215 20% 70%)', fontSize: '0.9rem', lineHeight: 1.7, marginBottom: '16px', whiteSpace: 'pre-wrap' }}>{msg.message}</p>
                                    <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                                        <a href={`mailto:${msg.email}`} onClick={e => e.stopPropagation()} style={{ padding: '6px 14px', background: 'hsl(187 94% 43% / 0.1)', color: 'hsl(187 94% 43%)', borderRadius: '8px', fontSize: '0.8rem', fontWeight: 600, textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '6px' }}>
                                            <Mail size={14} /> Reply
                                        </a>
                                        {msgStatus !== 'replied' && (
                                            <button onClick={e => { e.stopPropagation(); updateStatus(msg._id, 'replied'); }} style={{ padding: '6px 14px', background: 'hsl(142 76% 36% / 0.15)', color: 'hsl(142 76% 50%)', border: 'none', borderRadius: '8px', fontSize: '0.8rem', fontWeight: 600, cursor: 'pointer' }}>
                                                <CheckCircle size={14} style={{ marginRight: '4px', verticalAlign: 'middle' }} /> Mark Replied
                                            </button>
                                        )}
                                        <button onClick={e => { e.stopPropagation(); handleDelete(msg._id); }} style={{ ...dangerButtonStyle }}>
                                            <Trash2 size={14} style={{ marginRight: '4px', verticalAlign: 'middle' }} /> Delete
                                        </button>
                                    </div>
                                </motion.div>
                            )}
                        </motion.div>
                    );
                })}
                {filtered.length === 0 && <p style={{ textAlign: 'center', padding: '40px', color: 'hsl(215 20% 50%)' }}>No messages found.</p>}
            </div>
            <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
        </div>
    );
}
