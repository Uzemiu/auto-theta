// Conditional ordinary tail only; no game/save/KB APIs, no new BFS.
// Cargo-X geometry uses already observed live cargo rules; not executed here.
const fs=require('fs'),vm=require('vm');
const src=fs.readFileSync('scratch/ch4-15-readonly.cjs','utf8'),ctx={require,process:{argv:[]},console,module:{exports:{}}};
vm.runInNewContext(src.slice(0,src.indexOf("if(process.argv[2]==='replay')"))+'\nmodule.exports={step,wall,spike,ice};',ctx);
const {step,wall}=ctx.module.exports,K=r=>r.join(',');
function audit(right=false){
 const x=right?6:2,buffer=right?7:1,inner=right?5:3;
 if(wall.has(K([x-1,6]))||wall.has(K([x+1,6])))throw Error('Side birth unexpectedly blocked');
 const before={b:[{r:[x,6],color:3},{r:[buffer,5],color:4}],p:[{r:[x,6],f:'W',fork:1,c:0,ghost:0},{r:[x,5],f:'W',fork:0,c:-1,ghost:0}],rem:[]};
 // Explicit conditional first X: live cargo F1 -> two cargo F0; outerF0 waits.
 const afterX={b:[{r:[buffer,6],color:3},{r:[inner,6],color:3},{r:[buffer,5],color:4}],p:[{r:[buffer,6],f:'W',fork:0,c:0,ghost:0},{r:[inner,6],f:'W',fork:0,c:1,ghost:0},{r:[x,5],f:'W',fork:0,c:-1,ghost:0}],rem:[]};
 const ordinary=right?'SDWWAW':'SAWWDW',goals=right?['5,6','6,7','7,8']:['3,6','2,7','1,8'];
 let s=afterX;const checkpoints=[{step:1,input:'X',state:s}];
 for(let i=0;i<ordinary.length;i++){
  const n=step(s,ordinary[i]);if(!n)return{right,valid:false,step:i+2};
  if(n.p.length!==3||n.p.some(p=>p.ghost)||n.p.filter(p=>p.c>=0).length!==2)throw Error('Unexpected actor/ghost/capture change');
  s=n;checkpoints.push({step:i+2,input:ordinary[i],state:s});
 }
 return{right,valid:true,conditional:true,full:'X'+ordinary,before,afterX,goals,covered:goals.every(g=>s.p.some(p=>!p.ghost&&K(p.r)===g)),final:s,checkpoints,scope:'geometric live-cargo-X then exact ordinary/ICE tail; no additional X/stack/conflict/ghost/BFS; source prefix not constructed'};
}
const result=[audit(false),audit(true)];
if(require.main===module)console.log(JSON.stringify(result,null,2));
module.exports={audit,result};
