import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowDown, Download, Github, Linkedin, Mail } from 'lucide-react';

const roles = [
    "Software Engineering Student",
    "Full-Stack Developer",
    "Flutter Mobile App Developer",
    "UI/UX Enthusiast"
];

export default function HeroSection() {
    const [displayText, setDisplayText] = useState('');
    const [roleIndex, setRoleIndex] = useState(0);
    const [isDeleting, setIsDeleting] = useState(false);

    useEffect(() => {
        const currentRole = roles[roleIndex];
        const timeout = setTimeout(() => {
            if (!isDeleting) {
                if (displayText.length < currentRole.length) {
                    setDisplayText(currentRole.slice(0, displayText.length + 1));
                } else {
                    setTimeout(() => setIsDeleting(true), 2000);
                }
            } else {
                if (displayText.length > 0) {
                    setDisplayText(displayText.slice(0, -1));
                } else {
                    setIsDeleting(false);
                    setRoleIndex((prev) => (prev + 1) % roles.length);
                }
            }
        }, isDeleting ? 50 : 100);
        return () => clearTimeout(timeout);
    }, [displayText, isDeleting, roleIndex]);

    return (
        <section style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', overflow: 'hidden' }}>
            {/* Background Orbs */}
            <div style={{ position: 'absolute', top: '25%', left: '25%', width: '400px', height: '400px', background: 'hsl(187 94% 43% / 0.15)', borderRadius: '50%', filter: 'blur(100px)' }} />
            <div style={{ position: 'absolute', bottom: '25%', right: '25%', width: '400px', height: '400px', background: 'hsl(187 94% 43% / 0.08)', borderRadius: '50%', filter: 'blur(100px)' }} />

            <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '120px 24px 40px', position: 'relative', zIndex: 1, width: '100%' }}>
                <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: '64px', flexWrap: 'wrap', justifyContent: 'center' }}>

                    {/* Profile Photo - Left Side */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.6 }}
                        style={{ position: 'relative', flexShrink: 0 }}
                    >
                        <div style={{ width: '280px', height: '280px', borderRadius: '50%', background: 'linear-gradient(135deg, hsl(187 94% 43% / 0.2), hsl(187 94% 43% / 0.05))', border: '2px solid hsl(187 94% 43% / 0.3)', overflow: 'hidden' }}>
                            <img src="/profile.webp" alt="Siam Hossain" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        </div>
                        {/* Decorative rings */}
                        <div style={{ position: 'absolute', inset: '-12px', borderRadius: '50%', border: '1px solid hsl(187 94% 43% / 0.2)' }} />
                        <div style={{ position: 'absolute', inset: '-24px', borderRadius: '50%', border: '1px solid hsl(187 94% 43% / 0.1)' }} />
                    </motion.div>

                    {/* Content - Right Side */}
                    <div style={{ flex: 1, minWidth: '300px' }}>
                        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} style={{ marginBottom: '24px' }}>
                            <span className="font-mono" style={{ display: 'inline-block', padding: '8px 16px', borderRadius: '50px', border: '1px solid var(--accent)', color: 'var(--accent)', fontSize: '0.875rem' }}>
                                Available for freelance work
                            </span>
                        </motion.div>

                        <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.1 }} style={{ fontSize: 'clamp(2.5rem, 5vw, 4rem)', fontWeight: 700, marginBottom: '16px', lineHeight: 1.1, color: 'var(--text-primary)' }}>
                            Hi, I'm <span className="text-gradient">Siam Hossain</span>
                        </motion.h1>

                        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.2 }} style={{ fontSize: '1.25rem', color: 'var(--text-secondary)', marginBottom: '16px', height: '36px' }}>
                            <span style={{ color: 'var(--text-primary)', fontWeight: 500 }}>{displayText}</span>
                            <span style={{ color: 'var(--accent)' }}>|</span>
                        </motion.div>

                        <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.3 }} style={{ fontSize: '1.125rem', color: 'var(--text-secondary)', marginBottom: '32px', maxWidth: '500px', lineHeight: 1.7 }}>
                            Crafting <span style={{ color: 'var(--text-primary)', fontWeight: 500 }}>beautiful web experiences</span> and <span style={{ color: 'var(--text-primary)', fontWeight: 500 }}>Flutter mobile apps</span>
                        </motion.p>

                        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.4 }} style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', marginBottom: '32px' }}>
                            <a href="#projects" className="glow" style={{ padding: '16px 32px', background: 'var(--accent)', color: 'white', borderRadius: '8px', fontWeight: 600, textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
                                View Projects <ArrowDown size={18} />
                            </a>
                            <a href="/cv.html" target="_blank" style={{ padding: '16px 32px', border: '1px solid var(--border)', borderRadius: '8px', fontWeight: 600, color: 'var(--text-primary)', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'var(--bg-secondary)' }}>
                                <Download size={18} /> Download CV
                            </a>
                        </motion.div>

                        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.5 }} style={{ display: 'flex', gap: '16px' }}>
                            {[
                                { Icon: Github, href: 'https://github.com/siam-hossain-cmd' },
                                { Icon: Linkedin, href: 'https://www.linkedin.com/in/siam-hossain-66295439b' },
                                { Icon: Mail, href: 'mailto:s.siamhossain.h@gmail.com' }
                            ].map((item, i) => (
                                <a key={i} href={item.href} target={item.href.startsWith('mailto') ? undefined : '_blank'} rel="noopener noreferrer" style={{ padding: '12px', borderRadius: '50%', border: '1px solid var(--border)', color: 'var(--text-primary)', background: 'var(--bg-secondary)', transition: 'all 0.3s' }}
                                    onMouseOver={e => { e.currentTarget.style.borderColor = 'var(--accent)'; e.currentTarget.style.color = 'var(--accent)' }}
                                    onMouseOut={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.color = 'var(--text-primary)' }}
                                >
                                    <item.Icon size={22} />
                                </a>
                            ))}
                        </motion.div>
                    </div>
                </div>
            </div>

            {/* Scroll Indicator */}
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }} style={{ position: 'absolute', bottom: '40px', left: '50%', transform: 'translateX(-50%)', textAlign: 'center' }}>
                <span style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', display: 'block', marginBottom: '8px' }}>Scroll Down</span>
                <motion.div animate={{ y: [0, 8, 0] }} transition={{ duration: 1.5, repeat: Infinity }}>
                    <ArrowDown size={20} style={{ color: 'var(--accent)' }} />
                </motion.div>
            </motion.div>
        </section>
    );
}
