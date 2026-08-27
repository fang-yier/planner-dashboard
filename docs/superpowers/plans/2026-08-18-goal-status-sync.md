# Goal Status Sync Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Automatically derive weekly/monthly goal progress and status from linked task completion rates.

**Architecture:** Introduce a pure state derivation function and make the existing goal recalculation persist both progress and status. Run recalculation after task mutations and after every data refresh.

**Tech Stack:** Vanilla JavaScript, localStorage/Supabase persistence, Node.js assertions.

## Global Constraints

- No linked tasks means `0% / 未开始`.
- Linked average below 100% means `进行中`.
- Linked average at 100% means `已完成`.
- Apply identically to weekly and monthly goals.
- Push verified changes to GitHub `main`.

---

### Task 1: Derive and persist goal state

**Files:**
- Modify: `app.js:202-214,551-555,1155-1216`
- Create: `tests/goal-status-sync.js`

**Interfaces:**
- Consumes: linked tasks with `completion_rate`.
- Produces: `deriveGoalProgressState(linkedTasks)` returning `{ progress, status }`.

- [ ] **Step 1: Write failing behavioral tests**

Assert literal results for no tasks, partial average, full completion, and completion regression.

- [ ] **Step 2: Verify failure**

Run: `node tests/goal-status-sync.js`
Expected: FAIL because the derivation function is absent.

- [ ] **Step 3: Implement derivation and recalculation**

Persist both fields only when either changes, using string-safe ID matching.

- [ ] **Step 4: Cover refresh and forms**

Recalculate all non-profile goals after loading tasks; default new goals to `未开始` and include that option in both forms.

- [ ] **Step 5: Verify and publish**

Run all regression scripts, syntax validation, diff validation, commit, and push `origin main`.
