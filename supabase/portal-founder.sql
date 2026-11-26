-- Apply after schema.sql and portal-mvp.sql; run in staging first.
begin;
create table public.spry_founders(user_id uuid primary key references auth.users(id) on delete cascade);
alter table public.spry_founders enable row level security;
revoke all on public.spry_founders from public,anon,authenticated;
grant select on public.spry_founders to authenticated;
create policy founder_self on public.spry_founders for select to authenticated using(user_id=(select auth.uid()));
alter table public.spry_clients add column objectives text not null default '', add column scope text not null default '', add column phase text not null default 'Discovery', add column next_step text not null default '', add column progress_override integer check(progress_override between 0 and 100), add constraint spry_dates_order check(start_date is null or end_date is null or start_date<=end_date);
alter table public.spry_portal_milestones add column start_date date, add column weight integer not null default 1 check(weight between 1 and 100), add column percent_complete integer check(percent_complete between 0 and 100), add column archived boolean not null default false, add constraint spry_milestone_dates check(start_date is null or due_date is null or start_date<=due_date);
alter table public.spry_portal_requests add column founder_response text not null default '';
-- Founder membership is explicitly granted by trusted SQL operator, never by clients.
-- Founder policies use the self-visible role table, with no recursive RLS or privileged API keys.
do $$ declare t text; begin
 foreach t in array array['spry_clients','spry_systems','spry_guides','spry_portal_milestones','spry_portal_requests','spry_memberships'] loop
 execute format('create policy founder_read on public.%I for select to authenticated using (exists(select 1 from public.spry_founders f where f.user_id=(select auth.uid())))',t);
 end loop;
 foreach t in array array['spry_clients','spry_systems','spry_guides','spry_portal_milestones'] loop
 execute format('grant insert,update on public.%I to authenticated',t);
 execute format('create policy founder_insert on public.%I for insert to authenticated with check (exists(select 1 from public.spry_founders f where f.user_id=(select auth.uid())))',t);
 execute format('create policy founder_update on public.%I for update to authenticated using (exists(select 1 from public.spry_founders f where f.user_id=(select auth.uid()))) with check (exists(select 1 from public.spry_founders f where f.user_id=(select auth.uid())))',t);
 end loop;
end $$;
-- Customers retain insert-only support request capability. Founder may update status and published response.
grant update(status,founder_response) on public.spry_portal_requests to authenticated;
create policy founder_request_update on public.spry_portal_requests for update to authenticated using(exists(select 1 from public.spry_founders f where f.user_id=(select auth.uid()))) with check(exists(select 1 from public.spry_founders f where f.user_id=(select auth.uid())));
-- Hide archived milestones from ordinary clients even on direct REST calls.
drop policy portal_milestones_read on public.spry_portal_milestones;
create policy portal_milestones_read on public.spry_portal_milestones for select to authenticated using(not archived and exists(select 1 from public.spry_memberships m where m.client_id=spry_portal_milestones.client_id and m.user_id=(select auth.uid())));
-- Role table cannot be modified through Data API. Membership assignment remains trusted SQL only.
commit;
