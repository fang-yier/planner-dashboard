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
notify pgrst, 'reload schema';
