# 仪表盘周/月目标周期选择 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 为仪表盘周目标和月目标概览增加彼此独立、可持久化的周次与月份选择控件。

**Architecture:** 在现有 `State` 中增加 `dashboardWeek` 和 `dashboardMonth`，分别从 localStorage 恢复。目标过滤直接使用目标的 `month` 字段匹配所选周期；事件层负责上一周期、下一周期、回到当前周期和输入变更，不触碰成员待办或数据看板状态。

**Tech Stack:** 原生 JavaScript、HTML、CSS、localStorage、现有 Node 静态回归脚本。

## Global Constraints

- 周/月周期状态必须彼此独立。
- 不修改 `State.selectedDate`、`State.dashboardPeriod` 和趋势总览日期逻辑。
- 周目标使用 ISO 周格式 `YYYY-Www`，月目标使用 `YYYY-MM`。
- 已完成目标继续从仪表盘隐藏。
- 控件放在添加目标按钮之前，视觉复用成员待办日期控件。

---

### Task 1: 周/月周期状态和日期运算

**Files:**
- Modify: `app.js`（State 与日期辅助函数）
- Test: `tests/goal-board-regression.js`

**Interfaces:**
- Produces `shiftIsoWeek(week, delta): string`。
- Produces `shiftMonth(month, delta): string`。
- Produces `State.dashboardWeek` and `State.dashboardMonth`。

- [ ] **Step 1:** 在回归脚本中添加对两个状态、两个辅助函数和 localStorage 键的断言，并运行确认失败。
- [ ] **Step 2:** 实现 ISO 周前后移动和月份前后移动，初始化状态时默认当前周/月。
- [ ] **Step 3:** 运行 `node tests/goal-board-regression.js` 和 `node --check app.js`，确认通过。

### Task 2: 周/月目标过滤与控件渲染

**Files:**
- Modify: `app.js`（`renderDashboard`）
- Modify: `style.css`（周期控件响应式样式）
- Test: `tests/goal-board-regression.js`

**Interfaces:**
- Consumes `State.dashboardWeek` and `State.dashboardMonth`。
- Produces `data-action="dashboard-week-change"`、`dashboard-month-change` 及前后/当前周期按钮。

- [ ] **Step 1:** 添加断言，要求周目标按 `dashboardWeek`、月目标按 `dashboardMonth` 精确过滤，并要求控件 action 全部存在；运行确认失败。
- [ ] **Step 2:** 修改周/月目标统计、平均进度、板块分组和空状态，使其基于所选周期。
- [ ] **Step 3:** 在各自标题右侧添加上一周期、输入、下一周期、当前周期和添加目标按钮。
- [ ] **Step 4:** 增加小屏换行样式，避免控件挤压标题或产生横向滚动。
- [ ] **Step 5:** 运行回归、语法和 diff 检查。

### Task 3: 事件、持久化和交接

**Files:**
- Modify: `app.js`（change/click 事件）
- Modify: `HANDOFF.MD`
- Test: `tests/goal-board-regression.js`

**Interfaces:**
- Persists `wb_dashboard_week` and `wb_dashboard_month`。
- Does not mutate member task or dashboard board period state.

- [ ] **Step 1:** 添加对事件 action、localStorage 写入和不修改 `selectedDate` 的静态断言；运行确认失败。
- [ ] **Step 2:** 实现周期输入变更、前后切换和本周/本月操作，每次仅更新对应状态并重新渲染。
- [ ] **Step 3:** 更新交接文档，记录四套独立时间状态：成员待办、数据看板、周目标、月目标。
- [ ] **Step 4:** 运行 `node tests/goal-board-regression.js`、`node --check app.js`、`git diff --check`。
- [ ] **Step 5:** 提交 `git add app.js style.css HANDOFF.MD tests/goal-board-regression.js; git commit -m "feat: add dashboard goal period selectors"`。
