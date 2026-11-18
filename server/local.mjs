import { readFile, writeFile, rename } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { api } from './api.mjs';
export function localApi(){return {name:'figure-local-api',configureServer(server){
 let pending=Promise.resolve();
 const filename=new URL('../src/figures.json',import.meta.url);
 const read=async()=>{const raw=await readFile(filename,'utf8');return {records:JSON.parse(raw.replace(/^\uFEFF/,'')),version:createHash('sha256').update(raw).digest('hex')};};
 const store={get:read,save(records,previous){const operation=pending.then(async()=>{if((await read()).version!==previous)return false;const temp=new URL('../src/figures.json.tmp',import.meta.url);await writeFile(temp,JSON.stringify(records,null,2)+'\n');await rename(temp,filename);return true;});pending=operation.catch(()=>{});return operation;}};
 server.middlewares.use(async(req,res,next)=>{
  if(!req.url?.startsWith('/api/'))return next();
  try{
   if(!['127.0.0.1','::1','::ffff:127.0.0.1'].includes(req.socket.remoteAddress)){res.writeHead(403);return res.end();}
   const host=req.headers.host;if(!/^127\.0\.0\.1:\d+$/.test(host||'')){res.writeHead(403);return res.end();}
   let body='';for await(const chunk of req){body+=chunk;if(body.length>2_000_000){res.writeHead(413);return res.end();}}
   const request=new Request('http://'+host+req.url,{method:req.method,headers:req.headers,...(!['GET','HEAD'].includes(req.method)?{body}:{})});
   const response=await api(request,store,{canEdit:true,signedIn:false,mode:'local'},(await read()).records);
   let result=await response.text();if(req.method==='PUT'&&response.ok)result=JSON.stringify(await read());
   res.writeHead(response.status,Object.fromEntries(response.headers));res.end(result);
  }catch{res.writeHead(500,{'Content-Type':'application/json'});res.end(JSON.stringify({error:'本地数据读写失败，请检查 JSON 文件'}));}
 });
}};}
