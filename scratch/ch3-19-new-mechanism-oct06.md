# 3-19 new mechanism audit

```json
{
  "scope": "Read-only new mechanism audit. No new game observations, completion credit, save or primary knowledge edits.",
  "source": {
    "event": 59,
    "frame": 555914,
    "time": 52,
    "instructions": "WWSAWDDDDDWWDWXDWWDSSSWWAWWWDSSSWWAAAASWWDDWAADSSWDA"
  },
  "audit": {
    "freshSourceEvent": 51,
    "freshFrame": 469936,
    "types": [
      "SOLID",
      "GOAL",
      "LOCK",
      "BUTTONGATE",
      "BUTTON",
      "KEY",
      "PLAYER",
      "BOX"
    ],
    "prisms": 0,
    "dark": 0,
    "ice": 0,
    "initialForkItems": 1,
    "forkItem": [
      2,
      1
    ],
    "ordinaryKeyItem": [
      5,
      5
    ],
    "boxes": 6,
    "boxColor": 3,
    "mechanismGaps": [
      {
        "name": "Simultaneous spike/box/key",
        "status": "unverified in3-19",
        "evidence": "Actual event9: naked arrival gets key then inactive. Event19: empty box over still-active key does not collect. Event28: already-contained active cargo arrives spike and collects safely. M092 same-tick capture+spike exists elsewhere but does not establish this triple event."
      },
      {
        "name": "External different-direction force",
        "status": "excluded by old model and not tested at actual53 D",
        "evidence": "Both requests shown in forceProbe. Actual Color3 force rules from chapter2 and cargo inheritance from M095 suggest a real branch probe, but exact result is not inferred."
      },
      {
        "name": "Container/newborn X capture",
        "status": "resource prerequisite absent in ordinary fresh domain",
        "evidence": "Exactly one initial fork; first free X spends it and all children have fork0. No initial cargo and no second fork. Fourth-chapter forks/cargo-X copies cannot be silently granted here."
      },
      {
        "name": "Prism container optical/key rules",
        "status": "no direct prism optical fixture in this level",
        "evidence": "All six containers are actual BOX/Color3; no PRISM or DARK or ICE in fresh. No optical shortcut is inferred."
      }
    ],
    "oldModelGaps": [
      "Opposing/perpendicular force rejects instead of branching",
      "Different-source new stacking rejects",
      "SPIKE actor removed before coincident moving-container capture",
      "cargo X with fork rejects",
      "complex gate occupancy approximated",
      "resource merge uses max only"
    ]
  },
  "calibration": {
    "actualEvent": 61,
    "actualFrame": 557892,
    "input": "W",
    "ordinaryHoldCorrection": "Actual51/52/53 trapped actor changes face with input while held. The old public model copied its prior face unchanged. Corrected locally; no shared model edits. In this Fork0 domain the correction does not change movement or visited resource signatures.",
    "matchPlayers": true,
    "matchBoxes": true,
    "model": {
      "players": [
        {
          "at": [
            6,
            4
          ],
          "face": "W",
          "fork": 0,
          "contained": false,
          "container": null,
          "key": 0
        },
        {
          "at": [
            8,
            4
          ],
          "face": "W",
          "fork": 0,
          "contained": false,
          "container": null,
          "key": 0
        }
      ],
      "boxes": [
        {
          "id": 64,
          "at": [
            7,
            4
          ]
        },
        {
          "id": 65,
          "at": [
            8,
            1
          ]
        },
        {
          "id": 66,
          "at": [
            6,
            5
          ]
        },
        {
          "id": 67,
          "at": [
            9,
            4
          ]
        },
        {
          "id": 68,
          "at": [
            8,
            3
          ]
        },
        {
          "id": 69,
          "at": [
            9,
            5
          ]
        }
      ],
      "collectedMask": 0,
      "lockMask": 0
    },
    "actual": {
      "players": [
        {
          "at": [
            6,
            4
          ],
          "face": "W",
          "fork": 0,
          "contained": false,
          "container": null,
          "key": 0
        },
        {
          "at": [
            8,
            4
          ],
          "face": "W",
          "fork": 0,
          "contained": false,
          "container": null,
          "key": 0
        }
      ],
      "boxes": [
        {
          "id": 64,
          "at": [
            7,
            4
          ]
        },
        {
          "id": 65,
          "at": [
            8,
            1
          ]
        },
        {
          "id": 66,
          "at": [
            6,
            5
          ]
        },
        {
          "id": 67,
          "at": [
            9,
            4
          ]
        },
        {
          "id": 68,
          "at": [
            8,
            3
          ]
        },
        {
          "id": 69,
          "at": [
            9,
            5
          ]
        }
      ]
    }
  },
  "forceProbe": {
    "source": {
      "event": 61,
      "frame": 557892,
      "time": 53,
      "instructions": "WWSAWDDDDDWWDWXDWWDSSSWWAWWWDSSSWWAAAASWWDDWAADSSWDAW"
    },
    "action": "D",
    "knownGeometry": {
      "leftPlayer": [
        6,
        4
      ],
      "rightPlayer": [
        8,
        4
      ],
      "box64": [
        7,
        4
      ],
      "box67": [
        9,
        4
      ],
      "wall10_4": true,
      "wall8_5": true
    },
    "requests": [
      {
        "player": 63,
        "direction": "D",
        "box": 64,
        "boxDestination": [
          8,
          4
        ],
        "playerDestination": [
          7,
          4
        ]
      },
      {
        "player": 70,
        "direction": "A",
        "box": 64,
        "boxDestination": [
          6,
          4
        ],
        "playerDestination": [
          7,
          4
        ],
        "fallback": [
          "D blocked by BOX67 backed by Wall10,4",
          "W blocked by Wall8,5",
          "A can push BOX64 left"
        ]
      }
    ],
    "scope": "Single unknown force-resolution input after a fully actually verified53 prefix. Different directions request the same Color3 BOX. The old ordinary model rejects this edge. Actual branch axes, masked actors, cargo and future recovery remain uncalibrated."
  },
  "newContactDomain": {
    "source": "Actual52 after precisely one verified trap-wait input, opposite player parity. This is not the old39/53 key-cargo search or old clear-column graph.",
    "limit": 30000,
    "depthCap": 35,
    "expanded": 30000,
    "seen": 43914,
    "pending": 13914,
    "exhausted": false,
    "hit": false,
    "unknown": {
      "rejected": 2511,
      "ordinaryCapture": 3736,
      "ordinaryKey": 0
    },
    "candidate": null
  },
  "process": "foreground terminal; no checkpoint or background search"
}
```
