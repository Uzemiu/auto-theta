import json
from pathlib import Path
for p in sorted(Path('artifacts/slot1-playthrough').glob('4-*.json')):
 d=json.loads(p.read_text(encoding='utf-8-sig'))
 s=d.get('initial')
 if not s or not s.get('level',{}).get('timelines'): continue
 t=s['level']['timelines'][0]
 es=t.get('entities',[])+t.get('tiles',[])
 out=[]
 for pos in ((8,1),(7,0)):
  here=[e for e in es if tuple(e['pos'])==pos]
  out.append({'pos':pos,'wall':any(e.get('class')=='Wall' for e in here),'floor':any(e.get('floor') for e in here),'types':sorted(set(e['type'] for e in here))})
 print(json.dumps({'file':p.name,'level':s['level']['id'],'size':t.get('size'),'anchor':t.get('min_anchor'),'targets':out},ensure_ascii=False))
