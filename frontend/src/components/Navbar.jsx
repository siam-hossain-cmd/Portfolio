import { motion } from 'framer-motion'

export default function Navbar() {
    return (
        <nav className="fixed top-0 w-full z-50 glass">
            <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
                <motion.h1
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="text-xl font-bold bg-gradient-to-r from-accent-blue to-accent-purple bg-clip-text text-transparent cursor-pointer"
                    onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                >
                    Siam Hossain
                </motion.h1>
                <div className="flex gap-8 text-sm font-medium text-foreground/70">
                    {['About', 'Skills', 'Projects', 'Contact'].map((item) => (
                        <a
                            key={item}
                            href={`#${item.toLowerCase()}`}
                            className="hover:text-accent-blue transition-colors"
                        >
                            {item}
                        </a>
                    ))}
                </div>
            </div>
        </nav>
    )
}
