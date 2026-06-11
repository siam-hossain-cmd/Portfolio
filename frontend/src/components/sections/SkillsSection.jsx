import { useState, useEffect, useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import axios from 'axios';
import API_URL from '../../config/api';
import SectionHeader from './SectionHeader';

const skillCategories = [
    {
        title: "Frontend",
        skills: [
            { name: 'React', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg' },
            { name: 'Next.js', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nextjs/nextjs-original.svg', invert: true },
            { name: 'TypeScript', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/typescript/typescript-original.svg' },
            { name: 'JavaScript', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg' },
            { name: 'CSS', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/css3/css3-original.svg' },
            { name: 'Tailwind', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/tailwindcss/tailwindcss-original.svg' }
        ]
    },
    {
        title: "Backend",
        skills: [
            { name: 'Node.js', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg' },
            { name: 'Express.js', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/express/express-original.svg', invert: true }
        ]
    },
    {
        title: "Mobile",
        skills: [
            { name: 'Flutter', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/flutter/flutter-original.svg' },
            { name: 'Dart', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/dart/dart-original.svg' }
        ]
    },
    {
        title: "Database",
        skills: [
            { name: 'MongoDB', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mongodb/mongodb-original.svg' },
            { name: 'MySQL', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mysql/mysql-original.svg' },
            { name: 'Firebase', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/firebase/firebase-plain.svg' }
        ]
    },
    {
        title: "DevOps & Tools",
        skills: [
            { name: 'Git', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/git/git-original.svg' },
            { name: 'Docker', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/docker/docker-original.svg' },
            { name: 'AWS', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/amazonwebservices/amazonwebservices-original-wordmark.svg' },
            { name: 'DigitalOcean', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/digitalocean/digitalocean-original.svg' },
            { name: 'Vercel', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/vercel/vercel-original.svg', invert: true }
        ]
    }
];

export default function SkillsSection({ isDarkMode }) {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: "-100px" });
    const [skillsData, setSkillsData] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchSkills = async () => {
            try {
                const res = await axios.get(`${API_URL}/skills`);
                setSkillsData(res.data);
            } catch (err) {
                console.error("Error fetching skills:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchSkills();
        const interval = setInterval(fetchSkills, 10000);
        return () => clearInterval(interval);
    }, []);

    const getGroupedSkills = () => {
        if (!skillsData || skillsData.length === 0) {
            return [];
        }

        const categories = [
            { title: "Frontend", key: "Frontend" },
            { title: "Backend", key: "Backend" },
            { title: "Mobile", key: "Mobile" },
            { title: "Database", key: "Database" },
            { title: "DevOps & Tools", key: "Tools" }
        ];

        return categories.map(cat => {
            const list = skillsData.filter(s => s.category === cat.key || (cat.key === 'Tools' && s.category === 'DevOps & Tools') || (cat.key === 'Tools' && s.category === 'Tools'));
            return {
                title: cat.title,
                skills: list.map(s => ({
                    name: s.name,
                    icon: s.icon,
                    invert: ['next.js', 'express.js', 'express', 'vercel'].includes(s.name.toLowerCase())
                }))
            };
        }).filter(cat => cat.skills.length > 0);
    };

    const activeCategories = getGroupedSkills();

    return (
        <section id="skills" ref={ref} style={{ padding: '100px 24px', position: 'relative', overflow: 'hidden' }}>
            {/* Background decoration */}
            <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: '600px', height: '600px', background: 'radial-gradient(circle, hsl(187 94% 43% / 0.05) 0%, transparent 70%)', pointerEvents: 'none' }} />

            <motion.div initial={{ opacity: 0, y: 40 }} animate={isInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.6 }} style={{ maxWidth: '1200px', margin: '0 auto', position: 'relative', zIndex: 1 }}>
                <SectionHeader number="02" title="Skills & Technologies" />

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '24px' }}>
                    {activeCategories.map((category, catIndex) => (
                        <motion.div
                            key={category.title}
                            initial={{ opacity: 0, y: 30, scale: 0.95 }}
                            animate={isInView ? { opacity: 1, y: 0, scale: 1 } : {}}
                            transition={{ duration: 0.5, delay: catIndex * 0.1 }}
                            whileHover={{ y: -8, transition: { duration: 0.3 } }}
                            style={{
                                padding: '2px',
                                borderRadius: '20px',
                                background: 'linear-gradient(135deg, hsl(187 94% 43% / 0.3), hsl(187 94% 43% / 0.05))',
                            }}
                        >
                            <div style={{
                                padding: '28px',
                                borderRadius: '18px',
                                background: 'var(--bg-secondary)',
                                height: '100%'
                            }}>
                                <motion.h3
                                    initial={{ opacity: 0 }}
                                    animate={isInView ? { opacity: 1 } : {}}
                                    transition={{ delay: catIndex * 0.1 + 0.2 }}
                                    style={{
                                        color: 'var(--accent)',
                                        fontSize: '1rem',
                                        fontWeight: 600,
                                        marginBottom: '24px',
                                        textAlign: 'center',
                                        textTransform: 'uppercase',
                                        letterSpacing: '2px'
                                    }}
                                >
                                    {category.title}
                                </motion.h3>
                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(65px, 1fr))', gap: '12px' }}>
                                    {category.skills.map((skill, skillIndex) => (
                                        <motion.div
                                            key={skill.name}
                                            initial={{ opacity: 0, scale: 0.8 }}
                                            animate={isInView ? { opacity: 1, scale: 1 } : {}}
                                            transition={{ duration: 0.4, delay: catIndex * 0.1 + skillIndex * 0.05 + 0.3 }}
                                            whileHover={{
                                                scale: 1.1,
                                                y: -4,
                                                transition: { duration: 0.2 }
                                            }}
                                            style={{
                                                padding: '14px 8px',
                                                background: 'var(--bg-card)',
                                                borderRadius: '12px',
                                                textAlign: 'center',
                                                border: '1px solid var(--border)',
                                                cursor: 'default'
                                            }}
                                        >
                                            <motion.img
                                                src={skill.icon}
                                                alt={skill.name}
                                                whileHover={{ rotate: [0, -10, 10, 0], transition: { duration: 0.4 } }}
                                                style={{
                                                    width: '36px',
                                                    height: '36px',
                                                    margin: '0 auto 10px',
                                                    display: 'block',
                                                    filter: skill.invert && isDarkMode ? 'invert(1)' : 'none'
                                                }}
                                            />
                                            <span style={{ fontSize: '0.7rem', fontWeight: 500, color: 'var(--text-secondary)', display: 'block' }}>{skill.name}</span>
                                        </motion.div>
                                    ))}
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </motion.div>
        </section>
    );
}
