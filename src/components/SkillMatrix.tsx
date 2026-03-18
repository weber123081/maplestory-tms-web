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
    skillIconMap?: Record<string, string>
}

const HEXA_COSTS = {
    skill: {
        fragments: [100, 30, 35, 40, 45, 50, 55, 60, 65, 200, 80, 90, 100, 110, 120, 130, 140, 150, 160, 350, 170, 180, 190, 200, 210, 220, 230, 240, 250, 500],
        solErda: [5, 1, 1, 1, 2, 2, 2, 3, 3, 10, 3, 3, 4, 4, 4, 4, 4, 4, 5, 15, 5, 5, 5, 5, 5, 6, 6, 6, 7, 20]
    },
    mastery: {
        fragments: [50, 15, 18, 20, 23, 25, 28, 30, 33, 100, 40, 45, 50, 55, 60, 65, 70, 75, 80, 175, 85, 90, 95, 100, 105, 110, 115, 120, 125, 250],
        solErda: [3, 1, 1, 1, 1, 1, 1, 2, 2, 5, 2, 2, 2, 2, 2, 2, 2, 2, 3, 8, 3, 3, 3, 3, 3, 3, 3, 3, 4, 10]
    },
    enhancement: {
        fragments: [75, 23, 27, 30, 34, 38, 42, 45, 49, 150, 60, 68, 75, 83, 90, 98, 105, 113, 120, 263, 128, 135, 143, 150, 158, 165, 173, 180, 188, 375],
        solErda: [4, 1, 1, 1, 2, 2, 2, 3, 3, 8, 3, 3, 3, 3, 3, 3, 3, 3, 4, 12, 4, 4, 4, 4, 4, 5, 5, 5, 6, 15]
    },
    common: {
        fragments: [125, 38, 44, 50, 57, 63, 69, 75, 82, 300, 110, 124, 138, 152, 165, 179, 193, 207, 220, 525, 234, 248, 262, 275, 289, 303, 317, 330, 344, 750],
        solErda: [7, 2, 2, 2, 3, 3, 3, 5, 5, 14, 5, 5, 6, 6, 6, 6, 6, 6, 7, 17, 7, 7, 7, 7, 7, 9, 9, 9, 10, 20]
    }
};

const normalizeSkillName = (name: any) => {
    if (typeof name !== 'string') return '';
    return name
        .replace(/：/g, ':') // Full-width colon to half-width
        .replace(/VI$/g, '') // Remove VI suffix at end
        .replace(/\s/g, '') // Remove whitespace
        .trim();
};

const getSpentResources = (type: string, name: string, level: number) => {
    let costs = HEXA_COSTS.enhancement; // Default
    if (name.includes('靈魂亞努斯')) costs = HEXA_COSTS.common;
    else if (type === '技能核心') costs = HEXA_COSTS.skill;
    else if (type === '精通核心') costs = HEXA_COSTS.mastery;
    else if (type === '公用核心') costs = HEXA_COSTS.common;
    
    let spentFrag = 0;
    let spentErda = 0;
    for (let i = 0; i < level; i++) {
        if (costs.fragments[i]) spentFrag += costs.fragments[i];
        if (costs.solErda[i]) spentErda += costs.solErda[i];
    }
    const maxFrag = costs.fragments.reduce((a, b) => a + b, 0);
    const maxErda = costs.solErda.reduce((a, b) => a + b, 0);
    return { spentFrag, maxFrag, spentErda, maxErda };
};

const SkillMatrix: React.FC<SkillMatrixProps> = ({ vMatrix, hexaMatrix, links, skillIconMap }) => {
    const [activeTab, setActiveTab] = useState<'hexa' | 'vmatrix' | 'link'>('hexa')

    if (!vMatrix && !hexaMatrix && (!links || links.length === 0)) {
        return <div className="glass" style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-secondary)' }}>未發現技能或核心資料</div>;
    }

    // Prepare normalized skill icon map
    const normalizedMap: Record<string, string> = {};
    if (skillIconMap) {
        Object.entries(skillIconMap).forEach(([name, icon]) => {
            normalizedMap[normalizeSkillName(name)] = icon;
        });
    }

    const getIcon = (name: string) => {
        if (!name) return null;
        const normalized = normalizeSkillName(name);
        if (normalizedMap[normalized]) return normalizedMap[normalized];
        
        // Handle slash-separated names (Mastery cores) or comma-separated (Enhancement cores)
        // TMS uses '、' for reinforcement cores
        const parts = name.split(/[/、與]|的強化/);
        for (const part of parts) {
            const trimmed = part.trim();
            if (!trimmed) continue;
            const partNorm = normalizeSkillName(trimmed);
            if (normalizedMap[partNorm]) return normalizedMap[partNorm];
        }
        return null;
    };

    return (
        <div className="glass grid-content-card">
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
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    {/* HEXA Progress Section */}
                    {hexaMatrix?.character_hexa_core_equipment && (() => {
                        const cores = hexaMatrix.character_hexa_core_equipment;
                        const solJanusName = '靈魂亞努斯';
                        
                        let totalSpentFrag = 0;
                        let totalMaxFrag = 0;
                        let totalSpentErda = 0;
                        let totalMaxErda = 0;

                        let totalSpentFragExcl = 0;
                        let totalMaxFragExcl = 0;

                        const hasSolJanus = cores.some(c => c.hexa_core_name.includes(solJanusName));

                        cores.forEach(c => {
                            const { spentFrag, maxFrag, spentErda, maxErda } = getSpentResources(c.hexa_core_type, c.hexa_core_name, c.hexa_core_level);
                            totalSpentFrag += spentFrag;
                            totalMaxFrag += maxFrag;
                            totalSpentErda += spentErda;
                            totalMaxErda += maxErda;

                            if (!c.hexa_core_name.includes(solJanusName)) {
                                totalSpentFragExcl += spentFrag;
                                totalMaxFragExcl += maxFrag;
                            }
                        });

                        // 如果沒有亞努斯，手動將亞努斯的「滿等需求」加入分母，以顯示差異
                        if (!hasSolJanus) {
                            totalMaxFrag += HEXA_COSTS.common.fragments.reduce((a, b) => a + b, 0);
                            totalMaxErda += HEXA_COSTS.common.solErda.reduce((a, b) => a + b, 0);
                        }

                        const totalProgress = (totalSpentFrag / totalMaxFrag) * 100;
                        const totalProgressExcl = totalMaxFragExcl > 0 ? (totalSpentFragExcl / totalMaxFragExcl) * 100 : 0;

                        const remainsFrag = totalMaxFrag - totalSpentFrag;
                        const remainsErda = totalMaxErda - totalSpentErda;

                        return (
                            <div className="glass hexa-progress-container">
                                <div className="hexa-progress-row">
                                    <div className="hexa-progress-item">
                                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '0.4rem' }}>
                                            <span style={{ fontWeight: '600', color: '#e0b0ff' }}>HEXA 碎片總進度</span>
                                            <span style={{ fontWeight: '700' }}>{totalProgress.toFixed(2)}%</span>
                                        </div>
                                        <div style={{ height: '10px', background: 'rgba(0,0,0,0.3)', borderRadius: '5px', overflow: 'hidden', marginBottom: '0.5rem' }}>
                                            <div style={{ width: `${totalProgress}%`, height: '100%', background: 'linear-gradient(90deg, #a020f0, #e0b0ff)', boxShadow: '0 0 10px rgba(160, 32, 240, 0.4)' }} />
                                        </div>
                                        <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.6)', display: 'flex', justifyContent: 'space-between' }}>
                                            <span>累積消耗: {totalSpentFrag.toLocaleString()}</span>
                                            <span style={{ color: 'var(--accent-gold)' }}>還需: {remainsFrag.toLocaleString()} (碎片)</span>
                                        </div>
                                    </div>
                                    
                                    <div className="hexa-progress-item">
                                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '0.4rem' }}>
                                            <span style={{ fontWeight: '600', color: '#66ccff' }}>進度 (不含亞努斯)</span>
                                            <span style={{ fontWeight: '700' }}>{totalProgressExcl.toFixed(2)}%</span>
                                        </div>
                                        <div style={{ height: '10px', background: 'rgba(0,0,0,0.3)', borderRadius: '5px', overflow: 'hidden', marginBottom: '0.5rem' }}>
                                            <div style={{ width: `${totalProgressExcl}%`, height: '100%', background: 'linear-gradient(90deg, #3b82f6, #66ccff)', boxShadow: '0 0 10px rgba(59, 130, 246, 0.4)' }} />
                                        </div>
                                        <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.6)', display: 'flex', justifyContent: 'space-between' }}>
                                            <span>艾爾達總需: {totalMaxErda}</span>
                                            <span style={{ color: '#ffb433' }}>還需: {remainsErda} (靈魂艾爾達)</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })()}

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))', gap: '0.75rem' }}>
                        {hexaMatrix?.character_hexa_core_equipment ? hexaMatrix.character_hexa_core_equipment.map((core, idx) => {
                            if (!core) return null;
                            return (
                                <div key={idx} style={{ 
                                    background: 'rgba(160, 32, 240, 0.05)', 
                                    border: '1px solid rgba(160, 32, 240, 0.2)', 
                                    borderRadius: '0.75rem', 
                                    padding: '1rem', 
                                    textAlign: 'center',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    gap: '0.5rem',
                                    transition: 'transform 0.2s',
                                    cursor: 'default'
                                }} className="stat-card">
                                    <div style={{ 
                                        width: '40px', 
                                        height: '40px', 
                                        background: 'linear-gradient(135deg, #a020f0 0%, #6020a0 100%)',
                                        borderRadius: '8px',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        position: 'relative',
                                        boxShadow: '0 4px 12px rgba(160, 32, 240, 0.3)',
                                        overflow: 'hidden'
                                    }}>
                                        {getIcon(core.hexa_core_name) ? (
                                            <img src={getIcon(core.hexa_core_name)!} alt="" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                                        ) : (
                                            <span style={{ fontSize: '1.2rem', color: '#fff', fontWeight: 'bold' }}>{core.hexa_core_type ? core.hexa_core_type[0] : 'H'}</span>
                                        )}
                                    </div>
                                    <div style={{ 
                                        background: 'rgba(160, 32, 240, 0.2)', 
                                        padding: '0.2rem 0.6rem', 
                                        borderRadius: '1rem', 
                                        fontSize: '0.75rem', 
                                        color: '#e0b0ff',
                                        fontWeight: '700'
                                    }}>
                                        Lv.{core.hexa_core_level}
                                    </div>
                                    <div style={{ fontSize: '0.8rem', fontWeight: '600', height: '2.4rem', display: 'flex', alignItems: 'center', justifyContent: 'center', lineHeight: '1.1', overflow: 'hidden', padding: '0 2px' }}>
                                        <span style={{ display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{core.hexa_core_name}</span>
                                    </div>
                                    <div style={{ fontSize: '0.65rem', color: 'rgba(224, 176, 255, 0.6)' }}>{core.hexa_core_type}</div>
                                </div>
                            );
                        }) : <div style={{ color: 'var(--text-secondary)' }}>無 HEXA 資料</div>}
                    </div>
                </div>
            )}

            {activeTab === 'vmatrix' && (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))', gap: '0.75rem', maxHeight: '500px', overflowY: 'auto', paddingRight: '0.5rem' }}>
                    {vMatrix?.character_v_core_equipment && vMatrix.character_v_core_equipment.length > 0 ? vMatrix.character_v_core_equipment.map((core, idx) => {
                        if (!core) return null;
                        return (
                            <div key={idx} style={{ 
                                background: 'rgba(59, 130, 246, 0.05)', 
                                border: '1px solid rgba(59, 130, 246, 0.2)', 
                                borderRadius: '0.75rem', 
                                padding: '1rem', 
                                textAlign: 'center',
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                gap: '0.5rem',
                                cursor: 'help',
                                transition: 'transform 0.2s'
                            }} title={`${core.v_core_skill_1 || ''}${core.v_core_skill_2 ? '\n' + core.v_core_skill_2 : ''}${core.v_core_skill_3 ? '\n' + core.v_core_skill_3 : ''}`} className="stat-card">
                                <div style={{ 
                                    width: '40px', 
                                    height: '40px', 
                                    background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
                                    borderRadius: '8px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    position: 'relative',
                                    boxShadow: '0 4px 12px rgba(59, 130, 246, 0.3)',
                                    overflow: 'hidden'
                                }}>
                                    {getIcon(core.v_core_name) || getIcon(core.v_core_skill_1) ? (
                                        <img src={getIcon(core.v_core_name) || getIcon(core.v_core_skill_1)!} alt="" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                                    ) : (
                                        <span style={{ fontSize: '1.2rem', color: '#fff', fontWeight: 'bold' }}>{core.v_core_type ? core.v_core_type[0] : 'V'}</span>
                                    )}
                                </div>
                                <div style={{ 
                                    background: 'rgba(59, 130, 246, 0.2)', 
                                    padding: '0.2rem 0.6rem', 
                                    borderRadius: '1rem', 
                                    fontSize: '0.75rem', 
                                    color: '#93c5fd',
                                    fontWeight: '700'
                                }}>
                                    Lv.{core.v_core_level}
                                    {core.slot_level > 0 && <span style={{ opacity: 0.8, marginLeft: '2px' }}>+{core.slot_level}</span>}
                                </div>
                                <div style={{ fontSize: '0.85rem', fontWeight: '600', height: '2.4rem', display: 'flex', alignItems: 'center', justifyContent: 'center', lineHeight: '1.2', width: '100%', overflow: 'hidden' }}>
                                    <span style={{ display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{core.v_core_name}</span>
                                </div>
                                <div style={{ fontSize: '0.65rem', color: 'rgba(147, 197, 253, 0.6)' }}>{core.v_core_type}</div>
                            </div>
                        );
                    }) : <div style={{ color: 'var(--text-secondary)', padding: '2rem' }}>無 V矩陣 資料</div>}
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
