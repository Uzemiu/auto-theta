import json,sys
from pathlib import Path
from collections import deque
sys.path.insert(0,str(Path(__file__).resolve().parents[1]))
from theta import Bridge
s=Bridge().call('state',include_map=True);l=s['level'];assert l['world'] and not any(l[k] for k in ['busy','input_locked','paused','dialog'])
p=Path('artifacts/slot1-playthrough/chapter3-world.json');r=json.loads(p.read_text(encoding='utf-8-sig'));r['events'].append({'observation':s});p.write_text(json.dumps(r,ensure_ascii=False,indent=2)+'\n',encoding='utf-8')
t=next(t for t in l['timelines'] if t['id']==l['current_timeline']);done=set(json.load(open('knowledge/progress.json',encoding='utf-8-sig'))['active_playthrough']['verified_completed_levels']);es=[e for e in t['entities'] if e['active']];start=tuple(next(e['pos'] for e in es if e['type']=='PLAYER'));target=tuple(map(int,sys.argv[1:3]));safe={tuple(e['pos']) for e in t['tiles'] if e['type']=='SOLID'}|{tuple(e['pos']) for e in es if e['floor']};blocked={tuple(e['pos']) for e in es if e['blockable'] or(e['type']=='ENTRY' and e['details']['LinkLevel'] not in done)};blocked.discard(target);q=deque([(start,'')]);seen={start}
while q:
 p,a=q.popleft()
 if p==target:print(json.dumps({'start':start,'target':target,'route':a}));break
 for dx,dy,c in [(0,1,'W'),(-1,0,'A'),(0,-1,'S'),(1,0,'D')]:
  n=(p[0]+dx,p[1]+dy)
  if n not in seen and n in safe and n not in blocked:seen.add(n);q.append((n,a+c))
else:print('No direct safe path',start,len(seen))
