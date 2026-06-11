import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Folder, Award, MessageSquare, Eye, TrendingUp, Activity, Plus, Clock, Mail, ShieldAlert } from 'lucide-react';
import axiosInstance from '../../config/axiosInstance';

export default function OverviewTab({ projects, skills, messages, setTab, adminRole }) {
    const [auditLogs, setAuditLogs] = useState([]);
    const [loadingLogs, setLoadingLogs] = useState(false);

    useEffect(() => {
        if (adminRole === 'Super Admin') {
            const fetchLogs = async () => {
                setLoadingLogs(true);
                try {
                    const res = await axiosInstance.get('/audit-logs');
                    setAuditLogs(res.data);
                } catch (err) {
                    console.error('Failed to fetch audit logs:', err);
                } finally {
                    setLoadingLogs(false);
                }
            };
            fetchLogs();
        }
    }, [adminRole]);

    const stats = [
        { label: 'Total Projects', value: projects.length, icon: Folder, color: 'hsl(187 94% 43%)', trend: `${projects.length} active` },
        { label: 'Skills Listed', value: skills.length, icon: Award, color: 'hsl(142 76% 45%)', trend: 'Growing' },
        { label: 'Messages', value: messages.length, icon: MessageSquare, color: 'hsl(262 83% 58%)', trend: `${messages.filter(m => (m.status || 'new') === 'new').length} unread` },
        { label: 'Profile Views', value: '—', icon: Eye, color: 'hsl(31 97% 55%)', trend: 'See Analytics' }
    ];

    return (
        <div>
            {/* Stats Cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '20px', marginBottom: '40px' }}>
                {stats.map((stat, i) => (
                    <motion.div
                        key={stat.label}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 }}
                        whileHover={{ y: -4, transition: { duration: 0.2 } }}
                        style={{
                            padding: '24px',
                            borderRadius: '16px',
                            background: 'hsl(222 47% 8%)',
                            border: '1px solid hsl(222 30% 18%)',
                            position: 'relative',
                            overflow: 'hidden',
                            cursor: 'pointer'
                        }}
                        onClick={() => {
                            if (stat.label === 'Total Projects') setTab('projects');
                            else if (stat.label === 'Skills Listed') setTab('skills');
                            else if (stat.label === 'Messages') setTab('messages');
                            else if (stat.label === 'Profile Views') setTab('analytics');
                        }}
                    >
                        <div style={{ position: 'absolute', top: '-20px', right: '-20px', width: '80px', height: '80px', borderRadius: '50%', background: stat.color, opacity: 0.1, filter: 'blur(20px)' }} />
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                            <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: `${stat.color}20`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <stat.icon size={24} style={{ color: stat.color }} />
                            </div>
                            <span style={{ fontSize: '0.7rem', color: 'hsl(142 76% 45%)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                <TrendingUp size={12} /> {stat.trend}
                            </span>
                        </div>
                        <h3 style={{ fontSize: '2rem', fontWeight: 700, marginBottom: '4px' }}>{stat.value}</h3>
                        <p style={{ color: 'hsl(215 20% 50%)', fontSize: '0.85rem' }}>{stat.label}</p>
                    </motion.div>
                ))}
            </div>

            {/* Quick Actions & Audit Logs */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                    {/* Quick Actions */}
                    <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
                        style={{ padding: '24px', borderRadius: '16px', background: 'hsl(222 47% 8%)', border: '1px solid hsl(222 30% 18%)' }}>
                        <h3 style={{ fontSize: '1.125rem', fontWeight: 600, marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <Activity size={20} style={{ color: 'hsl(187 94% 43%)' }} /> Quick Actions
                        </h3>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                            {[
                                { label: 'Add New Project', action: () => setTab('projects'), icon: Plus },
                                { label: 'Add New Skill', action: () => setTab('skills'), icon: Award },
                                { label: 'View Messages', action: () => setTab('messages'), icon: MessageSquare },
                                { label: 'View Analytics', action: () => setTab('analytics'), icon: Eye }
                            ].map(action => (
                                <motion.button key={action.label} onClick={action.action}
                                    whileHover={{ x: 4, background: 'hsl(222 30% 15%)' }} whileTap={{ scale: 0.98 }}
                                    style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 16px', background: 'hsl(222 30% 12%)', border: '1px solid hsl(222 30% 18%)', borderRadius: '10px', color: 'white', cursor: 'pointer', fontWeight: 500, textAlign: 'left', fontFamily: 'inherit', fontSize: '0.875rem' }}>
                                    <action.icon size={16} style={{ color: 'hsl(187 94% 43%)' }} /> {action.label}
                                </motion.button>
                            ))}
                        </div>
                    </motion.div>

                    {/* Recent Inbox */}
                    <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
                        style={{ padding: '24px', borderRadius: '16px', background: 'hsl(222 47% 8%)', border: '1px solid hsl(222 30% 18%)' }}>
                        <h3 style={{ fontSize: '1.125rem', fontWeight: 600, marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <Clock size={20} style={{ color: 'hsl(187 94% 43%)' }} /> Recent Messages
                        </h3>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                            {messages.length > 0 ? messages.slice(0, 4).map(msg => (
                                <div key={msg._id} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '10px', background: 'hsl(222 30% 12%)', borderRadius: '10px' }}>
                                    <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'hsl(187 94% 43% / 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'hsl(187 94% 43%)', fontWeight: 700, fontSize: '0.8rem', flexShrink: 0 }}>
                                        {(msg.name || '?').charAt(0).toUpperCase()}
                                    </div>
                                    <div style={{ flex: 1, minWidth: 0 }}>
                                        <p style={{ fontSize: '0.8rem', fontWeight: 500, marginBottom: '1px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{msg.name}</p>
                                        <p style={{ fontSize: '0.7rem', color: 'hsl(215 20% 50%)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{msg.message?.slice(0, 60)}</p>
                                    </div>
                                </div>
                            )) : (
                                <p style={{ color: 'hsl(215 20% 50%)', fontSize: '0.85rem', textAlign: 'center', padding: '16px' }}>No recent messages</p>
                            )}
                        </div>
                    </motion.div>
                </div>

                {/* Audit Logs */}
                <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}
                    style={{ padding: '24px', borderRadius: '16px', background: 'hsl(222 47% 8%)', border: '1px solid hsl(222 30% 18%)', display: 'flex', flexDirection: 'column' }}>
                    <h3 style={{ fontSize: '1.125rem', fontWeight: 600, marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <Activity size={20} style={{ color: 'hsl(187 94% 43%)' }} /> System Audit Logs
                    </h3>
                    {adminRole !== 'Super Admin' ? (
                        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '40px 20px', textAlign: 'center', color: 'hsl(215 20% 50%)', background: 'hsl(222 30% 12%)', borderRadius: '12px' }}>
                            <ShieldAlert size={40} style={{ color: 'hsl(0 84% 60%)', marginBottom: '12px' }} />
                            <h4 style={{ fontWeight: 600, color: 'white', marginBottom: '4px' }}>Restricted Access</h4>
                            <p style={{ fontSize: '0.85rem' }}>Audit logs are only available to Super Administrators.</p>
                        </div>
                    ) : loadingLogs ? (
                        <p style={{ color: 'hsl(215 20% 50%)', textAlign: 'center', padding: '40px' }}>Loading audit logs...</p>
                    ) : (
                        <div style={{ flex: 1, overflowY: 'auto', maxHeight: '420px', display: 'flex', flexDirection: 'column', gap: '10px', paddingRight: '4px' }}>
                            {auditLogs.map(log => (
                                <div key={log.id} style={{
                                    padding: '10px 14px', background: 'hsl(222 30% 12%)', borderRadius: '8px',
                                    borderLeft: `3px solid ${log.action.includes('DELETE') ? 'hsl(0 84% 60%)' : log.action.includes('CREATE') ? 'hsl(142 76% 45%)' : log.action.includes('LOGIN') ? 'hsl(187 94% 43%)' : 'hsl(215 20% 65%)'}`
                                }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '3px' }}>
                                        <span style={{ fontSize: '0.7rem', fontWeight: 700, color: 'white' }}>{log.action}</span>
                                        <span style={{ fontSize: '0.65rem', color: 'hsl(215 20% 50%)' }}>
                                            {log.timestamp?._seconds ? new Date(log.timestamp._seconds * 1000).toLocaleTimeString() : ''}
                                        </span>
                                    </div>
                                    <p style={{ fontSize: '0.8rem', color: 'hsl(215 20% 70%)', lineHeight: 1.3, marginBottom: '3px' }}>{log.details}</p>
                                    <div style={{ fontSize: '0.65rem', color: 'hsl(215 20% 50%)' }}>
                                        By: <strong>{log.username}</strong>
                                    </div>
                                </div>
                            ))}
                            {auditLogs.length === 0 && <p style={{ color: 'hsl(215 20% 50%)', textAlign: 'center', padding: '20px' }}>No audit events found.</p>}
                        </div>
                    )}
                </motion.div>
            </div>
        </div>
    );
}
