import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Code2, Smartphone, Globe, Server, Database, Palette, Rocket, Shield, Zap, Layers, BarChart3, Cloud, Cpu, Monitor, PenTool, Search } from 'lucide-react';
import useApiData from '../../hooks/useApiData';
import SectionHeader from './SectionHeader';

const iconMap = {
    Code2, Smartphone, Globe, Server, Database, Palette, Rocket, Shield,
    Zap, Layers, BarChart3, Cloud, Cpu, Monitor, PenTool, Search
};

const fallbackServices = [
    { title: 'Web Development', description: 'Full-stack web applications with modern frameworks, responsive design, and optimized performance.', icon: 'Globe', features: ['React/Next.js', 'Node.js/Express', 'Database Design'] },
    { title: 'Mobile Development', description: 'Cross-platform mobile apps with Flutter and native performance, beautiful UI, and seamless UX.', icon: 'Smartphone', features: ['Flutter/Dart', 'iOS & Android', 'Push Notifications'] },
    { title: 'UI/UX Design', description: 'User-centered design with wireframing, prototyping, and implementation of stunning interfaces.', icon: 'Palette', features: ['Figma/Adobe XD', 'Responsive Design', 'Design Systems'] },
    { title: 'Backend & APIs', description: 'Scalable backend systems, RESTful APIs, authentication, and cloud infrastructure setup.', icon: 'Server', features: ['API Design', 'Authentication', 'Cloud Deployment'] }
];

const fadeInUp = {
    hidden: { opacity: 0, y: 60 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } }
};

const staggerContainer = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.15, delayChildren: 0.2 } }
};

const staggerItem = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } }
};

export default function ServicesSection() {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: "-100px" });
    const { data: services } = useApiData('services');

    const displayServices = services.length > 0 ? services : fallbackServices;

    return (
        <section id="services" ref={ref} style={{ padding: '120px 24px', position: 'relative' }}>
            {/* Background accent */}
            <div style={{ position: 'absolute', top: '50%', left: '10%', width: '300px', height: '300px', background: 'hsl(262 83% 58% / 0.08)', borderRadius: '50%', filter: 'blur(100px)' }} />

            <motion.div
                variants={fadeInUp}
                initial="hidden"
                animate={isInView ? "visible" : "hidden"}
                style={{ maxWidth: '1200px', margin: '0 auto' }}
            >
                <SectionHeader number="04" title="Services" />

                <motion.div
                    variants={staggerContainer}
                    initial="hidden"
                    animate={isInView ? "visible" : "hidden"}
                    style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px' }}
                >
                    {displayServices.map((service, i) => {
                        const IconComp = iconMap[service.icon] || Zap;
                        return (
                            <motion.div
                                key={service._id || service.title}
                                variants={staggerItem}
                                whileHover={{ y: -8, transition: { duration: 0.3 } }}
                                style={{
                                    padding: '32px',
                                    borderRadius: '20px',
                                    background: 'var(--bg-secondary)',
                                    border: '1px solid var(--border)',
                                    position: 'relative',
                                    overflow: 'hidden'
                                }}
                            >
                                {/* Glow effect */}
                                <div style={{ position: 'absolute', top: '-30px', right: '-30px', width: '100px', height: '100px', background: 'hsl(187 94% 43% / 0.1)', borderRadius: '50%', filter: 'blur(40px)' }} />

                                <div style={{
                                    width: '56px', height: '56px', borderRadius: '14px',
                                    background: 'hsl(187 94% 43% / 0.1)',
                                    border: '1px solid hsl(187 94% 43% / 0.2)',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    marginBottom: '20px'
                                }}>
                                    <IconComp size={24} style={{ color: 'var(--accent)' }} />
                                </div>

                                <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '12px', color: 'var(--text-primary)' }}>
                                    {service.title}
                                </h3>
                                <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: 1.7, marginBottom: '20px' }}>
                                    {service.description}
                                </p>

                                {service.features?.length > 0 && (
                                    <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                        {service.features.map((f, j) => (
                                            <li key={j} style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
                                                <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--accent)', flexShrink: 0 }} />
                                                {f}
                                            </li>
                                        ))}
                                    </ul>
                                )}
                            </motion.div>
                        );
                    })}
                </motion.div>
            </motion.div>
        </section>
    );
}
