# 工作分工周期表编辑器 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task.

**Goal:** 在现有 vanilla JS 工作台中新增工作分工入口，支持按周期保存历史版本，并在当前周期内编辑表格、增删行列和合并单元格。

**Architecture:** 复用现有 index.html 导航、app.js 的视图渲染和事件委托、style.css 的卡片/按钮体系。工作分工数据以周期文档保存到 localStorage，结构为 {id,title,start_date,end_date,notice,columns,rows,created_at,updated_at}；表格行使用二维网格与 rowspan/colspan 元数据渲染。

**Tech Stack:** Vanilla JavaScript, HTML, CSS, localStorage, optional Supabase REST.

## Global Constraints

- 视觉沿用当前 Web 应用的白色卡片、浅灰边框、蓝紫色按钮。
- 截图只提供默认内容结构：板块、需求、负责人、备注及示例文本。
- 历史周期与当前周期独立保存，编辑当前周期不覆盖历史。
- 每次代码调整完成后执行验证、commit、push，并检查线上文件。

### Task 1: 导航和数据模型

**Files:** index.html, app.js

- [ ] 加入 workDivision 导航入口和标题。
- [ ] 增加 State.workDivisions、周期读取/保存、默认 8 月示例数据。
- [ ] 为周期复制、编辑、归档和历史选择提供状态字段。

### Task 2: 工作分工表格视图和编辑器

**Files:** app.js, style.css

- [ ] 渲染当前周期、统一提醒和四列表格。
- [ ] 支持编辑单元格、增加/删除行列。
- [ ] 支持选择相邻单元格后合并，支持取消合并。
- [ ] 复用现有 modal、toast、按钮和响应式布局。

### Task 3: 验证和上线

**Files:** app.js, style.css

- [ ] 运行 node --check app.js、git diff --check。
- [ ] 检查关键交互函数和默认内容字符串。
- [ ] 提交并推送 main，用线上 app.js 查询新增入口标记。
