// Fixed-only audit of an authorized normal 16-input probe deployment.
// Reads the public journal; no game, save, search, or canonical calls.
const fs=require('fs'),assert=require('assert');
const {createModel}=require('./ch2-G-m045-model-oct05.cjs');
const rec=JSON.parse(fs.readFileSync('artifacts/slot1-playthrough/2-G.json','utf8').replace(/^\uFEFF/,''));
const prefix='AWWWSSAAWWWWWWWAADADSDSAADSSAWDWAWDWAWDSSSSSSSSAWWDWAAWWDDASDSAA';
const tail='WDWDASSAWWWWDWAD',n=Number(process.argv[2]||0);
assert(n>=0&&n<=16);
const m=createModel(rec.initial),f=m.replay(prefix);assert(f.valid);
let s=f.state,y=6,face=2;
for(const a of tail.slice(0,n)){
 const r=m.next(s,m.A.indexOf(a),{find_probe:true,strictCross:true});
 assert(r&&!r.probe&&!r.conflict,'earlier unknown');s=r;
 let dy='WD'.includes(a)?1:-1;if(y+dy<4||y+dy>10)dy=-dy;y+=dy;face=dy>0?0:2;
}
const observations=rec.events.map((e,i)=>({o:e.observation,i})).filter(e=>e.o?.level?.id==='chord');
const {o,i}=observations.at(-1),l=o.level,t=l.timelines.find(z=>z.id===l.current_timeline)||l.timelines[0];
assert.equal(l.instructions,prefix+tail.slice(0,n));assert.equal(l.timelines.length,1);
assert(!l.busy&&!l.input_locked&&!l.paused&&!l.dialog);
const es=new Map(t.entities.map(e=>[e.id,e]));
for(const p of s.p){const e=es.get(p.id);assert(e.active);assert.deepEqual(e.pos,[p.x,p.y]);assert.equal(e.properties.face,p.face);assert.equal(e.properties.ghost,0);assert.equal(e.properties.contained,0);}
for(const b of s.b){const e=es.get(b.id);assert(e.active);assert.deepEqual(e.pos,[b.x,b.y]);assert.equal(e.properties.contained,0);assert.equal(e.properties.height,1);}
const right=es.get(105);assert(right.active);assert.deepEqual(right.pos,[14,y]);assert.equal(right.properties.face,face);assert.equal(right.properties.ghost,0);assert.equal(right.properties.contained,0);
assert.equal(t.entities.filter(e=>e.type==='PLAYER'&&e.active).length,s.p.length+1);
console.log(JSON.stringify({match:true,event:i,inputCount:64+n,time:t.time,players:m.describe(s).players,right:{at:right.pos,face},boxes:m.describe(s).boxes,next:tail.slice(n)}));
