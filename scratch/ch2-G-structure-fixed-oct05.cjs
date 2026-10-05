// Fixed public-model checks only. No graph search or game/save calls.
const fs=require('fs'),base=require('./ch2-G-readonly.cjs');
const prefix='AWWWSSAAWWWWWWWAADADSDSAADSSAWDWAWDWAWDSSSSSSSSAWWDWAAWWDDASDSAA';
const seed=base.replay(prefix);if(!seed.valid)throw Error('seed replay failed');
const r=JSON.parse(fs.readFileSync('artifacts/slot1-playthrough/2-G.json','utf8').replace(/^\uFEFF/,''));
const t=r.initial.level.timelines[0],tile=p=>t.tiles.find(e=>String(e.pos)===String(p))?.type;
const wall=p=>t.entities.some(e=>e.active&&e.class==='Wall'&&String(e.pos)===String(p));
const joint={p:[{id:106,x:8,y:8,face:2},{id:108,x:7,y:5,face:2},{id:109,x:7,y:7,face:2}],b:[{id:111,x:8,y:5},{id:116,x:8,y:6},{id:117,x:8,y:7}]};
const forced=base.next(joint,2,{find_probe:true});
const move=x=>({id:x.id,at:[x.x,x.y],face:x.face});
const checkpoints=[4,18,28,40,50,64].map(i=>({inputs:i,state:base.describe(base.replay(prefix.slice(0,i)).state)}));
const result={source:'actual64 matches fixed replay; constructed joint-source is not deployed',prefix,checkpoints,
 terrain:[[8,5],[8,6],[8,7],[8,8],[7,4],[7,6],[7,8],[11,11]].map(p=>({at:p,tile:tile(p),wall:wall(p)})),
 WDWD:base.replay('WDWD',seed.state),
 joint:{pre:base.describe(joint),firstConflict:forced},
 jointAllRequests:[{box:111,at:[8,5],requests:[{by:106,d:'S',chain:[111,116,117]},{by:108,d:'D',chain:[111]}]},
 {box:116,at:[8,6],requests:[{by:106,d:'S',chain:[111,116,117]}]},
 {box:117,at:[8,7],requests:[{by:106,d:'S',chain:[111,116,117]},{by:109,d:'D',chain:[117]}]}],
 managerApproach:base.replay('A',{p:[{id:106,x:10,y:8,face:1}],b:joint.b})};
if(require.main===module)console.log(JSON.stringify({terrain:result.terrain,WDWD:{valid:result.WDWD.valid,state:base.describe(result.WDWD.state)},jointFirst:forced,managerApproach:{valid:result.managerApproach.valid,state:base.describe(result.managerApproach.state)}},null,2));
module.exports={result};
