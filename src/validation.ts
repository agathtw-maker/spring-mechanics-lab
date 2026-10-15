import {defaults,DT,initial,step,metrics,limits,type Params,type State} from './physics.ts';
import {anchorLimits,defaultAnchor} from './model.ts';
import type {Vec} from './physics.ts';
export type Result={test:string;duration:number;expected:number|string;actual:number; tolerance:string;pass:boolean};
export function validate():Result[]{
 const results:Result[]=[];const run=(q:Params,seconds:number,start:State,visit?:(s:State)=>void)=>{let s=start;for(let i=0;i<Math.round(seconds/DT);i++){s=step(s,q);visit?.(s);}return s;};
 const q={...defaults};const equilibrium=q.m*q.g/q.k;
 const rest=run(q,100,initial(q));const extension=metrics(rest,q).extension;
 results.push({test:'正阻尼靜置平衡',duration:100,expected:equilibrium,actual:extension,tolerance:'相對誤差 ≤ 3%',pass:Math.abs(extension-equilibrium)/equilibrium<=.03});
 function period(p:Params){const eq=p.l0+p.m*p.g/p.k;const start:State={p:[0,-eq-.03,0],v:[0,0,0],t:0};let previous=start.p[1]+eq;const crossings:number[]=[];run(p,20,start,s=>{const d=s.p[1]+eq;if(previous<0&&d>=0)crossings.push(s.t-DT+DT*(-previous)/(d-previous));previous=d;});return crossings.slice(1).reduce((a,t,i)=>a+t-crossings[i],0)/(crossings.length-1);}
 for(const [name,p] of [['預設無阻尼週期',{...q,c:0}],['質量加倍週期',{...q,m:2,c:0}],['k 加倍週期',{...q,k:40,c:0}]] as [string,Params][]){const expected=2*Math.PI*Math.sqrt(p.m/p.k),actual=period(p);results.push({test:name,duration:20,expected,actual,tolerance:'相對誤差 ≤ 3%',pass:Math.abs(actual-expected)/expected<=.03});}
 const dampingStart=initial(q);const amp0=.16;let lateAmp=0;run(q,40,dampingStart,s=>{if(s.t>35)lateAmp=Math.max(lateAmp,Math.abs(-s.p[1]-q.l0-equilibrium));});results.push({test:'正阻尼衰減，末 5 秒峰值',duration:40,expected:'小於初始振幅 10%',actual:lateAmp/amp0,tolerance:'振幅比例 < 0.1',pass:lateAmp/amp0<.1});
 const noDamp={...q,c:0};const start=initial(noDamp);const e0=metrics(start,noDamp).energy;let maxError=0;run(noDamp,120,start,s=>{maxError=Math.max(maxError,Math.abs(metrics(s,noDamp).energy-e0));});const scale=.5*q.k*.16**2;results.push({test:'無阻尼能量有界誤差（相對振動能量）',duration:120,expected:0,actual:maxError/scale,tolerance:'最大相對誤差 ≤ 0.1%',pass:maxError/scale<.001});
 // All 64 corners of the allowed six-dimensional parameter box, free 3D motion.
 let worstGrowth=0;let finite=true;for(let mask=0;mask<64;mask++){const p={} as Params;(Object.keys(limits) as (keyof Params)[]).forEach((key,i)=>p[key]=limits[key][(mask>>i)&1]);const s=initial(p);s.p[0]=.25;s.p[2]=.18;const E=metrics(s,p).energy;run(p,12,s,v=>{finite&&=[...v.p,...v.v].every(Number.isFinite);worstGrowth=Math.max(worstGrowth,metrics(v,p).energy-E);});}
 results.push({test:'64 個參數邊界組合三維穩定性',duration:12,expected:'有限數值；無持續增能',actual:worstGrowth,tolerance:'每組 12 秒；最大能量增加 < 0.001 J',pass:finite&&worstGrowth<.001});
 let anchorGrowth=0;let anchorFinite=true;
 for(let a=0;a<8;a++)for(let mask=0;mask<64;mask++){
  const anchor=anchorLimits.map((bounds,i)=>bounds[(a>>i)&1]) as Vec;const p={} as Params;
  (Object.keys(limits) as (keyof Params)[]).forEach((key,i)=>p[key]=limits[key][(mask>>i)&1]);
  let s=initial(p,defaultAnchor);s.p[0]+=.25;s.p[2]+=.18;
  // Instant anchor relocation with the mass fixed; external work is excluded.
  const E=metrics(s,p,anchor).energy;
  for(let i=0;i<12/DT;i++){s=step(s,p,DT,anchor);anchorFinite&&=[...s.p,...s.v].every(Number.isFinite);anchorGrowth=Math.max(anchorGrowth,metrics(s,p,anchor).energy-E);}
 }
 results.push({test:'8 個掛點角點 × 64 個參數角點，調整後釋放',duration:12,expected:'有限數值；釋放後無持續增能',actual:anchorGrowth,tolerance:'每組 12 秒；最大能量增加 < 0.001 J',pass:anchorFinite&&anchorGrowth<.001});
 return results;
}
