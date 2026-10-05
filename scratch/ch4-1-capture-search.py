import json,sys
from collections import deque
from pathlib import Path
sys.path.insert(0,str(Path(__file__).resolve().parent.parent))
from theta import Bridge
s=Bridge().call('state');t=s['level']['timelines'][0]
es=t['entities']+t['tiles'];wall={tuple(e['pos']) for e in es if e.get('blockable') and not e.get('pushable')};spike={tuple(e['pos']) for e in es if e['type']=='SPIKE'}
vec=((0,1),(-1,0),(0,-1),(1,0));chars='WASD'
start=(tuple(sorted(tuple(e['pos']) for e in es if e['type']=='PLAYER' and e['active'])),tuple(next(e['pos'] for e in es if e['type']=='BOX')))
def add(p,v):return p[0]+v[0],p[1]+v[1]
def step(state,a):
 ps,b=state;out=[];push=[]
 for p in ps:
  moved=False
  for d in range(4):
   v=vec[(a+d)%4];dest=add(p,v)
   if dest in wall:continue
   if dest==b:
    bb=add(b,v)
    if bb in wall:continue
    push.append(bb)
   out.append(dest);moved=True;break
  if not moved:out.append(p)
 if len(set(push))>1:return None
 bb=push[0] if push else b
 alive=tuple(sorted(set(p for p in out if p not in spike or p==bb)))
 captured=bb in alive
 return (alive,bb),captured
q=deque([(start,'')]);seen={start}
while q and len(seen)<150000:
 st,path=q.popleft()
 for a in range(4):
  rr=step(st,a)
  if rr is None:continue
  ss,cap=rr
  if cap and len(ss[0])==3 and 2<=ss[1][0]<=6 and 2<=ss[1][1]<=5:
   print('candidate',path+chars[a],ss,'states',len(seen));quit()
  if ss not in seen and ss[0]:seen.add(ss);q.append((ss,path+chars[a]))
print('no candidate',len(seen),len(q))
