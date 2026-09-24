// Read-only single-player box preparation from an observed level. No game input.
// Walking components are canonicalized; chains may move onto spikes, but the player may not.
const fs=require('fs'),r=JSON.parse(fs.readFileSync(process.argv[2],'utf8').replace(/^\uFEFF/,'')),cfg=JSON.parse(process.argv[3]||'{}');
const o=r.initial,t=o.level.timelines[0],es=t.entities.filter(e=>e.active),key=p=>p.join(','),dirs=[[0,1],[-1,0],[0,-1],[1,0]],chars='WASD';
if(es.some(e=>['LOCK','BUTTONGATE','PRISM','DARK'].includes(e.type)))throw Error('Unsupported mechanics');
const safe=new Set([...t.tiles.filter(e=>e.type==='SOLID'),...es.filter(e=>e.floor)].map(e=>key(e.pos))),floor=new Set(t.tiles.map(e=>key(e.pos))),walls=new Set(es.filter(e=>e.blockable&&e.type!=='BOX').map(e=>key(e.pos)));
const step=(p,d)=>[(p[0]+dirs[d][0]+t.size[0]+1)%(t.size[0]+1),(p[1]+dirs[d][1]+t.size[1]+1)%(t.size[1]+1)];
const norm=b=>b.map(p=>p.slice()).sort((a,b)=>a[0]-b[0]||a[1]-b[1]);
function reach(s){const bm=new Set(s.b.map(key)),m=new Map([[key(s.p),'']]),q=[s.p];for(let i=0;i<q.length;i++)for(let d=0;d<4;d++){const z=step(q[i],d),k=key(z);if(safe.has(k)&&!walls.has(k)&&!bm.has(k)&&!m.has(k)){m.set(k,m.get(key(q[i]))+chars[d]);q.push(z);}}return m;}
const start={p:es.find(e=>e.type==='PLAYER').pos.slice(),b:norm(es.filter(e=>e.type==='BOX').map(e=>e.pos)),parent:-1,move:''};
const q=[start],seen=new Set(),limit=cfg.max_states||100000;let end=-1,processed=0;
const serial=(s,m)=>s.b.map(key).join(';')+'|'+[...m.keys()].sort()[0];seen.add(serial(start,reach(start)));
for(let i=0;i<q.length&&i<limit;i++){const s=q[i];processed++;if(cfg.boxes.every(g=>s.b.some(b=>key(b)===key(g)))){end=i;break;}const m=reach(s),bm=new Map(s.b.map((b,j)=>[key(b),j]));for(const [pk,path]of m){const p=pk.split(',').map(Number);for(let d=0;d<4;d++){let z=step(p,d),first=z.slice(),j=bm.get(key(z));if(j===undefined||!safe.has(key(z)))continue;const chain=[];let good=true;while(j!==undefined){if(chain.includes(j)){good=false;break;}chain.push(j);z=step(z,d);if(walls.has(key(z))||!floor.has(key(z))){good=false;break;}j=bm.get(key(z));}if(!good)continue;const b=s.b.map((b,j)=>chain.includes(j)?step(b,d):b.slice()),n={p:first,b:norm(b),parent:i,move:path+chars[d]},nm=reach(n),k=serial(n,nm);if(!seen.has(k)){seen.add(k);q.push(n);}}}}
let actions=null;if(end>=0){const pieces=[];for(let i=end;q[i].parent>=0;i=q[i].parent)pieces.push(q[i].move);actions=pieces.reverse().join('');}
console.log(JSON.stringify({model:'single-chain-push-macro-candidate',processed,seen:seen.size,truncated:end<0&&processed<q.length,actions,last:end>=0?{p:q[end].p,b:q[end].b}:null}));
