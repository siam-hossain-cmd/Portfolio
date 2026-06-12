import { useState, useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Phone, Mail, Github, Linkedin, MapPin, Send, Facebook } from 'lucide-react';
import axios from 'axios';
import API_URL from '../../config/api';
import useApiData from '../../hooks/useApiData';

export default function ContactSection() {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: "-100px" });
    const [formData, setFormData] = useState({ name: '', email: '', message: '' });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitStatus, setSubmitStatus] = useState(null); // 'success' | 'error' | null

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setSubmitStatus(null);

        try {
            await axios.post(`${API_URL}/messages`, formData);
            setSubmitStatus('success');
            setFormData({ name: '', email: '', message: '' });
            setTimeout(() => setSubmitStatus(null), 5000);
        } catch (error) {
            console.error('Error sending message:', error);
            setSubmitStatus('error');
        } finally {
            setIsSubmitting(false);
        }
    };

    const { data: settings } = useApiData('settings');

    const defaultContact = {
        whatsapp: 'https://wa.me/601123501201',
        whatsappLabel: '+601123501201',
        email: 's.siamhossain.h@gmail.com',
        github: 'github.com/siam-hossain-cmd',
        githubHref: 'https://github.com/siam-hossain-cmd',
        linkedin: 'linkedin.com/in/siam-hossain...',
        linkedinHref: 'https://www.linkedin.com/in/siam-hossain-66295439b',
        location: 'Dhaka, Bangladesh'
    };

    const socials = settings?.socialLinks || {};
    const contactInfo = settings?.contactInfo || {};

    const whatsappVal = contactInfo.phone || defaultContact.whatsappLabel;
    const whatsappUrl = socials.whatsapp || defaultContact.whatsapp;

    const emailVal = contactInfo.email || defaultContact.email;
    const emailUrl = emailVal.startsWith('mailto') ? emailVal : `mailto:${emailVal}`;

    const githubUrl = socials.github || defaultContact.githubHref;
    const githubVal = githubUrl.replace('https://', '').replace('http://', '');

    const linkedinUrl = socials.linkedin || defaultContact.linkedinHref;
    const linkedinVal = linkedinUrl.replace('https://', '').replace('http://', '').slice(0, 24) + (linkedinUrl.length > 24 ? '...' : '');

    const facebookUrl = socials.facebook;
    const facebookVal = facebookUrl ? facebookUrl.replace('https://', '').replace('http://', '').slice(0, 24) + (facebookUrl.length > 24 ? '...' : '') : '';

    const locationVal = contactInfo.location || defaultContact.location;

    const contactItems = [];
    if (whatsappUrl && whatsappVal) {
        contactItems.push({ icon: Phone, label: 'WhatsApp', value: whatsappVal, href: whatsappUrl });
    }
    if (emailVal) {
        contactItems.push({ icon: Mail, label: 'Email', value: emailVal, href: emailUrl });
    }
    if (githubUrl) {
        contactItems.push({ icon: Github, label: 'GitHub', value: githubVal, href: githubUrl });
    }
    if (linkedinUrl) {
        contactItems.push({ icon: Linkedin, label: 'LinkedIn', value: linkedinVal, href: linkedinUrl });
    }
    if (facebookUrl) {
        contactItems.push({ icon: Facebook, label: 'Facebook', value: facebookVal, href: facebookUrl });
    }
    if (locationVal) {
        contactItems.push({ icon: MapPin, label: 'Location', value: locationVal, href: null });
    }

    return (
        <section id="contact" ref={ref} style={{ padding: '100px 24px' }}>
            <motion.div initial={{ opacity: 0, y: 40 }} animate={isInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.6 }} style={{ maxWidth: '900px', margin: '0 auto' }}>
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '16px', marginBottom: '48px' }}>
                    <span className="font-mono" style={{ color: 'var(--accent)' }}>06.</span>
                    <h2 style={{ fontSize: '2rem', fontWeight: 700 }}>Get In Touch</h2>
                </div>

                <p style={{ color: 'var(--text-secondary)', textAlign: 'center', fontSize: '1.125rem', marginBottom: '48px', maxWidth: '600px', margin: '0 auto 48px' }}>
                    I'm currently looking for new opportunities. Whether you have a question or just want to say hi, my inbox is always open!
                </p>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '48px' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                        <h3 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '8px' }}>Contact Information</h3>
                        {contactItems.map((item, i) => (
                            <a key={i} href={item.href || undefined} target={item.href && !item.href.startsWith('mailto') ? '_blank' : undefined} rel="noopener noreferrer" className="glass" style={{ padding: '16px', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '16px', textDecoration: 'none', cursor: item.href ? 'pointer' : 'default', transition: 'transform 0.2s' }} onMouseOver={e => item.href && (e.currentTarget.style.transform = 'translateX(8px)')} onMouseOut={e => e.currentTarget.style.transform = 'translateX(0)'}>
                                <div style={{ padding: '12px', borderRadius: '8px', background: 'hsl(187 94% 43% / 0.1)', color: 'var(--accent)' }}>
                                    <item.icon size={22} />
                                </div>
                                <div>
                                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>{item.label}</p>
                                    <p style={{ fontWeight: 500, color: 'var(--text-primary)' }}>{item.value}</p>
                                </div>
                            </a>
                        ))}
                    </div>

                    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                        <div>
                            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, marginBottom: '8px', color: 'var(--text-primary)' }}>Name</label>
                            <input type="text" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} required placeholder="Your name" style={{ width: '100%', padding: '16px', borderRadius: '8px', background: 'var(--bg-secondary)', border: '1px solid var(--border)', color: 'var(--text-primary)', outline: 'none' }} />
                        </div>
                        <div>
                            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, marginBottom: '8px', color: 'var(--text-primary)' }}>Email</label>
                            <input type="email" value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} required placeholder="your@email.com" style={{ width: '100%', padding: '16px', borderRadius: '8px', background: 'var(--bg-secondary)', border: '1px solid var(--border)', color: 'var(--text-primary)', outline: 'none' }} />
                        </div>
                        <div>
                            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, marginBottom: '8px', color: 'var(--text-primary)' }}>Message</label>
                            <textarea value={formData.message} onChange={e => setFormData({ ...formData, message: e.target.value })} required placeholder="Your message..." rows={5} style={{ width: '100%', padding: '16px', borderRadius: '8px', background: 'var(--bg-secondary)', border: '1px solid var(--border)', color: 'var(--text-primary)', outline: 'none', resize: 'none' }} />
                        </div>
                        <button type="submit" disabled={isSubmitting} className="glow" style={{ width: '100%', padding: '16px', background: isSubmitting ? 'hsl(187 94% 35%)' : 'var(--accent)', color: 'white', borderRadius: '8px', fontWeight: 600, border: 'none', cursor: isSubmitting ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', opacity: isSubmitting ? 0.7 : 1, transition: 'all 0.3s' }}>
                            {isSubmitting ? 'Sending...' : 'Send Message'} {!isSubmitting && <Send size={18} />}
                        </button>
                        {submitStatus === 'success' && (
                            <div style={{ padding: '16px', background: 'hsl(142 76% 36% / 0.15)', border: '1px solid hsl(142 76% 36% / 0.3)', borderRadius: '8px', color: 'hsl(142 76% 36%)', textAlign: 'center', fontWeight: 500 }}>
                                ✓ Message sent successfully! I'll get back to you soon.
                            </div>
                        )}
                        {submitStatus === 'error' && (
                            <div style={{ padding: '16px', background: 'hsl(0 84% 60% / 0.15)', border: '1px solid hsl(0 84% 60% / 0.3)', borderRadius: '8px', color: 'hsl(0 84% 60%)', textAlign: 'center', fontWeight: 500 }}>
                                ✗ Failed to send message. Please try again or email me directly.
                            </div>
                        )}
                    </form>
                </div>
            </motion.div>
        </section>
    );
}
