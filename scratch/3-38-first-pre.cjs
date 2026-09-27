// Candidate-only weighted geometric search; no game input or optical assumptions.
const fs=require('fs'),api=require('./stack-cargo-readonly.cjs');
const r=JSON.parse(fs.readFileSync('artifacts/slot1-playthrough/3-38.json','utf8'));
const event=11; // Fixed actual checkpoint; do not use latest observation.
const model=api.createModel(r,{observation_event:event,max_stack:3,allow_partial_death:false});
const targets=[[75,2,3],[79,3,2]].map(a=>({m:model.maskFor(a.slice(0,-2)),p:a.slice(-2)}));
const dist=(a,b)=>Math.abs(a[0]-b[0])+Math.abs(a[1]-b[1]);
const h=s=>targets.reduce((n,t)=>{let i=s.m.indexOf(t.m);return n+(i<0?50:dist(s.b[i],t.p)*4);},0)+Math.min(dist(s.p[0],[2,4])+dist(s.p[1],[4,2]),dist(s.p[1],[2,4])+dist(s.p[0],[4,2]));
let seq=0;const heap=[];function add(n){n.order=seq++;heap.push(n);for(let i=heap.length-1;i>0;){let p=(i-1)>>1;if(heap[p].f<=n.f)break;heap[i]=heap[p];heap[p]=n;i=p;}}
function pop(){const n=heap[0],v=heap.pop();if(heap.length){heap[0]=v;for(let i=0;;){let l=i*2+1;if(l>=heap.length)break;let j=l,r=l+1;if(r<heap.length&&heap[r].f<heap[l].f)j=r;if(heap[i].f<=heap[j].f)break;[heap[i],heap[j]]=[heap[j],heap[i]];i=j;}}return n;}
const start=model.start,seen=new Map([[model.serial(start),0]]);add({s:start,g:0,f:h(start)*4,parent:null,a:''});
let processed=0,best=null;const limit=Number(process.argv[2]||60000);
while(heap.length&&processed<limit){const n=pop();if(n.g!==seen.get(model.serial(n.s)))continue;processed++;if(h(n.s)===0){best=n;break;}
 for(let a=0;a<4;a++){const s=model.next(n.s,a);if(!s||s.p.length!==2||s.p.some(p=>p[4]>=0)||s.b.some(b=>b[0]===1||b[0]===11||b[1]===1||b[1]===9)||s.m.length!==6||[1,4,8,16].some(m=>{const i=s.m.indexOf(m),j=start.m.indexOf(m);return i<0||s.b[i].join()!=start.b[j].join()}))continue;const k=model.serial(s),g=n.g+1;if((seen.get(k)??Infinity)<=g)continue;seen.set(k,g);add({s,g,f:g+4*h(s),parent:n,a:'WASD'[a]});}}
let route=null;if(best){route='';for(let n=best;n.parent;n=n.parent)route=n.a+route;}
console.log(JSON.stringify({processed,seen:seen.size,pending:heap.length,route,final:best&&model.describe(best.s)}));
