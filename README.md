# MapleStory TMS Web 🍁

一個基於 [Nexon Open API](https://open.api.nexon.com/) 的台灣楓之谷 (TMS) 角色資訊查詢網頁。提供美觀、流暢且資訊豐富的角色儀表板，讓玩家能隨時查看詳盡的角色狀態。

![Aesthetics](https://img.shields.io/badge/Aesthetics-Premium-orange)
![Tech](https://img.shields.io/badge/Tech-React%20%7C%20Vite%20%7C%20TypeScript-blue)

## ✨ 特色功能

- **核心資訊顯示**：角色等級、職業、公會、世界以及綜合戰力。
- **詳盡能力值**：包含最終傷害、BOSS 傷害、無視防禦、全屬性等各項數據。
- **裝備配置系統**：
  - 仿遊戲介面的裝備欄位配置。
  - 滑鼠懸停即時顯示 Tooltip：包含星力 (Starforce)、潛在能力、附加潛能。
  - **自研功能**：完整顯示靈魂寶珠效果、卓越強化 (Exceptional Options) 以及特殊戒指等級。
  - 能力值明細拆解：`(基本 + 附加 + 卷軸 + 星力 + 卓越)`。
- **技能與矩陣**：
  - **V 矩陣 (V-Matrix)**：顯示核心等級與內容。
  - **HEXA 矩陣 (HEXA-Matrix)**：六轉技能資訊。
  - **傳授技能 (Link Skills)**：顯示已裝備的傳授技能。
- **輔助資訊**：
  - **聯盟戰地 (Union)**：等級與階級。
  - **武陵道場 (Dojo)**：最高層數紀錄。
  - **寵物資訊**：目前攜帶的寵物。
- **進階數據**：內在能力 (Inner Ability)、超能力點數 (Hyper Stats) 以及套裝效果。

## 🛠️ 技術棧

- **前端框架**: [React 18](https://reactjs.org/)
- **構建工具**: [Vite](https://vitejs.dev/)
- **語言**: [TypeScript](https://www.typescriptlang.org/)
- **樣式**: Vanilla CSS (採用玻璃擬態 Glassmorphism 設計風格)
- **圖標**: [Lucide React](https://lucide.dev/)
- **API**: Nexon Open API

## 🚀 快速開始

### 環境需求
- Node.js (建議 v18 以上)
- npm 或 yarn

### 安裝步驟

1. 克隆專案：
   ```bash
   git clone https://github.com/weber123081/maplestory-tms-web.git
   ```

2. 安裝依賴：
   ```bash
   npm install
   ```

3. 設定環境變數：
   在根目錄建立 `.env` 檔案，填入你的 Nexon API Key：
   ```env
   VITE_NEXON_API_KEY=your_api_key_here
   ```

4. 啟動開發伺服器：
   ```bash
   npm run dev
   ```

## 📝 授權說明
本專案僅供學習與技術交流使用。楓之谷相關素材與數據版權均屬 Nexon 所有。
