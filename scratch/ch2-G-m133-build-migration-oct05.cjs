// Upgrade the retained 500k frontier, not a root rerun.
const fs=require('fs');let s=fs.readFileSync('scratch/ch2-G-m132-model60-resource-oct05.cjs','utf8');
s=s.replace("require('./ch2-G-m132-blocked-source-model-oct05.cjs')","require('./ch2-G-m133-source-model-oct05.cjs')");
s=s.replace('let migration=null;', 'let migration=null,previousMigration=null;');
s=s.replace('version:4,migration,q,seen,heap,done,depthDeferred','version:5,migration,q,seen,heap,done,depthDeferred');
s=s.replace("if(![3,4].includes(z.version))", "if(![4,5].includes(z.version))");
s=s.replace('if(z.version===4)migration=z.migration;', 'if(z.version===5)migration=z.migration;else previousMigration=z.migration;');
s=s.replace("require('./ch2-G-m131-source-model-oct05.cjs').createModel(o)","require('./ch2-G-m132-blocked-source-model-oct05.cjs').createModel(o)");
s=s.replace("migration={status:'running',indices:[...done]", "migration={stage:'M133',previousMigrationScope:previousMigration?{cursor:previousMigration.cursor,checkedActions:previousMigration.checkedActions,eligible:previousMigration.eligible,newValid:previousMigration.newValid,added:previousMigration.added,lost:previousMigration.lost,oldHistory:previousMigration.oldHistory}:null,status:'running',indices:[...done]");
const old=String.raw`function migrationEligible(b){
 if(b.boundary!=='perpendicular-free-box')return false;
 const body=b.state.b.find(z=>z.id===b.box),next=[body.x+V[b.boxDirection][0],body.y+V[b.boxDirection][1]];
 return walls.has(next.join(','))||!terrain.has(next.join(','));
}`;
if(!s.includes(old))throw Error('migration predicate anchor');s=s.replace(old,"function migrationEligible(b){return b.boundary==='perpendicular-free-box';}");
s=s.replaceAll('const key=boundaryKey(b);','const raw=boundaryKey(b),key=raw+((raw.startsWith(\'perpendicular\')||raw.startsWith(\'m133-\')||raw===\'new-capture\')?(m.left(node.s)>=3?\'/preLeftAtLeast3\':\'/preLeft2\'):\'\');');
const compactOld='function compact(){const r=snapshot();delete r.sourceState;delete r.boundaries;return r;}';
const compactNew="function compact(){const r=snapshot();delete r.sourceState;delete r.boundaries;delete r.firstForces;if(r.migration){const z=r.migration;r.migration={stage:z.stage,status:z.status,cursor:z.cursor,checkedActions:z.checkedActions,eligible:z.eligible,added:z.added,lost:z.lost,newValid:z.newValid,newBoundary:z.newBoundary,newBoundaryCounts:z.newBoundaryCounts,oldHistory:{expanded:z.oldHistory.expanded,seen:z.oldHistory.seen,pending:z.oldHistory.pending,boundaryCounts:z.oldHistory.boundaryCounts},previousMigrationScope:z.previousMigrationScope?{cursor:z.previousMigrationScope.cursor,eligible:z.previousMigrationScope.eligible,added:z.previousMigrationScope.added}:null};}return r;}";
if(!s.includes(compactOld))throw Error('compact anchor');s=s.replace(compactOld,compactNew);
fs.writeFileSync('scratch/ch2-G-m133-model60-resource-oct05.cjs',s,'utf8');console.log('M133_PRIVATE_SUCCESSOR_WRITTEN');
