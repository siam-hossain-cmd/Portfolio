import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Sun, Moon, Menu, X } from 'lucide-react'
import { Link, useLocation } from 'react-router-dom'

export default function Navbar({ isScrolled, isDarkMode, toggleTheme }) {
    const location = useLocation()
    const isHome = location.pathname === '/'
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

    // Close mobile menu when route changes
    useEffect(() => {
        setIsMobileMenuOpen(false)
    }, [location])

    const navLinks = [
        { name: "About", href: "#about" },
        { name: "Skills", href: "#skills" },
        { name: "Projects", href: "#projects" },
        { name: "Process", href: "#process" },
        { name: "Contact", href: "#contact" }
    ]

    return (
        <motion.nav
            initial={{ y: -100 }}
            animate={{ y: 0 }}
            transition={{ duration: 0.5 }}
            className={isScrolled ? "glass" : ""}
            style={{
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                zIndex: 50,
                padding: isScrolled ? '16px 0' : '24px 0',
                transition: 'all 0.3s',
                background: isScrolled || isMobileMenuOpen ? 'var(--bg-primary)' : 'transparent', // Solid background when menu open
                backdropFilter: isScrolled ? 'blur(10px)' : 'none'
            }}
        >
            <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Link to="/" className="text-gradient font-mono" style={{ fontSize: '1.5rem', fontWeight: 700, textDecoration: 'none', zIndex: 60, display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <img src="/logo.png" alt="Siam Logo" style={{ height: '40px', width: 'auto' }} />
                    {"Siam"}
                </Link>

                {/* Desktop Menu */}
                <div className="desktop-menu" style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
                    {navLinks.map(link => (
                        <a
                            key={link.name}
                            href={isHome ? link.href : `/${link.href}`}
                            style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', fontWeight: 500, textDecoration: 'none', transition: 'color 0.3s' }}
                            onMouseOver={e => e.target.style.color = 'var(--accent)'}
                            onMouseOut={e => e.target.style.color = 'var(--text-secondary)'}
                        >
                            {link.name}
                        </a>
                    ))}

                    <motion.button
                        onClick={toggleTheme}
                        className="theme-toggle"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                        aria-label="Toggle theme"
                    >
                        <motion.div
                            initial={false}
                            animate={{ rotate: isDarkMode ? 0 : 180 }}
                            transition={{ duration: 0.3 }}
                        >
                            {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
                        </motion.div>
                    </motion.button>

                    <Link to="/hire-me" className="glow" style={{ padding: '10px 20px', background: 'var(--accent)', color: isDarkMode ? 'hsl(222 47% 5%)' : 'white', borderRadius: '8px', fontWeight: 600, fontSize: '0.875rem', textDecoration: 'none' }}>
                        Hire Me
                    </Link>
                </div>

                {/* Mobile Menu Button */}
                <div className="mobile-toggle" style={{ display: 'none', zIndex: 60 }}>
                    <motion.button
                        onClick={toggleTheme}
                        style={{ background: 'none', border: 'none', color: 'var(--text-primary)', cursor: 'pointer', marginRight: '16px' }}
                    >
                        {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
                    </motion.button>
                    <button
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        style={{ background: 'none', border: 'none', color: 'var(--text-primary)', cursor: 'pointer' }}
                    >
                        {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>
                </div>
            </div>

            {/* Mobile Menu Overlay */}
            <AnimatePresence>
                {isMobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: '100vh' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3 }}
                        style={{
                            position: 'fixed',
                            top: 0,
                            left: 0,
                            right: 0,
                            background: 'var(--bg-primary)',
                            paddingTop: '100px',
                            paddingLeft: '24px',
                            paddingRight: '24px',
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '24px',
                            zIndex: 50,
                            overflow: 'hidden'
                        }}
                    >
                        {navLinks.map(link => (
                            <a
                                key={link.name}
                                href={isHome ? link.href : `/${link.href}`}
                                onClick={() => setIsMobileMenuOpen(false)}
                                style={{ color: 'var(--text-primary)', fontSize: '1.5rem', fontWeight: 600, textDecoration: 'none' }}
                            >
                                {link.name}
                            </a>
                        ))}
                        <Link
                            to="/hire-me"
                            onClick={() => setIsMobileMenuOpen(false)}
                            style={{
                                padding: '16px',
                                background: 'var(--accent)',
                                color: isDarkMode ? 'hsl(222 47% 5%)' : 'white',
                                borderRadius: '12px',
                                fontWeight: 700,
                                fontSize: '1.25rem',
                                textDecoration: 'none',
                                textAlign: 'center',
                                marginTop: '24px'
                            }}
                        >
                            Hire Me
                        </Link>
                    </motion.div>
                )}
            </AnimatePresence>

            <style>{`
                @media (max-width: 768px) {
                    .desktop-menu {
                        display: none !important;
                    }
                    .mobile-toggle {
                        display: flex !important;
                        align-items: center;
                    }
                }
            `}</style>
        </motion.nav>
    )
}
