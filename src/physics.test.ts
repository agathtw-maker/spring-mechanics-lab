import {describe,it,expect} from 'vitest';
import {validate} from './validation';
import {defaults,step,parseParams} from './physics';
describe('獨立垂直物理驗證與三維參數穩定性',()=>{for(const r of validate())it(r.test,()=>{console.log(JSON.stringify(r));expect(r.pass,JSON.stringify(r)).toBe(true);});});
it('接近零長度仍為有限數值',()=>{const s=step({p:[0,0,0],v:[0,0,0],t:0},defaults);expect([...s.p,...s.v].every(Number.isFinite)).toBe(true);});
it('匯入拒絕 NaN 與超出測試範圍的參數',()=>{expect(()=>parseParams({...defaults,m:NaN})).toThrow();expect(()=>parseParams({...defaults,k:10000})).toThrow();});
