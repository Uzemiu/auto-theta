// Fixed raw checkpoint strong hit. Requiring this module only reads public
// journal/model and replays the 38 inputs; no writes, search, or game calls.
const fs=require('fs'),{createModel}=require('./ch2-G-m133-source-model-oct05.cjs');
const j=JSON.parse(fs.readFileSync('artifacts/slot1-playthrough/2-G.json','utf8').replace(/^\uFEFF/,''));
const sourceEvent=259,o=j.events[sourceEvent].observation,m=createModel(o);
const sequence='DDAWDWAASSWDDASSDSAADAWWWDWADSDAWDWADW';
if(sequence.length!==38)throw Error('Raw strong hit length mismatch');
let state=m.start;const checkpoints=[];let earlierFailure=null;
for(let i=0;i<sequence.length-1;i++){
 const r=m.step(state,m.A.indexOf(sequence[i]));
 if(!r.valid||r.leaves.length!==1||r.forces.length){earlierFailure={step:i+1,action:sequence[i],result:r};break;}
 state=r.leaves[0].state;
 if((i+1)%4===0||i>=sequence.length-5)checkpoints.push({tailStep:i+1,totalInput:60+i+1,prefix:sequence.slice(0,i+1),state:m.describe(state)});
}
const final=earlierFailure?null:m.step(state,m.A.indexOf(sequence.at(-1)));
const result={sourceEvent,sourceFrame:o.frame,realSourceTime:o.level.timelines[0].time,
 sequence,length:sequence.length,groups:sequence.match(/.{1,4}/g),preLength:37,
 allEarlierAccepted:!earlierFailure,earlierFailure,checkpoints,pre:m.describe(state),
 final:final?{valid:final.valid,forces:final.forces,boundaries:final.boundaries,
 leaves:final.leaves.map(l=>({choices:l.choices,freeCount:m.left(l.state),stable:m.describe(l.state),trace:l.trace}))}:null,
 scope:'MODEL strong first-force resource, not actual/4Goal. All actors are uncontained in this ordinary seed and result, so active-left count equals free count here. Runtime time and numeric axes must come from actual journal; model trace ticks are not game time.'};
function writeReport(){
 const pose=p=>`${p.id}:${p.x},${p.y}/${p.face}${p.active?'':` inactive(g${p.ghost},mask${p.masked})`}`;
 const body=b=>`${b.id}:${b.x},${b.y}/${b.md}/src${b.src}`;
 const lines=['# 2-G strong38：两初叶均保两名free（ACTUAL98闭环，未完成Goal）','',
 '实际98证据：主459/frame19330256两稳定轴time160；axis0为106/A胜、axis1为109/W胜，各保right105及两free，9BOX active/h1/uncontained。root MCP19341000/owner audit核14entity全字典除新axis1 GMID562..575分配外diff=[]，累计112Undo0retry、118/6/link3不变。下述固定微拍与表为当时MODEL历史，不再是末W待测；实际时间与数值轴取主日志，不由MODEL推算。', '',
 '来源：真实source60 event259/frame18255298/time81，公开350复原与其完整14实体字典相同。原同frontier raw38 `'+sequence+'`，长38；前37 `'+sequence.slice(0,-1)+'`，再唯一 W。程序分组 `'+result.groups.join(' | ')+'`。这只是首force的强资源，尚未四Goal完成。',
 '',
 '唯一次 checkpoint 的 raw hit 已完整核：expanded1644263/seen2274033/pending672204，q2336049/done1644263，depthLimit60/depthCut0/deferred0/maxDepth51，forces1221/maxLeaves3，priority100、strong policy，历史C87 hit1/命中父余动作补完1。原TTY1311因真正strong命中保存后exit0，未EOF丢队列；只读audit37887/24752也exit0。parent2266949/depth37，sourceMatches=true，全部37 concrete ancestor逐ID/face/active/ghost/mask/md/src固定全match、firstMismatch=null。没有root重跑；唯一ignored恢复文件仍完整保留。命中父末W后的A/S/D尚未展开，若以后继续该第一force队列必须补回，不把命中当已全展开。',
 '',
 '前37均单叶、no force/no unknown。M131原来源模型和M132窄清理模型分别固定38也全部valid，前37稳定state与最终两叶逐字段均同当前M133。因此本串不依赖新增M133腾格旋转假设。模型microtick计数不授game time、数组叶序不授actual numeric axis。',
 '', '| 尾步/总输入 | 完整前缀 | PLAYER稳定坐标/face | 九BOX稳定坐标（按ID） |','| --- | --- | --- | --- |'];
 for(const c of result.checkpoints)lines.push(`| ${c.tailStep}/${c.totalInput} | \`${c.prefix}\` | ${c.state.p.map(pose).join('; ')} | ${c.state.b.map(b=>`${b.id}:${b.x},${b.y}`).join('; ')} |`);
 lines.push('', '末W全部模型微拍（每叶重放到稳定，不冒充实际动画）：');
 for(const l of result.final.leaves){
  lines.push('',`## 胜者来源 ${l.choices.join(',')}，最终free${l.freeCount}`,'',
   '| 微拍后 | PLAYER | 九BOX（md/src） | 请求 |','| --- | --- | --- | --- |');
  for(const t of l.trace){const d=m.describe(t.state);lines.push(`| tick${t.tick} | ${d.p.map(pose).join('; ')} | ${d.b.map(body).join('; ')} | ${(t.requested??[]).map(r=>`BOX${r.box}/${m.A[r.d]}/src${r.src}/${r.kind}`).join('; ')||'无'} |`);}
 }
 lines.push('',
  '唯一force在tick6：BOX114[2,10]收到109的W/player（连113+114竖链）与106的A/inertia（118撞114横链）。新rearBOX115预置[10,10]，106最后W遇顶墙转A，推115后自己停[10,10]ICE；115先到[9,10]再撞front110[8,10]，115停[8,10]SPIKE、110保106/A滑行并传给118。所以106在分线前仍活，区别旧C87的106落[8,10]刺死。这是完整模型可达串，不依赖只有一个BOX可自动穿SPIKE的假设。',
  '',
  'W/109胜：108[5,5]/W、109[2,9]/W活，106[10,10]/A inactive/mask1/ghost0；A/106胜：106[10,10]/A、108[5,5]/W活，109[2,8]/W inactive/mask1/ghost0。两叶105[14,10]/W活，107[8,4]旧ghost死。全部九BOX活、单层uncontained，所有人Fork0/key0，无cargo。共用BOX110[5,11]、111[5,10]、112[8,7]、115[8,10]、116[8,5]、117[8,9]；W余113[2,10]/114[2,11]/118[3,10]；A余113[2,9]/114[1,10]/118[2,10]。全稳定md0/src-1。',
  '',
  '下一阶段尚缺：按M027/M039，方向只推进当前世界线，各分支可独立采用不同输入/时间；不要求共同后续串、同time或同步推进。从真实两初叶各2free资源分别继续合法第二次force，得到四right观察者叶，再各自分配Goal14,4/6/8/10，并以正常T与公开time核投影/实际完成。不能只拿两个模型末态当四Goal完成。后续派生key须保right105相位与具体父叶provenance，实际后由root授权；第一force原队列/history/parent余动作保持，不自动注入passive cargo或重建原根。',
  '',
  '固定probe可require，只有公开journal/model读取与固定计算，零write/search/game side-effect；只有显式CLI --write-md写这份私有报告。', '');
 fs.writeFileSync('scratch/ch2-G-m133-two-leaf-two-free-probe-oct05.md',lines.join('\n'));
}
if(require.main===module){
 if(process.argv.includes('--write-md')){writeReport();console.log(JSON.stringify({sequence,length:38,report:'scratch/ch2-G-m133-two-leaf-two-free-probe-oct05.md',valid:result.final.valid,freeCounts:result.final.leaves.map(l=>l.freeCount)}));}
 else console.log(JSON.stringify(result,null,2));
}
module.exports={m,result,sequence,source: m.start,pre:state,final,writeReport};
