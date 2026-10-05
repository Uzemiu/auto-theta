// Own read-only ordinary prefix + explicit cargo-X geometry; shared births are UNKNOWN, never assumed merged.
const fs=require('fs'),raw=JSON.parse(fs.readFileSync('artifacts/slot1-playthrough/4-14.json','utf8').replace(/^\uFEFF/,'')),t=raw.initial.level.timelines[0];
const wall=new Set(t.entities.filter(e=>e.class==='Wall').map(e=>e.pos.join(','))),spike=new Set(t.tiles.filter(e=>e.type==='SPIKE').map(e=>e.pos.join(',')));
const v={W:[0,1],A:[-1,0],S:[0,-1],D:[1,0]},left={W:'A',A:'S',S:'D',D:'W'},key=p=>p.join(','),add=(p,d)=>[p[0]+v[d][0],p[1]+v[d][1]];
let b=t.entities.filter(e=>e.type==='BOX').map(e=>({id:e.id,r:e.pos,color:e.details.Color})),free=t.entities.find(e=>e.type==='PLAYER'&&!e.properties.contained).pos;
let cargos=t.entities.filter(e=>e.type==='PLAYER'&&e.properties.contained).map(e=>({r:e.pos,f:'S',fork:e.properties.split}));
function chain(r,d,moves){if(wall.has(key(r)))return false;let box=b.find(e=>key(e.r)===key(r));if(!box)return true;if(!chain(add(r,d),d,moves))return false;moves.push({box,to:add(r,d)});return true;}
function ordinary(a){for(let c of cargos)c.f=a;if(!free)return;let d=a,moves=[],r;
 for(let i=0;i<4;i++,d=left[d]){r=add(free,d);moves=[];if(chain(r,d,moves)){for(let m of moves){let old=key(m.box.r);for(let c of cargos)if(key(c.r)===old)c.r=m.to;m.box.r=m.to;}free=r;if(spike.has(key(free)))free=null;return;}}}
function cloneGeometry(){let newborn=[],pushes=[];for(let c of cargos){let l=left[c.f],opts=[l,left[left[l]],c.f],valid=[];
 for(let d of opts){let r=add(c.r,d);if(wall.has(key(r)))continue;let blue=b.find(e=>e.color===3&&key(e.r)===key(r));if(blue){let dest=add(r,d);if(wall.has(key(dest)))continue;pushes.push({blue,to:dest});}
 valid.push({r,f:c.f,fork:c.fork-1});if(valid.length===2)break;}
 if(!valid.length)valid=[{...c,fork:c.fork-1}];newborn.push(...valid);}
 for(let p of pushes)p.blue.r=p.to;b=b.filter(e=>e.color!==4);cargos=newborn;
 let count=new Map();for(let c of cargos)count.set(key(c.r),(count.get(key(c.r))||0)+1);console.log('SHARED_BIRTH_UNKNOWN',Object.fromEntries([...count].filter(([k,v])=>v>1)));}
const path=process.argv[2]||'SWWWSSAAWWWWAXWXX';console.log('INITIAL',JSON.stringify({b,free,cargos}));
for(let i=0;i<path.length;i++){let a=path[i];if(a==='X')cloneGeometry();else ordinary(a);console.log(i+1,a,JSON.stringify({b,free,cargos}));}
const goal=t.entities.filter(e=>e.type==='GOAL').map(e=>key(e.pos));console.log('GEOMETRIC_GOAL_COVER_ONLY',goal.filter(g=>cargos.some(c=>key(c.r)===g)), 'ACTUAL_COMPLETION_NOT_ASSUMED');
