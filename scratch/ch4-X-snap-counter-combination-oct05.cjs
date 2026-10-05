// Read-only, fixed initial-map comparison. No game controls or state search.
// Only newly completed counter/snap are compared; the old 18-map domain is reused.
const fs = require('fs');
const K = p => p.join(',');
function load(id) {
  const j = JSON.parse(fs.readFileSync(`artifacts/slot1-playthrough/${id}.json`, 'utf8').replace(/^\uFEFF/, ''));
  const t = j.initial.level.timelines[0], es = t.entities.filter(e => e.active), ts = t.tiles.filter(e => e.active);
  return { id, size: t.size, goals: j.initial.level.goals,
    floor: new Set(es.concat(ts).filter(e => e.floor).map(e => K(e.pos))),
    wall: new Set(es.filter(e => e.type === 'WALL' || e.class === 'Wall').map(e => K(e.pos))) };
}
const sky = load('4-X');
function shift(set, dx) { return new Set([...set].map(k => { const p = k.split(',').map(Number); p[0] += dx; return K(p); })); }
function comp(floor, wall, size) {
  const allowed = new Set([...floor].filter(k => !wall.has(k))), at = new Map(), sizes = [];
  for (const origin of allowed) if (!at.has(origin)) {
    const q = [origin], n = sizes.length; at.set(origin, n);
    for (let h = 0; h < q.length; h++) {
      const [x, y] = q[h].split(',').map(Number);
      for (const [dx, dy] of [[1,0],[-1,0],[0,1],[0,-1]]) {
        const p = [(x+dx+size[0]+1)%(size[0]+1), (y+dy+size[1]+1)%(size[1]+1)], k = K(p);
        if (allowed.has(k) && !at.has(k)) { at.set(k, n); q.push(k); }
      }
    }
    sizes.push(q.length);
  }
  return { sizes: sizes.slice().sort((a,b)=>b-a), lookup: p => wall.has(K(p)) ? 'Wall' : at.has(K(p)) ? sizes[at.get(K(p))] : 'noFloor' };
}
const out = [];
for (const id of ['4-19', '4-24']) {
  const other = load(id);
  for (const operation of ['^', 'sky+other', 'other+sky']) {
    const dxSky = operation === 'other+sky' ? other.size[0]+1 : 0;
    const dxOther = operation === 'sky+other' ? sky.size[0]+1 : 0;
    const size = [operation === '^' ? Math.max(sky.size[0],other.size[0]) : sky.size[0]+other.size[0]+1,
      Math.max(sky.size[1],other.size[1])];
    const floor = new Set([...shift(sky.floor,dxSky),...shift(other.floor,dxOther)]);
    const wall = new Set([...shift(sky.wall,dxSky),...shift(other.wall,dxOther)]);
    const z = comp(floor,wall,size), sk = p => [p[0]+dxSky,p[1]];
    out.push({ id, operation, sourceSize: other.size, assumedPeriod: size.map(x=>x+1),
      goal8_1: z.lookup(sk([8,1])), goal7_0: z.lookup(sk([7,0])),
      skyPlayer6_8: z.lookup(sk([6,8])), skyPrism4_4: z.lookup(sk([4,4])), components: z.sizes });
  }
}
console.log(JSON.stringify(out,null,2));
