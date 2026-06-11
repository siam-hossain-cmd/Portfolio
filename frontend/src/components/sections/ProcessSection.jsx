import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Search, PenTool, Code, TestTube, Rocket } from 'lucide-react';
import SectionHeader from './SectionHeader';

const processSteps = [
    { icon: Search, title: "Requirement Analysis", description: "Understanding the problem, gathering requirements, and defining project scope." },
    { icon: PenTool, title: "System Design", description: "Creating architecture, designing UI/UX, and planning technical implementation." },
    { icon: Code, title: "Development", description: "Writing clean, maintainable code with best practices and documentation." },
    { icon: TestTube, title: "Testing", description: "Rigorous testing including unit tests, integration tests, and UAT." },
    { icon: Rocket, title: "Deployment", description: "Deploying with CI/CD pipelines, monitoring, and continuous improvement." }
];

export default function ProcessSection() {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: "-100px" });

    return (
        <section id="process" ref={ref} style={{ padding: '100px 24px' }}>
            <motion.div initial={{ opacity: 0, y: 40 }} animate={isInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.6 }} style={{ maxWidth: '1200px', margin: '0 auto' }}>
                <SectionHeader number="04" title="Development Process" />

                <div style={{ position: 'relative' }}>
                    <div style={{ position: 'absolute', left: '32px', top: 0, bottom: 0, width: '1px', background: 'hsl(222 30% 18%)' }} />

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
                        {processSteps.map((step, i) => (
                            <motion.div key={step.title} initial={{ opacity: 0, x: -20 }} animate={isInView ? { opacity: 1, x: 0 } : {}} transition={{ duration: 0.5, delay: i * 0.1 }} style={{ display: 'flex', gap: '24px' }}>
                                <div style={{ width: '64px', height: '64px', borderRadius: '12px', background: 'hsl(222 47% 8%)', border: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, position: 'relative', zIndex: 1 }}>
                                    <step.icon size={28} style={{ color: 'var(--accent)' }} />
                                </div>
                                <div className="glass" style={{ flex: 1, padding: '24px', borderRadius: '12px' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                                        <span className="font-mono" style={{ color: 'var(--accent)', fontSize: '0.875rem' }}>0{i + 1}</span>
                                        <h4 style={{ fontSize: '1.25rem', fontWeight: 600 }}>{step.title}</h4>
                                    </div>
                                    <p style={{ color: 'var(--text-secondary)' }}>{step.description}</p>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </motion.div>
        </section>
    );
}
