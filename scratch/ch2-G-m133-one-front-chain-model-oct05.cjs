// Private finite extension of the public-observation M133 model.
// Actual112: moving rear ICE Box vacates while pushing one stationary SPIKE
// front Box into empty ICE. No game/hidden code is read or called.
const fs=require('fs'),Module=require('module');
const base=require.resolve('./ch2-G-m133-source-model-oct05.cjs');
let code=fs.readFileSync(base,'utf8');
const old="const candidate=tick>0&&e.md>=0&&terrain.get(K(at(e)))==='ICE'&&terrain.get(K(z))==='ICE'&&bi(dest)<0&&!blocked(dest)&&!p.some(q=>q.active&&K(at(q))===K(dest));\n     if(candidate){passes.push({j,e:{...e},d,md:body.md,src:body.src,dest,z});np.push({...e,x:z[0],y:z[1],md:d,src:e.id});continue;}";
const replacement=`const frontj=bi(dest),front=frontj<0?null:b[frontj],frontDest=front?move(front,body.md):null;
     const empty=frontj<0&&!blocked(dest)&&!p.some(q=>q.active&&K(at(q))===K(dest));
     // Only this one-front geometry: stationary SPIKE front -> empty ICE;
     // longer chains, moving front, occupied destination stay unverified.
     const oneFront=front&&front.md<0&&terrain.get(K(dest))==='SPIKE'&&terrain.get(K(frontDest))==='ICE'&&bi(frontDest)<0&&!blocked(frontDest)&&!p.some(q=>q.active&&K(at(q))===K(frontDest));
     const candidate=tick>0&&e.md>=0&&terrain.get(K(at(e)))==='ICE'&&terrain.get(K(z))==='ICE'&&(empty||oneFront);
     if(candidate){passes.push({j,e:{...e},d,md:body.md,src:body.src,dest,z,frontj:oneFront?frontj:-1,frontDest:oneFront?frontDest:null});np.push({...e,x:z[0],y:z[1],md:d,src:e.id});continue;}`;
if(!code.includes(old))throw Error('Finite M133 candidate hook differs');
code=code.replace(old,replacement);
const before='  const forceTargets=[];';
const verify=`  for(const pass of passes)if(pass.frontj>=0){
   const r=plans.get(pass.frontj)||[],others=np.filter(q=>q.id!==pass.e.id&&q.active);
   if(cancel.has(pass.frontj)||r.length!==1||r[0].kind!=='inertia'||r[0].d!==pass.md||r[0].src!==pass.src||others.some(q=>K(at(q))===K(pass.frontDest))){
    return {boundary:'m133-one-front-nonindependent',tick,box:b[pass.j].id,frontBox:b[pass.frontj].id,player:pass.e.id,requests:r,state:clone(s)};
   }
  }
  const forceTargets=[];`;
if(!code.includes(before))throw Error('Finite M133 request validation hook differs');
code=code.replace(before,verify);
// Actual491: the just-transferred front has reached3,10; two stationary Boxes
// at2,10 and1,10 end at true Wall0,10. Clear this finite terminal motion in the
// same frame. The private transient marker is not a game property and exists
// only within this input; other arbitrary chain braking is not generalized.
const next='  if(new Set(nb.map(e=>K(at(e)))).size<nb.length)';
const braking=`  for(let j=0;j<nb.length;j++){
   const body=nb[j],old=b[j],wasFront=old._oneFrontCarry||passes.some(pass=>pass.frontj===j);
   if(!wasFront||body.md<0)continue;
   body._oneFrontCarry=true;
   let z=move(body,body.md);const tail=[];let next;
   while((next=nb.find(q=>K(at(q))===K(z)))){tail.push(next);z=move(next,body.md);if(tail.length>nb.length)throw Error('Terminal chain loop');}
   if(!tail.length||!blocked(z)||terrain.get(K(at(body)))!=='ICE')continue;
   if(tail.length!==2||tail.some(q=>q.md>=0)){
    return {boundary:'m133-front-terminal-chain-unverified',tick,box:body.id,chain:tail.map(q=>({...q})),state:clone(s)};
   }
   if(blocked(z)){
    body.md=-1;body.src=-1;delete body._oneFrontCarry;
   }
  }
  if(new Set(nb.map(e=>K(at(e)))).size<nb.length)`;
if(!code.includes(next))throw Error('Finite front-braking hook differs');
code=code.replace(next,braking);
const reset='for(const b of init.b){b.md=-1;b.src=-1;}';
if(!code.includes(reset))throw Error('Transient input reset hook differs');
code=code.replace(reset,'for(const b of init.b){b.md=-1;b.src=-1;delete b._oneFrontCarry;}');
const implementation=new Module(base,module);implementation.filename=base;implementation.paths=module.paths;
implementation._compile(code,base);
module.exports=implementation.exports;
