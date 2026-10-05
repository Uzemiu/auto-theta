// Read-only fixed candidate from actual35. No game APIs, searches, or external source.
// Pre53 and ordinary tails reuse the public-observation 4-24 model.
// Final single-Blue X conflict is explicitly conditional on observed M120/M127 force masking.
// CLOSED actual62: main 4-24 JSON events84/86/88..90/92/96..101 + completion/run.
// Actual53 validates A/S leaves and both button pairs; lower SSS first, T, upper WWWWW.
// This file keeps the earlier explicit conditional arbitration model, no new search.
const b=require('./ch4-24-readonly.cjs');
const copy=x=>JSON.parse(JSON.stringify(x)), K=r=>r.join(','), eq=(a,c)=>K(a)===K(c);
const V={W:[0,1],A:[-1,0],S:[0,-1],D:[1,0]},L={W:'A',A:'S',S:'D',D:'W'},add=(r,d)=>[r[0]+V[d][0],r[1]+V[d][1]];
const prefix35=b.resource35,tail12='AXDXXAXXXXXX',walk5='AAAAA',prefix52=prefix35+tail12+walk5;
// Both pairings now actual53; the earlier conditional model remains for historical replay.
b.setPairs({1:[3,7],0:[4,6]});
const r=b.replay(prefix52);
if(!r.valid)throw new Error('Pre52 failed at '+r.n);
const s=r.s,charged=s.b.filter(z=>z.c?.fork>0);
if(charged.length!==2||!charged.some(z=>eq(z.r,[5,7])&&z.c.fork===1&&z.c.f==='A')||!charged.some(z=>eq(z.r,[4,8])&&z.c.fork===1&&z.c.f==='A')||!s.b.some(z=>z.orig===70&&eq(z.r,[4,7]))||s.p.length!==1||!eq(s.p[0].r,[1,4])||s.p[0].fork)throw new Error('Wrong pre52 source');
function bornPlans(s){
 const bs=s.b.filter(z=>!z.c?.fork).map(copy),plans=[];
 function chain(r,d,ids){if(b.wall.has(K(r))||!b.floor.has(K(r)))return false;const i=bs.findIndex(z=>eq(z.r,r));if(i<0)return true;if(!chain(add(r,d),d,ids))return false;ids.push(i);return true;}
 for(const z of charged){let n=0;for(const d of[L[z.c.f],L[L[L[z.c.f]]],z.c.f]){const q=add(z.r,d),ids=[];if(!chain(q,d,ids))continue;plans.push({parent:z,r:q,d,ids,fork:z.c.fork-1});if(++n===2)break;}if(!n)throw new Error('Unexpected blocked birth');}
 return{bs,plans};
}
const birth=bornPlans(s),forces=new Map();
for(const p of birth.plans)for(const i of p.ids){if(!forces.has(i))forces.set(i,new Set());forces.get(i).add(p.d);}
const conflicts=[...forces].filter(([i,ds])=>ds.size>1);
if(conflicts.length!==1||birth.bs[conflicts[0][0]].orig!==70||[...conflicts[0][1]].sort().join('')!=='AS')throw new Error('Wrong force predicate');
function arbitrate(dir){
 const bs=birth.bs.map(copy),accepted=birth.plans.filter(p=>p.ids.every(i=>!forces.has(i)||forces.get(i).size===1||p.d===dir));
 const ds=new Map();for(const p of accepted)for(const i of p.ids)ds.set(i,p.d);
 for(const[i,d]of ds)bs[i].r=add(bs[i].r,d);
 for(const p of accepted)bs.push({...copy(p.parent),r:p.r,c:{...copy(p.parent.c),fork:p.fork}});
 if(new Set(bs.map(z=>K(z.r))).size!==bs.length)throw new Error('Unexpected stack in conditional winner');
 return{b:bs,p:s.p.map(copy),keys:s.keys,locks:s.locks};
}
const leaves={};
for(const d of['A','S']){
 const st=arbitrate(d),goalTail=d==='A'?'WWWWW':'SSSSS',rr=b.replay(goalTail,st);
 if(!rr.valid)throw new Error('Conditional ordinary tail failed');
 leaves[d]={blue:b.summary(st).boxes.find(z=>z.id===70).p,post53:b.summary(st),tail:goalTail,mask:b.mask(rr.s),end58:b.summary(rr.s),...(process.argv.includes('--full')?{trace:rr.trace}:{})};
}
if((leaves.A.mask|leaves.S.mask)!==3)throw new Error('No union');
const minimalLower=b.replay('SSS',arbitrate('S'));
const observed35=b.raw.events.map((e,i)=>({i,o:e.observation})).filter(z=>z.o?.level?.id==='snap'&&z.o.level.instructions===prefix35).at(-1);
const actual42=b.raw.events.map((e,i)=>({i,o:e.observation})).filter(z=>z.o?.level?.id==='snap'&&z.o.level.instructions.length===42).at(-1);
console.log(JSON.stringify({status:'actual62-closed',historicalModel:'explicit-conditional-force-arbitration',actualProof:{file:'artifacts/slot1-playthrough/4-24.json',events:[84,86,88,89,90,92,96,101],sections:['completion','run'],actions:prefix52+'XSSSTWWWWW',actionCount:62,completed:true,axisTimes:[56,58]},searchStarted:false,liveHandle:null,
 source35Event:observed35?.i,actual42Event:actual42?.i,prefix35,tail12,prefix47:prefix35+tail12,prefix52,forceInput53:'X',
 pre52:b.summary(s),milestones:r.trace.filter(z=>z.n>=35&&z.n<=47).map(z=>({n:z.n,a:z.a,charged:z.s.boxes.filter(z=>z.c?.fork>0),free:z.s.free})),
 birthPlans:birth.plans.map(p=>({parent:p.parent.r,child:p.r,d:p.d,forceBoxes:p.ids.map(i=>birth.bs[i].orig)})),
 leaves,lowerMinimal56:{tail:'SSS',mask:b.mask(minimalLower.s),end:b.summary(minimalLower.s)},
 scope:'CLOSED actual62, lower3 then upper5 is actually complete. Both Button pairs and two X force leaves verified in main JSON actual53. Historical fixed model: no BFS, prefix/ordinary tails reuse base engine; final X uses explicit A/S arbitration. No new model run or game input/writes for status closure.'
},null,2));
