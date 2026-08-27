# Goal Cards and Dashboard Carousel Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Unify weekly/monthly goal cards with member task cards and add a compact two-slide dashboard goal carousel.

**Architecture:** A shared goal-card renderer consumes a goal plus linked tasks for management and compact dashboard contexts. Dashboard state selects week/month slide and pointer gestures update the persisted selection.

**Tech Stack:** Vanilla JavaScript, CSS transforms, pointer events, localStorage, existing Supabase goal records.

## Global Constraints

- Weekly and monthly cards retain full-card priority prominence.
- Monthly goals expose and persist priority.
- Dashboard carousel has no arrows or explanatory caption.
- Dots and horizontal drag/swipe switch slides.
- Compact dashboard cards show at most two linked tasks.
- Existing goal/task editing and deletion remain available.

---

### Task 1: Shared goal task-card renderer

**Files:**
- Modify: `app.js`
- Modify: `style.css`

- [ ] Run a failing shared-renderer test.
- [ ] Render goal headers, progress, priority, linked task rows, and management actions.
- [ ] Replace weekly and monthly management cards.
- [ ] Add monthly priority input and persistence.

### Task 2: Compact dashboard carousel

**Files:**
- Modify: `app.js`
- Modify: `style.css`

- [ ] Render week/month slides with compact shared cards.
- [ ] Add two dots and persisted slide state.
- [ ] Add pointer drag/swipe with cleanup-safe per-render handlers.
- [ ] Verify desktop/mobile rendering, interaction, syntax, and data persistence.
- [ ] Commit and push `main`.
