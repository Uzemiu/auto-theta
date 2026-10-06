# Fresh Chapter2 direct 2-P / 2-Q entry search

```json
{
  "scope": "MODEL ONLY, direct any active uncontained PLAYER at ENTRY 2-P or 2-Q. Initial X location unrestricted. SPIKE deaths rejected and all old uncertain-cross/perpendicular/conflict boundaries retained. No global no-solution claim and no actual entered/completed credit.",
  "source": {
    "event": 542,
    "frame": 358019,
    "level": "Chapter2",
    "instructions": "",
    "start": {
      "players": [
        {
          "id": 306,
          "at": [
            82,
            7
          ],
          "face": 2,
          "fork": 1,
          "contained": 0
        }
      ],
      "boxes": [
        {
          "id": 344,
          "at": [
            45,
            15
          ]
        }
      ]
    }
  },
  "targets": [
    [
      "84,28",
      "2-P"
    ],
    [
      "80,24",
      "2-Q"
    ]
  ],
  "cap": 40000,
  "depthCap": 100,
  "expanded": 40000,
  "seen": 42407,
  "pending": 10119,
  "exhausted": false,
  "hit": null,
  "closest": {
    "distance": 6,
    "sequence": "WWWWWWWWWWWAAAAAAASA",
    "state": {
      "players": [
        {
          "id": 306,
          "at": [
            75,
            16
          ],
          "face": 2,
          "fork": 1,
          "contained": 0
        }
      ],
      "boxes": [
        {
          "id": 344,
          "at": [
            45,
            15
          ]
        }
      ]
    }
  },
  "unknown": {
    "spikeDeathRejected": 44,
    "modelNull": 36115,
    "noFreeActor": 0
  },
  "modelStats": {
    "death": 44,
    "brakes": 0,
    "capture": 7,
    "perpendicular": 0,
    "conflict": 1,
    "merge": 164,
    "uncertainCross": 13,
    "entry": 380,
    "loop": 0
  },
  "optimisticOrdering": {
    "cells": 1079,
    "canReachTarget": 895,
    "sourceDistance": 26,
    "weight": 2.5,
    "scope": "Arbitrary ICE stops and arbitrary first directions used only as optimistic ordering, never as an execution route."
  },
  "replay": null,
  "witnessSupplement": {
    "scope": "At most the first5000 expansions of the same fresh graph replayed solely to extract boundary witnesses, not an enlarged P/Q budget. The original process was terminal and had no live q handle.",
    "source": {
      "event": 542,
      "frame": 358019,
      "level": "Chapter2",
      "instructions": "",
      "start": {
        "players": [
          {
            "id": 306,
            "at": [
              82,
              7
            ],
            "face": 2,
            "fork": 1,
            "contained": 0
          }
        ],
        "boxes": [
          {
            "id": 344,
            "at": [
              45,
              15
            ]
          }
        ]
      }
    },
    "expanded": 5000,
    "seen": 6274,
    "pending": 1902,
    "unknown": {
      "spikeDeathRejected": 0,
      "modelNull": 4672,
      "noFreeActor": 0
    },
    "modelStats": {
      "death": 0,
      "brakes": 0,
      "capture": 4,
      "perpendicular": 0,
      "conflict": 0,
      "merge": 59,
      "uncertainCross": 10,
      "entry": 70,
      "loop": 0,
      "lastBoundary": {
        "kind": "one-moving-one-stopped-or-unverified-player-cross",
        "tick": 59,
        "input": "A",
        "before": {
          "p": [
            {
              "id": 306,
              "x": 16,
              "y": 15,
              "face": 1,
              "fork": 0,
              "md": 1
            },
            {
              "id": 306.1,
              "x": 17,
              "y": 15,
              "face": 1,
              "fork": 0,
              "md": 1
            }
          ],
          "b": [
            {
              "id": 344,
              "x": 15,
              "y": 15,
              "md": -1
            }
          ]
        },
        "crossingPair": [
          {
            "id": 306,
            "x": 16,
            "y": 15,
            "face": 1,
            "fork": 0,
            "md": -1
          },
          {
            "id": 306.1,
            "x": 16,
            "y": 15,
            "face": 1,
            "fork": 0,
            "md": 1
          }
        ],
        "plannedPlayers": [
          {
            "id": 306,
            "x": 16,
            "y": 15,
            "face": 1,
            "fork": 0,
            "md": -1
          },
          {
            "id": 306.1,
            "x": 16,
            "y": 15,
            "face": 1,
            "fork": 0,
            "md": 1
          }
        ]
      }
    },
    "witnesses": {
      "capture": {
        "source": {
          "event": 542,
          "frame": 358019,
          "level": "Chapter2",
          "instructions": "",
          "start": {
            "players": [
              {
                "id": 306,
                "at": [
                  82,
                  7
                ],
                "face": 2,
                "fork": 1,
                "contained": 0
              }
            ],
            "boxes": [
              {
                "id": 344,
                "at": [
                  45,
                  15
                ]
              }
            ]
          }
        },
        "preSequence": "WWWWWWWWWWWAAAAAAASAXS",
        "action": "A",
        "sequence": "WWWWWWWWWWWAAAAAAASAXSA",
        "preState": {
          "players": [
            {
              "id": 306,
              "at": [
                76,
                15
              ],
              "face": 3,
              "fork": 0,
              "contained": 0
            },
            {
              "id": 306.1,
              "at": [
                15,
                15
              ],
              "face": 2,
              "fork": 0,
              "contained": 0
            }
          ],
          "boxes": [
            {
              "id": 344,
              "at": [
                45,
                15
              ]
            }
          ]
        },
        "predictedPostState": {
          "players": [
            {
              "id": 306,
              "at": [
                76,
                15
              ],
              "face": 1,
              "fork": 0,
              "contained": 344
            },
            {
              "id": 306.1,
              "at": [
                45,
                15
              ],
              "face": 3,
              "fork": 0,
              "contained": 0
            }
          ],
          "boxes": [
            {
              "id": 344,
              "at": [
                76,
                15
              ]
            }
          ]
        },
        "terminalTrace": [
          {
            "tick": 0,
            "p": [
              {
                "id": 306,
                "x": 75,
                "y": 15,
                "face": 1,
                "fork": 0,
                "md": 1
              },
              {
                "id": 306.1,
                "x": 16,
                "y": 15,
                "face": 3,
                "fork": 0,
                "md": 3
              }
            ],
            "b": [
              {
                "id": 344,
                "x": 45,
                "y": 15,
                "md": -1
              }
            ],
            "requested": []
          },
          {
            "tick": 1,
            "p": [
              {
                "id": 306,
                "x": 74,
                "y": 15,
                "face": 1,
                "fork": 0,
                "md": 1
              },
              {
                "id": 306.1,
                "x": 17,
                "y": 15,
                "face": 3,
                "fork": 0,
                "md": 3
              }
            ],
            "b": [
              {
                "id": 344,
                "x": 45,
                "y": 15,
                "md": -1
              }
            ],
            "requested": []
          },
          {
            "tick": 2,
            "p": [
              {
                "id": 306,
                "x": 73,
                "y": 15,
                "face": 1,
                "fork": 0,
                "md": 1
              },
              {
                "id": 306.1,
                "x": 18,
                "y": 15,
                "face": 3,
                "fork": 0,
                "md": 3
              }
            ],
            "b": [
              {
                "id": 344,
                "x": 45,
                "y": 15,
                "md": -1
              }
            ],
            "requested": []
          },
          {
            "tick": 3,
            "p": [
              {
                "id": 306,
                "x": 72,
                "y": 15,
                "face": 1,
                "fork": 0,
                "md": 1
              },
              {
                "id": 306.1,
                "x": 19,
                "y": 15,
                "face": 3,
                "fork": 0,
                "md": 3
              }
            ],
            "b": [
              {
                "id": 344,
                "x": 45,
                "y": 15,
                "md": -1
              }
            ],
            "requested": []
          },
          {
            "tick": 4,
            "p": [
              {
                "id": 306,
                "x": 71,
                "y": 15,
                "face": 1,
                "fork": 0,
                "md": 1
              },
              {
                "id": 306.1,
                "x": 20,
                "y": 15,
                "face": 3,
                "fork": 0,
                "md": 3
              }
            ],
            "b": [
              {
                "id": 344,
                "x": 45,
                "y": 15,
                "md": -1
              }
            ],
            "requested": []
          },
          {
            "tick": 5,
            "p": [
              {
                "id": 306,
                "x": 70,
                "y": 15,
                "face": 1,
                "fork": 0,
                "md": 1
              },
              {
                "id": 306.1,
                "x": 21,
                "y": 15,
                "face": 3,
                "fork": 0,
                "md": 3
              }
            ],
            "b": [
              {
                "id": 344,
                "x": 45,
                "y": 15,
                "md": -1
              }
            ],
            "requested": []
          },
          {
            "tick": 6,
            "p": [
              {
                "id": 306,
                "x": 69,
                "y": 15,
                "face": 1,
                "fork": 0,
                "md": 1
              },
              {
                "id": 306.1,
                "x": 22,
                "y": 15,
                "face": 3,
                "fork": 0,
                "md": 3
              }
            ],
            "b": [
              {
                "id": 344,
                "x": 45,
                "y": 15,
                "md": -1
              }
            ],
            "requested": []
          },
          {
            "tick": 7,
            "p": [
              {
                "id": 306,
                "x": 68,
                "y": 15,
                "face": 1,
                "fork": 0,
                "md": 1
              },
              {
                "id": 306.1,
                "x": 23,
                "y": 15,
                "face": 3,
                "fork": 0,
                "md": 3
              }
            ],
            "b": [
              {
                "id": 344,
                "x": 45,
                "y": 15,
                "md": -1
              }
            ],
            "requested": []
          },
          {
            "tick": 8,
            "p": [
              {
                "id": 306,
                "x": 67,
                "y": 15,
                "face": 1,
                "fork": 0,
                "md": 1
              },
              {
                "id": 306.1,
                "x": 24,
                "y": 15,
                "face": 3,
                "fork": 0,
                "md": 3
              }
            ],
            "b": [
              {
                "id": 344,
                "x": 45,
                "y": 15,
                "md": -1
              }
            ],
            "requested": []
          },
          {
            "tick": 9,
            "p": [
              {
                "id": 306,
                "x": 66,
                "y": 15,
                "face": 1,
                "fork": 0,
                "md": 1
              },
              {
                "id": 306.1,
                "x": 25,
                "y": 15,
                "face": 3,
                "fork": 0,
                "md": 3
              }
            ],
            "b": [
              {
                "id": 344,
                "x": 45,
                "y": 15,
                "md": -1
              }
            ],
            "requested": []
          },
          {
            "tick": 10,
            "p": [
              {
                "id": 306,
                "x": 65,
                "y": 15,
                "face": 1,
                "fork": 0,
                "md": 1
              },
              {
                "id": 306.1,
                "x": 26,
                "y": 15,
                "face": 3,
                "fork": 0,
                "md": 3
              }
            ],
            "b": [
              {
                "id": 344,
                "x": 45,
                "y": 15,
                "md": -1
              }
            ],
            "requested": []
          },
          {
            "tick": 11,
            "p": [
              {
                "id": 306,
                "x": 64,
                "y": 15,
                "face": 1,
                "fork": 0,
                "md": 1
              },
              {
                "id": 306.1,
                "x": 27,
                "y": 15,
                "face": 3,
                "fork": 0,
                "md": 3
              }
            ],
            "b": [
              {
                "id": 344,
                "x": 45,
                "y": 15,
                "md": -1
              }
            ],
            "requested": []
          },
          {
            "tick": 12,
            "p": [
              {
                "id": 306,
                "x": 63,
                "y": 15,
                "face": 1,
                "fork": 0,
                "md": 1
              },
              {
                "id": 306.1,
                "x": 28,
                "y": 15,
                "face": 3,
                "fork": 0,
                "md": 3
              }
            ],
            "b": [
              {
                "id": 344,
                "x": 45,
                "y": 15,
                "md": -1
              }
            ],
            "requested": []
          },
          {
            "tick": 13,
            "p": [
              {
                "id": 306,
                "x": 62,
                "y": 15,
                "face": 1,
                "fork": 0,
                "md": 1
              },
              {
                "id": 306.1,
                "x": 29,
                "y": 15,
                "face": 3,
                "fork": 0,
                "md": 3
              }
            ],
            "b": [
              {
                "id": 344,
                "x": 45,
                "y": 15,
                "md": -1
              }
            ],
            "requested": []
          },
          {
            "tick": 14,
            "p": [
              {
                "id": 306,
                "x": 61,
                "y": 15,
                "face": 1,
                "fork": 0,
                "md": 1
              },
              {
                "id": 306.1,
                "x": 30,
                "y": 15,
                "face": 3,
                "fork": 0,
                "md": 3
              }
            ],
            "b": [
              {
                "id": 344,
                "x": 45,
                "y": 15,
                "md": -1
              }
            ],
            "requested": []
          },
          {
            "tick": 15,
            "p": [
              {
                "id": 306,
                "x": 60,
                "y": 15,
                "face": 1,
                "fork": 0,
                "md": 1
              },
              {
                "id": 306.1,
                "x": 31,
                "y": 15,
                "face": 3,
                "fork": 0,
                "md": 3
              }
            ],
            "b": [
              {
                "id": 344,
                "x": 45,
                "y": 15,
                "md": -1
              }
            ],
            "requested": []
          },
          {
            "tick": 16,
            "p": [
              {
                "id": 306,
                "x": 59,
                "y": 15,
                "face": 1,
                "fork": 0,
                "md": 1
              },
              {
                "id": 306.1,
                "x": 32,
                "y": 15,
                "face": 3,
                "fork": 0,
                "md": 3
              }
            ],
            "b": [
              {
                "id": 344,
                "x": 45,
                "y": 15,
                "md": -1
              }
            ],
            "requested": []
          },
          {
            "tick": 17,
            "p": [
              {
                "id": 306,
                "x": 58,
                "y": 15,
                "face": 1,
                "fork": 0,
                "md": 1
              },
              {
                "id": 306.1,
                "x": 33,
                "y": 15,
                "face": 3,
                "fork": 0,
                "md": 3
              }
            ],
            "b": [
              {
                "id": 344,
                "x": 45,
                "y": 15,
                "md": -1
              }
            ],
            "requested": []
          },
          {
            "tick": 18,
            "p": [
              {
                "id": 306,
                "x": 57,
                "y": 15,
                "face": 1,
                "fork": 0,
                "md": 1
              },
              {
                "id": 306.1,
                "x": 34,
                "y": 15,
                "face": 3,
                "fork": 0,
                "md": 3
              }
            ],
            "b": [
              {
                "id": 344,
                "x": 45,
                "y": 15,
                "md": -1
              }
            ],
            "requested": []
          },
          {
            "tick": 19,
            "p": [
              {
                "id": 306,
                "x": 56,
                "y": 15,
                "face": 1,
                "fork": 0,
                "md": 1
              },
              {
                "id": 306.1,
                "x": 35,
                "y": 15,
                "face": 3,
                "fork": 0,
                "md": 3
              }
            ],
            "b": [
              {
                "id": 344,
                "x": 45,
                "y": 15,
                "md": -1
              }
            ],
            "requested": []
          },
          {
            "tick": 20,
            "p": [
              {
                "id": 306,
                "x": 55,
                "y": 15,
                "face": 1,
                "fork": 0,
                "md": 1
              },
              {
                "id": 306.1,
                "x": 36,
                "y": 15,
                "face": 3,
                "fork": 0,
                "md": 3
              }
            ],
            "b": [
              {
                "id": 344,
                "x": 45,
                "y": 15,
                "md": -1
              }
            ],
            "requested": []
          },
          {
            "tick": 21,
            "p": [
              {
                "id": 306,
                "x": 54,
                "y": 15,
                "face": 1,
                "fork": 0,
                "md": 1
              },
              {
                "id": 306.1,
                "x": 37,
                "y": 15,
                "face": 3,
                "fork": 0,
                "md": 3
              }
            ],
            "b": [
              {
                "id": 344,
                "x": 45,
                "y": 15,
                "md": -1
              }
            ],
            "requested": []
          },
          {
            "tick": 22,
            "p": [
              {
                "id": 306,
                "x": 53,
                "y": 15,
                "face": 1,
                "fork": 0,
                "md": 1
              },
              {
                "id": 306.1,
                "x": 38,
                "y": 15,
                "face": 3,
                "fork": 0,
                "md": 3
              }
            ],
            "b": [
              {
                "id": 344,
                "x": 45,
                "y": 15,
                "md": -1
              }
            ],
            "requested": []
          },
          {
            "tick": 23,
            "p": [
              {
                "id": 306,
                "x": 52,
                "y": 15,
                "face": 1,
                "fork": 0,
                "md": 1
              },
              {
                "id": 306.1,
                "x": 39,
                "y": 15,
                "face": 3,
                "fork": 0,
                "md": 3
              }
            ],
            "b": [
              {
                "id": 344,
                "x": 45,
                "y": 15,
                "md": -1
              }
            ],
            "requested": []
          },
          {
            "tick": 24,
            "p": [
              {
                "id": 306,
                "x": 51,
                "y": 15,
                "face": 1,
                "fork": 0,
                "md": 1
              },
              {
                "id": 306.1,
                "x": 40,
                "y": 15,
                "face": 3,
                "fork": 0,
                "md": 3
              }
            ],
            "b": [
              {
                "id": 344,
                "x": 45,
                "y": 15,
                "md": -1
              }
            ],
            "requested": []
          },
          {
            "tick": 25,
            "p": [
              {
                "id": 306,
                "x": 50,
                "y": 15,
                "face": 1,
                "fork": 0,
                "md": 1
              },
              {
                "id": 306.1,
                "x": 41,
                "y": 15,
                "face": 3,
                "fork": 0,
                "md": 3
              }
            ],
            "b": [
              {
                "id": 344,
                "x": 45,
                "y": 15,
                "md": -1
              }
            ],
            "requested": []
          },
          {
            "tick": 26,
            "p": [
              {
                "id": 306,
                "x": 49,
                "y": 15,
                "face": 1,
                "fork": 0,
                "md": 1
              },
              {
                "id": 306.1,
                "x": 42,
                "y": 15,
                "face": 3,
                "fork": 0,
                "md": 3
              }
            ],
            "b": [
              {
                "id": 344,
                "x": 45,
                "y": 15,
                "md": -1
              }
            ],
            "requested": []
          },
          {
            "tick": 27,
            "p": [
              {
                "id": 306,
                "x": 48,
                "y": 15,
                "face": 1,
                "fork": 0,
                "md": 1
              },
              {
                "id": 306.1,
                "x": 43,
                "y": 15,
                "face": 3,
                "fork": 0,
                "md": 3
              }
            ],
            "b": [
              {
                "id": 344,
                "x": 45,
                "y": 15,
                "md": -1
              }
            ],
            "requested": []
          },
          {
            "tick": 28,
            "p": [
              {
                "id": 306,
                "x": 47,
                "y": 15,
                "face": 1,
                "fork": 0,
                "md": 1
              },
              {
                "id": 306.1,
                "x": 44,
                "y": 15,
                "face": 3,
                "fork": 0,
                "md": 3
              }
            ],
            "b": [
              {
                "id": 344,
                "x": 45,
                "y": 15,
                "md": -1
              }
            ],
            "requested": []
          },
          {
            "tick": 29,
            "p": [
              {
                "id": 306,
                "x": 46,
                "y": 15,
                "face": 1,
                "fork": 0,
                "md": -1,
                "contained": 344
              },
              {
                "id": 306.1,
                "x": 45,
                "y": 15,
                "face": 3,
                "fork": 0,
                "md": -1
              }
            ],
            "b": [
              {
                "id": 344,
                "x": 46,
                "y": 15,
                "md": 3
              }
            ],
            "requested": [
              {
                "box": 344,
                "d": 3,
                "by": 306.1
              }
            ]
          },
          {
            "tick": 30,
            "p": [
              {
                "id": 306,
                "x": 47,
                "y": 15,
                "face": 1,
                "fork": 0,
                "md": -1,
                "contained": 344
              },
              {
                "id": 306.1,
                "x": 45,
                "y": 15,
                "face": 3,
                "fork": 0,
                "md": -1
              }
            ],
            "b": [
              {
                "id": 344,
                "x": 47,
                "y": 15,
                "md": 3
              }
            ],
            "requested": []
          },
          {
            "tick": 31,
            "p": [
              {
                "id": 306,
                "x": 48,
                "y": 15,
                "face": 1,
                "fork": 0,
                "md": -1,
                "contained": 344
              },
              {
                "id": 306.1,
                "x": 45,
                "y": 15,
                "face": 3,
                "fork": 0,
                "md": -1
              }
            ],
            "b": [
              {
                "id": 344,
                "x": 48,
                "y": 15,
                "md": 3
              }
            ],
            "requested": []
          },
          {
            "tick": 32,
            "p": [
              {
                "id": 306,
                "x": 49,
                "y": 15,
                "face": 1,
                "fork": 0,
                "md": -1,
                "contained": 344
              },
              {
                "id": 306.1,
                "x": 45,
                "y": 15,
                "face": 3,
                "fork": 0,
                "md": -1
              }
            ],
            "b": [
              {
                "id": 344,
                "x": 49,
                "y": 15,
                "md": 3
              }
            ],
            "requested": []
          },
          {
            "tick": 33,
            "p": [
              {
                "id": 306,
                "x": 50,
                "y": 15,
                "face": 1,
                "fork": 0,
                "md": -1,
                "contained": 344
              },
              {
                "id": 306.1,
                "x": 45,
                "y": 15,
                "face": 3,
                "fork": 0,
                "md": -1
              }
            ],
            "b": [
              {
                "id": 344,
                "x": 50,
                "y": 15,
                "md": 3
              }
            ],
            "requested": []
          },
          {
            "tick": 34,
            "p": [
              {
                "id": 306,
                "x": 51,
                "y": 15,
                "face": 1,
                "fork": 0,
                "md": -1,
                "contained": 344
              },
              {
                "id": 306.1,
                "x": 45,
                "y": 15,
                "face": 3,
                "fork": 0,
                "md": -1
              }
            ],
            "b": [
              {
                "id": 344,
                "x": 51,
                "y": 15,
                "md": 3
              }
            ],
            "requested": []
          },
          {
            "tick": 35,
            "p": [
              {
                "id": 306,
                "x": 52,
                "y": 15,
                "face": 1,
                "fork": 0,
                "md": -1,
                "contained": 344
              },
              {
                "id": 306.1,
                "x": 45,
                "y": 15,
                "face": 3,
                "fork": 0,
                "md": -1
              }
            ],
            "b": [
              {
                "id": 344,
                "x": 52,
                "y": 15,
                "md": 3
              }
            ],
            "requested": []
          },
          {
            "tick": 36,
            "p": [
              {
                "id": 306,
                "x": 53,
                "y": 15,
                "face": 1,
                "fork": 0,
                "md": -1,
                "contained": 344
              },
              {
                "id": 306.1,
                "x": 45,
                "y": 15,
                "face": 3,
                "fork": 0,
                "md": -1
              }
            ],
            "b": [
              {
                "id": 344,
                "x": 53,
                "y": 15,
                "md": 3
              }
            ],
            "requested": []
          },
          {
            "tick": 37,
            "p": [
              {
                "id": 306,
                "x": 54,
                "y": 15,
                "face": 1,
                "fork": 0,
                "md": -1,
                "contained": 344
              },
              {
                "id": 306.1,
                "x": 45,
                "y": 15,
                "face": 3,
                "fork": 0,
                "md": -1
              }
            ],
            "b": [
              {
                "id": 344,
                "x": 54,
                "y": 15,
                "md": 3
              }
            ],
            "requested": []
          },
          {
            "tick": 38,
            "p": [
              {
                "id": 306,
                "x": 55,
                "y": 15,
                "face": 1,
                "fork": 0,
                "md": -1,
                "contained": 344
              },
              {
                "id": 306.1,
                "x": 45,
                "y": 15,
                "face": 3,
                "fork": 0,
                "md": -1
              }
            ],
            "b": [
              {
                "id": 344,
                "x": 55,
                "y": 15,
                "md": 3
              }
            ],
            "requested": []
          },
          {
            "tick": 39,
            "p": [
              {
                "id": 306,
                "x": 56,
                "y": 15,
                "face": 1,
                "fork": 0,
                "md": -1,
                "contained": 344
              },
              {
                "id": 306.1,
                "x": 45,
                "y": 15,
                "face": 3,
                "fork": 0,
                "md": -1
              }
            ],
            "b": [
              {
                "id": 344,
                "x": 56,
                "y": 15,
                "md": 3
              }
            ],
            "requested": []
          },
          {
            "tick": 40,
            "p": [
              {
                "id": 306,
                "x": 57,
                "y": 15,
                "face": 1,
                "fork": 0,
                "md": -1,
                "contained": 344
              },
              {
                "id": 306.1,
                "x": 45,
                "y": 15,
                "face": 3,
                "fork": 0,
                "md": -1
              }
            ],
            "b": [
              {
                "id": 344,
                "x": 57,
                "y": 15,
                "md": 3
              }
            ],
            "requested": []
          },
          {
            "tick": 41,
            "p": [
              {
                "id": 306,
                "x": 58,
                "y": 15,
                "face": 1,
                "fork": 0,
                "md": -1,
                "contained": 344
              },
              {
                "id": 306.1,
                "x": 45,
                "y": 15,
                "face": 3,
                "fork": 0,
                "md": -1
              }
            ],
            "b": [
              {
                "id": 344,
                "x": 58,
                "y": 15,
                "md": 3
              }
            ],
            "requested": []
          },
          {
            "tick": 42,
            "p": [
              {
                "id": 306,
                "x": 59,
                "y": 15,
                "face": 1,
                "fork": 0,
                "md": -1,
                "contained": 344
              },
              {
                "id": 306.1,
                "x": 45,
                "y": 15,
                "face": 3,
                "fork": 0,
                "md": -1
              }
            ],
            "b": [
              {
                "id": 344,
                "x": 59,
                "y": 15,
                "md": 3
              }
            ],
            "requested": []
          },
          {
            "tick": 43,
            "p": [
              {
                "id": 306,
                "x": 60,
                "y": 15,
                "face": 1,
                "fork": 0,
                "md": -1,
                "contained": 344
              },
              {
                "id": 306.1,
                "x": 45,
                "y": 15,
                "face": 3,
                "fork": 0,
                "md": -1
              }
            ],
            "b": [
              {
                "id": 344,
                "x": 60,
                "y": 15,
                "md": 3
              }
            ],
            "requested": []
          },
          {
            "tick": 44,
            "p": [
              {
                "id": 306,
                "x": 61,
                "y": 15,
                "face": 1,
                "fork": 0,
                "md": -1,
                "contained": 344
              },
              {
                "id": 306.1,
                "x": 45,
                "y": 15,
                "face": 3,
                "fork": 0,
                "md": -1
              }
            ],
            "b": [
              {
                "id": 344,
                "x": 61,
                "y": 15,
                "md": 3
              }
            ],
            "requested": []
          },
          {
            "tick": 45,
            "p": [
              {
                "id": 306,
                "x": 62,
                "y": 15,
                "face": 1,
                "fork": 0,
                "md": -1,
                "contained": 344
              },
              {
                "id": 306.1,
                "x": 45,
                "y": 15,
                "face": 3,
                "fork": 0,
                "md": -1
              }
            ],
            "b": [
              {
                "id": 344,
                "x": 62,
                "y": 15,
                "md": 3
              }
            ],
            "requested": []
          },
          {
            "tick": 46,
            "p": [
              {
                "id": 306,
                "x": 63,
                "y": 15,
                "face": 1,
                "fork": 0,
                "md": -1,
                "contained": 344
              },
              {
                "id": 306.1,
                "x": 45,
                "y": 15,
                "face": 3,
                "fork": 0,
                "md": -1
              }
            ],
            "b": [
              {
                "id": 344,
                "x": 63,
                "y": 15,
                "md": 3
              }
            ],
            "requested": []
          },
          {
            "tick": 47,
            "p": [
              {
                "id": 306,
                "x": 64,
                "y": 15,
                "face": 1,
                "fork": 0,
                "md": -1,
                "contained": 344
              },
              {
                "id": 306.1,
                "x": 45,
                "y": 15,
                "face": 3,
                "fork": 0,
                "md": -1
              }
            ],
            "b": [
              {
                "id": 344,
                "x": 64,
                "y": 15,
                "md": 3
              }
            ],
            "requested": []
          },
          {
            "tick": 48,
            "p": [
              {
                "id": 306,
                "x": 65,
                "y": 15,
                "face": 1,
                "fork": 0,
                "md": -1,
                "contained": 344
              },
              {
                "id": 306.1,
                "x": 45,
                "y": 15,
                "face": 3,
                "fork": 0,
                "md": -1
              }
            ],
            "b": [
              {
                "id": 344,
                "x": 65,
                "y": 15,
                "md": 3
              }
            ],
            "requested": []
          },
          {
            "tick": 49,
            "p": [
              {
                "id": 306,
                "x": 66,
                "y": 15,
                "face": 1,
                "fork": 0,
                "md": -1,
                "contained": 344
              },
              {
                "id": 306.1,
                "x": 45,
                "y": 15,
                "face": 3,
                "fork": 0,
                "md": -1
              }
            ],
            "b": [
              {
                "id": 344,
                "x": 66,
                "y": 15,
                "md": 3
              }
            ],
            "requested": []
          },
          {
            "tick": 50,
            "p": [
              {
                "id": 306,
                "x": 67,
                "y": 15,
                "face": 1,
                "fork": 0,
                "md": -1,
                "contained": 344
              },
              {
                "id": 306.1,
                "x": 45,
                "y": 15,
                "face": 3,
                "fork": 0,
                "md": -1
              }
            ],
            "b": [
              {
                "id": 344,
                "x": 67,
                "y": 15,
                "md": 3
              }
            ],
            "requested": []
          },
          {
            "tick": 51,
            "p": [
              {
                "id": 306,
                "x": 68,
                "y": 15,
                "face": 1,
                "fork": 0,
                "md": -1,
                "contained": 344
              },
              {
                "id": 306.1,
                "x": 45,
                "y": 15,
                "face": 3,
                "fork": 0,
                "md": -1
              }
            ],
            "b": [
              {
                "id": 344,
                "x": 68,
                "y": 15,
                "md": 3
              }
            ],
            "requested": []
          },
          {
            "tick": 52,
            "p": [
              {
                "id": 306,
                "x": 69,
                "y": 15,
                "face": 1,
                "fork": 0,
                "md": -1,
                "contained": 344
              },
              {
                "id": 306.1,
                "x": 45,
                "y": 15,
                "face": 3,
                "fork": 0,
                "md": -1
              }
            ],
            "b": [
              {
                "id": 344,
                "x": 69,
                "y": 15,
                "md": 3
              }
            ],
            "requested": []
          },
          {
            "tick": 53,
            "p": [
              {
                "id": 306,
                "x": 70,
                "y": 15,
                "face": 1,
                "fork": 0,
                "md": -1,
                "contained": 344
              },
              {
                "id": 306.1,
                "x": 45,
                "y": 15,
                "face": 3,
                "fork": 0,
                "md": -1
              }
            ],
            "b": [
              {
                "id": 344,
                "x": 70,
                "y": 15,
                "md": 3
              }
            ],
            "requested": []
          },
          {
            "tick": 54,
            "p": [
              {
                "id": 306,
                "x": 71,
                "y": 15,
                "face": 1,
                "fork": 0,
                "md": -1,
                "contained": 344
              },
              {
                "id": 306.1,
                "x": 45,
                "y": 15,
                "face": 3,
                "fork": 0,
                "md": -1
              }
            ],
            "b": [
              {
                "id": 344,
                "x": 71,
                "y": 15,
                "md": 3
              }
            ],
            "requested": []
          },
          {
            "tick": 55,
            "p": [
              {
                "id": 306,
                "x": 72,
                "y": 15,
                "face": 1,
                "fork": 0,
                "md": -1,
                "contained": 344
              },
              {
                "id": 306.1,
                "x": 45,
                "y": 15,
                "face": 3,
                "fork": 0,
                "md": -1
              }
            ],
            "b": [
              {
                "id": 344,
                "x": 72,
                "y": 15,
                "md": 3
              }
            ],
            "requested": []
          },
          {
            "tick": 56,
            "p": [
              {
                "id": 306,
                "x": 73,
                "y": 15,
                "face": 1,
                "fork": 0,
                "md": -1,
                "contained": 344
              },
              {
                "id": 306.1,
                "x": 45,
                "y": 15,
                "face": 3,
                "fork": 0,
                "md": -1
              }
            ],
            "b": [
              {
                "id": 344,
                "x": 73,
                "y": 15,
                "md": 3
              }
            ],
            "requested": []
          },
          {
            "tick": 57,
            "p": [
              {
                "id": 306,
                "x": 74,
                "y": 15,
                "face": 1,
                "fork": 0,
                "md": -1,
                "contained": 344
              },
              {
                "id": 306.1,
                "x": 45,
                "y": 15,
                "face": 3,
                "fork": 0,
                "md": -1
              }
            ],
            "b": [
              {
                "id": 344,
                "x": 74,
                "y": 15,
                "md": 3
              }
            ],
            "requested": []
          },
          {
            "tick": 58,
            "p": [
              {
                "id": 306,
                "x": 75,
                "y": 15,
                "face": 1,
                "fork": 0,
                "md": -1,
                "contained": 344
              },
              {
                "id": 306.1,
                "x": 45,
                "y": 15,
                "face": 3,
                "fork": 0,
                "md": -1
              }
            ],
            "b": [
              {
                "id": 344,
                "x": 75,
                "y": 15,
                "md": 3
              }
            ],
            "requested": []
          },
          {
            "tick": 59,
            "p": [
              {
                "id": 306,
                "x": 76,
                "y": 15,
                "face": 1,
                "fork": 0,
                "md": -1,
                "contained": 344
              },
              {
                "id": 306.1,
                "x": 45,
                "y": 15,
                "face": 3,
                "fork": 0,
                "md": -1
              }
            ],
            "b": [
              {
                "id": 344,
                "x": 76,
                "y": 15,
                "md": -1
              }
            ],
            "requested": []
          }
        ],
        "boundary": null,
        "scope": "Model-only contained result needs normal actual calibration. Prefix and terminal input are checked for model deaths and forbidden ENTRYs.",
        "prefixReplay": {
          "valid": true,
          "points": [
            {
              "step": 1,
              "a": "W",
              "players": [
                {
                  "id": 306,
                  "at": [
                    82,
                    8
                  ],
                  "face": 0,
                  "fork": 1,
                  "contained": 0
                }
              ],
              "boxes": [
                {
                  "id": 344,
                  "at": [
                    45,
                    15
                  ]
                }
              ],
              "ticks": 1
            },
            {
              "step": 2,
              "a": "W",
              "players": [
                {
                  "id": 306,
                  "at": [
                    82,
                    9
                  ],
                  "face": 0,
                  "fork": 1,
                  "contained": 0
                }
              ],
              "boxes": [
                {
                  "id": 344,
                  "at": [
                    45,
                    15
                  ]
                }
              ],
              "ticks": 1
            },
            {
              "step": 3,
              "a": "W",
              "players": [
                {
                  "id": 306,
                  "at": [
                    82,
                    10
                  ],
                  "face": 0,
                  "fork": 1,
                  "contained": 0
                }
              ],
              "boxes": [
                {
                  "id": 344,
                  "at": [
                    45,
                    15
                  ]
                }
              ],
              "ticks": 1
            },
            {
              "step": 4,
              "a": "W",
              "players": [
                {
                  "id": 306,
                  "at": [
                    82,
                    11
                  ],
                  "face": 0,
                  "fork": 1,
                  "contained": 0
                }
              ],
              "boxes": [
                {
                  "id": 344,
                  "at": [
                    45,
                    15
                  ]
                }
              ],
              "ticks": 1
            },
            {
              "step": 5,
              "a": "W",
              "players": [
                {
                  "id": 306,
                  "at": [
                    82,
                    12
                  ],
                  "face": 0,
                  "fork": 1,
                  "contained": 0
                }
              ],
              "boxes": [
                {
                  "id": 344,
                  "at": [
                    45,
                    15
                  ]
                }
              ],
              "ticks": 1
            },
            {
              "step": 6,
              "a": "W",
              "players": [
                {
                  "id": 306,
                  "at": [
                    82,
                    13
                  ],
                  "face": 0,
                  "fork": 1,
                  "contained": 0
                }
              ],
              "boxes": [
                {
                  "id": 344,
                  "at": [
                    45,
                    15
                  ]
                }
              ],
              "ticks": 1
            },
            {
              "step": 7,
              "a": "W",
              "players": [
                {
                  "id": 306,
                  "at": [
                    82,
                    14
                  ],
                  "face": 0,
                  "fork": 1,
                  "contained": 0
                }
              ],
              "boxes": [
                {
                  "id": 344,
                  "at": [
                    45,
                    15
                  ]
                }
              ],
              "ticks": 1
            },
            {
              "step": 8,
              "a": "W",
              "players": [
                {
                  "id": 306,
                  "at": [
                    82,
                    15
                  ],
                  "face": 0,
                  "fork": 1,
                  "contained": 0
                }
              ],
              "boxes": [
                {
                  "id": 344,
                  "at": [
                    45,
                    15
                  ]
                }
              ],
              "ticks": 1
            },
            {
              "step": 9,
              "a": "W",
              "players": [
                {
                  "id": 306,
                  "at": [
                    82,
                    16
                  ],
                  "face": 0,
                  "fork": 1,
                  "contained": 0
                }
              ],
              "boxes": [
                {
                  "id": 344,
                  "at": [
                    45,
                    15
                  ]
                }
              ],
              "ticks": 1
            },
            {
              "step": 10,
              "a": "W",
              "players": [
                {
                  "id": 306,
                  "at": [
                    82,
                    17
                  ],
                  "face": 0,
                  "fork": 1,
                  "contained": 0
                }
              ],
              "boxes": [
                {
                  "id": 344,
                  "at": [
                    45,
                    15
                  ]
                }
              ],
              "ticks": 1
            },
            {
              "step": 11,
              "a": "W",
              "players": [
                {
                  "id": 306,
                  "at": [
                    82,
                    18
                  ],
                  "face": 0,
                  "fork": 1,
                  "contained": 0
                }
              ],
              "boxes": [
                {
                  "id": 344,
                  "at": [
                    45,
                    15
                  ]
                }
              ],
              "ticks": 1
            },
            {
              "step": 12,
              "a": "A",
              "players": [
                {
                  "id": 306,
                  "at": [
                    81,
                    18
                  ],
                  "face": 1,
                  "fork": 1,
                  "contained": 0
                }
              ],
              "boxes": [
                {
                  "id": 344,
                  "at": [
                    45,
                    15
                  ]
                }
              ],
              "ticks": 1
            },
            {
              "step": 13,
              "a": "A",
              "players": [
                {
                  "id": 306,
                  "at": [
                    80,
                    18
                  ],
                  "face": 1,
                  "fork": 1,
                  "contained": 0
                }
              ],
              "boxes": [
                {
                  "id": 344,
                  "at": [
                    45,
                    15
                  ]
                }
              ],
              "ticks": 1
            },
            {
              "step": 14,
              "a": "A",
              "players": [
                {
                  "id": 306,
                  "at": [
                    79,
                    18
                  ],
                  "face": 1,
                  "fork": 1,
                  "contained": 0
                }
              ],
              "boxes": [
                {
                  "id": 344,
                  "at": [
                    45,
                    15
                  ]
                }
              ],
              "ticks": 1
            },
            {
              "step": 15,
              "a": "A",
              "players": [
                {
                  "id": 306,
                  "at": [
                    78,
                    18
                  ],
                  "face": 1,
                  "fork": 1,
                  "contained": 0
                }
              ],
              "boxes": [
                {
                  "id": 344,
                  "at": [
                    45,
                    15
                  ]
                }
              ],
              "ticks": 1
            },
            {
              "step": 16,
              "a": "A",
              "players": [
                {
                  "id": 306,
                  "at": [
                    77,
                    18
                  ],
                  "face": 1,
                  "fork": 1,
                  "contained": 0
                }
              ],
              "boxes": [
                {
                  "id": 344,
                  "at": [
                    45,
                    15
                  ]
                }
              ],
              "ticks": 1
            },
            {
              "step": 17,
              "a": "A",
              "players": [
                {
                  "id": 306,
                  "at": [
                    76,
                    18
                  ],
                  "face": 1,
                  "fork": 1,
                  "contained": 0
                }
              ],
              "boxes": [
                {
                  "id": 344,
                  "at": [
                    45,
                    15
                  ]
                }
              ],
              "ticks": 1
            },
            {
              "step": 18,
              "a": "A",
              "players": [
                {
                  "id": 306,
                  "at": [
                    75,
                    18
                  ],
                  "face": 1,
                  "fork": 1,
                  "contained": 0
                }
              ],
              "boxes": [
                {
                  "id": 344,
                  "at": [
                    45,
                    15
                  ]
                }
              ],
              "ticks": 1
            },
            {
              "step": 19,
              "a": "S",
              "players": [
                {
                  "id": 306,
                  "at": [
                    75,
                    17
                  ],
                  "face": 2,
                  "fork": 1,
                  "contained": 0
                }
              ],
              "boxes": [
                {
                  "id": 344,
                  "at": [
                    45,
                    15
                  ]
                }
              ],
              "ticks": 1
            },
            {
              "step": 20,
              "a": "A",
              "players": [
                {
                  "id": 306,
                  "at": [
                    75,
                    16
                  ],
                  "face": 2,
                  "fork": 1,
                  "contained": 0
                }
              ],
              "boxes": [
                {
                  "id": 344,
                  "at": [
                    45,
                    15
                  ]
                }
              ],
              "ticks": 1
            },
            {
              "step": 21,
              "a": "X",
              "players": [
                {
                  "id": 306,
                  "at": [
                    75,
                    15
                  ],
                  "face": 2,
                  "fork": 0,
                  "contained": 0
                },
                {
                  "id": 306.1,
                  "at": [
                    15,
                    16
                  ],
                  "face": 2,
                  "fork": 0,
                  "contained": 0
                }
              ],
              "boxes": [
                {
                  "id": 344,
                  "at": [
                    45,
                    15
                  ]
                }
              ],
              "ticks": 60
            },
            {
              "step": 22,
              "a": "S",
              "players": [
                {
                  "id": 306,
                  "at": [
                    76,
                    15
                  ],
                  "face": 3,
                  "fork": 0,
                  "contained": 0
                },
                {
                  "id": 306.1,
                  "at": [
                    15,
                    15
                  ],
                  "face": 2,
                  "fork": 0,
                  "contained": 0
                }
              ],
              "boxes": [
                {
                  "id": 344,
                  "at": [
                    45,
                    15
                  ]
                }
              ],
              "ticks": 2
            }
          ],
          "entryMicroticks": [
            {
              "step": 6,
              "a": "W",
              "tick": 0,
              "player": 306,
              "pos": [
                82,
                13
              ],
              "entry": "2-1",
              "completed": true
            },
            {
              "step": 9,
              "a": "W",
              "tick": 0,
              "player": 306,
              "pos": [
                82,
                16
              ],
              "entry": "2-2",
              "completed": true
            },
            {
              "step": 19,
              "a": "S",
              "tick": 0,
              "player": 306,
              "pos": [
                75,
                17
              ],
              "entry": "2-21",
              "completed": true
            }
          ],
          "scope": "All safe-prefix microticks inspected; no unfinished ENTRY or model SPIKE death. The unknown terminal action, when present, stays unverified."
        }
      },
      "allCargoFork1": null,
      "uncertainCross": {
        "source": {
          "event": 542,
          "frame": 358019,
          "level": "Chapter2",
          "instructions": "",
          "start": {
            "players": [
              {
                "id": 306,
                "at": [
                  82,
                  7
                ],
                "face": 2,
                "fork": 1,
                "contained": 0
              }
            ],
            "boxes": [
              {
                "id": 344,
                "at": [
                  45,
                  15
                ]
              }
            ]
          }
        },
        "preSequence": "WWWWWWWWWWWAAAAAAASASX",
        "action": "A",
        "sequence": "WWWWWWWWWWWAAAAAAASASXA",
        "preState": {
          "players": [
            {
              "id": 306,
              "at": [
                76,
                15
              ],
              "face": 2,
              "fork": 0,
              "contained": 0
            },
            {
              "id": 306.1,
              "at": [
                45,
                15
              ],
              "face": 2,
              "fork": 0,
              "contained": 0
            }
          ],
          "boxes": [
            {
              "id": 344,
              "at": [
                15,
                15
              ]
            }
          ]
        },
        "predictedPostState": null,
        "terminalTrace": null,
        "boundary": {
          "kind": "one-moving-one-stopped-or-unverified-player-cross",
          "tick": 59,
          "input": "A",
          "before": {
            "p": [
              {
                "id": 306,
                "x": 17,
                "y": 15,
                "face": 1,
                "fork": 0,
                "md": 1
              },
              {
                "id": 306.1,
                "x": 16,
                "y": 15,
                "face": 1,
                "fork": 0,
                "md": -1
              }
            ],
            "b": [
              {
                "id": 344,
                "x": 15,
                "y": 15,
                "md": -1
              }
            ]
          },
          "crossingPair": [
            {
              "id": 306,
              "x": 16,
              "y": 15,
              "face": 1,
              "fork": 0,
              "md": 1
            },
            {
              "id": 306.1,
              "x": 16,
              "y": 15,
              "face": 1,
              "fork": 0,
              "md": -1
            }
          ],
          "plannedPlayers": [
            {
              "id": 306,
              "x": 16,
              "y": 15,
              "face": 1,
              "fork": 0,
              "md": 1
            },
            {
              "id": 306.1,
              "x": 16,
              "y": 15,
              "face": 1,
              "fork": 0,
              "md": -1
            }
          ]
        },
        "scope": "Safe model prefix plus a single unknown boundary input. Boundary outcome is deliberately not inferred.",
        "prefixReplay": {
          "valid": true,
          "points": [
            {
              "step": 1,
              "a": "W",
              "players": [
                {
                  "id": 306,
                  "at": [
                    82,
                    8
                  ],
                  "face": 0,
                  "fork": 1,
                  "contained": 0
                }
              ],
              "boxes": [
                {
                  "id": 344,
                  "at": [
                    45,
                    15
                  ]
                }
              ],
              "ticks": 1
            },
            {
              "step": 2,
              "a": "W",
              "players": [
                {
                  "id": 306,
                  "at": [
                    82,
                    9
                  ],
                  "face": 0,
                  "fork": 1,
                  "contained": 0
                }
              ],
              "boxes": [
                {
                  "id": 344,
                  "at": [
                    45,
                    15
                  ]
                }
              ],
              "ticks": 1
            },
            {
              "step": 3,
              "a": "W",
              "players": [
                {
                  "id": 306,
                  "at": [
                    82,
                    10
                  ],
                  "face": 0,
                  "fork": 1,
                  "contained": 0
                }
              ],
              "boxes": [
                {
                  "id": 344,
                  "at": [
                    45,
                    15
                  ]
                }
              ],
              "ticks": 1
            },
            {
              "step": 4,
              "a": "W",
              "players": [
                {
                  "id": 306,
                  "at": [
                    82,
                    11
                  ],
                  "face": 0,
                  "fork": 1,
                  "contained": 0
                }
              ],
              "boxes": [
                {
                  "id": 344,
                  "at": [
                    45,
                    15
                  ]
                }
              ],
              "ticks": 1
            },
            {
              "step": 5,
              "a": "W",
              "players": [
                {
                  "id": 306,
                  "at": [
                    82,
                    12
                  ],
                  "face": 0,
                  "fork": 1,
                  "contained": 0
                }
              ],
              "boxes": [
                {
                  "id": 344,
                  "at": [
                    45,
                    15
                  ]
                }
              ],
              "ticks": 1
            },
            {
              "step": 6,
              "a": "W",
              "players": [
                {
                  "id": 306,
                  "at": [
                    82,
                    13
                  ],
                  "face": 0,
                  "fork": 1,
                  "contained": 0
                }
              ],
              "boxes": [
                {
                  "id": 344,
                  "at": [
                    45,
                    15
                  ]
                }
              ],
              "ticks": 1
            },
            {
              "step": 7,
              "a": "W",
              "players": [
                {
                  "id": 306,
                  "at": [
                    82,
                    14
                  ],
                  "face": 0,
                  "fork": 1,
                  "contained": 0
                }
              ],
              "boxes": [
                {
                  "id": 344,
                  "at": [
                    45,
                    15
                  ]
                }
              ],
              "ticks": 1
            },
            {
              "step": 8,
              "a": "W",
              "players": [
                {
                  "id": 306,
                  "at": [
                    82,
                    15
                  ],
                  "face": 0,
                  "fork": 1,
                  "contained": 0
                }
              ],
              "boxes": [
                {
                  "id": 344,
                  "at": [
                    45,
                    15
                  ]
                }
              ],
              "ticks": 1
            },
            {
              "step": 9,
              "a": "W",
              "players": [
                {
                  "id": 306,
                  "at": [
                    82,
                    16
                  ],
                  "face": 0,
                  "fork": 1,
                  "contained": 0
                }
              ],
              "boxes": [
                {
                  "id": 344,
                  "at": [
                    45,
                    15
                  ]
                }
              ],
              "ticks": 1
            },
            {
              "step": 10,
              "a": "W",
              "players": [
                {
                  "id": 306,
                  "at": [
                    82,
                    17
                  ],
                  "face": 0,
                  "fork": 1,
                  "contained": 0
                }
              ],
              "boxes": [
                {
                  "id": 344,
                  "at": [
                    45,
                    15
                  ]
                }
              ],
              "ticks": 1
            },
            {
              "step": 11,
              "a": "W",
              "players": [
                {
                  "id": 306,
                  "at": [
                    82,
                    18
                  ],
                  "face": 0,
                  "fork": 1,
                  "contained": 0
                }
              ],
              "boxes": [
                {
                  "id": 344,
                  "at": [
                    45,
                    15
                  ]
                }
              ],
              "ticks": 1
            },
            {
              "step": 12,
              "a": "A",
              "players": [
                {
                  "id": 306,
                  "at": [
                    81,
                    18
                  ],
                  "face": 1,
                  "fork": 1,
                  "contained": 0
                }
              ],
              "boxes": [
                {
                  "id": 344,
                  "at": [
                    45,
                    15
                  ]
                }
              ],
              "ticks": 1
            },
            {
              "step": 13,
              "a": "A",
              "players": [
                {
                  "id": 306,
                  "at": [
                    80,
                    18
                  ],
                  "face": 1,
                  "fork": 1,
                  "contained": 0
                }
              ],
              "boxes": [
                {
                  "id": 344,
                  "at": [
                    45,
                    15
                  ]
                }
              ],
              "ticks": 1
            },
            {
              "step": 14,
              "a": "A",
              "players": [
                {
                  "id": 306,
                  "at": [
                    79,
                    18
                  ],
                  "face": 1,
                  "fork": 1,
                  "contained": 0
                }
              ],
              "boxes": [
                {
                  "id": 344,
                  "at": [
                    45,
                    15
                  ]
                }
              ],
              "ticks": 1
            },
            {
              "step": 15,
              "a": "A",
              "players": [
                {
                  "id": 306,
                  "at": [
                    78,
                    18
                  ],
                  "face": 1,
                  "fork": 1,
                  "contained": 0
                }
              ],
              "boxes": [
                {
                  "id": 344,
                  "at": [
                    45,
                    15
                  ]
                }
              ],
              "ticks": 1
            },
            {
              "step": 16,
              "a": "A",
              "players": [
                {
                  "id": 306,
                  "at": [
                    77,
                    18
                  ],
                  "face": 1,
                  "fork": 1,
                  "contained": 0
                }
              ],
              "boxes": [
                {
                  "id": 344,
                  "at": [
                    45,
                    15
                  ]
                }
              ],
              "ticks": 1
            },
            {
              "step": 17,
              "a": "A",
              "players": [
                {
                  "id": 306,
                  "at": [
                    76,
                    18
                  ],
                  "face": 1,
                  "fork": 1,
                  "contained": 0
                }
              ],
              "boxes": [
                {
                  "id": 344,
                  "at": [
                    45,
                    15
                  ]
                }
              ],
              "ticks": 1
            },
            {
              "step": 18,
              "a": "A",
              "players": [
                {
                  "id": 306,
                  "at": [
                    75,
                    18
                  ],
                  "face": 1,
                  "fork": 1,
                  "contained": 0
                }
              ],
              "boxes": [
                {
                  "id": 344,
                  "at": [
                    45,
                    15
                  ]
                }
              ],
              "ticks": 1
            },
            {
              "step": 19,
              "a": "S",
              "players": [
                {
                  "id": 306,
                  "at": [
                    75,
                    17
                  ],
                  "face": 2,
                  "fork": 1,
                  "contained": 0
                }
              ],
              "boxes": [
                {
                  "id": 344,
                  "at": [
                    45,
                    15
                  ]
                }
              ],
              "ticks": 1
            },
            {
              "step": 20,
              "a": "A",
              "players": [
                {
                  "id": 306,
                  "at": [
                    75,
                    16
                  ],
                  "face": 2,
                  "fork": 1,
                  "contained": 0
                }
              ],
              "boxes": [
                {
                  "id": 344,
                  "at": [
                    45,
                    15
                  ]
                }
              ],
              "ticks": 1
            },
            {
              "step": 21,
              "a": "S",
              "players": [
                {
                  "id": 306,
                  "at": [
                    75,
                    15
                  ],
                  "face": 2,
                  "fork": 1,
                  "contained": 0
                }
              ],
              "boxes": [
                {
                  "id": 344,
                  "at": [
                    45,
                    15
                  ]
                }
              ],
              "ticks": 2
            },
            {
              "step": 22,
              "a": "X",
              "players": [
                {
                  "id": 306,
                  "at": [
                    76,
                    15
                  ],
                  "face": 2,
                  "fork": 0,
                  "contained": 0
                },
                {
                  "id": 306.1,
                  "at": [
                    45,
                    15
                  ],
                  "face": 2,
                  "fork": 0,
                  "contained": 0
                }
              ],
              "boxes": [
                {
                  "id": 344,
                  "at": [
                    15,
                    15
                  ]
                }
              ],
              "ticks": 60
            }
          ],
          "entryMicroticks": [
            {
              "step": 6,
              "a": "W",
              "tick": 0,
              "player": 306,
              "pos": [
                82,
                13
              ],
              "entry": "2-1",
              "completed": true
            },
            {
              "step": 9,
              "a": "W",
              "tick": 0,
              "player": 306,
              "pos": [
                82,
                16
              ],
              "entry": "2-2",
              "completed": true
            },
            {
              "step": 19,
              "a": "S",
              "tick": 0,
              "player": 306,
              "pos": [
                75,
                17
              ],
              "entry": "2-21",
              "completed": true
            }
          ],
          "scope": "All safe-prefix microticks inspected; no unfinished ENTRY or model SPIKE death. The unknown terminal action, when present, stays unverified."
        }
      },
      "conflict": null
    }
  }
}
```
