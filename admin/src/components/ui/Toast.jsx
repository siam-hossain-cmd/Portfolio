import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, XCircle, AlertCircle, Info, X } from 'lucide-react';

const iconMap = {
    success: CheckCircle,
    error: XCircle,
    warning: AlertCircle,
    info: Info
};

const colorMap = {
    success: { bg: 'hsl(142 76% 36% / 0.15)', border: 'hsl(142 76% 36% / 0.3)', text: 'hsl(142 76% 50%)', icon: 'hsl(142 76% 50%)' },
    error: { bg: 'hsl(0 84% 60% / 0.15)', border: 'hsl(0 84% 60% / 0.3)', text: 'hsl(0 84% 70%)', icon: 'hsl(0 84% 65%)' },
    warning: { bg: 'hsl(38 92% 50% / 0.15)', border: 'hsl(38 92% 50% / 0.3)', text: 'hsl(38 92% 60%)', icon: 'hsl(38 92% 55%)' },
    info: { bg: 'hsl(187 94% 43% / 0.15)', border: 'hsl(187 94% 43% / 0.3)', text: 'hsl(187 94% 60%)', icon: 'hsl(187 94% 50%)' }
};

let toastId = 0;
let globalAddToast = null;

// Global function to show toasts from anywhere
export function showToast(message, type = 'info', duration = 4000) {
    if (globalAddToast) {
        globalAddToast({ id: ++toastId, message, type, duration });
    }
}

export default function ToastProvider({ children }) {
    const [toasts, setToasts] = useState([]);

    useEffect(() => {
        globalAddToast = (toast) => {
            setToasts(prev => [...prev, toast]);
        };
        return () => { globalAddToast = null; };
    }, []);

    const removeToast = (id) => {
        setToasts(prev => prev.filter(t => t.id !== id));
    };

    return (
        <>
            {children}
            <div style={{
                position: 'fixed',
                top: '20px',
                right: '20px',
                zIndex: 200,
                display: 'flex',
                flexDirection: 'column',
                gap: '8px',
                maxWidth: '400px'
            }}>
                <AnimatePresence>
                    {toasts.map(toast => (
                        <ToastItem key={toast.id} toast={toast} onRemove={removeToast} />
                    ))}
                </AnimatePresence>
            </div>
        </>
    );
}

function ToastItem({ toast, onRemove }) {
    const colors = colorMap[toast.type] || colorMap.info;
    const Icon = iconMap[toast.type] || Info;

    useEffect(() => {
        const timer = setTimeout(() => onRemove(toast.id), toast.duration || 4000);
        return () => clearTimeout(timer);
    }, [toast.id, toast.duration, onRemove]);

    return (
        <motion.div
            initial={{ opacity: 0, x: 60, scale: 0.9 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 60, scale: 0.9 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            style={{
                padding: '14px 18px',
                background: colors.bg,
                border: `1px solid ${colors.border}`,
                borderRadius: '12px',
                color: colors.text,
                fontSize: '0.875rem',
                fontWeight: 500,
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                backdropFilter: 'blur(10px)',
                boxShadow: '0 8px 32px rgba(0,0,0,0.3)'
            }}
        >
            <Icon size={18} style={{ color: colors.icon, flexShrink: 0 }} />
            <span style={{ flex: 1, lineHeight: 1.4 }}>{toast.message}</span>
            <button
                onClick={() => onRemove(toast.id)}
                style={{
                    background: 'none',
                    border: 'none',
                    color: colors.text,
                    cursor: 'pointer',
                    padding: '2px',
                    display: 'flex',
                    opacity: 0.6
                }}
            >
                <X size={14} />
            </button>
        </motion.div>
    );
}
