// Fixed public-geometry replay only. No search, Bridge, save, or game input.
const base=require('./ch4-17-readonly.cjs');
const {secondX}=require('./ch4-17-double-cargo-oct05.cjs');
const prefix='SDDDDWAXDWAWSWAWSDSAWWSAA';
const rows=[];
for(const suffix of ['','D','DW','DWA']){
 const r=base.replay(prefix+suffix);
 if(!r.valid)throw Error('Fixed replay rejected '+suffix);
 rows.push({inputs:prefix.length+suffix.length,instructions:prefix+suffix,s:r.s});
}
const last=secondX(rows.at(-1).s);
rows.push({inputs:29,instructions:prefix+'DWAX',s:last});
const keys=r=>r.join(',');
if(rows[0].s.b.find(b=>b.c)?.r.join(',')!=='2,3')throw Error('Wrong low capture');
if(rows[0].s.p[0].r.join(',')!=='4,3')throw Error('Wrong outside');
if(last.b.filter(b=>b.c).map(b=>keys(b.r)).sort().join(';')!=='2,2;2,4')throw Error('Wrong children');
if(last.p.map(keys).sort().join(';')!=='4,3;6,3')throw Error('Wrong outside children');
console.log(JSON.stringify({valid:true,prefix,tail:'DWAX',checkpoints:rows},null,2));
