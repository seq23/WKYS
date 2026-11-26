// Same-origin gateway. Supabase RLS is the authorization boundary; no privileged key.
const json=(data,status=200)=>new Response(JSON.stringify(data),{status,headers:{'Content-Type':'application/json; charset=utf-8','Cache-Control':'no-store','X-Content-Type-Options':'nosniff'}});
const uuid=/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
export async function onRequest({request,env,params}) {
  const path=Array.isArray(params.path)?params.path.join('/'):params.path;
  const method=request.method;
  if(!['GET','POST'].includes(method))return json({error:'Method not allowed'},405);
  if(method==='POST' && request.headers.get('Origin')!==new URL(request.url).origin)return json({error:'Invalid origin'},403);
  const base=env.SPRY_SUPABASE_URL?.replace(/\/$/,''); const key=env.SPRY_SUPABASE_PUBLISHABLE_KEY;
  if(!/^https:\/\/[a-z0-9-]+\.supabase\.co$/.test(base||'')||!key?.startsWith('sb_publishable_'))return json({error:'Portal setup is incomplete. Contact your SPRY concierge.'},503);
  const token=request.headers.get('Authorization');
  const headers={apikey:key,'Content-Type':'application/json'};
  if(token && /^Bearer [A-Za-z0-9._-]+$/.test(token))headers.Authorization=token;
  async function upstream(route,opts={}) {
    const res=await fetch(base+route,{...opts,headers:{...headers,...opts.headers},redirect:'error',signal:AbortSignal.timeout(12000)});
    const raw=await res.text(); let data; try{data=JSON.parse(raw)}catch{data=null}
    return {res,data};
  }
  async function body(){const raw=await request.text(); if(raw.length>60000)throw new Error('invalid body'); const b=JSON.parse(raw);if(!b||typeof b!=='object'||Array.isArray(b))throw new Error('invalid body');return b;}
  try {
    if(path==='login'&&method==='POST'){
      const {email,password}=await body();
      if(typeof email!=='string'||email.length>254||!email.includes('@')||typeof password!=='string'||!password||password.length>256)return json({error:'Enter your email and password.'},400);
      const {res,data}=await upstream('/auth/v1/token?grant_type=password',{method:'POST',body:JSON.stringify({email:email.trim(),password})});
      if(!res.ok||!data?.access_token)return json({error:res.status===429?'Too many attempts. Try again later.':'Sign-in failed. Check your credentials or contact SPRY.'},res.status===429?429:401);
      return json({access_token:data.access_token,expires_in:data.expires_in});
    }
    if(!headers.Authorization)return json({error:'Sign in required.'},401);
    const user=await upstream('/auth/v1/user');
    if(!user.res.ok||!user.data?.id)return json({error:'Session expired. Sign in again.'},401);
    if(path==='logout'&&method==='POST'){
      const out=await upstream('/auth/v1/logout?scope=local',{method:'POST'});return out.res.ok?json({ok:true}):json({error:'Session cleared locally; server logout failed.'},502);
    }
    async function rows(table,query){const result=await upstream('/rest/v1/'+table+'?'+new URLSearchParams(query));if(!result.res.ok||!Array.isArray(result.data))throw new Error('data unavailable');return result.data;}
    if(path.startsWith('admin/')){
      const roles=await rows('spry_founders',{select:'user_id',user_id:'eq.'+user.data.id});
      if(!roles.length)return json({error:'Founder access required.'},403);
      if(path==='admin/clients'&&method==='GET')return json({clients:await rows('spry_clients',{select:'*',order:'name.asc'})});
      if(path==='admin/workspace'&&method==='GET'){
        const id=new URL(request.url).searchParams.get('client');if(!uuid.test(id||''))return json({error:'Invalid workspace.'},400);
        const clients=await rows('spry_clients',{select:'*',id:'eq.'+id});if(!clients.length)return json({error:'Workspace not found.'},404);
        const filter={client_id:'eq.'+id,select:'*',limit:'1000'};
        const [milestones,systems,guides,requests]=await Promise.all(['spry_portal_milestones','spry_systems','spry_guides','spry_portal_requests'].map(t=>rows(t,filter)));
        return json({client:clients[0],milestones,systems,guides,requests});
      }
      if(path==='admin/save'&&method==='POST'){
        const b=await body(); if(!['client','milestone','system','guide','request'].includes(b.type))return json({error:'Invalid record type.'},400); const spec={client:['spry_clients',['name','objectives','scope','phase','next_step','start_date','end_date','progress_override']],milestone:['spry_portal_milestones',['title','description','kind','status','start_date','due_date','weight','percent_complete','archived']],system:['spry_systems',['title','description','status','resource_url']],guide:['spry_guides',['title','body','version','approved']],request:['spry_portal_requests',['status','founder_response']]}[b.type];
        if(!spec||!b.values||typeof b.values!=='object'||Array.isArray(b.values)|| (b.id&&!uuid.test(b.id)) || (b.type!=='client'&&!uuid.test(b.client_id||'')) || (b.type==='request'&&!b.id))return json({error:'Invalid edit.'},400);
        const values={};for(const k of spec[1])if(Object.hasOwn(b.values,k))values[k]=b.values[k];
        if(!Object.keys(values).length)return json({error:'No changes supplied.'},400);
        if(Object.values(values).some(v=>typeof v==='string'&&v.length>10000))return json({error:'Text is too long.'},400);
        if(b.type!=='client'&&!b.id)values.client_id=b.client_id;
        const query=new URLSearchParams({select:'id',...(b.id?{id:'eq.'+b.id,...(b.type!=='client'?{client_id:'eq.'+b.client_id}:{})}:{})});
        const out=await upstream('/rest/v1/'+spec[0]+'?'+query,{method:b.id?'PATCH':'POST',headers:{Prefer:'return=representation'},body:JSON.stringify(values)});
        if(!out.res.ok)return json({error:'Save rejected. Check dates, required fields and permissions.'},out.res.status===403?403:400);
        if(!Array.isArray(out.data)||out.data.length!==1)return json({error:'No matching record saved.'},404);
        return json({id:out.data[0].id});
      }
      return json({error:'Not found'},404);
    }
    if(path==='clients'&&method==='GET')return json({clients:await rows('spry_clients',{select:'id,name,created_at',order:'name.asc'})});
    if(path==='dashboard'&&method==='GET'){
      const id=new URL(request.url).searchParams.get('client');if(!uuid.test(id||''))return json({error:'Invalid client.'},400);
      const clients=await rows('spry_clients',{select:'id,name,created_at,start_date,end_date,objectives,scope,phase,next_step,progress_override',id:'eq.'+id});if(!clients.length)return json({error:'Workspace unavailable.'},404);
      const filter={client_id:'eq.'+id,limit:'1000'};
      const [systems,guides,milestones,requests]=await Promise.all([
        rows('spry_systems',{...filter,select:'id,title,status,description,resource_url',order:'created_at.asc'}),
        rows('spry_guides',{...filter,select:'id,title,body,version',approved:'eq.true',order:'title.asc'}),
        rows('spry_portal_milestones',{...filter,archived:'eq.false',select:'id,title,description,status,due_date,kind,start_date,weight,percent_complete,archived',order:'due_date.asc.nullslast,title.asc'}),
        rows('spry_portal_requests',{...filter,select:'id,subject,message,status,created_at,founder_response',order:'created_at.desc'})]);
      return json({client:clients[0],systems,guides,milestones,requests});
    }
    if(path==='requests'&&method==='POST'){
      const b=await body();const {client_id,subject,message}=b;
      if(!uuid.test(client_id||'')||typeof subject!=='string'||typeof message!=='string'||!subject.trim()||subject.trim().length>120||!message.trim()||message.trim().length>3000)return json({error:'Enter a subject (120 characters) and message (3,000 characters).'},400);
      const result=await upstream('/rest/v1/spry_portal_requests',{method:'POST',headers:{Prefer:'return=minimal'},body:JSON.stringify({client_id,user_id:user.data.id,subject:subject.trim(),message:message.trim()})});
      if(!result.res.ok)return json({error:'Request could not be saved. Verify workspace access or contact concierge.'},result.res.status===403?403:502);
      return json({ok:true},201);
    }
    return json({error:'Not found'},404);
  }catch(e){return json({error:'Unable to complete the request. Please retry or contact your concierge.'},502);}
}
