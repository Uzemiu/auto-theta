// Offline hypothetical concatenations from observed maps; never controls the game.
const fs=require('fs'),vm=require('vm');
const load=n=>JSON.parse(fs.readFileSync(`artifacts/slot1-playthrough/1-${n}.json`,'utf8').replace(/^\uFEFF/,''));
const source=fs.readFileSync('artifacts/slot1-playthrough/scratch/root-ice-multi.cjs','utf8');
function combine(a,b,dy){
 const aa=load(a).initial,bb=load(b).initial,ta=aa.level.timelines[0],tb=bb.level.timelines[0],dx=ta.size[0]+1;
 const shift=(e,x,y)=>({...e,pos:[e.pos[0]+x,e.pos[1]+y]});
 return {initial:{...aa,level:{...aa.level,timelines:[{...ta,size:[dx+tb.size[0],Math.max(ta.size[1]+dy,tb.size[1])],entities:[...ta.entities.map(e=>shift(e,0,dy)),...tb.entities.map(e=>shift(e,dx,0))],tiles:[...ta.tiles.map(e=>shift(e,0,dy)),...tb.tiles.map(e=>shift(e,dx,0))]}]}}};
}
function solve(input,cfg,label,sourceOverride=source){
 let result;
 const mock={...fs,readFileSync:(p,...args)=>p==='virtual.json'?JSON.stringify(input):fs.readFileSync(p,...args)};
 vm.runInNewContext(sourceOverride,{require:n=>n==='fs'?mock:require(n),process:{argv:['node','x','virtual.json',JSON.stringify({...cfg,initial:true,merge_stable_only:true})]},console:{log:s=>result=JSON.parse(s)}});
 console.log(label,JSON.stringify(result));return result;
}
if(process.argv[2]==='nid2-prefix'){
 const route=['DDD','WWW','DDDDD','W','S','D','S','S','D','S','S','DD','W','W','AAA','WW','AAAAAA'].join('');
 const pre=source.split('if(cfg.replay)')[0].replace(/const start=.*;/,'const start={p:[[4,3,0,0,0]],b:[],c:0,l:0};')+`let st=start; const trace=[];for(const a of '${route}'){st=next(st,'WASDX'.indexOf(a));trace.push(st);if(!st)break;} console.log(JSON.stringify({actions:'${route}',trace}));`;
 solve(combine(6,20,2),{},'NID2 single surviving resource carrier',pre);
}else if(process.argv[2]==='nid1-alt'){
 for(let dy=0;dy<=4;dy++)solve(combine(2,7,dy),{goals:[[5,1+dy]],max_players:2,no_split:true,max_states:50000},`NID1 plus 1-7 offset ${dy}`);
}else if(process.argv[2]==='resources'){
 const resourceSource=source.replace(/const success=s=>.*;/,'const success=s=>s.p.some(p=>p[3]>=3&&p[4]>=1);');
 for(const dy of [2,0,4])solve(combine(6,20,dy),{max_players:2,no_split:true,max_states:180000},`NID2 resources offset ${dy}`,resourceSource);
}else{
 for(let dy=0;dy<=2;dy++)solve(combine(2,8,dy),{goals:[[5,1+dy]],max_players:2,no_split:true,max_states:150000},`NID1 offset ${dy}`);
}
