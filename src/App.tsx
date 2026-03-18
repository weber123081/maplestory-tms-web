import React, { useState } from 'react'
import SearchBar from './components/SearchBar'
import CharacterCard from './components/CharacterCard'
import StatsSection from './components/StatsSection'
import EquipmentGrid from './components/EquipmentGrid'
import SymbolSection from './components/SymbolSection'
import AdvancedStats from './components/AdvancedStats'
import SkillMatrix from './components/SkillMatrix'
import MiscInfo from './components/MiscInfo'
import {
    getOcid,
    getCharacterBasic,
    getCharacterStat,
    getItemEquipment,
    getSymbolEquipment,
    getLinkSkill,
    getInnerAbility,
    getCashItemEquipment,
    getHyperStat,
    getUnion,
    getDojo,
    getPetEquipment,
    getVMatrix,
    getHexaMatrix,
    getSetEffect
} from './api/nexonApi'

function App() {
    const [characterData, setCharacterData] = useState<any>(null)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const handleSearch = async (name: string) => {
        setLoading(true)
        setError(null)
        setCharacterData(null)
        try {
            const ocid = await getOcid(name)

            // We use Promise.allSettled so that if one endpoint throws 403 or 404 (e.g. no Dojo record), it won't crash the entire request.
            const results = await Promise.allSettled([
                getCharacterBasic(ocid),
                getCharacterStat(ocid),
                getItemEquipment(ocid),
                getSymbolEquipment(ocid),
                getLinkSkill(ocid),
                getInnerAbility(ocid),
                getCashItemEquipment(ocid),
                getHyperStat(ocid),
                getUnion(ocid),
                getDojo(ocid),
                getPetEquipment(ocid),
                getVMatrix(ocid),
                getHexaMatrix(ocid),
                getSetEffect(ocid)
            ])

            // 檢查是否有任何一次請求失敗，確保所有資料完整性
            const failedRequests = results.filter(r => r.status === 'rejected');
            if (failedRequests.length > 0) {
                console.error("部分 API 請求失敗:", failedRequests);
                throw new Error('部分資料讀取失敗 (可能遇到伺服器限流或無對應資料)。為避免資料呈現遺漏，請重新點擊搜尋以獲取完整資訊。');
            }

            // Helper to get fulfilled value or null
            const getValue = (result: PromiseSettledResult<any>) => result.status === 'fulfilled' ? result.value : null;

            const basic = getValue(results[0])
            if (!basic) throw new Error('無法取得角色基本資料');

            setCharacterData({
                ...basic,
                stats: getValue(results[1])?.final_stat || [],
                equipment: getValue(results[2])?.item_equipment || [],
                symbols: getValue(results[3])?.symbol || [],
                links: getValue(results[4])?.link_skill || [],
                ability: getValue(results[5]),
                cashEquipment: getValue(results[6])?.cash_item_equipment_base || [],
                hyperStat: getValue(results[7]),
                union: getValue(results[8]),
                dojo: getValue(results[9]),
                pets: getValue(results[10]),
                vMatrix: getValue(results[11]),
                hexaMatrix: getValue(results[12]),
                setEffect: getValue(results[13])?.set_effect || []
            })
        } catch (err: any) {
            setError(err.message || '查詢時發生錯誤')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="container animate-fade-in">
            <header style={{ textAlign: 'center', marginTop: '2rem', marginBottom: '2rem' }}>
                <h1 style={{ fontSize: '3rem', fontWeight: '800', marginBottom: '0.5rem' }}>
                    MapleStory <span style={{ color: 'var(--accent-primary)' }}>TMS</span>
                </h1>
                <p style={{ color: 'var(--text-secondary)', fontSize: '1rem' }}>台灣楓之谷 角色資訊查詢</p>
            </header>

            <main style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2rem' }}>
                <SearchBar onSearch={handleSearch} isLoading={loading} />

                {error && (
                    <div className="glass" style={{ padding: '1rem 2rem', borderRadius: '1rem', border: '1px solid rgba(239, 68, 68, 0.2)', color: '#fca5a5' }}>
                        {error}
                    </div>
                )}

                {characterData && (
                    <div className="dashboard-grid animate-fade-in">
                        {/* Left Column */}
                        <div className="dashboard-col">
                            <CharacterCard data={characterData} />
                            <StatsSection stats={characterData.stats} />
                            <AdvancedStats ability={characterData.ability} hyperStat={characterData.hyperStat} setEffect={characterData.setEffect} />
                        </div>
                        
                        {/* Middle/Right Column */}
                        <div className="dashboard-col wide">
                            <div className="dashboard-row">
                                <EquipmentGrid equipment={characterData.equipment} cashEquipment={characterData.cashEquipment} characterImage={characterData.character_image} />
                                <MiscInfo union={characterData.union} dojo={characterData.dojo} pets={characterData.pets} />
                            </div>
                            
                            <SkillMatrix vMatrix={characterData.vMatrix} hexaMatrix={characterData.hexaMatrix} links={characterData.links} />
                            <SymbolSection symbols={characterData.symbols} />
                        </div>
                    </div>
                )}
            </main>

            <footer style={{ marginTop: '5rem', padding: '3rem', textAlign: 'center', color: 'var(--text-secondary)', fontSize: '0.875rem', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                &copy; 2026 MapleStory TMS Fan Site. Data provided by Nexon Open API.
            </footer>
        </div>
    )
}

export default App
