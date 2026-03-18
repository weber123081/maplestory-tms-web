import React from 'react';
import { createPortal } from 'react-dom';

interface EquipmentTooltipProps {
    item: any;
    x: number;
    y: number;
}

const getGradeColor = (grade: string | null | undefined) => {
    switch(grade) {
        case '傳說': return '#b2f950'; // Legendary (Green)
        case '罕見': return '#ffcc00'; // Unique (Yellow)
        case '稀有': return '#9966ff'; // Epic (Purple)
        case '特殊': return '#66ccff'; // Rare (Blue)
        default: return '#ffffff'; // Normal/None
    }
};

const StatLine = ({ label, total, base, add, scroll, star, ex }: { label: string, total: string | number, base?: string | number, add?: string | number, scroll?: string | number, star?: string | number, ex?: string | number }) => {
    if (!total || total === '0' || total === 0) return null;
    
    const hasAdd = add && add !== '0' && add !== 0;
    const hasScroll = scroll && scroll !== '0' && scroll !== 0;
    const hasStar = star && star !== '0' && star !== 0;
    const hasEx = ex && ex !== '0' && ex !== 0;
    
    if (!hasAdd && !hasScroll && !hasStar && !hasEx) {
        return <div className="tooltip-stat"><span>{label}</span> <span>+{total}</span></div>;
    }

    return (
        <div className="tooltip-stat complex">
            <span>{label}</span> 
            <div className="tooltip-stat-breakdown">
                <span className="tooltip-stat-total">+{total}</span>
                <span className="tooltip-stat-details">
                    ({base || 0} 
                    {hasAdd ? <span className="stat-add"> +{add}</span> : ''}
                    {hasScroll ? <span className="stat-scroll"> +{scroll}</span> : ''}
                    {hasStar ? <span className="stat-scroll" style={{ color: '#ffcc00' }}> +{star}</span> : ''}
                    {hasEx ? <span className="stat-scroll" style={{ color: '#ff6666' }}> +{ex}</span> : ''})
                </span>
            </div>
        </div>
    );
};

const EquipmentTooltip: React.FC<EquipmentTooltipProps> = ({ item, x, y }) => {
    if (!item) return null;

    const gradeColor = getGradeColor(item.potential_option_grade);
    const borderColor = item.potential_option_grade ? gradeColor : 'rgba(255,255,255,0.2)';

    return createPortal(
        <div 
            className="equipment-tooltip" 
            style={{ 
                left: x, 
                top: y,
                borderColor: borderColor 
            }}
        >
            {/* Header section */}
            <div className="tooltip-header">
                {item.starforce && item.starforce !== '0' && (
                    <div className="tooltip-stars">
                        {'★'.repeat(Math.min(15, parseInt(item.starforce)))}
                        {parseInt(item.starforce) > 15 ? `★ ${item.starforce}` : ''}
                    </div>
                )}
                <div className="tooltip-name" style={{ color: gradeColor }}>
                    {item.item_name}
                    {item.scroll_upgrade && item.scroll_upgrade !== '0' && ` (+${item.scroll_upgrade})`}
                </div>
                {item.special_ring_level > 0 && (
                    <div className="tooltip-subtitle" style={{ color: '#ffcc00' }}>[等級 : {item.special_ring_level}]</div>
                )}
                <div className="tooltip-subtitle">{item.item_equipment_part}</div>
            </div>

            <div className="tooltip-divider" />

            {/* Icon section */}
            <div className="tooltip-icon-wrapper">
                <div className="tooltip-icon-bg">
                    <img src={item.item_icon} alt={item.item_name} />
                </div>
            </div>

            <div className="tooltip-divider" />

            {/* Stats section */}
            <div className="tooltip-stats">
                <div className="tooltip-section-title">裝備能力</div>
                {item.item_total_option && item.item_base_option && (
                    <>
                        <StatLine label="STR" total={item.item_total_option.str} base={item.item_base_option.str} add={item.item_add_option?.str} scroll={item.item_etc_option?.str} star={item.item_starforce_option?.str} ex={item.item_exceptional_option?.str} />
                        <StatLine label="DEX" total={item.item_total_option.dex} base={item.item_base_option.dex} add={item.item_add_option?.dex} scroll={item.item_etc_option?.dex} star={item.item_starforce_option?.dex} ex={item.item_exceptional_option?.dex} />
                        <StatLine label="INT" total={item.item_total_option.int} base={item.item_base_option.int} add={item.item_add_option?.int} scroll={item.item_etc_option?.int} star={item.item_starforce_option?.int} ex={item.item_exceptional_option?.int} />
                        <StatLine label="LUK" total={item.item_total_option.luk} base={item.item_base_option.luk} add={item.item_add_option?.luk} scroll={item.item_etc_option?.luk} star={item.item_starforce_option?.luk} ex={item.item_exceptional_option?.luk} />
                        <StatLine label="MaxHP" total={item.item_total_option.max_hp} base={item.item_base_option.max_hp} add={item.item_add_option?.max_hp} scroll={item.item_etc_option?.max_hp} star={item.item_starforce_option?.max_hp} ex={item.item_exceptional_option?.max_hp} />
                        <StatLine label="MaxMP" total={item.item_total_option.max_mp} base={item.item_base_option.max_mp} add={item.item_add_option?.max_mp} scroll={item.item_etc_option?.max_mp} star={item.item_starforce_option?.max_mp} ex={item.item_exceptional_option?.max_mp} />
                        
                        <StatLine label="攻擊力" total={item.item_total_option.attack_power} base={item.item_base_option.attack_power} add={item.item_add_option?.attack_power} scroll={item.item_etc_option?.attack_power} star={item.item_starforce_option?.attack_power} ex={item.item_exceptional_option?.attack_power} />
                        <StatLine label="魔法攻擊力" total={item.item_total_option.magic_power} base={item.item_base_option.magic_power} add={item.item_add_option?.magic_power} scroll={item.item_etc_option?.magic_power} star={item.item_starforce_option?.magic_power} ex={item.item_exceptional_option?.magic_power} />
                        <StatLine label="防禦力" total={item.item_total_option.armor} base={item.item_base_option.armor} add={item.item_add_option?.armor} scroll={item.item_etc_option?.armor} star={item.item_starforce_option?.armor} />
                        
                        <StatLine label="BOSS傷害" total={item.item_total_option.boss_damage} base={item.item_base_option.boss_damage} add={item.item_add_option?.boss_damage} />
                        <StatLine label="無視防禦" total={item.item_total_option.ignore_monster_armor} base={item.item_base_option.ignore_monster_armor} add={item.item_add_option?.ignore_monster_armor} />
                        <StatLine label="全屬性" total={item.item_total_option.all_stat} base={item.item_base_option.all_stat} add={item.item_add_option?.all_stat} />
                    </>
                )}
            </div>

            {/* Potentials section */}
            {item.potential_option_1 && item.potential_option_1 !== 'false' && (
                <>
                    <div className="tooltip-divider" />
                    <div className="tooltip-potentials">
                        <div className="tooltip-section-title" style={{ color: gradeColor }}>
                            潛在能力 ({item.potential_option_grade})
                        </div>
                        <div className="potential-line">{item.potential_option_1}</div>
                        {item.potential_option_2 && item.potential_option_2 !== 'false' && <div className="potential-line">{item.potential_option_2}</div>}
                        {item.potential_option_3 && item.potential_option_3 !== 'false' && <div className="potential-line">{item.potential_option_3}</div>}
                    </div>
                </>
            )}

            {/* Additional Potentials section */}
            {item.additional_potential_option_1 && item.additional_potential_option_1 !== 'false' && (
                <>
                    <div className="tooltip-divider" />
                    <div className="tooltip-potentials">
                        <div className="tooltip-section-title" style={{ color: getGradeColor(item.additional_potential_option_grade) }}>
                            附加潛在能力 {item.additional_potential_option_grade ? `(${item.additional_potential_option_grade})` : ''}
                        </div>
                        <div className="potential-line">{item.additional_potential_option_1}</div>
                        {item.additional_potential_option_2 && item.additional_potential_option_2 !== 'false' && <div className="potential-line">{item.additional_potential_option_2}</div>}
                        {item.additional_potential_option_3 && item.additional_potential_option_3 !== 'false' && <div className="potential-line">{item.additional_potential_option_3}</div>}
                    </div>
                </>
            )}

            {/* Soul section */}
            {item.soul_name && (
                <>
                    <div className="tooltip-divider" />
                    <div className="tooltip-potentials">
                        <div className="tooltip-section-title" style={{ color: '#ffcc00' }}>
                            {item.soul_name}
                        </div>
                        <div className="potential-line" style={{ color: '#66ccff' }}>{item.soul_option}</div>
                    </div>
                </>
            )}
            
            {/* Cuttable count */}
            {item.cuttable_count && item.cuttable_count !== '255' && (
                <>
                    <div className="tooltip-divider" />
                    <div className="tooltip-footer">
                        可使用白金神奇剪刀次數: {item.cuttable_count}次
                    </div>
                </>
            )}
        </div>,
        document.body
    );
};

export default EquipmentTooltip;
