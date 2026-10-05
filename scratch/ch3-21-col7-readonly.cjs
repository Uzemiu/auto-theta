// Read-only COL7 static structure. Ordinary observations only; no input.
const fs=require('fs'),r=JSON.parse(fs.readFileSync('artifacts/slot1-playthrough/3-21.json','utf8').replace(/^\uFEFF/,''));
const t=r.initial.level.timelines[0],K=p=>p.join(','),V=[[0,1],[-1,0],[0,-1],[1,0]],es=t.entities.filter(e=>e.active);
const walls=new Set(es.filter(e=>e.blockable&&!e.pushable&&e.type!=='BUTTONGATE').map(e=>K(e.pos)));
const safe=new Set([...t.tiles.filter(e=>e.type==='SOLID'),...es.filter(e=>e.floor)].map(e=>K(e.pos))),floor=new Set([...t.tiles,...es.filter(e=>e.floor)].map(e=>K(e.pos)));
function component(start){const q=[start],seen=new Set([K(start)]);for(let i=0;i<q.length;i++)for(const v of V){const n=[q[i][0]+v[0],q[i][1]+v[1]],k=K(n);if(safe.has(k)&&!walls.has(k)&&!seen.has(k)){seen.add(k);q.push(n);}}return [...seen].sort();}
const alive=component([1,1]),star=component([2,6]);
function cell(p){return {at:p,tiles:t.tiles.filter(e=>K(e.pos)===K(p)).map(e=>e.type),entities:es.filter(e=>K(e.pos)===K(p)).map(e=>({type:e.type,class:e.class,blockable:e.blockable,pushable:e.pushable}))};}
console.log(JSON.stringify({model:'static optimistic alive-floor components; both gates open, PRISM removed; DARK on SOLID allowed; SPIKE crossing not alive',source:'actual original initial imprison',alive_component:alive.length,star_component:star,aliveCanReachStar:alive.includes('2,6'),boundary:[cell([2,11]),cell([1,11]),cell([3,11]),cell([2,10])],
 buttonPocket:[cell([6,11]),cell([6,10]),cell([6,12]),cell([7,11])],goal:'8,1',prism:'5,5',limitations:'Not a full ghost/cargo/optics/stack planner; no claim of global game impossibility.'}));
