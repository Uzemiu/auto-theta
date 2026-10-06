# 3-21 COL7 Ghost-cargo local geometry

```json
{
  "scope": "Read-only independent cargo proposal; optical helper target not searched. Only actual8 public physical map and M066 freeGhost rules are used. COL rays are not introduced as facts, and Ghost cargo leaving DARK is a rejected unknown boundary.",
  "source": {
    "event": 34,
    "frame": 1264741,
    "time": 8,
    "instructions": "ASSWWWDX",
    "state": {
      "players": [
        {
          "id": 73,
          "pos": [
            5,
            5
          ],
          "face": "D",
          "ghost": 0,
          "contained": false,
          "Fork": 0
        },
        {
          "id": 95,
          "pos": [
            5,
            3
          ],
          "face": "D",
          "ghost": 0,
          "contained": false,
          "Fork": 0
        }
      ],
      "prism": [
        5,
        6
      ]
    }
  },
  "local": [
    {
      "pos": [
        2,
        10
      ],
      "terrain": "SOLID",
      "wall": false,
      "dark": true,
      "collection": false
    },
    {
      "pos": [
        2,
        9
      ],
      "terrain": "SOLID",
      "wall": false,
      "dark": true,
      "collection": false
    },
    {
      "pos": [
        2,
        8
      ],
      "terrain": "SPIKE",
      "wall": false,
      "dark": true,
      "collection": false
    },
    {
      "pos": [
        2,
        7
      ],
      "terrain": "SOLID",
      "wall": false,
      "dark": false,
      "collection": false
    },
    {
      "pos": [
        2,
        6
      ],
      "terrain": "SOLID",
      "wall": false,
      "dark": false,
      "collection": true
    },
    {
      "pos": [
        2,
        11
      ],
      "terrain": "SOLID",
      "wall": true,
      "dark": true,
      "collection": false
    },
    {
      "pos": [
        1,
        9
      ],
      "terrain": "SOLID",
      "wall": false,
      "dark": false,
      "collection": false
    },
    {
      "pos": [
        3,
        9
      ],
      "terrain": "SPIKE",
      "wall": false,
      "dark": true,
      "collection": false
    }
  ],
  "conditionalSSS": [
    {
      "input": 1,
      "action": "S",
      "from": {
        "cargo": [
          2,
          9
        ],
        "freeGhost": [
          2,
          10
        ]
      },
      "mechanicalDestinations": {
        "prism": [
          2,
          8
        ],
        "freeGhost": [
          2,
          9
        ]
      },
      "unknown": "Prism-cargo stepping onto SPIKE+DARK and possible COL optics. Do not assume actual active/ghost/contained persistence or unchanged DARK."
    },
    {
      "input": 2,
      "action": "S",
      "from": {
        "cargo": [
          2,
          8
        ],
        "freeGhost": [
          2,
          9
        ]
      },
      "mechanicalDestinations": {
        "prism": [
          2,
          7
        ],
        "freeGhost": [
          2,
          8
        ]
      },
      "unknown": "Cargo itself leaves DARK here, in second S. BOX M073 is precedent, not a proof for PRISM. Pusher stays in SPIKE+DARK."
    },
    {
      "input": 3,
      "action": "S",
      "from": {
        "cargo": [
          2,
          7
        ],
        "freeGhost": [
          2,
          8
        ]
      },
      "mechanicalDestinationsIfAllowed": {
        "prism": [
          2,
          6
        ],
        "freeGhost": [
          2,
          7
        ]
      },
      "ordinaryFreeGhostRule": "Ghost target2,7 is outside DARK, so source-based can-rule rejects S; next D reaches3,8 in DARK and does not move Prism. Pushing a Prism before Ghost movement refusal or optical revival would be a new actual boundary.",
      "unknown": "Do not predict COL pickup or grant Ghost-cargo escape. This is a calibration input only after actual first/second S states, not a three-step completion route."
    }
  ],
  "parity": {
    "source": [
      0,
      0
    ],
    "targetCargo2_9": 1,
    "targetFree2_10": 0,
    "necessary": "Both free actors moving one orthogonal cell per input preserve equal relative parity. First side-push capture requires opposite parity; some actual held, optical, or already-cargo behavior must intervene.",
    "ghostOnlyWaiting": [
      {
        "pos": [
          4,
          8
        ],
        "freeNeighbors": [
          [
            4,
            9
          ],
          [
            3,
            8
          ],
          [
            5,
            8
          ]
        ],
        "singlePrismCanFullyHold": false
      },
      {
        "pos": [
          4,
          9
        ],
        "freeNeighbors": [
          [
            3,
            9
          ],
          [
            4,
            8
          ],
          [
            5,
            9
          ]
        ],
        "singlePrismCanFullyHold": false
      },
      {
        "pos": [
          4,
          11
        ],
        "freeNeighbors": [
          [
            3,
            11
          ],
          [
            5,
            11
          ]
        ],
        "singlePrismCanFullyHold": false
      },
      {
        "pos": [
          3,
          10
        ],
        "freeNeighbors": [
          [
            3,
            11
          ],
          [
            2,
            10
          ],
          [
            3,
            9
          ]
        ],
        "singlePrismCanFullyHold": false
      },
      {
        "pos": [
          3,
          11
        ],
        "freeNeighbors": [
          [
            3,
            10
          ],
          [
            4,
            11
          ]
        ],
        "singlePrismCanFullyHold": false
      },
      {
        "pos": [
          2,
          10
        ],
        "freeNeighbors": [
          [
            2,
            9
          ],
          [
            3,
            10
          ]
        ],
        "singlePrismCanFullyHold": false
      },
      {
        "pos": [
          3,
          9
        ],
        "freeNeighbors": [
          [
            3,
            10
          ],
          [
            2,
            9
          ],
          [
            3,
            8
          ],
          [
            4,
            9
          ]
        ],
        "singlePrismCanFullyHold": false
      },
      {
        "pos": [
          2,
          9
        ],
        "freeNeighbors": [
          [
            2,
            10
          ],
          [
            2,
            8
          ],
          [
            3,
            9
          ]
        ],
        "singlePrismCanFullyHold": false
      },
      {
        "pos": [
          2,
          8
        ],
        "freeNeighbors": [
          [
            2,
            9
          ],
          [
            3,
            8
          ]
        ],
        "singlePrismCanFullyHold": false
      },
      {
        "pos": [
          5,
          9
        ],
        "freeNeighbors": [
          [
            4,
            9
          ],
          [
            5,
            8
          ],
          [
            6,
            9
          ]
        ],
        "singlePrismCanFullyHold": false
      },
      {
        "pos": [
          5,
          8
        ],
        "freeNeighbors": [
          [
            5,
            9
          ],
          [
            4,
            8
          ],
          [
            6,
            8
          ]
        ],
        "singlePrismCanFullyHold": false
      },
      {
        "pos": [
          6,
          9
        ],
        "freeNeighbors": [
          [
            5,
            9
          ],
          [
            6,
            8
          ]
        ],
        "singlePrismCanFullyHold": false
      },
      {
        "pos": [
          6,
          8
        ],
        "freeNeighbors": [
          [
            6,
            9
          ],
          [
            5,
            8
          ]
        ],
        "singlePrismCanFullyHold": false
      },
      {
        "pos": [
          5,
          11
        ],
        "freeNeighbors": [
          [
            4,
            11
          ]
        ],
        "singlePrismCanFullyHold": false
      },
      {
        "pos": [
          3,
          8
        ],
        "freeNeighbors": [
          [
            3,
            9
          ],
          [
            2,
            8
          ],
          [
            4,
            8
          ]
        ],
        "singlePrismCanFullyHold": false
      }
    ],
    "scope": "Static DARK, single Prism and no optical change. One-Prism-only blocking cannot hold any free Ghost in this recorded region. Alive corner waits are searched, not assumed impossible globally."
  },
  "search": {
    "cap": 8000,
    "expanded": 8000,
    "seen": 9359,
    "pending": 1359,
    "exhausted": false,
    "hit": false,
    "stats": {
      "differentForce": 0,
      "actorContact": 184,
      "outsideDarkCargo": 0,
      "nakedDeath": 0,
      "normalGoal": 0,
      "captureTransitions": 0,
      "heldTransitions": 0,
      "firstHeld": null,
      "firstCapture": null
    },
    "candidate": null
  },
  "limits": [
    "No Ghost passes Wall or unobserved nonDARK.",
    "No light-changing COL assumption or first-S revival.",
    "Different force and actor contact/merge rejected.",
    "No X, extra Fork, prism duplication or new worldline.",
    "M073 BOX-outside-DARK does not establish PRISM cargo collection.",
    "No-hit is only this bounded physical model, not the full game."
  ],
  "process": "foreground terminal with no checkpoint or background handle"
}
```
