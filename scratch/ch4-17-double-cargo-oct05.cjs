// Public observed geometry only. Local fixed second-X and a distinct F0 graph.
// No Bridge, game input, save, or canonical KB writes.
const fs=require('fs'), base=require('./ch4-17-readonly.cjs');
const K=r=>r.join(','), eq=(a,b)=>K(a)===K(b), V={W:[0,1],A:[-1,0],S:[0,-1],D:[1,0]},L={W:'A',A:'S',S:'D',D:'W'};
const add=(r,d)=>[r[0]+V[d][0],r[1]+V[d][1]], cp=z=>JSON.parse(JSON.stringify(z));
const prefix='SDDDDAWWXWWWWDX', pre=base.replay(prefix.slice(0,-1));
if(!pre.valid)throw Error('First-resource replay failed');
function chain(bs,r,d,ids){if(base.blocked(r))return false;const i=bs.findIndex(b=>eq(b.r,r));if(i<0)return true;if(!chain(bs,add(r,d),d,ids))return false;ids.push(i);return true;}
function secondX(s){
 const sources=s.b.filter(b=>b.c&&b.c.fork>0), still=s.b.filter(b=>!b.c||!b.c.fork).map(cp), plans=[],req=new Map();
 for(const b of sources){let valid=[];for(const d of[L[b.c.f],L[L[L[b.c.f]]],b.c.f]){const r=add(b.r,d),ids=[];if(!chain(still,r,d,ids))continue;valid.push({r,d});for(const i of ids){if(req.has(i)&&req.get(i)!==d)throw Error('Unexpected fixed-X conflict');req.set(i,d);}if(valid.length===2)break;}if(!valid.length)valid=[{r:b.r,d:b.c.f}];for(const z of valid)plans.push({box:{r:z.r,ids:[`${b.orig}:${plans.length}`],origin:b.orig,c:{ghost:0}},f:b.c.f});}
 const ps=[];for(const p of s.p){if(!p.fork){ps.push(cp(p.r));continue;}let valid=[];for(const d of[L[p.f],L[L[L[p.f]]],p.f]){const r=add(p.r,d),ids=[];if(!chain(still,r,d,ids))continue;valid.push(r);for(const i of ids){if(req.has(i)&&req.get(i)!==d)throw Error('Unexpected fixed-X conflict');req.set(i,d);}if(valid.length===2)break;}if(!valid.length)valid=[p.r];ps.push(...valid);}
 const bs=still.map((b,i)=>({r:req.has(i)?add(b.r,req.get(i)):b.r,ids:[b.orig],origin:b.orig,c:b.c?{ghost:b.c.ghost}:null})).concat(plans.map(z=>z.box));
 if(bs.some((b,i)=>bs.some((q,j)=>i!==j&&eq(b.r,q.r))))throw Error('Unexpected fixed-X stack');
 if(ps.some(p=>base.spikes.has(K(p))||bs.some(b=>eq(b.r,p))))throw Error('Unexpected fixed-X death/capture');
 return {b:bs,p:ps};
}
const start=secondX(pre.s);
const stats={steps:0,conflicts:0,stacks:0,observations:0,capture:0,ghost:0,occupied:0,merge:0,death:0,unknown:0};
const samples=[];
function record(kind,path,pre,post){if(samples.filter(s=>s.kind===kind).length<3)samples.push({kind,path,pre,post});}
function hash(s){return s.b.map(b=>`${b.origin}:${b.ids.length}:${K(b.r)}:${b.c?b.c.ghost:'-'}`).sort().join(';')+'|'+s.p.map(K).sort().join(';');}
function step(s,a,path=''){
 stats.steps++;const plans=[],req=new Map();
 for(const p of s.p){let d=a,r=p,ids=[],ok=false;for(let j=0;j<4;j++,d=L[d]){r=add(p,d);ids=[];if(chain(s.b,r,d,ids)){ok=true;break;}}plans.push({r:ok?r:p,ids:ok?ids:[],d});if(ok)for(const i of ids){if(!req.has(i))req.set(i,new Set());req.get(i).add(d);}}
 const cf=[...req].filter(([i,ds])=>ds.size>1),assignments=[];
 function assign(j,c){if(j===cf.length){assignments.push(c);return;}for(const d of cf[j][1])assign(j+1,{...c,[cf[j][0]]:d});}assign(0,{});
 const out=[];let unknown=false;
 for(const chosen of assignments){const keep=plans.filter(p=>p.ids.every(i=>chosen[i]===undefined||chosen[i]===p.d)),dirs=new Map();for(const p of keep)for(const i of p.ids)dirs.set(i,p.d);if(cf.some(([i])=>dirs.get(i)!==chosen[i]))continue;
  const moved=s.b.map((b,i)=>({...cp(b),r:dirs.has(i)?add(b.r,dirs.get(i)):b.r})),bs=[];let bad=false,stack=false;
  for(const b of moved){const q=bs.find(q=>eq(q.r,b.r));if(!q){bs.push(b);continue;}
   if(q.origin===b.origin&&q.ids.length===1&&b.ids.length===1){q.c=q.c||b.c;stats.merge++;continue;}
   if(q.c&&b.c){stats.unknown++;record('double-cargo-stack',path,s,moved);bad=true;unknown=true;break;}
   q.ids.push(...b.ids);q.ids.sort();if(b.c)q.c=b.c;q.origin=String(q.origin)+'+'+String(b.origin);stack=true;stats.stacks++;
  }if(bad)continue;
  const ps=[];for(const z of keep){const box=bs.find(b=>eq(b.r,z.r));if(box){if(box.c){stats.occupied++;continue;}if(base.spikes.has(K(z.r))){stats.ghost++;record('ghost-capture',path,s,{b:bs,p:keep});bad=true;unknown=true;break;}box.c={ghost:0};stats.capture++;continue;}if(base.spikes.has(K(z.r))){stats.death++;continue;}if(!ps.some(p=>eq(p,z.r)))ps.push(z.r);}
  if(bad)continue;if(stack)record('empty-cargo-stack',path,s,{b:bs,p:ps});
  const obs=bs.find(b=>b.ids.length>1&&base.mmask({b:[b],p:[]})!==0);
  if(obs){stats.observations++;record('conditional-Goal-observation',path,s,{b:bs,p:ps});for(const id of obs.ids)out.push({s:{b:bs.map(b=>b===obs?{...b,ids:[id],origin:id}:b),p:ps},axis:{push:chosen,observation:id},conditional:true});}
  else out.push({s:{b:bs,p:ps},axis:cf.length?{push:chosen}:null});
 }
 if(cf.length){stats.conflicts++;record('force',path,s,out);}
 // An unresolved branch must not disappear from a compatible-family goal proof.
 return unknown?[]:out;
}
function search(cap=3500,depth=32,seed=start){const q=[{s:seed,path:'',choices:[],edges:[],options:new Map()}],seen=new Map([[hash(seed),0]]);let head=0,cut=0;
 while(head<q.length&&head<cap){const z=q[head++];z.options.set(base.mmask(z.s),{stop:base.mmask(z.s)});if(!z.s.p.length)continue;if(z.path.length>=depth){cut++;continue;}for(const a of'WASD'){const ns=step(z.s,a,z.path+a),children=[];for(let j=0;j<ns.length;j++){const n=ns[j],h=hash(n.s);let id=seen.get(h);if(id===undefined){id=q.length;seen.set(h,id);q.push({s:n.s,path:z.path+a,choices:z.choices.concat(ns.length>1?[{at:z.path.length+1,key:a,branch:j,axis:n.axis}]:[]),edges:[],options:new Map()});}children.push(id);}if(children.length)z.edges.push({a,children,axes:ns.map(n=>n.axis),conditional:ns.some(n=>n.conditional)});}}
 for(const z of q)if(!z.options.size)z.options.set(base.mmask(z.s),{stop:base.mmask(z.s)});
 let changed=true,passes=0;while(changed&&passes++<128){changed=false;for(let i=q.length-1;i>=0;i--){const z=q[i];for(const e of z.edges){let combos=new Map([[0,[]]]);for(const id of e.children){const next=new Map();for(const[cm,cp]of combos)for(const[m,p]of q[id].options){const u=cm|m;if(!next.has(u))next.set(u,cp.concat([p]));}combos=next;}for(const[m,plans]of combos)if(!z.options.has(m)){z.options.set(m,{a:e.a,axes:e.axes,conditional:e.conditional,children:plans});changed=true;}}}if(q[0].options.has(63))break;}
 const render=(p,prefix='')=>p.stop!==undefined?{prefix,mask:p.stop}:p.children.length===1?render(p.children[0],prefix+p.a):{prefix:prefix+p.a,axes:p.axes,conditional:p.conditional,leaves:p.children.map(c=>render(c))};
 const examples={};for(const z of q){const m=base.mmask(z.s);if(m&&!examples[m])examples[m]={path:z.path,choices:z.choices,s:z.s};}
 return{sourcePrefix:prefix,source:seed,hit:q[0].options.has(63)?render(q[0].options.get(63)):null,expanded:head,seen:q.length,pending:q.length-head,cut,exhausted:head===q.length,cap,depth,passes,rootMasks:[...q[0].options.keys()].sort((a,b)=>a-b),plans:Object.fromEntries([...q[0].options].map(([m,p])=>[m,render(p)])),stats,samples,goalExamples:examples};
}
if(require.main===module)console.log(JSON.stringify(search(Number(process.argv[2])||3500,Number(process.argv[3])||32),null,2));
module.exports={prefix,pre,start,secondX,step,search,hash};
