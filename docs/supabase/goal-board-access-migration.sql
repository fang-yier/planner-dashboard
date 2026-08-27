-- Planner Dashboard 目标板块与协同访问修复
-- 请在 Supabase Dashboard → SQL Editor 中以数据库管理员身份执行一次。

ALTER TABLE public.monthly_goals
  ADD COLUMN IF NOT EXISTS board TEXT DEFAULT '';

ALTER TABLE public.monthly_goals
  ADD COLUMN IF NOT EXISTS priority TEXT DEFAULT '中',
  ADD COLUMN IF NOT EXISTS completion_date TEXT;

-- 当前工作台使用同一个 Supabase 项目供协同用户读写。
-- 关闭表级 RLS，避免 anon key 被 42501 拒绝。
ALTER TABLE public.monthly_goals DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.daily_tasks DISABLE ROW LEVEL SECURITY;

GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE public.monthly_goals TO anon, authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE public.daily_tasks TO anon, authenticated;

NOTIFY pgrst, 'reload schema';
