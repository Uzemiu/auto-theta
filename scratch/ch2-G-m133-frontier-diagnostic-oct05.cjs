// Read-only computational checkpoint diagnostic. No game calls or graph search.
const fs = require('fs'), v8 = require('v8');
const path = 'artifacts/solver-frontiers/m131-model60-current.v8';
const z = v8.deserialize(fs.readFileSync(path));
const counts = {};
for (const n of z.heap) {
  const node = z.q[n], left = node.s.p.filter(p => p.active && p.id !== 105).length;
  const row = counts[left] ||= { pending: 0, minDepth: Infinity, minScore: Infinity, maxDepth: 0, scoreDepth: null };
  row.pending++;
  row.minDepth = Math.min(row.minDepth, node.depth);
  row.maxDepth = Math.max(row.maxDepth, node.depth);
  if (node.score < row.minScore) { row.minScore = node.score; row.scoreDepth = node.depth; }
}
console.log(JSON.stringify({ checkpointVersion: z.version, expanded: z.expanded, seen: z.seen.size, pending: z.heap.length, depthCut: z.depthCut, maxDepth: z.maxDepth, byFunctionalLeft: counts }));
if (process.argv.includes('--fixtures')) {
  for (const [key, b] of Object.entries(z.boundaries).filter(([key]) => key.endsWith('/preLeftAtLeast3'))) {
    console.log(JSON.stringify({ key, sequence: b.sequence, leftBefore: b.leftBefore, pre: b.pre, result: b.result }));
  }
}
if (process.argv.includes('--old80S')) {
  const j = JSON.parse(fs.readFileSync('artifacts/slot1-playthrough/2-G.json', 'utf8').replace(/^\uFEFF/, ''));
  const { createModel } = require('./ch2-G-m133-source-model-oct05.cjs');
  const old = createModel(j.events[100].observation), result = old.step(old.start, 2);
  if (!result.valid || result.leaves.length !== 1) throw Error('Old80+S fixed fixture mismatch');
  const target = result.leaves[0].state, o = j.events[74].observation;
  const terrain = new Map(o.level.timelines[0].tiles.map(e => [e.pos.join(','), e.type]));
  for (const e of o.level.timelines[0].entities) if (e.floor && !terrain.has(e.pos.join(','))) terrain.set(e.pos.join(','), e.type);
  const walls = new Set(o.level.timelines[0].entities.filter(e => e.active && e.blockable && e.type !== 'BOX').map(e => e.pos.join(',')));
  const V = [[0,1],[-1,0],[0,-1],[1,0]], K = e => e.x + ',' + e.y;
  function actorCanMove(s,p) {
    const boxes = new Set(s.b.map(K));
    for (let d=0; d<4; d++) {
      let pos=[p.x+V[d][0],p.y+V[d][1]], visited=new Set();
      while (boxes.has(pos.join(','))) { if(visited.has(pos.join(',')))break;visited.add(pos.join(','));pos=[pos[0]+V[d][0],pos[1]+V[d][1]]; }
      if(!walls.has(pos.join(',')) && terrain.has(pos.join(',')) && !boxes.has(pos.join(',')))return true;
    }
    return false;
  }
  const serial = s => s.p.filter(p=>p.active && p.id!==105).map(p=>[p.id,p.x,p.y,z.faceKeys&&actorCanMove(s,p)?'*':p.face].join(',')).sort().join('|')+'#'+(z.anonymousKeys?s.b.map(K).sort():s.b.map(b=>[b.id,b.x,b.y].join(','))).join('|');
  const key = serial(target), ids = target.p.filter(p=>p.active && p.id!==105).map(p=>[p.id,p.x,p.y]);
  let best=-1, matchingNodes=0;
  if(z.seen.has(key))for(let n=0;n<z.q.length;n++){
    const s=z.q[n].s, alive=s.p.filter(p=>p.active && p.id!==105);
    if(alive.length!==ids.length || !ids.every(([id,x,y])=>alive.some(p=>p.id===id && p.x===x && p.y===y)))continue;
    if(serial(s)!==key)continue;
    matchingNodes++;if(best<0 || z.q[n].depth<z.q[best].depth)best=n;
  }
  let prefix='';for(let n=best;n>0;n=z.q[n].parent)prefix=z.q[n].a+prefix;
  const fixed=best>=0?createModel(j.events[259].observation).replay(prefix):null;
  console.log(JSON.stringify({old80SQuery:{foundInSeen:z.seen.has(key),matchingNodes,bestNode:best,depth:best>=0?z.q[best].depth:null,prefixFromTrueNew60:prefix||null,target:old.describe(target),fixedValid:fixed?.valid,fixedLeaves:fixed?.states?.length,fixedState:fixed?.valid&&fixed.states?.length===1?old.describe(fixed.states[0].state):null,boundaries:fixed?.boundaries}}));
}
