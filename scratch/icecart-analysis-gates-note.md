# 2-13 gate-model replay audit

Read-only audit using the actual 2-13 events. No live input, hints, implementation, or external solution was accessed.

Under the existing update model (a previous-microstep button occupant opens the gate; occupying the gate keeps it open):

- OR of buttons (6,1) and (7,1) matches every recorded stable observation before containment, including initial A -> one player (1,1), WDAASSA -> players (1,1)/(5,1), and the 31-input boxing precursor.
- Button 6 alone fails WDAASSA: predicts one merged player (5,1).
- Button 7 alone fails initial A: predicts one merged player (5,1). It matches the other recorded non-contained prefixes.
- AND fails both initial A and WDAASSA.

This supports retaining OR in the current observed-state model. It is not an independent proof of the true button pairing or complete gate timing. No additional BFS was run in this audit.

The one-box and fork models already permit player overlap with different facing directions. Their same-position, same-facing merge rule reproduces the audited observations. Containment and some moving-box collision behaviors remain outside the one-box model. Search failure is not evidence that the level is unsolvable.

Reproduce: `node scratch/icecart-analysis-gates.cjs`. The broader pre-containment replay is `node scratch/icecart-analysis-replay.cjs`.
