const BASE_URL = import.meta.env.PROD 
    ? 'https://open.api.nexon.com/maplestorytw/v1'
    : '/api/nexon/maplestorytw/v1'
const API_KEY = import.meta.env.VITE_NEXON_API_KEY

export interface CharacterBasic {
    character_name: string
    character_level: number
    character_job: string
    character_class?: string // Added for TMS API compatibility
    world_name: string
    character_image: string
}

export interface CharacterStat {
    final_stat: {
        stat_name: string
        stat_value: string
    }[]
}

export interface ItemEquipment {
    item_equipment: {
        item_equipment_part: string
        item_name: string
        item_icon: string
        item_starforce: string
        potential_option_1: string
        potential_option_2: string
        potential_option_3: string
        additional_potential_option_1: string
        additional_potential_option_2: string
        additional_potential_option_3: string
    }[]
}

export interface SymbolEquipment {
    symbol: {
        symbol_name: string
        symbol_icon: string
        symbol_level: number
        symbol_force: string
    }[]
}

export interface LinkSkill {
    character_link_skill: {
        skill_name: string
        skill_level: number
        skill_icon: string
    }[]
    character_link_skill_preset_1?: {
        skill_name: string
        skill_level: number
        skill_icon: string
    }[]
    character_link_skill_preset_2?: {
        skill_name: string
        skill_level: number
        skill_icon: string
    }[]
    character_link_skill_preset_3?: {
        skill_name: string
        skill_level: number
        skill_icon: string
    }[]
    character_owned_link_skill?: {
        skill_name: string
        skill_level: number
        skill_icon: string
    }
}

const fetchWithRetry = async (url: string, options: any, retries = 3): Promise<Response> => {
    for (let i = 0; i < retries; i++) {
        const res = await fetch(url, options)
        if (res.status === 429) {
            // Exponential backoff
            await new Promise(resolve => setTimeout(resolve, 500 * Math.pow(2, i)))
            continue;
        }
        return res;
    }
    return fetch(url, options); // Final attempt
}

export const getOcid = async (characterName: string): Promise<string> => {
    const response = await fetchWithRetry(`${BASE_URL}/id?character_name=${encodeURIComponent(characterName)}`, {
        headers: { 'x-nxopen-api-key': API_KEY }
    })
    if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error?.message || '找不到角色或 API 錯誤')
    }
    const data = await response.json()
    return data.ocid
}

export const getCharacterBasic = async (ocid: string): Promise<CharacterBasic> => {
    const response = await fetchWithRetry(`${BASE_URL}/character/basic?ocid=${ocid}`, {
        headers: { 'x-nxopen-api-key': API_KEY }
    })
    if (!response.ok) throw new Error('取得基本資料失敗')
    return response.json()
}

export const getCharacterStat = async (ocid: string): Promise<CharacterStat> => {
    const response = await fetchWithRetry(`${BASE_URL}/character/stat?ocid=${ocid}`, {
        headers: { 'x-nxopen-api-key': API_KEY }
    })
    if (!response.ok) throw new Error('取得戰力資料失敗')
    return response.json()
}

export const getItemEquipment = async (ocid: string): Promise<ItemEquipment> => {
    const response = await fetchWithRetry(`${BASE_URL}/character/item-equipment?ocid=${ocid}`, {
        headers: { 'x-nxopen-api-key': API_KEY }
    })
    if (!response.ok) throw new Error('取得裝備資料失敗')
    return response.json()
}

export const getSymbolEquipment = async (ocid: string): Promise<SymbolEquipment> => {
    const response = await fetchWithRetry(`${BASE_URL}/character/symbol-equipment?ocid=${ocid}`, {
        headers: { 'x-nxopen-api-key': API_KEY }
    })
    if (!response.ok) throw new Error('取得符文資料失敗')
    return response.json()
}

export const getLinkSkill = async (ocid: string): Promise<LinkSkill> => {
    const response = await fetchWithRetry(`${BASE_URL}/character/link-skill?ocid=${ocid}`, {
        headers: { 'x-nxopen-api-key': API_KEY }
    })
    if (!response.ok) throw new Error('取得連結技能失敗')
    return response.json()
}

export const getInnerAbility = async (ocid: string): Promise<any> => {
    const response = await fetchWithRetry(`${BASE_URL}/character/ability?ocid=${ocid}`, {
        headers: { 'x-nxopen-api-key': API_KEY }
    })
    if (!response.ok) throw new Error('取得內在潛能失敗')
    return response.json()
}

export const getCashItemEquipment = async (ocid: string): Promise<any> => {
    const response = await fetchWithRetry(`${BASE_URL}/character/cashitem-equipment?ocid=${ocid}`, {
        headers: { 'x-nxopen-api-key': API_KEY }
    })
    if (!response.ok) throw new Error('取得點裝裝備失敗')
    return response.json()
}

export const getHyperStat = async (ocid: string): Promise<any> => {
    const response = await fetchWithRetry(`${BASE_URL}/character/hyper-stat?ocid=${ocid}`, {
        headers: { 'x-nxopen-api-key': API_KEY }
    })
    if (!response.ok) throw new Error('取得極限屬性失敗')
    return response.json()
}

export const getUnion = async (ocid: string): Promise<any> => {
    const response = await fetchWithRetry(`${BASE_URL}/user/union?ocid=${ocid}`, {
        headers: { 'x-nxopen-api-key': API_KEY }
    })
    if (!response.ok) throw new Error('取得聯盟戰地失敗')
    return response.json()
}

export const getDojo = async (ocid: string): Promise<any> => {
    const response = await fetchWithRetry(`${BASE_URL}/character/dojang?ocid=${ocid}`, {
        headers: { 'x-nxopen-api-key': API_KEY }
    })
    if (!response.ok) throw new Error('取得武陵道場失敗')
    return response.json()
}

export const getPetEquipment = async (ocid: string): Promise<any> => {
    const response = await fetchWithRetry(`${BASE_URL}/character/pet-equipment?ocid=${ocid}`, {
        headers: { 'x-nxopen-api-key': API_KEY }
    })
    if (!response.ok) throw new Error('取得寵物資料失敗')
    return response.json()
}

export const getVMatrix = async (ocid: string): Promise<any> => {
    const response = await fetchWithRetry(`${BASE_URL}/character/vmatrix?ocid=${ocid}`, {
        headers: { 'x-nxopen-api-key': API_KEY }
    })
    if (!response.ok) throw new Error('取得V矩陣失敗')
    return response.json()
}

export const getHexaMatrix = async (ocid: string): Promise<any> => {
    const response = await fetchWithRetry(`${BASE_URL}/character/hexamatrix?ocid=${ocid}`, {
        headers: { 'x-nxopen-api-key': API_KEY }
    })
    if (!response.ok) throw new Error('取得HEXA矩陣失敗')
    return response.json()
}

export const getCharacterSkill = async (ocid: string, grade: string): Promise<any> => {
    const response = await fetchWithRetry(`${BASE_URL}/character/skill?ocid=${ocid}&character_skill_grade=${grade}`, {
        headers: { 'x-nxopen-api-key': API_KEY }
    })
    if (!response.ok) throw new Error(`取得第 ${grade} 轉技能失敗`)
    return response.json()
}

export const getSetEffect = async (ocid: string): Promise<any> => {
    const response = await fetchWithRetry(`${BASE_URL}/character/set-effect?ocid=${ocid}`, {
        headers: { 'x-nxopen-api-key': API_KEY }
    })
    if (!response.ok) throw new Error('取得套裝效果失敗')
    return response.json()
}
