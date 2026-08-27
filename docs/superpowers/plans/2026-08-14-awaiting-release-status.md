# Awaiting Release Task Status Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add the “待上线” task status throughout editing, cards, kanban, and dashboard statistics, with an automatic 90% completion rate.

**Architecture:** Extend the existing centralized status mappings and render-time arrays in `app.js`, then add one matching visual selector in `style.css`. Preserve every existing status color and completion rule.

**Tech Stack:** Vanilla JavaScript, HTML templates, CSS, localStorage/Supabase persistence.

## Global Constraints

- Existing status colors must remain unchanged.
- Selecting or dragging to “待上线” must persist `completion_rate: 0.9`.
- “待上线” must not count as completed.

---

### Task 1: Status behavior and rendering

**Files:**
- Modify: `app.js`
- Modify: `style.css`

**Interfaces:**
- Consumes: existing `syncProgressToStatus`, task form save handler, kanban drag handler, status maps.
- Produces: consistent “待上线” status behavior and styling across all task views.

- [ ] **Step 1: Write the failing regression check**

Create an inline Node assertion that requires the task status selector, card maps, kanban statuses, dashboard counters, and 90% completion rule to contain “待上线”.

- [ ] **Step 2: Run the check and verify RED**

Run the assertion against the current `app.js`; expect failure because “待上线” is absent.

- [ ] **Step 3: Implement the minimal status extension**

Add “待上线” to task mappings and arrays, set percentage to 90 in `syncProgressToStatus` and task save behavior, persist 0.9 in kanban drag updates, and add dashboard counts/legends.

- [ ] **Step 4: Add the new visual selector**

Add `.badge-release` and `.kanban-column[data-status="待上线"]` without changing existing status selectors.

- [ ] **Step 5: Verify GREEN and browser behavior**

Run the Node regression check, `node --check app.js`, `git diff --check`, then verify the UI in a browser at desktop width.

- [ ] **Step 6: Commit and push**

Stage the implementation and plan files, commit with `feat: add awaiting release task status`, and push `main`.
