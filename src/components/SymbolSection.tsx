import React from 'react'

interface SymbolSectionProps {
    symbols: {
        symbol_name: string
        symbol_icon: string
        symbol_level: number
        symbol_force: string
    }[]
}

const SymbolSection: React.FC<SymbolSectionProps> = ({ symbols }) => {
    return (
        <div className="glass" style={{ padding: '2rem', borderRadius: '1.5rem', width: '100%', maxWidth: '800px' }}>
            <h3 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span style={{ color: 'var(--accent-primary)' }}>✦</span> 符文 & 力量
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '1rem' }}>
                {symbols.map((symbol, idx) => (
                    <div key={idx} style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '1rem',
                        padding: '1rem',
                        borderRadius: '1rem',
                        background: 'rgba(255, 255, 255, 0.03)',
                        border: '1px solid rgba(255, 255, 255, 0.05)'
                    }}>
                        <img src={symbol.symbol_icon} alt={symbol.symbol_name} style={{ width: '40px', height: '40px' }} />
                        <div>
                            <div style={{ fontSize: '0.875rem', fontWeight: '500' }}>{symbol.symbol_name.replace('秘法符文：', '').replace('真實符文：', '')}</div>
                            <div style={{ fontSize: '0.75rem', color: 'var(--accent-primary)' }}>Lv.{symbol.symbol_level} | {symbol.symbol_force}</div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default SymbolSection
