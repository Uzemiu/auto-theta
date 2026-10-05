import json
from pathlib import Path
p=Path('artifacts/slot1-playthrough/chapter4-world.json')
d=json.loads(p.read_text(encoding='utf-8-sig'))
observations=[(i,e['observation']) for i,e in enumerate(d.get('events',[])) if 'observation' in e and e['observation'].get('level',{}).get('world')]
i,s=observations[-1]
print(json.dumps({'event':i,'scene':s['scene'],'level':{k:s['level'].get(k) for k in ('id','instructions','current_timeline','world')}},ensure_ascii=False))
t=s['level']['timelines'][0]
for e in t['entities']:
 if e['type'] in ('KEY','LOCK','BUTTONGATE','BUTTON','GOAL','BOX','PRISM','PLAYER','COLLECTION','INTERACTABLE') or (e['type']=='ENTRY' and e.get('details',{}).get('LinkLevel') in ('4-X','4-Y','4-Z')):
  print(json.dumps(e,ensure_ascii=False))
