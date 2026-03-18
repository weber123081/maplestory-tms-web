import React from 'react'

interface StatsSectionProps {
    stats: {
        stat_name: string
        stat_value: string
    }[]
}

const StatsSection: React.FC<StatsSectionProps> = ({ stats }) => {
    // Helper to find specific stats
    const getStat = (name: string) => stats.find(s => s.stat_name === name)?.stat_value || '0'

    const mainStats = [
        { name: '綜合戰力', value: getStat('戰鬥力'), highlight: true },
        { name: '最終傷害', value: getStat('最終傷害') + '%' },
        { name: 'BOSS 傷害', value: getStat('BOSS怪物傷害') + '%' },
        { name: '無視防禦率', value: getStat('無視防禦率') + '%' },
        { name: '傷害', value: getStat('傷害') + '%' },
        { name: '爆擊傷害', value: getStat('爆擊傷害') + '%' },
    ]

    const detailedStats = [
        { name: 'STR', value: getStat('STR') },
        { name: 'DEX', value: getStat('DEX') },
        { name: 'INT', value: getStat('INT') },
        { name: 'LUK', value: getStat('LUK') },
        { name: 'HP', value: getStat('HP') },
        { name: 'MP', value: getStat('MP') },
    ]

    return (
        <div className="stats-container animate-fade-in">
            <div className="glass" style={{ padding: '2rem', borderRadius: '1.5rem' }}>
                <h3 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span style={{ color: 'var(--accent-primary)' }}>✦</span> 焦點屬性
                </h3>
                <div className="stats-grid">
                    {mainStats.map(stat => (
                        <div key={stat.name} className="stat-card" style={{
                            padding: '1rem',
                            borderRadius: '1rem',
                            background: stat.highlight ? 'rgba(255, 255, 255, 0.05)' : 'transparent',
                            border: stat.highlight ? '1px solid rgba(255, 165, 0, 0.3)' : '1px solid rgba(255, 255, 255, 0.1)'
                        }}>
                            <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: '0.25rem' }}>{stat.name}</div>
                            <div style={{
                                fontSize: stat.highlight ? '1.5rem' : '1.25rem',
                                fontWeight: 'bold',
                                color: stat.highlight ? 'var(--accent-primary)' : 'var(--text-primary)'
                            }}>
                                {stat.value}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <div className="glass" style={{ padding: '2rem', borderRadius: '1.5rem' }}>
                <h3 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span style={{ color: 'var(--accent-primary)' }}>✦</span> 詳細屬性
                </h3>
                <div className="stats-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))' }}>
                    {detailedStats.map(stat => (
                        <div key={stat.name} style={{ display: 'flex', justifyContent: 'space-between', padding: '0.5rem 0', borderBottom: '1px solid rgba(255, 255, 255, 0.05)' }}>
                            <span style={{ color: 'var(--text-secondary)' }}>{stat.name}</span>
                            <span style={{ fontWeight: '500' }}>{stat.value}</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}

export default StatsSection
