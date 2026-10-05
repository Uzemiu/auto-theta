// Fixed public-geometry replay only. No search, game, UI, save or hidden code.
const g=require('./ch4-17-readonly.cjs'),m=require('./ch4-17-fixed-firstX-low-cargo-oct05.cjs');
const source=require('./ch4-17-pre-lastX-deployment-oct05.cjs').source;
const cp=z=>JSON.parse(JSON.stringify(z)),K=r=>r.join(','),eq=(a,b)=>K(a)===K(b);
const V={W:[0,1],A:[-1,0],S:[0,-1],D:[1,0]},L={W:'A',A:'S',S:'D',D:'W'},add=(r,d)=>[r[0]+V[d][0],r[1]+V[d][1]];
const sourcePrefix='SDDDDWAXDWAWSWAWSDSAWWSAA',tail='DWWAAAASSDWWDDDDSS';
function forkX(s){
 const still=s.b.filter(b=>!b.c||!b.c.fork).map(cp),charged=s.b.filter(b=>b.c&&b.c.fork),born=[],free=[],req=new Map(),plans=[];
 function chain(r,d,ids){if(g.blocked(r))return false;const i=still.findIndex(b=>eq(b.r,r));if(i<0)return true;if(!chain(add(r,d),d,ids))return false;ids.push(i);return true;}
 function opts(r,f){const out=[];for(const d of[L[f],L[L[L[f]]],f]){const q=add(r,d),ids=[];if(!chain(q,d,ids))continue;
   for(const i of ids){if(!req.has(i))req.set(i,new Set());req.get(i).add(d);}out.push({r:q,d,ids});if(out.length===2)break;}return out;}
 for(const b of charged){const os=opts(b.r,b.c.f);if(!os.length)return{valid:false,boundary:'failed cargo-X'};for(let j=0;j<os.length;j++){const o=os[j];born.push({...cp(b),r:o.r,child:j,c:{...b.c,fork:b.c.fork-1}});plans.push({cargoOrig:b.orig,...o});}}
 for(const p of s.p){if(!p.fork){free.push(cp(p));continue;}const os=opts(p.r,p.f);if(!os.length)free.push({...cp(p),fork:p.fork-1});else for(const o of os){free.push({...cp(p),r:o.r,fork:p.fork-1});plans.push({free:true,...o});}}
 if([...req.values()].some(ds=>ds.size>1))return{valid:false,boundary:'force',plans};
 for(const[i,ds]of req)still[i].r=add(still[i].r,[...ds][0]);
 const b=still.concat(born),p=[],captures=[];
 if(new Set(b.map(z=>K(z.r))).size!==b.length)return{valid:false,boundary:'stack/fusion',b,plans};
 for(const f of free){const box=b.find(z=>eq(z.r,f.r));if(box){if(box.c)return{valid:false,boundary:'occupied',b,free,plans};if(g.spikes.has(K(f.r)))return{valid:false,boundary:'SPIKE birth capture',b,free,plans};box.c={f:f.f,fork:f.fork,ghost:0};captures.push({boxOrig:box.orig,r:box.r,freeChild:cp(f)});continue;}
  if(g.spikes.has(K(f.r)))return{valid:false,boundary:'naked birth SPIKE',b,free,plans};
  if(p.some(q=>eq(q.r,f.r)))return{valid:false,boundary:'free fusion',b,free,plans};p.push(f);}
 return{valid:true,s:{b,p,keys:s.keys,x:s.x+1},plans,captures};
}
function run(){const pre=m.fixed(tail,source);if(!pre.valid)return{valid:false,phase:'ordinary pre43',pre};const x=forkX(pre.s);
 return{sourcePrefix,tail,full43:sourcePrefix+tail,full44:sourcePrefix+tail+'X',pre43:pre.s,post44:x,valid:pre.valid&&x.valid,
        trace:pre.trace,search:{started:false,expanded:0,liveHandle:null},scope:'Only fixed 25+18 ordinary then one known cargo/free X. Same-input moving empty Box catches free-child per M129. Unknown force/stack/occupied/SPIKE birth stop. Candidate44 not actual.'};}
if(require.main===module){const r=run();console.log(JSON.stringify({valid:r.valid,full43:r.full43,full44:r.full44,pre43:r.pre43,post44:r.post44,search:r.search},null,2));}
module.exports={sourcePrefix,tail,source,forkX,run};
