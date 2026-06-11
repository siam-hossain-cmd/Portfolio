import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

export default function Modal({ isOpen, onClose, title, children, maxWidth = '600px' }) {
    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={onClose}
                    style={{
                        position: 'fixed',
                        inset: 0,
                        background: 'rgba(0,0,0,0.7)',
                        backdropFilter: 'blur(4px)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        zIndex: 100,
                        padding: '20px'
                    }}
                >
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                        onClick={e => e.stopPropagation()}
                        style={{
                            width: '100%',
                            maxWidth,
                            maxHeight: '90vh',
                            background: 'hsl(222 47% 8%)',
                            border: '1px solid hsl(222 30% 18%)',
                            borderRadius: '20px',
                            overflow: 'hidden',
                            display: 'flex',
                            flexDirection: 'column'
                        }}
                    >
                        {/* Header */}
                        <div style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            padding: '20px 24px',
                            borderBottom: '1px solid hsl(222 30% 18%)'
                        }}>
                            <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'white' }}>{title}</h2>
                            <motion.button
                                onClick={onClose}
                                whileHover={{ scale: 1.1, rotate: 90 }}
                                whileTap={{ scale: 0.9 }}
                                style={{
                                    background: 'hsl(222 30% 15%)',
                                    border: '1px solid hsl(222 30% 22%)',
                                    borderRadius: '10px',
                                    padding: '8px',
                                    cursor: 'pointer',
                                    color: 'hsl(215 20% 65%)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center'
                                }}
                            >
                                <X size={18} />
                            </motion.button>
                        </div>
                        {/* Body */}
                        <div style={{
                            padding: '24px',
                            overflowY: 'auto',
                            flex: 1
                        }}>
                            {children}
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}

// Reusable form field styles
export const fieldStyle = {
    width: '100%',
    padding: '12px 16px',
    background: 'hsl(222 47% 12%)',
    border: '1px solid hsl(222 30% 22%)',
    borderRadius: '10px',
    color: 'white',
    fontSize: '0.925rem',
    outline: 'none',
    fontFamily: 'inherit',
    transition: 'border-color 0.2s'
};

export const labelStyle = {
    display: 'block',
    fontSize: '0.825rem',
    fontWeight: 600,
    color: 'hsl(215 20% 65%)',
    marginBottom: '6px',
    textTransform: 'uppercase',
    letterSpacing: '0.5px'
};

export const selectStyle = {
    ...fieldStyle,
    appearance: 'none',
    cursor: 'pointer'
};

export const buttonPrimaryStyle = {
    padding: '14px 28px',
    background: 'hsl(187 94% 43%)',
    color: 'hsl(222 47% 5%)',
    border: 'none',
    borderRadius: '10px',
    fontWeight: 700,
    fontSize: '0.95rem',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    boxShadow: '0 4px 20px hsl(187 94% 43% / 0.3)',
    fontFamily: 'inherit'
};

export const buttonSecondaryStyle = {
    padding: '14px 28px',
    background: 'transparent',
    color: 'hsl(215 20% 65%)',
    border: '1px solid hsl(222 30% 22%)',
    borderRadius: '10px',
    fontWeight: 600,
    fontSize: '0.95rem',
    cursor: 'pointer',
    fontFamily: 'inherit'
};

export const dangerButtonStyle = {
    padding: '8px 16px',
    background: 'hsl(0 84% 60% / 0.15)',
    color: 'hsl(0 84% 70%)',
    border: '1px solid hsl(0 84% 60% / 0.3)',
    borderRadius: '8px',
    fontWeight: 600,
    fontSize: '0.8rem',
    cursor: 'pointer',
    fontFamily: 'inherit'
};
