const budgets = ['$10K initial installation','$30K / 90-day private engagement','Exploring options'];
const headers = {'Content-Type':'application/json; charset=utf-8','Cache-Control':'no-store','X-Content-Type-Options':'nosniff'};
const reply = (status,message) => new Response(JSON.stringify({ok:status===200,message}),{status,headers});
export async function onRequestPost({request,env}) {
  const origin=request.headers.get('Origin');
  if(origin!==new URL(request.url).origin) return reply(403,'Invalid request origin.');
  if(!request.headers.get('content-type')?.includes('application/json')) return reply(415,'Invalid request format.');
  let data;
  try { const raw=await request.text(); if(raw.length>12000) return reply(413,'Inquiry is too long.'); data=JSON.parse(raw); } catch {return reply(400,'Invalid inquiry.');}
  if(!data || typeof data!=='object' || Array.isArray(data)) return reply(400,'Invalid inquiry.');
  if(data['bot-field']) return reply(400,'Invalid inquiry.');
  const fields={};
  for(const [key,max,required] of [['name',120,true],['email',254,true],['company',160,false],['goals',3000,true],['budget',100,true]]){
    if(typeof data[key]!=='string') return reply(400,'Please complete the inquiry fields.');
    fields[key]=data[key].trim(); if(fields[key].length>max || (required&&!fields[key])) return reply(400,'Please check the inquiry fields.');
  }
  if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(fields.email)||!budgets.includes(fields.budget)||data.consent!==true) return reply(400,'Please provide a valid email, budget and consent.');
  if(!/^https:\/\/script\.google\.com\/macros\/s\/[A-Za-z0-9_-]+\/exec$/.test(env.GOOGLE_SCRIPT_URL||'') || !env.SPRY_FORM_SECRET || env.SPRY_FORM_SECRET.length<32) return reply(503,'Inquiry service is not configured. Please try again later.');
  if(typeof data.id!=='string'||! /^[a-f0-9-]{36}$/i.test(data.id)) return reply(400,'Invalid inquiry reference.');
  try {
    const res=await fetch(env.GOOGLE_SCRIPT_URL,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({...fields,consent:true,id:data.id,secret:env.SPRY_FORM_SECRET}),redirect:'follow',signal:AbortSignal.timeout(20000)});
    if(!res.ok) throw Error('upstream status');
    const result=await res.json(); if(result.ok!==true||result.id!==data.id) throw Error('unconfirmed write');
    return reply(200,'Your inquiry has been received.');
  }catch {return reply(502,'We could not confirm receipt. Please retry; your entries have been preserved.');}
}
export function onRequest({request,env}) {return request.method==='POST'?onRequestPost({request,env}):reply(405,'Method not allowed.');}
