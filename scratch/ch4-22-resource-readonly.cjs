// Read-only single-string / constructed-tail audit, no BFS or game access.
const fs=require('fs');
const m=require('./ch4-22-readonly.cjs');
const full34='SSSSSDDDWWDWWDSAAASAXWWDWADDDWWWAW';
const exact36=m.replay(full34+'DX');
const wx=m.replay('WX',m.replay(full34).s);
const wdx=m.replay('WDX',m.replay(full34).s);
const cmp=z=>({boxes:z.b.map(b=>({orig:b.orig,r:b.r,c:b.c})),free:z.p,keys:z.keys,locks:z.locks});
const raw=JSON.parse(fs.readFileSync('artifacts/slot1-playthrough/4-22.json','utf8').replace(/^\uFEFF/,''));
const obs=raw.events[19].observation.level.timelines[0];
const actual=obs.entities.filter(e=>e.type==='BOX'||(e.type==='PLAYER'&&e.active)).map(e=>({id:e.id,type:e.type,r:e.pos,split:e.properties.split,key:e.properties.key,container:e.properties.container,active:e.active}));
// CONSTRUCTED, not reachable-prefix evidence: four rear empties + two front cargo.
// Top LOCK7,9 must already be opened by its cargo's own key before this seed.
const seed=JSON.parse(JSON.stringify(exact36.s));
const empty=seed.b.filter(b=>!b.c),cargo=seed.b.filter(b=>b.c);
empty.forEach((b,i)=>b.r=[3+i,9]);cargo.forEach((b,i)=>{b.r=[7+i,9];b.c.f='D';});
cargo[0].c.key=1;
seed.p=[{r:[2,9],f:'D',fork:0,key:2}];
const locks=m.t.entities.filter(e=>e.type==='LOCK');
seed.locks&=~(1<<locks.findIndex(e=>e.pos[0]===7&&e.pos[1]===9));
const finish=m.replay('DDDD',seed);
const trace=finish.trace.map(z=>({n:z.n,boxes:z.s.boxes.map(b=>({r:b.p,cargo:!!b.c,key:b.c?.key})),free:z.s.free}));
console.log(JSON.stringify({kind:'single-replay only; no search',actualEvent19:actual,WX:{valid:wx.valid,state:wx.valid?cmp(wx.s):null},DX:{valid:exact36.valid,state:exact36.valid?cmp(exact36.s):null},WDX:{valid:wdx.valid,state:wdx.valid?cmp(wdx.s):null},constructedDDDD:{valid:finish.valid,mask:finish.valid?m.mask(finish.s):0,trace}},null,2));
