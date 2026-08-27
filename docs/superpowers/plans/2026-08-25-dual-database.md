# Dual Database Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Restore Supabase as the primary shared database, fail over temporarily to CloudBase during connectivity outages, then replay and clear temporary data after recovery.

**Architecture:** Existing `_sb*` methods use Supabase REST first and classify only timeout, network, 429, and 5xx failures as failover events. CloudBase records mutations plus an ordered operation journal; recovery replays and verifies those operations in Supabase before clearing CloudBase, with localStorage as a last-resort outbox.

**Tech Stack:** Vanilla JavaScript, Supabase PostgREST, CloudBase HTTP function, Node-based regression tests.

## Global Constraints

- Modify only the data adapter, settings copy, and focused tests.
- Preserve all current UI and business behavior.
- Push the completed and verified change to GitHub `main`.

---

### Task 1: Primary and backup adapter

**Files:**
- Modify: `app.js`
- Test: `tests/cloudbase-postgres.test.js`
- Create: `tests/dual-database.test.js`

**Interfaces:**
- Consumes: existing `DB._sb*`, `DB._cloudRequest`, and localStorage helpers.
- Produces: direct Supabase CRUD plus `DB._stageFailover`, `DB._recoverSupabaseFromFailover`.

- [ ] Write tests asserting Supabase is primary, CloudBase is used only for connectivity failover, and recovery clears verified staging data.
- [ ] Run the focused tests and confirm they fail against the CloudBase-only adapter.
- [ ] Restore direct PostgREST implementations for `_sbSelect`, `_sbInsert`, `_sbUpsert`, `_sbUpdate`, and `_sbDelete`.
- [ ] Add CloudBase operation journaling, a local fallback queue, ordered local-to-CloudBase transfer, replay verification, and cleanup.
- [ ] Update settings labels and connection test to report both primary and backup status.
- [ ] Run focused and full regression suites.

### Task 2: Live verification and delivery

**Files:**
- Modify: `HANDOFF.MD` only if operational notes require correction.

**Interfaces:**
- Consumes: deployed Supabase and CloudBase endpoints.
- Produces: verified source commit on `main`.

- [ ] Execute non-destructive reads against both services.
- [ ] Execute create/update/delete smoke tests with unique temporary IDs and remove them from both services.
- [ ] Confirm the worktree contains no unrelated tracked changes.
- [ ] Commit the implementation and push `main` to GitHub.
