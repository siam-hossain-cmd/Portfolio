import React, { lazy, Suspense } from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import ToastProvider from './components/ui/Toast';
import { Loader2 } from 'lucide-react';
import './index.css';

// Lazy load routing targets
const AdminLogin = lazy(() => import('./pages/AdminLogin'));
const Dashboard = lazy(() => import('./pages/Dashboard'));

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
            <ToastProvider>
                <BrowserRouter>
                    <Suspense fallback={<PageLoader />}>
                        <Routes>
                            <Route path="/" element={<AdminLogin />} />
                            <Route path="/admin" element={<AdminLogin />} />
                            <Route path="/admin/login" element={<AdminLogin />} />
                            <Route path="/admin/dashboard" element={<Dashboard />} />
                        </Routes>
                    </Suspense>
                </BrowserRouter>
            </ToastProvider>
        </ThemeProvider>
    </React.StrictMode>
);
