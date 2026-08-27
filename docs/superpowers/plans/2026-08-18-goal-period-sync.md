# 仪表盘与目标管理页周期同步 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 让仪表盘与左侧周/月目标管理页共用同一周期选择，并让新建目标默认使用所选周期。

**Architecture:** 复用现有 `State.dashboardWeek`、`State.dashboardMonth` 和周期事件，不新增重复状态。管理页按对应状态过滤后再进行板块分组，管理页周期控件继续使用现有 action，因此任一页面切换都会同步到另一页面。

**Tech Stack:** 原生 JavaScript、CSS、localStorage、Node 静态回归脚本。

## Global Constraints

- 管理页显示所选周期内全部目标，包括已完成目标。
- 仪表盘继续隐藏已完成/已过期目标。
- 新建目标默认使用当前所选周期。
- 不改变成员待办、数据看板和趋势总览状态。

---

### Task 1: 管理页周期过滤和控件

**Files:**
- Modify: `app.js` (`renderGoals`, `renderWeekGoals`)
- Test: `tests/goal-board-regression.js`

- [ ] 添加失败断言：管理页按 `State.dashboardMonth`/`State.dashboardWeek` 过滤，且包含现有周期 action。
- [ ] 运行 `node tests/goal-board-regression.js`，确认因功能缺失失败。
- [ ] 在管理页标题右侧复用上一周期、选择器、下一周期、本周/本月和新建按钮。
- [ ] 过滤所选周期后调用 `renderGoalBoardGroups(..., { manage: true })`，不使用仪表盘完成状态过滤。
- [ ] 运行回归与语法检查。

### Task 2: 新建默认周期和回归

**Files:**
- Modify: `app.js` (`showGoalForm`, `showWeekGoalForm`)
- Modify: `HANDOFF.MD`
- Test: `tests/goal-board-regression.js`

- [ ] 添加失败断言：月目标默认 `State.dashboardMonth`，周目标默认 `State.dashboardWeek`。
- [ ] 修改新建目标默认对象，编辑目标仍保留目标原周期。
- [ ] 更新交接说明，记录仪表盘与管理页周期同步规则。
- [ ] 运行 `node tests/goal-board-regression.js`、`node --check app.js`、`git diff --check`。
- [ ] 提交 `git add app.js HANDOFF.MD tests/goal-board-regression.js; git commit -m "feat: sync goal periods across dashboard and management"`。
