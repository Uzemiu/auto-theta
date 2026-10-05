// Readonly public-observation model only. No game, bridge, UI, save or hidden code.
// New domain: true initial -> WASD only -> one LIVE FREE carrying both Forks.
// Uses the already public snail step; no x1/row1/corner pruning whatsoever.
const fs = require('fs');
const base = require('./ch4-10-fork-stagger-tail-oct05.cjs');
const raw = JSON.parse(fs.readFileSync('artifacts/slot1-playthrough/4-10.json', 'utf8').replace(/^\uFEFF/, ''));
const cp = x => JSON.parse(JSON.stringify(x));
const K = r => r.join(',');
const dirs = { W:[0,1], A:[-1,0], S:[0,-1], D:[1,0] };
const opp = { W:'S', A:'D', S:'W', D:'A' };
const plus = (r,d) => [r[0]+dirs[d][0],r[1]+dirs[d][1]];
const t = raw.initial.level.timelines[0];
const E = t.entities.filter(e => e.active);
const faces = ['W','A','S','D'];
const source = {
  b:E.filter(e=>e.type==='BOX').map(e=>({id:e.id,orig:e.id,r:e.pos,color:e.details.Color})),
  p:E.filter(e=>e.type==='PLAYER').map(e=>({id:e.id,r:e.pos,f:faces[e.properties.face],fork:e.properties.split,k:e.properties.key,c:e.properties.contained?e.properties.container:-1,ghost:e.properties.ghost,h:e.properties.height})),
  items:E.filter(e=>e.type==='KEY').map(e=>e.id),
  lock:E.some(e=>e.type==='LOCK'&&e.blockable)
};
const walls = new Set(E.filter(e=>e.class==='Wall').map(e=>K(e.pos)));
const floor = new Set([...t.tiles,...E.filter(e=>e.floor)].map(e=>K(e.pos)));
const spike = new Set(t.tiles.filter(t=>t.type==='SPIKE').map(t=>K(t.pos)));
const gates = [[3,4],[4,5],[4,1],[1,4]];
const target = s => s.p.length===1 && s.p[0].c<0 && !s.p[0].ghost && s.p[0].fork>=2;
const hash = s => s.b.map(b=>K(b.r)).sort().join('|')+'#'+s.p.map(p=>[K(p.r),p.fork,p.k,p.c,p.ghost].join(':')).join('|')+'#'+s.items.slice().sort((a,b)=>a-b).join(',')+'#'+s.lock;
function compact(s) { return {p:s.p,boxes:s.b.map(b=>({id:b.id,r:b.r})),activeItems:s.items,lockClosed:s.lock,gates:base.go(s)}; }
function fixed(path,start=source) {
  if (/[^WASD]/.test(path)) throw Error('Only ordinary inputs allowed');
  let s=cp(start),trace=[{n:0,a:'',...compact(s)}];
  for(let i=0;i<path.length;i++) {
    s=base.step(s,path[i],path.slice(0,i+1));
    if(!s) return {valid:false,failed:i+1,trace};
    trace.push({n:i+1,a:path[i],...compact(s)});
  }
  return {valid:true,target:target(s),path,length:path.length,s,trace};
}
function pathOf(q,i) {let p='';while(q[i].parent>=0){p=q[i].a+p;i=q[i].parent;}return p;}
function search(cap=6000,depth=45) {
  const q=[{s:cp(source),parent:-1,a:'',depth:0}],seen=new Set([hash(source)]);
  let head=0,expanded=0,depthCut=0,hit=null,maxFork=0;
  const stats={nullBoundary:0,lostSingleFree:0,nonFreeOrGhost:0,duplicate:0};
  let firstFork1=null,firstButtonBox=null,firstKey=null;
  while(head<q.length && expanded<cap) {
    const i=head++,z=q[i];expanded++;maxFork=Math.max(maxFork,z.s.p[0].fork);
    const path=pathOf(q,i);
    if(!firstFork1&&z.s.p[0].fork===1)firstFork1={path,...compact(z.s)};
    if(!firstButtonBox&&z.s.b.some(b=>K(b.r)==='1,1'))firstButtonBox={path,...compact(z.s)};
    if(!firstKey&&z.s.p[0].k>0)firstKey={path,...compact(z.s)};
    if(target(z.s)){hit={path,length:path.length,s:cp(z.s),fixed:fixed(path)};break;}
    if(z.depth>=depth){depthCut++;continue;}
    for(const a of 'WASD') {
      const n=base.step(z.s,a,path+a);
      if(!n){stats.nullBoundary++;continue;}
      if(n.p.length!==1){stats.lostSingleFree++;continue;}
      if(n.p[0].c>=0||n.p[0].ghost){stats.nonFreeOrGhost++;continue;}
      if(n.b.length!==3)throw Error('Ordinary domain changed BOX count');
      const k=hash(n);if(seen.has(k)){stats.duplicate++;continue;}
      seen.add(k);q.push({s:n,parent:i,a,depth:z.depth+1});
    }
  }
  return {cap,depth,expanded,seen:seen.size,pending:q.length-head,depthCut,exhausted:head===q.length,stoppedOnHit:!!hit,maxFork,stats,firstFork1,firstButtonBox,firstKey,hit,liveHandle:null,scope:'Single true-initial free, WASD only; all x1/row1 and ordinary corners allowed; three BOX identity/positions retained for replay but equal-color geometric dedup; no X, no second actor, no first-X old source. One BFS cap6000/depth45, stop first Fork2.'};
}
// Static local feasibility only: assumes a hypothetical LIVE FREE at pusher.
// Does not certify that the pusher can navigate there. Captures/extra X excluded.
function pushAudit(s,lockOverride=s.lock) {
  const g=base.go(s),byPos=new Map(s.b.map(b=>[K(b.r),b]));
  function terrain(r,allowSpike=false) {
    const k=K(r);if(walls.has(k)||!floor.has(k))return false;
    const i=gates.findIndex(q=>K(q)===k);if(i>=0&&!g[i])return false;
    if(lockOverride&&k==='7,4')return false;
    return allowSpike||!spike.has(k);
  }
  function canChain(r,d,visited=new Set()) {
    if(!terrain(r,true))return false;
    const b=byPos.get(K(r));if(!b)return true;
    if(visited.has(b.id))return false;
    visited.add(b.id);return canChain(plus(r,d),d,visited);
  }
  return s.b.map(b=>({id:b.id,r:b.r,localSafePusherDirections:Object.keys(dirs).filter(d=> {
    const p=plus(b.r,opp[d]);return terrain(p)&&!byPos.has(K(p))&&canChain(plus(b.r,d),d);
  })}));
}
const manual='SDWWDDDSAAWASSSAWAWWW';
if(require.main===module) {
  const mode=process.argv[2]||'search';
  const result=mode==='search'?search():fixed(process.argv[3]||manual);
  const end=result.hit?.s||result.s;
  console.log(JSON.stringify({mode,source:compact(source),initialFrame:raw.initial.frame,result,pushAudit:end?{currentClosedLock:pushAudit(end),hypotheticallyOpenLock:pushAudit(end,false)}:null},null,2));
}
module.exports={source,fixed,search,target,pushAudit,compact,manual};
