# Future Linked Tasks Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Keep tasks linked to future weekly or monthly goals visible immediately until completion or the goal-period end.

**Architecture:** Adjust the existing pure `taskOccursOn(task, date)` recurrence boundary. Persist no extra records or fields; use `created_at` as the start and the existing goal range/completion helpers as the end.

**Tech Stack:** Vanilla JavaScript, existing Supabase persistence.

## Global Constraints

- Unlinked tasks remain visible only on their own date.
- Linked tasks start on their creation date, including when the goal is in the future.
- Completion day remains visible; later days do not.
- An unfinished linked task stops after its goal period ends.

---

### Task 1: Correct linked-task recurrence boundary

**Files:**
- Modify: `app.js`
- Verify: inline Node regression test

**Interfaces:**
- Consumes: `taskOccursOn(task, date)`, `goalTaskRange(goal)`, `taskCompletionDay(task)`
- Produces: Boolean occurrence decisions used by `expandTasksForRange(source, range)`

- [ ] **Step 1: Run a failing future-goal test**

Assert that a task created on `2026-08-14` and linked to `2026-W34` occurs on `2026-08-15`, before the goal starts.

- [ ] **Step 2: Implement the minimal boundary change**

Set the linked recurrence start to `task.created_at`, falling back to the task date, and retain the existing completion/goal end cutoff.

- [ ] **Step 3: Run weekly, monthly, completion, and unlinked checks**

Run the inline Node assertions and `node --check app.js`; expect all checks to pass.

- [ ] **Step 4: Publish**

Run `git diff --check`, commit the code and documentation, and push `main`.
