// Readonly new timing probe: prepare Ghost4,2/free5,9 with both Prism still6,9/4,9.
// The final D pushes right Prism toGoal7,9. End-tick MODEL predicts col4 cleared but Ghost at5,2 not revived.
// A different real revival would reveal optical update timing, not be assumed from code.
const fs=require('fs'),vm=require('vm');let src=fs.readFileSync('scratch/ch3-27-optics-oct06.cjs','utf8');src=src.slice(0,src.indexOf('const old=replay('));
src+=`
const q=[{s:seed(record.events[3].observation),parent:-1,a:''}],seen=new Set([canonical(q[0].s).replace(/,"time":\\d+}/,'}')]);let hit=-1,expanded=0,unknown=0;
for(let i=0;i<q.length&&expanded<3000;i++){expanded++;const s=q[i].s;if(s.p.some(p=>p.g&&xy(p.z)==='4,2')&&s.p.some(p=>!p.g&&xy(p.z)==='5,9')){hit=i;break;}for(const a of chars){let n;try{n=step(s,a);}catch(e){unknown++;continue;}if(n.p.length!==2||n.p.filter(p=>p.g).length!==1||n.dark.size!==6||xy(n.b.find(b=>b.id===50).z)!=='6,9'||xy(n.b.find(b=>b.id===51).z)!=='4,9')continue;const k=canonical(n).replace(/,"time":\\d+}/,'}');if(seen.has(k))continue;seen.add(k);q.push({s:n,parent:i,a});}}
let path=null,trace=[];if(hit>=0){path='';for(let i=hit;q[i].parent>=0;i=q[i].parent)path=q[i].a+path;let s=q[0].s;for(const a of path){s=step(s,a);trace.push({a,...compact(s)});}}
const report={scope:'MODEL ONLY new pre-vs-post optical timing probe, no actual input/completion.',sourceEvent:3,sourceFrame:record.events[3].observation.frame,sourceActions:record.events[3].observation.level.instructions,expanded,seen:seen.size,hit:hit>=0,path,trace,pre:hit>=0?compact(q[hit].s):null,lastD:hit>=0?compact(step(q[hit].s,'D')):null};fs.writeFileSync('scratch/results/ch3-27-col4-timing-probe-oct06.json',JSON.stringify(report,null,2));console.log(JSON.stringify({...report,trace:trace.length?{first:trace[0],last:trace.at(-1),length:trace.length}:[]}));`;
vm.runInNewContext(src,{require,console},{timeout:30000});
