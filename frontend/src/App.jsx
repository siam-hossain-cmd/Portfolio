import { useState, useEffect, useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { Github, Linkedin, Mail, Download, ArrowDown, ExternalLink, Code2, Smartphone, Rocket, Search, PenTool, Code, TestTube, Send, MapPin, Menu, X, Folder, User, Sun, Moon, Phone } from 'lucide-react'
import axios from 'axios'

const API_URL = 'http://localhost:5001/api'

// Roles for typewriter effect
const roles = [
  "Software Engineering Student",
  "Full-Stack Developer",
  "Flutter Mobile App Developer",
  "UI/UX Enthusiast"
]

// Skill categories with icons
const skillCategories = [
  {
    title: "Frontend",
    skills: [
      { name: 'React', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg' },
      { name: 'Next.js', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nextjs/nextjs-original.svg', invert: true },
      { name: 'TypeScript', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/typescript/typescript-original.svg' },
      { name: 'JavaScript', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg' },
      { name: 'HTML', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/html5/html5-original.svg' },
      { name: 'CSS', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/css3/css3-original.svg' },
      { name: 'Tailwind', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/tailwindcss/tailwindcss-original.svg' }
    ]
  },
  {
    title: "Backend",
    skills: [
      { name: 'Node.js', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg' },
      { name: 'Express.js', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/express/express-original.svg', invert: true },
      { name: 'Python', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg' }
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
]

// Featured projects
const featuredProjects = [
  {
    title: "E-Commerce Platform",
    description: "A full-stack e-commerce solution with real-time inventory management, secure payments, and an intuitive admin dashboard.",
    technologies: ["Next.js", "Node.js", "PostgreSQL", "Stripe", "Tailwind"],
    github: "#",
    live: "#"
  },
  {
    title: "Task Management App",
    description: "Cross-platform mobile app built with Flutter featuring offline-first architecture, real-time sync, and beautiful animations.",
    technologies: ["Flutter", "Dart", "Firebase", "Provider", "SQLite"],
    github: "#",
    live: "#"
  },
  {
    title: "Portfolio Generator",
    description: "A web application that helps developers create stunning portfolios with customizable themes and components.",
    technologies: ["React", "TypeScript", "Framer Motion", "Tailwind"],
    github: "#",
    live: "#"
  }
]

const otherProjects = [
  { title: "Weather Dashboard", description: "Real-time weather tracking with beautiful visualizations.", technologies: ["React", "OpenWeather API", "Chart.js"], github: "#" },
  { title: "Chat Application", description: "Real-time messaging app with WebSocket support.", technologies: ["Node.js", "Socket.io", "MongoDB"], github: "#" },
  { title: "Fitness Tracker", description: "Mobile app for tracking workouts and health metrics.", technologies: ["Flutter", "Firebase", "Health Kit"], github: "#" }
]

// Process steps
const processSteps = [
  { icon: Search, title: "Requirement Analysis", description: "Understanding the problem, gathering requirements, and defining project scope." },
  { icon: PenTool, title: "System Design", description: "Creating architecture, designing UI/UX, and planning technical implementation." },
  { icon: Code, title: "Development", description: "Writing clean, maintainable code with best practices and documentation." },
  { icon: TestTube, title: "Testing", description: "Rigorous testing including unit tests, integration tests, and UAT." },
  { icon: Rocket, title: "Deployment", description: "Deploying with CI/CD pipelines, monitoring, and continuous improvement." }
]

function App() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const saved = localStorage.getItem('theme')
    return saved ? saved === 'dark' : true
  })

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    if (isDarkMode) {
      document.body.classList.remove('light-mode')
      localStorage.setItem('theme', 'dark')
    } else {
      document.body.classList.add('light-mode')
      localStorage.setItem('theme', 'light')
    }
  }, [isDarkMode])

  const toggleTheme = () => setIsDarkMode(!isDarkMode)

  return (
    <div style={{ minHeight: '100vh' }}>
      <Navbar isScrolled={isScrolled} isDarkMode={isDarkMode} toggleTheme={toggleTheme} />
      <HeroSection isDarkMode={isDarkMode} />
      <AboutSection isDarkMode={isDarkMode} />
      <SkillsSection isDarkMode={isDarkMode} />
      <ProjectsSection isDarkMode={isDarkMode} />
      <ProcessSection isDarkMode={isDarkMode} />
      <ContactSection isDarkMode={isDarkMode} />
      <Footer isDarkMode={isDarkMode} />
    </div>
  )
}


// Navbar Component
function Navbar({ isScrolled, isDarkMode, toggleTheme }) {
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
      style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 50, padding: isScrolled ? '16px 0' : '24px 0', transition: 'all 0.3s', background: isScrolled ? undefined : 'transparent' }}
    >
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <a href="#" className="text-gradient font-mono" style={{ fontSize: '1.5rem', fontWeight: 700, textDecoration: 'none' }}>
          {"Siam"}
        </a>

        <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
          {navLinks.map(link => (
            <a key={link.name} href={link.href} style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', fontWeight: 500, textDecoration: 'none', transition: 'color 0.3s' }}
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

          <a href="#contact" className="glow" style={{ padding: '10px 20px', background: 'var(--accent)', color: isDarkMode ? 'hsl(222 47% 5%)' : 'white', borderRadius: '8px', fontWeight: 600, fontSize: '0.875rem', textDecoration: 'none' }}>
            Hire Me
          </a>
        </div>
      </div>
    </motion.nav>
  )
}

// Hero Section with side-by-side layout
function HeroSection() {
  const [displayText, setDisplayText] = useState('')
  const [roleIndex, setRoleIndex] = useState(0)
  const [isDeleting, setIsDeleting] = useState(false)

  useEffect(() => {
    const currentRole = roles[roleIndex]
    const timeout = setTimeout(() => {
      if (!isDeleting) {
        if (displayText.length < currentRole.length) {
          setDisplayText(currentRole.slice(0, displayText.length + 1))
        } else {
          setTimeout(() => setIsDeleting(true), 2000)
        }
      } else {
        if (displayText.length > 0) {
          setDisplayText(displayText.slice(0, -1))
        } else {
          setIsDeleting(false)
          setRoleIndex((prev) => (prev + 1) % roles.length)
        }
      }
    }, isDeleting ? 50 : 100)
    return () => clearTimeout(timeout)
  }, [displayText, isDeleting, roleIndex])

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
              <img src="/profile.png" alt="Siam Hossain" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
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
              {[Github, Linkedin, Mail].map((Icon, i) => (
                <a key={i} href="#" style={{ padding: '12px', borderRadius: '50%', border: '1px solid var(--border)', color: 'var(--text-primary)', background: 'var(--bg-secondary)' }}>
                  <Icon size={22} />
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
  )
}

// About Section
function AboutSection() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })

  return (
    <section id="about" ref={ref} style={{ padding: '100px 24px' }}>
      <motion.div initial={{ opacity: 0, y: 40 }} animate={isInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.6 }} style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <SectionHeader number="01" title="About Me" />

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '48px', alignItems: 'center' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <p style={{ color: 'var(--text-secondary)', fontSize: '1.125rem', lineHeight: 1.8 }}>
              I'm a passionate <span style={{ color: 'var(--text-primary)', fontWeight: 500 }}>Software Engineering student</span> with a deep love for creating digital experiences. My journey in tech started with curiosity and has evolved into a full-blown obsession with building things.
            </p>
            <p style={{ color: 'var(--text-secondary)', fontSize: '1.125rem', lineHeight: 1.8 }}>
              I specialize in <span style={{ color: 'var(--accent)' }}>full-stack web development</span> and <span style={{ color: 'var(--accent)' }}>Flutter mobile app development</span>. I enjoy the challenge of turning complex problems into simple, beautiful solutions.
            </p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {[
              { icon: Code2, title: "Full-Stack Development", desc: "Building scalable web applications with modern technologies" },
              { icon: Smartphone, title: "Flutter Development", desc: "Creating beautiful cross-platform mobile experiences" },
              { icon: Rocket, title: "Problem Solving", desc: "Transforming complex challenges into elegant solutions" }
            ].map((item, i) => (
              <motion.div key={i} initial={{ opacity: 0, x: 20 }} animate={isInView ? { opacity: 1, x: 0 } : {}} transition={{ duration: 0.5, delay: i * 0.1 }} className="glass" style={{ padding: '24px', borderRadius: '12px', display: 'flex', gap: '16px' }}>
                <div style={{ padding: '12px', borderRadius: '8px', background: 'hsl(187 94% 43% / 0.15)', color: 'var(--accent)' }}>
                  <item.icon size={24} />
                </div>
                <div>
                  <h3 style={{ fontWeight: 600, fontSize: '1.125rem', marginBottom: '4px', color: 'var(--text-primary)' }}>{item.title}</h3>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>{item.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>
    </section>
  )
}

// Tech Stack icons for frameworks and tools
const techStack = [
  { name: 'Node.js', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg' },
  { name: 'React', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg' },
  { name: 'Flutter', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/flutter/flutter-original.svg' },
  { name: 'Next.js', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nextjs/nextjs-original.svg' },
  { name: 'Express.js', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/express/express-original.svg' },
  { name: 'MongoDB', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mongodb/mongodb-original.svg' },
  { name: 'TypeScript', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/typescript/typescript-original.svg' },
  { name: 'JavaScript', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg' },
  { name: 'Python', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg' },
  { name: 'Firebase', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/firebase/firebase-plain.svg' },
  { name: 'HTML', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/html5/html5-original.svg' },
  { name: 'CSS', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/css3/css3-original.svg' }
]

// TechStack Section - Frameworks & Tools
function TechStackSection() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })

  return (
    <section ref={ref} style={{ padding: '100px 24px', background: 'linear-gradient(180deg, hsl(222 47% 6%) 0%, hsl(222 47% 5%) 100%)' }}>
      <motion.div initial={{ opacity: 0, y: 40 }} animate={isInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.6 }} style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '60px' }}>
          <h2 style={{ fontSize: '2.5rem', fontWeight: 700, marginBottom: '16px' }}>Tech Stack</h2>
          <p style={{ color: 'var(--text-secondary)', maxWidth: '600px', margin: '0 auto' }}>
            Frameworks and technologies I work with
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', gap: '16px' }}>
          {techStack.map((tech, i) => (
            <motion.div
              key={tech.name}
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.4, delay: i * 0.05 }}
              className="glass"
              style={{ padding: '24px 16px', borderRadius: '16px', textAlign: 'center', cursor: 'default' }}
            >
              <img
                src={tech.icon}
                alt={tech.name}
                style={{
                  width: '48px',
                  height: '48px',
                  margin: '0 auto 12px',
                  display: 'block',
                  filter: tech.name === 'Next.js' || tech.name === 'Express.js' ? 'invert(1)' : 'none'
                }}
              />
              <h4 style={{ fontSize: '0.875rem', fontWeight: 600 }}>{tech.name}</h4>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  )
}

// Skills Section - Premium Design
function SkillsSection({ isDarkMode }) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })

  return (
    <section id="skills" ref={ref} style={{ padding: '100px 24px', position: 'relative', overflow: 'hidden' }}>
      {/* Background decoration */}
      <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: '600px', height: '600px', background: 'radial-gradient(circle, hsl(187 94% 43% / 0.05) 0%, transparent 70%)', pointerEvents: 'none' }} />

      <motion.div initial={{ opacity: 0, y: 40 }} animate={isInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.6 }} style={{ maxWidth: '1200px', margin: '0 auto', position: 'relative', zIndex: 1 }}>
        <SectionHeader number="02" title="Skills & Technologies" />

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '24px' }}>
          {skillCategories.map((category, catIndex) => (
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
  )
}

// Projects Section
function ProjectsSection() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })

  return (
    <section id="projects" ref={ref} style={{ padding: '100px 24px' }}>
      <motion.div initial={{ opacity: 0, y: 40 }} animate={isInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.6 }} style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <SectionHeader number="03" title="Featured Projects" />

        <div style={{ display: 'flex', flexDirection: 'column', gap: '80px', marginBottom: '80px' }}>
          {featuredProjects.map((project, i) => (
            <motion.div key={project.title} initial={{ opacity: 0, y: 30 }} animate={isInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.6, delay: i * 0.1 }} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '32px', alignItems: 'center' }}>
              <div className="glass" style={{ aspectRatio: '16/10', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(135deg, hsl(187 94% 43% / 0.1), hsl(187 94% 43% / 0.02))', order: i % 2 === 1 ? 2 : 1 }}>
                <span style={{ fontSize: '4rem', color: 'hsl(187 94% 43% / 0.3)' }}>{i + 1}</span>
              </div>
              <div style={{ order: i % 2 === 1 ? 1 : 2, textAlign: i % 2 === 1 ? 'right' : 'left' }}>
                <span className="font-mono" style={{ color: 'var(--accent)', fontSize: '0.875rem' }}>Featured Project</span>
                <h3 style={{ fontSize: '1.5rem', fontWeight: 700, marginTop: '8px', marginBottom: '16px' }}>{project.title}</h3>
                <div className="glass" style={{ padding: '24px', borderRadius: '12px', marginBottom: '16px' }}>
                  <p style={{ color: 'var(--text-secondary)' }}>{project.description}</p>
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', marginBottom: '24px', justifyContent: i % 2 === 1 ? 'flex-end' : 'flex-start' }}>
                  {project.technologies.map(tech => (
                    <span key={tech} className="font-mono" style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>{tech}</span>
                  ))}
                </div>
                <div style={{ display: 'flex', gap: '16px', justifyContent: i % 2 === 1 ? 'flex-end' : 'flex-start' }}>
                  <a href={project.github} style={{ color: 'var(--text-primary)' }}><Github size={22} /></a>
                  {project.live && <a href={project.live} style={{ color: 'var(--text-primary)' }}><ExternalLink size={22} /></a>}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <h3 style={{ fontSize: '1.5rem', fontWeight: 700, textAlign: 'center', marginBottom: '32px' }}>Other Noteworthy Projects</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px' }}>
          {otherProjects.map((project, i) => (
            <motion.div key={project.title} initial={{ opacity: 0, y: 20 }} animate={isInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.5, delay: 0.4 + i * 0.1 }} className="glass" style={{ padding: '24px', borderRadius: '12px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <Folder size={40} style={{ color: 'var(--accent)' }} />
                <a href={project.github} style={{ color: 'var(--text-secondary)' }}><Github size={20} /></a>
              </div>
              <h4 style={{ fontSize: '1.125rem', fontWeight: 600, marginBottom: '8px' }}>{project.title}</h4>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginBottom: '16px' }}>{project.description}</p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                {project.technologies.map(tech => (
                  <span key={tech} className="font-mono" style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{tech}</span>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  )
}

// Process Section
function ProcessSection() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })

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
  )
}

// Contact Section
function ContactSection() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })
  const [formData, setFormData] = useState({ name: '', email: '', message: '' })

  const handleSubmit = (e) => {
    e.preventDefault()
    alert('Thanks for reaching out!')
    setFormData({ name: '', email: '', message: '' })
  }

  return (
    <section id="contact" ref={ref} style={{ padding: '100px 24px' }}>
      <motion.div initial={{ opacity: 0, y: 40 }} animate={isInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.6 }} style={{ maxWidth: '900px', margin: '0 auto' }}>
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '16px', marginBottom: '48px' }}>
          <span className="font-mono" style={{ color: 'var(--accent)' }}>05.</span>
          <h2 style={{ fontSize: '2rem', fontWeight: 700 }}>Get In Touch</h2>
        </div>

        <p style={{ color: 'var(--text-secondary)', textAlign: 'center', fontSize: '1.125rem', marginBottom: '48px', maxWidth: '600px', margin: '0 auto 48px' }}>
          I'm currently looking for new opportunities. Whether you have a question or just want to say hi, my inbox is always open!
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '48px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '8px' }}>Contact Information</h3>
            {[
              { icon: Phone, label: 'WhatsApp', value: '+601123501201', href: 'https://wa.me/601123501201' },
              { icon: Mail, label: 'Email', value: 's.siamhossain.h@gmail.com', href: 'mailto:s.siamhossain.h@gmail.com' },
              { icon: Github, label: 'GitHub', value: 'github.com/siam-hossain-cmd', href: 'https://github.com/siam-hossain-cmd' },
              { icon: Linkedin, label: 'LinkedIn', value: 'linkedin.com/in/hossainsiam', href: 'https://linkedin.com/in/hossainsiam' },
              { icon: MapPin, label: 'Location', value: 'Dhaka, Bangladesh', href: null }
            ].map((item, i) => (
              <a key={i} href={item.href} target={item.href && !item.href.startsWith('mailto') ? '_blank' : undefined} rel="noopener noreferrer" className="glass" style={{ padding: '16px', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '16px', textDecoration: 'none', cursor: item.href ? 'pointer' : 'default', transition: 'transform 0.2s' }} onMouseOver={e => item.href && (e.currentTarget.style.transform = 'translateX(8px)')} onMouseOut={e => e.currentTarget.style.transform = 'translateX(0)'}>
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
            <button type="submit" className="glow" style={{ width: '100%', padding: '16px', background: 'var(--accent)', color: 'white', borderRadius: '8px', fontWeight: 600, border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
              Send Message <Send size={18} />
            </button>
          </form>
        </div>
      </motion.div>
    </section>
  )
}

// Footer
function Footer() {
  return (
    <footer style={{ padding: '40px 24px', borderTop: '1px solid hsl(222 30% 18%)' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', textAlign: 'center' }}>
        <a href="#" className="text-gradient font-mono" style={{ fontSize: '1.25rem', fontWeight: 700, textDecoration: 'none', display: 'block', marginBottom: '16px' }}>
          {"Siam"}
        </a>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
          Designed & Built by Siam Hossain
        </p>
        <p style={{ color: 'hsl(215 20% 45%)', fontSize: '0.75rem', marginTop: '8px' }}>
          © {new Date().getFullYear()} All Rights Reserved
        </p>
      </div>
    </footer>
  )
}

// Section Header Component
function SectionHeader({ number, title }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '48px' }}>
      <span className="font-mono" style={{ color: 'var(--accent)' }}>{number}.</span>
      <h2 style={{ fontSize: '2rem', fontWeight: 700 }}>{title}</h2>
      <div style={{ flex: 1, height: '1px', background: 'hsl(222 30% 18%)' }} />
    </div>
  )
}

export default App
