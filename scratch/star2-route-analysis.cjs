// Read-only offline analysis of observed maps. No game input.
const fs=require('fs'),vm=require('vm');
const load=n=>JSON.parse(fs.readFileSync(`artifacts/slot1-playthrough/1-${n}.json`,'utf8').replace(/^\uFEFF/,''));
const a=load(6).initial,b=load(20).initial,ta=a.level.timelines[0],tb=b.level.timelines[0];
const dy=2,dx=9;
const shift=(e,x,y)=>({...e,pos:[e.pos[0]+x,e.pos[1]+y]});
const t={...ta,size:[dx+tb.size[0],Math.max(ta.size[1]+dy,tb.size[1])],entities:[...ta.entities.map(e=>shift(e,0,dy)),...tb.entities.map(e=>shift(e,dx,0))],tiles:[...ta.tiles.map(e=>shift(e,0,dy)),...tb.tiles.map(e=>shift(e,dx,0))]};
const input={initial:{...a,level:{...a.level,timelines:[t]}}};
const cfg={initial:true,merge_stable_only:true,allow_partial_death:true};
if(['local','beam'].includes(process.argv[2]))cfg.bounds=[0,8,2,10];
// Correct duplicate forward fallback in this scratch copy only: two blocked
// sides mean one forward child, not two children with different lock charges.
const src=fs.readFileSync('artifacts/slot1-playthrough/scratch/root-ice-multi.cjs','utf8').split('if(cfg.replay)')[0]
 .replace('let attempted=false;for(const off of [1,3])','let attempted=false;const splitDirs=new Set();for(const off of [1,3])')
 .replace('if(can(v,d)){attempted=true;const q=land','if(can(v,d)&&!splitDirs.has(d)){splitDirs.add(d);attempted=true;const q=land')
 +';globalThis.api={next,start,serial,locks,items};';
const mock={...fs,readFileSync:(p,...args)=>p==='virtual.json'?JSON.stringify(input):fs.readFileSync(p,...args)};
const c={require:n=>n==='fs'?mock:require(n),process:{argv:['node','x','virtual.json',JSON.stringify(cfg)]},console};
vm.createContext(c);vm.runInContext(src,c);const {next,start,serial,locks,items}=c.api;
const prefix='DDDWWWDDDDDWSDSSDSSDDWWAAAWWAAAAAA';
const ninePrefix='DDDWWWDDDDDW'+'WAWW'+'DDDDDDDD'+'SSASS'+'ASSASSAAWWAWWAAAAAA';
const eightPrefix='DDDWWWDDDDDW'+'WDDDDDDDWSASS'+'ASSASSAAWWAWWAAAAAA';
const suffix='XXAAAXXAAWXWWXXWWWWDWDDSXDDSDD';
function replay(route,st=start,trace=false){for(let i=0;i<route.length;i++){st=next(st,'WASDX'.indexOf(route[i]));if(trace)console.log(i+1,route[i],JSON.stringify(st));if(!st)break;}return st;}
function dump(){for(let y=t.size[1];y>=0;y--){let row='';for(let x=0;x<=t.size[0];x++){const e=t.entities.find(e=>e.active&&e.pos[0]===x&&e.pos[1]===y),tl=t.tiles.find(e=>e.pos[0]===x&&e.pos[1]===y);row+=e?.type==='PLAYER'?'P':e?.type==='LOCK'?'L':e?.type==='KEY'?(e.details.isFork?'F':'K'):e?.type==='COLLECTION'?'*':e?.blockable?'#':tl?.type==='SOLID'?'.':tl?.type==='SPIKE'?'^':' ';}console.log(String(y).padStart(2),row);}console.log('locks',locks.map(e=>e.pos),'items',items.map(e=>[e.pos,e.details.isFork]),'start',start);}
function search(st,success,limit=200000,maxp=8,maxdepth=70){const q=[[st,-1,'',0]],seen=new Set([serial(st)]);let end=-1,i=0;for(;i<q.length&&i<limit;i++){const [s,,,dep]=q[i];if(success(s)){end=i;break;}if(dep===maxdepth)continue;for(let a=0;a<5;a++){if(a===4&&!s.p.some(p=>p[3]))continue;const n=next(s,a);if(!n||!n.p.length||n.p.length>maxp)continue;const k=serial(n);if(seen.has(k))continue;seen.add(k);q.push([n,i,'WASDX'[a],dep+1]);}}let actions=null;if(end>=0){actions='';for(let j=end;q[j][1]>=0;j=q[j][1])actions=q[j][2]+actions;}console.log(JSON.stringify({processed:i,queued:q.length,actions,end:end<0?null:q[end][0]}));return {actions,state:end<0?null:q[end][0]};}
function beam(){let q=[{s:{p:[[7,6,1,9,1]],b:[],c:2047,l:2},a:''}],seen=new Set(),processed=0,best=0;const count=n=>n.toString(2).replaceAll('0','').length;const score=s=>{const opened=count(s.l&237),keys=s.p.reduce((v,p)=>v+p[4],0),forks=s.p.reduce((v,p)=>v+p[3],0);const targets=[[1,4],[1,5],[1,6],[4,8],[5,8],[6,8],[7,8]];const target=targets[[3,2,0,5,6,7].findIndex(i=>!(s.l&(1<<i)))<0?6:[3,2,0,5,6,7].findIndex(i=>!(s.l&(1<<i)))];const dist=Math.min(...s.p.filter(p=>p[4]||opened===6).map(p=>Math.abs(p[0]-target[0])+Math.abs(p[1]-target[1])));return opened*1000+Math.min(keys,6-opened)*20+Math.min(forks,20)*2-dist*3;};for(let depth=0;depth<75&&processed<150000;depth++){let nq=[];for(const {s,a} of q){processed++;if(s.p.some(p=>p[0]===7&&p[1]===8)){console.log('BEAM-SUCCESS',JSON.stringify({processed,actions:a,state:s}));replay(a,{p:[[7,6,1,9,1]],b:[],c:2047,l:2},true);return;}for(let act=0;act<5;act++){const n=next(s,act);if(!n||!n.p.length||n.p.length>8||(!n.p.some(p=>p[4])&&count(n.l&237)<6))continue;const k=serial(n);if(seen.has(k))continue;seen.add(k);nq.push({s:n,a:a+'WASDX'[act],score:score(n)});}}nq.sort((a,b)=>b.score-a.score);q=nq.slice(0,1500);const progress=q.length?count(q[0].s.l&237):0;if(progress>best){best=progress;console.log('BEST',depth+1,best,q[0].a,JSON.stringify(q[0].s));}if(!q.length)break;}console.log('BEAM-LIMIT',JSON.stringify({processed,seen:seen.size,best}));}
if(process.argv[2]==='dump')dump();
else if(process.argv[2]==='replay')replay(process.argv[3]||prefix,start,true);
else if(process.argv[2]==='search'){const route=process.argv[3]||prefix;const st=replay(route);console.log('prefix-end',JSON.stringify(st));const result=search(st,s=>s.p.some(p=>p[0]===7&&p[1]===8),Number(process.argv[4]||150000),Number(process.argv[5]||6));if(result.actions)console.log('FULL',route+result.actions);}
else if(process.argv[2]==='local'){const st={p:[[7,6,1,5,1]],b:[],c:247,l:2};const result=search(st,s=>s.p.some(p=>p[0]===7&&p[1]===8),Number(process.argv[3]||150000),6);if(result.actions){console.log('FULL',prefix+result.actions);replay(result.actions,st,true);}}
else if(process.argv[2]==='nine')replay(ninePrefix,start,true);
else if(process.argv[2]==='beam')beam();
else if(process.argv[2]==='candidate'){const route=eightPrefix+suffix;console.log('CANDIDATE',route.length,route);replay(route,start,true);}
else if(process.argv[2]==='fallback-bug'){const raw=fs.readFileSync('artifacts/slot1-playthrough/scratch/root-ice-multi.cjs','utf8').split('if(cfg.replay)')[0]+';globalThis.rawNext=next;';vm.runInNewContext(raw,{...c,process:{argv:['node','x','virtual.json',JSON.stringify(cfg)]},globalThis:c});const st={p:[[1,4,0,1,1]],b:[],c:7,l:8};console.log('state',st,'original',c.rawNext(st,4),'deduplicated',next(st,4));}
module.exports={next,start,serial,locks,items,replay,search,prefix,t};
