begin;

create table if not exists public.planner_failover_operations (
  op_id text primary key,
  table_name text not null,
  operation text not null,
  payload jsonb not null,
  created_at timestamptz not null default now()
);
alter table public.planner_failover_operations add column if not exists sequence_no bigserial;
alter table public.planner_failover_operations add column if not exists record_id text;
alter table public.planner_failover_operations add column if not exists base_version bigint not null default 0;
alter table public.planner_failover_operations add column if not exists occurred_at timestamptz not null default now();
create unique index if not exists planner_failover_operations_sequence_uidx
  on public.planner_failover_operations(sequence_no);

create table if not exists public.planner_failover_tombstones (
  table_name text not null,
  record_id text not null,
  base_version bigint not null,
  op_id text not null,
  deleted_at timestamptz not null default now(),
  primary key(table_name,record_id)
);

commit;
