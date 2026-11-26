// Completion measures approved work, never elapsed calendar time. Roadmap items are future scope.
export function journeyProgress(client,milestones){
 if(Number.isInteger(client.progress_override)&&client.progress_override>=0&&client.progress_override<=100)return {percent:client.progress_override,mode:'Manual'};
 const items=milestones.filter(m=>!m.archived&&m.kind!=='roadmap');
 let total=0,earned=0;
 for(const m of items){const w=m.weight||1;const p=m.status==='complete'?100:m.status==='planned'?0:(m.percent_complete??0);total+=w;earned+=w*p;}
 return {percent:total?Math.round(earned/total):0,mode:'Milestone-based'};
}
