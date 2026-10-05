"""Small local hypothesis: one ENTRY acts as BOX; ice only slides players.
No game access; reads prior observed map via sibling. Rejects pushing onto ice,
simultaneous opposed pushes, and any noncontained actor touching unfinished ENTRY.
"""
import importlib.util
import sys
from pathlib import Path
from collections import deque

spec = importlib.util.spec_from_file_location('world', Path(__file__).with_name('chapter3-west-entry-readonly.py'))
m = importlib.util.module_from_spec(spec)
spec.loader.exec_module(m)
ice = {(6, 18)}
floor = {p for p in m.floor if 6 <= p[0] <= 20 and 14 <= p[1] <= 22}
floor |= ice
dirs = [(0, 1), (-1, 0), (0, -1), (1, 0)]
add = m.add
static_entries = {tuple(e['pos']) for e in m.t['entities']
                  if e['type'] == 'ENTRY' and e['id'] != m.entry_id}
completed_entries = {tuple(e['pos']) for e in m.t['entities']
                     if e['type'] == 'ENTRY' and e['details'].get('LinkLevel') in m.completed}

def step(state, action):
    players, box = state
    pushes = set()
    result = []
    for p in players:
        if p[2]:
            result.append(p)
            continue
        moved = False
        for off in range(4):
            d = dirs[(action + off) % 4]
            n = add(p, d)
            if n not in floor:
                continue
            if n == box:
                nb = add(box, d)
                if nb not in floor or nb in ice:
                    continue
                pushes.add((action + off) % 4)
            if n in ice:
                n = add(n, d)
                if n not in floor or n == box:
                    return None
            result.append((*n, False))
            moved = True
            break
        if not moved:
            result.append(p)
    if len(pushes) > 1:
        return None
    nb = add(box, dirs[next(iter(pushes))]) if pushes else box
    result = [(*nb, True) if p[2] or p[:2] == nb else p for p in result]
    result = tuple(sorted(set(result)))
    if len(result) != 2:
        return None
    return result, nb

def main(overlap=False, start_override=None, goal_box=None, goal_free=None):
    start = start_override or (((7, 17, False), (9, 17, False)), (9, 20))
    q = deque([start]); seen = {start: None}; goal = None
    while q and len(seen) < 100000:
        state = q.popleft()
        def wanted(s):
            if goal_box is not None and s[1] != goal_box:
                return False
            if goal_free is not None and not any(p[:2] == goal_free and not p[2] for p in s[0]):
                return False
            if not overlap:
                return True
            box_ok = s[1] not in static_entries if overlap == 'plain' else s[1] in completed_entries
            return box_ok and all(p[2] or p[:2] not in static_entries for p in s[0])
        if any(p[2] for p in state[0]) and wanted(state):
            goal = state
            break
        for a in range(4):
            n = step(state, a)
            if overlap and n is not None:
                captured = any(p[2] for p in n[0])
                if (captured and not wanted(n)) or (not captured and all(p[:2] in static_entries for p in n[0])):
                    continue
            if n is not None and n not in seen:
                seen[n] = state, a
                q.append(n)
    print('seen', len(seen), 'pending', len(q), 'found', bool(goal))
    if goal:
        route = []; state = goal
        while seen[state]:
            state, a = seen[state]
            route.append('WASD'[a])
        route = ''.join(reversed(route))
        print(route)
        state = start
        for a in route:
            state = step(state, 'WASD'.index(a))
            print(a, state)

if __name__ == '__main__':
    main('--overlap' in sys.argv)
