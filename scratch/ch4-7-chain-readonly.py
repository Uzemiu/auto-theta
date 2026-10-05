"""Read-only planning from a hypothetical, not yet verified X checkpoint.
No Bridge, process, game input, save edits or hidden implementation access.
Upper cargo must stay4,6; lower cargo starts3,5; two free2,4/1,3.
ICE player microsteps follow observed M033-M035; box-on-ICE excluded.
All candidates require live verification, including initial X.
"""
import json,sys
from pathlib import Path
from collections import deque
d=json.loads(Path('artifacts/slot1-playthrough/4-7.json').read_text(encoding='utf-8'))
t=d['initial']['level']['timelines'][0]
es=t['entities']+t.get('tiles',[])
walls={tuple(e['pos']) for e in es if e['class']=='Wall'}
spikes={tuple(e['pos']) for e in es if e['type']=='SPIKE'}
ice={tuple(e['pos']) for e in es if e['type']=='ICE'}
floor={tuple(e['pos']) for e in es if e.get('floor')}
dirs={'W':(0,1),'A':(-1,0),'S':(0,-1),'D':(1,0)}
left={'W':'A','A':'S','S':'D','D':'W'}
def add(p,a):v=dirs[a];return p[0]+v[0],p[1]+v[1]
def blocked(p):return p in walls or p not in floor
# State: lower cargo position, sorted free positions. Upper cargo fixed4,6.
start=((3,5),((1,3),(2,4)))
def step(s,a):
 low,ps=s; bs=[(4,6),low]; ps=list(ps);moving={i:a for i in range(len(ps))}
 for micro in range(5):
  plans={};pushes=[]
  for i,di in moving.items():
   p=ps[i];valid=False;chain=[]
   for turns in range(4 if micro==0 else 1):
    q=add(p,di);chain=[];at=q
    while at in bs:chain.append(bs.index(at));at=add(at,di)
    if not blocked(q) and not blocked(at):valid=True;break
    di=left[di]
   if not valid:plans[i]=(p,di,[]);continue
   if 0 in chain:return None # upper box cannot move before ready
   plans[i]=(q,di,chain)
   if chain:pushes.append(di)
  if len(set(pushes))>1:return None
  if pushes:bs[1]=add(bs[1],pushes[0])
  if bs[1] in ice:return None # unmodeled cargo sliding intentionally excluded
  nxt={}
  for i,(q,di,chain) in plans.items():
   ps[i]=q
   if q in spikes:ps[i]=None
   elif q in bs:ps[i]=None # cargo capture removes an external pusher
   elif q in ice and not chain:nxt[i]=di
  # Two free merging conservatively removes later index.
  seen=set()
  for i,p in enumerate(ps):
   if p is not None:
    if p in seen:ps[i]=None;nxt.pop(i,None)
    else:seen.add(p)
  moving={i:di for i,di in nxt.items() if ps[i] is not None}
  if not moving:break
 if not any(p is not None for p in ps):return None
 return bs[1],tuple(sorted(p for p in ps if p is not None))
def replay(path):
 s=start;print('START',s)
 for i,a in enumerate(path,1):
  s=step(s,a);print(i,a,s)
  if s is None:return
 return s
if len(sys.argv)>1 and sys.argv[1]=='replay':replay(sys.argv[2]);sys.exit()
q=deque([(start,'')]);seen={start};count=0
while q and count<150000:
 s,p=q.popleft();count+=1
 if s[0]==(5,6) and (3,6) in s[1]:print('CANDIDATE',p+'DD','preDD',s,'expanded',count,'seen',len(seen));replay(p);break
 if len(p)>=70:continue
 for a in dirs:
  n=step(s,a)
  if n is None or n in seen:continue
  seen.add(n);q.append((n,p+a))
else:print('BOUNDED_END',count,'seen',len(seen),'frontier',len(q))
