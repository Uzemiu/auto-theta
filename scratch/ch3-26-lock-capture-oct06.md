# Lock-assisted coincident spike/box capture candidate

```json
{
  "scope": "MODEL ONLY: strict ordinary two-live prefix with lock active; no death/capture/merge/force/stack allowed before proposed terminal. Terrain and gates are public observed fixtures. No optical update, GMID/runtime, containment resolution, or completion proof.",
  "source": {
    "path": "artifacts/slot1-playthrough/3-26.json",
    "event": 119,
    "frame": 43094,
    "time": 92,
    "instructions": "SSDSAAAAAAWWWDDSSDDDDDDSAAWWWDDWXWADAAAAAAAAAAAWADSSSSSSSDSSWDDSSAWWWAAAAAAAAWWWAASSSSADSDSS"
  },
  "fixture": {
    "lockActive": true,
    "lockPos": [
      4,
      2
    ],
    "wall4_3": true,
    "targetSpike": "SPIKE",
    "pre70Free": true,
    "pre84Free": true,
    "box65": {
      "id": 65,
      "x": 6,
      "y": 1
    },
    "box66": {
      "id": 66,
      "x": 8,
      "y": 1
    }
  },
  "limit": 100000,
  "totalExpanded": 5276,
  "unknownCounts": {
    "spike-boundary-unmodeled-capture": 2512,
    "forbidden-container-motion": 870,
    "new-player-merge": 147,
    "lock-open": 81
  },
  "fixed": {
    "phase": "all-five-containers-fixed",
    "expanded": 1743,
    "seen": 1743,
    "pending": 0,
    "exhausted": true,
    "hit": false,
    "path": null,
    "trace": [],
    "terminal": null,
    "stats": {
      "acceptedTransitions": 5733,
      "transitionsWithHeld": 0,
      "transitionsWithExactlyOneHeld": 0,
      "parityMismatch": 0,
      "firstHeld": null
    }
  },
  "mobile": {
    "phase": "only-box65-mobile",
    "expanded": 3533,
    "seen": 3533,
    "pending": 0,
    "exhausted": true,
    "hit": false,
    "path": null,
    "trace": [],
    "terminal": null,
    "stats": {
      "acceptedTransitions": 11761,
      "transitionsWithHeld": 0,
      "transitionsWithExactlyOneHeld": 0,
      "parityMismatch": 0,
      "firstHeld": null
    }
  },
  "parityReasoning": {
    "source70Parity": 0,
    "source84Parity": 0,
    "target70Parity": 1,
    "target84Parity": 0,
    "necessaryException": "A single actor must hold or another nonordinary transition must change the relative parity before a side-push capture. With both actors moving exactly one orthogonal cell per input, parity equality is invariant. A captured actor starts one cell from the collision destination, while the side-pushing actor starts two cells from it, requiring opposite relative parity.",
    "scope": "This proves the restricted ordinary graph target impossible. It does not rule out ordinary prefixes using other moved containers to trap/hold one actor, other already observed mechanics, or the game as a whole."
  }
}
```
