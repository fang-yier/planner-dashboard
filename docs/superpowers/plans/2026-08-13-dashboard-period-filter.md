# Dashboard Period Filter Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make 本周、本月、更多 filter dashboard statistics by date, and show every member task without a six-item cap.

**Architecture:** Store the selected dashboard period in `State`, derive an inclusive date range, and calculate the data-board KPIs/charts from tasks and goals within that range. Keep the existing member-task date selector independent. Use the existing modal system for a custom start/end date.

**Tech Stack:** Vanilla JavaScript, HTML templates, CSS, local/Supabase-backed application state.

## Global Constraints

- 本周 uses the current Monday through Sunday.
- 本月 uses the first through last day of the current month.
- 更多 opens an inclusive custom start/end date dialog.
- Member task cards display every matching task and grow naturally beyond six rows.
- Preserve existing dashboard styling and deployment workflow.

---

### Task 1: Dashboard period state and filtering

**Files:**
- Modify: `app.js`

**Interfaces:**
- Produces: `State.dashboardPeriod`, `State.dashboardCustomStart`, `State.dashboardCustomEnd`, and dashboard range filtering.

- [ ] Add period state and date-range helpers.
- [ ] Filter data-board tasks and goals before calculating KPIs and charts.
- [ ] Bind 本周、本月 tabs to immediate rerendering.
- [ ] Bind 更多 to a start/end date modal and validate that end is not before start.
- [ ] Run `node --check app.js` and verify the three actions are present.

### Task 2: Unlimited member task rows

**Files:**
- Modify: `app.js`

**Interfaces:**
- Consumes: existing `displayTasks` array.
- Produces: all rows rendered without a fixed slice.

- [ ] Replace the six-item slice with a full map.
- [ ] Confirm the member cards have no fixed height or internal overflow rule.
- [ ] Run `git diff --check` and inspect the final diff.

### Task 3: Task form keyboard controls

**Files:**
- Modify: `app.js`

**Interfaces:**
- Produces: Enter save, Ctrl/Cmd+Enter save inside textareas, and Escape cancel for the task modal.

- [ ] Mark the task modal and its save button for scoped keyboard handling.
- [ ] Add a modal-local keydown listener without listener accumulation.
- [ ] Preserve plain Enter as a newline inside textareas.
- [ ] Verify Escape closes without saving.

### Task 4: Publish

**Files:**
- Modify: `app.js`
- Commit: plan and implementation.

- [ ] Commit with an intentional message.
- [ ] Push `main` to `origin`.
- [ ] Confirm the working tree is clean and report the commit hash.
