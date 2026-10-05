// Readonly fixed-first-X lower capture resource domain. Public geometry only.
// No game/Bridge/UI/save/hint/hidden implementation calls.
const base=require('./ch4-17-readonly.cjs'),cp=z=>JSON.parse(JSON.stringify(z));
const K=r=>r.join(','),eq=(a,b)=>K(a)===K(b),V={W:[0,1],A:[-1,0],S:[0,-1],D:[1,0]},L={W:'A',A:'S',S:'D',D:'W'};
const add=(r,d)=>[r[0]+V[d][0],r[1]+V[d][1]],dist=(a,b)=>Math.abs(a[0]-b[0])+Math.abs(a[1]-b[1]);
const prefix='SDDDDWAX',sourceReplay=base.replay(prefix);
if(!sourceReplay.valid)throw Error('Fixed first-X source failed');
const source=sourceReplay.s,stats={},samples={};
const inc=k=>stats[k]=(stats[k]||0)+1;
function stop(k,path,s,post){inc(k);if(!samples[k])samples[k]={path,pre:cp(s),post:cp(post)};return null;}
function chain(bs,r,d,ids){if(base.blocked(r))return false;const i=bs.findIndex(b=>eq(b.r,r));if(i<0)return true;if(!chain(bs,add(r,d),d,ids))return false;ids.push(i);return true;}
function ordinary(s,a,path=''){
 if(!V[a])throw Error('Ordinary search only');
 const b=s.b.map(b=>({...cp(b),c:b.c?{...b.c,f:a}:null})),plans=[],dirs=new Map();
 for(const p of s.p){let d=a,r=p.r,ids=[],ok=false;for(let j=0;j<4;j++,d=L[d]){r=add(p.r,d);ids=[];if(chain(s.b,r,d,ids)){ok=true;break;}}plans.push({p:{...cp(p),r:ok?r:p.r,f:ok?d:p.f},ids:ok?ids:[],d});
  if(ok)for(const i of ids){if(dirs.has(i)&&dirs.get(i)!==d)return stop('force',path,s,plans);dirs.set(i,d);}}
 for(const[i,d]of dirs)b[i].r=add(b[i].r,d);
 if(new Set(b.map(b=>K(b.r))).size!==b.length)return stop('stack',path,s,b);
 const ps=[];
 for(const z of plans){const box=b.find(b=>eq(b.r,z.p.r));if(box){if(box.c)return stop('occupied',path,s,{b,plans});if(base.spikes.has(K(z.p.r)))return stop('ghostCapture',path,s,{b,plans});box.c={f:z.p.f,fork:z.p.fork,ghost:0};inc('capture');continue;}
  if(base.spikes.has(K(z.p.r))){inc('nakedDeath');continue;}
  const old=ps.find(p=>eq(p.r,z.p.r));if(old){inc('freeFusion');old.fork=Math.max(old.fork,z.p.fork);}else ps.push(z.p);}
 return{b,p:ps,keys:s.keys,x:s.x};
}
const actors=s=>s.p.length+s.b.filter(b=>b.c).length;
const resource=s=>actors(s)===2&&s.p.length===1&&s.p[0].fork===1&&s.b.filter(b=>b.c).length===1&&s.b.some(b=>b.c&&b.c.fork===1&&!b.c.ghost);
const exact=s=>resource(s)&&s.b.some(b=>b.orig===55&&b.c&&eq(b.r,[2,3]))&&s.b.some(b=>b.orig===56&&!b.c&&eq(b.r,[3,3]))&&eq(s.p[0].r,[4,3]);
const hash=s=>s.b.map(b=>[b.orig,K(b.r),b.c?b.c.fork:'-',b.c?b.c.ghost:'-'].join(':')).sort().join('|')+'#'+s.p.map(p=>[K(p.r),p.fork].join(':')).sort().join('|');
function fixed(path,start=source){let s=cp(start),trace=[];for(let i=0;i<path.length;i++){s=ordinary(s,path[i],path.slice(0,i+1));if(!s)return{valid:false,failed:i+1,trace};trace.push({n:i+1,a:path[i],s:cp(s)});}return{valid:true,path,s,trace};}
function priority(z){const s=z.s,c=s.b.find(b=>b.c);let h=0;
 if(c){h=3*dist(c.r,[2,3])+3*dist(s.p[0].r,[4,3])+2*dist(s.b.find(b=>b.orig===56).r,[3,3]);if(c.orig!==55)h+=20;}
 else{h=2*dist(s.b.find(b=>b.orig===55).r,[3,3])+2*dist(s.b.find(b=>b.orig===56).r,[4,3]);const[r,t]=s.p.map(p=>p.r);h+=Math.min(dist(r,[1,3])+dist(t,[5,3]),dist(t,[1,3])+dist(r,[5,3]));}
 return z.path.length+h;}
function search(cap=4000,depth=35){const heap=[],seen=new Map();let serial=0;
 function push(z){z.serial=serial++;heap.push(z);let i=heap.length-1;while(i){const j=(i-1)>>1;if(priority(heap[j])<priority(heap[i])||priority(heap[j])===priority(heap[i])&&heap[j].serial<heap[i].serial)break;[heap[i],heap[j]]=[heap[j],heap[i]];i=j;}}
 function pop(){const z=heap[0],last=heap.pop();if(heap.length){heap[0]=last;let i=0;while(2*i+1<heap.length){let j=2*i+1;if(j+1<heap.length&&(priority(heap[j+1])<priority(heap[j])||priority(heap[j+1])===priority(heap[j])&&heap[j+1].serial<heap[j].serial))j++;if(priority(heap[i])<priority(heap[j])||priority(heap[i])===priority(heap[j])&&heap[i].serial<heap[j].serial)break;[heap[i],heap[j]]=[heap[j],heap[i]];i=j;}}return z;}
 push({s:cp(source),path:''});seen.set(hash(source),0);let expanded=0,stale=0,depthCut=0,hit=null,firstLow=null;
 while(heap.length&&expanded<cap){const z=pop();if(seen.get(hash(z.s))!==z.path.length){stale++;continue;}expanded++;
  if(resource(z.s)&&!firstLow)firstLow={path:z.path,full:prefix+z.path,s:cp(z.s)};
  if(exact(z.s)){hit={path:z.path,full:prefix+z.path,s:cp(z.s),fixed:fixed(z.path)};break;}
  if(z.path.length>=depth){depthCut++;continue;}
  for(const a of'WASD'){const path=z.path+a,n=ordinary(z.s,a,path);if(!n)continue;
   if(actors(n)!==2||n.p.some(p=>p.fork!==1)||n.b.some(b=>b.c&&(b.c.fork!==1||b.c.ghost))){inc('lostInventory');continue;}
   const oldCargo=z.s.b.find(b=>b.c),newCargo=n.b.find(b=>b.c);
   if(!oldCargo&&newCargo&&(newCargo.r[1]<3||newCargo.r[1]>4)){inc('firstCaptureNotLow');continue;}
   const h=hash(n);if(seen.has(h)&&seen.get(h)<=path.length)continue;seen.set(h,path.length);push({s:n,path});}
 }
 return{cap,depth,sourcePrefix:prefix,source,expanded,seen:seen.size,pending:heap.length,stale,depthCut,exhausted:heap.length===0,hit,firstLow,stats,samples,liveHandle:null,scope:'Only fixed8 source; WASD preserving2Fork1 actors. Firstcapture restricted y3/4; x1/row1 boxes not generally pruned; prioritize C4(2,3)+emptyBlue(3,3)+outside(4,3). Stop Ghost/force/stack/occupied. First exact hit stops; no actual5/all-firstX or actual9/F0 rerun.'};
}
// Fixed simultaneous cargo+free second X only; never a search edge.
function secondX(s){
 const charged=s.b.filter(b=>b.c&&b.c.fork),still=s.b.filter(b=>!b.c||!b.c.fork).map(cp),born=[],ps=[],dirs=new Map();
 function options(r,f){const out=[];for(const d of[L[f],L[L[L[f]]],f]){const q=add(r,d),ids=[];if(!chain(still,q,d,ids))continue;for(const i of ids){if(dirs.has(i)&&dirs.get(i)!==d)throw Error('Fixed second-X force boundary');dirs.set(i,d);}out.push(q);if(out.length===2)break;}return out;}
 for(const b of charged)for(const r of options(b.r,b.c.f))born.push({...cp(b),r,c:{...b.c,fork:b.c.fork-1}});
 for(const p of s.p)if(p.fork)for(const r of options(p.r,p.f))ps.push({...cp(p),r,fork:p.fork-1});else ps.push(cp(p));
 for(const[i,d]of dirs)still[i].r=add(still[i].r,d);
 const b=still.concat(born);
 if(new Set(b.map(b=>K(b.r))).size!==b.length)throw Error('Fixed second-X stack/fusion boundary');
 if(ps.some(p=>base.spikes.has(K(p.r))||b.some(b=>eq(b.r,p.r))))throw Error('Fixed second-X naked death/capture boundary');
 return{b,p:ps,keys:s.keys,x:s.x+1};
}
if(require.main===module){const mode=process.argv[2]||'search';const r=mode==='search'?search():fixed(process.argv[3]||'');if(r.hit){const post=fixed('DWWAD',r.hit.s);r.followup={outside5_5:post,secondX:post.valid?secondX(post.s):null};}console.log(JSON.stringify(r,null,2));}
module.exports={prefix,source,ordinary,fixed,search,secondX,exact,resource};
