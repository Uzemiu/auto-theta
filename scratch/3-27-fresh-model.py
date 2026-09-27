import json,collections
p=json.load(open('artifacts/slot1-playthrough/3-27.json',encoding='utf8'));t=p['initial']['level']['timelines'][0]
walls={tuple(e['pos']) for e in t['entities'] if e['type']=='SOLID'}
spikes={tuple(e['pos']) for e in t['tiles'] if e['type']=='SPIKE'}
dirs=[(0,1),(-1,0),(0,-1),(1,0)]
def phase(start,bs,dark,target):
 def step(s,a):
  people,boxes=s; nxt=[]; plans={}
  def chain(z,d):
   arr=[];dx,dy=dirs[d]
   while z in boxes:arr.append(z);z=(z[0]+dx,z[1]+dy)
   return None if z in walls else arr
  for x,y,g in people:
   for off in range(4):
    d=(a+off)%4;dx,dy=dirs[d];z=(x+dx,y+dy)
    if z in walls or (g and z not in dark):continue
    ch=chain(z,d)
    if ch is None:continue
    for b in ch:
     if b in plans and plans[b]!=d:return
     plans[b]=d
    ng=g or (z in spikes)
    if ng and z not in dark:return
    nxt.append((*z,int(ng)));break
   else:nxt.append((x,y,g))
  if len(set((x,y) for x,y,g in nxt))<2:return
  nb=tuple(sorted((x+dirs[plans[(x,y)]][0],y+dirs[plans[(x,y)]][1]) if (x,y) in plans else (x,y) for x,y in boxes))
  if any(y!=9 for x,y in nb):return
  lit={x for x,y in nb} if any(x%2==1 for x,y in nb) else set()
  cleared={z for z in dark if z[0] in lit}
  if cleared:
   if cleared!={(target,2),(target,3)}:return
   if (target,2,1) not in nxt:return
   return ('OK',(tuple(sorted(nxt)),nb))
  return (tuple(sorted(nxt)),nb)
 start=(tuple(sorted(start)),tuple(sorted(bs)));q=collections.deque([start]); prev={start:None}
 while q:
  s=q.popleft()
  for a in range(4):
   n=step(s,a)
   if not n:continue
   if n[0]=='OK':
    out='WASD'[a];cur=s
    while prev[cur]:cur,a=prev[cur];out='WASD'[a]+out
    return out,n[1],len(prev)
   if n not in prev:prev[n]=(s,a);q.append(n)
 return None,len(prev)
dark={(x,y) for x in (4,5,6) for y in (2,3)}
s=((4,9,0),(6,9,0));bs=((3,9),(7,9))
for target in (4,5,6):
 r=phase(s,bs,dark,target);print('target',target,'result',r,flush=True)
 if not r or len(r)<3:break
 route,(s,bs),count=r;s=tuple((x,y,0) for x,y,g in s);dark={z for z in dark if z[0]!=target}
