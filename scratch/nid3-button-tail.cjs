const fs=require('fs'),vm=require('vm');
let wrapper=fs.readFileSync('scratch/nid3-fresh-readonly.cjs','utf8').split('src+=')[0];
wrapper+=`src+=\`\nlet s=start;for(const a of 'WDSSSSDDWXAWWWWSAWWDDDSSSSWAWWWWWWWWWWWWWWDADX'){s=next(s,'WASDX'.indexOf(a));if(!s)throw Error('prefix invalid');}
const ser=z=>z.p.map(p=>[p[0],p[1],p[3]?p[2]:0,p[3],p[4]].join(',')).sort().join(';')+'|'+z.b.map(xy).join(';');
const q=[[s,-1,'']],seen=new Set([ser(s)]);let end=-1,done=0;
for(let i=0;i<q.length&&i<25000;i++){done++;const z=q[i][0];if(z.b.some(b=>xy(b)==='5,1')&&z.p.some(p=>xy(p)==='7,2')){end=i;break;}for(let a=0;a<4;a++){const n=next(z,a);if(!n||n.p.length!==4||xy(n.b[1])!=='18,3'||n.p.filter(p=>p[0]>=9).some(p=>!((p[0]>=10&&p[0]<=12&&p[1]>=11&&p[1]<=13)||(p[0]>=18&&p[0]<=20&&p[1]>=1&&p[1]<=3))))continue;const k=ser(n);if(!seen.has(k)){seen.add(k);q.push([n,i,'WASD'[a]]);}}}
let path='',trace=[];if(end>=0)for(let i=end;q[i][1]>=0;i=q[i][1]){path=q[i][2]+path;trace.unshift(q[i][0]);}console.log(JSON.stringify({seen:seen.size,done,path,trace}));\`;
vm.runInNewContext(src,{require,process:{argv:['','',path,JSON.stringify(cfg)]},console});`;
vm.runInNewContext(wrapper,{require,process,console});
