# 2-16 Collection NID4: unverified offline candidate

The target is the observed active Collection NID4 at (7,5). Its name and whether it counts as a star remain unknown pending actual collection and save verification.

Source: initial map in `artifacts/slot1-playthrough/2-16.json`, recorded mechanics including M040. Generated with the existing observed-state one-box-fork model, changing only its goal to (7,5). No live inputs, hints, hidden implementation, or external solution were used.

From the initial player (8,1), the 34-input candidate is:

`WWWWWWWWWAWDXDSSADSAWDSAWWASAASAAS`

| Segment | Predicted players afterward | Predicted box |
| --- | --- | --- |
| `WWWWWWWWW` | (3,9), fork 1 | (3,10) |
| `AWDXDSSA` | (3,9), (3,7) | (4,8) |
| `DSAWDSA` | (1,7), (9,5) | (4,7) |
| `WWAS` | (1,7), (9,7) | (3,7) |
| `A` | (3,7), (6,7) | (5,7) |
| `A` | (1,7), (5,7) | (3,7) |
| `S` | (3,7), (5,6) | (9,7) |
| `A` | (1,7), (5,5) | (9,7) |
| `A` | (3,7), (6,5) | (9,7) |
| `S` | (3,3), (7,5) | (9,7) |

The key new validation is input 29 A: the left player bounces right from (1,7), while the right player moves left from (9,7). Their interaction with the box should reproduce M040's cancellation, leaving the box (5,7) and players (3,7)/(6,7), without containment or worldline split.

Input 30 A then lets the right player push the box left and stop at (5,7). The actual map has SOLID at (3,7), not ICE, so the box stops there rather than continuing into the left player. The next input enters the collection chamber through (5,6). This route avoids SPIKE (5,8).

All coordinates above are model predictions, not completed collection evidence. Verify stable states in short chunks and stop on mismatch. At (7,5), inspect the actual pickup UI and persistence of Collections[4] plus the star count; do not infer collectible type from the coordinate or NID alone.

Full model trace: `scratch/icecart-analysis-lag-result.json`.
