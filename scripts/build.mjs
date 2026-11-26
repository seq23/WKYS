import {mkdir,cp,rm} from 'node:fs/promises';
await rm('public',{recursive:true,force:true});await mkdir('public');
for(const file of ['index.html','discover.html','portal.html','thanks.html','privacy.html','404.html','robots.txt','sitemap.xml','_headers','_redirects','_routes.json','assets'])await cp(file,`public/${file}`,{recursive:true});
console.log('SPRY public site built. Internal docs and SQL excluded.');

await cp('client.html','public/client.html');

await cp('founder.html','public/founder.html');
