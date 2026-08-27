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

alter table public.online_sheet_links add column if not exists id text;
alter table public.online_sheet_links add column if not exists title text;
alter table public.online_sheet_links add column if not exists category text;
alter table public.online_sheet_links add column if not exists url text;
alter table public.online_sheet_links add column if not exists description text default '';
alter table public.online_sheet_links add column if not exists owner text default '';
alter table public.online_sheet_links add column if not exists sort_order integer default 0;
alter table public.online_sheet_links add column if not exists created_at timestamptz default now();
alter table public.online_sheet_links add column if not exists updated_at timestamptz default now();
update public.online_sheet_links set id = coalesce(id, md5(random()::text || clock_timestamp()::text)), title = coalesce(title, ''), category = coalesce(category, '其他'), url = coalesce(url, ''), sort_order = coalesce(sort_order, 0), created_at = coalesce(created_at, now()), updated_at = coalesce(updated_at, now());
alter table public.online_sheet_links alter column id set not null;
alter table public.online_sheet_links alter column title set not null;
alter table public.online_sheet_links alter column category set not null;
alter table public.online_sheet_links alter column url set not null;
alter table public.online_sheet_links alter column sort_order set not null;
alter table public.online_sheet_links alter column created_at set not null;
alter table public.online_sheet_links alter column updated_at set not null;
create unique index if not exists online_sheet_links_id_uidx on public.online_sheet_links (id);
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

notify pgrst, 'reload schema';
