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
    getCharacterSkill,
    getSetEffect
} from './api/nexonApi'

function App() {
    const [characterData, setCharacterData] = useState<any>(null)
    const [loading, setLoading] = useState(false)
    const [loadingCountdown, setLoadingCountdown] = useState(0)
    const [error, setError] = useState<string | null>(null)

    const handleSearch = async (name: string) => {
        setLoading(true)
        setError(null)
        setCharacterData(null)
        setLoadingCountdown(12) // Start 12s countdown

        const countdownInterval = setInterval(() => {
            setLoadingCountdown(prev => (prev > 0 ? prev - 1 : 0));
        }, 1000);

        try {
            const ocid = await getOcid(name)

            // Step 1: Fetch Critical Character Data first
            const criticalRequests = [
                getCharacterBasic(ocid),
                getCharacterStat(ocid),
                getItemEquipment(ocid),
                getSymbolEquipment(ocid),
                getLinkSkill(ocid),
                getVMatrix(ocid),
                getHexaMatrix(ocid),
                getSetEffect(ocid)
            ];

            const criticalResults = await Promise.allSettled(criticalRequests);
            
            const failedCritical = criticalResults.filter(r => r.status === 'rejected');
            if (failedCritical.length > 0) {
                console.error("關鍵資料讀取失敗:", failedCritical);
                throw new Error('伺服器目前繁忙或資料讀取失敗。請稍候再點擊一次搜尋。');
            }

            // Step 2: Fetch Optional Data
            const optionalRequests = [
                getInnerAbility(ocid),
                getCashItemEquipment(ocid),
                getHyperStat(ocid),
                getUnion(ocid),
                getDojo(ocid),
                getPetEquipment(ocid)
            ];
            const optionalResults = await Promise.allSettled(optionalRequests);

            // Step 3: Fetch Skill Icons sequentially
            const skillResults: any[] = [];
            const grades = ['0', '1', '2', '3', '4', '5', '6'];
            for (const g of grades) {
                try {
                    const skillData = await getCharacterSkill(ocid, g);
                    skillResults.push({ status: 'fulfilled', value: skillData });
                    await new Promise(r => setTimeout(r, 150));
                } catch (e) {
                    skillResults.push({ status: 'rejected', reason: e });
                }
            }

            const results = [
                ...criticalResults,
                ...optionalResults,
                ...skillResults
            ];

            const getValue = (result: any) => result?.status === 'fulfilled' ? result.value : null;
            const basic = getValue(results[0])
            if (!basic) throw new Error('無法取得角色基本資料');

            const linkData = getValue(results[4]);
            let connectedLinks = linkData?.character_link_skill || [];
            
            // Fallback for TMS: If character_link_skill is empty, check presets
            if (connectedLinks.length === 0 && linkData) {
                connectedLinks = linkData.character_link_skill_preset_1?.length > 0 ? linkData.character_link_skill_preset_1 :
                                 linkData.character_link_skill_preset_2?.length > 0 ? linkData.character_link_skill_preset_2 :
                                 linkData.character_link_skill_preset_3?.length > 0 ? linkData.character_link_skill_preset_3 : [];
            }

            const allLinks = [...connectedLinks];
            if (linkData?.character_owned_link_skill) {
                allLinks.unshift(linkData.character_owned_link_skill);
            }

            const skillMap: Record<string, string> = {};
            for (let i = 14; i <= 20; i++) {
                const skills = getValue(results[i])?.character_skill || [];
                skills.forEach((s: any) => {
                    if (s.skill_name && s.skill_icon) {
                        skillMap[s.skill_name] = s.skill_icon;
                    }
                });
            }

            // Ensure we wait for the countdown to finish for better UX
            // We'll just use a fixed delay to ensure the user sees the animation
            await new Promise(r => setTimeout(r, 2000)); 

            setCharacterData({
                ...basic,
                character_job: basic.character_class || basic.character_job,
                stats: getValue(results[1])?.final_stat || [],
                equipment: getValue(results[2])?.item_equipment || [],
                symbols: getValue(results[3])?.symbol || [],
                links: allLinks,
                vMatrix: getValue(results[5]),
                hexaMatrix: getValue(results[6]),
                setEffect: getValue(results[7]),
                setEffectList: getValue(results[7])?.set_effect || [],
                ability: getValue(results[8]),
                cashEquipment: getValue(results[9])?.cash_item_equipment_base || [],
                hyperStat: getValue(results[10]),
                union: getValue(results[11]),
                dojo: getValue(results[12]),
                pets: getValue(results[13]),
                skillIconMap: skillMap
            })
        } catch (err: any) {
            setError(err.message || '查詢時發生錯誤')
        } finally {
            clearInterval(countdownInterval);
            setLoading(false)
            setLoadingCountdown(0)
        }
    }


    return (
        <div className="container animate-fade-in">
            <header style={{ textAlign: 'center', marginTop: '2rem', marginBottom: '2rem', padding: '0 1rem' }}>
                <h1>
                    家樂福收容所 <span style={{ color: 'var(--accent-primary)' }}>TMS</span>
                </h1>
                <p style={{ color: 'var(--text-secondary)', fontSize: 'clamp(0.875rem, 2vw, 1rem)' }}>台灣楓之谷 角色資訊查詢</p>
            </header>

            <main style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2rem', position: 'relative' }}>
                <SearchBar onSearch={handleSearch} isLoading={loading} />

                {loading && (
                    <div className="loading-overlay animate-fade-in">
                        <div className="loader" />
                        <h2 style={{ fontSize: 'clamp(1.2rem, 3vw, 1.5rem)', marginBottom: '0.5rem', color: '#e0b0ff' }}>同步核心數據中...</h2>
                        <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.85rem', marginBottom: '1.5rem' }}>
                            正在為您抓取最新數據與技能圖示，請稍候
                        </p>
                        <div style={{ fontSize: 'clamp(2rem, 6vw, 2.5rem)', fontWeight: '800', color: 'var(--accent-primary)', textShadow: '0 0 20px rgba(160, 32, 240, 0.5)' }}>
                            {loadingCountdown}s
                        </div>
                    </div>
                )}

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

                            <SkillMatrix vMatrix={characterData.vMatrix} hexaMatrix={characterData.hexaMatrix} links={characterData.links} skillIconMap={characterData.skillIconMap} />
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
