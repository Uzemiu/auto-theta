# Chapter4 west component: collection 104 route

2026-10-04, root read-only audit. No game input, save edit, hidden implementation, hint, or walkthrough was used.

Source: `artifacts/slot1-playthrough/chapter4-world.json`, events[181]. Actual world `Chapter4`, one active free player at `[-29,-11]`, Fork0, time0, after normal return from 4-16 following completion of 4-15. Min `[-83,-19]`, size `[139,29]`. This source is not the earlier east-side return point `[-26,-11]`.

Finite route graph: active floor cells, with active blockable objects and SPIKE excluded. Every ENTRY is terminal, so the search cannot use an entry as a passage through a level. No pushing, split, wrap, lock opening, or optimistic ICE travel. Reachable graph size is 332 including entry terminals; the positive route below was separately checked cell by cell and **every traversed terrain tile is SOLID**, with no ICE, DARK, missing floor, or active blocker. The sole non-player dynamic encounter is COLLECTION104 at the destination.

Target: active COLLECTION NID104 at `[-32,6]`. A 44-action model route from the source is:

```text
WAAAAAAAAAAAAWWWAAAWWWWWWWWWWWWDDDDDDDDWDDDD
```

Segments:

| Actions | Destination |
| --- | --- |
| W | -29,-10 |
| A x 12 | -41,-10 |
| W x 3 | -41,-7 |
| A x 3 | -44,-7 |
| W x 12 | -44,5 |
| D x 8 | -36,5 |
| W | -36,6 |
| D x 4 | -32,6 |

This is a **model positive awaiting actual normal game execution**, not a pickup or achievement claim. If returning from 4-17 gives another source position, recompute or replay from the newly observed source rather than blindly using this string.

The terrain tile sets of events[175] and [181] are identical, and the same trace is safe in both. The new opportunity follows the west-side source reachable after 4-15 completion; it does not establish a terrain change. Earlier reports scoped to the east side while avoiding the then-uncompleted 4-15 entry remain historical evidence for that source, not a current no-route result.

Other observations in events[181]: COLLECTION NID12 at `[-68,-17]` is active; it is outside this fixed graph. Its kind and whether it counts as a star are unclassified. 4-15, 4-16, and 4-17 are reachable entry terminals from this source; 4-18 is still blockable. Neither observed collection is credited as collected by this audit.

## Actual pickup following the audit

The sole input owner normally returned from unfinished 4-17 to `[-33,-11]`, independently recomputed the route, and executed 40 effective inputs:

```text
WAAAAAAAAWWWAAAWWWWWWWWWWWWDDDDDDDDWDDDD
```

Root independently read the resulting primary world JSON: events[189] player `[-44,-7]` after 15; [191] `[-44,5]` after 27; [193] `[-33,6]` after 39; [195] `[-32,6]` after 40. Event[195] has COLLECTION104 inactive and active player's split0→1. Actual UI explicitly says `黄色叉子`, `（有什么用呢）`, and `获得新的收藏品！`. This now proves a normal pickup, replacing the route's model-only status for the recomputed source.

The first root save read during the collection confirmation still had no Collections104, so persistence awaits confirmation/autosave verification. The star count remains6 at that read. Pickup alone does not prove the Yellow achievement's distinct condition of splitting a level.

After the owner normally entered 4-18, root independently reread the save: Settings slot1, CurWorld4, Collections104=true, PlayerPosWorld `[-38,-11]`, completed112 and star count6. This verifies normal persistence and that NID104 did not increase the star count. The earlier confirmation-time snapshot is preserved as history, superseded for current persistence status. No Yellow achievement condition is credited by these reads.
