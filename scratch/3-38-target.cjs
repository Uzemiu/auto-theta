const fs=require('fs'),api=require('./stack-cargo-readonly.cjs');
const cfg=JSON.parse(fs.readFileSync(process.argv[2],'utf8'));
const r=JSON.parse(fs.readFileSync('artifacts/slot1-playthrough/3-38.json','utf8'));
const event=cfg.event??r.events.findLastIndex(e=>e.observation);
const model=api.createModel(r,{observation_event:event,timeline_index:cfg.line||0,max_stack:3});
const targets=cfg.groups.map(a=>({m:model.maskFor(a.ids),p:a.at}));
const fixed=(cfg.fixed||[]).map(ids=>model.maskFor(ids));
const dist=(a,b)=>Math.abs(a[0]-b[0])+Math.abs(a[1]-b[1]);
const h=s=>targets.reduce((n,t)=>{let i=s.m.indexOf(t.m);return n+(i<0?50:dist(s.b[i],t.p)*4);},0)+(cfg.players?(s.p.length===1?dist(s.p[0],cfg.players[0]):Math.min(dist(s.p[0],cfg.players[0])+dist(s.p[1],cfg.players[1]),dist(s.p[1],cfg.players[0])+dist(s.p[0],cfg.players[1]))):0);
const heap=[];function add(n){heap.push(n);for(let i=heap.length-1;i>0;){let p=(i-1)>>1;if(heap[p].f<=n.f)break;heap[i]=heap[p];heap[p]=n;i=p;}}
function pop(){const n=heap[0],v=heap.pop();if(heap.length){heap[0]=v;for(let i=0;;){let l=i*2+1;if(l>=heap.length)break;let j=l,r=l+1;if(r<heap.length&&heap[r].f<heap[l].f)j=r;if(heap[i].f<=heap[j].f)break;[heap[i],heap[j]]=[heap[j],heap[i]];i=j;}}return n;}
const start=model.start,seen=new Map([[model.serial(start),0]]);add({s:start,g:0,f:h(start)*4,parent:null,a:''});
const goals=new Set(r.initial.level.goals.map(p=>p.join()));
let processed=0,best=null;const limit=cfg.limit||50000;
while(heap.length&&processed<limit){const n=pop();if(n.g!==seen.get(model.serial(n.s)))continue;processed++;if(h(n.s)===0){best=n;break;}
 for(let a=0;a<4;a++){const s=model.next(n.s,a);if(!s||s.p.length!==start.p.length||s.p.some(p=>p[4]>=0)||s.b.some(b=>goals.has(b.join())&&!(cfg.allowed_goals||[]).some(g=>g.join()===b.join()))||s.m.length!==start.m.length||fixed.some(m=>{const i=s.m.indexOf(m),j=start.m.indexOf(m);return i<0||s.b[i].join()!=start.b[j].join()}))continue;const k=model.serial(s),g=n.g+1;if((seen.get(k)??Infinity)<=g)continue;seen.set(k,g);add({s,g,f:g+4*h(s),parent:n,a:'WASD'[a]});}}
let route=null;if(best){route='';for(let n=best;n.parent;n=n.parent)route=n.a+route;}
console.log(JSON.stringify({processed,seen:seen.size,pending:heap.length,event,route,final:best&&model.describe(best.s)}));
