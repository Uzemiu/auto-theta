// Fixed, public actual98 axis0 -> 13 normal inputs -> single W boundary.
// No search, game/bridge/UI calls or canonical writes; require is read-only.
const fs=require('fs'),Module=require('module');
const filename=require.resolve('./ch2-G-m132-blocked-source-model-oct05.cjs');
const original=fs.readFileSync(filename,'utf8');
const find='if(r.boundary){boundaries.push({...r,path});return;}';
if(!original.includes(find))throw Error('Diagnostic trace hook not found');
const diag=new Module(filename,module);diag.filename=filename;diag.paths=module.paths;
diag._compile(original.replace(find,'if(r.boundary){boundaries.push({...r,path,acceptedTrace:trace});return;}'),filename);
const j=JSON.parse(fs.readFileSync('artifacts/slot1-playthrough/2-G.json','utf8').replace(/^\uFEFF/,''));
const sourceEvent=459,o=j.events[sourceEvent].observation;
const t=o.level.timelines.find(t=>t.axis[0]===0&&t.entities.find(e=>e.id===106)?.active&&!t.entities.find(e=>e.id===109)?.active);
if(!t||t.time!==160)throw Error('Actual98 A/106 axis0 source absent');
const m=diag.exports.createModel(o,t),sequence='SDSAWWDSSWWSDW';
const root=require('./ch2-G-strong38-second-forces-oct05.cjs');
const expected=root.deployed.states.find(l=>l.choices[0]===106).state;
const canon=s=>JSON.stringify({p:[...s.p].sort((a,b)=>a.id-b.id),b:[...s.b].sort((a,b)=>a.id-b.id)});
if(canon(m.start)!==canon(expected))throw Error('Actual98 differs from MODEL strong38 A leaf');
let s=m.start;const checkpoints=[];let earlierFailure=null;
for(let i=0;i<sequence.length-1;i++){
 const r=m.step(s,m.A.indexOf(sequence[i]));
 if(!r.valid||r.forces.length||r.leaves.length!==1){earlierFailure={tailStep:i+1,result:r};break;}
 s=r.leaves[0].state;
 checkpoints.push({tailStep:i+1,totalInput:98+i+1,prefix:sequence.slice(0,i+1),stable:m.describe(s),acceptedModelMicrosteps:r.leaves[0].trace.length});
}
if(earlierFailure)throw Error('Prefix13 unexpectedly crosses unknown');
const last=m.step(s,m.A.indexOf(sequence.at(-1))),b=last.boundaries[0];
if(last.valid||last.forces.length||b?.boundary!=='perpendicular-free-box'||b.tick!==5||b.box!==115||b.player!==108)throw Error('Expected unique unmodeled contact differs');
const terrain=new Map(t.tiles.map(e=>[e.pos.join(','),e.type]));
for(const e of t.entities)if(e.floor&&!terrain.has(e.pos.join(',')))terrain.set(e.pos.join(','),e.type);
const walls=new Set(t.entities.filter(e=>e.active&&e.type!=='BOX'&&e.blockable).map(e=>e.pos.join(',')));
const cells=[[6,9],[6,10],[5,10],[4,10],[6,11]].map(pos=>({pos,terrain:terrain.get(pos.join(','))??null,wall:walls.has(pos.join(',')),box:b.state.b.find(e=>e.x===pos[0]&&e.y===pos[1])?.id??null,activePlayer:b.state.p.find(e=>e.active&&e.x===pos[0]&&e.y===pos[1])?.id??null}));
const result={sourceEvent,sourceFrame:o.frame,sourceAxis:t.axis,realSourceInput:98,realSourceTime:t.time,
 rawParent38:root.raw38,parentIndex:root.parentIndex,choice:106,sequence,length:sequence.length,
 sourceMatches:true,earlierFailure,checkpoints,pre:m.describe(s),cells,
 probe:{valid:last.valid,forces:last.forces,boundaries:last.boundaries.map(z=>({...z,state:m.describe(z.state),acceptedTrace:z.acceptedTrace?.map(q=>({...q,state:m.describe(q.state)}))}))},
 scope:'Actual98 source. Legacy M132 diagnostics stop before the chain-perpendicular contact; actual112 now directly proves no force and old A chain vacating. New finite propagation/calibration is in the one-front-chain clone, not silently added here. Model ticks are not game time.'};
function writeReport(){
 const pose=p=>`${p.id}:${p.x},${p.y}/${p.face}${p.active?'':` inactive(g${p.ghost},m${p.masked})`}`;
 const body=e=>`${e.id}:${e.x},${e.y}/${e.md}/src${e.src}`;
 const lines=['# 2-G actual98 A轴：14步有链滑箱正交接触探针','',
 'ACTUAL112已闭：489/time206→490/time207 rear115由6,10向A移5,10停止、stationary front111由5,10移4,10/A/src106；108由6,9/W进入旧6,10并续滑，无force/新轴/cargo。491/time208提前清front111(3,10)的blocked-two-Box终止运动，1086,11刺死；493/frame19411322稳定A仅105活，W轴仍原459整字典。root/owner完整实际audit见MD，新的finite clone校37公开props帧全match。下列原M132诊断停止记录保历史，不把已实测末W称未执行。', '',
 '实际源：主`2-G.json` event459/frame19330256，axis[0,0,0]/id119、真实98输入/time160。106[10,10]/A与108[5,5]/W活，109[2,8]/W inactive/masked1/ghost0；right105[14,10]/W活，107旧ghost1。九箱active/h1/uncontained。source p/b逐ID所有模型字段与raw38的106/A叶完全相同；GMID实例分配与模型无关。', '',
 '完整叶内串由程序固定为`'+sequence+'`（14），prefix13已真实111核对，末W已实际112。此脚本只保legacy M132的停止诊断；新的物理传播与37帧校准在独立finite clone，不改原模型。脚本只读/固定、不search，require无写入。', '',
 '| 叶内步/总有效输入 | 精确前缀 | 所有PLAYER稳定态 | BOX110..118坐标（ID） |',
 '|---|---|---|---|'];
 for(const c of checkpoints)lines.push(`| ${c.tailStep}/${c.totalInput} | \`${c.prefix}\` | ${c.stable.p.map(pose).join('; ')} | ${c.stable.b.map(e=>`${e.id}:${e.x},${e.y}`).join('; ')} |`);
 lines.push('', '末单W已接受的MODEL微拍0..4与tick5停止前完整字段：', '',
 '| 微拍 | 所有PLAYER | 所有BOX | 本拍requests |','|---|---|---|---|');
 for(const q of result.probe.boundaries[0].acceptedTrace)lines.push(`| tick${q.tick}后 | ${q.state.p.map(pose).join('; ')} | ${q.state.b.map(body).join('; ')} | ${(q.requested??[]).map(r=>`BOX${r.box}/${m.A[r.d]}/src${r.src}/${r.kind}`).join('; ')||'无'} |`);
 lines.push(`| tick${b.tick}前（unknown，不传播） | ${m.describe(b.state).p.map(pose).join('; ')} | ${m.describe(b.state).b.map(body).join('; ')} | 新W接触尚未结算 |`, '',
 '唯一关键窗口：108[6,9]/W/movingdir1/src108朝北进入115旧格[6,10]；115[6,10]/A/movingdir3/src106已向西滑。经理106已[8,10]SPIKE ghost1死亡，但BOX115仍保留src106；不能将来源改匿名。旧A方向的下一5,10有BOX111，后方4,10是合法empty ICE，故旧A的双BOX链几何能移动；新W方向6,11为合法empty SPIKE。这里同一目标115有两条几何合法方向，但尚未证明实际是让旧A链腾格、取消滑行、给108新W推力或形成分线。', '',
 '| 关键格 | terrain | Wall覆盖 | 当拍BOX | active PLAYER |','|---|---|---|---|');
 for(const z of cells)lines.push(`| ${z.pos.join(',')} | ${z.terrain??'missing'} | ${z.wall} | ${z.box??'-'} | ${z.activePlayer??'-'} |`);
 lines.push('', '旧链的条件request清单仅是几何分析：若惯性A继续，应向115、111请求A/src106（最终111到4,10）；若108能重新北推115，应向115请求W/src108（目的6,11）。并未在私有模型里新增这些request或传播force。BOX111在5,10自身目前stop/src-1，后续是否继承106由实际帧判别。BOX118仍2,10/stop，旧1141,10/stop；没有偷换它们为本链来源。', '',
 'M133已证的目的格empty、独立单箱腾格不覆盖本例，因为5,10已被111占据。M131证明惯性来源保留，但未授予“任何滑箱正交接触均分线”。最后W必须正常实机采样，尤其115与111各帧pos/movingdir/movingsrc/movingsrcext；108/106的active/ghost/maskedoff；109旧mask保持；所有container/contained/height/split/key；time/axis数与选择后的未完滑行、9BOX是否仍active；right105应逐叶核活并记录位置face。不要预写winner、axis、箱cargo或稳定人数。', '',
 '前13模型稳定14entity按原具体ID保留，实际字段需owner逐批独立核；建议批4/4/4/1再唯一W由root授权，ICE receipt未执行后缀只按真实remaining续。MODEL微拍数不是runtime时间。当前仅输出后续候选，不游戏调用、不新每步JSON、不改存档或canonical。', '');
 fs.writeFileSync('scratch/ch2-G-strong98-a-perp14-probe-oct05.md',lines.join('\n'));
}
if(require.main===module){if(process.argv.includes('--write-md'))writeReport();console.log(JSON.stringify(process.argv.includes('--compact')?{sourceEvent,sourceFrame:o.frame,sourceAxis:t.axis,sequence,length:sequence.length,sourceMatches:true,prefix13valid:true,pre:result.pre,cells,boundary:{reason:b.boundary,tick:b.tick,state:m.describe(b.state)},report:'scratch/ch2-G-strong98-a-perp14-probe-oct05.md'}:result));}
module.exports={m,result,writeReport};
