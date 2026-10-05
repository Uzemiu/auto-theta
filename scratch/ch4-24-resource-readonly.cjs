// Conditional fixed replays only, public geometry/KB. No search or game calls.
const fs=require('fs'),vm=require('vm');
function model(pair){
 let code=fs.readFileSync('scratch/ch4-22-readonly.cjs','utf8')
 .replaceAll('artifacts/slot1-playthrough/4-22.json','artifacts/slot1-playthrough/4-24.json')
 .replace('if(!old.c&&z.c)old.c=z.c;', 'if(!old.c&&z.c)old.c=z.c;else if(old.c&&z.c){old.c.fork=Math.max(old.c.fork,z.c.fork);}')
 .replace('function blocked(r,s,p){', 'const gates=t.entities.filter(e=>e.type===\'BUTTONGATE\'),buttons=t.entities.filter(e=>e.type===\'BUTTON\');function blocked(r,s,p){const gi=gates.findIndex(e=>eq(e.pos,r));if(gi>=0&&!((s.gates||0)&(1<<gi)))return true;')
 .replace('return{b,p:ps,keys:km,locks:lm};', 'let gm=0;const occupied=r=>b.some(z=>eq(z.r,r))||ps.some(z=>eq(z.r,r));for(let i=0;i<gates.length;i++)if(occupied(gates[i].pos)||buttons.some((z,j)=>auditPair[j]===gates[i].details.ID&&occupied(z.pos)))gm|=1<<i;return{b,p:ps,keys:km,locks:lm,gates:gm};');
 const mod={exports:{}};vm.runInNewContext(code,{require,module:mod,console,process,auditPair:pair});return mod.exports;
}
const copy=s=>JSON.parse(JSON.stringify(s));
const c=fork=>({f:'S',fork,key:0,ghost:0});
const brief=s=>({b:s.b.map(b=>({r:b.r,c:b.c})),p:s.p,gates:s.gates,mask:null});
const results=[];
for(const pair of [[0,1],[1,0]]){
 const m=model(pair),forks=m.t.entities.filter(e=>e.type==='KEY');
 const seed={b:[{r:[4,7],orig:70,color:3,c:null},{r:[5,4],orig:87,color:1,c:null},{r:[4,8],orig:88,color:4,c:c(2)}],p:[{r:[1,5],f:'S',fork:1,key:0}],keys:m.initial.keys,locks:0,gates:0};
 for(const r of [[7,3],[4,8]]){const i=forks.findIndex(e=>e.pos.join(',')===r.join(','));seed.keys&=~(1<<i);}
 const strong=m.replay('SXDAX',seed),weakF1=m.replay('SXAX',seed);
 const weak=copy(seed);weak.p[0].fork=0;const weakF0=m.replay('SXAX',weak);
 const bottom=m.replay('SS',weakF0.s),top=m.replay('WWWWWW',weakF0.s);
 // Constructed mixed cargo/free left-lane finish; no reachable-source claim.
 const mixed=copy(weakF0.s);mixed.b.find(b=>b.c&&b.r.join(',')==='4,8').r=[1,3];mixed.p=[{r:[1,4],f:'S',fork:0,key:0}];mixed.gates=3;
 const finish=m.replay('SSWWWWWWW',mixed);
 // Manual M120-style arbitration, CONDITIONAL. Generic X rejects force conflict.
 // This constructs each proposed winner leaf; it does not prove game arbitration.
 const collision=[];
 for(const py of [4,3])for(const win of ['A','S']){
  const leaf=copy(seed),button=win==='A'?1:0,openID=pair[button];
  leaf.b=[{r:win==='A'?[3,7]:[4,6],orig:70,color:3,c:null},{r:[5,4],orig:87,color:1,c:null},{r:[4,7],orig:88,color:4,c:{...c(0),f:'A'}},{r:[4,9],orig:88,color:4,c:{...c(1),f:'A'}}];
  leaf.p=[{r:[1,py],f:'A',fork:0,key:0}];leaf.gates=1<<openID;
  for(const r of ['4,9','5,7']){const ki=forks.findIndex(e=>e.pos.join(',')===r);leaf.keys&=~(1<<ki);}
  const path=openID===0?'S'.repeat(py-1):'W'.repeat(9-py),end=m.replay(path,leaf);
  collision.push({manualWinner:win,freeSource:[1,py],openID,path,valid:end.valid,mask:end.valid?m.mask(end.s):0,spectator:end.valid?end.s.b.find(b=>b.r.join(',')==='4,9').c:null});
 }
 results.push({buttonOrder:'4,6 then3,7',pair,source:brief(seed),strong:{path:'SXDAX',valid:strong.valid,final:strong.valid?brief(strong.s):null},directF1:{path:'SXAX',valid:weakF1.valid,final:weakF1.valid?brief(weakF1.s):null},weakF0:{path:'SXAX',valid:weakF0.valid,final:weakF0.valid?brief(weakF0.s):null},singleOutsideLeaf:{bottomSS:m.mask(bottom.s),top6W:m.mask(top.s)},mixedLeft:{path:'SSWWWWWWW',valid:finish.valid,mask:finish.valid?m.mask(finish.s):0,final:finish.valid?brief(finish.s):null},manualCollisionConditional:collision});
}
console.log(JSON.stringify({scope:'conditional fixed replays, both gate-pair permutations, zero BFS',results},null,2));
