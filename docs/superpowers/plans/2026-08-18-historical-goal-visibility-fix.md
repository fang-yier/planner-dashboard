# 历史目标可见性修复 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans in the current session. Steps use checkbox syntax.

**Goal:** 修复历史周期目标在仪表盘消失，并撤销管理页错误周期联动。

**Architecture:** 可见性函数接收所选周期和当前周期；历史周期直接保留该周期目标，当前周期才过滤已完成。管理页恢复全量数据后继续交给现有板块/周期分组函数。

**Tech Stack:** 原生 JavaScript、Node 静态回归脚本。

- [ ] 添加失败断言，覆盖历史周期可见、当前周期过滤和管理页全量规则。
- [ ] 修改 `dashboardGoalVisible(goal, selectedPeriod, currentPeriod)`。
- [ ] 周/月仪表盘传入对应选择周期与当前周期。
- [ ] 撤销管理页周期过滤、同步控件和选中周期默认值。
- [ ] 更新交接文档并运行回归、语法、diff 检查。
- [ ] 提交、推送现有 PR 分支并合并到本地 main。
