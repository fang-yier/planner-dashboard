# Daily Progress Kanban Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Split the progress kanban into one existing-style five-column board per date.

**Architecture:** Expand recurring tasks into daily instances, group by instance date, and render the unchanged status columns inside each date section. Drag operations continue updating the persisted task ID.

**Tech Stack:** Vanilla JavaScript, CSS Grid, existing pointer/drag handlers.

## Global Constraints

- Preserve all five original status colors exactly.
- Show only a simple date heading above each board.
- Sort dates newest first.
- Include linked-goal daily instances.
- Preserve drag-and-drop status changes.
- No fixed-height or internally scrolling date section.

---

### Task 1: Date grouping and repeated kanban rendering

**Files:**
- Modify: `app.js`
- Modify: `style.css`

- [ ] Run a failing date-group helper test.
- [ ] Add `groupKanbanTasksByDate(tasks)`.
- [ ] Render one five-column board for each date.
- [ ] Add minimal date heading and spacing styles.
- [ ] Verify original status colors, linked instances, date order, drag handlers, desktop/mobile layout, and syntax.
- [ ] Commit and push `main`.
