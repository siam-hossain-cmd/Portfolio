import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Code2, Smartphone, Rocket } from 'lucide-react';
import SectionHeader from './SectionHeader';

const fadeInUp = {
    hidden: { opacity: 0, y: 60 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] }
    }
};

const fadeInLeft = {
    hidden: { opacity: 0, x: -60 },
    visible: {
        opacity: 1,
        x: 0,
        transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] }
    }
};

const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1,
            delayChildren: 0.2
        }
    }
};

const staggerItem = {
    hidden: { opacity: 0, y: 30 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] }
    }
};

export default function AboutSection() {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: "-100px" });

    return (
        <section id="about" ref={ref} style={{ padding: '100px 24px' }}>
            <motion.div
                variants={fadeInUp}
                initial="hidden"
                animate={isInView ? "visible" : "hidden"}
                style={{ maxWidth: '1200px', margin: '0 auto' }}
            >
                <SectionHeader number="01" title="About Me" />

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '48px', alignItems: 'center' }}>
                    <motion.div
                        variants={fadeInLeft}
                        initial="hidden"
                        animate={isInView ? "visible" : "hidden"}
                        transition={{ delay: 0.2 }}
                        style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}
                    >
                        <p style={{ color: 'var(--text-secondary)', fontSize: '1.125rem', lineHeight: 1.8 }}>
                            I'm a passionate <span style={{ color: 'var(--text-primary)', fontWeight: 500 }}>Software Engineering student</span> with a deep love for creating digital experiences. My journey in tech started with curiosity and has evolved into a full-blown obsession with building things.
                        </p>
                        <p style={{ color: 'var(--text-secondary)', fontSize: '1.125rem', lineHeight: 1.8 }}>
                            I specialize in <span style={{ color: 'var(--accent)' }}>full-stack web development</span> and <span style={{ color: 'var(--accent)' }}>Flutter mobile app development</span>. I enjoy the challenge of turning complex problems into simple, beautiful solutions.
                        </p>
                    </motion.div>

                    <motion.div
                        variants={staggerContainer}
                        initial="hidden"
                        animate={isInView ? "visible" : "hidden"}
                        style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}
                    >
                        {[
                            { icon: Code2, title: "Full-Stack Development", desc: "Building scalable web applications with modern technologies" },
                            { icon: Smartphone, title: "Flutter Development", desc: "Creating beautiful cross-platform mobile experiences" },
                            { icon: Rocket, title: "Problem Solving", desc: "Transforming complex challenges into elegant solutions" }
                        ].map((item, i) => (
                            <motion.div
                                key={i}
                                variants={staggerItem}
                                whileHover={{ x: 10, transition: { duration: 0.2 } }}
                                className="glass"
                                style={{ padding: '24px', borderRadius: '12px', display: 'flex', gap: '16px', cursor: 'default' }}
                            >
                                <motion.div
                                    whileHover={{ rotate: 360, transition: { duration: 0.5 } }}
                                    style={{ padding: '12px', borderRadius: '8px', background: 'hsl(187 94% 43% / 0.15)', color: 'var(--accent)' }}
                                >
                                    <item.icon size={24} />
                                </motion.div>
                                <div>
                                    <h3 style={{ fontWeight: 600, fontSize: '1.125rem', marginBottom: '4px', color: 'var(--text-primary)' }}>{item.title}</h3>
                                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>{item.desc}</p>
                                </div>
                            </motion.div>
                        ))}
                    </motion.div>
                </div>
            </motion.div>
        </section>
    );
}
