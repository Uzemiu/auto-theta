# 3-19 本阶段候选搜索摘要

均为已观察地图上的只读候选，不是实测证据。实态只看artifacts/slot1-playthrough/3-19.json。除39步前缀和明确机制实验外，候选没有执行。

实际39输入前缀：SDDDWAAAAAWDDDDDWWWWXDDSSSWWAWSADSASDWA。空箱移动到5,5未装载KEY；自由人先拾KEY后死亡，root-cargo-keys/gates已修复拾取与死亡顺序，middle私有副本仍是历史版本，不应用旧逻辑推断剩余钥匙。

- middle-recover-right-result.json: `{"model":"ordinary-cargo-key-lock-explicit-gate-hypothesis","states":449221,"processed_states":367199,"pending_states":82022,"stopped_at_limit":false,"queue_exhausted":false,"actions":"AAAAAWDDDDWDWWWXDDSSSWAWDSSSDSSW"}`
- middle-recover-right-safe-result.json: `{"model":"ordinary-cargo-key-lock-explicit-gate-hypothesis","states":367316,"processed_states":299082,"pending_states":68234,"stopped_at_limit":false,"queue_exhausted":false,"actions":"AAAAAWDDDDDWWWWXDDSSSWAWDSSSDSSW"}`
- middle-recover-right-three-result.json: `{"model":"ordinary-cargo-key-lock-explicit-gate-hypothesis","states":829936,"processed_states":700000,"pending_states":129936,"stopped_at_limit":true,"queue_exhausted":false,"actions":null}`
- middle-recover-right-current-result.json: `{"model":"ordinary-cargo-key-lock-explicit-gate-hypothesis","states":1198694,"processed_states":1000000,"pending_states":198694,"stopped_at_limit":true,"queue_exhausted":false,"actions":null}`
- middle-clear-right-current-result.json: `{"model":"ordinary-cargo-key-lock-explicit-gate-hypothesis","states":17833,"processed_states":12007,"pending_states":5826,"stopped_at_limit":false,"queue_exhausted":false,"actions":"SWAWDWDDSSDSA"}`
- middle-clear-right-safe-result.json: `{"model":"ordinary-cargo-key-lock-explicit-gate-hypothesis","states":1168415,"processed_states":1000000,"pending_states":168415,"stopped_at_limit":true,"queue_exhausted":false,"actions":null}`
- middle-clear-heuristic-result.json: `{"model":"3-19-column-clear-heuristic","processed":300000,"seen":307728,"pending":7728,"stopped_at_limit":true,"found":null,"nearest_h":11.1}`
- middle-stage-lower-result.json: `{"model":"ordinary-cargo-key-lock-explicit-gate-hypothesis","states":4009,"processed_states":2654,"pending_states":1355,"stopped_at_limit":false,"queue_exhausted":false,"actions":"WAWSADSASDWA"}`
