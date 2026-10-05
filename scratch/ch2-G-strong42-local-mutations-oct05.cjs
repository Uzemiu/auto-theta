// Read-only finite route mutations from actual source60. No game or save calls.
// Stops at the first force or any unknown physics boundary.
const fs = require('fs');
const { m, sequence } = require('./ch2-G-strong-parent2400844-probe-oct05.cjs');
const old = 'DDAWDWAASSWDDASSDSAADAWWWDWADSDAWDWADW';
const exactLeafKey = r => r.leaves.map(l => JSON.stringify({ choices: l.choices, state: l.state })).sort().join('|');
const known = new Set([m.replay(old), m.replay(sequence)].map(r => exactLeafKey({ leaves: r.states })));
const routes = new Set([sequence]);
for (let i = 0; i < sequence.length; i++) {
  routes.add(sequence.slice(0, i) + sequence.slice(i + 1));
  for (const a of m.A) routes.add(sequence.slice(0, i) + a + sequence.slice(i + 1));
}
for (let i = 0; i <= sequence.length; i++) {
  for (const a of m.A) {
    routes.add(sequence.slice(0, i) + a + sequence.slice(i));
    for (const b of m.A) routes.add(sequence.slice(0, i) + a + b + sequence.slice(i));
  }
}
const counts = { routes: routes.size, transitions: 0, unknown: 0, firstForces: 0, qualifying: 0, knownExact: 0 };
const boundaries = {}, candidates = [], candidatesByKey = new Map();
for (const route of routes) {
  let state = m.clone(m.start);
  for (let i = 0; i < route.length; i++) {
    counts.transitions++;
    const r = m.step(state, m.A.indexOf(route[i]));
    if (!r.valid) {
      counts.unknown++;
      for (const b of r.boundaries) boundaries[b.boundary] = (boundaries[b.boundary] || 0) + 1;
      break;
    }
    if (r.forces.length) {
      counts.firstForces++;
      const left = r.leaves.map(l => m.left(l.state));
      const rightAlive = r.leaves.every(l => l.state.p.some(p => p.id === 105 && p.active));
      const capacity = left.reduce((sum, n) => sum + Math.max(1, n), 0);
      if (rightAlive && capacity >= 4) {
        counts.qualifying++;
        const key = exactLeafKey(r);
        if (known.has(key)) counts.knownExact++;
        else {
          const raw = route.slice(0, i + 1);
          const prior = candidatesByKey.get(key);
          if (!prior || raw.length < prior.raw.length) candidatesByKey.set(key, {
            raw, left, capacity, forces: r.forces,
            pre: m.describe(state),
            leaves: r.leaves.map(l => ({ choices: l.choices, state: m.describe(l.state) }))
          });
        }
      }
      break;
    }
    if (r.leaves.length !== 1) throw Error('Unforced multi-leaf transition');
    state = r.leaves[0].state;
  }
}
for (const c of candidatesByKey.values()) candidates.push(c);
const report = { scope: 'MODEL ONLY, finite single edits and adjacent two insertions of known raw42 from verified actual source60; first forces only; unknowns stop; capacity is a resource upper bound, not four-Goal completion.', counts, boundaries, candidates };
if (require.main === module) {
  fs.writeFileSync('scratch/ch2-G-strong42-local-mutations-oct05.md', '# Read-only local mutations of strong42\n\n```json\n' + JSON.stringify(report, null, 2) + '\n```\n');
  console.log(JSON.stringify({ scope: report.scope, counts, boundaries, candidates: candidates.map(c => ({ raw: c.raw, left: c.left, capacity: c.capacity, forceEvents: c.forces.length })) }));
}
module.exports = report;
