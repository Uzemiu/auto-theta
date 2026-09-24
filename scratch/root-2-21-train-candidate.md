# 2-21 train candidate: subsequently verified

2026-09-23 update: the full 164-input route below was executed normally and completed 2-21. All seven checkpoints matched; SaveSlot1 train1=3 and the total became 55. Actual evidence is in artifacts/slot1-playthrough/2-21.json and the formal solution in knowledge/solutions/2-21.md. The following paragraphs preserve the original candidate assumptions; they are no longer an outstanding execution request. The transient receipt at events[20] contains two distinct players at [24,8], followed by a stable observation with both still present at different cells; the exact universal microstep merge rule remains a model interpretation.

This 164-input candidate uses only the observed initial map. It depends on merge_stable_only: a sliding actor may pass a stationary actor without immediately merging. Both-stopped overlap merges regardless of facing, consistent with known ordinary-ground examples. The sliding timing still needs an actual experiment. Top button pairing is observed; middle/bottom/exit pairings are geometrical hypotheses pending validation. No hint, implementation, or external solution was used.

The old WAADSSDX prefix moved the middle boxes prematurely. This new prefix preserves them for the later three-person queue.

Complete candidate: `WAAXSDDDSAWWAWDDDDSSWDDDDDDXDWWAAAAAAAAAAAAAAAAAASSSSSSSDDDDDSSWDDDDDDXDDWWWWAAAAAAAAAAAAAAAAAASSSSSSSSSSSDDDSSWDDDDDDXDDDWWWWWWAAAAAAAAAAAAAAAAAASSSSSSSSAAAAAWWWWW`

| Stage | Inputs | Total | Predicted players |
| --- | --- | --- | --- |
| Top queue | `WAAXSDDDSAWWAWDDDDSSW` | 21 | [[17, 8], [18, 8]] |
| First fork and return | `DDDDDDXDWW` | 31 | [[22, 10], [23, 10], [24, 10]] |
| Middle queue | `AAAAAAAAAAAAAAAAAASSSSSSSDDDDDSSW` | 64 | [[16, 5], [17, 5], [18, 5]] |
| Second fork and return | `DDDDDDXDDWWWW` | 77 | [[21, 10], [22, 10], [23, 10], [24, 10]] |
| Bottom queue | `AAAAAAAAAAAAAAAAAASSSSSSSSSSSDDDSSW` | 112 | [[15, 2], [16, 2], [17, 2], [18, 2]] |
| Third fork and return | `DDDDDDXDDDWWWWWW` | 128 | [[20, 10], [21, 10], [22, 10], [23, 10], [24, 10]] |
| Five goals | `AAAAAAAAAAAAAAAAAASSSSSSSSAAAAAWWWWW` | 164 | [[1, 3], [1, 4], [1, 5], [1, 6], [1, 7]] |

Use short verified batches. Especially verify input 20 S, when two same-facing players pass and push the top box successively, ending at [17,7]/[18,7]. Stop on mismatch. Do not overwrite the existing failed experiment or treat this file as completion evidence.

Each cart lane is used once. Right-side ICE at [24,2]/[24,5]/[24,8] lets the growing train turn while preserving spacing. For the final return, use exactly five A after the eight S; a sixth A loses one actor.
