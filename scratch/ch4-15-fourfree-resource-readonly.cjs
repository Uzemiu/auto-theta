'use strict';
// Independent bounded 4-free resource domain. Observed ordinary/ICE/free-X only.
// No game, save, main KB, stack/conflict/cargo-X, or hidden implementation.
const fs=require('fs'),vm=require('vm');
const source=fs.readFileSync('scratch/ch4-15-readonly.cjs','utf8');
let ordinary=source.slice(0,source.indexOf("if(process.argv[2]==='replay')"))
  .replace(')),p=[];', ')),p=[],rem=s.rem.slice();')
  .replace('let r=c>=0?b[c].r:a.r;if(c<0',
    'let r=c>=0?b[c].r:a.r;let ri=rem.indexOf(key(r));if(ri>=0){a={...a,fork:a.fork+1};rem.splice(ri,1);}if(c<0')
  .replace('let rem=s.rem.slice();for(let a of p)', 'for(let a of p)');
const context={require,process:{argv:[]},console,module:{exports:{}}};
vm.runInNewContext(ordinary+'\nmodule.exports={initial,step,replay};',context);
const {initial,step,replay}=context.module.exports;
const prefix='WAASAWWWWSX',cp=s=>JSON.parse(JSON.stringify(s)),at=p=>p.join(',');
const start=replay(prefix,initial,true);start.phase=0;
if(start.p.length!==2||start.p.some(p=>p.c>=0||p.fork!==1||p.ghost)||!start.rem.includes('4,6'))throw Error('seed11 mismatch');
const cap=Math.min(Number(process.argv[2])||20000,20000),depthLimit=40;
const minAfterFour=Number(process.argv[3])===2?2:3;
const hash=s=>s.phase+'|'+s.b.map(b=>at(b.r)).join('|')+'|'+
  s.p.map(p=>[...p.r,p.c,p.fork,p.ghost,s.phase===0?p.f:''].join(',')).sort().join(';')+'|'+s.rem.join(';');
const q=[{s:start,parent:-1,a:'',depth:0}],seen=new Set([hash(start)]);
let head=0,depthCutoffStates=0,threeActorBirthTransitions=0,firstFour=null,best=null,transitions=0,maxOutsideAtBlueFork=0;
function path(i,a=''){for(;q[i].parent>=0;i=q[i].parent)a=q[i].a+a;return a;}
function inspect(s,i){
  const outside=s.p.filter(p=>p.c<0).length;
  if(s.phase===1&&s.p.some(p=>p.c===1&&p.fork===1&&!p.ghost)&&at(s.b[1].r)==='4,6'){
    maxOutsideAtBlueFork=Math.max(maxOutsideAtBlueFork,outside);
    if(!best||outside>best.outside)best={tail:path(i),outside,state:cp(s)};
    return outside>=3;
  }
  return false;
}
while(head<q.length&&head<cap){
  const i=head++,o=q[i],s=o.s;
  if(inspect(s,i))break;
  if(o.depth>=depthLimit){depthCutoffStates++;continue;}
  for(const a of s.phase===0?'WASDX':'WASD'){
    transitions++;
    const n=step(s,a);if(!n||n.p.some(p=>p.ghost)||n.b.some(b=>b.r[1]<=1)||n.p.length>4)continue;
    if(s.phase===0){
      if(a==='X'){
        if(n.p.length<4){if(n.p.length===3)threeActorBirthTransitions++;continue;}
        if(n.p.some(p=>p.c>=0||p.fork!==0)||!n.rem.includes('4,6'))continue;
        n.phase=1;
      }else{
        if(n.p.length!==2||n.p.some(p=>p.c>=0||p.fork!==1)||!n.rem.includes('4,6'))continue;
        n.phase=0;
      }
    }else{
      // Stage boundary still requires four actual live free actors; afterwards
      // explicitly parameterize at least two/three remaining total actors.
      // Goal prefers three outside; weaker positive inventories remain separate.
      if(n.p.length<minAfterFour)continue;n.phase=1;
    }
    const h=hash(n);if(seen.has(h))continue;seen.add(h);
    q.push({s:n,parent:i,a,depth:o.depth+1});
    if(n.phase===1&&!firstFour)firstFour={tail:path(i,a),state:cp(n)};
  }
}
let milestones=[];
if(best){let s=cp(start);for(let i=0;i<best.tail.length;i++){
  const a=best.tail[i],old=s;s=step(s,a);if(!s)throw Error('best replay mismatch');
  if(a==='X'||s.p.length!==old.p.length||s.rem.length!==old.rem.length||
     s.p.some((p,j)=>p.c>=0&&!old.p.some(z=>z.c===p.c)))
    milestones.push({input:prefix.length+i+1,a,state:cp(s)});
}}
console.log(JSON.stringify({model:'seed11 twoF1 -> second freeX four actual liveF0 -> ordinary Blue pickupFork1; no cargoX/stack/conflict',
  prefix,seed:start,cap,depthLimit,minAfterFour,expanded:head,seen:seen.size,queue:q.length,
  depthCutoffStates,transitions,threeActorBirthTransitions,maxOutsideAtBlueFork,
  queueExhausted:head===q.length,wholeConstrainedGraphExhausted:head===q.length&&depthCutoffStates===0,
  firstFour,...(best?{found:true,full:prefix+best.tail,...best,milestones}:{found:false})}));
