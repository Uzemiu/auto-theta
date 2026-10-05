// Readonly terminal-predecessor audit. No game I/O or global BFS.
// Later actual WXD/M114: events116/118/120 confirm emptyC4 does not capture
// the later-tick corpse. Below is the historical geometric model, not success.
const fs=require('fs'),vm=require('vm');
let src=fs.readFileSync('scratch/ch4-15-readonly.cjs','utf8');
// Actual38 confirms fork pickup precedes bare SPIKE death. Keep that ordering
// for hypothetical probe bookkeeping, without claiming corpse capture.
src=src.replace(')),p=[];', ')),p=[],rem=s.rem.slice();')
 .replace('let r=c>=0?b[c].r:a.r;if(c<0', 'let r=c>=0?b[c].r:a.r;let ri=rem.indexOf(key(r));if(ri>=0){a={...a,fork:a.fork+1};rem.splice(ri,1);}if(c<0')
 .replace('let rem=s.rem.slice();for(let a of p)', 'for(let a of p)');
const ctx={require,process:{argv:[]},console,module:{exports:{}}};
vm.runInNewContext(src.slice(0,src.indexOf("if(process.argv[2]==='replay')"))+'\nmodule.exports={step,initial,replay,wall,spike,ice};',ctx);
const {step,initial,replay,wall,spike,ice}=ctx.module.exports;
const raw=JSON.parse(fs.readFileSync('artifacts/slot1-playthrough/4-15.json','utf8').replace(/^\uFEFF/,''));
const t=raw.initial.level.timelines[0],K=r=>r.join(','),eq=(a,b)=>K(a)===K(b);
const floor=[...new Map(t.tiles.filter(z=>!wall.has(K(z.pos))).map(z=>[K(z.pos),z.pos])).values()];
const safe=floor.filter(r=>!spike.has(K(r)));
const startPath='AAAAAAWDDSDWWWWSXWWX';
const start=replay(startPath,initial,true);
if(!start||start.p.length!==3||start.p.some(p=>p.c>=0||p.fork||p.ghost)||!eq(start.b[0].r,[6,2])||!eq(start.b[1].r,[4,6]))throw Error('Actual20 source regression failed');
// Expand only individual ordinary transitions under each possible static C4 pose.
// Candidate full three-person target would need last input D to reach3,6;
// test all directions as a diagnostic, without assuming that claim.
let tests=0,dInto43=[],into36=[];
for(const br of floor.filter(r=>r[1]>1&&!eq(r,[4,6])))for(const pr of safe.filter(r=>!eq(r,br)&&!eq(r,[4,6])))for(const a of 'WASD'){
 const s={b:[{r:br,color:4},{r:[4,6],color:3}],p:[{r:pr,f:'S',fork:0,c:-1,ghost:0}],rem:['4,6']};
 const n=step(s,a);tests++;
 if(!n||!eq(n.b[1].r,[4,6]))continue;
 for(const p of n.p.filter(p=>p.c<0&&!p.ghost)){
  if(a==='D'&&eq(p.r,[4,3]))dInto43.push({c4:br,from:pr,afterC4:n.b[0].r});
  if(eq(p.r,[3,6]))into36.push({key:a,c4:br,from:pr,afterC4:n.b[0].r});
 }
}
const hypotheticalProbe={b:[{r:[4,4],color:4},{r:[4,6],color:3}],p:[{r:[3,6],f:'D',fork:0,c:-1,ghost:0},{r:[4,3],f:'D',fork:0,c:-1,ghost:0},{r:[5,2],f:'D',fork:0,c:-1,ghost:0}],rem:['4,6']};
const ordinaryModelAfterD=step(hypotheticalProbe,'D');
const wxdBefore={b:[{r:[4,4],color:4},{r:[4,6],color:3}],p:[{r:[5,2],f:'S',fork:1,c:-1,ghost:0},{r:[2,5],f:'S',fork:1,c:-1,ghost:0}],rem:['4,6']};
let wxd=wxdBefore;const wxdCheckpoints=[];
for(const a of 'WXD'){
 wxd=step(wxd,a);if(!wxd)throw Error('Conditional WXD geometry rejected');
 wxdCheckpoints.push({input:a,state:wxd});
}
const result={conditional:true,startPath,start,terrain:{walls:[...wall],spikes:[...spike],ice:[...ice]},tests,dInto43,into36,hypotheticalProbe,ordinaryModelAfterD,wxdBefore,wxdCheckpoints,
 scope:'Local individual predecessor diagnostic; fixed Blue4,6, ordinary no X; not a simultaneous exhaustive three-player search. Last-key proof in report also checks target C4 motion and no-merge/capture constraints.'};
if(require.main===module)console.log(JSON.stringify(result,null,2));
module.exports={result};
