// Distinct fixed source: relocate the actual25 Fork1 cargo before its final X.
// One local ordinary compatible-family graph. No Bridge/game/save/KB input.
const fs=require('fs'),base=require('./ch4-17-readonly.cjs'),m=require('./ch4-17-double-cargo-oct05.cjs');
const prefix='SDDDDWAXDWAWSWAWSDSAWWSAADWWAAASASDDWWDDDDSSWX';
const pre=base.replay(prefix.slice(0,-1));if(!pre.valid)throw Error('Invalid 45 fixed prefix');
const seed=m.secondX(pre.s);
const r=m.search(5000,45,seed);r.sourcePrefix=prefix;
fs.writeFileSync('scratch/results/ch4-17-mobile46-tail-oct05-result.json',JSON.stringify(r,null,2));
console.log(JSON.stringify({sourcePrefix:prefix,pre:pre.s,source:seed,hit:r.hit,expanded:r.expanded,seen:r.seen,pending:r.pending,cut:r.cut,exhausted:r.exhausted,cap:r.cap,depth:r.depth,rootMasks:r.rootMasks,stats:r.stats,samples:r.samples.map(s=>({kind:s.kind,path:s.path,pre:s.pre}))},null,2));
