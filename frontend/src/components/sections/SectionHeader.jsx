export default function SectionHeader({ number, title }) {
    return (
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '48px' }}>
            <span className="font-mono" style={{ color: 'var(--accent)' }}>{number}.</span>
            <h2 style={{ fontSize: '2rem', fontWeight: 700 }}>{title}</h2>
            <div style={{ flex: 1, height: '1px', background: 'hsl(222 30% 18%)' }} />
        </div>
    );
}
