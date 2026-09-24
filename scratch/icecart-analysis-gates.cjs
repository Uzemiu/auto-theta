const fs=require('fs'),vm=require('vm');
const path='artifacts/slot1-playthrough/2-13.json';
const base=fs.readFileSync('artifacts/slot1-playthrough/scratch/root-ice-one-box.cjs','utf8').split('const q=[[start,-1,-1]]')[0]+';globalThis.api={next,start};';
const j=JSON.parse(fs.readFileSync(path,'utf8').replace(/^\uFEFF/,''));
for(const [name,buttons,all] of [['6-only',[[6,1]],false],['7-only',[[7,1]],false],['OR',[[6,1],[7,1]],false],['AND',[[6,1],[7,1]],true]]){
 const cfg={gates:[{at:[4,1],buttons,all}]};
 const src=base.replace("const cfg=process.argv[3]?JSON.parse(fs.readFileSync(process.argv[3],'utf8')):{};",`const cfg=${JSON.stringify(cfg)};`);
 const c={require,process:{argv:['node','x',path]},console};vm.createContext(c);vm.runInContext(src,c);
 const routes=new Set();let mismatches=[];
 for(let k=0;k<j.events.length;k++){
  const o=j.events[k].observation;if(!o)continue;
  const l=o.level,ins=l.instructions;if(routes.has(ins))continue;routes.add(ins);
  const t=l.timelines[0];if(t.entities.some(e=>e.type==='PLAYER'&&e.properties.contained))continue;
  let s=c.api.start,invalid=-1;
  for(let i=0;i<ins.length;i++){if(!'WASD'.includes(ins[i]))continue;s=c.api.next(s,'WASD'.indexOf(ins[i]));if(!s){invalid=i;break;}}
  if(invalid>=0){mismatches.push({k,invalid:invalid+1});continue;}
  const p=t.entities.filter(e=>e.type==='PLAYER'&&e.active).map(e=>e.pos.join(',')).sort(),b=t.entities.find(e=>e.type==='BOX'&&e.active).pos;
  const mp=s.p.map(e=>e.slice(0,2).join(',')).sort();
  if(JSON.stringify(p)!==JSON.stringify(mp)||b.join()!=s.b.join())mismatches.push({k,ins,p,b,mp,mb:s.b});
 }
 console.log(name,JSON.stringify(mismatches));
}
