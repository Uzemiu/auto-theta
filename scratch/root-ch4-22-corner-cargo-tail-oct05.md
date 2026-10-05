# Constructed 4-22 corner cargo transport audit, 2026-10-05

This source is constructed, with no verified prefix: cargo at 3,4 (Fork1/key2/faceD), empty C4 at 3,5 and 3,6, empty Blue/C4 at 5,9 and 6,9, outside at 3,9 (Fork1/key2/faceA). Initial observed terrain and unopened locks are retained. This is not actual game state or completion evidence.

The private observed-rules model confirms that X produces cargo at 3,5 and 4,4, empty boxes at 3,6/3,7/5,9/6,9, and two free actors at 3,8 and 2,9. All six boxes remain present, but this does not prove transport.

One ordinary WASD audit, cap5000/depth45, exited successfully: expanded5000, seen9391, pending4391, depthCut0. No complete Goal coverage; greatest top-row cargo x was4. This is truncated. Force branches (26 outputs), independent stacks, occupied-cargo fusion and Ghost propagation were excluded. Do not raise this budget or interpret the negative as an impossibility result.

An empty head at6,9 is immediately against locked7,9, with walls at6,8/6,10. Under the current model it cannot open that lock without head cargo carrying a Key. This makes the proposed top buffer placement weak, rather than establishing a deployable route.

The five-box two-pusher transport sufficient condition supplied by the owner remains separate: boxes4..8 on row9, rightmost7/8 carrying the two cargo, free3,9 and2,9, openable top lock; DDDD can relay to cargo11/12. Six boxes are not a universal necessity when two free pushers are available.

Script: root-ch4-22-corner-cargo-tail-oct05.cjs. Full private result: results/root-ch4-22-corner-cargo-tail-oct05.json. No Bridge calls, save edits, or canonical KB edits.
