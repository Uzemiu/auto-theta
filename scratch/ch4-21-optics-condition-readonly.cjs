// Pure conditional short replays; no search and no game/KB/save mutation.
const m=require('./ch4-21-readonly.cjs'),clone=s=>JSON.parse(JSON.stringify(s));
m.setPairs({0:[10,4]}); // Gate7,6 pairing remains unassumed; these tests avoid it.
function construct(boxes,players){const s=clone(m.initial);s.keys=0;s.locks=0;s.p=players.map(r=>({r,f:'S',fork:0,key:0}));
 for(const b of s.b)if(b.kind==='BOX'){const z=boxes[b.orig];b.r=z.r;b.c=z.c||null;}return s;
}
const cargo=(f='A',fork=1)=>({f,fork,key:0,ghost:0});
function audit(){
 const lower=construct({81:{r:[3,1]},82:{r:[7,3]},83:{r:[2,1],c:cargo()}},[[10,2],[10,4]]);
 const southX=m.cargoX(lower,'conditionalSouthX');
 const upper=construct({81:{r:[3,1]},82:{r:[7,3]},83:{r:[3,7],c:cargo()}},[[10,2],[10,4]]);
 const northX=m.cargoX(upper,'conditionalNorthX');
 const wait=construct({81:{r:[7,3]},82:{r:[6,3]},83:{r:[8,2],c:cargo('S')}},[[8,3],[9,2]]);
 const waited=m.replay('ASAAW',wait);
 const captureSeed=construct({81:{r:[10,3]},82:{r:[5,2]},83:{r:[6,2],c:cargo()}},[[7,2],[4,3]]);
 const captured=m.replay('A',captureSeed);
 const allRay=clone(southX);allRay.p=[{r:[4,8],fork:0,key:0,f:'S'},{r:[5,8],fork:0,key:0,f:'S'}];
 const final=m.replay('AAA',allRay);
 return{southX:southX&&{s:m.summary(southX),mask:m.rayMask(southX)},northX:northX&&{s:m.summary(northX),mask:m.rayMask(northX)},wait:{pre:m.summary(wait),valid:waited.valid,trace:waited.trace,end:waited.valid&&m.summary(waited.s)},capture:{pre:m.summary(captureSeed),valid:captured.valid,trace:captured.trace,end:captured.valid&&m.summary(captured.s)},allRay:{constructedPre:m.summary(allRay),valid:final.valid,trace:final.trace,end:final.valid&&m.summary(final.s),mask:final.valid&&m.rayMask(final.s)},scope:'constructed conditional positions only; no source43 reachability or actual optical completion credit; ASAAW ordinary gate-independent wait/cargo recovery, A two-box-chain capture, AAA north finishing sequence; no BFS'};
}
if(require.main===module)console.log(JSON.stringify(audit(),null,2));
module.exports={construct,audit};
