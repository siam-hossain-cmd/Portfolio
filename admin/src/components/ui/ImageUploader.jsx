import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, Link, X, Image as ImageIcon, AlertTriangle, CheckCircle } from 'lucide-react';
import axiosInstance from '../../config/axiosInstance';

export default function ImageUploader({ onUpload, onChange, folder = 'portfolio/uploads', currentImage = '', value = '', label = '' }) {
    const finalImage = currentImage || value;
    const [mode, setMode] = useState('file'); // 'file' or 'url' — default to file since storage works
    const [urlInput, setUrlInput] = useState(finalImage || '');
    const [dragging, setDragging] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const fileRef = useRef(null);

    // Sync input when image values change
    useEffect(() => {
        if (finalImage) setUrlInput(finalImage);
    }, [finalImage]);

    const handleCallback = (url) => {
        if (onUpload) onUpload(url);
        if (onChange) onChange(url);
    };

    const handleUrlSubmit = () => {
        if (!urlInput.trim()) return setError('Please enter an image URL');
        if (!/^https?:\/\/.+/.test(urlInput.trim())) return setError('URL must start with http:// or https://');
        setError('');
        setSuccess('Image URL set!');
        handleCallback(urlInput.trim());
        setTimeout(() => setSuccess(''), 2000);
    };

    const handleFile = async (file) => {
        if (!file) return;
        setError('');
        setUploading(true);
        const formData = new FormData();
        formData.append('file', file);
        formData.append('folder', folder);
        try {
            const res = await axiosInstance.post('/upload', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            handleCallback(res.data.url);
            setSuccess('Uploaded!');
            setTimeout(() => setSuccess(''), 2000);
        } catch (err) {
            if (err.response?.data?.code === 'BILLING_REQUIRED') {
                setError('Firebase Storage needs Blaze plan. Use URL mode instead — paste a link from Imgur, Cloudinary, or any image host.');
                setMode('url');
            } else {
                setError(err.response?.data?.message || 'Upload failed');
            }
        } finally { setUploading(false); }
    };

    const handleDrop = (e) => {
        e.preventDefault();
        setDragging(false);
        const file = e.dataTransfer.files?.[0];
        if (file) handleFile(file);
    };

    const inputStyle = {
        width: '100%', padding: '10px 14px', background: 'hsl(222 47% 6%)',
        border: '1px solid hsl(222 30% 22%)', borderRadius: '10px',
        color: 'white', fontFamily: 'inherit', fontSize: '0.875rem', outline: 'none', boxSizing: 'border-box'
    };

    const labelStyle = {
        display: 'block', fontSize: '0.825rem', fontWeight: 600,
        color: 'hsl(215 20% 65%)', marginBottom: '6px',
        textTransform: 'uppercase', letterSpacing: '0.5px'
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {label && <label style={labelStyle}>{label}</label>}
            
            {/* Mode Switcher */}
            <div style={{ display: 'flex', gap: '8px' }}>
                {['file', 'url'].map(m => (
                    <button key={m} onClick={() => { setMode(m); setError(''); }}
                        style={{
                            padding: '6px 14px', borderRadius: '8px', border: 'none', cursor: 'pointer',
                            background: mode === m ? 'hsl(187 94% 43%)' : 'hsl(222 30% 14%)',
                            color: mode === m ? 'hsl(222 47% 5%)' : 'hsl(215 20% 55%)',
                            fontFamily: 'inherit', fontSize: '0.8rem', fontWeight: 600,
                            display: 'flex', alignItems: 'center', gap: '6px'
                        }}>
                        {m === 'url' ? <Link size={14} /> : <Upload size={14} />}
                        {m === 'url' ? 'URL' : 'Upload File'}
                    </button>
                ))}
            </div>

            {/* URL Mode */}
            {mode === 'url' && (
                <div style={{ display: 'flex', gap: '8px' }}>
                    <input
                        value={urlInput}
                        onChange={e => { setUrlInput(e.target.value); setError(''); }}
                        placeholder="https://example.com/image.jpg"
                        style={{ ...inputStyle, flex: 1 }}
                        onKeyDown={e => e.key === 'Enter' && handleUrlSubmit()}
                    />
                    <motion.button onClick={handleUrlSubmit} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                        style={{ padding: '10px 18px', background: 'hsl(187 94% 43%)', border: 'none', borderRadius: '10px', color: 'hsl(222 47% 5%)', fontWeight: 700, cursor: 'pointer', fontSize: '0.875rem', whiteSpace: 'nowrap' }}>
                        Set URL
                    </motion.button>
                </div>
            )}

            {/* File Upload Mode */}
            {mode === 'file' && (
                <div
                    onDragOver={e => { e.preventDefault(); setDragging(true); }}
                    onDragLeave={() => setDragging(false)}
                    onDrop={handleDrop}
                    onClick={() => fileRef.current?.click()}
                    style={{
                        border: `2px dashed ${dragging ? 'hsl(187 94% 43%)' : 'hsl(222 30% 25%)'}`,
                        borderRadius: '12px', padding: '28px', textAlign: 'center',
                        cursor: 'pointer', background: dragging ? 'hsl(187 94% 43% / 0.05)' : 'transparent',
                        transition: 'all 0.2s'
                    }}>
                    <input ref={fileRef} type="file" accept="image/*" style={{ display: 'none' }}
                        onChange={e => handleFile(e.target.files?.[0])} />
                    {uploading ? (
                        <p style={{ color: 'hsl(187 94% 43%)', fontSize: '0.875rem' }}>Uploading...</p>
                    ) : (
                        <>
                            <ImageIcon size={32} style={{ color: 'hsl(215 20% 40%)', marginBottom: '8px' }} />
                            <p style={{ color: 'hsl(215 20% 55%)', fontSize: '0.875rem', margin: 0 }}>
                                Drop image here or click to browse
                            </p>
                            <p style={{ color: 'hsl(215 20% 40%)', fontSize: '0.75rem', margin: '4px 0 0' }}>
                                PNG, JPG, WebP, GIF, SVG up to 10MB
                            </p>
                        </>
                    )}
                </div>
            )}

            {/* Error */}
            <AnimatePresence>
                {error && (
                    <motion.div initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                        style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', padding: '10px 14px', background: 'hsl(0 84% 60% / 0.1)', border: '1px solid hsl(0 84% 60% / 0.3)', borderRadius: '8px', color: 'hsl(0 84% 70%)', fontSize: '0.8rem', lineHeight: 1.5 }}>
                        <AlertTriangle size={16} style={{ flexShrink: 0, marginTop: '1px' }} />
                        {error}
                    </motion.div>
                )}
                {success && (
                    <motion.div initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                        style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 14px', background: 'hsl(142 76% 36% / 0.1)', border: '1px solid hsl(142 76% 36% / 0.3)', borderRadius: '8px', color: 'hsl(142 76% 55%)', fontSize: '0.8rem' }}>
                        <CheckCircle size={16} /> {success}
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Preview */}
            {(urlInput || finalImage) && (
                <div style={{ position: 'relative', display: 'inline-block' }}>
                    <img src={urlInput || finalImage} alt="Preview"
                        style={{ width: '100%', maxHeight: '180px', objectFit: 'cover', borderRadius: '10px', border: '1px solid hsl(222 30% 22%)' }}
                        onError={e => { e.target.style.display = 'none'; }} />
                    <button onClick={() => { setUrlInput(''); handleCallback(''); }}
                        style={{ position: 'absolute', top: '8px', right: '8px', background: 'hsl(222 47% 8% / 0.9)', border: '1px solid hsl(222 30% 25%)', borderRadius: '50%', width: '28px', height: '28px', color: 'white', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <X size={14} />
                    </button>
                </div>
            )}

            {/* Tip for URL mode */}
            {mode === 'url' && (
                <p style={{ color: 'hsl(215 20% 40%)', fontSize: '0.72rem', margin: 0 }}>
                    💡 Free image hosts: <a href="https://imgur.com" target="_blank" rel="noreferrer" style={{ color: 'hsl(187 94% 43%)' }}>Imgur</a>, <a href="https://cloudinary.com" target="_blank" rel="noreferrer" style={{ color: 'hsl(187 94% 43%)' }}>Cloudinary</a>, or <a href="https://imgbb.com" target="_blank" rel="noreferrer" style={{ color: 'hsl(187 94% 43%)' }}>ImgBB</a>
                </p>
            )}
        </div>
    );
}
