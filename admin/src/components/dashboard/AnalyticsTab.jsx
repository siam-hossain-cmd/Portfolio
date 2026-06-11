import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { BarChart3, TrendingUp, Eye, Folder, Award, MessageSquare, Loader2 } from 'lucide-react';
import axiosInstance from '../../config/axiosInstance';

export default function AnalyticsTab() {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAnalytics = async () => {
            try {
                const res = await axiosInstance.get('/analytics/dashboard');
                setData(res.data);
            } catch (err) {
                console.error('Failed to fetch analytics:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchAnalytics();
    }, []);

    if (loading) return <div style={{ textAlign: 'center', padding: '60px', color: 'hsl(215 20% 50%)' }}><Loader2 size={32} style={{ animation: 'spin 1s linear infinite' }} /> Loading analytics...</div>;
    if (!data) return <div style={{ textAlign: 'center', padding: '60px', color: 'hsl(215 20% 50%)' }}>Failed to load analytics data.</div>;

    const stats = [
        { label: 'Total Views', value: data.totalViews || 0, icon: Eye, color: 'hsl(187 94% 43%)' },
        { label: 'Last 30 Days', value: data.recentViews || 0, icon: TrendingUp, color: 'hsl(142 76% 45%)' },
        { label: 'Projects', value: data.totalProjects || 0, icon: Folder, color: 'hsl(262 83% 58%)' },
        { label: 'Skills', value: data.totalSkills || 0, icon: Award, color: 'hsl(31 97% 55%)' },
        { label: 'Messages', value: data.totalMessages || 0, icon: MessageSquare, color: 'hsl(338 76% 55%)' },
        { label: 'Unread', value: data.newMessages || 0, icon: MessageSquare, color: 'hsl(0 84% 60%)' }
    ];

    // Sort views by day for chart
    const sortedDays = Object.entries(data.viewsByDay || {}).sort(([a], [b]) => a.localeCompare(b));
    const maxViews = Math.max(...sortedDays.map(([, v]) => v), 1);

    // Sort views by page
    const sortedPages = Object.entries(data.viewsByPage || {}).sort(([, a], [, b]) => b - a).slice(0, 10);
    const maxPageViews = Math.max(...sortedPages.map(([, v]) => v), 1);

    return (
        <div>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '24px' }}>
                <BarChart3 size={24} style={{ color: 'hsl(187 94% 43%)' }} /> Analytics Dashboard
            </h2>

            {/* Stats Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '16px', marginBottom: '32px' }}>
                {stats.map((stat, i) => (
                    <motion.div key={stat.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
                        style={{ padding: '20px', background: 'hsl(222 47% 8%)', border: '1px solid hsl(222 30% 18%)', borderRadius: '14px', textAlign: 'center' }}>
                        <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: `${stat.color}20`, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 10px' }}>
                            <stat.icon size={20} style={{ color: stat.color }} />
                        </div>
                        <h3 style={{ fontSize: '1.75rem', fontWeight: 700, marginBottom: '2px' }}>{stat.value}</h3>
                        <p style={{ color: 'hsl(215 20% 50%)', fontSize: '0.8rem' }}>{stat.label}</p>
                    </motion.div>
                ))}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '24px' }}>
                {/* Views by Day Chart */}
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
                    style={{ padding: '24px', background: 'hsl(222 47% 8%)', border: '1px solid hsl(222 30% 18%)', borderRadius: '16px' }}>
                    <h3 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '20px', color: 'hsl(215 20% 70%)' }}>Views (Last 30 Days)</h3>
                    {sortedDays.length > 0 ? (
                        <div style={{ display: 'flex', alignItems: 'flex-end', gap: '2px', height: '160px' }}>
                            {sortedDays.map(([date, count], i) => (
                                <div key={date} title={`${date}: ${count} views`} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-end', height: '100%' }}>
                                    <motion.div
                                        initial={{ height: 0 }}
                                        animate={{ height: `${(count / maxViews) * 100}%` }}
                                        transition={{ delay: i * 0.02, duration: 0.5 }}
                                        style={{
                                            width: '100%',
                                            minHeight: '4px',
                                            borderRadius: '4px 4px 0 0',
                                            background: `linear-gradient(to top, hsl(187 94% 43%), hsl(187 94% 55%))`,
                                            cursor: 'default'
                                        }}
                                    />
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p style={{ textAlign: 'center', padding: '40px', color: 'hsl(215 20% 40%)' }}>No view data yet. Views will appear as visitors browse your portfolio.</p>
                    )}
                </motion.div>

                {/* Views by Page */}
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
                    style={{ padding: '24px', background: 'hsl(222 47% 8%)', border: '1px solid hsl(222 30% 18%)', borderRadius: '16px' }}>
                    <h3 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '20px', color: 'hsl(215 20% 70%)' }}>Top Pages</h3>
                    {sortedPages.length > 0 ? (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                            {sortedPages.map(([page, count], i) => (
                                <div key={page}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                                        <span style={{ fontSize: '0.8rem', color: 'hsl(215 20% 70%)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '70%' }}>{page}</span>
                                        <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'white' }}>{count}</span>
                                    </div>
                                    <div style={{ height: '6px', background: 'hsl(222 30% 15%)', borderRadius: '3px', overflow: 'hidden' }}>
                                        <motion.div
                                            initial={{ width: 0 }}
                                            animate={{ width: `${(count / maxPageViews) * 100}%` }}
                                            transition={{ delay: i * 0.05, duration: 0.5 }}
                                            style={{ height: '100%', background: 'linear-gradient(to right, hsl(187 94% 43%), hsl(262 83% 58%))', borderRadius: '3px' }}
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p style={{ textAlign: 'center', padding: '40px', color: 'hsl(215 20% 40%)' }}>No page data yet.</p>
                    )}
                </motion.div>
            </div>
            <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
        </div>
    );
}
