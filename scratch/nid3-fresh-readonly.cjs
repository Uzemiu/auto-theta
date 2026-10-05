// Offline NID3 model, real composite geometry. Gate source sharing must match live evidence.
const fs=require('fs'),vm=require('vm');
const path='artifacts/slot1-playthrough/1-10+1-14.json',r=JSON.parse(fs.readFileSync(path,'utf8').replace(/^\uFEFF/,''));
const cfg={initial:true,allow_partial_death:false,gates:[]};
const buttons={0:[[1,1],[18,2]],1:[[3,7],[11,13]],2:[[5,1]]};
for(const e of r.initial.level.timelines[0].entities.filter(e=>e.type==='BUTTONGATE'))cfg.gates.push({at:e.pos,buttons:buttons[e.details.ID]});
let src=fs.readFileSync('artifacts/slot1-playthrough/scratch/root-ice-multi.cjs','utf8').split('if(cfg.replay)')[0];
src+=`\nlet s=start,trace=[];for(const a of ${JSON.stringify(process.argv[2]||'')}){s=next(s,'WASDX'.indexOf(a));trace.push(s);if(!s)break;} console.log(JSON.stringify({trace}));`;
vm.runInNewContext(src,{require,process:{argv:['','',path,JSON.stringify(cfg)]},console});
