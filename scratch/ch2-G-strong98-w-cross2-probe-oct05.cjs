// Fixed actual98 axis1: first W, then one W at first unmodeled player cross.
// Public source only, no search/game/canonical writes on require.
const fs=require('fs'),Module=require('module');
const filename=require.resolve('./ch2-G-m132-blocked-source-model-oct05.cjs');
const old=fs.readFileSync(filename,'utf8'),find='if(r.boundary){boundaries.push({...r,path});return;}';
if(!old.includes(find))throw Error('Diagnostic trace hook differs');
const diag=new Module(filename,module);diag.filename=filename;diag.paths=module.paths;
diag._compile(old.replace(find,'if(r.boundary){boundaries.push({...r,path,acceptedTrace:trace});return;}'),filename);
const j=JSON.parse(fs.readFileSync('artifacts/slot1-playthrough/2-G.json','utf8').replace(/^\uFEFF/,''));
const sourceEvent=459,o=j.events[sourceEvent].observation;
const t=o.level.timelines.find(t=>t.axis[0]===1&&t.entities.find(e=>e.id===109)?.active&&!t.entities.find(e=>e.id===106)?.active);
if(!t||t.time!==160)throw Error('Actual98 W/109 axis1 source absent');
const m=diag.exports.createModel(o,t),first=m.step(m.start,0);
if(!first.valid||first.leaves.length!==1||first.forces.length)throw Error('FirstW unexpectedly unknown');
const pre=first.leaves[0].state,last=m.step(pre,0),b=last.boundaries[0];
if(last.valid||last.forces.length||b?.boundary!=='unverified-player-cross'||b.tick!==6)throw Error('SecondW expected cross differs');
const result={sourceEvent,sourceFrame:o.frame,sourceAxis:t.axis,realSourceTime:t.time,sequence:'WW',length:2,
 first:{valid:true,stable:m.describe(pre),acceptedTrace:first.leaves[0].trace.map(z=>({...z,state:m.describe(z.state)}))},
 probe:{valid:false,boundary:{...b,state:m.describe(b.state),players:b.players.map(p=>({...p,face:m.A[p.face],md:p.md<0?'stop':m.A[p.md]})),acceptedTrace:b.acceptedTrace.map(z=>({...z,state:m.describe(z.state)}))}},
 scope:'Historical M132 diagnostic of actual98 W branch. Actual101 now verifies inactive incoming109 atICE2,9 and immediate Wall-sideA arrival stop at534. This diagnostic still stops before that event; separate finite clone calibrates48 public frames. Model ticks are not game time.'};
function writeReport(){
 const pose=p=>`${p.id}:${p.x},${p.y}/${p.face}/${p.md}/src${p.src}${p.active?'':` inactive(g${p.ghost},m${p.masked})`}`;
 const body=e=>`${e.id}:${e.x},${e.y}/${e.md}/src${e.src}`;
 const lines=['# 2-G strong98 W轴：两个W的角色交汇探针','',
 'ACTUAL101已闭：537/time173停A108[2,9]与滑W109[2,8]均活，538/time174同2,9后109inactive/ghost0/mask0/uncontained/h1/F0/md0/src-1，108活Astop。540仅105+108活、九箱源位不动，原A轴459/time160保全。534的A到Wall侧ICE即清md/src是旧tick2两字段差异，不能称旧六微拍全match。新finite clone旧37+新11=48公开帧/叶全部properties键校准通过；只A-westWall/W-moving有序交汇，其他方向/高度/顺序未知。下文为历史M132停止诊断，不再作为待测计划。', '',
 '来源actual主459/frame19330256，axis[1,0,0]/id119/time160：活105[14,10]/W、108[5,5]/W、109[2,9]/W；106[10,10]/A inactive/masked1/ghost0，107旧8,4ghost死。九空Blue h1/noCargo/noStack，与raw38选择109叶物理相同。需要正常选中此签名的叶，不按timeline数组顺序代替T选择；具体Undo/T授权由root给sole owner。脚本require只固定两动作，无write/search/gamecalls。', '',
 '准确raw串`WW`，先W稳定核后再唯一单W。早期口述WWW撤回，不存在额外第三W。第一次W全valid/noForce/noUnknown，稳定所有实体：', '',
 ...result.first.stable.p.map(pose),...result.first.stable.b.map(body), '',
 '第二W接受的MODEL微拍0..5与tick6交汇停止前：', '',
 '| MODEL微拍 | 所有PLAYER | 所有BOX | requested |','|---|---|---|---|'];
 for(const z of result.probe.boundary.acceptedTrace)lines.push(`| tick${z.tick}后 | ${z.state.p.map(pose).join('; ')} | ${z.state.b.map(body).join('; ')} | ${(z.requested??[]).map(r=>`BOX${r.box}/${m.A[r.d]}/src${r.src}/${r.kind}`).join('; ')||'无'} |`);
 lines.push(`| tick${b.tick}前unknown | ${m.describe(b.state).p.map(pose).join('; ')} | ${m.describe(b.state).b.map(body).join('; ')} | 最终PLAYER同格的结算未传播 |`, '',
 '关键：第二W中108[5,9]北面被5,10/5,11双箱+5,12Wall整链阻挡，fallbackA沿row9滑至2,9，被1,9Wall停止（faceA/md0src-1）。109从2,2向W滑至2,8，并在下一拍进入同一个ICE2,9，faceW/md1/src109。两个活人同格但恰一moving、一stopped、face相差90度；不是M045同face一动一停，也不是4-18两moving正交样本。Box1132,10/1142,11仍在北方，人物接触结算后再推该链/踩刺的时序未知，不能预写稳定人数或通关。', '',
 '需要实测PLAYER108/109的active/face/movingdir/movingsrc/movingsrcext/ghost/maskedoff/contained/container/height/split/key，同2,9接触前后是否仍两活、是否合并/停止/继续；BOX113/114的来源和位置是否改变，right105是否保持活，axis数与time/未完滑行。新source另一A轴可能仅是历史投影，须与真实选择时刻区分；不得把不同时间静态Goal union直接当completed。', '',
 '本助手只固定模型，未调用游戏工具；真实两W由sole owner按root授权执行。finite新规则和派生四边迁移另存同checkpoint，原诊断不静默改physics。', '');
 fs.writeFileSync('scratch/ch2-G-strong98-w-cross2-probe-oct05.md',lines.join('\n'));
}
if(require.main===module){if(process.argv.includes('--write-md'))writeReport();console.log(JSON.stringify(process.argv.includes('--compact')?{sourceEvent,sourceAxis:t.axis,sequence:'WW',firstValid:true,pre:result.first.stable,boundary:{reason:b.boundary,tick:b.tick,state:result.probe.boundary.state,players:result.probe.boundary.players}}:result));}
module.exports={m,result,writeReport};
