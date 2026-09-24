import json
from pathlib import Path

root=Path(__file__).resolve().parents[1]
def read(path):return json.loads((root/path).read_text(encoding='utf-8-sig'))
def write(path,obj):(root/path).write_text(json.dumps(obj,ensure_ascii=False,indent=2)+'\n',encoding='utf-8')
def append(path,text):
 p=root/path;p.write_text(p.read_text(encoding='utf-8-sig').rstrip()+'\n\n'+text.strip()+'\n',encoding='utf-8')

append('knowledge/mechanics.md','''### M044 一次分裂同时触发两个箱的冲突，产生四条双人世界线（2-25）

箱保持[4,5]/[9,10]，两名持fork1角色分别位于[9,5]朝上、[4,10]朝右。单X后，两组新生角色滑向两箱，同时产生左/下与上/右两组冲突；实际得到四条各两名active角色的线。四种箱组合分别为：左箱[2,5]或[4,3]，上箱[9,11]或[10,10]。未选中线的中途滑行需切线后继续，不能用初始未稳定坐标替代。

每线将左箱再向左或向下推一次，推者落刺淘汰而箱停按钮[1,5]或[4,2]，留下单人抵达对应目标。实测配对：[9,11]开[11,4]/[13,4]；[10,10]开[12,11]/[14,11]；[1,5]开[11,5]/[12,10]；[4,2]开[13,5]/[14,10]。四叶目标分别[11,7]/[12,8]/[13,7]/[14,8]。证据：[2-25](../artifacts/slot1-playthrough/2-25.json)。这是同输入双冲突的四种实际结果，不证明任意多箱冲突都按独立组合生成。
''')
append('knowledge/mechanics.md','''### M045 滑行途中与已停止角色同格不一定合并（2-21、2-13）

2-21第19输入后，玩家178[9,7]、183[10,7]，箱[17,7]。单S因下墙转右滑，稳定后玩家178[18,7]、183[17,7]，均face3且active、contained0，箱[19,7]。最终队形支持后方滑行者经过先停者后继续推箱；没有逐帧采样整个经过过程，不能断言所有内部结算顺序。第29输入D的实际回执另直接捕获两人同时在[24,8]；等稳定后分处[24,8]/[24,9]，两人仍保留。

2-13第31输入后玩家58[9,1]、59[8,1]，箱[3,1]。单A稳定后玩家58[2,1]、59[3,1]，均face1/contained0，箱[1,1]。再6W D分别抵达[2,6]/[1,6]完成。两次均否定“每个微步同格同朝向就立刻合并”的模型；结合M041，双方都停止时合并的模型能复现本次成功路线，但仍不是穷尽机制证明。证据：[2-21](../artifacts/slot1-playthrough/2-21.json)、[2-13](../artifacts/slot1-playthrough/2-13.json)。
''')
append('knowledge/solutions/2-25.md','''关键构造：保留两箱原位，双叉分为两名各fork1角色，布置到[9,5]朝上与[4,10]朝右。单X让两个箱同时受到各自的异向推力，直接得到四条双人线。每线再用一名推者把左箱压到按钮，推者落刺而另一人通过该线打开的门到目标。先单独断裂上箱的初次试验已保留，正常retry后改用同步双冲突。对应机制见M044；撤销/重试数字覆盖整个记录，不代表成功串中重复执行。''')
append('knowledge/solutions/2-21.md','''关键构造：先保留中、下车道箱子原位，用上道单箱把两人排成[17,8]/[18,8]列队，通过两门取得第一叉。右侧[24,8]冰点转队形，形成三人；再利用中道双箱形成[16..18,5]列队过三门。下道三箱同理形成四人列队，取最后一叉后五人从顶部返回左侧五目标。第20输入S与第29输入D验证滑行途中重叠不立刻合并，见M045。成功这次重进后的164输入未撤销/重试；文首撤销数包含早先失败试验。''')
append('knowledge/solutions/2-13.md','''关键构造：先把箱移到[3,1]，经上方通道把两人重新送到右侧，并排列[9,1]/[8,1]。第32输入A依次经过冰道按钮和门，先后推同一箱，最终箱[1,1]、双人[2,1]/[3,1]，没有装箱；再6W D完成。见M045。文首20次撤销来自整个历史试验记录，本次重进后的39输入未撤销/重试；早先装箱事实仍保留在M038与原始记录。''')

p=read('knowledge/progress.json')
loc={'scene':'2-0','level_id':'Chapter2','world':True,'player_position':[3,6],'observed_on':'2026-09-23','busy':False,'input_locked':False,'paused':False,'dialog':False,'evidence_file':'../artifacts/slot1-playthrough/chapter2-world.json'}
p['updated_on']='2026-09-23';p['last_observed_location']=loc;p['active_playthrough']['last_observed_location']=loc
write('knowledge/progress.json',p)

save=json.loads(Path(r'C:\Users\Administrator\AppData\LocalLow\DeltaTheta\Theta and Paralldox on Worldlines\SaveSlot1.es3').read_text(encoding='utf-8-sig'))['PersistenceData']['value']
for label,lid in [('2-13','icecart'),('2-21','train1'),('2-22','life'),('2-23','world'),('2-24','wings'),('2-25','square')]:
 r=read(f'artifacts/slot1-playthrough/{label}.json')
 r['phase_end_save_check']={'read_only':True,'save_slot':1,'accomplishLevelCount':save['accomplishLevelCount'],'level_id':lid,'level_state':save['LevelStates'].get(lid),'observed_on':'2026-09-23'}
 write(f'artifacts/slot1-playthrough/{label}.json',r)
print('save',save['accomplishLevelCount'],save.get('CurWorld'),save.get('Counters'))
