// Read-only targeted best-first adapter; no game I/O.
const fs=require('fs');let src=fs.readFileSync('scratch/root-cargo-gates.cjs','utf8');
src=src.replace('const start={','let start={');
src=src.replace('if(cfg.replay){',`if(cfg.prefix){for(const a of cfg.prefix){start=next(start,'WASDX'.indexOf(a));if(!start)throw Error('Prefix invalid');}}
if(cfg.replay){`);
src=src.replace('const success=s=>','const success=s=>cfg.capture? s.p.some(p=>p[4]>=0&&xy(p)===xy(cfg.capture)):');
src=src.replace('const q=[[start,-1,-1]]','const q=[[start,-1,-1]]');
const begin=src.indexOf('for(let i=0;i<q.length&&i<searchLimit;i++){');const end=src.indexOf('let actions=null,trace=[];',begin);
src=src.slice(0,begin)+`
const md=(a,b)=>Math.abs(a[0]-b[0])+Math.abs(a[1]-b[1]);
function heur(s){
 let best=999;
 for(const variant of [0,1,2]){
  let b0=[2,2],b1=[3+variant,2],p0=[4+variant,2],p1=[1+variant,3];
  let bh=999;for(let i=0;i<s.b.length;i++)for(let j=0;j<s.b.length;j++)if(i!==j)bh=Math.min(bh,md(s.b[i],b0)+md(s.b[j],b1));
  let ph=s.p.length===2?Math.min(md(s.p[0],p0)+md(s.p[1],p1),md(s.p[1],p0)+md(s.p[0],p1)):10+md(s.p[0],[4,2]);
  best=Math.min(best,bh*3+ph);
 }
 return best;
}
const heap=[];function put(i,v){let k=heap.length;heap.push([i,v]);while(k){let j=(k-1)>>1;if(heap[j][1]<=v)break;heap[k]=heap[j];k=j;}heap[k]=[i,v];}function take(){let out=heap[0],z=heap.pop();if(heap.length){let k=0;while(k*2+1<heap.length){let j=k*2+1;if(j+1<heap.length&&heap[j+1][1]<heap[j][1])j++;if(heap[j][1]>=z[1])break;heap[k]=heap[j];k=j;}heap[k]=z;}return out[0];}
const dep=[0];put(0,heur(start)*5);
while(heap.length&&processed<searchLimit){
 const i=take(),s=q[i][0];processed++;if(success(s)){end=i;break;}
 for(let a=0;a<5;a++){const n=next(s,a);if(!n||n.p.length<1||n.p.length>2)continue;const k=serial(n);if(!seen.has(k)){seen.add(k);let ni=q.length;q.push([n,i,a]);dep.push(dep[i]+1);put(ni,dep[ni]+heur(n)*5);}}
}
`+src.slice(end);
src=src.replace('actions,trace}));','actions,last:trace.at(-1)}));');eval(src);
