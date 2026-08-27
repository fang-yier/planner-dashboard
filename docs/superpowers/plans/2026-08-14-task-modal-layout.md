# Task Modal One-Screen Layout Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Show every member-task field in one desktop modal viewport without internal vertical scrolling.

**Architecture:** Add a task-specific modal class and responsive form grid. Remove the visible owner control and derive owner from the existing task or current signed-in user when saving.

**Tech Stack:** Vanilla JavaScript, CSS Grid, existing modal and keyboard handlers.

## Global Constraints

- Desktop task modal displays all fields without internal vertical scrolling.
- Mobile remains single-column and may scroll when the viewport requires it.
- New tasks use `State.currentUser`; edits preserve the stored owner.
- Enter saves and Escape cancels exactly as before.

---

### Task 1: Task-specific modal structure and owner behavior

**Files:**
- Modify: `app.js`
- Modify: `style.css`

**Interfaces:**
- Consumes: `showTaskForm(task)`, `showModal(html)`, `State.currentUser`
- Produces: `.task-modal` and `.task-form-grid` layout hooks

- [ ] Add a task-only modal class when task form markup is opened.
- [ ] Wrap task fields in a responsive grid and remove the owner input.
- [ ] Save owner from the existing task or current user.
- [ ] Add single-column mobile and two-column desktop styles.
- [ ] Run syntax, selector, and whitespace checks.
- [ ] Commit and push `main`.
