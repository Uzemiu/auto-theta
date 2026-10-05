// Fixed source60 -> prefix18 -> one A at the first unmodeled BOX capture.
// Public journal/model only. No search, bridge, UI, save, or canonical writes.
const fs=require('fs'),Module=require('module');
const filename=require.resolve('./ch2-G-m133-source-model-oct05.cjs');
// Diagnostics only: retain already accepted microsteps at a stopped boundary.
// No transition rule changes, and no writes to the live model file.
const code=fs.readFileSync(filename,'utf8').replace(
 'if(r.boundary){boundaries.push({...r,path});return;}',
 'if(r.boundary){boundaries.push({...r,path,acceptedTrace:trace});return;}');
const diagnostic=new Module(filename,module);diagnostic.filename=filename;
diagnostic.paths=module.paths;diagnostic._compile(code,filename);
const j=JSON.parse(fs.readFileSync('artifacts/slot1-playthrough/2-G.json','utf8').replace(/^\uFEFF/,''));
const sourceEvent=259,o=j.events[sourceEvent].observation,m=diagnostic.exports.createModel(o);
const sequence='WWDSSDSAAAWDSAASWDA';
let s=m.start;const checkpoints=[];let earlierFailure=null;
for(let i=0;i<sequence.length-1;i++){
 const r=m.step(s,m.A.indexOf(sequence[i]));
 if(!r.valid||r.forces.length||r.leaves.length!==1){earlierFailure={tailStep:i+1,action:sequence[i],result:r};break;}
 s=r.leaves[0].state;
 checkpoints.push({tailStep:i+1,totalInput:60+i+1,prefix:sequence.slice(0,i+1),activeLeft:m.left(s),stable:m.describe(s),acceptedModelMicrosteps:r.leaves[0].trace.length});
}
const last=earlierFailure?null:m.step(s,m.A.indexOf(sequence.at(-1)));
const result={sourceEvent,sourceFrame:o.frame,realSourceTime:o.level.timelines[0].time,
 sequence,length:sequence.length,preLength:sequence.length-1,earlierFailure,
 checkpoints,pre:m.describe(s),probe:last?{valid:last.valid,forces:last.forces,
 boundaries:last.boundaries.map(b=>({...b,state:m.describe(b.state),
 proposed:b.proposed?m.describe(b.proposed):undefined,
 acceptedTrace:b.acceptedTrace?.map(t=>({...t,state:m.describe(t.state)}))}))}:null,
 scope:'Prefix18 and accepted pre-contact microsteps are fixed ordinary model replay, not actual. Final A stops before propagating capture. No container, height, ghost, split, source, Fork, leaf count, or stable cargo result is invented. Model tick counts are not runtime game time.'};
function writeReport(){
 const pose=p=>`${p.id}:${p.x},${p.y}/${p.face}${p.active?'':` dead(g${p.ghost},m${p.masked})`}`;
 const body=b=>`${b.id}:${b.x},${b.y}/${b.md}/src${b.src}`;
 const boundary=result.probe?.boundaries[0];
 const out=[
 '# 2-G source60 后 19 步普通 BOX 捕获探针（MODEL，尚未实测）','',
 '来源是公开主日志 event259/frame18255298、真实 input60/time81。固定串 `WWDSSDSAAAWDSAASWDA` 共19输入；先执行18步 `WWDSSDSAAAWDSAASWD`，再单 A。程序逐字符生成检查点，不用手写重复字母。',
 '',
 '前18步均模型 valid、单叶、无 force、无未知边界；所有早期微步都按现有 M131/M132 和有限 M133 模型传播。模型微拍数不能当游戏 time。该串不保证通关；第19步在首次 active free 与普通 BOX 同格捕获前停止，捕获后的状态没有模拟。',
 '',
 '| 尾步 / 总输入 | 输入前缀 | 全 PLAYER 稳定位置 / face | BOX 110..118 稳定坐标（按ID） |',
 '| --- | --- | --- | --- |'];
 for(const c of result.checkpoints)out.push(`| ${c.tailStep} / ${c.totalInput} | \`${c.prefix}\` | ${c.stable.p.map(pose).join('; ')} | ${c.stable.b.map(b=>`${b.id}:${b.x},${b.y}`).join('; ')} |`);
 out.push('', '末 A 的 model tick0..5 都已接受，tick6 是停止边界：', '',
 '| 微拍后 / 停止前 | 全 PLAYER | BOX113 | 本拍请求 |','| --- | --- | --- | --- |');
 for(const t of boundary?.acceptedTrace??[])out.push(`| tick${t.tick} 后 | ${t.state.p.map(pose).join('; ')} | ${body(t.state.b.find(b=>b.id===113))} | ${(t.requested??[]).map(r=>`BOX${r.box}/${m.A[r.d]}/src${r.src}/${r.kind}`).join('; ')||'无'} |`);
 if(boundary)out.push(`| tick${boundary.tick} 前 | ${boundary.state.p.map(pose).join('; ')} | ${body(boundary.state.b.find(b=>b.id===113))} | 准备惯性 A |`);
 out.push('',
 '确定的模型几何：第18步后 P106[11,9]/P108[6,7]/P109[3,9] 均活、faceD，右 P105[14,6]/W；P107 已死[8,4]/ghost1。末 A 中，P106 到[10,9]，P108 到[5,7]，P109 到[2,9] 后均停止；BOX113 从[8,9]沿 A 以来源106滑至[3,9]，下一拍进入仍活的 P109[2,9]。其他 BOX：110[8,9]、111[8,5]、112[7,7]、114[2,10]、115[8,6]、116[10,7]、117[8,7]、118[5,10]。tick6拟移动后的BOX113[2,9]因背墙[1,9]停止；这里只有拟位移，未传播同格捕获。',
 '',
  '实际要判别：P109 是否 active/contained，container 是否113、height 如何分配、ghost/split/maskedoff 是否变化、BOX113 是否仍整体有效，以及 P106/P108/右105 是否保留。输入源所有人 Fork0/key0；本关没有新增叉/钥匙，所以不预写捕获后的 Fork、container、height、movingsrc/movingsrcext 或叶数。新 cargo 的 source、后续操控与光路收益须读真实属性。',
  '',
  'M038已证叉0箱内人方向输入只改face，不自行移动container，X无效；M095已证被外部争推的载人箱在两轴都保passive cargo。若本探针捕获成立，必须分别记录两名外部free来源与一名passive cargo，不能把三名active左人当三名可推动箱的functional source。普通域当前m.left仅因全uncontained才等于free数，不能沿用到新cargo状态。多层、occupied捕获、同拍新来源及后续释放仍不在本探针模型里。',
  '',
  '额外固定交叉核：M131原来源模型、M132窄清理模型和M133当前模型从同259源逐18步stable state全字段一致（differentStableSteps=[]）；末19A均在tick6/new-capture、完全相同边界前态停止。因此该前置不依赖新M133旋转腾格假设，仍须由唯一owner实际验证捕获。',
  '',
  '最少区分探针是上述18步正常部署后单 A。按快速公开稳定/动画帧观察 tick6 接触，而不是依据拟合图授 cargo 资源。脚本只固定重放；没有新搜索、游戏调用或 canonical 写入。',
 '');
 fs.writeFileSync('scratch/ch2-G-m133-capture19-probe-oct05.md',out.join('\n'));
}
if(require.main===module){
 if(process.argv.includes('--write-md'))writeReport();
 const boundary=result.probe?.boundaries[0];
 console.log(JSON.stringify(process.argv.includes('--compact')?{sequence,length:sequence.length,earlierFailure,pre:result.pre,probeBoundary:boundary?{boundary:boundary.boundary,tick:boundary.tick,state:boundary.state,proposed:boundary.proposed}:null,report:'scratch/ch2-G-m133-capture19-probe-oct05.md'}:result,null,2));
}
module.exports={m,result};
