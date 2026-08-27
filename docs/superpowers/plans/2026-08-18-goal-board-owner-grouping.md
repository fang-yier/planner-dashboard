# 周目标/月目标板块与负责人分组 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 为周目标和月目标增加板块及可编辑负责人信息，按板块分组展示，并将仪表盘成员待办移动到目标概览上方。

**Architecture:** 沿用现有 Vanilla JavaScript 单文件架构。使用固定板块常量和共享分组渲染辅助函数，目标对象新增 `board` 字段并继续复用现有 `owner` 字段；缺少板块的历史目标归入“未分配板块”。仪表盘只调整渲染顺序，不改变三套日期范围和成员待办计算规则。

**Tech Stack:** 原生 HTML/CSS/JavaScript、现有 Supabase REST 数据层、localStorage 降级模式、Node.js 语法检查与现有浏览器验收流程。

## Global Constraints

- 实际项目目录固定为 `C:\Users\huangxiangdong\BaiduSyncdisk\planner-dashboard`。
- 每个目标只能有一个板块和一个负责人。
- 板块选项固定为：页面、推广、活动、会员、social、直播、其他。
- 新建目标时负责人默认当前账号真实姓名，编辑时保留已有负责人，且允许手动修改。
- 目标卡片在原有大标题右侧追加板块标签和负责人姓名。
- 旧目标缺少 `board` 时显示在“未分配板块”，不得破坏旧数据。
- 不改变成员待办的日期、状态、完成率和按负责人分组逻辑。
- 仪表盘周/月目标概览过滤已完成目标和已过期目标；管理页仍显示完整历史。
- 周/月目标管理页采用“板块 → 时间段 → 目标卡片”层级；周目标按周次、月目标按月份分段。
- 不改变“待上线”90%、“已完成”100%、“未开始/打白工”0%的既有规则。

---

### Task 1: 建立板块字段与共享分组规则

**Files:**
- Modify: `app.js:1-190`（常量/工具函数区域）
- Modify: `app.js:570-625`（目标卡片渲染）
- Test: 使用 `node --check app.js` 和现有静态回归命令验证

**Interfaces:**
- Produces `GOAL_BOARDS` 固定板块数组。
- Produces `goalBoardName(goal)`，将空值映射为 `未分配板块`。
- Produces `groupGoalsByBoard(goals)`，返回按固定板块顺序排列的 `{ board, goals }[]`，只保留有目标的分组。

- [ ] **Step 1: 写出分组规则的最小可验证样例**

在本地临时 Node 评估片段中覆盖：有板块目标、空板块旧目标、不同目标类型混合时都按 `board` 分组；验证分组顺序是固定板块顺序，旧数据进入 `未分配板块`。

- [ ] **Step 2: 运行语法检查确认基线**

Run: `node --check app.js`

Expected: 命令成功退出，无语法错误。

- [ ] **Step 3: 实现固定常量、空值兼容和分组辅助函数**

保持现有 `escapeHtml` 和排序逻辑；分组函数不得改变目标数组本身，也不得丢弃没有 `board` 的历史目标。

- [ ] **Step 4: 修改目标卡片标题区域**

在 `renderGoalTaskCard` 的大标题右侧加入板块标签与负责人姓名，使用现有 HTML 转义函数；不改变进度条、状态标签、优先级和编辑点击区域。

- [ ] **Step 5: 运行验证并提交**

Run: `node --check app.js`

Expected: PASS；随后提交：`git add app.js; git commit -m "feat: add goal board grouping helpers"`。

### Task 2: 更新周目标/月目标编辑表单和保存逻辑

**Files:**
- Modify: `app.js:996-1078`（月目标、周目标页面和表单）
- Modify: `app.js:1590-1688`（目标保存事件）
- Test: `node --check app.js`；手动/浏览器验证新增和编辑流程

**Interfaces:**
- Consumes `GOAL_BOARDS`。
- Persists `board` alongside existing goal fields through `DB.saveGoal`/`DB.updateGoal`。

- [ ] **Step 1: 为月目标和周目标表单增加板块下拉框**

新增目标使用 `board: ''`，编辑旧目标读取 `goal.board || ''`；下拉选项包含固定板块和“未分配板块”显示项，保存空值时仍保持旧数据兼容。

- [ ] **Step 2: 保持负责人默认值和编辑值**

新建目标默认使用 `State.currentUser`，编辑目标使用已有 `goal.owner`；负责人输入框继续允许手动改名。

- [ ] **Step 3: 把 `board` 写入周/月目标保存 payload**

在 `save-goal` 和 `save-weekgoal` 两个事件中读取 `g_board`，并传给现有保存方法；不得覆盖目标 ID、周期、进度、状态和完成日期。

- [ ] **Step 4: 验证新建、编辑和历史数据**

使用浏览器验证：新建周目标/月目标能选择板块；负责人默认当前姓名；编辑可改板块和姓名；旧目标无板块能正常打开和保存。

- [ ] **Step 5: 运行检查并提交**

Run: `node --check app.js`

Expected: PASS；提交：`git add app.js; git commit -m "feat: add board and owner fields to goals"`。

### Task 3: 按板块重排目标管理页和仪表盘目标概览

**Files:**
- Modify: `app.js:830-950`（仪表盘渲染顺序与目标概览）
- Modify: `app.js:996-1053`（管理页目标列表）
- Modify: `style.css:756-830` 及相关目标卡片样式
- Test: 浏览器桌面端截图验收；移动宽度回归；`node --check app.js`

**Interfaces:**
- Consumes `groupGoalsByBoard(goals)` and `goalBoardName(goal)`。
- Produces board group sections that contain the existing goal card markup.

- [ ] **Step 1: 修改月目标和周目标管理页为板块分组渲染**

先按板块分组，再在每个板块内按周次或月份分组，最后按现有优先级排序目标并生成目标网格；无目标时继续显示现有空状态。

- [ ] **Step 2: 修改仪表盘周/月目标概览为板块分组渲染**

保留周/月轮播、平均进度、数量和添加按钮；先过滤 `status === '已完成'` 和目标周期结束日早于今天的目标，再把剩余目标按板块分组。管理页不应用该过滤。

- [ ] **Step 3: 调整仪表盘 DOM 顺序**

将成员待办卡片节点移动到周/月目标概览卡片之前，使其位于 Banner 下方；成员待办日期控件、空状态、成员卡片和相关事件属性保持不变。

- [ ] **Step 4: 增加最小样式**

为板块分组标题、标签和负责人文字复用现有卡片视觉体系；确保标题右侧在桌面端横向排列，小屏幕自动换行，不产生横向溢出。

- [ ] **Step 5: 运行静态检查和浏览器验收**

Run: `node --check app.js`

Expected: PASS。浏览器检查：桌面端目标卡片标题右侧信息可读；成员待办在目标概览上方；已完成/已过期目标不出现在仪表盘但仍出现在管理页；移动端分组和卡片不溢出。

- [ ] **Step 6: 提交界面调整**

`git add app.js style.css; git commit -m "feat: group goals by board and reorder dashboard"`

### Task 4: 数据库兼容、回归和交接更新

**Files:**
- Modify: `app.js:1270-1310`（现有 Supabase schema/初始化提示区域，如需要）
- Modify: `HANDOFF.MD`（完成功能后更新状态和已知限制）
- Test: `node --check app.js`、Git diff 检查、浏览器验收

**Interfaces:**
- Consumes persisted `board` values from localStorage/Supabase。
- Produces updated handoff notes and deployment checklist。

- [ ] **Step 1: 检查 Supabase 目标表字段兼容性**

确认 `monthly_goals` 表允许 `board` 字段写入；若线上表缺字段，保留代码的本地降级兼容并在交接文档明确执行 `ALTER TABLE monthly_goals ADD COLUMN IF NOT EXISTS board TEXT DEFAULT '';` 后再部署。

- [ ] **Step 2: 运行最终语法与静态回归**

Run: `node --check app.js`

Expected: PASS。使用 `git diff HEAD~4..HEAD --check` 检查空白错误，并确认没有改动错误目录。

- [ ] **Step 3: 执行浏览器验收场景**

覆盖：新建周目标、新建月目标、默认负责人、修改板块/姓名、旧目标无板块、管理页板块/周次/月份分组、已完成/已过期目标的仪表盘过滤、仪表盘成员待办顺序、日期切换后待办逻辑不变。

- [ ] **Step 4: 更新交接文档**

在 `HANDOFF.MD` 增加已完成的板块/负责人字段、分组展示、仪表盘顺序和 Supabase 字段要求；保留原有日期联动与状态映射注意事项。

- [ ] **Step 5: 最终提交并报告部署边界**

提交 `git add app.js style.css HANDOFF.MD; git commit -m "docs: update goal grouping handoff"`。说明 GitHub 推送和 CloudBase 手动部署仍是两个独立步骤，未执行线上部署前不得宣称线上已更新。
