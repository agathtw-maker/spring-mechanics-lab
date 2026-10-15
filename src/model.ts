import {DT,initial,step,type Params,type Vec,type State} from './physics.ts';
export const defaultAnchor:Vec=[0,2.8,0];
export const anchorLimits:[number,number][]=[[-.5,.8],[2.2,3.3],[-.8,.8]];
export function parseAnchor(value:unknown):Vec{
 if(!Array.isArray(value)||value.length!==3||value.some((v,i)=>typeof v!=='number'||!Number.isFinite(v)||v<anchorLimits[i][0]||v>anchorLimits[i][1]))throw Error('掛點座標超出允許範圍');
 return [...value] as Vec;
}
export class SpringModel {
 state:State;params:Params;anchor:Vec=[...defaultAnchor];paused=false;dragging=false;editingAnchor=false;
 constructor(params:Params){this.params=params;this.state=initial(params,this.anchor);}
 beginAnchorEdit(){this.editingAnchor=true;}
 updateAnchor(anchor:Vec){this.anchor=parseAnchor(anchor);}
 endAnchorEdit(){this.editingAnchor=false;}
 advance(h=DT){if(!this.paused&&!this.dragging&&!this.editingAnchor)this.state=step(this.state,this.params,h,this.anchor);}
 reset(){this.anchor=[...defaultAnchor];this.state=initial(this.params,this.anchor);this.dragging=false;this.editingAnchor=false;}
 excite(){this.state=initial(this.params,this.anchor);this.paused=false;this.dragging=false;this.editingAnchor=false;}
}
