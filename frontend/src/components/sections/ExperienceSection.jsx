import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Briefcase, Calendar, MapPin } from 'lucide-react';
import useApiData from '../../hooks/useApiData';
import SectionHeader from './SectionHeader';

const fallbackExperience = [
    { position: 'Full-Stack Developer', company: 'Freelance', description: 'Building modern web and mobile applications for clients worldwide.', startDate: '2024-01', current: true, technologies: ['React', 'Node.js', 'Flutter', 'Firebase'] }
];

const fadeInUp = {
    hidden: { opacity: 0, y: 60 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } }
};

const staggerContainer = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.2, delayChildren: 0.2 } }
};

const staggerItem = {
    hidden: { opacity: 0, x: -30 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } }
};

export default function ExperienceSection() {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: "-100px" });
    const { data: experience } = useApiData('experience');

    const displayExperience = experience.length > 0 ? experience : fallbackExperience;

    return (
        <section id="experience" ref={ref} style={{ padding: '120px 24px', position: 'relative' }}>
            <div style={{ position: 'absolute', top: '30%', right: '5%', width: '300px', height: '300px', background: 'hsl(142 76% 36% / 0.06)', borderRadius: '50%', filter: 'blur(100px)' }} />

            <motion.div
                variants={fadeInUp}
                initial="hidden"
                animate={isInView ? "visible" : "hidden"}
                style={{ maxWidth: '900px', margin: '0 auto' }}
            >
                <SectionHeader number="05" title="Experience" />

                <motion.div
                    variants={staggerContainer}
                    initial="hidden"
                    animate={isInView ? "visible" : "hidden"}
                    style={{ position: 'relative', paddingLeft: '32px' }}
                >
                    {/* Timeline line */}
                    <div style={{
                        position: 'absolute', left: '15px', top: 0, bottom: 0,
                        width: '2px', background: 'linear-gradient(to bottom, var(--accent), transparent)',
                        borderRadius: '1px'
                    }} />

                    {displayExperience.map((exp, i) => (
                        <motion.div
                            key={exp._id || exp.company}
                            variants={staggerItem}
                            style={{ position: 'relative', marginBottom: i < displayExperience.length - 1 ? '40px' : 0 }}
                        >
                            {/* Timeline dot */}
                            <div style={{
                                position: 'absolute', left: '-25px', top: '6px',
                                width: '12px', height: '12px', borderRadius: '50%',
                                background: exp.current ? 'var(--accent)' : 'var(--bg-secondary)',
                                border: '2px solid var(--accent)',
                                boxShadow: exp.current ? '0 0 20px hsl(187 94% 43% / 0.4)' : 'none'
                            }} />

                            <motion.div
                                whileHover={{ x: 8, transition: { duration: 0.3 } }}
                                style={{
                                    padding: '28px',
                                    borderRadius: '16px',
                                    background: 'var(--bg-secondary)',
                                    border: '1px solid var(--border)',
                                    borderLeft: exp.current ? '3px solid var(--accent)' : '1px solid var(--border)'
                                }}
                            >
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px', flexWrap: 'wrap', gap: '8px' }}>
                                    <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--text-primary)' }}>{exp.position}</h3>
                                    {exp.current && (
                                        <span style={{
                                            padding: '3px 10px', borderRadius: '20px',
                                            background: 'hsl(142 76% 36% / 0.15)', color: 'hsl(142 76% 50%)',
                                            fontSize: '0.7rem', fontWeight: 600
                                        }}>
                                            Current
                                        </span>
                                    )}
                                </div>
                                <p style={{ color: 'var(--accent)', fontWeight: 500, fontSize: '0.95rem', marginBottom: '6px' }}>
                                    {exp.company}
                                </p>
                                <div style={{ display: 'flex', gap: '16px', color: 'var(--text-secondary)', fontSize: '0.8rem', marginBottom: '12px' }}>
                                    <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                        <Calendar size={14} /> {exp.startDate || ''} — {exp.current ? 'Present' : (exp.endDate || '')}
                                    </span>
                                </div>
                                {exp.description && (
                                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: 1.7, marginBottom: '16px' }}>
                                        {exp.description}
                                    </p>
                                )}
                                {exp.technologies?.length > 0 && (
                                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                                        {exp.technologies.map((t, j) => (
                                            <span key={j} style={{
                                                padding: '4px 12px', borderRadius: '20px',
                                                background: 'hsl(187 94% 43% / 0.1)',
                                                color: 'var(--accent)',
                                                fontSize: '0.75rem', fontWeight: 500,
                                                border: '1px solid hsl(187 94% 43% / 0.2)'
                                            }}>
                                                {t}
                                            </span>
                                        ))}
                                    </div>
                                )}
                            </motion.div>
                        </motion.div>
                    ))}
                </motion.div>
            </motion.div>
        </section>
    );
}
