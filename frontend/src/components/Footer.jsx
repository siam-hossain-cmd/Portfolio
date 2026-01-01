
export default function Footer() {
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
