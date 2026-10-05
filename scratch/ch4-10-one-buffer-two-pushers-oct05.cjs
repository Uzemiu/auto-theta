// Fixed constructed inventory audit only. No search/game/Bridge/save/hidden code.
const m=require('./ch4-10-fork-stagger-tail-oct05.cjs'),cp=x=>JSON.parse(JSON.stringify(x));
const source=cp(m.constructed);
source.b=source.b.filter(b=>b.id!==58); // Remove the old rear empty at7,4.
source.p.push({id:61,r:[7,3],f:'W',fork:0,k:0,c:-1,ghost:0,h:1});
function run(){const r=m.replay('XWWW',source);
 const extraFork=cp(source);extraFork.p[0].fork=2;extraFork.p=extraFork.p.filter(p=>p.id!==60);
 const repair=m.replay('XWWX',extraFork);
 return{constructed:true,source,tail:'XWWW',result:r,extraForkConditional:{source:extraFork,tail:'XWWX',result:repair},search:{started:false,expanded:0,liveHandle:null},
        scope:'One cargo7,6 F1/D +one empty7,5 +two free7,2/7,3 F0; Lock already open. Fixed observed snapshot movement/ordinary free fusion and SPIKE death. No claimed legal initial prefix.'};}
if(require.main===module)console.log(JSON.stringify(run(),null,2));
module.exports={source,run};
