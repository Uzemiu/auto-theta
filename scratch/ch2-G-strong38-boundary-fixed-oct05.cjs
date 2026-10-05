// Fixed diagnostics of already-expanded derived nodes. No new queue/search.
// Public journals and private observation models only; no game/bridge calls.
const fs=require('fs');
const d=require('./ch2-G-strong38-second-forces-oct05.cjs');
const {createModel}=require('./ch2-G-m133-source-model-oct05.cjs');
const j=JSON.parse(fs.readFileSync('artifacts/slot1-playthrough/2-G.json','utf8').replace(/^\uFEFF/,''));
const m133=createModel(j.events[259].observation);
d.load();
function path(g,n){let s='';for(;n>0;n=g.q[n].parent)s=g.q[n].a+s;return s;}
function light(r,m){return {valid:r.valid,step:r.step,forces:r.states?.flatMap(l=>l.choices),
 boundaries:r.boundaries?.map(b=>({reason:b.boundary,tick:b.tick,box:b.box,player:b.player,players:b.players,state:m.describe(b.state)})),
 final:r.states?.map(l=>({choices:l.choices,left:m.left(l.state),state:m.describe(l.state)}))};}
const rows=[];
for(const g of d.getGroups())for(const n of g.done)for(let a=0;a<4;a++){
 const node=g.q[n],r=d.m.step(node.s,a);if(r.valid)continue;
 const sequence=path(g,n)+d.m.A[a];
 for(const b of r.boundaries){
  if(!['unverified-player-cross','perpendicular-free-box','new-capture'].includes(b.boundary))continue;
  const pre=d.m.replay(sequence.slice(0,-1),g.source);
  if(!pre.valid||pre.states.length!==1)throw Error('Boundary ancestor replay differs');
  if(JSON.stringify(pre.states[0].state)!==JSON.stringify(node.s))throw Error('Boundary concrete state differs');
  const fixed=d.m.replay(sequence,g.source),f133=m133.replay(sequence,g.source);
  rows.push({choice:g.choice,parent:n,sequence,length:sequence.length,kind:b.boundary,
   pre:d.m.describe(node.s),boundary:b,m132:light(fixed,d.m),m133:light(f133,m133)});
 }
}
rows.sort((a,b)=>a.length-b.length||a.choice-b.choice||a.sequence.localeCompare(b.sequence));
const result={source:'MODEL raw38 children, conservative derived completed queues; fixed diagnostics only',
 queues:d.getGroups().map(d.snapshot),windows:rows};
function writeReport(){
 const lines=[
 '# 2-G strong38：第二次分线的两个派生普通域',
 '',
 '当前结论：初次strong38已真实98闭环（主459/frame19330256），axis0=106/A、axis1=109/W，两轴time160/各保right105及两free。root/owner完整14entity字典除新GMID实例分配外diff=[]。本报告第二次force队列仍为MODEL。普通保守M132派生域已真正穷尽，未发现第二次force；此结论只限下列规则，未知转移被保留，不能据此断言关卡无解。axis0有链perp14的固定前13+末单W详见strong98-a-perp14报告，实际后续结果尚未验证。',
 '',
 '`source60`取主`2-G.json` event259（恢复350/418与其整体实体字典一致）；完整38尾为`'+d.raw38+'`，父索引2266949。两派生源分别是同一末W选择109/W与106/A后的具体叶。M027/M039允许两叶独立方向序列与时间，无共同串要求；right105坐标及face均进入稳定去重键。',
 '',
 '唯一原source60巨checkpoint/q/history完全未修改。派生TTY64290保留两个队列，单文件`artifacts/solver-frontiers/ch2-G-strong38-second-forces-oct05.v8`仅为ignored计算恢复数据，不是游戏证据。',
 '',
 '| MODEL初次胜者 | expanded/seen | pending/done | 最大深度 | depthCut/deferred | 稳定少于2free剪枝 | 二次force | 未知转移 |',
 '|---|---:|---:|---:|---:|---:|---:|---|'
 ];
 for(const g of result.queues)lines.push('| '+g.choice+' | '+g.expanded+'/'+g.seen+' | '+g.pending+'/'+g.done+' | '+g.maxDepth+' | '+g.depthCut+'/'+g.depthDeferred+' | '+g.lost+' | '+g.forces+' | '+Object.entries(g.historicalBoundaryCounts||g.boundaryCounts||{}).map(([k,v])=>k+':'+v).join('; ')+' |');
 lines.push('', '初始200000/叶是一次汇报窗口，实际两个heap均先耗尽，深度上限60没有切掉任何节点。只允许普通无cargo、无新stack、无新分裂/物品/DARK规则；稳定少于两个free仅在这个域中无法再提供不同活源force。非目标capture没有被当作失败的全局证明，实际M038被动cargo需要另一个明确模型域。', '',
 '## 程序生成的所有边界串（非新搜索）', '',
 '`ch2-G-strong38-boundary-fixed-oct05.cjs`从保留derived checkpoint逐done parent/action固定重算，11个窗口的concrete祖先均与原队列完整p/b一致；没有新入队或改变checkpoint。默认只输出，`--write-md`只更新本私有报告。', '',
 '| 初次胜者 | 叶内完整尾 | 首边界微拍 | 类型 | M133同串 |',
 '|---|---|---:|---|---|');
 for(const r of rows)lines.push('| '+r.choice+' | `'+r.sequence+'` | '+r.boundary.tick+' | '+r.kind+' | '+(r.m133.valid?'valid':'仍停止')+' |');
 lines.push('', '终端自动折行的早期口述`WWW`已撤回，程序生成最短W叶窗口为`WW`，两输入。不能手抄折行文本代替parent完整固定核。', '',
 '## W/109叶：一moving、一stopped、方向正交的相遇', '',
 '最短`WW`第二W首边界tick6：108沿row9向A，因1,9真Wall停在ICE2,9，faceA/mdstop；109从2,8朝W滑入2,9，faceW/mdW/src109。两个free在末输入前都活，right105继承且活。M045仅支持同face的一动一停；4-18的M036补证是两个moving正交交汇。本例不满足二者原始精确条件，仍为`unverified-player-cross`。后续是否融合/越过/停止必须实机或另证，未把unknown改为通用放行。', '',
 '## A/106叶：perpendicular free与Box链', '',
 '最短`SDSAWWDSSWWSDW`末W tick5：108在ICE6,9朝W，Box115在ICE6,10朝A、src106。115的西向下一5,10已被Box111占据，因而不满足M133“Box独立惯性目的格empty”的条件。更早经理106已踩8,10SPIKE死亡，虽然Box115仍保留src106。不把死源惯性等同匿名来源，也不据此自动授予force；有Box链接触时的腾格/停止/重新争推尚未在这个fixture验证。其他三个perp窗口仍同范围拒绝。', '',
 '## A/106叶：首capture边界', '',
 '最短`SDSAWWDSSASAWWA`末A tick5：Box117由4,9/A/src106到108已停的3,9；106此前已8,9死亡。模型停止在装箱前，未伪造container/height/ghost后态。若此结构类似实际79的一层活人捕获，108是被动cargoF0（M038），不能再当独立推动来源。本报告没有把它加入普通无cargo去重。', '',
 '下一动作需先按真实98轴/稳定fields校准两source，再由root选择有价值的未知fixture或继续原source60保留frontier。以上队列不需要增加cap：pending=0；未经新机制不能用更大预算改变这些固定图。未新增每步JSON、canonical条目或游戏输入。', '');
 fs.writeFileSync('scratch/ch2-G-strong38-second-forces-oct05.md',lines.join('\n'));
}
if(require.main===module){if(process.argv.includes('--write-md'))writeReport();console.log(JSON.stringify(result));}
module.exports={result};
