import {validate} from './src/validation.ts';
import {writeFileSync} from 'node:fs';
const results=validate();writeFileSync('TEST_RESULTS.json',JSON.stringify({date:'2026-10-14',method:'RK4, adaptive substeps near zero length',dt:1/480,results},null,2));
writeFileSync('TEST_RESULTS.md','# 實際物理測試結果\n\n2026-10-14；外層固定步長 1/480 s、RK4；近零長度使用自適應子步進。每列時間為模擬時間。前三項與能量測試為獨立垂直軸向實驗，空氣阻力和碰撞關閉。掛點調整、拖曳與參數變更不包含在能量測試；掛點測試的基準能量從搬移完成後起算。\n\n| 測試 | 模擬秒數 | 預期 | 實測 | 容許誤差 | 判定 |\n|---|---:|---|---:|---|---|\n'+results.map(r=>`| ${r.test} | ${r.duration} | ${r.expected} | ${r.actual.toPrecision(9)} | ${r.tolerance} | ${r.pass?'通過':'失敗'} |`).join('\n')+'\n\n參數邊界掃描是 64 個角點，另有 8 個掛點角點 × 64 參數組合，各 12 秒，不代表所有連續參數與任意時間的數學穩定性證明。\n');console.log(results);
