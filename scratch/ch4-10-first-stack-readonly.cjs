'use strict';
// Bounded first-overlap audit. Derived only from the observed ordinary model.
// No game input, save, main KB or hidden implementation. Never steps a stack.
const fs = require('fs'), vm = require('vm');
const base = fs.readFileSync('scratch/ch4-10-readonly.cjs', 'utf8');
let source = base.slice(0, base.indexOf("if(process.argv[2]==='replay')"));
const reject = 'if(new Set(s.bs.map(key)).size!==s.bs.length)return null;';
if (!source.includes(reject)) throw Error('Ordinary source changed: overlap boundary not found');
source = source.replace(reject, 'const stackOverlap=new Set(s.bs.map(key)).size!==s.bs.length;');
source = source.replace('return s;\n}', 's.stack=stackOverlap;if(stackOverlap){s.stackPushes=pushes;s.stackPlans=plans;}return s;\n}');
if (!source.includes('s.stack=stackOverlap')) throw Error('Ordinary source changed: step return not found');
const context = { require, process: { argv: [] }, console, module: { exports: {} } };
vm.runInNewContext(source + '\nmodule.exports={step,initial23,spike,wall,gates};', context);
const { step, initial23, spike } = context.module.exports;
const copy = s => JSON.parse(JSON.stringify(s));
const at = p => p.join(',');
const cap = Math.min(Number(process.argv[2]) || 100000, 100000);
const depthLimit = Math.min(Number(process.argv[3]) || 50, 50);
const canonical = s => {
  const order = s.bs.map((r, i) => ({ r, i })).sort((a, b) => a.r[0] - b.r[0] || a.r[1] - b.r[1]);
  const remap = new Map(order.map((v, i) => [v.i, i]));
  s.bs = order.map(v => v.r);
  for (const p of s.ps) if (p.c >= 0) p.c = remap.get(p.c);
  return s;
};
const serial = s => s.bs.map(at).join(';') + '|' + s.ps.map(p =>
  [...p.r, p.c, p.fork, p.k, p.fork ? p.f : ''].join(',')).sort().join(';') +
  '|' + s.go.map(Number).join('') + '|' + (+s.fork) + (+s.key) + (+s.lock);
function ordinary(s, a) {
  if (s.stack) throw Error('Never simulate beyond a first overlap');
  const n = step(s, a);
  // This task requires two surviving FREE actors and retained Fork1.
  if (!n || n.ps.length !== 2 || n.ps.some(p => p.c >= 0) || !n.ps.some(p => p.fork === 1)) return null;
  if (n.ps.some(p => spike.has(at(p.r)))) return null;
  return n.stack ? n : canonical(n);
}
function reconstruct(q, i, action = '') {
  let path = action;
  for (; q[i].parent >= 0; i = q[i].parent) path = q[i].action + path;
  return path;
}
function originalIdentityReplay(path) {
  let s = copy(initial23);
  const ids = [58, 59, 57]; // Exact initial23 bs order from the observed base model.
  for (let i = 0; i < path.length; i++) {
    const n = step(s, path[i]);
    if (!n || n.ps.length !== 2 || n.ps.some(p => p.c >= 0) || !n.ps.some(p => p.fork === 1))
      throw Error('Identity replay failed at step ' + (i + 1));
    if (n.stack && i !== path.length - 1) throw Error('Earlier overlap in identity replay');
    s = n;
  }
  const groups = new Map();
  s.bs.forEach((p, i) => {
    const k = at(p);
    if (!groups.has(k)) groups.set(k, { at: p, sourceIds: [] });
    groups.get(k).sourceIds.push(ids[i]);
  });
  return { state: s, groups: [...groups.values()] };
}
const start = canonical(copy(initial23));
const queue = [{ state: start, parent: -1, action: '', depth: 0 }], seen = new Set([serial(start)]);
let head = 0, depthCutoffStates = 0, examinedTransitions = 0;
while (head < queue.length && head < cap) {
  const idx = head++, item = queue[idx];
  if (item.depth >= depthLimit) { depthCutoffStates++; continue; }
  for (const a of 'WASD') {
    examinedTransitions++;
    const n = ordinary(item.state, a);
    if (!n) continue;
    if (n.stack) {
      const path = reconstruct(queue, idx, a), identity = originalIdentityReplay(path);
      console.log('FIRST_STACK_POSITIVE', JSON.stringify({ path, length: path.length,
        actual23Prefix: 'SDXASDDDAAAAAWWWAWWSSSS', fullInitialCandidate: 'SDXASDDDAAAAAWWWAWWSSSS' + path,
        pre: item.state, result: n, identityReplay: identity,
        expanded: head, seen: seen.size, examinedTransitions, cap, depthLimit,
        scope: 'First distinct-source overlap only; two free actors alive/Fork1 retained; no stacked movement/capture/X is simulated' }));
      process.exit();
    }
    const key = serial(n);
    if (seen.has(key)) continue;
    seen.add(key);
    queue.push({ state: n, parent: idx, action: a, depth: item.depth + 1 });
  }
}
console.log('FINITE_END', JSON.stringify({ expanded: head, seen: seen.size, queue: queue.length,
  examinedTransitions, cap, depthLimit, depthCutoffStates, queueExhausted: head === queue.length,
  wholeConstrainedGraphExhausted: head === queue.length && depthCutoffStates === 0,
  scope: 'ordinary WASD from historical/verified fresh23, two FREE actors alive, Fork1 preserved, three original Color4 BOX; x1/y1 allowed; stop before any stacked continuation; no X/conflict/ghost capture' }));
