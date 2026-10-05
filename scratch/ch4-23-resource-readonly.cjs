// Conditional single-string audit only. No search, game calls or canonical writes.
const fs=require('fs'),vm=require('vm');
// Reuse the public-observation geometry model, retargeted privately to snake.
let code=fs.readFileSync('scratch/ch4-22-readonly.cjs','utf8')
 .replaceAll('artifacts/slot1-playthrough/4-22.json','artifacts/slot1-playthrough/4-23.json')
 .replace('if(!old.c&&z.c)old.c=z.c;',
  'if(!old.c&&z.c)old.c=z.c;else if(old.c&&z.c){old.c.fork=Math.max(old.c.fork,z.c.fork);}');
const mod={exports:{}};
vm.runInNewContext(code,{require,module:mod,console,process}, {filename:'private-snake-visible-model.cjs'});
const m=mod.exports,copy=s=>JSON.parse(JSON.stringify(s));
const keys=m.t.entities.filter(e=>e.type==='KEY');
const spent=(s,x,y)=>{const i=keys.findIndex(e=>e.pos[0]===x&&e.pos[1]===y);if(i>=0)s.keys&=~(1<<i);};
const c=fork=>({f:'W',fork,key:0,ghost:0});
const chain={b:[{r:[9,5],orig:90,color:4,c:c(0)},{r:[9,4],orig:74,color:3,c:null}],p:[{r:[9,3],f:'W',fork:0,key:0}],keys:m.initial.keys,locks:0};
spent(chain,1,3);
const ww=m.replay('WW',chain);
const tail='WXAXXXXXXXSXXX';
const run=ww.valid?m.replay(tail,ww.s):{valid:false};
const compact=s=>({cargo:s.boxes.filter(b=>b.c).map(b=>({r:b.p,F:b.c.fork,face:b.c.f})),empty:s.boxes.filter(b=>!b.c).map(b=>b.p),free:s.free});
// A deliberately direct one-branch family from total Fork1; not a global exclusion.
const f1=copy(chain);f1.b[0].r=[9,6];f1.b[0].c=c(1);f1.b[1].r=[5,2];f1.p=[];spent(f1,9,6);
const direct='WXDXWXAXXXXXXSX';
const lone=m.replay(direct,f1);
console.log(JSON.stringify({scope:'two conditional single-string replays; no BFS',sourceWW:{valid:ww.valid,trace:ww.trace.map(z=>({n:z.n,a:z.a,s:compact(z.s)}))},tail,inputCount:tail.length,valid:run.valid,goalMask:run.valid?m.mask(run.s):0,trace:run.trace?.map(z=>({n:z.n,a:z.a,s:compact(z.s)})),directF1:{path:direct,valid:lone.valid,goalMask:lone.valid?m.mask(lone.s):0,final:lone.valid?m.summary(lone.s):null}},null,2));
