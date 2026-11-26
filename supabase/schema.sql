-- Optional future portal foundation. Not applied or verified against hosted Supabase.
-- Run only in a reviewed development project. Membership writes must use trusted backend/admin.
begin;
create table public.spry_clients (id uuid primary key default gen_random_uuid(), name text not null, created_at timestamptz not null default now());
create table public.spry_memberships (client_id uuid not null references public.spry_clients(id) on delete cascade, user_id uuid not null references auth.users(id) on delete cascade, primary key(client_id,user_id));
create table public.spry_systems (id uuid primary key default gen_random_uuid(), client_id uuid not null references public.spry_clients(id) on delete cascade, title text not null, status text not null check(status in ('planned','building','testing','installed','handed_over')), created_at timestamptz not null default now());
create table public.spry_guides (id uuid primary key default gen_random_uuid(), client_id uuid not null references public.spry_clients(id) on delete cascade, title text not null, body text not null, version integer not null default 1, approved boolean not null default false);
alter table public.spry_clients enable row level security;
alter table public.spry_memberships enable row level security;
alter table public.spry_systems enable row level security;
alter table public.spry_guides enable row level security;
revoke all on public.spry_clients, public.spry_memberships, public.spry_systems, public.spry_guides from anon, authenticated;
grant select on public.spry_clients, public.spry_memberships, public.spry_systems, public.spry_guides to authenticated;
create policy own_membership on public.spry_memberships for select to authenticated using(user_id=(select auth.uid()));
create policy member_client on public.spry_clients for select to authenticated using(exists(select 1 from public.spry_memberships m where m.client_id=spry_clients.id and m.user_id=(select auth.uid())));
create policy member_system on public.spry_systems for select to authenticated using(exists(select 1 from public.spry_memberships m where m.client_id=spry_systems.client_id and m.user_id=(select auth.uid())));
create policy member_approved_guide on public.spry_guides for select to authenticated using(approved and exists(select 1 from public.spry_memberships m where m.client_id=spry_guides.client_id and m.user_id=(select auth.uid())));
commit;
-- Before production: test anon denial, two independent tenants, revoked memberships, unapproved guides and privileged writes; review service role handling.
