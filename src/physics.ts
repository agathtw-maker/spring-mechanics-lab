export type Vec = [number, number, number];
export type Params = {m:number;k:number;l0:number;c:number;b:number;g:number};
export type State = {p:Vec;v:Vec;t:number};
export const defaults:Params={m:1,k:20,l0:0.5,c:0.2,b:0,g:9.81};
export const limits:Record<keyof Params,[number,number]>={m:[0.5,2],k:[15,60],l0:[0.3,0.8],c:[0,3],b:[0,1],g:[0,9.81]};
export const DT=1/480;
export const length=(p:Vec)=>Math.hypot(...p);
export const origin:Vec=[0,0,0];
export const initial=(q:Params,anchor:Vec=origin):State=>({p:[anchor[0],anchor[1]-(q.l0+q.m*q.g/q.k+0.16),anchor[2]],v:[0,0,0],t:0});
// Shared endpoint geometry for both force calculation and the renderer.
export function endpoints(p:Vec,anchor:Vec=origin){const delta=p.map((v,i)=>v-anchor[i]) as Vec;const L=length(delta);const u=(L>1e-8?delta.map(v=>v/L):[0,-1,0]) as Vec;return {anchor,p,delta,L,u};}
export function parseParams(input:unknown):Params {
 if(!input || typeof input!=='object') throw Error('參數必須是 JSON 物件');
 const q={} as Params;
 for(const key of Object.keys(defaults) as (keyof Params)[]){const v=(input as Params)[key];const [lo,hi]=limits[key];if(typeof v!=='number'||!Number.isFinite(v)||v<lo||v>hi)throw Error(`${key} 須介於 ${lo} 與 ${hi}`);q[key]=v;}
 return q;
}
function derivative(y:number[],q:Params,anchor:Vec):number[]{
 const {L,u}=endpoints(y.slice(0,3) as Vec,anchor);
 const axial=y[3]*u[0]+y[4]*u[1]+y[5]*u[2];const f=-q.k*(L-q.l0)-q.c*axial;
 return [y[3],y[4],y[5],(f*u[0]-q.b*y[3])/q.m,(f*u[1]-q.b*y[4])/q.m-q.g,(f*u[2]-q.b*y[5])/q.m];
}
function rk4(s:State,q:Params,h:number,anchor:Vec):State{
 const y=[...s.p,...s.v];const a=derivative(y,q,anchor);const b=derivative(y.map((v,i)=>v+h*a[i]/2),q,anchor);const c=derivative(y.map((v,i)=>v+h*b[i]/2),q,anchor);const d=derivative(y.map((v,i)=>v+h*c[i]),q,anchor);
 const n=y.map((v,i)=>v+h*(a[i]+2*b[i]+2*c[i]+d[i])/6);
 return {p:n.slice(0,3) as Vec,v:n.slice(3) as Vec,t:s.t+h};
}
function refine(s:State,q:Params,h:number,anchor:Vec,depth=0):State{
 const full=rk4(s,q,h,anchor),half=rk4(s,q,h/2,anchor),two=rk4(half,q,h/2,anchor);
 const error=Math.max(...full.p.map((v,i)=>Math.abs(v-two.p[i])),...full.v.map((v,i)=>Math.abs(v-two.v[i])));
 if(error<=1e-10||depth>=16)return two;
 const middle=refine(s,q,h/2,anchor,depth+1);return refine(middle,q,h/2,anchor,depth+1);
}
export function step(s:State,q:Params,h=DT,anchor:Vec=origin):State{
 // The direction changes rapidly near L=0. Keep fixed outer time steps,
 // but resolve the nonsmooth central-force crossing with bounded substeps.
 const {L}=endpoints(s.p,anchor);const reach=length(s.v)*h+0.5*(q.k*q.l0/q.m+q.g)*h*h;
 return L<.04+2*reach?refine(s,q,h,anchor):rk4(s,q,h,anchor);
}
export function metrics(s:State,q:Params,anchor:Vec=origin){const {L}=endpoints(s.p,anchor);return {L,extension:L-q.l0,speed:length(s.v),energy:0.5*q.m*length(s.v)**2+0.5*q.k*(L-q.l0)**2+q.m*q.g*s.p[1]};}
