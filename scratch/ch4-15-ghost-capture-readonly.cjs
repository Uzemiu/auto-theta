'use strict';
// One bounded, observed ordinary/free-X/ICE resource domain. No game I/O.
// First simultaneous SPIKE+moving-body capture only; never propagate ghosts,
// simulate ghost-X, accept stack/conflict, or revive a prior-tick corpse.
const fs=require('fs'),vm=require('vm');
const src=fs.readFileSync('scratch/ch4-15-readonly.cjs','utf8');
let model=src.slice(0,src.indexOf("if(process.argv[2]==='replay')"))
 .replace('p[0]+v[d][0],p[1]+v[d][1]', '(p[0]+v[d][0]+t.size[0]+1)%(t.size[0]+1),(p[1]+v[d][1]+t.size[1]+1)%(t.size[1]+1)')
 .replace(')),p=[];', ')),p=[],rem=s.rem.slice();')
 .replace('let r=c>=0?b[c].r:a.r;if(c<0',
  'let r=c>=0?b[c].r:a.r;let ri=rem.indexOf(key(r));if(ri>=0){a={...a,fork:a.fork+1};rem.splice(ri,1);}if(c<0')
 .replace('let rem=s.rem.slice();for(let a of p)', 'for(let a of p)')
 .replace('if(spike.has(key(a.r)))ghost=1;',
  'if(spike.has(key(a.r))){ghost=1;if(typeof captureHook===\'function\')captureHook({phase:tickPhase,box:i,color:b[i].color,at:a.r,forkBefore:a.fork});}')
 .replace('let n=tick(s,plans,intents);', 'tickPhase=\'main\';let n=tick(s,plans,intents);')
 .replace('let nxt=tick(n,micro,pushes);', 'tickPhase=\'micro\';let nxt=tick(n,micro,pushes);');
model=model.replace('if(dirs.has(i)&&dirs.get(i)!==x.d)return null;',
 "if(dirs.has(i)&&dirs.get(i)!==x.d){if(typeof rejectHook==='function')rejectHook({kind:'conflict',phase:tickPhase,box:i,first:dirs.get(i),second:x.d,plans,before:s.b});return null;}")
 .replace('if(b.length!==new Set(b.map(b=>key(b.r))).size)return null;',
 "if(b.length!==new Set(b.map(b=>key(b.r))).size){if(typeof rejectHook==='function')rejectHook({kind:'stack',phase:tickPhase,plans,before:s.b,after:b,movers:Array.from(dirs.entries())});return null;}")
 .replace('if(i>=0){c=i;', "if(i>=0){c=i;if(typeof liveCaptureHook==='function')liveCaptureHook({phase:tickPhase,box:i,color:b[i].color,from:s.b[i].r,at:a.r,direction:dirs.get(i),forkBefore:a.fork,spike:spike.has(key(a.r))});");
const ctx={require,process:{argv:[]},console,module:{exports:{}},tickPhase:'main',captureHook:null,rejectHook:null,liveCaptureHook:null};
vm.runInNewContext(model+'\nmodule.exports={initial,step,replay,spike};',ctx);
const {initial,step,replay,spike:modelSpikes}=ctx.module.exports;
const liveMode=process.argv[2]==='blue-blocker-live';
const chaseMode=process.argv[2]==='blue-chase-pose';
const cargoMode=process.argv[2]==='captured-resource';
const leaf=process.argv[2]==='leaf-A'?'A':process.argv[2]==='leaf-W'?'W':null;
const copy=s=>JSON.parse(JSON.stringify(s));
let prefix=liveMode||chaseMode?'AAAAAAWDDSDWWWWSX':'WAASAWWWWSX',seed=replay(prefix,initial,true),conditionalLeaf=null;
if(cargoMode){prefix='AAAAAAWDDSDWWWWSXWWXWSASSSSSD';seed=replay(prefix,initial,true);}
if(leaf){
 prefix='AAAAAAWDDSDWWWWSXWSASSSSSDWWX';
 conditionalLeaf={b:[{r:leaf==='A'?[3,2]:[4,3],color:4},{r:[4,6],color:3}],
  p:[{r:[4,2],f:leaf,fork:1,c:-1,ghost:0}],rem:['4,6']};
 seed=step(conditionalLeaf,'X');
}
if(cargoMode){
 if(seed.p.length!==3||seed.p.filter(p=>p.c>=0).length!==1||seed.p.some(p=>p.fork||p.ghost))throw Error('cargo seed mismatch');
}else if(seed.p.length!==2||seed.p.some(p=>p.c>=0||p.ghost||p.fork!==(leaf?0:1))||seed.rem.join()!=='4,6')throw Error('resource seed mismatch');
const cap=leaf||cargoMode?10000:liveMode||chaseMode?5000:15000,depth=leaf||liveMode||cargoMode?40:35,hash=s=>s.phase+'|'+s.b.map(b=>b.r.join(',')).join('|')+'|'+
 s.p.map(p=>[...p.r,p.c,p.fork,p.ghost,!liveMode&&!leaf&&!cargoMode&&s.phase===0?p.f:''].join(',')).sort().join(';')+'|'+s.rem.join(';');
seed.phase=0;
const q=[{s:seed,parent:-1,a:'',d:0}],seen=new Set([hash(seed)]);
let head=0,cutoff=0,transitions=0,ghostTransitions=0,positive=null,backup=null,liveForkPair=null,liveCaptures=0;
const rejected={stack:0,conflict:0},firstRejected={},safeRejected={},rejection=[],rejectedSamples=[];
ctx.rejectHook=x=>rejection.push(copy(x));
const captureSamples=[],tickCaptures=[];
ctx.liveCaptureHook=x=>tickCaptures.push(copy(x));
function path(i,a=''){for(;q[i].parent>=0;i=q[i].parent)a=q[i].a+a;return a;}
while(head<q.length&&head<cap&&!positive){
 const i=head++,o=q[i],s=o.s;
 if(o.d>=depth){cutoff++;continue;}
 for(const a of !liveMode&&!leaf&&!cargoMode&&s.phase===0&&s.p.every(p=>p.c<0)?'WASDX':'WASD'){
  transitions++;
  rejection.length=0;tickCaptures.length=0;const n=step(s,a);
  for(const r of rejection){
   rejected[r.kind]++;
   const sample={tail:path(i,a),full:prefix+path(i,a),before:copy(s),rejection:r};
   if(liveMode&&rejectedSamples.length<10)rejectedSamples.push(sample);
   if(!firstRejected[r.kind])firstRejected[r.kind]=sample;
   if(r.plans.length===2&&r.plans.every(p=>p.fork>=1&&!p.ghost&&!modelSpikes.has(p.r.join(',')))&&!safeRejected[r.kind])safeRejected[r.kind]=sample;
  }
  if(!n||n.p.length<2||n.p.length>4||n.b.some(b=>b.r[1]<=1))continue;
  if(liveMode&&(n.p.length!==2||n.p.some(p=>p.fork<1)))continue;
  if(leaf&&n.p.length!==2)continue;
  if(cargoMode&&(n.p.length!==3||n.p.some(p=>p.ghost)||n.p.filter(p=>p.c<0).length!==2))continue;
  n.phase=s.phase===0&&a==='X'?1:s.phase;
  if(cargoMode){
   const carrier=n.p.find(p=>p.c===0),free=n.p.filter(p=>p.c<0&&!p.ghost);
   const forkHit=carrier&&carrier.fork>=1&&carrier.r.join()==='4,6';
   const sideHit=carrier&&n.b[1].r.join()==='4,6'&&
    (carrier.r.join()==='3,6'&&free.some(p=>p.r.join()==='2,6')||
     carrier.r.join()==='5,6'&&free.some(p=>p.r.join()==='6,6'));
   if(forkHit||sideHit){positive={tail:path(i,a),full:prefix+path(i,a),state:copy(n),outside:free.length,kind:forkHit?'cargoFork1at4,6':'safe-side-chain-beforeFork'};break;}
  }
  if(chaseMode){
   if(!n.rem.includes('4,6')||n.p.some(p=>p.ghost))continue;
   if(s.phase===0){
    if(a==='X'){
     if(n.p.length<3||n.p.some(p=>p.c>=0||p.fork!==0))continue;
    }else if(n.p.length!==2||n.p.some(p=>p.fork!==1))continue;
   }else if(n.p.length<3)continue;
   const free=n.p.filter(p=>p.c<0&&!p.ghost);
   if(n.phase===1&&free.length>=3&&n.b[0].r.join()==='4,4'&&n.b[1].r.join()==='4,6'&&
      free.some(p=>p.r.join()==='3,6'&&p.fork===0)&&free.some(p=>p.r.join()==='4,3'&&p.fork===0)){
    positive={tail:path(i,a),full:prefix+path(i,a),state:copy(n),outside:free.length};break;
   }
  }
  if(n.p.some(p=>p.c>=0&&!s.p.some(z=>z.c===p.c))){
   liveCaptures++;
   if(chaseMode)captureSamples.push({tail:path(i,a),full:prefix+path(i,a),before:copy(s),state:copy(n),captures:copy(tickCaptures),
    outside:n.p.filter(p=>p.c<0&&!p.ghost).length});
  }
  if(!liveForkPair&&n.p.some(p=>p.c>=0&&!p.ghost&&p.fork>=1)&&n.p.some(p=>p.c<0&&!p.ghost&&p.fork>=(leaf?0:1))){
   liveForkPair={tail:path(i,a),full:prefix+path(i,a),state:copy(n)};
   if(liveMode||leaf){positive=liveForkPair;break;}
  }
  const ghosts=n.p.filter(p=>p.ghost&&p.c>=0),outside=n.p.filter(p=>!p.ghost&&p.c<0).length;
  if(ghosts.length){
   ghostTransitions++;
   const result={tail:path(i,a),full:prefix+path(i,a),state:copy(n),outside,
    ghostForkMax:Math.max(...ghosts.map(p=>p.fork))};
   if(!liveMode&&!leaf&&!chaseMode&&!cargoMode&&outside>=1&&ghosts.some(p=>p.fork>=1)){positive=result;break;}
   if(liveMode&&!backup)backup=result;
   if(outside>=2&&(!backup||outside>backup.outside))backup=result;
   continue; // Stop at first ghost: no unverified post-capture ghost behavior.
  }
  if(n.p.some(p=>p.ghost))continue;
  const h=hash(n);if(seen.has(h))continue;seen.add(h);q.push({s:n,parent:i,a,d:o.d+1});
 }
}
function audit(result){
 if(!result)return null;
 const captures=[];ctx.captureHook=x=>captures.push(x);
 let s=copy(seed),milestones=[];
 for(let i=0;i<result.tail.length;i++){
  const a=result.tail[i],old=s;captures.length=0;s=step(s,a);
  if(!s)throw Error('candidate replay failed');
  if(a==='X'||captures.length||s.p.length!==old.p.length||s.rem.length!==old.rem.length||
   s.p.some(p=>p.c>=0&&!old.p.some(z=>z.c===p.c)))
   milestones.push({input:prefix.length+i+1,a,state:copy(s),captures:copy(captures)});
 }
 ctx.captureHook=null;
 return {...result,milestones};
}
// Postprocess the already generated graph only. No expansion/new budget.
let blockedIceProbe=null,freeXChaseProbe=null;
if(liveMode){
 ctx.rejectHook=null;ctx.liveCaptureHook=null;
 for(let i=0;i<q.length&&!freeXChaseProbe;i++){
  const s=q[i].s,free=s.p.filter(p=>p.c<0&&!p.ghost&&p.fork===1);
  if(s.b[0].r.join()!=='4,4'||s.b[1].r.join()!=='4,6'||free.length!==2||
     !free.some(p=>p.r.join()==='5,2')||!free.some(p=>p.r.join()==='2,5')||!s.rem.includes('4,6'))continue;
  let n=copy(s),stages=[];
  for(const a of 'WXD'){n=step(n,a);if(!n)break;stages.push({a,state:copy(n)});}
  freeXChaseProbe={tail:path(i),full:prefix+path(i),state:copy(s),probeTail:'WXD',stages,
   note:'D new-push ICE continuation is modeled; capturing main-tick corpse during microtick remains unverified and is NOT modeled.'};
 }
}
if(cargoMode){
 ctx.rejectHook=null;ctx.liveCaptureHook=null;
 for(let i=0;i<q.length&&!blockedIceProbe;i++){
  const s=q[i].s,carrier=s.p.find(p=>p.c===0&&!p.ghost&&p.fork===0),free=s.p.filter(p=>p.c<0&&!p.ghost);
  if(!carrier||carrier.r.join()!=='4,5'||s.b[1].r.join()!=='4,6'||!s.rem.includes('4,6')||free.length!==2)continue;
  for(const [pos,action] of [['3,6','D'],['5,6','A']]){
   if(!free.some(p=>p.r.join()===pos))continue;
   const after=step(s,action);
   if(!after||!after.p.some(p=>p.c<0&&!p.ghost))continue;
   blockedIceProbe={tail:path(i),full:prefix+path(i),state:copy(s),action,
    modeledAfter:copy(after),note:'Unknown actual blocked-ICE restart/same-input microtick corpse capture; modeledAfter only predicts no restart.'};break;
  }
 }
}
console.log(JSON.stringify({scope:cargoMode?'conditional/model29 C4cargo5,2F0+free6,2/5,4F0+Blue4,6; ordinary, keep both outside live, target cargo4,6Fork1 or safe-side-chain3/5,6 beforeFork; no X/row1/stack/conflict/Ghost':
 chaseMode?'actual fresh17; ordinary, one free-X accepting three or four freeF0 births, ordinary livecargo allowed; target C4 4,4 + Blue4,6 + >=3 livefree incl 3,6/4,3 + remainingFork4,6; no corpse-capture success assumption':
 leaf?'conditional first-conflict #3 '+leaf+' branch, then X; ordinary two live actors, target cargoFork1+outsideFork0; exclude row1/stack/conflict/cargoX/Ghost':
 liveMode?'fresh17 Blue blocker4,6/C4lower6,2; ordinary two Fork>=1 actors; live anyColor cargo plus live Fork>=1 outside; exclude row1/stack/conflict/cargoX; first ghost recorded and stopped':
 'actual11 ordinary, optional one further free-X, <=4 actors, first SPIKE+body capture; excludes row1 bodies/stack/conflict/cargo-X and ghost propagation',
 cap,depth,conditionalLeaf,seed,expanded:head,seen:seen.size,unexpanded:q.length-head,cutoff,transitions,ghostTransitions,
 queueExhausted:head===q.length,liveCaptures,captureSamples,rejected,firstRejected,safeRejected,rejectedSamples,freeXChaseProbe:audit(freeXChaseProbe),blockedIceProbe:audit(blockedIceProbe),liveForkPair:audit(liveForkPair),positive:audit(positive),backup:audit(backup)}));
