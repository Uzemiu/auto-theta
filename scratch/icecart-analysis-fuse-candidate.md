# 2-17 offline candidate: left stack plus synchronized chain push

This file is an unverified proposal derived only from observed JSON and recorded mechanics. It does not control the game. No hint, game implementation, or external solution was used.

Start from the already observed state after the first W: players (6,3) and (6,11), seven boxes at x6 y4..10, one box (5,11).

Candidate setup: `ASDSAWWWASDSAWWWAADSAAWWAADWW`

Candidate conflict input after setup: `W`

Checkpoints in the candidate model:

| Actions from this start | Players | Boxes |
| --- | --- | --- |
| `ASDSAWWW` | (6,4), (6,11) | top row (4,11),(5,11); vertical x6 y5..10 |
| `ASDSAWWWASDSAWWW` | (6,5), (6,11) | top row x3..5 y11; vertical x6 y6..10 |
| `ASDSAWWWASDSAWWWAADSAAWW` | (6,6), (11,10) | top row x2..4 y11; vertical x6 y7..11 |
| `ASDSAWWWASDSAWWWAADSAAWWAADWW` | (6,2), (11,11) | top row x2..4 y11; vertical x6 y7..11 |

On final W, predicted microsteps are:

1. lower (6,3), upper (10,11)
2. lower (6,4), upper (9,11)
3. lower (6,5), upper (8,11)
4. lower (6,6), upper (7,11)
5. lower tries to push box (6,7) upward through shared vertical chain, while upper tries to push box (6,11) left.

This final event is two active player pushes, not a moving box's inertia opposing one player. Thus it is consistent with the previously observed shared-chain worldline split mechanic, though the orthogonal chain case still requires live validation.

Model caveats: no containment or key/fork handling, rejects player overlap and spike deaths, does not continue generated worldlines. Some ice/box collision ordering is inferred. Search failures are not proofs of unsolvability. The setup should be checked against live stable snapshots in short chunks.
