// Readonly conditional replay: no game API, no save/primary journal writes.
// Run: D:/nodejs/node.exe scratch/chapter2-to-2G-readonly.cjs
const fs = require('fs');
const path = require('path');
const root = path.resolve(__dirname, '..');
const read = p => JSON.parse(fs.readFileSync(path.join(root, p), 'utf8').replace(/^\uFEFF/, ''));
const journal = read('artifacts/slot1-playthrough/chapter2-world.json');
let source;
for (let i = journal.events.length - 1; i >= 0; i--) {
  const level = journal.events[i].observation?.level;
  if (level?.id === 'Chapter2' && level.world && level.timelines?.[0]?.tiles?.length) {
    source = {event: i, level, timeline: level.timelines[0]};
    break;
  }
}
if (!source) throw new Error('No complete Chapter2 world observation');
const key = p => p.join(',');
const tiles = new Map(source.timeline.tiles.filter(e => e.active !== false).map(e => [key(e.pos), e]));
const entities = new Map();
for (const e of source.timeline.entities.filter(e => e.active !== false)) {
  const k = key(e.pos);
  if (!entities.has(k)) entities.set(k, []);
  entities.get(k).push(e);
}
const done = new Set(read('knowledge/progress.json').active_playthrough.verified_completed_levels);
if (!done.has('2-22')) throw new Error('2-22 prerequisite lacks verified completion');
const deltas = {W:[0,1], A:[-1,0], S:[0,-1], D:[1,0]};
function inspect(p) {
  const tile = tiles.get(key(p));
  const es = entities.get(key(p)) || [];
  const blocker = es.find(e => e.blockable || e.type === 'WALL' || e.class === 'Wall');
  if (!tile?.floor || blocker) throw new Error(`Blocked/missing floor ${key(p)}`);
  if (tile.type === 'SPIKE' || es.some(e => e.type === 'SPIKE')) throw new Error(`Lethal ${key(p)}`);
  const entry = es.find(e => e.type === 'ENTRY');
  if (entry && !done.has(entry.details.LinkLevel) && entry.details.LinkLevel !== '2-G') {
    throw new Error(`Unfinished unrelated entry ${entry.details.LinkLevel}`);
  }
  return {tile, entry};
}
function replay(start, sequence) {
  let p = start.slice();
  const trace = [];
  // Initial position can be the unfinished 2-A entry: do not re-enter it.
  for (const [i, a] of [...sequence].entries()) {
    const d = deltas[a];
    const micro = [];
    do {
      p = [p[0] + d[0], p[1] + d[1]];
      const {tile, entry} = inspect(p);
      micro.push(p.slice());
      if (entry && entry.details.LinkLevel === '2-G' && i !== sequence.length - 1) {
        throw new Error('Target entered before terminal input');
      }
      if (tile.type !== 'ICE') break;
    } while (micro.length < 20);
    if (micro.length >= 20) throw new Error('Unexpected extended slide');
    trace.push({input:i + 1, action:a, micro, stop:p.slice()});
  }
  if (key(p) !== '36,1') throw new Error('Target not reached');
  const target = inspect(p).entry;
  if (target?.details?.LinkLevel !== '2-G' || target.blockable) throw new Error('2-G entry mismatch');
  return {start, sequence, trace};
}
console.log(JSON.stringify({scope:'Conditional starts after normal 2-A return; no source position claim',
  chapter2SourceEvent:source.event,
  routes:[replay([24,3], 'SSDDDDDDDD'), replay([25,3], 'SSDDDDDDD')]}, null, 2));
