-- ============================================================
-- Planner Dashboard 完整部署脚本（全新 Supabase 项目专用）
-- 在 Supabase Dashboard → SQL Editor 中以管理员身份执行一次即可。
-- ============================================================

-- 1. 创建基础表：monthly_goals
create table if not exists public.monthly_goals (
  id text primary key,
  name text not null,
  board text default '',
  owner text default '',
  month text default '',
  priority text default '中',
  description text default '',
  progress real default 0,
  status text default '进行中',
  completion_date text,
  created_at timestamptz not null default now()
);

-- 2. 创建基础表：daily_tasks
create table if not exists public.daily_tasks (
  id text primary key,
  content text not null,
  description text default '',
  owner text default '',
  task_date text default '',
  status text default '未开始',
  estimated_hours real default 0,
  due_date text,
  priority text default '中',
  completion_rate real default 0,
  goal_id text,
  created_at timestamptz not null default now()
);

-- 3. 给 monthly_goals 补字段（兼容旧表）
ALTER TABLE public.monthly_goals ADD COLUMN IF NOT EXISTS board TEXT DEFAULT '';
ALTER TABLE public.monthly_goals ADD COLUMN IF NOT EXISTS priority TEXT DEFAULT '中';
ALTER TABLE public.monthly_goals ADD COLUMN IF NOT EXISTS completion_date TEXT;

-- 4. 关闭表级 RLS，允许 anon key 访问
ALTER TABLE public.monthly_goals DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.daily_tasks DISABLE ROW LEVEL SECURITY;
GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE public.monthly_goals TO anon, authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE public.daily_tasks TO anon, authenticated;

-- 5. 创建 online_sheet_links 表
create table if not exists public.online_sheet_links (
  id text primary key,
  title text not null,
  category text not null,
  url text not null,
  description text default '',
  owner text default '',
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
grant usage on schema public to anon, authenticated;
grant select, insert, update, delete on table public.online_sheet_links to anon, authenticated;
alter table public.online_sheet_links enable row level security;
drop policy if exists online_sheet_links_shared_select on public.online_sheet_links;
drop policy if exists online_sheet_links_shared_insert on public.online_sheet_links;
drop policy if exists online_sheet_links_shared_update on public.online_sheet_links;
drop policy if exists online_sheet_links_shared_delete on public.online_sheet_links;
create policy online_sheet_links_shared_select on public.online_sheet_links for select to anon, authenticated using (true);
create policy online_sheet_links_shared_insert on public.online_sheet_links for insert to anon, authenticated with check (true);
create policy online_sheet_links_shared_update on public.online_sheet_links for update to anon, authenticated using (true) with check (true);
create policy online_sheet_links_shared_delete on public.online_sheet_links for delete to anon, authenticated using (true);

-- 6. 同步安全字段（三张表）
begin;
alter table public.monthly_goals add column if not exists sync_version bigint not null default 0;
alter table public.monthly_goals add column if not exists last_op_id text;
alter table public.monthly_goals add column if not exists updated_at timestamptz not null default now();
alter table public.daily_tasks add column if not exists sync_version bigint not null default 0;
alter table public.daily_tasks add column if not exists last_op_id text;
alter table public.daily_tasks add column if not exists updated_at timestamptz not null default now();
alter table public.online_sheet_links add column if not exists sync_version bigint not null default 0;
alter table public.online_sheet_links add column if not exists last_op_id text;
alter table public.online_sheet_links add column if not exists updated_at timestamptz not null default now();

-- 7. 同步安全表
create table if not exists public.planner_sync_operations (
  op_id text primary key,
  table_name text not null check (table_name in ('monthly_goals','daily_tasks','online_sheet_links')),
  record_id text not null,
  operation text not null check (operation in ('save','update','delete')),
  base_version bigint not null,
  applied_version bigint,
  payload jsonb not null default '{}'::jsonb,
  status text not null default 'pending' check (status in ('pending','applied','conflict')),
  occurred_at timestamptz not null,
  applied_at timestamptz,
  created_at timestamptz not null default now()
);
create index if not exists planner_sync_operations_record_idx
  on public.planner_sync_operations(table_name,record_id,created_at);

create table if not exists public.planner_sync_tombstones (
  table_name text not null check (table_name in ('monthly_goals','daily_tasks','online_sheet_links')),
  record_id text not null,
  sync_version bigint not null,
  last_op_id text not null,
  deleted_at timestamptz not null default now(),
  primary key(table_name,record_id)
);

create table if not exists public.planner_sync_conflicts (
  conflict_id bigint generated always as identity primary key,
  op_id text not null unique,
  table_name text not null,
  record_id text not null,
  base_version bigint not null,
  current_version bigint not null,
  incoming_payload jsonb not null,
  current_payload jsonb,
  status text not null default 'unresolved' check (status in ('unresolved','resolved')),
  created_at timestamptz not null default now(),
  resolved_at timestamptz
);

alter table public.planner_sync_operations enable row level security;
alter table public.planner_sync_tombstones enable row level security;
alter table public.planner_sync_conflicts enable row level security;
grant select,insert,update,delete on public.planner_sync_operations to anon,authenticated;
grant select,insert,update,delete on public.planner_sync_tombstones to anon,authenticated;
grant select,insert,update,delete on public.planner_sync_conflicts to anon,authenticated;
grant usage,select on sequence public.planner_sync_conflicts_conflict_id_seq to anon,authenticated;
drop policy if exists planner_sync_operations_shared on public.planner_sync_operations;
create policy planner_sync_operations_shared on public.planner_sync_operations for all to anon,authenticated using (true) with check (true);
drop policy if exists planner_sync_tombstones_shared on public.planner_sync_tombstones;
create policy planner_sync_tombstones_shared on public.planner_sync_tombstones for all to anon,authenticated using (true) with check (true);
drop policy if exists planner_sync_conflicts_shared on public.planner_sync_conflicts;
create policy planner_sync_conflicts_shared on public.planner_sync_conflicts for all to anon,authenticated using (true) with check (true);
commit;

-- 8. 刷新 schema 缓存
notify pgrst, 'reload schema';

-- 验证：执行后应看到以下 6 张表
-- monthly_goals | daily_tasks | online_sheet_links
-- planner_sync_operations | planner_sync_tombstones | planner_sync_conflicts
