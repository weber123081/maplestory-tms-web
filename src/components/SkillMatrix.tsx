import React, { useState } from 'react'

interface SkillMatrixProps {
    vMatrix?: {
        character_v_core_equipment?: {
            slot_id: string
            slot_level: number
            v_core_name: string
            v_core_type: string
            v_core_level: number
            v_core_skill_1: string
            v_core_skill_2: string
            v_core_skill_3: string
        }[]
    }
    hexaMatrix?: {
        character_hexa_core_equipment?: {
            hexa_core_name: string
            hexa_core_level: number
            hexa_core_type: string
        }[]
    }
    links?: {
        skill_name: string
        skill_level: number
        skill_icon: string
    }[]
}

const SkillMatrix: React.FC<SkillMatrixProps> = ({ vMatrix, hexaMatrix, links }) => {
    const [activeTab, setActiveTab] = useState<'hexa' | 'vmatrix' | 'link'>('hexa')

    return (
        <div className="glass" style={{ padding: '1.5rem', borderRadius: '1.5rem', width: '100%', display: 'flex', flexDirection: 'column' }}>
            <div className="equipment-tabs" style={{ marginBottom: '1.5rem' }}>
                <button className={`equipment-tab ${activeTab === 'hexa' ? 'active' : ''}`} onClick={() => setActiveTab('hexa')}>
                    核心預設 (HEXA)
                </button>
                <button className={`equipment-tab ${activeTab === 'vmatrix' ? 'active' : ''}`} onClick={() => setActiveTab('vmatrix')}>
                    V矩陣
                </button>
                <button className={`equipment-tab ${activeTab === 'link' ? 'active' : ''}`} onClick={() => setActiveTab('link')}>
                    傳授技能 (Link Skills)
                </button>
            </div>

            {activeTab === 'hexa' && (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))', gap: '0.75rem' }}>
                    {hexaMatrix?.character_hexa_core_equipment ? hexaMatrix.character_hexa_core_equipment.map((core, idx) => (
                        <div key={idx} style={{ 
                            background: 'rgba(255, 255, 255, 0.05)', 
                            border: '1px solid rgba(160, 32, 240, 0.3)', 
                            borderRadius: '0.5rem', 
                            padding: '0.75rem', 
                            textAlign: 'center',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            gap: '0.5rem'
                        }}>
                            <div style={{ 
                                background: 'rgba(160, 32, 240, 0.2)', 
                                padding: '0.25rem 0.5rem', 
                                borderRadius: '0.25rem', 
                                fontSize: '0.75rem', 
                                color: '#e0b0ff' 
                            }}>
                                Lv.{core.hexa_core_level}
                            </div>
                            <div style={{ fontSize: '0.85rem', fontWeight: '600' }}>{core.hexa_core_name}</div>
                            <div style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>{core.hexa_core_type}</div>
                        </div>
                    )) : <div style={{ color: 'var(--text-secondary)' }}>無 HEXA 資料</div>}
                </div>
            )}

            {activeTab === 'vmatrix' && (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))', gap: '0.75rem', maxHeight: '400px', overflowY: 'auto' }}>
                    {vMatrix?.character_v_core_equipment ? vMatrix.character_v_core_equipment.map((core, idx) => (
                        <div key={idx} style={{ 
                            background: 'rgba(255, 255, 255, 0.05)', 
                            border: '1px solid rgba(59, 130, 246, 0.3)', 
                            borderRadius: '0.5rem', 
                            padding: '0.75rem', 
                            textAlign: 'center',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            gap: '0.5rem',
                            cursor: 'help'
                        }} title={`${core.v_core_skill_1}\n${core.v_core_skill_2}\n${core.v_core_skill_3}`}>
                            <div style={{ 
                                background: 'rgba(59, 130, 246, 0.2)', 
                                padding: '0.25rem 0.5rem', 
                                borderRadius: '0.25rem', 
                                fontSize: '0.75rem', 
                                color: '#93c5fd' 
                            }}>
                                Lv.{core.v_core_level} (槽 +{core.slot_level})
                            </div>
                            <div style={{ fontSize: '0.85rem', fontWeight: '600', whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden', width: '100%' }}>
                                {core.v_core_name}
                            </div>
                            <div style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>{core.v_core_type}</div>
                        </div>
                    )) : <div style={{ color: 'var(--text-secondary)' }}>無 V矩陣 資料</div>}
                </div>
            )}

            {activeTab === 'link' && (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '0.75rem' }}>
                    {links && links.length > 0 ? links.map((link, idx) => (
                        <div key={idx} style={{ 
                            background: 'rgba(255, 255, 255, 0.05)', 
                            border: '1px solid rgba(255, 255, 255, 0.1)', 
                            borderRadius: '0.5rem', 
                            padding: '0.75rem', 
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.75rem'
                        }}>
                            <img src={link.skill_icon} alt={link.skill_name} style={{ width: '32px', height: '32px', borderRadius: '4px' }} />
                            <div>
                                <div style={{ fontSize: '0.9rem', fontWeight: '600' }}>{link.skill_name}</div>
                                <div style={{ fontSize: '0.75rem', color: 'var(--accent-gold)' }}>Lv.{link.skill_level}</div>
                            </div>
                        </div>
                    )) : <div style={{ color: 'var(--text-secondary)' }}>無傳授技能資料</div>}
                </div>
            )}
        </div>
    )
}

export default SkillMatrix
