// Deterministic replay of actual 1-6+1-20 initial. Never controls game.
const fs=require('fs'),vm=require('vm');
const prefix='DDDWWWDDDDDDWWAWWDDDDDDDWSASSASSASSAAWWAWSAAAAAA';
const suffix='XXAAAXXAAWXWWXXWWWWDWDDSXDDSDD';
const src=fs.readFileSync('artifacts/slot1-playthrough/scratch/root-ice-multi.cjs','utf8').split('if(cfg.replay)')[0]
 .replace('let attempted=false;for(const off of [1,3])','let attempted=false;const splitDirs=new Set();for(const off of [1,3])')
 .replace('if(can(v,d)){attempted=true;const q=land','if(can(v,d)&&!splitDirs.has(d)){splitDirs.add(d);attempted=true;const q=land');
const route=prefix+suffix;
const trace=`let s=start;for(let i=0;i<'${route}'.length;i++){s=next(s,'WASDX'.indexOf('${route}'[i]));console.log(i+1,'${route}'[i],JSON.stringify(s));if(!s)break;}`;
vm.runInNewContext(src+trace,{require,process:{argv:['node','x','artifacts/slot1-playthrough/1-6+1-20.json',JSON.stringify({initial:true,merge_stable_only:true,allow_partial_death:true})]},console});
