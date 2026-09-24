const fs=require('fs'),vm=require('vm');
const path='artifacts/slot1-playthrough/2-13.json';
const cfg='artifacts/slot1-playthrough/scratch/root-2-13-box-config.json';
const src=fs.readFileSync('artifacts/slot1-playthrough/scratch/root-ice-one-box.cjs','utf8').split('const q=[[start,-1,-1]]')[0]+';globalThis.api={next,start};';
const c={require,process:{argv:['node','x',path,cfg]},console};vm.createContext(c);vm.runInContext(src,c);
const j=JSON.parse(fs.readFileSync(path,'utf8').replace(/^\uFEFF/,''));
const routes=new Set();
for(let k=0;k<j.events.length;k++){
 const o=j.events[k].observation;if(!o)continue;
 const l=o.level,ins=l.instructions;if(routes.has(ins))continue;routes.add(ins);
 let s=c.api.start,invalid=-1;
 for(let i=0;i<ins.length;i++){if(!'WASD'.includes(ins[i]))continue;s=c.api.next(s,'WASD'.indexOf(ins[i]));if(!s){invalid=i;break;}}
 if(invalid>=0){console.log('INVALID',k,invalid+1,ins.slice(0,invalid+1));continue;}
 const t=l.timelines[0],p=t.entities.filter(e=>e.type==='PLAYER'&&e.active).map(e=>e.pos.join(',')).sort(),b=t.entities.find(e=>e.type==='BOX'&&e.active).pos;
 const mp=s.p.map(e=>e.slice(0,2).join(',')).sort();
 if(JSON.stringify(p)!==JSON.stringify(mp)||b.join()!=s.b.join())console.log('DIFF',k,ins,{p,b},{p:mp,b:s.b});
 else console.log('MATCH',k,ins.length);
}
