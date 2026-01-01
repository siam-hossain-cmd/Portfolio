import { motion } from 'framer-motion'
import { Sun, Moon } from 'lucide-react'
import { Link, useLocation } from 'react-router-dom'

export default function Navbar({ isScrolled, isDarkMode, toggleTheme }) {
    const location = useLocation()
    const isHome = location.pathname === '/'

    const navLinks = [
        { name: "About", href: "#about" },
        { name: "Skills", href: "#skills" },
        { name: "Projects", href: "#projects" },
        { name: "Process", href: "#process" },
        { name: "Contact", href: "#contact" }
    ]

    const getHref = (href) => {
        if (isHome) return href
        return `/${href}`
    }

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
                background: isScrolled ? undefined : 'transparent'
            }}
        >
            <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Link to="/" className="text-gradient font-mono" style={{ fontSize: '1.5rem', fontWeight: 700, textDecoration: 'none' }}>
                    {"Siam"}
                </Link>

                <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
                    {navLinks.map(link => {
                        const href = getHref(link.href)
                        return isHome ? (
                            <a
                                key={link.name}
                                href={href}
                                style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', fontWeight: 500, textDecoration: 'none', transition: 'color 0.3s' }}
                                onMouseOver={e => e.target.style.color = 'var(--accent)'}
                                onMouseOut={e => e.target.style.color = 'var(--text-secondary)'}
                            >
                                {link.name}
                            </a>
                        ) : (
                            <Link
                                key={link.name}
                                to={href} // Hash link with router on non-home pages needs care. 
                            // Actually `Link to="/#about"` works but might not scroll.
                            // Standard `a` tag with full path `/#about` works better for reload/scroll.
                            // Let's stick to standard anchor for hash links across pages or simple Link.
                            // A safer bet for cross-page hash link is just href="/#about"
                            >
                                <span
                                    style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', fontWeight: 500, textDecoration: 'none', transition: 'color 0.3s', cursor: 'pointer' }}
                                    onMouseOver={e => e.target.style.color = 'var(--accent)'}
                                    onMouseOut={e => e.target.style.color = 'var(--text-secondary)'}
                                >
                                    {link.name}
                                </span>
                            </Link>
                        )
                    })}
                    {/* Re-implementing the mapping to use simple anchors for consistency and simplicity across pages */}
                    <div style={{ display: 'flex', gap: '24px' }}></div>
                </div>

                {/* Let's restart the links part to be cleaner */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
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

                    {/* Theme Toggle Button */}
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
            </div>
        </motion.nav>
    )
}
