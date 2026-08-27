# Daily Task Owner Filter Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Filter the month/week/day daily-task calendar to one member while preserving the date hierarchy.

**Architecture:** Store a presentation-only owner selection in `State` and localStorage. Filter virtual daily instances before calendar grouping so empty dates/weeks/months disappear and all summaries recalculate naturally.

**Tech Stack:** Vanilla JavaScript, localStorage, existing render/event delegation.

## Global Constraints

- Default selection is all members.
- Up to five members use quick buttons; more members use a select.
- Invalid saved members fall back to all.
- Filtering never mutates persisted tasks.
- Refresh preserves the selection.

---

### Task 1: Member filter state, UI, and behavior

**Files:**
- Modify: `app.js`
- Modify: `style.css`

**Interfaces:**
- Consumes: `taskCalendarInstances()`, `renderTasks()`, `bindActions()`
- Produces: `filterTasksByOwner(tasks, owner)` and `State.taskOwnerFilter`

- [ ] Run a failing owner-filter helper test.
- [ ] Add persisted owner filter state and pure filter helper.
- [ ] Render quick buttons or a select based on member count.
- [ ] Bind selection changes and rerender the page.
- [ ] Verify summaries, empty hierarchy removal, persistence, and responsive layout.
- [ ] Commit and push `main`.
