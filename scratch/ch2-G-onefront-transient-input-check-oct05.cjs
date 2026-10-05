// Meaningful transient lifecycle diagnostic, no game/search/filesystem writes.
const fs=require('fs'),Module=require('module');
const filename=require.resolve('./ch2-G-m133-one-front-chain-model-oct05.cjs');
let source=fs.readFileSync(filename,'utf8');
source=source.replace('implementation._compile(code,base);',`code=code.replace('const leaves=[],boundaries=[],forces=[];', 'const leaves=[],boundaries=[],forces=[];stats.inputFrontCarry=init.b.filter(b=>b._oneFrontCarry).map(b=>b.id);');implementation._compile(code,base);`);
const factory=new Module(filename,module);factory.filename=filename;factory.paths=module.paths;factory._compile(source,filename);
const j=JSON.parse(fs.readFileSync('artifacts/slot1-playthrough/2-G.json','utf8').replace(/^\uFEFF/,''));
const o=j.events[482].observation,m=factory.exports.createModel(o,o.level.timelines.find(t=>t.axis[0]===0));
const full=m.step(m.start,0),mid=full.leaves[0].trace.find(t=>t.tick===5).state;
if(mid.b.find(b=>b.id===111)?._oneFrontCarry!==true)throw Error('Transferred front midinput marker absent');
const resumed=m.step(mid,0,{resume:true}),resumeMarker=[...m.stats.inputFrontCarry];
const fresh=m.step(mid,0),freshMarker=[...m.stats.inputFrontCarry];
const unmarked=m.clone(mid);for(const b of unmarked.b)delete b._oneFrontCarry;
const freshControl=m.step(unmarked,0),resumeUnmarked=m.step(unmarked,0,{resume:true});
const canon=s=>JSON.stringify(s);
const firstMarked=resumed.leaves[0].trace[0].state.b.find(b=>b.id===111),firstUnmarked=resumeUnmarked.leaves[0].trace[0].state.b.find(b=>b.id===111);
const result={mid111:mid.b.find(b=>b.id===111),resumeMarker,freshMarker,
 resumedMatchesFull:canon(resumed.leaves[0].state)===canon(full.leaves[0].state),
 freshMatchesUnmarked:canon(fresh.leaves[0].state)===canon(freshControl.leaves[0].state),
 resumeFirstMarked111:firstMarked,resumeFirstUnmarked111:firstUnmarked,
 allMatch:resumeMarker.includes(111)&&freshMarker.length===0&&canon(resumed.leaves[0].state)===canon(full.leaves[0].state)&&canon(fresh.leaves[0].state)===canon(freshControl.leaves[0].state)&&firstMarked.md<0&&firstUnmarked.md>=0,
 scope:'Uses actual112 model microtick5 middle state. Resume keeps provenance needed to clear terminal motion at the next actual frame; a fresh input forgets it and equals no-marker control. No actual new input is proposed.'};
if(require.main===module)console.log(JSON.stringify(result));module.exports={result};
