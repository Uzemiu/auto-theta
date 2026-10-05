// Root read-only predicate change: old two-fork split then live Color3 capture.
// Observed ordinary/ICE and free-X mechanics; no game IO or hidden code.
const fs=require('fs'),vm=require('vm');
const src=fs.readFileSync('scratch/ch4-15-readonly.cjs','utf8');
const ctx={require,process:{argv:[]},console,module:{exports:{}}};
const model=src.slice(0,src.indexOf("if(process.argv[2]==='replay')"))
 .replace(')),p=[];', ')),p=[],rem=s.rem.slice();')
 .replace('let r=c>=0?b[c].r:a.r;if(c<0',
   'let r=c>=0?b[c].r:a.r;let ri=rem.indexOf(key(r));if(ri>=0){a={...a,fork:a.fork+1};rem.splice(ri,1);}if(c<0')
 .replace('let rem=s.rem.slice();for(let a of p)', 'for(let a of p)');
vm.runInNewContext(model+'\nmodule.exports={initial,step,replay};',ctx);
const {initial,step,replay}=ctx.module.exports;
const prefix=process.argv[2]||'WAASAWWWWSX';
const start=replay(prefix,initial,true);
const k=s=>s.b.map(b=>b.r.join(',')).join('|')+'|'+s.p.map(p=>[...p.r,p.c,p.fork,p.ghost,s.p.length===1?p.f:''].join(',')).sort().join(';')+'|'+s.rem.join(';');
const q=[start],paths=[''],seen=new Set([k(start)]);let head=0;
while(head<q.length&&head<5000){const s=q[head],path=paths[head++];
 if(s.p.some(p=>p.c===1&&p.fork>=1&&!p.ghost)&&s.p.some(p=>p.c<0&&p.fork>=1)){
  console.log('BLUE_CAPTURE',JSON.stringify({prefix,tail:path,full:prefix+path,state:s,expanded:head,seen:seen.size}));process.exit();
 }
 if(path.length>=40)continue;
 for(const a of s.p.length===1?'WASDX':'WASD'){
  const n=step(s,a);if(!n||n.p.some(p=>p.ghost)||n.p.length< s.p.length||n.p.length>2||n.b.some(b=>b.r[1]<=1))continue;
  if(n.p.some(p=>p.fork<1))continue;
  const h=k(n);if(seen.has(h))continue;seen.add(h);q.push(n);paths.push(path+a);
 }
}
console.log('FINITE',JSON.stringify({prefix,expanded:head,seen:seen.size,exhausted:head===q.length,cap:5000,depth:40,scope:'ordinary solo plus one free-X to two live Fork1 actors; live Color3 capture; no cargo-X, conflict, stack or tick corpse capture'}));
