// Generate our private successor while retaining the exact old frontier format.
const fs=require('fs');
let s=fs.readFileSync('scratch/ch2-G-m131-model60-resource-oct05.cjs','utf8');
s=s.replace("require('./ch2-G-m131-source-model-oct05.cjs')","require('./ch2-G-m132-blocked-source-model-oct05.cjs')");
s=s.replace("const checkpointPath='scratch/ch2-G-m131-model60-frontier-oct05.v8';","const checkpointPath='artifacts/solver-frontiers/m131-model60-current.v8';\nlet migration=null;");
s=s.replace("const key=b.boundary;boundaryCounts[key]", "const key=boundaryKey(b);boundaryCounts[key]");
s=s.replace("function snapshot(){return {source:'MODEL60 = actual50 event74 + WDSAWWDWAA; not actual83'", "function snapshot(){return {source:'actual60 event131/time81; exact original50 event74 + WDSAWWDWAA',migration:migration?{...migration,indices:undefined}:null");
s=s.replace("version:3,q,seen,heap,done,depthDeferred", "version:4,migration,q,seen,heap,done,depthDeferred");
s=s.replace("if(z.version!==3)throw Error('checkpoint version');", "if(![3,4].includes(z.version))throw Error('checkpoint version');\n if(z.version===4)migration=z.migration;");
const marker='async function main(){';
const inject=String.raw`
// Classification is diagnostic only; no moving-perpendicular propagation.
function boundaryKey(b){
 if(b.boundary!=='perpendicular-free-box')return b.boundary;
 const st=b.state,body=st.b.find(z=>z.id===b.box),map=new Map(st.b.map(z=>[K(z),z]));
 function canChain(d){let p=[body.x+V[d][0],body.y+V[d][1]],visited=new Set();while(map.has(p.join(','))){if(visited.has(p.join(',')))return false;visited.add(p.join(','));p=[p[0]+V[d][0],p[1]+V[d][1]];}return !walls.has(p.join(','))&&terrain.has(p.join(','));}
 const next=[body.x+V[b.boxDirection][0],body.y+V[b.boxDirection][1]],blocked=walls.has(next.join(','))||!terrain.has(next.join(','));
 return b.boundary+'/'+(blocked?'oldDirectionBlockedWallGap':canChain(b.boxDirection)?'oldDirectionCanChainMove':'oldDirectionBlockedChain')+'/'+(canChain(b.playerDirection)?'playerDirectionCanChainMove':'playerDirectionBlockedChain');
}
const oldM=require('./ch2-G-m131-source-model-oct05.cjs').createModel(o);
function initMigration(){
 if(migration)return;
 migration={status:'running',indices:[...done],cursor:0,checkedActions:0,eligible:0,added:0,lost:0,newValid:0,newBoundary:0,oldHistory:{expanded,seen:seen.size,pending:heap.length,boundaryCounts:{...boundaryCounts},firstForces:JSON.parse(JSON.stringify(firstForces)),maxLeaves,forcesSeen},newBoundaryCounts:{}};
}
function migrationEligible(b){
 if(b.boundary!=='perpendicular-free-box')return false;
 const body=b.state.b.find(z=>z.id===b.box),next=[body.x+V[b.boxDirection][0],body.y+V[b.boxDirection][1]];
 return walls.has(next.join(','))||!terrain.has(next.join(','));
}
function migrationWindow(target){
 initMigration();
 while(migration.cursor<migration.indices.length&&migration.cursor<target&&!hit){
  const n=migration.indices[migration.cursor++],node=q[n];
  for(let a=0;a<4;a++){
   migration.checkedActions++;
   const old=oldM.step(node.s,a);if(old.valid||!old.boundaries.some(migrationEligible))continue;
   migration.eligible++;const sequence=path(n)+m.A[a],r=m.step(node.s,a);
   if(!r.valid){migration.newBoundary++;for(const b of r.boundaries){const key=boundaryKey(b);migration.newBoundaryCounts[key]=(migration.newBoundaryCounts[key]||0)+1;const candidate={sequence,pre:m.describe(node.s),result:b,leftBefore:m.left(node.s),migrationFromBlocked:true};if(!boundaries[key]||sequence.length<boundaries[key].sequence.length)boundaries[key]=candidate;}continue;}
   migration.newValid++;maxLeaves=Math.max(maxLeaves,r.leaves.length);
   if(r.forces.length){forcesSeen++;const counts=r.leaves.map(z=>m.left(z.state));if(firstForces.length<12)firstForces.push({sequence,forces:r.forces,leafCount:r.leaves.length,left:counts,migrationFromBlocked:true});if(r.leaves.length>=4||counts.some(c=>c>=2)){hit={sequence,pre:m.describe(node.s),forces:r.forces,leaves:r.leaves.map(z=>({choices:z.choices,left:m.left(z.state),state:m.describe(z.state)})),migrationFromBlocked:true};break;}continue;}
   const state=r.leaves[0].state;if(m.left(state)<2){migration.lost++;continue;}
   const key=serial(state);if(seen.has(key))continue;seen.add(key);const depth=node.depth+1;q.push({s:state,parent:n,a:m.A[a],depth,score:score(state,depth)});push(q.length-1);migration.added++;
  }
 }
 if(migration.cursor===migration.indices.length)migration.status='complete';
 return {status:migration.status,cursor:migration.cursor,total:migration.indices.length,checkedActions:migration.checkedActions,eligible:migration.eligible,newValid:migration.newValid,newBoundary:migration.newBoundary,added:migration.added,lost:migration.lost,newBoundaryCounts:migration.newBoundaryCounts,expanded,seen:seen.size,pending:heap.length,hit};
}
`;
if(!s.includes(marker))throw Error('main anchor absent');s=s.replace(marker,inject+'\n'+marker);
s=s.replace("if(expanded<initialWindow)runTo(initialWindow);console.log(JSON.stringify(compact()));", "if(restored){initMigration();while(migration.status!=='complete'&&!hit){const result=migrationWindow(migration.cursor+20000);if(migration.cursor%100000===0||migration.status==='complete'||hit)saveCheckpoint();console.log(JSON.stringify({migrationWindow:result}));await new Promise(resolve=>setImmediate(resolve));}}\n if(expanded<initialWindow)runTo(initialWindow);console.log(JSON.stringify(compact()));");
s=s.replace("const restored=process.argv.includes('--live')&&loadCheckpoint();", "const restored=process.argv.includes('--live')&&loadCheckpoint();if(!restored)throw Error('Migration requires retained checkpoint; refusing a root rerun');");
s=s.replace("if(cmd==='CONTINUE'){", "if(cmd==='CONTINUE'){");
s=s.replace("module.exports={runTo,snapshot,m,source,mergeFrontier,saveCheckpoint,loadCheckpoint};", "module.exports={runTo,snapshot,m,source,mergeFrontier,saveCheckpoint,loadCheckpoint,boundaryKey,migrationWindow};");
fs.writeFileSync('scratch/ch2-G-m132-model60-resource-oct05.cjs',s,'utf8');
console.log('PRIVATE_SUCCESSOR_WRITTEN; no search launched by builder');
