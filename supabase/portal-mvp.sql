-- Apply existing supabase/schema.sql FIRST if its four tables do not exist.
-- Apply once in a dedicated staging project before production. No destructive changes.
begin;
alter table public.spry_clients add column if not exists start_date date, add column if not exists end_date date;
alter table public.spry_systems add column if not exists description text not null default '', add column if not exists resource_url text;
create table public.spry_portal_milestones (
 id uuid primary key default gen_random_uuid(), client_id uuid not null references public.spry_clients(id) on delete cascade,
 title text not null, description text not null default '', kind text not null check(kind in ('project','training','graduation','roadmap')),
 status text not null default 'planned' check(status in ('planned','in_progress','complete')), due_date date);
create table public.spry_portal_requests (
 id uuid primary key default gen_random_uuid(), client_id uuid not null references public.spry_clients(id) on delete cascade,
 user_id uuid not null references auth.users(id) on delete cascade, subject text not null check(char_length(btrim(subject)) between 1 and 120),
 message text not null check(char_length(btrim(message)) between 1 and 3000), status text not null default 'open' check(status in ('open','in_progress','resolved')),
 created_at timestamptz not null default now());
create index spry_portal_milestones_client_idx on public.spry_portal_milestones(client_id);
create index spry_portal_requests_client_idx on public.spry_portal_requests(client_id,user_id);
create index if not exists spry_memberships_user_idx on public.spry_memberships(user_id);
alter table public.spry_portal_milestones enable row level security;
alter table public.spry_portal_requests enable row level security;
revoke all on public.spry_portal_milestones,public.spry_portal_requests from public,anon,authenticated;
grant select on public.spry_portal_milestones,public.spry_portal_requests to authenticated;
grant insert(client_id,user_id,subject,message) on public.spry_portal_requests to authenticated;
create policy portal_milestones_read on public.spry_portal_milestones for select to authenticated using(exists(select 1 from public.spry_memberships m where m.client_id=spry_portal_milestones.client_id and m.user_id=(select auth.uid())));
create policy portal_requests_read on public.spry_portal_requests for select to authenticated using(user_id=(select auth.uid()) and exists(select 1 from public.spry_memberships m where m.client_id=spry_portal_requests.client_id and m.user_id=(select auth.uid())));
create policy portal_requests_insert on public.spry_portal_requests for insert to authenticated with check(user_id=(select auth.uid()) and status='open' and exists(select 1 from public.spry_memberships m where m.client_id=spry_portal_requests.client_id and m.user_id=(select auth.uid())));
commit;
