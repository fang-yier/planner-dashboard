# 双数据库保障设计

## 目标

Supabase 恢复为所有用户的主数据库；连接故障时由 CloudBase PostgreSQL 临时接管；浏览器本地缓存和待同步队列作为最后保护。Supabase 恢复后将临时操作回传并清空 CloudBase。

## 数据流

- 读取：优先从 Supabase 读取并刷新本地缓存；网络错误、超时、429 或 5xx 时读取 CloudBase 临时表；临时表为空时保留本机缓存。
- 写入：优先写 Supabase；仅连接性故障时将同一操作写入 CloudBase 临时表和操作日志。
- 双端失败：操作写入浏览器本地待同步队列；CloudBase 先恢复时，按 `op_id` 和原始顺序转存到 CloudBase 操作日志，收到成功响应后才删除本地记录。
- 恢复：Supabase 再次成功后，先回放本地队列，再按时间顺序回放 CloudBase 操作日志。
- 清理：逐条确认目标 ID 在 Supabase 中处于预期状态后，只确认本轮成功回放的 `op_id`。CloudBase 在事务锁内删除这些日志；仅当日志表确实为空时才清空三张临时表，避免并发新操作被误删。

## 边界与风险

- 不修改页面布局、目标周期规则和现有业务逻辑。
- CloudBase 只在 Supabase 连接性故障时临时接管，不处理 400、401、权限或字段错误。
- 每个操作使用全局唯一 `op_id`；CloudBase 日志以其为主键去重，保存采用 upsert，更新和删除均可安全重复执行。
- 任一传输或校验失败都会停止后续清理，保留未确认的本地记录及 CloudBase 日志供下次重试。
- 待同步队列位于发起操作的浏览器；两端长期不可用时，该浏览器需要再次打开页面才能补传。
- CloudBase 正常状态不保存完整历史，因此 Supabase 故障期间，无本地缓存的新设备只能看到临时接管阶段的数据。
- Supabase 的匿名访问策略继续决定所有用户是否可共同读写。

## 验收

- Supabase 与 CloudBase 连接均返回成功。
- Supabase CRUD 为阻断性结果；CloudBase 备份失败不阻断 Supabase 保存。
- Supabase 恢复后本地队列和 CloudBase 临时数据可自动清空。
- 现有全部回归测试通过。
