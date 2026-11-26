import {readFile,writeFile} from 'node:fs/promises';
const file='scripts/build.mjs';let build=await readFile(file,'utf8');
if(!build.includes("cp('client.html','public/client.html')")){
 if(!build.includes("public")||!build.includes("assets"))throw Error('Unexpected build script; add client.html manually.');
 build+="\nawait cp('client.html','public/client.html');\n";await writeFile(file,build);
}
console.log('Portal included in the existing public build. Existing demo, homepage and inquiry route preserved.');
const preview='portal.html';let html=await readFile(preview,'utf8');
if(!html.includes('href="/client.html"')){
 if(!html.includes('</main>'))throw Error('Unexpected portal preview; add login link manually.');
 html=html.replace('</main>','<p><a class="button" href="/client.html">Existing client? Sign in</a></p></main>');await writeFile(preview,html);
}

if(!build.includes("cp('founder.html','public/founder.html')")){build+="\nawait cp('founder.html','public/founder.html');\n";await writeFile(file,build);}
