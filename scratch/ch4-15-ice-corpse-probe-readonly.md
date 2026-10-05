# 4-15 mixed-fork XD condition and live fork budget — readonly audit

2026-10-04, `/root/ch4_1_readonly`. No game input, hints, hidden implementation, external guide, save or main KB writes. Private model: `ch4-15-ice-corpse-probe-readonly.cjs`. Actual current owner fresh0 was preserved for these runs; owner subsequently independently validated the distinct swapped-Blue17 resource prefix. No probe from this report was executed.

The preceding status sentence records the time of the original **Blue-box XD** study. The later, distinct **empty Color4 WXD** experiment has now been executed and failed to capture the corpse; see the evidence update below. Historical unknown statements are retained, not credited as current success.

## Correct terrain

The initial SPIKE tiles are **1,7 /3,7 /4,6 /4,7 /5,7 /7,7**. **2,6 and6,6 are safe SOLID**, and3,6/5,6 are floor-bearing GOALs. Wall4,7 overrides its SPIKE. The previous ghost-tail report's claim that side pushers2,6/6,6 would already stand on SPIKE was wrong, has been corrected in that report, and was explicitly withdrawn to root/owner/resource. It cannot be used to reject a legal side-push plan.

## New conditional probe, not a positive prefix

Required before X:

- empty C4 box4,6 and empty Blue4,3;
- live free **Fork0 at3,6**, waiting during X;
- live free **Fork1 at4,2, faceA**;
- remaining Fork4,6 active; safe Fork4,5 already consumed.

The private ordinary/free-X model replays the following geometry:

| Stage | Boxes | Free players / unresolved receiver |
| --- | --- | --- |
| X stable | C44,6, Blue4,4 | old3,6 F0; new4,1 and4,3 F0, faceA |
| D main tick | C45,6, Blue4,5 ICE | old3,6 east-pushes C4 and enters4,6 SPIKE, picks last fork, then dies;4,3 turns W at Wall5,3 and pushes Blue, stays4,4;4,1→5,1 |
| D ICE continuation | C45,6, Blue4,6 | two genuine live outside at4,4/5,1; whether Blue catches the just-dead Fork1 receiver is **unknown** |

The model removes a bare SPIKE-dead receiver before the continuation; it returns only the two live outside players. This removal is a bounded modeling choice, not game evidence that the same-input later-tick capture must fail. Conversely, the condition cannot be credited as M092 same-microtick capture, activeghost1, revival, creation or completed goal until actually probed from a legal prefix.

## Old coverage audited from code

`ch4-15-blue-first-readonly.cjs` really checked Blue cargoFork≥1 plus outsideFork≥1 before expansion. Ordinary capture states were preserved if both live actors and fork inventories survived. It did not unconditionally reject cargo, and did not accidentally check the predicate only after deleting all capture states.

- old11 `WAASAWWWWSX`:3056/3056 finite ordinary two-live-Fork1 graph, target no hit;
- old9 `WAASAWWWW`:4488/4488, solo ordinary deployment then one free X to two liveFork1, same liveBlue target no hit;
- older3790/3790 sought twoFreeFork1 at3,6/4,3 with C44,6/Blue4,4, a different pre-D condition.

These older pairs require each surviving actorFork≥1 and spend no further X in the two-person phase. They do **not** cover the new mixed-Fork0/Fork1 pre-X pair, nor the threeFork0 players made by the final X above. The old revisit script allowed broader early first-X resource paths, but its recorded positive25 was cargoFork2 plus outsideFork0; its several20k probe failures were truncated and do not document exhaustion of this exact new mixed-fork predicate.

## Two new finite runs; no added cap

Both use legal, previously observed early-first-fork split `AAAWX` from the actual initial geometry (two free3,2/5,2 Fork0; boxes still initial). Source entity IDs are not asserted as current new-initial IDs.

1. **Exact pre-X predicate above:** ordinary deployment, exactly two live uncontained free actors, no ghost/cargo/stack/conflict, preserve lastFork4,6, boxes y>1, holder faceA included in hash. **5000 expanded /6173 seen /1173 pending**, depth40, truncated, no hit. Not replayed in game.
2. **New any-color livecargoFork≥1 + liveoutsideFork≥1:** ordinary/ICE, propagate cargoFork0 and allow it to collect forks, two live actors retained, no ghost/stack/conflict, boxes y>1. **20000 expanded /22630 seen /2630 pending**, depth40, depth-cut0, truncated, no hit. This is not the old11/9 both-Fork1 domain and not the old cargoFork2+arbitrary-outside target.

The second target requires allocating the two remaining fork pickups to cargo and outside. Further free-X spends a fork needed for that allocation. A cargoFork2 X would instead make two cargoFork1 and retain a Fork0 outside, with no remaining fork pickup; ordinary contained rules do not release one as a Fork1 outside. Cargo-X, stack-mediated release and unverified life changes were therefore not added to this ordinary resource run. This is an explicit scope, not a universal inventory theorem about all new mechanisms.

A small static wait diagnostic used the same ordinary two-box model:37 safe actor floor cells and35 possible non-Wall box floor cells withy>1 produced20995 two-box/actor configurations; no unchanged live-free fully blocked wait was found. It does not enlarge the prefix search, simulate ghosts, or exclude future fork-X/stack mechanisms. The exact pre-X free positions have different chessboard parity; the early split starts same parity, so a legal delay/extra tick would need a specific movement witness rather than assumed waiting. Only ICE4,5 is present and its north continuation leads SPIKE4,6; no bare-live safe extra tick is assumed.

## Status

XD is a clear unknown-physics condition but lacks a legal resource prefix in the reported bounded runs. No owner action is requested. Both search processes have ended; no budget increase, automatic retry, save edit or completion credit occurred. The independently actual new17 swapped-Blue seed belongs to the resource helper's separate task and was not searched again here.

## Evidence update: actual empty Color4 WXD failed, M114

Read directly from `artifacts/slot1-playthrough/4-15.json` **events[116]/[118]/[120]** and checked against **M114** in `knowledge/mechanics.md`.

- **35/time36, event116:** empty C4 BOX48 at4,4, empty Blue49 at4,6; four liveFork0/ghost0 free players50 at4,1,54 at4,3,51 at1,6,55 at3,6; remainingFork KEY46 active. Prefix is actual17 plus `WSASSSSWWWSAWWADWX`.
- **36D/time38, event118:** BOX48 now4,6 but still empty/contained0; Blue49 now5,6. Player55 at4,6 is **inactive, ghost1, split1, contained0, container-1**; KEY46 inactive. The three other liveFork0/ghost0 free players are50 at5,1,54 at4,4,51 at2,6. One timeline, no dialog, completed=false.
- **Normal undo1, event120:** restored35/time36, the two empty original box poses, all four liveFork0 players and active KEY46. Cumulative72undo/1redo/0retry.

The time advance36→38 and real ICE4,5 support the path of the newly pushed Color4 box; no individual microframe is claimed. Unlike the earlier blocked-box/no-new-force test, this box did receive a new push and reached4,6 in the same input, yet the stable corpse remained uncontained. The tested empty-C4 condition is therefore **actually negative**, not still unknown or a successful M092 capture.

Scope stays narrow: the original unexecuted Blue XD condition in this report uses another box color and a different source layout. M114 does not prove all colors, existing cargo or all capture timings fail, and does not negate the verified same-main-tick M092 mechanism. No new search, game input, main KB write, retry or completion credit was added during this evidence synchronization.
