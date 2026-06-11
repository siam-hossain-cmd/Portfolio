import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Star, Quote } from 'lucide-react';
import useApiData from '../../hooks/useApiData';
import SectionHeader from './SectionHeader';

const fallbackTestimonials = [
    { name: 'Alex Chen', position: 'CEO', company: 'TechStartup', content: 'Outstanding work on our platform. The attention to detail and modern design approach exceeded our expectations.', rating: 5 },
    { name: 'Sarah Johnson', position: 'Product Manager', company: 'DesignCo', content: 'Siam delivered a pixel-perfect implementation with clean, maintainable code. Highly recommend!', rating: 5 },
    { name: 'Michael Park', position: 'CTO', company: 'InnovateLabs', content: 'The mobile app was delivered on time with exceptional quality. Great communication throughout the project.', rating: 5 }
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
    hidden: { opacity: 0, y: 30, scale: 0.95 },
    visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } }
};

export default function TestimonialsSection() {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: "-100px" });
    const { data: testimonials } = useApiData('testimonials');

    const displayTestimonials = testimonials.length > 0 ? testimonials : fallbackTestimonials;

    return (
        <section id="testimonials" ref={ref} style={{ padding: '120px 24px', position: 'relative' }}>
            <div style={{ position: 'absolute', bottom: '20%', right: '10%', width: '350px', height: '350px', background: 'hsl(38 92% 50% / 0.06)', borderRadius: '50%', filter: 'blur(100px)' }} />

            <motion.div
                variants={fadeInUp}
                initial="hidden"
                animate={isInView ? "visible" : "hidden"}
                style={{ maxWidth: '1200px', margin: '0 auto' }}
            >
                <SectionHeader number="06" title="Testimonials" />

                <motion.div
                    variants={staggerContainer}
                    initial="hidden"
                    animate={isInView ? "visible" : "hidden"}
                    style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '24px' }}
                >
                    {displayTestimonials.map((t, i) => (
                        <motion.div
                            key={t._id || t.name}
                            variants={staggerItem}
                            whileHover={{ y: -6, transition: { duration: 0.3 } }}
                            style={{
                                padding: '32px',
                                borderRadius: '20px',
                                background: 'var(--bg-secondary)',
                                border: '1px solid var(--border)',
                                position: 'relative'
                            }}
                        >
                            {/* Quote icon */}
                            <div style={{ position: 'absolute', top: '20px', right: '20px', opacity: 0.1 }}>
                                <Quote size={48} style={{ color: 'var(--accent)' }} />
                            </div>

                            {/* Stars */}
                            <div style={{ display: 'flex', gap: '4px', marginBottom: '20px' }}>
                                {Array.from({ length: 5 }, (_, j) => (
                                    <Star key={j} size={16} fill={j < (t.rating || 5) ? 'hsl(38 92% 50%)' : 'transparent'} style={{ color: j < (t.rating || 5) ? 'hsl(38 92% 50%)' : 'hsl(222 30% 25%)' }} />
                                ))}
                            </div>

                            {/* Quote */}
                            <p style={{
                                color: 'var(--text-secondary)',
                                fontSize: '0.95rem',
                                lineHeight: 1.7,
                                marginBottom: '24px',
                                fontStyle: 'italic',
                                minHeight: '80px'
                            }}>
                                "{t.content}"
                            </p>

                            {/* Author */}
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', borderTop: '1px solid var(--border)', paddingTop: '16px' }}>
                                {t.image ? (
                                    <img src={t.image} alt={t.name} style={{ width: '44px', height: '44px', borderRadius: '50%', objectFit: 'cover' }} />
                                ) : (
                                    <div style={{
                                        width: '44px', height: '44px', borderRadius: '50%',
                                        background: 'hsl(187 94% 43% / 0.15)',
                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        color: 'var(--accent)', fontWeight: 700, fontSize: '1.1rem'
                                    }}>
                                        {t.name?.charAt(0).toUpperCase()}
                                    </div>
                                )}
                                <div>
                                    <h4 style={{ fontWeight: 600, fontSize: '0.95rem', color: 'var(--text-primary)' }}>{t.name}</h4>
                                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.8rem' }}>
                                        {t.position}{t.company ? ` @ ${t.company}` : ''}
                                    </p>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </motion.div>
            </motion.div>
        </section>
    );
}
