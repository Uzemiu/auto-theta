import json,collections,sys
J=json.load(open('artifacts/slot1-playthrough/2-17.json',encoding='utf-8-sig'))
T=J['initial']['level']['timelines'][0]
walls={tuple(e['pos']) for e in T['entities'] if e['type']=='SOLID'}
ice={tuple(e['pos']) for e in T['tiles'] if e['type']=='ICE'}
spike={tuple(e['pos']) for e in T['tiles'] if e['type']=='SPIKE'}
ds=((0,1),(-1,0),(0,-1),(1,0)); letters='WASD'
def add(p,d):return (p[0]+ds[d][0],p[1]+ds[d][1])
def step(st,d,details=False):
 p=list(st[:2]); b=set(st[2]); moving={('p',i):d for i in range(2)}
 for tick in range(30):
  blocked=False; demands={}; pushed=set(); positions={('p',i):v for i,v in enumerate(p)}
  positions.update({('b',v):v for v in b})
  def can(q,dr):
   n=add(q,dr)
   if n in walls:return False
   if n in b:return can(n,dr)
   return True
  for actor,dr in list(moving.items()):
   q=positions[actor]
   if not can(q,dr):
    if tick==0 and actor[0]=='p':
     for _ in range(3):
      dr=(dr+1)%4
      if can(q,dr):break
     else:continue
    else:continue
   demands[actor]=dr
  queue=list(demands)
  for a in queue:
   dr=demands[a]; n=add(positions[a],dr)
   if n in b:
    z=('b',n);pushed.add(a)
    if z in demands and demands[z]!=dr:return 'split'
    if z not in demands:demands[z]=dr;queue.append(z)
  if not demands:break
  dest={a:add(q,demands[a]) if a in demands else q for a,q in positions.items()}
  if len(set(dest.values()))!=len(dest):return None
  if any(dest[('p',i)] in spike for i in range(2)):return None
  p=[dest[('p',i)] for i in range(2)]
  b={q for a,q in dest.items() if a[0]=='b'}
  moving={(a if a[0]=='p' else ('b',dest[a])):dr for a,dr in demands.items() if a not in pushed and dest[a] in ice}
  if not moving:break
 return (*p,tuple(sorted(b)))
def fmt(st):return st
init=((6,3),(6,11),tuple(sorted([(6,y) for y in range(4,11)]+[(5,11)])))
if __name__=='__main__':
 target={(9,11),(10,11),(11,11)}
 q=collections.deque([init]); parent={init:None}; found=None;best=-1
 limit=int(sys.argv[1]) if len(sys.argv)>1 else 500000
 while q and len(parent)<limit:
  st=q.popleft()
  n=len(set(st[2])&target)
  if n>best:best=n;print('BEST',n,'visited',len(parent),'state',st,flush=True)
  if target<=set(st[2]):found=st;break
  for d in range(4):
   nxt=step(st,d)
   if nxt is None or nxt=='split' or nxt in parent:continue
   parent[nxt]=(st,letters[d]);q.append(nxt)
 print('visited',len(parent),'queue',len(q),flush=True)
 if found:
  path=[];s=found
  while parent[s]:s,a=parent[s];path.append(a)
  path=''.join(path[::-1]);print('PATH',path,'END',found)
  s=init
  for a in path:s=step(s,letters.index(a));print(a,s)
