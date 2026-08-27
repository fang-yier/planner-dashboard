# Board Demand Distribution Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a dashboard board-load distribution beside the existing task-status and member-load modules.

**Architecture:** Derive board load from the dashboard-filtered tasks and their linked goals using a pure aggregation function. Render the result with the existing stacked-bar status palette in a new responsive three-column row.

**Tech Stack:** Vanilla JavaScript, CSS Grid, Node.js assertions.

## Global Constraints

- Use the current dashboard time-filtered task collection.
- Exclude tasks with missing, invalid, or unassigned goal links from this module.
- Preserve the existing task-status and member-load calculations.
- Push the verified commit to GitHub `main`.

---

### Task 1: Aggregate and display board load

**Files:**
- Modify: `app.js:740-825,1046-1079`
- Modify: `style.css:303,1069`
- Create: `tests/board-demand-distribution.js`

**Interfaces:**
- Consumes: dashboard-filtered tasks and `State.goals`.
- Produces: `buildBoardLoad(tasks, goals)` as sorted `[board, counts]` entries and board stacked-bar HTML.

- [ ] **Step 1: Write failing behavioral aggregation tests**

Use literal fixtures covering linked boards and all statuses, and verify missing/unassigned links are excluded.

- [ ] **Step 2: Verify failure**

Run: `node tests/board-demand-distribution.js`
Expected: FAIL because `buildBoardLoad` is absent.

- [ ] **Step 3: Implement aggregation and module rendering**

Add the pure aggregator, create stacked bars from its result, and add the third card without changing the first two calculations.

- [ ] **Step 4: Add responsive three-column layout**

Use `.grid-3` for three desktop columns and collapse it alongside `.grid-2` at the existing `1100px` breakpoint.

- [ ] **Step 5: Verify and publish**

Run all regression scripts, JavaScript syntax validation, diff validation, commit, and push `origin main`.
