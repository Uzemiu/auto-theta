// Readonly ordinary alignment from actual115 for a simultaneous landing/capture experiment.
// No game calls, hidden implementation, or predicted completion. The final S is not modeled.
const fs=require('fs'),vm=require('vm');
let src=fs.readFileSync('scratch/ch3-26-live92-two-observers-oct05.cjs','utf8');
src=src.slice(0,src.indexOf('const goal ='));
src=src.replace('j.events[61].observation','j.events[166].observation');
src+=`
const goal=s=>s.p.some(p=>K(p)==='5,2')&&s.p.some(p=>K(p)==='7,1')&&s.b.filter(b=>[65,67,69].includes(b.id)).every(b=>K(b)===K(start.b.find(z=>z.id===b.id)));
const q=[{s:start,parent:-1,a:'',depth:0}],seen=new Set([serial(start)]);let head=0,hit=null;
while(head<q.length&&head<120000){const index=head++,node=q[index];if(node.depth>=55)continue;for(let a=0;a<4;a++){const r=step(node.s,a);if(!r.state)continue;if(r.state.b.filter(b=>[65,67,69].includes(b.id)).some(b=>K(b)!==K(start.b.find(z=>z.id===b.id))))continue;const k=serial(r.state);if(seen.has(k))continue;seen.add(k);const child=q.length;q.push({s:r.state,parent:index,a:A[a],depth:node.depth+1});if(goal(r.state)){hit=child;break;}}if(hit!==null)break;}
let path=null,trace=[];if(hit!==null){const rev=[];for(let i=hit;q[i].parent>=0;i=q[i].parent)rev.push(i);rev.reverse();path=rev.map(i=>q[i].a).join('');trace=rev.map(i=>({a:q[i].a,state:q[i].s}));}
const report={scope:'MODEL ONLY alignment of alive players 5,2/7,1 before unmodeled S capture. No actual input/completion proof.',sourceEvent:166,sourceFrame:observation.frame,sourceTime:t.time,expanded:head,seen:seen.size,hit:hit!==null,path,trace};fs.writeFileSync('scratch/results/ch3-26-live115-capture-align-mobile-oct06.json',JSON.stringify(report,null,2)+'\\n');console.log(JSON.stringify({...report,trace:trace.length?{first:trace[0],last:trace.at(-1),length:trace.length}:[]}));`;
vm.runInNewContext(src,{require,console},{timeout:60000});
