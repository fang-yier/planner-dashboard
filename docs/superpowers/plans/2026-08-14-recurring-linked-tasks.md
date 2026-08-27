# Recurring Linked Tasks Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Expand linked tasks into one dashboard instance per active day and calculate actual completion duration.

**Architecture:** Keep one persisted task record. Pure helper functions derive goal date bounds, decide whether a task occurs on a date, and expand records for an active dashboard range.

**Tech Stack:** Vanilla JavaScript, existing localStorage/Supabase persistence.

## Global Constraints

- Unlinked tasks occur only on their own date.
- Weekly tasks occur from Monday through Sunday of the linked ISO week.
- Monthly tasks occur through the linked calendar month.
- Recurrence begins no earlier than the task date.
- Completion day is included; following days are excluded.
- Range metrics count one instance per active day.
- Completion duration is creation timestamp through first completion timestamp.

---

### Task 1: Recurrence helpers

**Files:**
- Modify: `app.js`

- [ ] Implement goal range parsing for `YYYY-Www` and `YYYY-MM`.
- [ ] Implement task occurrence rules and completion-day cutoff.
- [ ] Implement range expansion with virtual instance dates and statuses.

### Task 2: Dashboard integration

**Files:**
- Modify: `app.js`

- [ ] Feed expanded task instances to dashboard and right ranking.
- [ ] Render each instance date in member cards.
- [ ] Count expanded instances in week/month/custom statistics.

### Task 3: Completion timing

**Files:**
- Modify: `app.js`

- [ ] Preserve first precise completion timestamp when status becomes 已完成.
- [ ] Format elapsed creation-to-completion duration in completed member tasks.
- [ ] Keep date form values compatible by slicing timestamps to `YYYY-MM-DD`.

### Task 4: Verification and publish

**Files:**
- Verify: `app.js`

- [ ] Run syntax and whitespace checks.
- [ ] Assert recurrence helper call sites drive dashboard and ranking.
- [ ] Commit and push `main`.
