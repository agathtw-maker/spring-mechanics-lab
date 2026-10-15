# 彈簧力學實驗

React + TypeScript + Vite + Three.js 的獨立高中力學教學作品。已在 Windows 本機完成安裝、執行、物理測試與正式建置。本機開發預覽為 http://127.0.0.1:5173/。

## GitHub Pages 發布

正式網址：https://agathtw-maker.github.io/spring-mechanics-lab/ 。2026-10-16 已部署成功並實際開啟驗證；發布紀錄見 `DEPLOYMENT.md`。

`.github/workflows/deploy.yml` 會在 main 更新時安裝 lockfile 中的依賴、檢查 TypeScript、執行 Vitest、正式建置，再發布 dist。僅通過檢查的版本會部署。儲存庫 Settings → Pages 的 Source 應設為 GitHub Actions。

`vite.config.ts` 使用相對資源路徑，支援 GitHub Pages 專案子路徑與本機 HTTP 預覽。正式網站由 GitHub 託管，無須啟動本機 start.ps1。物理參數仍只保存在各訪客自己的瀏覽器；localhost 與正式網址的儲存空間不同，既有參數可透過 JSON 匯出/匯入搬移。

## 啟動

在本資料夾執行 `powershell -ExecutionPolicy Bypass -File ./start.ps1`，或使用已安裝 npm 的電腦執行 `npm ci`、`npm run dev`。Node.js 須符合 Vite 7 的要求：20.19+ 或 22.12+；本次使用 24.19.0。此電腦沒有全域 npm，因此已將 npm 11.6.2 放在 `.tools/package`，無須修改系統 PATH。

本機驗證命令：`node .tools/package/bin/npm-cli.js run check`、`node .tools/package/bin/npm-cli.js test`、`node .tools/package/bin/npm-cli.js run build`。重產報告可使用 Node 24 執行 `node report.mjs`。`package-lock.json` 已保留；套件皆在本專案內。移到其他電腦可直接以標準 npm 安裝，不需複製本機工具快取。正式建置結果在 `dist/`，以 HTTP 伺服器提供，不能直接雙擊 HTML。

## 操作與可重複的參數實驗

- 拖曳黃銅砝碼沿相機朝向的操作平面移動，拖曳中停用相機控制，放手速度歸零；空白處拖曳旋轉視角，滾輪縮放。
- 拖曳綠色掛點或調整掛點 X/Y/Z：調整期間顯示「已暫停 · 正在改變外部條件」，凍結物理時間並保留砝碼的世界位置與速度。放手或按鍵釋放後恢復先前運行狀態；若使用者原已手動暫停，仍保留暫停。清除時間累積避免補算調整期間的時間。
- 掛點範圍：X −0.5–0.8 m、Y 2.2–3.3 m、Z −0.8–0.8 m。重設還原掛點 (0,2.8,0) m；相同偏移按鈕則使用目前掛點。
- 深度 Z 滑桿直接設定相對掛點的世界 Z 位置並歸零速度，屬人為作功。滑鼠操作範圍限制在距掛點 0.05–3.5 m，沒有單軸滑軌。
- 重設使用目前參數與垂直偏移 0.16 m；暫停可凍結時間；回初始視角只重設相機。
- 重複按「施加相同軸向偏移 +0.16 m」：m=1、k=20 的無阻尼週期為 1.404963 s；m=2、k=20 為 1.986918 s；m=1、k=40 為 0.993459 s。三者已透過同一物理函式實測，瀏覽器也實際修改參數並確認面板數值與模型公式同步。這是即時計算，沒有預錄軌跡。
- 物理參數保存在 localStorage；掛點每次重新載入從預設位置開始。JSON 匯出包含 schema=1、params 與 anchor；匯入驗證所有值與範圍，成功後依匯入掛點初始化。舊版不含 anchor 的 JSON 仍可匯入，使用預設掛點。

## 資源能力對照

| 作品需求 | 用到的資源能力 | 實際檔案或物件 | 仍需自行實作的部分 |
|---|---|---|---|
| 彈簧配合兩端點 | Three.js BufferGeometry 可更新頂點、法線與包圍球 | `src/scene.ts`：spring.geometry、position BufferAttribute | 螺旋端點插值、局部基底、圈數與管線頂點更新；沒有裝飾擺動 |
| 選取砝碼與掛點 | Three.js Raycaster 射線與 Mesh 相交 | `src/scene.ts`：ray、mass、anchorMesh、down | 辨別選取目標、操作平面、抓取偏移、pointer capture、相機停用、放手速度與外部條件暫停規則 |
| 面板與模型狀態一致 | React state、effect 與事件處理 | `src/main.tsx`：q、setQ；`Lab.params` | 單一參數物件同步、單位、範圍、儲存、匯入與人為作功提示 |
| 獨立驗證物理 | TypeScript 型別、Vitest 自動測試 | `src/physics.ts`、`src/validation.ts`、`src/physics.test.ts` | 力方程、RK4、初始條件、週期量測與能量容差；套件不會自動求解物理 |
| 開發與正式打包 | Vite npm 模組解析與建置 | `package.json`、`package-lock.json`、`dist/` | 版本選擇、HTTP 啟動、教學功能與驗證 |
| 外觀與力學共用端點 | TypeScript 資料模型；Three.js 將端點轉成幾何 | `src/model.ts`：SpringModel.anchor、state.p；`src/physics.ts`：endpoints | 世界座標差 p−anchor、方向與長度，調整暫停、重設語意與近零長度子步進 |

更改外觀、材料、燈光與器材幾何請改 `src/scene.ts`，頁面樣式改 `src/style.css`；更改受力或積分規則請改 `src/physics.ts` 並重跑驗證。質量與彈性係數均來自 React 的同一份 q，傳入 Lab.params，沒有另設外觀用的假參數。

## 模型與限制

以 m、kg、s 為單位，預設 g=9.81 m/s²。掛點預設為世界 (0,2.8,0)，可調整；物理位置 state.p 與 anchor 均為世界座標。`endpoints(p,anchor)` 共用函式產生方向、長度與端點：受力與圈線幾何都使用同一函式及同一份模型資料。彈簧為無質量線性模型，允許拉伸與壓縮；質點三維平移，不求解自轉、碰撞、彈簧自重、圈線碰撞、非線性極限與支架變形。桌面僅視覺用途，砝碼可能穿過桌面。

Fₛ=−k(L−L₀)u，Fᵈ=−c(v·u)u，空氣阻力 Fᵃ=−bv，重力沿 −Y。RK4 外層固定步長 1/480 s，近零長度依完整步與兩個半步的誤差自適應細分（絕對誤差門檻 1e−10，遞迴上限 16）。這修正了移動掛點後高速穿越中心的數值增能。render 與 physics 分開；過長顯示幀只接受最多 0.05 s，背景切回後不追趕全部牆鐘時間。恰好零長度以明確向下方向避免除零，此奇異區域不代表真實彈簧。64 個參數角點與 8×64 個掛點/參數角點已檢查有限數值與能量增加；不是任意連續參數與無限時間的穩定性證明。

機械能 E=½m|v|²+½k(L−L₀)²+mgy，世界 Y=0（桌面）為固定的重力位能零點，避免掛點移動造成位能基準跟著移動。軸向阻尼不抑制純橫向速度，空氣阻力才沿完整速度耗能。掛點調整、拖曳、深度調整、重設與參數更改會改變能量，排除於守恆測試；新穩定性測試的能量基準從掛點調整完成後計算。

## 驗證與後續

完整實測值、模擬時間與容差見 `TEST_RESULTS.md` / `TEST_RESULTS.json`。TypeScript 檢查、Vitest 15 項與正式建置已通過；Vite 有非阻擋的 bundle 大小提示。512 組掛點搬移/參數測試各 12 秒，最大數值增能 0.0000349461 J，小於 0.001 J 容差。另有調整凍結、釋放恢復、手動暫停保留、重設、平移不變性與非原點零長度測試。

瀏覽器已實測 WebGL 場景、砝碼拖曳（放手後速度 0）、深度 Z 調整、暫停、參數修改、固定偏移、收合/展開、重設、初始視角，並檢視 1440 px 桌面與約 422 px 窄螢幕排版；主控台未見 error/warn。最終完整頁面截圖為 `PREVIEW.png`。JSON 驗證邏輯已自動測試；完整下載再匯入的瀏覽器往返與跨瀏覽器相容性尚未驗證。

本次新增掛點的瀏覽器實測：綠色掛點拖曳至約 (0.31,2.56,−0.14) m，彈簧與支架隨端點更新，釋放後繼續自由運動；砝碼拖曳後速度為 0；掛點 Z 滑桿可調到 0.8 m；重設後掛點 (0,2.8,0)、t=0、速度 0。主控台無 error/warn。截圖為 `ANCHOR_PREVIEW.png`。

較大實驗可把 `physics.ts` 移入 Web Worker：以 postMessage 傳入參數/操作指令，Worker 持有狀態與固定步進，以批次快照或 transferable buffer 返回位置，主執行緒插值渲染。IndexedDB 專案儲存、fflate 壓縮封裝、多元件組裝與碰撞系統為後續擴充，本次未實作。

資源網址、固定版本與授權見 `SOURCES.md`。本作品獨立撰寫，不依賴參考網站的編譯發布檔。
