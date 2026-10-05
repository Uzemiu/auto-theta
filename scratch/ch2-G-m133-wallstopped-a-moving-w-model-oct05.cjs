// Exact finite actual101 geometry, separate from conservative and chain models.
// A-facing stationary free at ICE/backWall west survives W-sliding free contact;
// the arriving W free becomes inactive without ghost/mask/cargo.
// No rotation, two-moving, Box-stopped, opposite order or other height assumed.
const fs=require('fs'),Module=require('module');
const base=require.resolve('./ch2-G-m133-one-front-chain-model-oct05.cjs');
let source=fs.readFileSync(base,'utf8');
const hook='implementation._compile(code,base);';
const injection=`const crossHook="   stats.uncertainPlayerCross++;return {boundary:'unverified-player-cross',tick,state:clone(s),players:[q,e]};";
const crossFinite="   if(q.md<0&&q.face===1&&e.md===0&&e.face===0&&terrain.get(K(at(q)))==='ICE'&&walls.has(K(move(q,1)))&&bi(at(q))<0){merged.push({...e,active:false,md:-1,src:-1});continue;}\\n"+crossHook;
if(!code.includes(crossHook))throw Error('Finite player cross hook differs');
code=code.replace(crossHook,crossFinite);
const arrivalHook='  if(new Set(nb.map(e=>K(at(e)))).size<nb.length)';
const arrivalFinite="  for(const p of np)if(p.active&&p.md===1&&p.face===1&&terrain.get(K(at(p)))==='ICE'&&walls.has(K(move(p,1)))){p.md=-1;p.src=-1;}\\n"+arrivalHook;
if(!code.includes(arrivalHook))throw Error('Finite A Wall-arrival hook differs');
code=code.replace(arrivalHook,arrivalFinite);
implementation._compile(code,base);`;
if(!source.includes(hook))throw Error('Finite chain factory hook differs');
source=source.replace(hook,injection);
const wrapper=new Module(base,module);wrapper.filename=base;wrapper.paths=module.paths;wrapper._compile(source,base);
module.exports=wrapper.exports;
