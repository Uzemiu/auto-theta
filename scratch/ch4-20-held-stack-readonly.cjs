// New ordinary held-Fork stack target from WWAX. No Bridge / no game input.
const fs=require('fs'),m=require('./ch4-20-readonly.cjs'),copy=x=>JSON.parse(JSON.stringify(x));
const pre=m.observedReplay('WWAX',m.s25);if(!pre.valid)throw Error('source');
const start={b:pre.s.box.map(b=>({r:b.p,orig:b.orig,kind:'BOX',color:b.color,c:b.c})),p:pre.s.free,keys:0};
const terrain=require('./ch4-19-readonly.cjs'),V={W:[0,1],A:[-1,0],S:[0,-1],D:[1,0]},L={W:'A',A:'S',S:'D',D:'W'},K=p=>p.join(','),eq=(a,b)=>K(a)===K(b),add=(p,d)=>[p[0]+V[d][0],p[1]+V[d][1]];
const hash=s=>s.b.map(b=>[b.orig,K(b.r),b.c?.fork??'-',b.c?.f??'-'].join(':')).sort().join(';')+'|'+s.p.map(p=>[K(p.r),p.fork,p.f].join(':')).sort().join(';');
function proposed(s,a){const plans=[];function chain(r,d,ids){if(terrain.blocked(r))return false;const i=s.b.findIndex(b=>eq(b.r,r));if(i<0)return true;if(!chain(add(r,d),d,ids))return false;ids.push(i);return true;}
 for(const p of s.p){let d=a,r=p.r,ids=[],ok=false;for(let i=0;i<4;i++,d=L[d]){r=add(p.r,d);ids=[];if(chain(r,d,ids)){ok=true;break;}}plans.push({...p,r:ok?r:p.r,f:ok?d:a,d,ids:ok?ids:[]});}
 const dirs=new Map();for(const p of plans)for(const i of p.ids){if(dirs.has(i)&&dirs.get(i)!==p.d)return{force:true};dirs.set(i,p.d);}
 const bs=s.b.map((b,i)=>({...copy(b),r:dirs.has(i)?add(b.r,dirs.get(i)):b.r}));
 for(let i=0;i<bs.length;i++)for(let j=i+1;j<bs.length;j++)if(bs[i].orig!==bs[j].orig&&eq(bs[i].r,bs[j].r)&&(bs[i].c?.fork===1||bs[j].c?.fork===1))return{hit:true,stack:bs.filter(b=>eq(b.r,bs[i].r)),box:bs,free:plans.map(({r,f,fork})=>({r,f,fork}))};
 return{};
}
const cap=5000,depth=25,q=[{s:copy(start),path:''}],seen=new Set([hash(start)]);let h=0,cut=0,force=0,lost=0,hit=null;
outer:while(h<q.length&&h<cap){const z=q[h++];if(z.path.length>=depth){cut++;continue;}for(const a of 'WASD'){const p=proposed(z.s,a);if(p.force){force++;continue;}if(p.hit){hit={path:z.path+a,pre:m.summary(z.s),post:p};break outer;}
 for(const n of m.multiStep(z.s,a,z.path+a)){const s=n.s;if(s.b.some(b=>b.c?.ghost)||s.p.length+s.b.filter(b=>b.c).length!==4||s.p.some(p=>p.fork!==1)||s.b.some(b=>b.c&&b.c.fork!==1)){lost++;continue;}const k=hash(s);if(seen.has(k))continue;seen.add(k);q.push({s,path:z.path+a});}}
}
const result={source:'historical actual25 + WWAX fixed MODEL29',fixedSource:pre.s,cap,depth,expanded:h,seen:seen.size,pending:q.length-h,depthCut:cut,force,lost,hit,exhausted:h===q.length,scope:'new heldFork1 cargo+independent empty Blue stack; WASD only, exactly four live Fork1 actors before boundary; no X/force/stack propagation, row1/x1 allowed'};
fs.writeFileSync('scratch/results/ch4-20-held-stack-result.json',JSON.stringify(result));console.log(JSON.stringify(result));
