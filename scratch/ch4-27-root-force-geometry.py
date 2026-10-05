"""Private static force geometry from the observed 4-27 map; no game calls.

Enumerates three arbitrary charged-parent placements in the left lower room.
It does not establish reachability, force arbitration, or actual leaf count.
Each of the three distinct targets must receive two direct birth push requests.
At most five empty boxes may serve as targets and wall-backed birth guards.
"""
import itertools
import json
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
raw = json.loads((ROOT / 'artifacts/slot1-playthrough/4-27.json').read_text(encoding='utf-8'))
timeline = raw['initial']['level']['timelines'][0]
entities = timeline['entities']
walls = {tuple(e['pos']) for e in entities if e['active'] and e['class'] == 'Wall'}
floors = {tuple(e['pos']) for e in timeline['tiles'] + entities if e.get('floor')}
directions = {'W': (0, 1), 'A': (-1, 0), 'S': (0, -1), 'D': (1, 0)}
left = {'W': 'A', 'A': 'S', 'S': 'D', 'D': 'W'}


def advance(pos, direction):
    delta = directions[direction]
    return pos[0] + delta[0], pos[1] + delta[1]


def blocked(pos):
    return pos in walls or pos not in floors


def direction_to(source, target):
    return next(d for d in directions if advance(source, d) == target)


def neighbours(pos):
    return {advance(pos, d) for d in directions if not blocked(advance(pos, d))}


def can_push(pos, direction, empties):
    chain = []
    while not blocked(pos) and pos in empties:
        chain.append(pos)
        pos = advance(pos, direction)
    return not blocked(pos), chain


def inspect(parents, empties, face):
    requests = []
    priority = [left[face], left[left[left[face]]], face]
    for parent in parents:
        births = []
        for direction in priority:
            target = advance(parent, direction)
            ok, chain = can_push(target, direction, empties)
            if ok:
                births.append({'target': target, 'direction': direction, 'chain': chain})
                if len(births) == 2:
                    break
        requests.append({'parent': parent, 'births': births})
    force = {}
    for request in requests:
        for birth in request['births']:
            for box in birth['chain']:
                force.setdefault(box, set()).add(birth['direction'])
    return {
        'requests': requests,
        'force_targets': [{'target': t, 'directions': sorted(ds)}
                          for t, ds in sorted(force.items()) if len(ds) > 1],
    }


# Source domain is stated explicitly; boxes outside it and indirect-chain
# conflicts are not exhaustively enumerated. Parent labels are interchangeable
# here, unlike a fully deployed coloured-box state.
domain = sorted(p for p in floors if not blocked(p) and
                (1 <= p[0] <= 6 and 1 <= p[1] <= 5 or p in {(7, 1), (8, 1)}))
hits = []
combinations = 0
for parents in itertools.combinations(domain, 3):
    combinations += 1
    options = [sorted((neighbours(parents[a]) & neighbours(parents[b])) - set(parents))
               for a, b in [(0, 1), (1, 2), (2, 0)]]
    if any(not x for x in options):
        continue
    for targets in itertools.product(*options):
        if len(set(targets)) != 3:
            continue
        desired = [{targets[0], targets[2]}, {targets[0], targets[1]}, {targets[1], targets[2]}]
        for face in directions:
            priority = [left[face], left[left[left[face]]], face]
            empties = set(targets)
            feasible = True
            for parent, wanted in zip(parents, desired):
                birth_directions = {direction_to(parent, t) for t in wanted}
                if not birth_directions <= set(priority):
                    feasible = False
                    break
                # If the front birth is selected, the missing lateral birth
                # must fail. Its entire straight ray needs a wall-backed chain.
                for d in priority[:2]:
                    if d in birth_directions:
                        continue
                    p = advance(parent, d)
                    while not blocked(p):
                        if p in parents:
                            feasible = False  # Charged parents vacate before X.
                            break
                        empties.add(p)
                        p = advance(p, d)
                    if not feasible or len(empties) > 5:
                        feasible = False
                        break
                if not feasible:
                    break
            if not feasible:
                continue
            result = inspect(parents, empties, face)
            if len(result['force_targets']) != 3:
                continue
            if any({tuple(b['target']) for b in r['births']} != wanted
                   for r, wanted in zip(result['requests'], desired)):
                continue
            hits.append({'parents': parents, 'empties': sorted(empties), 'face': face,
                         **result})

candidate_parents = ((2, 2), (3, 3), (2, 4))
candidate_empties = {(2, 1), (2, 3), (2, 5), (3, 2), (3, 4)}
candidate = {'parents': candidate_parents, 'empties': sorted(candidate_empties), 'face': 'D',
             **inspect(candidate_parents, candidate_empties, 'D')}
print(json.dumps({'scope': 'static direct three-force geometry, not reachability or game arbitration',
                  'source_domain_cells': len(domain), 'parent_combinations': combinations,
                  'hits': len(hits), 'candidate': candidate,
                  'configurations': [{k: h[k] for k in ['parents', 'empties', 'face']}
                                     for h in hits]}, ensure_ascii=False))
