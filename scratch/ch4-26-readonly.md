# 4-26 D.N.A — private observed-state model

**Closed: actual114/time114 completed=true.** The final emptyPrism92 atGoal3,15 observes live Bluecargo187/P188 at3,14. Exact instructions and optical flags independently match the main artifact; root additionally confirmed SaveSlot1 completed115, dna3 and the114-action record. No further4-26 search. Earlier MODEL/unknown sections below are retained as historical analysis and superseded by the final actual closure.

Readonly analysis only. Source: `artifacts/slot1-playthrough/4-26.json`, observed Template4/dna. No game inputs, hidden implementation, hint, save, main KB or progress writes. Companion: `scratch/ch4-26-readonly.cjs`.

## Actual resources

Initial: P93 (13,2), Fork0, faceS; Blue Color3 BOX46 (14,4); PRISM92 (16,4); Goal (3,15). Size (18,16), min anchor (0,0), looping=false. Walls take priority over Floor/Fork. There is no ICE/DARK. All 45 Fork bits use BigInt strings, not 32-bit masks.

Actual `DD`2: P93 (15,2), Fork1/D; objects unchanged. Actual complete 21-prefix, reported by owner and independently checked by root:

`DDWWWXSDSAAWAWAADSSAA`

| Input count | Objects | Active free / cargo |
|---|---|---|
| 6 `DDWWWX` | Blue14,4 / Pri16,4 | free14,5 +16,5, Fork0/W |
| 11 `...SDSAA` | Blue13,3 / Pri14,3 | free14,2/S +15,3/A |
| 15 `...WAWA` | Blue13,3 / Pri13,4 | free14,2/S +13,5/A |
| 16 final `A` | Blue13,2 / Pri13,3 | cargo93 Blue Fork0/A/ghost0; outside94 13,4/S |
| 19 `DSS` | objects unchanged | outside14,2; cargo faceS |
| 21 `AA` | Blue11,2 / Pri13,3 | cargo93 Fork1/A/ghost0 protected on SPIKE; outside94 12,2/A alive |

The final capture is an ordinary two-body mixed chain: upper actor at13,5 requests A, hits Wall12,5 and turns S to push Pri13,4 and Blue13,3 down. Lower actor14,2 requests A to13,2; Blue catches that actor. Prism remains an empty non-container in this actual case. The subsequent Blue push to11,2 picks a new Fork while protecting cargo. Fork11,1 and11,3 remain active. Actual cumulative undo20/retry0 preserves earlier owner solo22 deployment history.

## Search scopes and corrections

1. Original vertical mixed-chain target Blue15,3/Pri15,4, free15,5+15,1: 3000 expanded, 4349 seen, 2089 heap entries pending, depthCut0; no hit. Captured states were checked separately, not propagated. Fixed objects at the closest state: 39/39 ordinary-navigation states exhausted without sync.
2. Horizontal target Blue14,4/Pri15,4, free13,5+16,4: 3000 expanded, 4310 seen, 1927 heap entries pending, depthCut0; no hit. This admitted any cargo x13..16/y2..4 with outside but remained a truncated heuristic domain. No negative global conclusion.
3. Early-first-X seed `DDSAX`: two Fork0 free14,2 and13,1 have different parity because one branch uses forward fallback. Ordinary first-capture BFS2500, seen4034, pending1533, no depth cut; no hit. This is a truncated specific seed, not a same-parity impossibility proof.
4. Replacement complete finite source graph: source actualDD2, ordinary WASD + variable first freeX, keep one free before X/two live free after X, until first useful capture. No fixed object positions, no depth/cap cut. It stopped at the shortest positive above: 12344 expanded,17058 seen,4714 pending. It is **not exhausted**, because success stopped the run. Capture was tested before the no-cargo propagation filter. It rejected independent stacks/Prism contact and did not propagate ghost cargo or occupied-container fusion. Ordinary force conflicts were generated, but a branch that lost one free before capture could not meet the keep-two predicate.

Useful capture includes x13..16/y2..4, x13/14,y1 with a legal protected westward route to Fork11,1, or an already fork-bearing cargo. Row1 is not globally excluded. Blue15,1 is still a distinct dead end because pusher16,1 is Wall. The shortest positive happens at13,2 and retains the outside after taking Fork11,2, so does not depend on the bottom route.

Wall corrections: Blue13,5 is a real dead corner (west12,5 and north13,6 Wall). Blue13,4 or13,3 may retreat south to13,2, then move west from an eastern pusher. Do not exclude x13 wholesale. Rows5 atx13..17 cannot be pushed south because all corresponding row6 pusher positions are Wall.

## Unexecuted model boundaries

Shortest mixed BOX/PRISM stack sample `DDWXSAWDDAW`11: before last W, Blue14,4/Pri15,5, free14,3 and16,5 Fork0. Lower pushes Blue north; upper W hits north Wall and turns A to push Prism west, both land14,5. Two outside survive, but row6 Walls prevent the stacked objects from descending and no Goal is nearby. This is a model boundary, not a new actual fact or recommended transport probe. Public mixed-stack rules do not by themselves close its use here.

Prism contact is deliberately separate from Blue containment. A new possible probe from actual21 is root's `DDWWASDSASWX`: first9 moves Pri to12,2/out13,2 while retaining Blue11,2F1; SW sets cargo faceW and outside returns13,2; X creates north Blue11,3F1 and a right Blue child whose force sends Prism onto the stationary outside. Actual outcome is unknown. Never treat the generic BOX capture rule as an observed single-Prism container rule.

## Goal conditions, not deployed solutions

Goal3,15 has Wall2,15/4,15/3,16; its sole approach3,14 is SPIKE with no Fork. From cargo3,14F1, `WX` reaches the Goal. From cargo3,13F2, `AXWX` does so. A prefilled F0 head3,14 plus cargo3,13F1 can use `AX`; an outside3,13 can instead W-push the head and die at3,14. Resource helper fixed these conditions, not their initial deployment.

Resource helper's cargo11,3F2/W 26-tail `XXXDXXXWXXXXXXDXXXXWXXDXWX` is a valid conditional full tail with only Fork15,2/11,3 initially spent. Its F1 version is valid but misses the Goal. Applying the analogous path to actual21 after `DXW` likewise reaches a F0 head3,14 with no Goal. This does not exhaust different Fork/buffer distribution.

An optical conditional alternative is Pri3,14 + Bluecargo3,13F1/A: X pushes Prism onto Goal3,15 and places protected cargo at3,14. Source prism is initially remote and this transport is not closed. Direct actor mask0 must not be used to declare optical Goal failure; actual observation is required.

## Actual33 single-Prism containment and restored21

Owner performed actual21 + `DDWWASDSASWX`12. Actual32 matched the above pre-X pose. Actual33 confirmed PRISM92 at13,2 contains P94, active/ghost0/Fork0/height1, container92; the entity remains typePRISM/classPrism. Blue46/P93 at12,2F0, newBlue95/P96 at11,3F1; all three active contained, no outside. No dialog/conflict/completion. This is public KB M124's exact single-Prism passive-containment case. Model `finish` now accepts that case. Active Fork-bearing Prism X remains explicitly stopped, not inferred from Blue X.

Owner normalundo12 restored actual21, cumulative32undo/retry0. Neither33all-contained nor its body counts constitute a complete Goal solution.

## New Prism-first resource candidate after M124

The distinct first-Prism graph used actualDD2, ordinary + firstfreeX, preserving two live free until first capture, and accepts passive Prism capture. It stopped at a shortest positive:11961 expanded/16703 seen/4742 pending, not exhausted. No cap or depth cut. Wrong container type captures were not propagated. Independent stack/occupied merge/ghost propagation remain excluded; Prism Fork X is unmodeled.

Model21: `DDWWWDSSSAXAAWAADSSAA`.

| Count | Objects / actors |
|---|---|
| 10 | Blue14,4 / Pri15,3 / solo16,3F1/A |
| 11 X | Blue14,4 / Pri14,3 / free16,4 +15,3F0/A |
| 13 AA | Blue13,4 / Pri13,3 / free14,4/A +14,2/S |
| 15 WA | same objects / free13,5/A +14,2/S |
| 16 A | Blue13,3 empty / Pri13,2 cargoF0/A / outside13,4/S |
| 19 DSS | outside14,2, Pri unchanged |
| 20 A | Pri12,2 / outside13,2 |
| 21 A | Pri11,2 onSPIKE, model cargoF1/ghost0 / outside12,2 |

The owner subsequently performed this exact Prism-first21 and DX23. Actual21 verified Prism's SPIKE protection and Fork pickup: contained actor active/ghost0/Fork1. Actual23 verified active cargoX copies the Prism container with its actor: Pri92/P97 at11,3F1/D andnewPri98/P99 at11,1F1/D, both active/ghost0/contained1/height1/typePRISM/classPrism/Color1. Outside93 at13,2F0 remains alive; emptyBlue46 at13,3 remains. Cumulative51undo/retry0 preserves all prior histories.

The script now permits this observed Prism cargoX, but stops same-origin Prism overlaps as a separate boundary. Proposed next singleX24 (faceD) generates11,4F1,12,1F0 and two F0 Prisms at11,2. Whether the latter fuse as BOX copies do has not yet been observed at this report revision. No full Goal route is implied by this resource milestone; resource helper independently tests only fixed tails from actual23, not a competing full graph.

No completed Goal claim. Further Fork/cargo/Prism behavior is model-only until owner observations confirm it.

## Actual24 / 48 / 52 closure (later evidence)

The earlier unverified statements above record their original analysis date; they are superseded by these observed outcomes. Actual24 single X fused the two same-origin Fork0 Prisms at11,2: Pri98/P99 active Fork0, Pri100/P101 inactive at the same position, container98/height1. Pri92/P97 at11,4 Fork1, Pri102/P103 at12,1 Fork0 and the outside at13,2 stayed active. This establishes **Prism F0+F0 fusion**, not charged-Prism Fork addition.

Actual48 matched the complete fixed prefix:

`DDWWWDSSSAXAAWAADSSAADXXWXXDXXXWXXXXXXDXXXXWXXDX`

It retained Pri106/P107 at3,14 Fork0, Pri142/P143 at3,12 Fork1 and Pri144/P145 at7,12 Fork1. Outside93 was16,5 Fork0, emptyBlue13,4. All actors active/ghost0, 22 contained plus one outside. All Prism optical flags false and completed=false. Cumulative51undo/retry0.

A distinct actual48 macro graph allowed zero/one ordinary face before each X, tracked lower outside/body synchronization in the full hash, and targeted a direct Goal or charged rear3,13 behind old head3,14. One bounded round: **2500 expanded /2959 seen /459 pending /depthCut0**, no hit, not exhausted. It rejected 18 X-force conflicts and did not infer optical completion, charged Prism fusion or independent stacks. No cap increase.

Its shortest force boundary was48+`XWXX`. The first3 were fixed positive and then actually confirmed. Actual51 had charged Prisms4,11/6,11/8,11 Fork1/W and oldPri134/P135 at5,11 Fork0. SingleX52 produced real opposing cargo-X forces on that old Prism and **two branches**:

| Branch | OldPri134 /cargo135 | Winning newborn | Losing newborn | Common charged observer |
|---|---|---|---|---|
| axis0 A | 4,11 active | Pri148/P149 at5,11 active | Pri156/P157 at4,11 inactive/maskedoff1/contained0 | Pri158/P159 at9,11 F1/W |
| axis1 D | 6,11 active | Pri156/P157 at5,11 active | Pri148/P149 at6,11 inactive/maskedoff1/contained0 | Pri158/P159 at9,11 F1/W |

Pri152/P153 at7,11 active; same-origin154/P155 inactive after fusion; outside93 at15,5 alive. Head3,14/rear3,13 inherited. Both time52/completed=false. This verifies Prism cargo/cargo X-force branching for this case. The finite upper graph's rejection is a model boundary, not an actual failure; the script still stops that propagation rather than pretending an untested generic branch handler is exact.

## New empty-Prism-leading source and full optical MODEL114

Root constructed a different complete source prefix, independently fixed-replayed here:

`DDWWWASSWWDDDSAAWASDSWXDSSSAAWWASSDSAAADDDSAAAX` (47)

At34 it captures Blue14,1 Fork0 with Pri14,2/outside14,3. By39 Pri11,2 remains **empty**, so the Fork there is unconsumed. By46 the outside has west-pushed Blue to11,1, protected cargo takes Fork1 and the pusher dies at12,1 SPIKE. X47 pushes emptyPri11,2 to11,3 and puts Bluecargo at11,2, taking its still-active Fork to remain Fork1. No outside survives. This is a **model prefix**, not yet a reported actual47 execution. It differs from the all-Prism source48 and the prior relay source with already-consumed adjacent Forks.

One new empty-leading best-first macro round used zero/one ordinary face then X, cap6000/macrodepth40, and the optical target Pri3,15 plus south live cargo3,14. Result: **6000 expanded /9165 seen /3165 pending /depthCut0**, not exhausted, no hit;270 force-conflict transitions stopped,0 stack/occupied/Ghost. Session38174 completed. No cap increase. The following positive was assembled manually after this result, not obtained by repeating the search.

Resource helper fixed a26-turn relay:

`XXXXWXDXWXXAXWXAXXXWXDXWXX`

It changes the empty Prism's direction using old Fork0 Blue buffers, ending full73: emptyPri8,9 +chargedBlue9,9 Fork1/W. The additional hand-constructed41-turn relay is:

`XDXWXDXXXWXDXWXXXDXWXDXXXWXDXWXXXAXWXDXXX`

Full MODEL114:

`DDWWWASSWWDDDSAAWASDSWXDSSSAAWWASSDSAAADDDSAAAXXXXXWXDXWXXAXWXAXXXWXDXWXXXDXWXDXXXWXDXWXXXDXWXDXXXWXDXWXXXAXWXDXXX`

It fixed-replays valid with **0 stack/occupied/conflict/Ghost boundaries**. Final emptyPri3,15 and active/ghost0 Bluecargo3,14 Fork0. Direct actor mask remains0 because the Goal contains an empty Prism. The Goal's other three neighbors are actual Walls2,15/4,15/3,16; its sole open southern ray sees the adjacent live cargo3,14. This is a complete optical candidate supported by public M053/M054, **not a completed claim until owner reads game completion**.

| Full count | Empty Prism | Charged Blue Fork1 | Relay purpose |
|---|---|---|---|
| 47 | 11,3 | 11,2/A | empty leader preserves all upper Forks |
| 51 | 11,7 | 11,6/A | four north push-births |
| 58 | 9,7 | 10,7/W | east detour turns Prism west |
| 65 | 9,8 | 9,7/A | old10,6 buffer gains Fork10,5; southern pivot |
| 73 | 8,9 | 9,9/W | old10,8 buffer gains Fork11,8; eastern pivot |
| 74 | 7,9 | 8,9/W | one west push |
| 76 | 7,9 | 8,7/D | old8,8 buffer pushed south onto fresh Fork8,7 |
| 82 | 7,11 | 7,10/D | route through7,7/7,8 lifts Prism north |
| 84 | 7,11 | 9,10/W | old8,10 buffer pushed east onto fresh Fork9,10 |
| 90 | 5,11 | 6,11/W | north/east pivot turns Prism west |
| 92 | 5,11 | 6,9/D | old6,10 buffer pushed south onto fresh Fork6,9 |
| 98 | 5,13 | 5,12/D | route through5,9/5,10 lifts Prism north |
| 100 | 5,13 | 7,12/W | old6,12 buffer pushed east onto fresh Fork7,12 |
| 106 | 3,13 | 4,13/W |7,13→6,13 turns Prism west |
| 108 | 3,13 | 4,11/A | old4,12 buffer pushed south onto fresh Fork4,11 |
| 112 | 3,13 | 3,12/D |4,11→3,11 gives final north pusher |
| 113 | 3,14 | 3,13/D | new Blue stays Fork1 on fresh3,13 |
| 114 | **3,15 Goal** | none; Blue3,14F0 alive | Prism's only open ray sees adjacent live cargo |

Reproduce only the fixed proof, without search: `D:/nodejs/node.exe scratch/ch4-26-readonly.cjs optical114`. The function reports final optical predicate, compact checkpoints and boundary counters. No game or canonical writes are performed.

## Actual114 completed closure

The owner executed the complete114 optical route above, preserving prior21/23/48/52 and undo/probe histories. Latest main JSON observation and `completion` both have exactly the same114 instructions, timeline time114, **completed=true**. `run.action_count=114`, `run.completed=true`.

Direct fields independently read from the main artifact: empty **PRISM92 at3,15**, details **traversed=true/testCompleted=true**; south **Blue Color3 BOX187 at3,14**, containing **P188 active/ghost0/Fork0/contained1/container187** at3,14. No active charged actor or outside remains. Thus direct actor mask0 was correct for the model's limited predicate, but the observed optical Goal is complete. Empty-leading preservation of Forks and repeated old-F0-buffer replenishment supplied the legal whole route; neither Fork summation nor a charged-Prism fusion assumption was used in this successful route.

Final verification without search: `D:/nodejs/node.exe scratch/ch4-26-readonly.cjs actual114`. It checks real completion, exact instructions/time, Prism Goal position/light flags and adjacent protected live observer. This helper stops all4-26 searching. Save persistence and mainKB/progress remain solely the owner/root's work.
