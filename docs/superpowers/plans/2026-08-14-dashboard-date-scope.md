# Dashboard Date Scope Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make every dashboard metric and member completion calculation use one selected day or date range.

**Architecture:** `dashboardDateRange()` is the single source of truth. Dashboard cards, charts, member lists, and the persistent right ranking filter `State.tasks` through this range before calculating values.

**Tech Stack:** Vanilla JavaScript and existing application state.

## Global Constraints

- Default mode is the selected single day.
- Date picker and previous/next/today actions return to day mode.
- Week, month, and custom ranges aggregate the same modules.
- A custom range with equal start and end dates is a single-day detail view.
- Members without tasks in the active range are excluded.

---

### Task 1: Shared range state

**Files:**
- Modify: `app.js`

- [ ] Add day handling to `dashboardDateRange()`.
- [ ] Make date controls set `dashboardPeriod` to `day`.
- [ ] Add a visible 当天 tab and preserve active states.

### Task 2: Unified dashboard calculations

**Files:**
- Modify: `app.js`

- [ ] Calculate member cards from active-range tasks.
- [ ] Calculate member completion rates from active-range tasks.
- [ ] Filter right-panel ranking with the active range.
- [ ] Keep KPI, status distribution, and load distribution on the same range task array.

### Task 3: Verification and publish

**Files:**
- Verify: `app.js`

- [ ] Run `node --check app.js`.
- [ ] Check that no member completion calculation reads unfiltered `State.tasks`.
- [ ] Run `git diff --check`.
- [ ] Commit and push `main`.
