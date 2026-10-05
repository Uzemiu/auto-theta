"""Observed-map single-player ENTRY transport; never controls game.

Owner's 2026-10-02 world play verified these gate pairings, ENTRY pressure and
occupied-gate retention during the west collection route. New routes are still
model candidates. Missing floor is impassable; SPIKE and ICE are excluded.
Other unfinished entries are never stepped on. Cargo loading is not modeled.
"""
import collections
import json
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
record = json.loads((ROOT / 'artifacts/slot1-playthrough/chapter3-world.json').read_text(encoding='utf-8-sig'))
level = next(e['observation']['level'] for e in reversed(record['events'])
             if e.get('observation', {}).get('level', {}).get('id') == 'Chapter3')
t = level['timelines'][0]
entries = [e for e in t['entities'] if e['type'] == 'ENTRY' and e['details'].get('LinkLevel') == '3-X']
assert len(entries) == 1, 'Expected exactly one observed 3-X entry'
entry = entries[0]
assert entry['pushable'], 'Observed 3-X entry must be pushable'
entry_id = entry['id']
completed = set(json.loads((ROOT / 'knowledge/progress.json').read_text(encoding='utf-8-sig'))['active_playthrough']['verified_completed_levels'])
floor = {tuple(e['pos']) for e in t['tiles'] if e['type'] == 'SOLID'}
floor |= {tuple(e['pos']) for e in t['entities'] if e['floor']}
gates = {(18, 9): {(18, 11)}, (-9, 0): {(-9, 2), (-9, -1)}}
block = {tuple(e['pos']) for e in t['entities'] if e['blockable'] and e['id'] != entry_id and e['type'] != 'BUTTONGATE'}
block |= {tuple(e['pos']) for e in t['entities'] if e['type'] == 'ENTRY' and e['id'] != entry_id and e['details']['LinkLevel'] not in completed}
floor -= block
floor = {p for p in floor if -18 <= p[0] <= 21 and -4 <= p[1] <= 22}
dirs = [('W', (0, 1)), ('A', (-1, 0)), ('S', (0, -1)), ('D', (1, 0))]
start = ((2, 5), tuple(entry['pos']))
if len(sys.argv) > 2:
    start = ((int(sys.argv[1]), int(sys.argv[2])), start[1])
fixed = '--fixed-gates' in sys.argv

def add(p, d):
    return p[0] + d[0], p[1] + d[1]

def step(state, c):
    player, box = state
    d = dict(dirs)[c]
    closed = {g for g, buttons in gates.items()
              if fixed or (player not in buttons and box not in buttons and player != g and box != g)}
    n = add(player, d)
    if n not in floor or n in closed:
        return None
    nb = box
    if n == box:
        nb = add(box, d)
        if nb not in floor or nb in closed:
            return None
    return n, nb

def main(goal_box=(-9, 2), goal_player=None):
    q = collections.deque([start])
    seen = {start: None}
    goal = None
    while q and len(seen) < 300000:
        state = q.popleft()
        if state[1] == goal_box and (goal_player is None or state[0] == goal_player):
            goal = state
            break
        for c, _ in dirs:
            s = step(state, c)
            if s is not None and s not in seen:
                seen[s] = state, c
                q.append(s)
    print('states', len(seen), 'remaining', len(q), 'found', bool(goal))
    if goal:
        r = []
        state = goal
        while seen[state]:
            state, c = seen[state]
            r.append(c)
        route = ''.join(reversed(r))
        print('route', len(route), route)
        state = start
        for i, c in enumerate(route, 1):
            next_state = step(state, c)
            assert next_state is not None
            if next_state[1] != state[1] or next_state[0] in gates:
                print(i, c, 'box', next_state[1], 'player', next_state[0])
            state = next_state

if __name__ == '__main__':
    main()
