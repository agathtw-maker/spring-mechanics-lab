# 正式發布紀錄

- 驗證日期：2026-10-16（Asia/Taipei）。
- 公開網站：https://agathtw-maker.github.io/spring-mechanics-lab/
- 原始碼：https://github.com/agathtw-maker/spring-mechanics-lab
- 首次部署版本：b5af70185977df2ee3b30338318179b4fae99635。
- 成功流程：https://github.com/agathtw-maker/spring-mechanics-lab/actions/runs/38767871928 （52 秒，build / deploy 均成功）。

## 已實測

雲端以 lockfile 執行 npm ci，TypeScript 檢查、15 項 Vitest 與 Vite 正式建置皆通過。21 個文字原始檔與本機內容逐檔比對相同（僅正規化換行）。

公開 HTTPS 首頁、JavaScript 與 CSS 均回應 HTTP 200。瀏覽器實際呈現 Three.js 場景、連續更新的讀值及曲線；已操作暫停、掛點 X 鍵盤調整、收合與展開、重設，以及質量 1 → 2 → 1 kg。質量 2 kg 時公式顯示平衡伸長 0.9810 m、週期 1.987 s；重設後掛點為 (0, 2.8, 0) m、時間及速度為零。正式網站載入後未觀察到應用程式 error / warn。

拖曳掛點與砝碼已於本機版本實測，詳見 README；本次部署後的檢查以資源載入與控制面板為主，未重做完整拖曳、JSON 下載匯入往返或跨瀏覽器測試。物理驗證的模擬時間、誤差與限制見 TEST_RESULTS.md。

## 後續更新與可用性

將變更提交到此儲存庫 main，GitHub Actions 會重新檢查、建置與部署；本機資料夾的修改仍須提交到 GitHub 才會公開更新。網站由 GitHub Pages 提供，不需要本機開發伺服器或電腦持續開機。保留儲存庫與 Pages 設定即可持續提供服務；主機服務中斷、網路與帳號政策仍可能影響可用性，無法保證永久零中斷。

參數保存在每位訪客自己的瀏覽器，localhost 的既有參數可透過 JSON 匯出再匯入正式網址；網站不含伺服器資料庫。
