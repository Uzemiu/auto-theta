// Exactly two public M045 single-input fixtures. No whole-level replay/search/game calls.
const fs=require('fs'),{createModel}=require('./ch2-G-m045-model-oct05.cjs');
const read=name=>JSON.parse(fs.readFileSync('artifacts/slot1-playthrough/'+name+'.json','utf8').replace(/^\uFEFF/,''));
const results=[];
for(const [name,before,after,input] of [['2-21',15,17,'S'],['2-13',84,86,'A']]){
 const j=read(name),o=j.events[before].observation,e=j.events[after].observation,m=createModel(o),r=m.next(m.start,m.A.indexOf(input));
 const t=e.level.timelines.find(t=>t.id===e.level.current_timeline)||e.level.timelines[0];
 const actual={p:t.entities.filter(e=>e.type==='PLAYER'&&e.active).map(e=>({id:e.id,x:e.pos[0],y:e.pos[1],face:e.properties.face})),b:t.entities.filter(e=>e.type==='BOX'&&e.active).map(e=>({id:e.id,x:e.pos[0],y:e.pos[1]}))};
 const signature=s=>JSON.stringify({p:s.p.map(p=>[p.id,p.x,p.y,p.face]).sort((a,b)=>a[0]-b[0]),b:s.b.map(b=>[b.id,b.x,b.y]).sort((a,b)=>a[0]-b[0])});
 const match=!!r&&!r.conflict&&!r.probe&&signature(r)===signature(actual);
 results.push({name,before,after,input,match,pre:m.describe(m.start),model:r&&!r.conflict&&!r.probe?m.describe(r):r,actual:m.describe(actual),crossings:r?.crossings||[],diagnosis:match?null:'Public chord base has fixed blockable set and no 2-13 Gate57/button microtick update; Gate4,1 incorrectly remains closed throughout A. Not a counterexample to M045.'});
}
const result={mode:'fixed two-window calibration, no graph started',passed:results.every(r=>r.match),results};
if(require.main===module)console.log(JSON.stringify(result,null,2));
module.exports={result};
