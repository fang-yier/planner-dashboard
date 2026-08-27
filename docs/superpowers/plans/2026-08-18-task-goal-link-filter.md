# Task Goal Link Filter Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Restrict the task form goal selector to active goals in the current/future weeks and current month while preserving an edited task's existing link.

**Architecture:** Add one pure predicate in `app.js` and apply it only when building `showTaskForm` options. Verify the predicate behavior with fixed-date fixtures.

**Tech Stack:** Vanilla JavaScript, Node.js assertions.

## Global Constraints

- Show active goals from the current week, future weeks, and current month; do not show future months.
- Do not change other goal lists or task form behavior.
- Editing keeps the task's existing linked goal selectable.

---

### Task 1: Filter task-linkable goals

**Files:**
- Modify: `app.js:1258-1274`
- Create: `tests/task-goal-link-filter.js`

**Interfaces:**
- Consumes: goal records with `id`, `month`, `status`, and `completion_date`.
- Produces: `taskGoalLinkVisible(goal, linkedGoalId, currentWeek, currentMonth, today)` returning a boolean.

- [ ] **Step 1: Write the failing behavioral test**

Use fixed `2026-W34`, `2026-08`, and `2026-08-18` fixtures to assert active current and future-week goals are included, future-month/stale/completed goals are excluded, and an existing linked goal is retained.

- [ ] **Step 2: Run test to verify it fails**

Run: `node tests/task-goal-link-filter.js`
Expected: FAIL because `taskGoalLinkVisible` does not exist.

- [ ] **Step 3: Write minimal implementation**

Add the predicate and call it from `showTaskForm` before mapping goal options.

- [ ] **Step 4: Run all verification**

Run: `node tests/task-goal-link-filter.js`, `node tests/goal-board-regression.js`, `node --check app.js`, and `git diff --check`.

- [ ] **Step 5: Commit**

Commit the implementation, tests, design, and plan together on `main`.

### Task 2: Display goal periods in option labels

**Files:**
- Modify: `app.js:1277-1283`
- Modify: `tests/task-goal-link-filter.js`

**Interfaces:**
- Consumes: goal `month`, type, and `name`.
- Produces: `taskGoalOptionLabel(goal)` returning `【W34周目标】名称` or `【2026-08月目标】名称`.

- [ ] **Step 1: Write failing label tests**

Assert literal weekly and monthly labels from fixed goal fixtures.

- [ ] **Step 2: Verify failure**

Run: `node tests/task-goal-link-filter.js`
Expected: FAIL because `taskGoalOptionLabel` does not exist.

- [ ] **Step 3: Implement and use the formatter**

Create the pure formatter and replace the current hard-coded type label in `showTaskForm`.

- [ ] **Step 4: Verify and publish**

Run both regression scripts, syntax validation, and diff validation; commit and push `main`.
