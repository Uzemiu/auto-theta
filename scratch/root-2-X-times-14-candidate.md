## 2026-09-23 实测更新

已成功构造实际顺序2-14×2-X；关内WWWAXTWXWDST通关，总数57→58。下文保留原候选推导；完成证据见artifacts/slot1-playthrough/2-X-times-14.json，正式解法见knowledge/solutions/2-X.md。

# 2-X × 2-14 candidate — not yet executed

2-X has sealed goals [5,1]/[5,9], but two ordinary floor cells [3,2]/[7,8] match the goals of 2-14. Independent single-line searches of the actual initial maps found:

- 2-X side: `WXWDS` → two players [3,2]/[7,8].
- 2-14 side: `WWWAX` → two players [5,9]/[5,1], box [9,5].

Each has five inputs. The actual multiplied geometry and imported goals must be inspected before execution. Neither search proves this combination completed; 2-X is still unsolved.

## World construction from the current verified checkpoint

Current Chapter2: single player [34,19], face down, split1, time0, original box [45,15]. Normal return from the star collection restored this checkpoint.

1. `WWX` → [33,21]/[35,21], same line, fork0.
2. The previously verified 40-input route `WAWAAAAAAAAAAAAAAAASAAAAAAASASDDDDDSSASD` → [15,16]/[75,16], box unchanged. It includes long ice animation; wait for stability and do not resend executed inputs.
3. `SA` → actual known two-line construction. Expected current axis0 box [76,15], player [45,15], time164; axis1 pending box movement ends [15,15], player [45,15], time163 after switching.
4. Axis0: 9 W, 20 D, `SSA` (32 inputs) → [34,19], time225, immediately before 2-X. This derives from the earlier verified navigation with its final S omitted. Do not replace it with hand-counted coordinate differences: some blocked inputs turn automatically.
5. T switches to axis1 and resumes its pending slide. Confirm it becomes stable at time163 before navigation.
6. Axis1: 9 W then 21 D → 2-14 entry [34,21], expected time222. Since 2-14 is completed and this is solid floor, it should remain there without automatic entry; verify actual UI and position. This exact final approach remains a candidate.
7. T back to axis0 at time225, then S → 2-X [34,18] at226 while axis1 should still stand at [34,21]. Expect 2-X×2-14, not a solo level; inspect the actual title before acting.

If a solo level is entered, pause and choose the observed menu “撤销进入” to restore the world timelines and the prior input. “返回世界” instead resets to a single-character checkpoint; it was used deliberately to persist the star and is a different operation.

## Verification

After forming the actual product, save its initial observation in a new main record. Execute the two five-input candidates on the correct lines with stable checks. Goal coverage is checked at a sufficiently late timeline; use T if necessary. Save actual completion and verify SaveSlot1. 2-14 already counts as completed, so a successful product should add only 2-X (expected 57→58); inspect actual LevelStates/LevelRecords and adapt combination auditing rather than adding a fictitious extra combined level.
