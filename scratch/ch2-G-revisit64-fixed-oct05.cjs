// Public-observation model fixed replay only. No search, Bridge, hints or save access.
const m=require('./ch2-G-readonly.cjs');
const seq='AWWWSSAAWWWWWWWAADADSDSAADSSAWDWAWDWAWDSSSSSSSSAWWDWAAWWDDASDSAA';
const r=m.replay(seq);if(!r.valid||r.points.length!==64)throw Error('Invalid fixed 64');
let y=4;const right=[];
for(const [i,a]of [...seq].entries()){
 let d=(a==='W'||a==='D')?1:-1;
 if(y+d<4||y+d>10)d=-d;
 y+=d;right.push(y);
}
const ns=process.argv[2]?process.argv[2].split(',').map(Number):[4,15,25,35,45,55,64];
console.log(JSON.stringify({mode:'fixed-only',sequence:seq,length:64,
 checkpoints:ns.map(n=>({...r.points[n-1],right105:[14,right[n-1]]}))},null,2));
