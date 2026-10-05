# 4-16: fixed first-force witness with no remaining transport

2026-10-05. Read-only fixed replay using `scratch/ch4-16-readonly.cjs`, normal initial journal and the previously saved 21-step resource prefix. No search, game input, save writes, hints, implementation or walkthrough reads. MODEL only.

Full 27-input candidate:

`WSAAWDSDWXASDDDWASAWWAAWDAX`

The known MODEL21 has two Fork1 cargo parents at [4,7]/[5,6], empty Blue at [4,6]/[3,5]/[4,5], and outside [4,4]. `AAW` moves the outside to [2,5]. `D` shifts the two row5 Blue boxes to [4,5]/[5,5], while the pusher enters SPIKE [3,5] and dies. `A` changes the contained parents' faces to A without moving them.

Last X now gives genuine model opposite requests on the independent Blue [4,6]: the [4,7] parent requests S, and the [5,6] parent requests A because Blue [5,5] is backed by Wall [5,4]. The fixed model returns two branches. Each branch contains three Fork0 cargo at [4,6]/[3,7]/[5,7], no outside, and Goal mask0. In the S branch the two column4 Blue move to [4,5]/[4,4]; in the A branch the shared Blue goes [3,6]. Neither branch has remaining forks or an outside pusher.

This closes the missing deployment prefix for one previously constructed first-force condition. It supplies no complete Goal route: the sacrifice occurs before the last X and removes all ordinary transport control. Do not ask the game owner to replay this partial witness. It does not prove the level impossible or exhaust any state graph; the old 12000/19945/7945 truncated search remains unchanged. A useful future conflict candidate must retain a movable pusher or already place cargo at actual Goals.
