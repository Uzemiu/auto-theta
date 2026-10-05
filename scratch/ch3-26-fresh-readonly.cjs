const fs=require('fs'),vm=require('vm');
let s=fs.readFileSync('scratch/3-26-key-trip-readonly.cjs','utf8');
s=s.replace("const prisms=es.filter(e=>e.type==='BOX')", "const prisms=es.filter(e=>['BOX','PRISM'].includes(e.type))").replace("!['BOX','BUTTONGATE'].includes(e.type)","!['BOX','PRISM','BUTTONGATE'].includes(e.type)");
s=s.slice(0,s.indexOf('if(cfg.prefix)'));
s=s.replaceAll("dark.has(xy(z))","(z[1]===7&&z[0]>=3&&z[0]<=15&&!!(s.dark&(1<<(z[0]-3))))");
s=s.replace("return {p:merged,b,c};",`let n={p:merged,b,c,dark:s.dark};
 if(xy(b[4])==='1,7') {for(let x=3;x<=15;x++){n.dark&=~(1<<(x-3)); if(!gateOpen(n,x+',7'))break;}}
 for(const p of n.p)if(p[4]&&!(n.dark&(1<<(p[0]-3)))){if(!safe.has(xy(p)))return null; p[4]=0;n.revived=true;}
 return n;`);
s+=`\nstart.p=[[7,1,2,0,0,0],[15,7,3,0,1,1]]; start.b=[[6,1],[9,1],[1,1],[12,1],[1,5]]; start.c=3; start.dark=8191;
const q=[[start,-1,'']],seen=new Set([serial(start)+'|'+start.dark]);let end=-1,processed=0;
for(let i=0;i<q.length&&i<50000;i++){processed++;const st=q[i][0];if(st.revived){end=i;break;}for(let a=0;a<4;a++){const n=next(st,a);if(!n||n.p.length!==2||[0,2,3].some(j=>xy(n.b[j])!==xy(start.b[j]))||n.b[1][1]!==1||n.b[1][0]<7||n.b[1][0]>9||n.b[4][0]!==1||n.b[4][1]<4||n.b[4][1]>7)continue;const k=serial(n)+'|'+n.dark;if(!seen.has(k)){seen.add(k);q.push([n,i,'WASD'[a]]);}}}
let path='',trace=[];if(end>=0){for(let i=end;q[i][1]>=0;i=q[i][1]){path=q[i][2]+path;trace.unshift(q[i][0]);}}
console.log(JSON.stringify({seen:seen.size,processed,end,path,trace}));`;
const cfg={observation_event:7,gates:[{at:[12,7],buttons:[[12,1]]},{at:[9,7],buttons:[[9,1]]},{at:[6,7],buttons:[[6,1]]}],hold_occupied_gates:true};
vm.runInNewContext(s,{require,process:{argv:['','', 'artifacts/slot1-playthrough/3-26.json',JSON.stringify(cfg)]},console});
