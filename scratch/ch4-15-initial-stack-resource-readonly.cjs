'use strict';
// Own finite initial independent-stack resource domain, no game/save/KB I/O.
// ICE is parsed as SOLID only in this in-memory copy; every actor/body landing
// there is rejected, so no ICE transition is simulated or falsely accepted.
const fs=require('fs');
const {createModel,replay}=require('./stack-cargo-readonly.cjs');
const record=JSON.parse(fs.readFileSync('artifacts/slot1-playthrough/4-15.json','utf8').replace(/^\uFEFF/,''));
const work=JSON.parse(JSON.stringify(record)),t=work.initial.level.timelines[0];
const at=p=>p.slice(0,2).join(','), ice=new Set(t.tiles.filter(x=>x.type==='ICE').map(x=>at(x.pos))),
  goals=new Set(work.initial.level.goals.map(at));
for(const x of t.tiles)if(x.type==='ICE')x.type='SOLID';
const model=createModel(work,{max_stack:2,same_type_only:true,allow_partial_death:false});
const prefix='AAAWX',pre=replay(model,prefix);
if(!pre.valid)throw Error('Initial seed prefix failed');
const start=pre.state;
function inDomain(s) {
  return s&&s.p.length===2&&s.p.every(p=>p[4]<0&&p[3]===0&&!ice.has(at(p))&&!goals.has(at(p)))&&
    s.b.every(p=>p[1]>1&&!ice.has(at(p))&&!goals.has(at(p)))&&s.l===0;
}
if(!inDomain(start))throw Error('Seed outside requested first-empty-stack domain');
const q=[{s:start,parent:-1,a:'',depth:0}],seen=new Set([model.serial(start)]),cap=10000;
let head=0,transitions=0,hit=null;
function path(i,a=''){for(;q[i].parent>=0;i=q[i].parent)a=q[i].a+a;return a;}
while(head<q.length&&head<cap){
  const index=head++,old=q[index];
  for(const a of 'WASD'){
    transitions++;
    const n=model.next(old.s,'WASD'.indexOf(a));if(!inDomain(n))continue;
    if(n.m.some(m=>m===3)){
      // Give a concrete immediate movement witness; do not accept an immobile
      // first overlap as a recoverable body and do not continue its search.
      const moves=[];
      for(const z of 'WASD'){
        const r=model.next(n,'WASD'.indexOf(z));
        if(inDomain(r)&&at(r.b[0])!==at(n.b[0]))moves.push({action:z,final:model.describe(r)});
      }
      if(moves.length){hit={tail:path(index,a),pre:model.describe(old.s),state:model.describe(n),recoveryMoves:moves};break;}
      continue;
    }
    const k=model.serial(n);if(seen.has(k))continue;seen.add(k);
    q.push({s:n,parent:index,a,depth:old.depth+1});
  }
  if(hit)break;
}
console.log(JSON.stringify({model:'initial AAAWX independent empty-box first-stack; no ICE/Goal/row1/cargo/ghost/X continuation',
  prefix,seed:pre.final,cap,expanded:head,seen:seen.size,queue:q.length,transitions,
  graphExhausted:!hit&&head===q.length,truncated:!hit&&head<q.length,
  ...(hit?{found:true,full:prefix+hit.tail,...hit}:{found:false})}));
