# 實際資源與用途

查閱日期：2026-10-14。未混用 CDN 與 npm 版本；OrbitControls 從同一 three 套件的 `three/addons/controls/OrbitControls.js` 匯入。完整傳遞相依版本以 package-lock.json 為準，授權原文保留於 node_modules 各套件。

| 資源 | 固定版本 | 授權 | 官方網址 / 文件 | 用途 |
|---|---|---|---|---|
| React / React DOM | 19.2.0 | MIT | https://github.com/facebook/react · https://react.dev/learn | 面板 state 與 DOM |
| Three.js | 0.180.0 | MIT | https://github.com/mrdoob/three.js · https://threejs.org/docs/ | WebGL、BufferGeometry、Raycaster、OrbitControls、材質與陰影 |
| TypeScript | 5.9.3 | Apache-2.0 | https://github.com/microsoft/TypeScript · https://www.typescriptlang.org/docs/ | 靜態型別檢查 |
| Vite | 7.1.7 | MIT | https://github.com/vitejs/vite · https://v7.vite.dev/guide/ | 本機預覽與正式打包，官方 Node 要求 20.19+ 或 22.12+ |
| Vitest | 3.2.4 | MIT | https://github.com/vitest-dev/vitest · https://vitest.dev/guide/ | 獨立物理與匯入驗證測試 |
| @types/react / @types/react-dom | 19.2.0 | MIT | https://github.com/DefinitelyTyped/DefinitelyTyped | React 型別 |
| @types/three | 0.180.0 | MIT | https://github.com/DefinitelyTyped/DefinitelyTyped | 對應 three 版本型別 |
| npm | 11.6.2 | Artistic-2.0 | https://registry.npmjs.org/npm/-/npm-11.6.2.tgz · https://github.com/npm/cli | 專案內套件管理工具 |
| Node.js | 24.19.0（環境已有） | MIT 與第三方授權 | https://nodejs.org/ | 執行工具與測試，不另外安裝 |

另查閱對應 Three.js 版本原始碼目錄：https://github.com/mrdoob/three.js/tree/r180 。桌面木紋由 `src/scene.ts` 以 CanvasTexture 程式產生。

GitHub Pages 部署參考（2026-10-16）：https://vite.dev/guide/static-deploy.html#github-pages 、https://docs.github.com/en/pages/getting-started-with-github-pages/using-custom-workflows-with-github-pages 。GitHub Actions 版本雜湊依 Vite 官方範例固定於 `.github/workflows/deploy.yml`；用途為依 lockfile 安裝、測試、建置與 Pages 發布。

參考作品：https://changyi123456.github.io/mechanics-laboratory-web/#/lab/mechanics 。工具開啟參考網址未能取得頁面內容；未複製程式、素材或其編譯發布檔，也不聲稱已完整檢視參考作品。視覺器材與場景均以本次 Three.js 幾何自行建立。未使用外部圖片、字型或 Lucide 圖示。
