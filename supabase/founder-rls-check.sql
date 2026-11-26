-- Staging ONLY. Replace the two UUID placeholders with existing distinct non-founder auth users.
-- Run as database owner. Rolls back all fixtures. A raised exception is a failed gate.
begin;
insert into public.spry_clients(id,name) values ('f0000000-0000-4000-8000-000000000001','RLS fixture A'),('f0000000-0000-4000-8000-000000000002','RLS fixture B');
insert into public.spry_memberships(client_id,user_id) values ('f0000000-0000-4000-8000-000000000001','REPLACE-CLIENT-A-AUTH-UUID'),('f0000000-0000-4000-8000-000000000002','REPLACE-CLIENT-B-AUTH-UUID');
insert into public.spry_portal_milestones(client_id,title,kind,archived) values ('f0000000-0000-4000-8000-000000000001','Visible milestone','project',false),('f0000000-0000-4000-8000-000000000001','Archived milestone','project',true),('f0000000-0000-4000-8000-000000000002','Other client milestone','project',false);
set local role authenticated;
select set_config('request.jwt.claim.sub','REPLACE-CLIENT-A-AUTH-UUID',true);
do $$ declare n integer; begin
 if exists(select 1 from public.spry_founders) then raise exception 'Test user is a founder'; end if;
 select count(*) into n from public.spry_clients where id in ('f0000000-0000-4000-8000-000000000001','f0000000-0000-4000-8000-000000000002');
 if n<>1 then raise exception 'Tenant visibility failed'; end if;
 select count(*) into n from public.spry_portal_milestones where client_id in ('f0000000-0000-4000-8000-000000000001','f0000000-0000-4000-8000-000000000002');
 if n<>1 then raise exception 'Milestone isolation or archive failed'; end if;
 update public.spry_clients set progress_override=100 where id='f0000000-0000-4000-8000-000000000001';
 get diagnostics n=row_count; if n<>0 then raise exception 'Client can edit progress'; end if;
 begin insert into public.spry_founders(user_id) values ((select auth.uid())); raise exception 'Client can elevate role'; exception when insufficient_privilege then null; end;
end $$;
reset role;
rollback;
