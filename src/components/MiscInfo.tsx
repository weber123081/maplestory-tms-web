import React from 'react'

interface MiscInfoProps {
    union?: {
        union_level: number
        union_grade: string
        union_artifact_level: number
    }
    dojo?: {
        dojang_best_floor: number
        dojang_best_time: number
    }
    pets?: {
        pet_1_name: string | null
        pet_2_name: string | null
        pet_3_name: string | null
        pet_1_appearance_icon: string | null
        pet_2_appearance_icon: string | null
        pet_3_appearance_icon: string | null
    }
}

const MiscInfo: React.FC<MiscInfoProps> = ({ union, dojo, pets }) => {
    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', width: '100%', maxWidth: '350px' }}>
            {/* Union */}
            <div className="glass" style={{ padding: '1.5rem', borderRadius: '1rem' }}>
                <h3 style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span style={{ color: 'var(--accent-primary)' }}>✦</span> 聯盟戰地
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.5rem 0', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                        <span style={{ color: 'var(--text-secondary)' }}>聯盟等級</span>
                        <span style={{ fontWeight: 'bold', fontSize: '1.1rem' }}>{union?.union_level || 0}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.5rem 0', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                        <span style={{ color: 'var(--text-secondary)' }}>聯盟階級</span>
                        <span style={{ color: 'var(--accent-gold)' }}>{union?.union_grade || '無'}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.5rem 0' }}>
                        <span style={{ color: 'var(--text-secondary)' }}>神器等級</span>
                        <span style={{ fontWeight: 'bold' }}>{union?.union_artifact_level || 0}</span>
                    </div>
                </div>
            </div>

            {/* Pets */}
            <div className="glass" style={{ padding: '1.5rem', borderRadius: '1rem' }}>
                <h3 style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span style={{ color: 'var(--accent-primary)' }}>✦</span> 寵物資訊
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    {[1, 2, 3].map((num) => {
                        const petName = (pets as any)?.[`pet_${num}_name`]
                        const petIcon = (pets as any)?.[`pet_${num}_appearance_icon`]
                        
                        return (
                            <div key={num} style={{ 
                                display: 'flex', 
                                alignItems: 'center', 
                                gap: '1rem',
                                padding: '0.5rem',
                                background: 'rgba(255,255,255,0.03)',
                                borderRadius: '0.5rem'
                            }}>
                                <div style={{ 
                                    width: '40px', 
                                    height: '40px', 
                                    background: 'rgba(0,0,0,0.3)', 
                                    borderRadius: '0.25rem',
                                    display: 'flex',
                                    justifyContent: 'center',
                                    alignItems: 'center'
                                }}>
                                    {petIcon ? <img src={petIcon} alt={petName} style={{ maxWidth: '100%', maxHeight: '100%' }} /> : <span style={{ color: 'var(--text-secondary)', fontSize: '0.75rem' }}>空</span>}
                                </div>
                                <div style={{ fontWeight: '500' }}>{petName || '無寵物'}</div>
                            </div>
                        )
                    })}
                </div>
            </div>

            {/* Dojo */}
            <div className="glass" style={{ padding: '1.5rem', borderRadius: '1rem' }}>
                <h3 style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span style={{ color: 'var(--accent-primary)' }}>✦</span> 武陵道場
                </h3>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ color: 'var(--text-secondary)' }}>最高層數</span>
                    <span style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#ff4d4d' }}>{dojo?.dojang_best_floor ? `${dojo.dojang_best_floor} F` : '無紀錄'}</span>
                </div>
                {dojo?.dojang_best_time && dojo.dojang_best_time > 0 && (
                    <div style={{ textAlign: 'right', fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '0.25rem' }}>
                        通關時間: {Math.floor(dojo.dojang_best_time / 60)}分 {dojo.dojang_best_time % 60}秒
                    </div>
                )}
            </div>
        </div>
    )
}

export default MiscInfo
