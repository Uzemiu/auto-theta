# 2-13: candidate subsequently verified in normal play

2026-09-23 update: all 39 inputs below were executed successfully. At critical input 32 A, both players remained active and uncontained at [2,1]/[3,1], with the box at [1,1]; the final seven inputs reached both goals and completed=true. SaveSlot1 icecart=3 and total completed count=56. Actual evidence is artifacts/slot1-playthrough/2-13.json and the formal solution is knowledge/solutions/2-13.md. The original candidate reasoning below is retained as history, not as a still-pending execution request.

Candidate generated from the actual initial map with `root-ice-multi.cjs`, `merge_stable_only:true`, gate [4,1] controlled by OR of [6,1]/[7,1]. This is a model hypothesis pending actual validation, not a completed solution.

Complete 39-input sequence:

`WDAASSAWWDWDSSWWWWWWDSSSDSSSAASAWWWWWWD`

| Segment | Players afterward | Box |
| --- | --- | --- |
| `WDAASSA` | [5,1], [1,1] | [2,3] |
| `WWDWDSS` | [11,3], [3,2] | [3,1] |
| `WWWWWWD` | [8,5], [2,6] | [3,1] |
| `SSSDSSSAAS` | [9,1], [8,1] | [3,1] |
| `A` | [2,1], [3,1] | [1,1] |
| `WWWWWWD` | [2,6], [1,6] | [1,1] |

Critical input 32 A: both actors slide left along the bottom ice path. The first pushes the box and stops at [3,1]; the second should pass through that stationary actor, push the box again, and stop at [2,1]. The hypothesis permits transient same-facing overlap while one actor is still sliding, and merges actors only once both have stopped. No containment or worldline is intended. Stop on mismatch and preserve the actual result; do not replay the remaining suffix blindly.

The gate OR setting is supported by the earlier recorded-state replay comparison in `icecart-analysis-gates-note.md`, not an exhaustive proof of all gate timing. The search examined 26,351 distinct states. A candidate is not evidence of completion; actual gameplay and the saved completion record are still required.
