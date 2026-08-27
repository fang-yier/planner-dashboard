# Planner Dashboard 跨设备项目总交接

> 更新时间：2026-08-27  
> 用途：在其他设备、其他 Codex 会话或由其他开发者接手时，完整延续本项目。  
> 安全：本文不保存 Supabase Anon Key、腾讯云密钥、GitHub Token 或账号密码。

## 一、接手后的第一步

1. 从项目压缩包、代码目录或新负责人提供的代码仓库取得项目；如需 Git 协作，请先创建新的远程仓库。
2. 使用 `main` 分支，先执行 `git pull origin main`。
3. 完整阅读本文和根目录 `HANDOFF.md`；冲突时以最新代码、本文和用户当前指令为准。
4. 在新设备选择唯一的项目工作目录，避免同时维护多个副本。
5. 开始前执行 `git status --short --branch`，保留已有修改，不重置、不覆盖。
6. 本文生成时的代码基准是 `e663155 fix: sync member completion totals`；其他设备应以远端 `main` 最新提交为准。

可复制给新会话：

> 请先完整阅读项目根目录 PROJECT_CONTINUITY.md 和 HANDOFF.md。只在 main 最新代码上工作，只修改我明确提出的范围；完成后运行全部测试。部署前先由新负责人配置独立的代码仓库、数据库和云环境，不要沿用任何旧环境标识或密钥。

## 二、项目、地址与技术形态

这是一个中文团队计划与进度工作台，模块包括仪表盘、月目标、周目标、每日待办／成员待办、进度看板、设置和在线表链接。

项目是无框架构建的原生前端：

- `index.html`：页面结构
- `style.css`：全局样式和响应式布局
- `app.js`：主要业务、渲染、数据和同步逻辑，目前是单体大文件
- `banner-rocket.png`、`brand-logo.png`：正式视觉资产

交付状态：

- 默认主分支：`main`
- 代码仓库：尚未为新部署配置
- 正式线上地址：尚未部署
- CloudBase 环境：尚未创建或绑定
- Supabase 项目：尚未创建或绑定
- 新负责人必须使用自己的云账号、数据库项目、密钥和域名完成部署

## 三、长期工作方式与用户偏好

- 使用中文沟通，先给结果，再说必要细节。
- 用户说什么就改什么，不扩大范围，不顺手重构无关代码。
- 默认采用风险最低、改动最小的推荐方案。
- 所有工作在同一个会话中完成并统一验收，不另开任务。
- 通常每个代码任务完成后应测试、提交并推送 GitHub `main`；若用户当次明确说不推送，以当次要求为准。
- 代码仓库推送不等于云端已经上线，必须分别说明源码状态和线上状态。
- 不反复确认已明确的要求，避免浪费时间和 token。
- 不删除、清空、重置现有数据；迁移前后核对表和数量。
- 不能承诺绝对不会丢数据，应通过幂等、版本、操作日志、墓碑和冲突表降低风险，并说明真实边界。

## 四、已经确认的产品规则

### 1. 周目标与月目标

- 一个目标对应一个板块和一个负责人。
- 负责人默认按当前账号真实姓名自动填入，并允许自定义。
- 板块：页面、推广、活动、会员、social、直播、设计、达播。
- 原“未分配板块”已经改成“达播”。
- 目标卡大标题右侧显示板块标签和负责人。
- 左侧周目标页按“周周期 → 板块”分组；月目标页按“月周期 → 板块”分组。
- 周目标一周一个周期，月目标一月一个周期。左侧管理页的周期分组不能误改仪表盘规则。
- 仪表盘周／月目标都可选择周期，可查看现有及历史目标。
- 当前周期仪表盘不展示已完成或已过期目标；用户主动选择历史周期时可查看该周期目标。
- 仪表盘采用专用紧凑模式，左侧管理页保持完整样式。
- 紧凑目标卡中，描述与目标名同一行，并使用小字。
- 目标未关联待办时状态为“未开始”；关联待办综合完成率到 100% 时自动变成“已完成”。
- 新建待办的关联目标仅展示本周、本月、未来周中未完成且未过期的目标。
- 关联目标名称带周期，例如第 34 周显示 `W34目标名`，月目标显示对应月份前缀。

### 2. 仪表盘

- 成员待办只移动到周／月目标上方，原内容和规则不作额外修改。
- 周／月目标按板块分组，排版方式与成员待办按成员分组一致。
- 数据区包含任务状态分布、成员负载分布、板块需求分布。
- 板块需求分布来自关联成员待办，状态包括未开始、进行中、审核中、待上线、已完成、打白工。
- 未关联板块不展示。
- 成员待办选定日期、仪表盘统计范围、趋势区间是独立作用域，不能互相覆盖。

### 3. 成员待办完成率

| 状态 | 默认完成率 |
| --- | ---: |
| 未开始 | 0% |
| 进行中 | 保留当前值 |
| 审核中 | 90% |
| 待上线 | 100% |
| 已完成 | 100% |
| 打白工 | 100% |

- 用户手动把完成率调到 100% 后，状态变化不得再把它降低。
- 成员卡片总完成率和右侧成员排行都按每条待办实际 `completion_rate` 重新计算。
- 相关最新提交：`c8eda63`、`e663155`。

### 4. 在线表链接

- 所有用户共同维护、共同可见。
- 可自定义分类、名称、描述和链接，点击直接跳转。
- 按分类分组，分类名称显示在左上角。
- 全部分类中只能置顶一个。
- 搜索支持中文输入法组合输入，不能因重渲染造成输入框闪烁或丢字。

## 五、数据架构与容灾

### 1. 数据优先级

1. Supabase 是正式主库。
2. Supabase 不通时，写入 CloudBase 临时故障转移表。
3. 两端都不通时，进入当前浏览器本地待同步队列。
4. Supabase 恢复后，幂等回放 CloudBase 和本地队列的操作。
5. Supabase 逐项确认后才清理 CloudBase 临时数据；CloudBase 不长期保留已恢复数据。

真实边界：本地队列只存在产生操作的浏览器中。若两端故障期间清理浏览器数据、换设备或磁盘损坏，未上传操作可能丢失。

### 2. Supabase 主库

业务表：

- `monthly_goals`
- `daily_tasks`
- `online_sheet_links`

三张表的同步字段：`sync_version`、`last_op_id`、`updated_at`。

同步安全表：

- `planner_sync_operations`：幂等操作记录
- `planner_sync_tombstones`：删除墓碑，防止旧数据复活
- `planner_sync_conflicts`：无法安全自动合并的冲突

历史最近一次记录的数据量为目标 33、待办 178、在线表 15；这只是快照，接手时重新查询。

### 3. CloudBase 临时端

临时业务表：

- `planner_monthly_goals`
- `planner_daily_tasks`
- `planner_online_sheet_links`

同步表：

- `planner_failover_operations`
- `planner_failover_tombstones`

云函数：

- 名称：`planner-api`
- 路由：部署时自定义，例如 `/api`
- 代码：`cloudfunctions/planner-api/index.js`
- 包配置：`cloudfunctions/planner-api/package.json`

同步采用唯一 `op_id`、`sequence_no`、`base_version`、逐操作确认、事务锁和冲突记录。只清理 Supabase 已明确确认的操作 ID。

### 4. 浏览器本地数据

主要 localStorage 键：

- `wb_currentUser`、`wb_email`
- `wb_goals`、`wb_tasks`、`wb_online_sheet_links`
- `wb_failover_queue`
- `wb_supabase`
- `wb_dashboard_goal_slide`
- `wb_dashboard_week`、`wb_dashboard_month`
- `wb_task_owner_filter`

本地数据只是缓存和最后一道暂存，不是跨设备主库。没有备份和确认时禁止清空。

## 六、迁移、配置与安全资产

Supabase SQL：

- `docs/supabase/goal-board-access-migration.sql`
- `docs/supabase/online-sheet-links-migration.sql`
- `docs/supabase/sync-safety-migration.sql`

CloudBase SQL：

- `docs/cloudbase/failover-safety-migration.sql`

迁移原则：确认环境和 schema；尽量使用 `IF NOT EXISTS`；重复执行不破坏数据；执行后检查字段、策略、索引和数量；不要运行清空或重建业务表的 SQL。

密钥位置和规则：

- Supabase URL／Anon Key 从项目现有设置或 Supabase 控制台取得。
- CloudBase 配置来自腾讯云控制台和 `cloudbaserc.json`。
- GitHub 凭据由 Git 凭据管理器保存。
- 不把原始密钥写进 MD、代码提交、截图或聊天。

当前应用是共享可见、共享维护模式，前端可匿名访问相应业务表；localStorage 中姓名／邮箱不是真正身份认证。未来若需要安全的用户边界，必须单独实施正式登录和授权。

## 七、全新部署流程

> 当前交付文档不包含任何既有部署信息。对外使用前，需要在新负责人的账号下重新创建代码仓库、Supabase 项目和 CloudBase 环境。

### 1. 新代码仓库

先创建一个新的私有或公开 Git 仓库，将新的远程地址配置为 `origin`。不要沿用旧仓库地址或旧访问凭据。

```powershell
git status --short --branch
git diff --check
node --check app.js
Get-ChildItem tests -Filter *.js | ForEach-Object { node $_.FullName }
git add <仅本次相关文件>
git commit -m "类型: 简明说明"
git push origin main
```

### 2. 新 Supabase 项目

1. 在新负责人的 Supabase 账号中新建项目。
2. 执行 `docs/supabase/` 中的业务表和同步安全迁移 SQL。
3. 在应用设置中填写新项目 URL 和 Anon Key。
4. 检查 RLS 策略是否符合“所有授权使用者共同维护、共同可见”的要求。
5. 用测试数据验证目标、待办、在线表链接的新增、修改和删除。
6. 不导入旧环境密钥；如需迁移旧数据，必须单独导出、核对数量后再导入。

### 3. 新 CloudBase 环境和云函数

1. 在新负责人的腾讯云账号中创建 CloudBase 环境并开通 PostgreSQL、云函数和静态网站托管。
2. 执行 `docs/cloudbase/failover-safety-migration.sql`。
3. 将命令中的占位符替换为新环境 ID：

```powershell
tcb fn deploy planner-api -e <新CloudBase环境ID> --dir cloudfunctions/planner-api --force
```

CloudBase CLI 需要在新设备单独安装并登录新负责人的腾讯云账号。

### 4. 新静态站

静态站当前尚未部署。创建托管服务后，可上传整个前端目录，或使用类似命令部署；实际目标目录由新负责人决定：

```powershell
tcb hosting deploy . <新托管目录> -e <新CloudBase环境ID>
```

如果 CLI 上传失败，可在新 CloudBase 环境的控制台手动上传 `index.html`、`style.css`、`app.js` 和图片资产。

部署后强制刷新或增加时间戳查询参数，检查线上 `app.js` 与本地版本一致，再实际走一遍 UI。

### 5. 首次上线验收

- 当前没有可继承的正式线上地址，必须生成新的访问地址。
- 验证 Supabase 正常时直接读写主库。
- 验证 Supabase 异常时切换到新 CloudBase 临时端。
- 验证两端异常时进入本地队列，恢复后只回放一次。
- 核对新增、修改、删除、墓碑和冲突记录。
- 确认新环境中没有引用旧项目 URL、旧环境 ID、旧仓库地址或旧密钥。

## 八、测试与验收

测试文件：

- `tests/board-demand-distribution.js`
- `tests/cloudbase-postgres.js`
- `tests/dashboard-goal-compact.js`
- `tests/dual-database.js`
- `tests/goal-board-regression.js`
- `tests/goal-status-sync.js`
- `tests/management-goal-periods.js`
- `tests/online-sheet-links.js`
- `tests/task-goal-link-filter.js`
- `tests/task-progress-status.js`

最近记录共 192 项断言。项目没有统一 npm 测试器，逐个运行全部脚本。

最低验收：语法检查、全部测试、`git diff --check`、检查只有需求相关 diff、浏览器手动测试新增／编辑／删除和刷新持久化。涉及容灾时还要验证故障转移、本地队列、恢复后只回放一次、墓碑有效、冲突有记录。

## 九、不可破坏的设计约束

- 不改用户未要求的页面、状态名、颜色和布局。
- 不把左侧管理页的周期规则错误套到仪表盘。
- 不让不同日期选择器互相污染。
- 不重复持久化周期性任务生成结果。
- 删除必须有墓碑；回放必须使用稳定操作 ID。
- 版本不一致写冲突表，不静默覆盖较新数据。
- 主库逐项确认后才能清理故障端。
- 迁移前后记录数量并抽样比对。
- 不把“已提交”说成“已上线”。

## 十、已知风险与技术债

- `app.js` 较大且耦合；小需求中不要顺便重构。
- 没有正式账号认证和细粒度权限。
- 本地待同步队列不能跨浏览器自动共享。
- 已有冲突记录机制，但没有用户冲突处理界面。
- 趋势统计缺少完整状态历史表，不能精确还原任意历史时点。
- Supabase 免费实例的额度和暂停政策可能变化，以控制台为准。
- 云端静态上传可能受网络影响，应保留控制台手动上传兜底方式。
- 浏览器缓存可能导致页面仍加载旧代码。

## 十一、资产索引

- 视觉：`banner-rocket.png`、`brand-logo.png`
- 草图：`docs/mockups/goal-board-owner-grouping.html`、`docs/mockups/online-sheet-links.html`
- 方案：`docs/plans/`、`docs/superpowers/plans/`
- 历史交接：`HANDOFF.md`
- 后端：`cloudfunctions/planner-api/`
- 数据库：`docs/supabase/`、`docs/cloudbase/`
- 测试：`tests/`

## 十二、主要里程碑和关键提交

已完成：目标按板块／负责人／周期分组；成员待办调整位置；仪表盘周期选择和紧凑展示；关联目标过滤与周期前缀；板块需求分布；目标状态联动；在线表共享分类、单分类置顶和中文搜索；Supabase 主库 + CloudBase 临时端 + 本地队列；同步版本、幂等操作、删除墓碑和冲突记录；最新待办完成率和成员汇总规则。

近期关键提交：

- `e663155 fix: sync member completion totals`
- `c8eda63 fix: preserve completed task progress`
- `f8792a7 feat: harden failover conflict safety`
- `8e5f71f feat: add Supabase failover recovery`
- `07cc2aa feat: migrate shared data to CloudBase PostgreSQL`
- `5a738ab fix: stabilize online link search`
- `ff5727f feat: pin one online link category`

## 十三、固定交付闭环

1. 明确本次需求边界和不能动的页面。
2. 检查代码、测试和相关历史提交。
3. 最小修改，保护数据和无关改动。
4. 增加或更新针对性测试。
5. 跑语法、全量测试和 diff 检查。
6. 浏览器验收；数据任务同时检查三层存储。
7. 按本次用户要求决定是否提交和推送到新仓库。
8. 新云环境配置完成后再部署，或明确指出需要手动上传的文件。
9. 独立核验新线上版本。
10. 最终说明改动、测试、提交号、推送状态、新环境上线状态和剩余动作。

## 十四、接手快速检查

- [ ] 当前目录是实际仓库而非旧副本
- [ ] 当前分支是最新 `main`
- [ ] 已保留工作树中的用户修改
- [ ] 已阅读本文、HANDOFF 和用户最新要求
- [ ] 没有泄露密钥
- [ ] 没有扩大修改范围
- [ ] 数据迁移可重复执行且不清空数据
- [ ] 全量测试已通过
- [ ] 已按当次要求处理新代码仓库推送
- [ ] 新云环境已创建，且没有引用旧环境配置
- [ ] 已单独核验新线上静态版本
