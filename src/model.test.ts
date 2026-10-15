import {it,expect} from 'vitest';
import {SpringModel,defaultAnchor,parseAnchor} from './model';
import {defaults,initial,endpoints,metrics,step,type Vec} from './physics';
it('掛點調整凍結時間與質點世界位置、釋放後使用新端點受力',()=>{
 const model=new SpringModel({...defaults});model.advance();const before=structuredClone(model.state);
 model.beginAnchorEdit();model.updateAnchor([.6,2.3,.4]);for(let i=0;i<480;i++)model.advance();
 expect(model.state).toEqual(before);expect(model.editingAnchor).toBe(true);
 const expected=step(before,model.params,undefined,model.anchor);model.endAnchorEdit();model.advance();
 expect(model.state).toEqual(expected);expect(model.state.p[0]).not.toBe(before.p[0]);
});
it('調整完成保留使用者手動暫停，重設恢復原掛點',()=>{
 const model=new SpringModel({...defaults});model.paused=true;model.beginAnchorEdit();model.updateAnchor([.6,2.3,.4]);model.endAnchorEdit();const frozen=structuredClone(model.state);model.advance();expect(model.state).toEqual(frozen);
 model.reset();expect(model.anchor).toEqual(defaultAnchor);expect(model.state).toEqual(initial(defaults,defaultAnchor));expect(model.editingAnchor).toBe(false);expect(model.paused).toBe(true);
});
it('端點同時平移不改變彈簧方向、長度與受力',()=>{
 const a:Vec=[.4,2.5,-.3],s=initial(defaults);const moved={...s,p:s.p.map((v,i)=>v+a[i]) as Vec};
 expect(endpoints(moved.p,a).L).toBeCloseTo(endpoints(s.p).L,12);
 const next=step(s,defaults),other=step(moved,defaults,undefined,a);other.v.forEach((v,i)=>expect(v).toBeCloseTo(next.v[i],12));
 expect(metrics(moved,defaults,a).extension).toBeCloseTo(metrics(s,defaults).extension,12);
});
it('非原點掛點與砝碼重合仍不產生 NaN',()=>{
 const a:Vec=[.3,2.4,.2];const s=step({p:[...a],v:[0,0,0],t:0},defaults,undefined,a);expect([...s.p,...s.v].every(Number.isFinite)).toBe(true);
});
it('拒絕無效掛點座標',()=>{expect(()=>parseAnchor([0,NaN,0])).toThrow();expect(()=>parseAnchor([0,9,0])).toThrow();});
