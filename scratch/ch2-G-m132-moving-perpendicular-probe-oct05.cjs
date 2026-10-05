// Fixed probe from actual60, no search or interaction; genuinely movable A/W.
const fs=require('fs'),{createModel}=require('./ch2-G-m132-blocked-source-model-oct05.cjs');
const j=JSON.parse(fs.readFileSync('artifacts/slot1-playthrough/2-G.json','utf8').replace(/^\uFEFF/,''));
const event=173,m=createModel(j.events[event].observation),tail='WWDDSASSWDAAWDWADWAW',prefix=tail.slice(0,-1),r=m.replay(prefix);
if(!r.valid||r.states.length!==1)throw Error('Earlier fixed prefix invalid '+JSON.stringify(r));
const pre=r.states[0].state,probe=m.step(pre,m.A.indexOf(tail.at(-1)));
const boundary=probe.boundaries.find(z=>z.boundary==='perpendicular-free-box');
if(probe.valid||!boundary)throw Error('Expected sole unpropagated perpendicular boundary');
const st=boundary.state,V=[[0,1],[-1,0],[0,-1],[1,0]],body=st.b.find(b=>b.id===boundary.box),tiles=new Map(j.events[event].observation.level.timelines[0].tiles.map(t=>[t.pos.join(','),t.type])),walls=new Set(j.events[event].observation.level.timelines[0].entities.filter(e=>e.active&&e.blockable&&e.type!=='BOX').map(e=>e.pos.join(',')));
function destination(d){const p=[body.x+V[d][0],body.y+V[d][1]];return {pos:p,wall:walls.has(p.join(',')),terrain:tiles.get(p.join(',')),body:st.b.find(b=>b.x===p[0]&&b.y===p[1])?.id,players:st.p.filter(q=>q.x===p[0]&&q.y===p[1]).map(q=>({id:q.id,active:q.active,ghost:q.ghost,masked:q.masked}))};}
const summary={event,tail,length:tail.length,prefix,validPrefix:r.valid,leftBefore:m.left(pre),pre:m.describe(pre),boundary:{...boundary,state:m.describe(st)},oldDirection:destination(boundary.boxDirection),playerDirection:destination(boundary.playerDirection),checkpoints:r.points.filter(p=>[4,8,12,16,19].includes(p.step)).map(p=>({step:p.step,prefix:prefix.slice(0,p.step),state:m.describe(p.states[0].state)}))};
if(require.main===module)console.log(JSON.stringify(summary,null,2));
module.exports={m,r,pre,probe,summary};
