# TradeNote Web - 投資筆記網頁版

## 技術棧

### 前端
- **框架**: Next.js 14 (App Router)
- **語言**: TypeScript
- **樣式**: Tailwind CSS + shadcn/ui
- **狀態管理**: Zustand
- **圖表**: Recharts
- **圖標**: Lucide React

### 後端/資料儲存
- **資料庫**: IndexedDB (Dexie.js) - 本地瀏覽器儲存
- **AI**: TensorFlow.js - 本地推論
- **匯出**: 客戶端 CSV/JSON 生成

### PWA (手機 App 打包)
- **Service Worker**: next-pwa
- **Manifest**: 支援離線使用、安裝到手機桌面
- **Capacitor** (可選): 未來打包成原生 App

## 快速開始

```bash
# 1. 建立專案
npx create-next-app@latest tradenote-web --typescript --tailwind --app

# 2. 安裝依賴
cd tradenote-web
npm install zustand recharts dexie dexie-react-hooks lucide-react

# 3. 安裝 shadcn 組件
npx shadcn-ui@latest init
npx shadcn-ui@latest add button card input label select table tabs dialog

# 4. 加入 PWA 支援
npm install next-pwa

# 5. 開發伺服器
npm run dev
```

## 核心優勢

| 特性 | 說明 |
|------|------|
| **開發快速** | 網頁版比原生 App 快 2-3 倍 |
| **跨平台** | 一套程式碼，手機/平板/電腦都能用 |
| **離線使用** | PWA 支援離線，資料儲存在本地 |
| **免上架** | 直接部署網站，無需 App Store 審核 |
| **未來擴展** | 可用 Capacitor 打包成原生 App |

## 部署

```bash
# 部署到 Vercel（免費）
npm i -g vercel
vercel --prod
```

部署後用戶可直接用手機瀏覽器開啟，並「加入主畫面」變成 App 使用。