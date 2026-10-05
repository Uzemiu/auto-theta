// Fixed MODEL50 -> new60, and latest public observation comparison. No input/search.
const fs=require('fs'),assert=require('assert/strict');
const {createModel}=require('./ch2-G-m131-source-model-oct05.cjs');
const j=JSON.parse(fs.readFileSync('artifacts/slot1-playthrough/2-G.json','utf8').replace(/^\uFEFF/,''));
const ref=j.events[74].observation,tail='WDSAWWDWAA',m=createModel(ref),r=m.replay(tail);
assert.equal(ref.level.instructions.length,50);
assert(r.valid&&r.states.length===1&&r.states[0].choices.length===0);
for(const pt of r.points){assert.equal(pt.states.length,1);assert.equal(m.left(pt.states[0].state),4);}
if(process.argv[2]==='plan'){
 console.log(JSON.stringify({valid:true,full:ref.level.instructions+tail,checkpoints:r.points.filter(pt=>[4,8,10].includes(pt.step)).map(pt=>({n:50+pt.step,a:pt.a,state:m.describe(pt.states[0].state)}))}));
 process.exit(0);
}
const n=Number(process.argv[2]),latest=j.events.map((e,i)=>({...e,i})).filter(e=>e.observation).at(-1),o=latest.observation;
assert(n>=0&&n<=10);assert.equal(o.level.instructions,ref.level.instructions+tail.slice(0,n));
assert.equal(o.level.timelines.length,1);assert(!o.level.busy&&!o.level.input_locked&&!o.level.paused&&!o.level.completed);
const s=n?r.points[n-1].states[0].state:m.start,t=o.level.timelines[0],diffs=[];
for(const e of t.entities.filter(e=>e.type==='PLAYER'||e.type==='BOX')){
 const z=(e.type==='PLAYER'?s.p:s.b).find(z=>z.id===e.id),f=e.properties;
 const actual={pos:e.pos,active:e.active,face:f.face,ghost:f.ghost,masked:f.maskedoff,md:f.movingdir,src:f.movingsrc,contained:f.contained,height:f.height,split:f.split,key:f.key};
 const modeled={pos:z&&[z.x,z.y],active:e.type==='BOX'?true:z?.active,face:e.type==='BOX'?0:z?.face,ghost:e.type==='BOX'?undefined:z?.ghost,masked:e.type==='BOX'?0:z?.masked,md:0,src:-1,contained:0,height:1,split:e.type==='BOX'?undefined:0,key:e.type==='BOX'?undefined:0};
 if(JSON.stringify(actual)!==JSON.stringify(modeled))diffs.push({id:e.id,actual,modeled});
}
assert.deepEqual(diffs,[]);
console.log(JSON.stringify({event:latest.i,frame:o.frame,n:50+n,time:t.time,match:true,players:t.entities.filter(e=>e.type==='PLAYER'&&e.active).map(e=>({id:e.id,pos:e.pos,face:m.A[e.properties.face]})),boxes:t.entities.filter(e=>e.type==='BOX'&&e.active).map(e=>({id:e.id,pos:e.pos}))}));
