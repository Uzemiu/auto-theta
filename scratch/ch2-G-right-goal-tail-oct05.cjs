// Public-map fixed proof for the isolated observer corridor. No Bridge/search.
const fs=require('fs'), assert=require('assert');
const d=JSON.parse(fs.readFileSync('artifacts/slot1-playthrough/2-G.json','utf8'));
const t=d.initial.level.timelines[0], key=p=>p.join(',');
const terrain=new Map(t.tiles.map(e=>[key(e.pos),e.type]));
for(const e of t.entities)if(e.floor&&!terrain.has(key(e.pos)))terrain.set(key(e.pos),e.type);
const walls=new Set(t.entities.filter(e=>e.active&&e.blockable&&e.type!=='BOX').map(e=>key(e.pos)));
const goals=t.entities.filter(e=>e.type==='GOAL').map(e=>e.pos).sort((a,b)=>a[1]-b[1]);
assert.deepStrictEqual(goals,[[14,4],[14,6],[14,8],[14,10]]);
for(let y=4;y<=10;y++){
 assert(terrain.has(`14,${y}`)&&!walls.has(`14,${y}`));
 assert(!['SPIKE','ICE','DARK'].includes(terrain.get(`14,${y}`)));
 assert(walls.has(`13,${y}`)&&walls.has(`15,${y}`));
}
assert(walls.has('14,3')&&walls.has('14,11'));
function route(y,g){assert(y>=4&&y<=10&&[4,6,8,10].includes(g));return (g>y?'W':'S').repeat(Math.abs(g-y));}
const rows=[];
for(let y=4;y<=10;y++){
 const paths={};
 for(const g of [4,6,8,10]){
  const s=route(y,g);let at=y;
  // Faces do not change the requested feasible cardinal move on this path.
  for(let face=0;face<4;face++){
   at=y;
   for(const a of s){at+=a==='W'?1:-1;assert(at>=4&&at<=10);assert(!walls.has(`14,${at}`));}
   assert.equal(at,g);
  }
  paths[g]=s;
 }
 rows.push({y,paths});
}
if(require.main===module)console.log(JSON.stringify({verified:true,rows,mechanics:['M027','M042'],scope:'only isolated P105 fixed navigation; no left dynamics or force propagation'}));
module.exports={route};
