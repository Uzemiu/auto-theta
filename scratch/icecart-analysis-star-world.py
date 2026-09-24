import json,collections,sys
j=json.load(open('artifacts/slot1-playthrough/chapter1-world.json',encoding='utf-8-sig'))
o=next(e['observation'] for e in reversed(j['events']) if 'observation' in e and e['observation']['level']['id']=='Chapter1')
t=o['level']['timelines'][0]
safe={tuple(e['pos']) for e in t['tiles'] if e['type']=='SOLID'}|{tuple(e['pos']) for e in t['entities'] if e['floor']}
blocked={tuple(e['pos']) for e in t['entities'] if e['active'] and e['blockable']}
entries={tuple(e['pos']):e['details']['LinkLevel'] for e in t['entities'] if e['type']=='ENTRY'}
dirs=[(0,1),(-1,0),(0,-1),(1,0)]
def plus(p,d):return p[0]+dirs[d][0],p[1]+dirs[d][1]
def move(st,a):
 ps,f,sp=st;out=[]
 for p in ps:
  if a==4:
   if not sp:return None
   for off in [1,3]:
    z=plus(p,(f+off)%4)
    if z in blocked or z not in safe:z=plus(p,f)
    if z in blocked or z not in safe:continue
    out.append(z)
  else:
   for n in range(4):
    nf=(a+n)%4;z=plus(p,nf)
    if z not in blocked and z in safe:break
   else:z=p;nf=f
   if z not in safe:return None
   out.append(z)
   if sp:f=nf
 out=tuple(sorted(set(out)))
 if len(out)!=2 and not sp:return None
 return out,f if sp and a!=4 else 0,0 if a==4 else sp
start=(((38,38),),0,1)
if __name__=='__main__':
 allow_completed_single='--allow-completed-single' in sys.argv
 progress=json.load(open('knowledge/progress.json',encoding='utf-8-sig'))
 completed=set(progress['active_playthrough']['verified_completed_levels'])
 pairs=[('1-2','1-7'),('1-2','1-8'),('1-6','1-20'),('1-14','1-10')]
 goals={tuple(sorted(k for k,v in entries.items() if v in pair)):pair for pair in pairs}
 q=collections.deque([start]);seen={start:None};found={}
 while q and len(seen)<800000:
  st=q.popleft()
  if st[0] in goals and len(st[0])==2:
   route=[];s=st
   while seen[s]:s,a=seen[s];route.append(a)
   found[goals[st[0]]]=''.join(route[::-1]);print('FOUND',goals[st[0]],found[goals[st[0]]],flush=True)
  for a in range(5 if st[2] else 4):
   ns=move(st,a)
   if not ns or ns in seen:continue
   # Conservative: a world entry may load immediately when one player reaches it.
   touched=[entries[p] for p in ns[0] if p in entries]
   if touched and ns[0] not in goals:
    if not (allow_completed_single and len(touched)==1 and touched[0] in completed):continue
   seen[ns]=(st,'WASDX'[a]);q.append(ns)
 print('states',len(seen),'queue',len(q),'found',found)
