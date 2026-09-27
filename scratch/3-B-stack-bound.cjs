// Bounded 3-B experiment: stack-aware model, <=40k total expanded states, no game I/O.
const fs=require('fs'),{createModel,replay,search}=require('./stack-cargo-readonly.cjs');
const r=JSON.parse(fs.readFileSync('artifacts/slot1-playthrough/3-B.json','utf8'));
const xy=p=>p.slice(0,2).join(','),pc=m=>{let n=0;for(;m;m&=m-1)n++;return n};
const prep='WWDSDSADDSSAASAADDWDDWWWAAAS';
for(const [name,prefix] of [['actual-time30',''],['two-box-prep',prep]]){
 const model=createModel(r,{observation_event:8,same_type_only:true,allow_partial_death:false,min_players:1,max_players:2});
 // All four observed BOX have Color3/ShadowFalse. Interchange only identities before optical observation; retain stack multiplicity and the true witness IDs in states.
 model.serial=s=>s.p.map(p=>[p[0],p[1],p[3]?p[2]:0,p[3],p[4]<0?'-':xy(s.b[p[4]]),p[5]].join(',')).sort().join(';')+'|'+s.b.map((b,j)=>pc(s.m[j])+':'+xy(b)).sort().join(';')+'|'+s.c+'|'+s.l;
 const rr=replay(model,prefix);if(!rr.valid)throw Error('Bad prep');let stacked=0,firstStack=null;
 const at=(arr,p)=>arr.some(z=>xy(z)===p),accept=s=>s.p.some(p=>p[4]>=0&&xy(p)==='1,2') || (s.p.length===2&&s.p.every(p=>p[4]<0)&&at(s.b,'2,2')&&((at(s.b,'3,2')&&at(s.p,'4,2')&&at(s.p,'1,3'))||(at(s.b,'4,2')&&at(s.p,'5,2')&&at(s.p,'2,3'))));
 const result=search(model,{start:rr.state,max_states:20000,accept,prune:s=>{if(s.m.some(m=>pc(m)>1)){stacked++;if(!firstStack)firstStack=model.describe(s);}return s.b.length<2||(s.p.length===1&&s.p[0][3]===0);}});
 console.log(JSON.stringify({name,prefix,stack_transition_candidates:stacked,first_stack_candidate:firstStack,...result}));
}
