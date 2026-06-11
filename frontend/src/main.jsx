import React, { lazy, Suspense } from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { Loader2 } from 'lucide-react';
import './index.css';

// Lazy load routing targets
const App = lazy(() => import('./App'));
const HireMe = lazy(() => import('./pages/HireMe'));
const ProjectDetail = lazy(() => import('./pages/ProjectDetail'));
const BlogList = lazy(() => import('./pages/BlogList'));
const BlogPost = lazy(() => import('./pages/BlogPost'));

// Simple loading fallback
function PageLoader() {
    return (
        <div style={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'hsl(222 47% 5%)',
            color: 'white'
        }}>
            <Loader2 size={40} style={{ animation: 'spin 1s linear infinite', color: 'hsl(187 94% 43%)' }} />
            <style>{`
                @keyframes spin {
                    from { transform: rotate(0deg); }
                    to { transform: rotate(360deg); }
                }
            `}</style>
        </div>
    );
}

ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <ThemeProvider>
            <BrowserRouter>
                <Suspense fallback={<PageLoader />}>
                    <Routes>
                        <Route path="/" element={<App />} />
                        <Route path="/hire-me" element={<HireMe />} />
                        <Route path="/project/:slug" element={<ProjectDetail />} />
                        <Route path="/blog" element={<BlogList />} />
                        <Route path="/blog/:slug" element={<BlogPost />} />
                    </Routes>
                </Suspense>
            </BrowserRouter>
        </ThemeProvider>
    </React.StrictMode>
);
