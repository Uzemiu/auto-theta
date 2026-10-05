# 4-25 长颈鹿 / giraffe — readonly model and evidence

Source: `artifacts/slot1-playthrough/4-25.json` initial, Template4/giraffe, size9×18, min0,0. No game input, hints, hidden implementation, save or main-KB edits. All prefixes below are MODEL ONLY until owner confirms them.

**Latest closure: owner completed actual89/time89, completed=true.** Main JSON event66 independently read; Goal cargo119/BOX118 at5,15 active/ghost0/contained1/F0. Run0undo/0retry. The normal return at64 and later normal revisit/replay89 are preserved as history. All earlier MODEL labels below refer to proposal time; see the final actual closure.

## Terrain and initial resources

P84 at7,6 Fork0; Blue Color3 BOX64 at6,6; Color4 BOX83 at6,5. Goal5,15. Only SPIKE3,3. Eighteen Forks: first5,4; column2 y4..15; side3,4/7/10/13 and4,15. Wall overrides Floor/Fork symbols. No ICE/Lock/Gate/Prism. Actual exposed Floor is used; no missing-tile walking or unverified wrapping.

Owner confirmed safe `SSAA`4: P84=5,4/F1/A, both boxes unchanged, time4/0undo/0retry. This is the current live-source checkpoint at report creation.

## First bounded generic capture domain

Safe4 source; ordinary WASD plus first free X; before X one live actor, afterward two live actors; target any safe cargo plus outside, either box label, unfixed box layout. Ghost, independent stack and occupied-cargo capture are boundaries; ordinary conflicts are modeled but reducing to one actor is rejected by this particular two-actor resource target.

5000 expanded /9345 seen /4345 pending, depth35 with no depth-cut yet. No hit; truncated, not an impossibility proof. Lost816; stack1, conflict19, occupied0, ghost0. This cap was not increased.

Shortest independent-stack sample: full `SSAADWWDWXWAW`13. Before final W Blue6,8/C4 5,7, free5,6 and7,8. Final W requests C4 north and Blue west into5,8. This is an unexecuted physical probe, not a solved transport prefix.

## New directed recoverable vertical capture

Different structured goal: empty boxes5,5/5,6, free5,4/5,8. Single W lower actor pushes the two-box vertical chain; upper actor W fails at5,9 Wall and A fails at4,8 Wall, so S reaches5,7 and is captured. Unlike cargo at y8 or x8, this result has legal ordinary recovery directions.

Weighted A*: cap3000/depth30, stopped on positive at1338 expanded /2319 seen /1204 heap entries pending, no depth-cut. Only ordinary plus first free X, two live actors, no capture/stack before this target. Heuristic targets this explicit recoverable pair rather than enlarging the generic domain.

Full candidate21: `SSAADDXAAAAWDDWWAWAWW`. Fixed replay is valid without stack/conflict/ghost/occupied-cargo boundaries.

| input | suffix segment | Model checkpoint |
|---|---|---|
|4|SSAA|actual P5,4 F1/A; boxes original|
|7|DDX|free7,5 and7,3 F0/D; boxes original|
|11|AAAA|Blue6,6/C4 5,5; free5,3 S and4,2 A|
|15|WDDW|Blue6,6/C4 5,5; free7,5 W and5,3 W|
|20|WAWAW|Blue5,6/C4 5,5; free5,8 and5,4 both W|
|21|W|Blue cargo5,7 F0/S/ghost0; C4 empty5,6; outside5,5 F0/W|

Sent owner and root the full suffix17 and these checkpoints for normal execution. No actual21 claim is made here yet.

## Tower-entry purpose and limits

Cargo3,3 plus rear empty3,2 and outside3,1 can be pushed W: cargo3,4 safely collects a Fork, rear3,3, outside3,2 remains alive. Two boxes buffer the SPIKE crossing. Legal deployment from candidate21 remains to be closed.

Resource helper independently treats cargo3,4 F1 + empty3,3 + outside3,2 as a constructed conditional domain. Fork1 is insufficient for the simple straight thirteen-X tower tail, which ends short of Goal; Fork2 conditional tail is stronger but its legal acquisition must be proved. No cargo-Fork addition through same-origin fusion is assumed.

## Actual21 and actual64 transport closure

The earlier MODEL labels above preserve the chronological proposal. Latest main artifact events[29].observation directly confirms **actual64/time64**, one axis[0,0,0], completed=false, no undo/retry. Blue64 cargo84 at3,4 is active/ghost0/contained1/F1/W; empty C483 at3,3; outside85 at3,2 active/ghost0/F0/W. Owner also directly confirmed actual21 matching the capture.

Actual64 full prefix:

`SSAADDXAAAAWDDWWAWAWWDWWWASSSSDSSSAAWDDWWASDSAASAWSDDDDDWAAAASAW`

The 43 ordinary moves after21 are hand constructed and fixed replayed, not another BFS:

`DWWWASSSSDSSSAAWDDWWASDSAASAWSDDDDDWAAAASAW`

|input|segment|actual/model-matching resource checkpoint|
|---|---|---|
|30|DWWWASSSS|cargo5,3; empty5,2; outside5,4|
|39|DSSSAAWDD|empty parked7,2; cargo5,3; outside6,2|
|43|WWAS|cargo5,2; outside5,3|
|47|DSAA|cargo3,2; outside4,2|
|50|SAW|cargo3,3 protected on SPIKE; outside3,2|
|57|SDDDDDW|outside8,2; empty7,2|
|61|AAAA|empty rear3,2; outside4,2|
|64|SAW|cargo3,4 picks Fork1; rear empty3,3; outside3,2 safe|

The earlier directed ordinary transport run stopped at3000 expanded/3613 seen/748 heap entries pending, depth35 with7 depth-cuts and no hit. The eventual 43-move hand transport is beyond that bounded depth and not a cap extension.

Rejected hand routes using empty2,2 then east recovery are **not executable**: true Wall1,1 and1,2 cover their SOLID tiles. Owner's 33-move proposal was not executed. Wall4,3/4,4 also prevents the tempting west cargo shift at row3 or west push from3,4 to2,4. Parking the empty box7,2 is the legal alternative.

## Full hand-constructed MODEL goal tail25

After resource's separate bounded actual64 best-first5000/7585/2585pending (noGoal; no budget increase), I manually assembled a different stack of ordinary box-chain pushes and cargo births. No new BFS was run.

`SXWXXXXAXWXXAXSWXXSAXWWXX`

Full fixed replay89 reaches Goal5,15 with active Blue cargoF0/ghost0, no outside survivors. Same-origin Fork maximum is used; no Fork addition, independent stack, conflicting force, occupied-container capture or new ICE mechanism is needed. At present this is a full **MODEL candidate**, awaiting owner actual replay.

The three side-Fork parents at3,7/10/13 use A-X: their southern child pushes the previous zero-Fork vertical section down into its gap. This prepares a long col3 chain without requiring Fork2 at the entrance. The outside actor remains in the safe bottom chamber until the last two W pushes.

|total input|tail segment|checkpoint|
|---|---|---|
|67|SXW|charged2,4F1; Blue3,4F0; empty3,3; outside3,2|
|71|XXXX|charged3,7F1 and2,8F1; outside3,2|
|76|AXWXX|charged3,10F1 and2,11F1; outside2,1|
|82|AXSWXX|charged3,13F1 and2,14F1; outside4,2|
|85|SAX|charged2,15F1/A; empty3,2; cargo col3 y3..12 and14; y13 gap; outside3,1|
|86|W|lower chain y2..12 moves to3..13; upper3,14 unchanged; outside3,2 safe|
|87|W|now-contiguous y3..14 chain moves to4..15; head cargo3,15F0; outside dies SPIKE3,3; charged2,15F1/W survives|
|88|X|new child3,15 pushes prior cargo3,15→4,15; old zero-Fork cargo picks last Fork1|
|89|X|charged4,15 copies right to Goal5,15F0; all Forks consumed|

Sent root/owner/resource the full tail for independent fixed replay and actual segmented verification. The previous normal return64 is retained; if owner already returned, normal revisit/replay is required rather than assuming the game remains64.

Resource helper independently ran the same25 string in its private4-25 model (derived from the observed4-22 step engine, **not an independently implemented engine**): valid=true/mask1. It also confirmed both long W pushes and last Fork pickup/Goal birth. This cross-check improves route confidence but does not replace owner actual evidence.

## Actual89 completed closure

Owner executed the entire25 tail after normal revisit and replay64. Main JSON event66 direct observation is completed=true/time89, with instructions exactly matching `prefix64 + goal25` exported by the script. All checkpoints67/71/76/82/85/86/87/88/89 matched the predicted resource geometry.

Actual87: outside85 dies atSPIKE3,3; previously front cargo113 is at3,15 Fork0/ghost0/contained, while chargedcargo115 remains2,15/F1. Actual88: cargo115 births from2,15 and pushes cargo113 to4,15, which picks the last Fork and becomesF1. Actual89: its child119/BOX118 reaches5,15 active/ghost0/contained1/F0 and the level completes. No unverified fusion sum or empty-box Fork pickup is used.

Complete actual89 route:

`SSAADDXAAAAWDDWWAWAWWDWWWASSSSDSSSAAWDDWWASDSAASAWSDDDDDWAAAASAWSXWXXXXAXWXXAXSWXXSAXWWXX`

Search is stopped. Main KB/progress/save are maintained solely by owner/root; this helper only records the verified closure here.
