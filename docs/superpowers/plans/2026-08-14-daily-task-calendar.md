# Daily Task Calendar Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Render daily tasks as month containers containing week sections containing responsive day cards.

**Architecture:** Derive virtual task instances with the existing recurrence engine, group them by month, ISO week, and date, then render day cards in an auto-fitting CSS grid. Editing and deletion continue to use the persisted task ID.

**Tech Stack:** Vanilla JavaScript, CSS Grid, existing Supabase task records.

## Global Constraints

- One card represents one date and contains all tasks shown on that date.
- Day cards wrap to new rows automatically and grow parent heights.
- Linked weekly/monthly tasks appear on every virtual occurrence date.
- No internal scroll area is added to month, week, or day containers.
- Existing add, edit, and delete operations remain available.

---

### Task 1: Calendar grouping and rendering

**Files:**
- Modify: `app.js`
- Modify: `style.css`

**Interfaces:**
- Consumes: `expandTasksForRange(source, range)`, `goalTaskRange(goal)`, `getWeekStr(date)`
- Produces: `taskCalendarInstances()` and `groupTasksByCalendar(tasks)`

- [ ] Run a failing grouping-helper test.
- [ ] Add calendar-range, grouping, and summary helpers.
- [ ] Replace owner-group rendering with month/week/day card rendering.
- [ ] Add responsive auto-fit day-card grid styles.
- [ ] Verify linked recurrence, grouping order, syntax, and real browser wrapping.
- [ ] Commit and push `main`.
