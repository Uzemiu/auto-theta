// Public source173 fixed19 and unpropagated true-moving perpendicular probe.
// No game/search/save calls. Audit only the latest fully accepted public prefix.
const fs=require('fs'),assert=require('assert/strict');
const {createModel}=require('./ch2-G-m132-blocked-source-model-oct05.cjs');
const j=JSON.parse(fs.readFileSync('artifacts/slot1-playthrough/2-G.json','utf8').replace(/^\uFEFF/,''));
const ref=j.events[173].observation,tail='WWDDSASSWDAAWDWADWA',m=createModel(ref),r=m.replay(tail);
assert.equal(ref.level.instructions.length,60);assert(r.valid&&r.states.length===1&&r.states[0].choices.length===0);
const u=m.step(r.states[0].state,0);assert(!u.valid&&u.boundaries.length===1&&u.boundaries[0].boundary==='perpendicular-free-box');
const summary=s=>({players:s.p.map(z=>({id:z.id,pos:[z.x,z.y],face:m.A[z.face],active:z.active,ghost:z.ghost})),boxes:s.b.map(z=>({id:z.id,pos:[z.x,z.y]}))});
if(process.argv[2]==='plan'){
 console.log(JSON.stringify({valid19:true,prefix:tail,checkpoints:r.points.filter(p=>[4,8,12,16,19].includes(p.step)).map(p=>({n:60+p.step,...summary(p.states[0].state)})),lastWBoundary:{...u.boundaries[0],state:summary(u.boundaries[0].state)}}));process.exit(0);
}
const n=Number(process.argv[2]),latest=j.events.map((e,i)=>({...e,i})).filter(e=>e.observation).at(-1),o=latest.observation;
assert(Number.isInteger(n)&&n>=0&&n<=19);assert.equal(o.level.instructions,ref.level.instructions+tail.slice(0,n));
assert.equal(o.level.timelines.length,1);assert(!o.level.busy&&!o.level.input_locked&&!o.level.paused&&!o.level.completed&&!o.level.dialog);
const s=n?r.points[n-1].states[0].state:m.start,t=o.level.timelines[0],diffs=[];
for(const e of t.entities.filter(e=>e.type==='PLAYER'||e.type==='BOX')){
 const z=(e.type==='PLAYER'?s.p:s.b).find(z=>z.id===e.id),f=e.properties;
 const actual={pos:e.pos,active:e.active,face:f.face,ghost:f.ghost,masked:f.maskedoff,md:f.movingdir,src:f.movingsrc,contained:f.contained,height:f.height,split:f.split,key:f.key};
 const modeled={pos:z&&[z.x,z.y],active:e.type==='BOX'?true:z?.active,face:e.type==='BOX'?0:z?.face,ghost:e.type==='BOX'?undefined:z?.ghost,masked:e.type==='BOX'?0:z?.masked,md:0,src:-1,contained:0,height:1,split:e.type==='BOX'?undefined:0,key:e.type==='BOX'?undefined:0};
 if(JSON.stringify(actual)!==JSON.stringify(modeled))diffs.push({id:e.id,actual,modeled});
}
assert.deepEqual(diffs,[]);console.log(JSON.stringify({event:latest.i,frame:o.frame,n:60+n,time:t.time,match:true,...summary(s)}));
