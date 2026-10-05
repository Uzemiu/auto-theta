// Read-only domain change: first fork -> X before picking ICE/Spike forks.
// Own observed ordinary/ICE/free-X model; no game I/O, hints, save, or hidden code.
const fs=require('fs'),vm=require('vm');
const source=fs.readFileSync('scratch/ch4-15-readonly.cjs','utf8');
const context={require,process:{argv:[]},console,module:{exports:{}}};
const ownModel=source.slice(0,source.indexOf("if(process.argv[2]==='replay')"))
  .replace(')),p=[];', ')),p=[],rem=s.rem.slice();')
  .replace('let r=c>=0?b[c].r:a.r;if(c<0',
    'let r=c>=0?b[c].r:a.r;let ri=rem.indexOf(key(r));if(ri>=0){a={...a,fork:a.fork+1};rem.splice(ri,1);}if(c<0')
  .replace('let rem=s.rem.slice();for(let a of p)', 'for(let a of p)');
vm.runInNewContext(ownModel+
  '\nmodule.exports={initial,step,replay,wall,spike,ice};',context);
const {initial,step,wall,spike}=context.module.exports;
const cp=s=>JSON.parse(JSON.stringify(s)),K=p=>p.join(','),at=(p,r)=>K(p)===K(r);
const prefix=process.argv[4]||'WAASAWX';
function replay(path,start,quiet=false){let s=cp(start);if(!quiet)console.log('START',JSON.stringify(s));
  for(let i=0;i<path.length;i++){s=step(s,path[i]);if(!quiet)console.log(i+1,path[i],JSON.stringify(s));if(!s)break;}return s;}
const start=replay(prefix,initial,true);
if(!start||start.p.length!==2||start.p.some(p=>p.fork!==0))throw Error('prefix geometry mismatch');
const mode=process.argv[2]||'resources',cap=Math.min(Number(process.argv[3])||20000,20000);
if(mode==='replay'){replay(process.argv[3]||'',initial);process.exit();}
const hash=s=>s.b.map(b=>K(b.r)).join('|')+'|'+s.p.map(p=>[...p.r,p.c,p.fork,p.ghost,p.fork?p.f:''].join(',')).sort().join(';')+'|'+s.rem.join(';');
const par=p=>(p.r[0]+p.r[1])%2;
function hit(s){
  if(mode==='blue_stop')return at(s.b[1].r,[4,6])&&s.p.some(p=>p.c<0&&p.fork>=1)&&s.rem.includes('4,6');
  if(mode==='probe_blue')return at(s.b[1].r,[4,6])&&at(s.b[0].r,[4,4])&&
    s.p.some(p=>p.c<0&&p.fork>=1&&at(p.r,[3,6]))&&s.p.some(p=>p.c<0&&at(p.r,[4,3]))&&s.rem.includes('4,6');
  if(mode==='probe')return at(s.b[0].r,[4,6])&&at(s.b[1].r,[4,4])&&s.p.length>=3&&
    s.p.some(p=>p.c<0&&at(p.r,[3,6]))&&s.p.some(p=>p.c<0&&at(p.r,[4,3]))&&s.rem.includes('4,6');
  if(mode==='resource3')return s.p.length>=3&&s.p.some(p=>p.c>=0&&p.fork>=1)&&s.p.filter(p=>p.c<0).length>=2;
  return s.p.some(p=>p.c>=0&&p.fork>=2)&&s.p.some(p=>p.c<0);
}
let q=[start],paths=[''],seen=new Set([hash(start)]),head=0,maxActors=2,maxFork=0,hasSecond=false;
while(head<q.length&&head<cap){const s=q[head],path=paths[head++];
  maxActors=Math.max(maxActors,s.p.length);maxFork=Math.max(maxFork,...s.p.map(p=>p.fork));hasSecond ||= !s.rem.includes('4,5');
  if(hit(s)){console.log('TARGET',JSON.stringify({mode,prefix,tail:path,full:prefix+path,state:s,expanded:head,seen:seen.size}));replay(path,start);process.exit();}
  if(path.length>=40)continue;
  for(const a of 'WASDX'){
    if(a==='X'&&!s.p.some(p=>p.c<0&&p.fork>0))continue;
    const n=step(s,a);if(!n||n.p.length<2||n.p.length>4)continue;
    // Preserve both original live participants; same-input later ICE capture of
    // a dead actor remains unknown and is instead sought as an explicit probe.
    if(n.p.length<s.p.length&&a!=='X')continue;
    if(n.b.some(b=>b.r[1]<=1))continue;
    const h=hash(n);if(seen.has(h))continue;seen.add(h);q.push(n);paths.push(path+a);
  }
}
console.log('BOUNDED',JSON.stringify({mode,prefix,expanded:head,seen:seen.size,queue:q.length,
  exhausted:head===q.length,cap,depthLimit:40,maxActors,maxFork,hasSecond,
  scope:'first X then pickup remaining forks; ordinary/ICE/free-X; no cargo-X/conflict/stack/y1 box; no ICE-tick corpse revival'}));
