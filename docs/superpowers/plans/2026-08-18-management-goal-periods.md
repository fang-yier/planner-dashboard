# Management Goal Periods Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Split sidebar weekly/monthly goal management content into period-first sections while leaving dashboard overviews unchanged.

**Architecture:** Add a pure period grouping helper and a management-only renderer. Each period section reuses board grouping for its own goals; dashboard calls remain untouched.

**Tech Stack:** Vanilla JavaScript, CSS Grid, Node.js assertions.

## Global Constraints

- Change only sidebar weekly/monthly management content.
- Preserve dashboard `renderGoalBoardGroups(weekGoals, 'week')` and month equivalent.
- Sort periods newest first, then boards within each period.
- Push verified changes to GitHub `main`.

---

### Task 1: Render management goals period-first

**Files:**
- Modify: `app.js:718-735,1150-1207`
- Modify: `style.css:836-870`
- Create: `tests/management-goal-periods.js`

**Interfaces:**
- Consumes: weekly or monthly goal arrays.
- Produces: `groupGoalsByPeriod(goals)` and `renderGoalManagementPeriods(goals, type)`.

- [ ] **Step 1: Write failing grouping tests**

Assert multiple goals in one period remain together and periods sort newest first.

- [ ] **Step 2: Verify failure**

Run: `node tests/management-goal-periods.js`
Expected: FAIL because `groupGoalsByPeriod` is absent.

- [ ] **Step 3: Implement management-only renderer**

Render period headers with counts and progress, then board groups inside each period. Do not replace dashboard calls.

- [ ] **Step 4: Add scoped management styles**

Style `.goal-management-periods` and `.goal-management-period` only.

- [ ] **Step 5: Verify and publish**

Run all regression scripts, syntax validation, diff validation, commit, and push `origin main`.
