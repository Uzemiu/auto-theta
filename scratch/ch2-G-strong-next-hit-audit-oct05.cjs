// Read-only retained-hit audit; no graph search, game calls or canonical writes.
// --write-probe writes only a private cjs/md, never per-step JSON.
const fs=require('fs'),v8=require('v8'),{createModel}=require('./ch2-G-m133-source-model-oct05.cjs');
const z=v8.deserialize(fs.readFileSync('artifacts/solver-frontiers/m131-model60-current.v8'));
const j=JSON.parse(fs.readFileSync('artifacts/slot1-playthrough/2-G.json','utf8').replace(/^\uFEFF/,''));
const m=createModel(j.events[259].observation),hit=z.hit;
if(!hit||hit.parentIndex===undefined)throw Error('Explicit new hit parent required');
const n=hit.parentIndex,sequence=hit.sequence,chain=[];
for(let k=n;k>=0;k=z.q[k].parent)chain.push(k);chain.reverse();
const prefix=sequence.slice(0,-1),canon=s=>JSON.stringify({p:[...s.p].sort((a,b)=>a.id-b.id),b:[...s.b].sort((a,b)=>a.id-b.id)});
if(chain.slice(1).map(k=>z.q[k].a).join('')!==prefix||z.q[n].depth!==prefix.length||!z.done.has(n))throw Error('Raw/parent/depth/done differs');
if(canon(m.start)!==canon(z.q[0].s))throw Error('Source60 differs');
let s=m.start;const checks=[];
for(let i=1;i<chain.length;i++){
 const node=z.q[chain[i]],r=m.step(s,m.A.indexOf(node.a));
 if(!r.valid||r.forces.length||r.leaves.length!==1)throw Error('Ancestor transition differs at '+i);
 s=r.leaves[0].state;if(canon(s)!==canon(node.s))throw Error('Concrete ancestor differs at '+i);
 if(i%4===0||i===prefix.length)checks.push({input:i,a:node.a,left:m.left(s),state:m.describe(s)});
}
const last=m.step(s,m.A.indexOf(sequence.at(-1))),leaves=last.leaves.map(l=>({choices:l.choices,left:m.left(l.state),state:m.describe(l.state)}));
if(!last.valid||JSON.stringify(hit.pre)!==JSON.stringify(m.describe(s))||JSON.stringify(hit.forces)!==JSON.stringify(last.forces)||JSON.stringify(hit.leaves)!==JSON.stringify(leaves))throw Error('Last action fields differ');
const known=z.hitHistory.find(h=>h.actualProof?.event===459)?.hit;
if(!known)throw Error('ACTUAL98 history absent');
const signature=l=>JSON.stringify(l.map(l=>({choices:l.choices,left:l.left,state:l.state})).sort((a,b)=>JSON.stringify(a.choices).localeCompare(JSON.stringify(b.choices))));
const stats={expanded:z.expanded,seen:z.seen.size,pending:z.heap.length,concreteNodes:z.q.length,done:z.done.size,depthLimit:z.depthLimit,depthCut:z.depthCut,depthDeferred:z.depthDeferred.length,maxDepth:z.maxDepth,forces:z.forcesSeen,maxLeaves:z.maxLeaves,priorityLeft:z.priorityLeft,targetPolicy:z.targetPolicy,historicalHits:z.hitHistory.length,completedParentRemainders:z.completedParentRemainders};
const result={sourceEvent:259,parentIndex:n,sequence,length:sequence.length,prefix,parentDepth:z.q[n].depth,nextAction:hit.nextUnexpandedAction,stats,concreteAncestors:chain.length-1,firstMismatch:null,repeatsActual98:signature(leaves)===signature(known.leaves),checkpoints:checks,pre:m.describe(s),forces:last.forces,leaves};
const known102=z.hitHistory.find(h=>h.actualProof?.event===731)?.hit;
result.repeatsActual102=!!known102&&signature(leaves)===signature(known102.leaves);
// Compare only the already sealed ordinary domain's own key; this is not a
// statement that BOX identities/inactive actors never matter in the game.
const {key}=require('./ch2-G-strong42-second-forces-oct05.cjs');
result.ordinaryComponents=[];
for(const file of ['artifacts/solver-frontiers/ch2-G-strong38-second-forces-oct05.v8','artifacts/solver-frontiers/ch2-G-strong42-second-forces-oct05.v8']){
 const old=v8.deserialize(fs.readFileSync(file));
 result.ordinaryComponents.push({file,engine:old.engine,leaves:last.leaves.map(l=>{const g=old.groups.find(g=>g.choice===l.choices[0]),k=key(l.state),index=g?.q.findIndex(node=>key(node.s)===k),path=[];for(let v=index;v>0;v=g.q[v].parent)path.push(g.q[v].a);return {choices:l.choices,key:k,seen:g?.seen.has(k)??false,matchedIndex:index,matchedDepth:index>=0?g.q[index].depth:null,matchedPath:path.reverse().join(''),sealedExpanded:g?.expanded,sealedSeen:g?.seen.size,sealedPending:g?.heap.length,unknown:Object.keys(g?.boundaries??{})};})});
}
function writeProbe(){
 const base='scratch/ch2-G-strong-parent'+n+'-probe-oct05';
 const code=`// Exact retained parent${n}, fixed only; require has no write/search/game side effects.\nconst fs=require('fs'),{createModel}=require('./ch2-G-m133-source-model-oct05.cjs');\nconst sequence=${JSON.stringify(sequence)},parentIndex=${n},checkpointStats=${JSON.stringify(stats)};\nconst j=JSON.parse(fs.readFileSync('artifacts/slot1-playthrough/2-G.json','utf8').replace(/^\\uFEFF/,'')),source=j.events[259].observation,m=createModel(source);\nconst prefix=sequence.slice(0,-1),before=m.replay(prefix);\nif(!before.valid||before.states.length!==1||before.points.some(e=>e.states.length!==1))throw Error('Prefix changed');\nconst pre=before.states[0].state,last=m.step(pre,m.A.indexOf(sequence.at(-1)));\nif(!last.valid||last.leaves.length!==2||last.leaves.some(l=>m.left(l.state)!==2))throw Error('Terminal strong layout changed');\nconst checkpoints=[];let s=m.start;for(let i=0;i<prefix.length;i++){const r=m.step(s,m.A.indexOf(prefix[i]));if(!r.valid||r.forces.length||r.leaves.length!==1)throw Error('Prefix transition changed');s=r.leaves[0].state;if((i+1)%4===0||i+1===prefix.length)checkpoints.push({input:i+1,state:m.describe(s)});}\nconst result={sourceEvent:259,sourceFrame:source.frame,parentIndex,sequence,length:sequence.length,prefix,checkpointStats,checkpoints,pre:m.describe(pre),probe:{action:sequence.at(-1),forces:last.forces,leaves:last.leaves.map(l=>({choices:l.choices,left:m.left(l.state),state:m.describe(l.state),trace:l.trace.map(t=>({...t,state:m.describe(t.state)}))}))},scope:'MODEL only, original conservativeM133. Two leaves each2free are sufficient resources, not a fourGoal completion. Concrete parent path was separately audited against retained q. Runtimetime/T/GMID must be actual; trace microticks are not runtime.'};\nif(require.main===module)console.log(JSON.stringify(result));module.exports={m,source,sequence,parentIndex,checkpointStats,pre,last,final:last,result};\n`;
 fs.writeFileSync(base+'.cjs',code);
 const pose=s=>s.p.map(p=>`${p.id}(${p.x},${p.y})/${p.face}${p.active?'':` inactive(g${p.ghost},m${p.masked})`}`).join('; ')+'; BOX '+s.b.map(b=>`${b.id}(${b.x},${b.y})/${b.md}/src${b.src}`).join('; ');
 const lines=['# 2-G 新strong布局：精确父'+n,'','MODEL ONLY，尚未实测。由同source60巨frontier继承，不是新根；原98重复末D已精确归档历史。', '',
 '原始串`'+sequence+'`，'+sequence.length+'输入；前'+prefix.length+'串`'+prefix+'`全部单叶/无force/无未知，最后单`'+sequence.at(-1)+'`另核。公开source259，恢复350/418与源整14字典由owner/root核。', '',
 'checkpoint stats：`'+JSON.stringify(stats)+'`。唯一checkpoint保留此hit，父剩余动作索引'+hit.nextUnexpandedAction+'，不得丢余动作。实际执行session/PID/exit另据工具记录，不由旧报告猜。', '',
 chain.length-1+'个concrete祖先逐ID p/b全部match，firstMismatch=null，末动作pre/force/leaves与checkpoint full modeled fields一致。full concrete signature repeatsActual98='+result.repeatsActual98+'，repeatsActual102='+result.repeatsActual102+'；不按理论箱总量授予四Goal完成。', '',
 '| 前态输入数 | modeled所有实体 |','|---|---|'];
 for(const c of checks)lines.push('| '+c.input+' | '+pose(c.state)+' |');
 lines.push('', '末'+sequence.at(-1)+'的force：`'+JSON.stringify(last.forces)+'`。每微拍完整p/b/requested在固定probe导出last.leaves[].trace；不把微拍加总写成游戏time。', '', '| 胜者 | 终MODEL所有实体 |','|---|---|');
 for(const l of leaves)lines.push('| '+l.choices.join(',')+' /left'+l.left+' | '+pose(l.state)+' |');
 lines.push('', 'physics保原conservative M133；derived finite A-wall/Wcross和one-front链没有默注原巨图。capture/stack/更广player crossing/未校准force保持边界，下一普通尾若遇必须实测，不把2free当全关必要预算。', '', '## 已封普通组件只读比较', '', '下表仅用既有ordinary key（活PLAYER IDs/坐标、right位置与face、匿名BOX坐标）判断有限模型覆盖；不是实机BOX身份/失活角色位置全局无关定理。没有为该比较开启BFS。');
 for(const component of result.ordinaryComponents){lines.push('', '`'+component.file+'` / '+component.engine);for(const l of component.leaves)lines.push('- choices'+l.choices.join(',')+'：seen='+l.seen+'，matchedIndex='+l.matchedIndex+'，depth='+l.matchedDepth+'，源后串`'+l.matchedPath+'`，sealed expanded/seen/pending='+l.sealedExpanded+'/'+l.sealedSeen+'/'+l.sealedPending+'，unknown='+l.unknown.join(','));}
 lines.push('');
 fs.writeFileSync(base+'.md',lines.join('\n'));return base;
}
if(process.argv.includes('--write-probe'))result.probePath=writeProbe();
console.log(JSON.stringify(process.argv.includes('--compact')?{...result,checkpoints:checks.map(c=>({input:c.input,left:c.left})),pre:undefined,leaves:leaves.map(l=>({choices:l.choices,left:l.left,players:l.state.p.filter(p=>p.active),boxes:l.state.b})),forces:last.forces}:result));
