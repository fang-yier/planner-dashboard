# Dashboard Goal Height Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Reduce the dashboard weekly/monthly goal overview to a two-line compact target layout.

**Architecture:** Render a compact board header and inline goal progress only for dashboard calls while retaining the existing management markup. Scope all compact styling under dashboard-specific classes.

**Tech Stack:** Vanilla CSS, Node.js assertions.

## Global Constraints

- Preserve the board avatar, goal tags, metadata, and goal progress.
- Show dashboard descriptions inline after the goal name in small muted text, with ellipsis on overflow.
- Remove dashboard board statistics/progress only.
- Do not reduce period selector button/input hit areas.
- Do not affect weekly/monthly management pages.

---

### Task 1: Compact dashboard goal spacing

**Files:**
- Modify: `app.js:633-705`
- Modify: `style.css:453-480,836-853`
- Create: `tests/dashboard-goal-compact.js`

**Interfaces:**
- Consumes: existing `.dashboard-goal-slide` markup.
- Produces: dashboard-only compact header, hidden description, and two-line goal card.

- [ ] **Step 1: Write a failing style regression test**

Assert dashboard-scoped compact rules exist and the description is not hidden.

- [ ] **Step 2: Run the test and verify failure**

Run: `node tests/dashboard-goal-compact.js`
Expected: FAIL because compact board spacing overrides are absent.

- [ ] **Step 3: Add minimal scoped CSS**

Add only `.dashboard-goal-*` or `.dashboard-goal-slide ...` overrides; do not modify shared management styles.

The first row groups goal name and optional description in `.dashboard-goal-title-line`; tags and completion rate remain in the right-side group.

- [ ] **Step 4: Verify**

Run all three regression scripts, `node --check app.js`, and `git diff --check`.

- [ ] **Step 5: Publish**

Commit to `main` and push `origin main`.
