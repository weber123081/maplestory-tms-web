import React from 'react'

interface AdvancedStatsProps {
    ability?: {
        ability_info?: {
            ability_no: string
            ability_grade: string
            ability_value: string
        }[]
    }
    hyperStat?: {
        hyper_stat_preset_1?: {
            stat_type: string
            stat_point: number
            stat_level: number
            stat_increase: string
        }[]
    }
    setEffect?: {
        set_effect?: {
            set_name: string
            total_set_count: number
            set_effect_info: {
                set_count: number
                set_option: string
            }[]
        }[]
    }
}

const AdvancedStats: React.FC<AdvancedStatsProps> = ({ ability, hyperStat, setEffect }) => {
    // Helper to get grade color
    const getGradeColor = (grade: string) => {
        switch(grade) {
            case '傳說': return '#a6ff4d'
            case '罕見': return '#ffb347'
            case '稀有': return '#4da6ff'
            default: return 'var(--text-primary)'
        }
    }

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', width: '100%' }}>
            {/* Inner Ability */}
            <div className="glass" style={{ padding: '1.5rem', borderRadius: '1rem' }}>
                <h3 style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span style={{ color: 'var(--accent-primary)' }}>✦</span> 內在潛能
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    {ability?.ability_info ? ability.ability_info.map((ab, idx) => (
                        <div key={idx} style={{ 
                            padding: '0.75rem', 
                            background: 'rgba(255, 255, 255, 0.03)', 
                            borderRadius: '0.5rem',
                            borderLeft: `4px solid ${getGradeColor(ab.ability_grade)}`,
                            fontSize: '0.9rem'
                        }}>
                            {ab.ability_value}
                        </div>
                    )) : <div style={{ color: 'var(--text-secondary)' }}>無資料</div>}
                </div>
            </div>

            {/* Hyper Stats */}
            <div className="glass" style={{ padding: '1.5rem', borderRadius: '1rem' }}>
                <h3 style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span style={{ color: 'var(--accent-primary)' }}>✦</span> 極限屬性 (Hyper Stats)
                </h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: '0.5rem' }}>
                    {hyperStat?.hyper_stat_preset_1?.filter(s => s.stat_level > 0).map((stat, idx) => (
                        <div key={idx} style={{ 
                            padding: '0.5rem', 
                            background: 'rgba(255, 255, 255, 0.05)', 
                            borderRadius: '0.5rem',
                            border: '1px solid rgba(255,255,255,0.05)'
                        }}>
                            <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{stat.stat_type}</div>
                            <div style={{ fontSize: '1rem', fontWeight: 'bold' }}>Lv.{stat.stat_level}</div>
                            <div style={{ fontSize: '0.75rem', color: '#a6ff4d', marginTop: '0.25rem' }}>{stat.stat_increase}</div>
                        </div>
                    )) || <div style={{ color: 'var(--text-secondary)' }}>無資料</div>}
                </div>
            </div>

            {/* Set Effects */}
            <div className="glass" style={{ padding: '1.5rem', borderRadius: '1rem' }}>
                <h3 style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span style={{ color: 'var(--accent-primary)' }}>✦</span> 套裝效果
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxHeight: '300px', overflowY: 'auto', paddingRight: '0.5rem' }}>
                    {setEffect?.set_effect?.filter(s => s.total_set_count > 0).map((set, idx) => (
                        <div key={idx} style={{
                            padding: '1rem',
                            background: 'rgba(255, 255, 255, 0.02)',
                            borderRadius: '0.5rem',
                            border: '1px solid rgba(255,255,255,0.05)'
                        }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                                <span style={{ fontWeight: 'bold', color: 'var(--accent-gold)' }}>{set.set_name}</span>
                                <span style={{ color: 'var(--text-secondary)' }}>{set.total_set_count} 套件</span>
                            </div>
                            <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                                {set.set_effect_info.filter(info => info.set_count <= set.total_set_count).map((info, i) => (
                                    <div key={i}>
                                        <span style={{ color: '#a6ff4d' }}>{info.set_count}套: </span>
                                        {info.set_option}
                                    </div>
                                ))}
                            </div>
                        </div>
                    )) || <div style={{ color: 'var(--text-secondary)' }}>無資料</div>}
                </div>
            </div>
        </div>
    )
}

export default AdvancedStats
