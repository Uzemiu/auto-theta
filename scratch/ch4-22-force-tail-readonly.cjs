// Read-only new domain: actual34+X force leaves -> ordinary arbitrary Goal union.
// Geometry/step are reused from the public-observation model, not an independent engine.
// No game input, hidden implementation, save, canonical KB, or journal writes.
const fs = require('fs');
const base = require('./ch4-22-readonly.cjs');
const raw = JSON.parse(fs.readFileSync('artifacts/slot1-playthrough/4-22.json', 'utf8').replace(/^\uFEFF/, ''));
const prefix = 'SSSSSDDDWWDWWDSAAASAXWWDWADDDWWWAWX';
const eq = (a, b) => a[0] === b[0] && a[1] === b[1];
const copy = x => JSON.parse(JSON.stringify(x));
let source = null;
for (let i = raw.events.length - 1; i >= 0; i--) {
  const o = raw.events[i].observation;
  if (o?.level?.id === 'erosion' && o.level.instructions === prefix) {
    source = { event: i, o }; break;
  }
}
if (!source) {
  console.log(JSON.stringify({ status: 'awaiting-actual34-X', prefix, searchStarted: false }));
  process.exit(0);
}
const cap = Number(process.argv[2] || 8000), depth = Number(process.argv[3] || 45);
const active = e => e.active && !e.properties.maskedoff;
const initialKeys = base.t.entities.filter(e => e.type === 'KEY');
const initialLocks = base.t.entities.filter(e => e.type === 'LOCK');
function state(t) {
  const alive = t.entities.filter(active), players = alive.filter(e => e.type === 'PLAYER');
  const boxes = alive.filter(e => e.type === 'BOX').map(e => {
    const cargo = players.find(p => p.properties.contained && p.properties.container === e.id);
    // No new Box overlap is propagated; label is the observed physical Box ID.
    return { r: e.pos, orig: e.id, color: e.details.Color,
      c: cargo ? { f: ['W','A','S','D'][cargo.properties.face], fork: cargo.properties.split,
        key: cargo.properties.key, ghost: cargo.properties.ghost } : null };
  });
  let keys = 0, locks = 0;
  initialKeys.forEach((e, i) => { if (alive.some(z => z.type === 'KEY' && eq(z.pos, e.pos))) keys |= 1 << i; });
  initialLocks.forEach((e, i) => { if (alive.some(z => z.type === 'LOCK' && eq(z.pos, e.pos) && z.blockable)) locks |= 1 << i; });
  return { b: boxes, p: players.filter(p => !p.properties.contained).map(p => ({ r: p.pos,
    f: ['W','A','S','D'][p.properties.face], fork: p.properties.split, key: p.properties.key })), keys, locks };
}
const seeds = source.o.level.timelines.map(t => ({ id: t.id, axis: t.axis, time: t.time, s: state(t) }));
if (process.argv[2] === '--replay') {
  const axis=Number(process.argv[3]), path=process.argv[4]||'', seed=seeds.find(z=>z.axis[0]===axis);
  if (!seed) throw new Error('Unknown observed axis');
  let s=copy(seed.s),valid=true;const trace=[];
  for(let i=0;i<path.length;i++) {const os=base.step(s,path[i],path.slice(0,i+1));if(os.length!==1||os[0].axis){valid=false;trace.push({step:i+1,boundary:true,branches:os.length});break;}s=os[0].s;trace.push({step:i+1,a:path[i],s:base.summary(s)});}
  console.log(JSON.stringify({sourceEvent:source.event,axis:seed.axis,path,valid,trace},null,2));process.exit(0);
}
if (process.argv.includes('--seeds')) {
  console.log(JSON.stringify({ sourceEvent: source.event, prefix, seeds: seeds.map(z => ({ ...z, s: base.summary(z.s) })) }, null, 2));
  process.exit(0);
}
const q = [], seen = seeds.map(() => new Set()), outcomes = seeds.map(() => new Map());
for (let i = 0; i < seeds.length; i++) { q.push({ s: seeds[i].s, path: '', leaf: i }); seen[i].add(base.hash(seeds[i].s)); }
let expanded = 0, at = 0, cut = 0, lost = 0, conflictBoundary = 0, ghostBoundary = 0;
const samples = [], targets = [ [11,9], [12,9] ];
function mask(s) { return targets.reduce((m, p, i) => m | (s.p.some(a => eq(a.r,p)) || s.b.some(b => b.c && !b.c.ghost && eq(b.r,p)) ? 1 << i : 0), 0); }
function unionHit() {
  for (let a = 0; a < outcomes.length; a++) for (let b = a + 1; b < outcomes.length; b++)
    for (const [ma, za] of outcomes[a]) for (const [mb, zb] of outcomes[b]) if ((ma | mb) === 3)
      return { kind: 'actual-X-leaf-union', leaves: [{ axis: seeds[a].axis, ...za }, { axis: seeds[b].axis, ...zb }] };
  return null;
}
let hit = null;
const milestones = seeds.map(() => ({ blueCapture:null, freeAt2_9:null, maxCargoX9:-1, furthestCargo9:null }));
while (at < q.length && expanded < cap) {
  const z = q[at++]; expanded++;
  const ms=milestones[z.leaf];
  if (!ms.blueCapture && z.s.b.some(b=>b.color===3 && b.c && !b.c.ghost)) ms.blueCapture={path:z.path,s:base.summary(z.s)};
  if (!ms.freeAt2_9 && z.s.p.some(p=>eq(p.r,[2,9]))) ms.freeAt2_9={path:z.path,s:base.summary(z.s)};
  for (const b of z.s.b.filter(b=>b.c && !b.c.ghost && b.r[1]===9)) if (b.r[0]>ms.maxCargoX9) {ms.maxCargoX9=b.r[0];ms.furthestCargo9={path:z.path,s:base.summary(z.s)};}
  const gm = mask(z.s);
  if (gm && !outcomes[z.leaf].has(gm)) outcomes[z.leaf].set(gm, { path: z.path, mask: gm, s: base.summary(z.s) });
  if (gm === 3) { hit = { kind: 'single-leaf-all-goals', axis: seeds[z.leaf].axis, path: z.path, s: base.summary(z.s) }; break; }
  hit = unionHit(); if (hit) break;
  if (z.path.length >= depth) { cut++; continue; }
  if (!z.s.p.length) { lost++; continue; }
  for (const a of 'WASD') {
    const os = base.step(z.s, a, z.path + a);
    for (const o of os) {
      if (o.axis) { conflictBoundary++; if (samples.length < 5) samples.push({ axis: seeds[z.leaf].axis, path: z.path+a, kind: 'ordinary-force-boundary' }); continue; }
      if (o.s.b.some(b => b.c?.ghost)) { ghostBoundary++; continue; }
      const h = base.hash(o.s);
      if (seen[z.leaf].has(h)) continue;
      seen[z.leaf].add(h); q.push({ s: o.s, path: z.path+a, leaf: z.leaf });
    }
  }
}
console.log(JSON.stringify({ sourceEvent: source.event, prefix, seeds: seeds.map(z => ({ id:z.id,axis:z.axis,time:z.time,s:base.summary(z.s) })),
  expanded, seen: seen.reduce((n,s)=>n+s.size,0), pending:q.length-at, exhausted:at===q.length,
  depthLimit:depth, cap, depthCut:cut, lost, conflictBoundary, ghostBoundary,
  perLeaf: seeds.map((z,i)=>({axis:z.axis, seen:seen[i].size, outcomes:[...outcomes[i].values()]})), hit, samples,
  milestones,
  scope: 'actual34+X observed leaves, WASD only, all Box rows, exact observed Wall/Floor/locks/cargo-key, arbitrary two-Goal masks across existing leaves. No new X/stack/ordinary force-conflict/ghost propagation. Reused base engine; masked/inactive entities excluded. No game actions.'
}, null, 2));
