import React from 'react'

interface CharacterCardProps {
    data: {
        character_name: string
        character_level: number
        character_job: string
        world_name: string
        character_image: string
        stats?: {
            stat_name: string
            stat_value: string
        }[]
    }
}

const CharacterCard: React.FC<CharacterCardProps> = ({ data }) => {
    return (
        <div className="glass character-card">
            <div className="character-image-wrapper">
                <img
                    src={data.character_image}
                    alt={data.character_name}
                    style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                />
            </div>

            <div>
                <h2 style={{ fontSize: '2rem', marginBottom: '0.25rem' }}>{data.character_name}</h2>
                <p style={{ color: 'var(--accent-gold)', fontWeight: '700', fontSize: '1.2rem' }}>
                    Lv. {data.character_level} | {data.character_job}
                </p>
                <p style={{ color: 'var(--text-secondary)', marginTop: '0.5rem' }}>{data.world_name}</p>
            </div>

            <div style={{
                width: '100%',
                padding: '1.5rem',
                borderRadius: '1.5rem',
                background: 'rgba(255, 255, 255, 0.03)',
                border: '1px solid var(--glass-border)'
            }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ color: 'var(--text-secondary)' }}>綜合戰力</span>
                    <span style={{ color: 'var(--maple-orange)', fontSize: '1.5rem', fontWeight: '800' }}>
                        {data.stats?.find(s => s.stat_name === '戰鬥力')?.stat_value || '0'}
                    </span>
                </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', width: '100%' }}>
                {/* Additional character stats could go here */}
            </div>
        </div>
    )
}

export default CharacterCard
