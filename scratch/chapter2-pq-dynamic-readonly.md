# Chapter2 2-P / 2-Q dynamic ICE navigation — readonly bounded report

2026-10-04. No game input, hints, hidden implementation, save or main knowledge-base edits. Owner remains `/root/resume_slot1_oct03`. One private model: `scratch/chapter2-pq-dynamic-readonly.cjs`.

## Actual source and positive conditional tail

The model explicitly selects the latest full observation with `level.id === 'Chapter2'`, `world === true`, and nonempty timeline tiles. Source events 477 and 479 both preserve the actual 19-input world position: PLAYER306 at **75,17**, Fork1, faceS; BOX344 at **45,15**. COL5 is already inactive. These are observation records, not supplied hypothetical coordinates.

Walls and active blocking entities override terrain. Completed entries are passable based on the verified completion list and the actual completed 2-1 passage. Uncompleted letters are avoided, except final destinations P/Q; simultaneous occupation of distinct ENTRYs is rejected at every microtick. No world wrap is modeled.

Independently verified ordinary conditional route from a live, uncontained player at **68,15**:

| Input | Stable coordinate | Actual terrain |
| --- | --- | --- |
| S | 68,5 | ICE |
| D | 92,5 | ICE |
| W | 92,32 | ICE |
| A | 84,32 | ICE |
| S | 84,28 | SOLID, unlocked ENTRY 2-P |

Thus **SDWAS** is geometrically valid and needs no wrap. Entry 2-P is currently blockable=false / AlwaysEnable=true. Reaching and loading it still requires an actual live route; this report does not count P as visited or completed. 2-Q at 80,24 also remains unvisited.

## M035 / M040 adaptation checked against actual COL5

The older `chapter2-col5-fork-ice-readonly.cjs` is a fixed-box / no-push model. Its `COL5_MODEL_BOX` changes a static assumption; it is not a dynamic engine. The new private model adapts the observed 2-G microtick movement to one world box and up to two free players, with one initial X.

From the actual 75,17 source, this legal 44-input suffix reproduces the earlier COL5 actual world63 brake:

`AAWWWWDWXSSDSSSWDWDDDDDSDSSSWDDWDDWAASSSSSSD`

Useful checkpoints:

| Suffix length | State |
| --- | --- |
| 9: AAWWWWDWX | two free at 13,19 / 15,19, Fork0; BOX45,15 |
| 42 | two free at 75,15 / 34,17; BOX45,15 |
| 43: S | two free at 76,15 / 34,15; BOX45,15 |
| 44: D | BOX55,15; western pusher45,15 faceD, eastern opposer56,15 faceA; both free, Fork0 |

The last D settles in 21 modeled microticks. The western player stops at the old contact cell45,15 while the box continues east on ICE. The eastern player meets it moving west, and M040 stops both box and opposing player. Exact final positions match actual event388. This is a regression against an already real observation; it was not re-executed for the new task.

The target does not require both people to be adjacent to a braked box. A live person at68,15 or68,16 would suffice. With right opposer beginning76,15 and the left initiator as close as44,15 to the original BOX45,15, a simple first brake stops near60 rather than68. The old 34,15 initiator produced55. Reusing that same configuration cannot simply credit68.

## Finite search results

1. Legal 44-input brake poststate: dynamic WASD with M035, M040, deaths, box capture and one surviving free allowed; no restriction to box row15. **3,769 expanded / 3,769 seen, queue exhausted**, depth limit75, no live68,15 or68,16. Closest live player is68,18 while the box is locked at76,15 with the other player contained. An earlier row15-only diagnostic was3,152/3,152, superseded by this broader finite poststate domain.
2. Earlier legal **9-input AAWWWWDWX** poststate, BOX45,15 unchanged: dynamic WASD target live68,15 or68,16. **20,000 expanded / 24,694 seen / 4,886 queued**, depth limit80, **truncated**, no hit. This is a different early resource domain, not a re-run from the55 brake. The search reported zero active differently directed Blue pushes and zero perpendicular moving-box encounters, so it produced no short new box-physics probe. Two ambiguous one-moving/one-stopped player crossings were rejected. Closest coordinate in the selected search ordering was69,20; this is not a distance proof or global frontier bound.

Both searches ran to completion of their reported limits and have no pending process handle. No further budget was added. No candidate was sent for game execution.

The early domain fixes the first split to the legal9-input birth; it does not exhaust every possible first-X location from fresh75,17. The model also excludes worldline branching, unverified perpendicular box-inertia interactions, arbitrary player crossing, additional fork acquisition, mutable lock/key changes and world wrap. It allows inferred ordinary box capture but does not claim a new actual world capture observation. These limits prevent a no-hit result from becoming a global impossibility claim.

M021 edge correction: X side blocked by an unpushable box falls back to the front, rather than leaving the child at the parent. This correction was added after the early-domain run. It does not change either search result because their legal starts already have Fork0; their generating9-input X has no adjacent box. The known44-input brake is replayed again after this correction.

## Next useful evidence

P's exterior ICE route is ready once a live68,15/16 stop is actually obtained. A genuinely different first-X resource layout, a verified way to transfer the world box to row16, or a short legal perpendicular/crossing probe would expand the current scope. The current report has no such positive prefix and therefore does not justify moving the waiting owner into the old COL5 route again.
