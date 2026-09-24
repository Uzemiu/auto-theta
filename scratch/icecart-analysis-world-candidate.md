# 2-23 four-leaf construction

This is an offline candidate handoff. It uses only observed maps and mechanics. Live validation belongs to the sole controller.

Two forks produce four players. A conflict between two players duplicates the two non-pushers into both resulting timelines: two lines of three players. One further conflict in each line yields four leaves of two players, enough to occupy the eight targets. The controller has verified the first interior-corner conflict and the upper branch's second conflict.

First interior conflict precursor: box (9,9), players (8,9),(7,10),(9,8),(9,10). S produces two lines, both with position set (9,9),(7,9),(9,7), with boxes (10,9) and (9,8).

Second conflicts:

- Box (10,9): `WAWDWWWDDDD`. Last D splits at box (11,12). Leaves each have players (11,12),(9,12), with box (12,12) or (10,12).
- Box (9,8): `SDSAAAA`. Last A splits at box (9,4). Leaves each have players (9,4),(7,4), with box (8,4) or (9,3).

Identify leaves by box position, since new worldlines can change axis numbering.

| Leaf starting box | Starting players | Candidate route | Goal pair |
| --- | --- | --- | --- |
| (12,12) | (11,12),(9,12) | Controller's `WWSSSSAWAWWAAAAA` | (1,12),(4,9) |
| (10,12) | (11,12),(9,12) | `WWWWWSSSSSWWDDDDD` | (12,12),(9,9) |
| (8,4) | (9,4),(7,4) | `WAAWWSDSSDDDDD` | (12,1),(9,4) |
| (9,3) | (9,4),(7,4) | `WWAAAAAAA` | (1,1),(4,4) |

These four disjoint pairs cover all eight goals. Route traces for the last three leaves are in `icecart-analysis-world-leaf-ne.json`, `icecart-analysis-world-leaf-se.json`, and `icecart-analysis-world-leaf-sw.json` in this directory. Those routes still require live validation. After all leaves occupy their goals, switch to the latest-time leaf for completion checking, following M027.
