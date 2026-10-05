// Own bounded two-box ordinary/ICE/free-X model; no game I/O, no cargo-X implementation.
const fs=require('fs'),raw=JSON.parse(fs.readFileSync('artifacts/slot1-playthrough/4-15.json','utf8').replace(/^\uFEFF/,'')),t=raw.initial.level.timelines[0];
const wall=new Set(t.entities.filter(e=>e.class==='Wall').map(e=>e.pos.join(','))),spike=new Set(t.tiles.filter(e=>e.type==='SPIKE').map(e=>e.pos.join(','))),ice=new Set(t.tiles.filter(e=>e.type==='ICE').map(e=>e.pos.join(',')));
const v={W:[0,1],A:[-1,0],S:[0,-1],D:[1,0]},left={W:'A',A:'S',S:'D',D:'W'},key=p=>p.join(','),add=(p,d)=>[p[0]+v[d][0],p[1]+v[d][1]],same=(a,b)=>key(a)===key(b);
const initial={b:[{r:[6,2],color:4},{r:[2,2],color:3}],p:[{r:[7,1],f:'S',fork:0,c:-1,ghost:0}],rem:['4,2','4,5','4,6']};
function chain(s,r,d,ids){if(wall.has(key(r)))return false;let i=s.b.findIndex(b=>same(b.r,r));if(i<0)return true;if(!chain(s,add(r,d),d,ids))return false;ids.push(i);return true;}
function tick(s,plans,intents){let dirs=new Map();for(let x of intents)for(let i of x.ids){if(dirs.has(i)&&dirs.get(i)!==x.d)return null;dirs.set(i,x.d);}
 let b=s.b.map((box,i)=>({...box,r:dirs.has(i)?add(box.r,dirs.get(i)):box.r})),p=[];
 if(b.length!==new Set(b.map(b=>key(b.r))).size)return null; // Independent-origin stacking not modeled.
 for(let a of plans){let c=a.c,ghost=a.ghost||0;if(c<0){let i=b.findIndex((box,i)=>dirs.has(i)&&same(box.r,a.r));if(i>=0){c=i;if(spike.has(key(a.r)))ghost=1;}}let r=c>=0?b[c].r:a.r;if(c<0&&spike.has(key(r)))continue;let old=p.find(q=>same(q.r,r)&&q.c===c);if(old)old.fork=Math.max(old.fork,a.fork);else p.push({...a,r,c,ghost});}
 let rem=s.rem.slice();for(let a of p){let i=rem.indexOf(key(a.r));if(i>=0){a.fork++;rem.splice(i,1);}}
 return {b,p,rem};}
function step(s,a){let plans=[],intents=[];
 for(let p of s.p){if(p.c>=0){if(a==='X')return null;plans.push({...p,f:a,d:null});continue;}
  let attempt=(d,noFallback=false)=>{let r=add(p.r,d),ids=[];if(!chain(s,r,d,ids))return null;return {p:{...p,r,f:a==='X'?p.f:d,d,fork:p.fork-(a==='X'?1:0)},ids,d};};
  if(a==='X'){if(!p.fork){plans.push({...p,d:null});continue;}let l=left[p.f],valid=[];for(let d of [l,left[left[l]],p.f]){let z=attempt(d);if(z)valid.push(z);if(valid.length===2)break;}if(!valid.length)plans.push({...p,fork:p.fork-1,d:null});else for(let z of valid){plans.push(z.p);intents.push(z);}continue;}
  let d=a,z;for(let i=0;i<4;i++,d=left[d]){z=attempt(d);if(z)break;}if(z){plans.push(z.p);intents.push(z);}else plans.push({...p,f:a,d:null});}
 let n=tick(s,plans,intents);if(!n)return null;
 // Only observed ICE(4,5): one continuation reaches non-ICE 4,4/4,6 or stops at blocked box.
 let boxSlide=intents.flatMap(z=>z.ids.map(i=>({i,d:z.d}))).filter(z=>ice.has(key(n.b[z.i].r))),actorSlide=n.p.filter(p=>p.c<0&&p.d&&ice.has(key(p.r)));
 if(boxSlide.length||actorSlide.length){let micro=[],pushes=[];for(let p of n.p){if(!actorSlide.includes(p)){micro.push({...p,d:null});continue;}let r=add(p.r,p.d),ids=[];if(chain(n,r,p.d,ids)){micro.push({...p,r});pushes.push({ids,d:p.d});}else micro.push({...p,d:null});}
  for(let z of boxSlide){let ids=[];if(chain(n,n.b[z.i].r,z.d,ids))pushes.push({ids,d:z.d});}let nxt=tick(n,micro,pushes);if(!nxt)return null;n=nxt;}
 return {b:n.b,p:n.p.map(({d,...p})=>p),rem:n.rem};}
function replay(path,start=initial,quiet=false){let s=start;if(!quiet)console.log('START',JSON.stringify(s));for(let i=0;i<path.length;i++){s=step(s,path[i]);if(!quiet)console.log(i+1,path[i],JSON.stringify(s));if(!s)break;}return s;}
if(process.argv[2]==='replay'){replay(process.argv[3]);process.exit();}
const phase=process.argv[2]||'capture',cap=Number(process.argv[3])||8000,start=process.argv[4]?replay(process.argv[4],initial,true):initial,hash=s=>s.b.map(b=>key(b.r)).join('|')+'|'+s.p.map(p=>key(p.r)+','+p.c+','+p.fork+','+p.ghost+','+(phase==='solo'||phase==='probe_any_x'&&s.p.length===1?p.f:'-')).sort().join(';')+'|'+s.rem.join(';'),par=p=>(p.r[0]+p.r[1])%2;
let q=[start],paths=[''],seen=new Set([hash(start)]),head=0;
while(head<q.length&&head<cap){let s=q[head],path=paths[head++],hit=phase.startsWith('probe')?same(s.b[0].r,[4,6])&&same(s.b[1].r,[4,4])&&s.p.every(p=>p.c<0&&p.fork===1)&&s.p.some(p=>same(p.r,[3,6]))&&s.p.some(p=>same(p.r,[4,3])):phase==='solo'?s.p.length===1&&s.p[0].fork===2&&same(s.p[0].r,[4,5]):phase==='parity'?s.p.length===2&&s.p.every(p=>p.c<0&&p.fork===1)&&par(s.p[0])!==par(s.p[1]):s.p.some(p=>p.c===0&&p.fork>=1&&!p.ghost)&&s.p.some(p=>p.c<0&&p.fork>=1);
 if(hit){console.log('TARGET',JSON.stringify({path,state:s,expanded:head,seen:seen.size}));replay(path,start);process.exit();}
 if(path.length>=35)continue;for(let a of phase==='probe_any_x'&&s.p.length===1?'WASDX':'WASD'){let n=step(s,a);if(!n||n.p.length!==s.p.length&&!(phase==='probe_any_x'&&s.p.length===1&&n.p.length===2)||n.b.some(b=>b.r[1]<=1))continue;if(phase==='probe_any_x'&&n.p.some(p=>p.c>=0||p.ghost||p.fork!==(n.p.length===1?2:1)))continue;if(phase==='parity'&&(n.p.some(p=>p.c>=0||p.fork!==1)))continue;if(phase==='capture'&&n.p.some(p=>p.fork<1))continue;let h=hash(n);if(seen.has(h))continue;seen.add(h);q.push(n);paths.push(path+a);}}
console.log('BOUNDED',phase,head,seen.size);
