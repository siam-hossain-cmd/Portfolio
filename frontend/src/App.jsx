import { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import HeroSection from './components/sections/HeroSection';
import AboutSection from './components/sections/AboutSection';
import SkillsSection from './components/sections/SkillsSection';
import ProjectsSection from './components/sections/ProjectsSection';
import ServicesSection from './components/sections/ServicesSection';
import ProcessSection from './components/sections/ProcessSection';
import ContactSection from './components/sections/ContactSection';
import { useTheme } from './context/ThemeContext';

function App() {
    const [isScrolled, setIsScrolled] = useState(false);
    const { isDarkMode, toggleTheme } = useTheme();

    useEffect(() => {
        const handleScroll = () => setIsScrolled(window.scrollY > 50);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <div style={{ minHeight: '100vh' }}>
            <Navbar isScrolled={isScrolled} isDarkMode={isDarkMode} toggleTheme={toggleTheme} />
            <HeroSection />
            <AboutSection />
            <SkillsSection isDarkMode={isDarkMode} />
            <ProjectsSection isDarkMode={isDarkMode} />
            <ServicesSection />
            <ProcessSection />
            <ContactSection />
            <Footer isDarkMode={isDarkMode} />
        </div>
    );
}

export default App;
