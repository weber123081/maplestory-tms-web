import React, { useState } from 'react'
import EquipmentTooltip from './EquipmentTooltip'

interface EquipmentGridProps {
    equipment: {
        item_equipment_part: string
        item_equipment_slot: string
        item_name: string
        item_icon: string
        item_starforce?: string
        starforce?: string
        potential_option_1: string | null
        potential_option_2?: string | null
        potential_option_3?: string | null
        potential_option_grade?: string | null
        additional_potential_option_1?: string | null
        additional_potential_option_2?: string | null
        additional_potential_option_3?: string | null
        additional_potential_option_grade?: string | null
        item_base_option?: any
        item_total_option?: any
        item_add_option?: any
        item_etc_option?: any
        scroll_upgrade?: string
        cuttable_count?: string
        soul_name?: string | null
        soul_option?: string | null
        special_ring_level?: number
        item_starforce_option?: any
        item_exceptional_option?: any
    }[]
    cashEquipment?: {
        cash_item_equipment_part: string
        cash_item_name: string
        cash_item_icon: string
    }[]
    characterImage?: string
}

// In-game layout mapping (simplified 5 columns x 6 rows)
// Rows mapping (0 to 5) and Cols (0 to 4) matches the new MapleStory TMS UI
const slotMappingList: Record<string, { row: number; col: number; subIndex?: number }[]> = {
    // Column 1 (Leftmost)
    '戒指': [ {row: 3, col: 0}, {row: 2, col: 0}, {row: 1, col: 0}, {row: 0, col: 0} ], 
    '腰帶': [ {row: 4, col: 0} ],
    '口袋單品': [ {row: 5, col: 0} ],
    '口袋道具': [ {row: 5, col: 0} ],

    // Column 2
    '臉飾': [ {row: 0, col: 1} ],
    '眼飾': [ {row: 1, col: 1} ],
    '耳環': [ {row: 2, col: 1} ],
    '耳朵飾環': [ {row: 2, col: 1} ],
    '墜飾': [ {row: 3, col: 1}, {row: 4, col: 1} ],
    '項鍊': [ {row: 3, col: 1}, {row: 4, col: 1} ],

    // Center Row 4 (contains Weapon, Sub Weapon, and Medal stacked horizontally)
    '武器': [ {row: 4, col: 2, subIndex: 0} ],
    '長劍': [ {row: 4, col: 2, subIndex: 0} ],
    '單手劍': [ {row: 4, col: 2, subIndex: 0} ],
    '雙手劍': [ {row: 4, col: 2, subIndex: 0} ],
    '矛': [ {row: 4, col: 2, subIndex: 0} ],
    '琉': [ {row: 4, col: 2, subIndex: 0} ], 
    '徽章': [ {row: 4, col: 2, subIndex: 2} ], 
    '勳章': [ {row: 3, col: 4} ],  
    '輔助武器': [ {row: 4, col: 2, subIndex: 1} ],
    '副武器': [ {row: 4, col: 2, subIndex: 1} ],
    '小太刀': [ {row: 4, col: 2, subIndex: 1} ], // Hayato Sub-weapon
    '劍鞘': [ {row: 4, col: 2, subIndex: 1} ], // Hayato Sub-weapon fallback
    '(Unknown)': [ {row: 4, col: 2, subIndex: 1} ], // Often subweapon in TMS

    // Column 4
    '帽子': [ {row: 0, col: 3} ],
    '套服': [ {row: 1, col: 3} ],
    '上衣': [ {row: 1, col: 3} ],
    '褲/裙': [ {row: 2, col: 3} ],
    '下衣': [ {row: 2, col: 3} ],
    '下裝': [ {row: 2, col: 3} ],
    '裙': [ {row: 2, col: 3} ],
    '肩膀裝飾': [ {row: 3, col: 3} ],
    '肩膀飾品': [ {row: 3, col: 3} ],
    '機器人': [ {row: 4, col: 3} ],
    'Android': [ {row: 4, col: 3} ],

    // Column 5 (Rightmost)
    '披風': [ {row: 0, col: 4} ],
    '手套': [ {row: 1, col: 4} ],
    '鞋子': [ {row: 2, col: 4} ],
    '心臟': [ {row: 4, col: 4} ],
    '機器心臟': [ {row: 4, col: 4} ], // Heart explicitly named 
    '胸章': [ {row: 5, col: 4} ],  // Badge
}

const EquipmentGrid: React.FC<EquipmentGridProps> = ({ equipment, cashEquipment, characterImage }) => {
    const [viewMode, setViewMode] = useState<'normal' | 'cash'>('normal')
    const [tooltipData, setTooltipData] = useState<{ item: any; x: number; y: number; transform: string } | null>(null);

    const handleMouseMove = (e: React.MouseEvent, item: any) => {
        if (!item) return;
        
        const tooltipWidth = Math.min(260, window.innerWidth * 0.9);
        const tooltipHeaderHeight = 200; // Estimated
        
        // Determine quadrant
        const isRightHalf = e.clientX > window.innerWidth / 2;
        const isBottomHalf = e.clientY > window.innerHeight / 2;

        const offset = 15;
        let x = e.clientX + offset;
        let y = e.clientY + offset;

        const translateX = isRightHalf ? '-100%' : '0';
        const translateY = isBottomHalf ? '-100%' : '0';
        
        if (isRightHalf) x = e.clientX - offset;
        if (isBottomHalf) y = e.clientY - offset;

        // Final safety bounds
        if (x < 10) x = 10;
        if (x + (isRightHalf ? 0 : tooltipWidth) > window.innerWidth - 10) {
            x = window.innerWidth - tooltipWidth - 10;
        }

        setTooltipData({
            item,
            x,
            y,
            transform: `translate(${translateX}, ${translateY})`
        });
    };

    const handleMouseLeave = () => {
        setTooltipData(null);
    };

    // Create an empty grid, where center slot [4][2] holds an array of 3 sub-items
    const gridRows = 6;
    const gridCols = 5;
    const grid: any[][] = Array.from({ length: gridRows }, () => Array(gridCols).fill(null));
    grid[4][2] = [null, null, null];

    const jewelSlot = { item: null as any };
    const totemSlots = [null, null, null] as any[];

    // Totem fallbacks (placeholders if API icon fails)
    const totemFallbacks = [
        '/brain/2330ce31-574a-4546-91ce-ed6970073c30/totem_yu_garden_horse_1773834241755.png',
        '/brain/2330ce31-574a-4546-91ce-ed6970073c30/totem_yu_garden_kettle_1773834259469.png',
        '/brain/2330ce31-574a-4546-91ce-ed6970073c30/totem_yu_garden_incense_1773834280590.png'
    ];

    // Helper to place item
    const placeItem = (itemObj: any, partName: string, slotName?: string) => {
        const itemName = itemObj.item_name || itemObj.cash_item_name || '';
        const combined = (partName + (slotName || '') + itemName).toLowerCase();

        // Special routing for Totems (TMS specific part names/item keywords)
        const isTotem = combined.includes('圖騰') || 
                        ['馴服的怪物', '馬鞍', '戰功', '怪物裝備'].includes(partName) || 
                        combined.includes('香爐') || combined.includes('痕跡') ||
                        combined.includes('碑石') ||
                        combined.includes('茶壺') || combined.includes('戰功');

        // Special routing for Jewel (TMS job specific)
        const isJewel = combined.includes('聖血') || combined.includes('寶石') || combined.includes('jewel') || combined.includes('寶玉');

        if (isJewel) {
            jewelSlot.item = itemObj;
            return true;
        }
        if (isTotem) {
            const emptyIdx = totemSlots.findIndex(s => s === null);
            if (emptyIdx !== -1) {
                totemSlots[emptyIdx] = itemObj;
                return true;
            }
        }

        // Attempt strict mapping first, try partName then slotName
        let slots = slotMappingList[partName] || (slotName ? slotMappingList[slotName] : undefined);
        
        // Dynamic Fallback: If it's completely unrecognized
        if (!slots) {
            const isStandard = ['戒指', '腰帶', '帽子', '臉飾', '眼飾', '耳環', '上衣', '褲', '裙', '鞋', '手套', '披風', '胸章', '徽章', '心臟', '勳章', '肩膀', '口袋', '墜', '項鍊'].some(k => (partName + (slotName || '')).includes(k));
            if (!isStandard) {
                // Route to Center slots [Weapon, SubWpn, Emblem]
                slots = [ {row: 4, col: 2, subIndex: 0}, {row: 4, col: 2, subIndex: 1}, {row: 4, col: 2, subIndex: 2} ];
            }
        }

        if (slots) {
            for (const slot of slots) {
                if (slot.subIndex !== undefined) {
                    if (!grid[slot.row][slot.col][slot.subIndex]) {
                        grid[slot.row][slot.col][slot.subIndex] = itemObj;
                        return true;
                    }
                } else {
                    if (!grid[slot.row][slot.col]) {
                        grid[slot.row][slot.col] = itemObj;
                        return true;
                    }
                }
            }
        }
        return false;
    }

    // Fill grid based on mode
    if (viewMode === 'normal') {
        equipment.forEach(item => {
            placeItem(item, item.item_equipment_part, item.item_equipment_slot);
        });
    } else if (viewMode === 'cash' && cashEquipment) {
        cashEquipment.forEach(item => {
            placeItem({
                item_name: item.cash_item_name,
                item_icon: item.cash_item_icon,
            }, item.cash_item_equipment_part);
        });
    }

    return (
        <div className="glass grid-content-card" style={{ alignItems: 'center' }}>
            <div className="equipment-window">
                <div className="equipment-tabs">
                    <button 
                        className={`equipment-tab ${viewMode === 'normal' ? 'active' : ''}`}
                        onClick={() => setViewMode('normal')}
                    >
                        一般裝備
                    </button>
                    <button 
                        className={`equipment-tab ${viewMode === 'cash' ? 'active' : ''}`}
                        onClick={() => setViewMode('cash')}
                    >
                        點裝配置
                    </button>
                </div>

                <div className="equipment-grid-layout">
                    {/* Render Character Image taking up 140px in column 3, row 1-4 */}
                    {characterImage && (
                        <div style={{
                            gridRow: '1 / span 4',
                            gridColumn: '3 / span 1',
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'flex-end',
                            width: '100%',
                            height: '100%'
                        }}>
                            <img src={characterImage} alt="Character" style={{ maxWidth: '140px', maxHeight: '100%', objectFit: 'contain' }} />
                        </div>
                    )}

                    {/* Render the Item Slots */}
                    {grid.map((row, rowIndex) => 
                        row.map((cellItem, colIndex) => {
                            // Valid slots filter based on real TMS UI
                            const isValidSlot = (r: number, c: number) => {
                                if (c === 0) return true; // Col 0 is 0-5
                                if (c === 1) return r <= 4; // Col 1 is 0-4
                                if (c === 3) return r <= 4; // Col 3 is 0-4
                                if (c === 4) return true; // Col 4 is 0-5
                                if (c === 2 && r === 4) return true; // Center weapon/sub/emblem
                                return false;
                            }
                            if (!isValidSlot(rowIndex, colIndex)) return null;

                            // Render Center horizontal slots (Weapon/Sub/Medal)
                            if (colIndex === 2 && rowIndex === 4) {
                                const subLabels = ['WEAPON', 'SUB WPN', 'EMBLEM'];
                                return (
                                    <div key={`subgrid-4-2`} style={{ gridRow: 5, gridColumn: 3, display: 'flex', gap: '6px', width: '100%', justifyContent: 'space-between', zIndex: 2 }}>
                                        {(cellItem as any[]).map((subItem, idx) => (
                                            <div 
                                                key={`sub-${idx}`} 
                                                className="equipment-slot" 
                                                onMouseMove={(e) => handleMouseMove(e, subItem)}
                                                onMouseLeave={handleMouseLeave}
                                            >
                                                {subItem ? (
                                                    <>
                                                        <img src={subItem.item_icon} alt={subItem.item_name} />
                                                        {(subItem.starforce || subItem.item_starforce) && (subItem.starforce !== '0' && subItem.item_starforce !== '0') && (
                                                            <div className="equipment-starforce">{subItem.starforce || subItem.item_starforce}</div>
                                                        )}
                                                    </>
                                                ) : (
                                                    <span style={{ fontSize: '0.45rem', color: 'rgba(255,255,255,0.25)', fontWeight: 800, textAlign: 'center', lineHeight: 1.1, wordBreak: 'break-word', padding: '0 2px' }}>
                                                        {subLabels[idx]}
                                                    </span>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                );
                            }

                            const getSlotLabel = (r: number, c: number) => {
                                if (c === 0 && r <= 3) return 'RINGS';
                                if (c === 0 && r === 4) return 'BELT';
                                if (c === 0 && r === 5) return 'POCKET';
                        
                                if (c === 1 && r === 0) return 'FORE HEAD';
                                if (c === 1 && r === 1) return 'EYE ACC';
                                if (c === 1 && r === 2) return 'EAR ACC';
                                if (c === 1 && r === 3) return 'PENDANT';
                                if (c === 1 && r === 4) return 'PENDANT';
                        
                                if (c === 3 && r === 0) return 'CAP';
                                if (c === 3 && r === 1) return 'CLOTHES';
                                if (c === 3 && r === 2) return 'PANTS';
                                if (c === 3 && r === 3) return 'SHOULDER';
                                if (c === 3 && r === 4) return 'ANDROID';
                        
                                if (c === 4 && r === 0) return 'CAPE';
                                if (c === 4 && r === 1) return 'GLOVES';
                                if (c === 4 && r === 2) return 'SHOES';
                                if (c === 4 && r === 3) return 'MEDAL';
                                if (c === 4 && r === 4) return 'HEART';
                                if (c === 4 && r === 5) return 'BADGE';
                                
                                return '';
                            };
                            
                            const label = getSlotLabel(rowIndex, colIndex);
                                        
                            return (
                                <div 
                                    key={`${rowIndex}-${colIndex}`} 
                                    className="equipment-slot" 
                                    style={{ zIndex: 1, gridRow: rowIndex + 1, gridColumn: colIndex + 1 }} 
                                    onMouseMove={(e) => handleMouseMove(e, cellItem)}
                                    onMouseLeave={handleMouseLeave}
                                >
                                    {cellItem ? (
                                        <>
                                            <img src={cellItem.item_icon} alt={cellItem.item_name} />
                                            {(cellItem.starforce || cellItem.item_starforce) && (cellItem.starforce !== '0' && cellItem.item_starforce !== '0') && (
                                                <div className="equipment-starforce">{cellItem.starforce || cellItem.item_starforce}</div>
                                            )}
                                        </>
                                    ) : (
                                        <span style={{ fontSize: '0.45rem', color: 'rgba(255,255,255,0.25)', fontWeight: 800, textAlign: 'center', lineHeight: 1.1, wordBreak: 'break-word', padding: '0 2px' }}>
                                            {label}
                                        </span>
                                    )}
                                </div>
                            );
                        })
                    )}
                </div>

                <div className="extra-equipment-container">
                    <div className="extra-section-box">
                        <div className="extra-section-title">JEWEL</div>
                        <div 
                            className="equipment-slot"
                            onMouseMove={(e) => handleMouseMove(e, jewelSlot.item)}
                            onMouseLeave={handleMouseLeave}
                        >
                            {jewelSlot.item ? <img src={jewelSlot.item.item_icon} alt={jewelSlot.item.item_name} /> : <span style={{ fontSize: '0.45rem', opacity: 0.2 }}>JEWEL</span>}
                        </div>
                    </div>

                    <div className="extra-section-box">
                        <div className="extra-section-title">TOTEM</div>
                        <div className="totem-grid">
                            {totemSlots.map((item, idx) => (
                                <div 
                                    key={`totem-${idx}`}
                                    className="equipment-slot"
                                    onMouseMove={(e) => handleMouseMove(e, item)}
                                    onMouseLeave={handleMouseLeave}
                                >
                                    {item ? (
                                        <img 
                                            src={item.item_icon || totemFallbacks[idx]} 
                                            alt={item.item_name} 
                                            onError={(e) => { (e.target as HTMLImageElement).src = totemFallbacks[idx]; }}
                                        />
                                    ) : (
                                        <span style={{ fontSize: '0.45rem', opacity: 0.2 }}>TOTEM</span>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
            
            <p style={{ marginTop: '1rem', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                * 游標懸停在裝備上可查看詳細潛能屬性與星力
            </p>

            {tooltipData && <EquipmentTooltip item={tooltipData.item} x={tooltipData.x} y={tooltipData.y} transform={tooltipData.transform} />}
        </div>
    )
}

export default EquipmentGrid
