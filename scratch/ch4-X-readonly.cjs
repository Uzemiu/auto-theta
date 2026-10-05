// Readonly sky geometry. No game input/API/save or KB writes; no BFS.
const fs=require('fs'),raw=JSON.parse(fs.readFileSync('artifacts/slot1-playthrough/4-X.json','utf8').replace(/^\uFEFF/,''));
const t=raw.initial.level.timelines[0],K=r=>r.join(','),V={W:[0,1],A:[-1,0],S:[0,-1],D:[1,0]},L={W:'A',A:'S',S:'D',D:'W'};
const floor=new Set([...t.tiles,...t.entities.filter(e=>e.floor)].map(e=>K(e.pos))),wall=new Set(t.entities.filter(e=>e.class==='Wall').map(e=>K(e.pos)));
const wrap=r=>r.map((x,i)=>((x-t.min_anchor[i])%(t.size[i]+1)+(t.size[i]+1))%(t.size[i]+1)+t.min_anchor[i]),add=(r,a)=>wrap(r.map((x,i)=>x+V[a][i])),ok=r=>floor.has(K(r))&&!wall.has(K(r));
const components=[];const left=new Set(floor);while(left.size){const seed=[...left][0],q=[seed];left.delete(seed);for(let i=0;i<q.length;i++){const p=q[i].split(',').map(Number);for(const a of 'WASD'){const k=K(add(p,a));if(left.has(k)&&ok(add(p,a))){left.delete(k);q.push(k);}}}components.push(q.map(k=>k.split(',').map(Number)));}
function ordinary(p,f,a){for(let i=0;i<4;i++,a=L[a]){const r=add(p,a);if(ok(r))return{r,f:a};}return{r:p,f:a};}
function split(p,f){const out=[];for(const a of [L[f],L[L[L[f]]],f]){const r=add(p,a);if(ok(r)&&!out.some(z=>K(z.r)===K(r)))out.push({r,f,fork:0});if(out.length===2)break;}return out.length?out:[{r:p,f,fork:0}];}
const player=t.entities.find(e=>e.type==='PLAYER'),prism=t.entities.find(e=>e.type==='PRISM'),sourceComponent=components.find(c=>c.some(r=>K(r)===K(player.pos)));
let p=player.pos,f='S';const trace=[];for(const a of 'AAAAAASSSSD'){const n=ordinary(p,f,a);p=n.r;f=n.f;trace.push({a,p,f});}
console.log(JSON.stringify({size:t.size,min:t.min_anchor,floorCount:floor.size,wallCount:wall.size,components,sourceComponentCount:sourceComponent.length,sourceComponent,prism:prism.pos,prismReachable:sourceComponent.some(r=>K(r)===K(prism.pos)),goals:raw.initial.level.goals,sourceGoals:raw.initial.level.goals.filter(g=>sourceComponent.some(r=>K(r)===K(g))),safe11:trace,conditionalX12:split(p,f),scope:'ordinary adjacent safe Floor and observed split adjacent Floor; toroidal size+1; no new optics/combination assumptions; no BFS'}));
