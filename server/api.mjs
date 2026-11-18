export function validateRecords(value, seed) {
 if (!Array.isArray(value) || value.length > 5000) throw new Error('记录必须是数组，且不超过 5000 条');
 const ids=new Set();
 for (const row of value) {
  if (!row || typeof row !== 'object') throw new Error('记录格式错误');
  for (const [k,s] of Object.entries({id:'',title:'',authors:'',journal:'',year:0,doi:'',articleUrl:'',figureUrl:'',figureNumber:'',directions:[],types:[],tags:[],previewUrl:'',previewAlt:'',status:'',question:'',composition:'',learning:'',transfer:'',boundaries:'',notes:''})) if(Array.isArray(s)?!Array.isArray(row[k])||row[k].some(x=>typeof x!=='string'):typeof row[k]!==typeof s) throw new Error(`字段 ${k} 格式不正确`);
  if (!row.id || !row.title.trim() || ids.has(row.id) || !Number.isInteger(row.year) || row.year<1000 || row.year>9999) throw new Error('ID、标题或年份不正确');
  ids.add(row.id);
  for(const k of ['articleUrl','figureUrl','previewUrl']) if(row[k]&&!/^https?:\/\//i.test(row[k])&&!(k==='previewUrl'&&/^\/(?!\/)/.test(row[k])))throw new Error('链接格式不正确');
 }
 return value;
}
export async function api(request, store, identity, seed) {
 const url=new URL(request.url);const json=(body,status=200)=>Response.json(body,{status,headers:{'Cache-Control':'no-store','X-Content-Type-Options':'nosniff'}});
 if(url.pathname==='/api/session')return json(identity);
 if(url.pathname!=='/api/figures')return json({error:'接口不存在'},404);
 if(request.method==='GET')return json(await store.get());
 if(request.method!=='PUT')return json({error:'不支持的操作'},405);
 if(!identity.canEdit)return json({error:'只有获授权的账号可以修改记录'},403);
 if(request.headers.get('origin')!==url.origin)return json({error:'请求来源不匹配'},403);
 if(!request.headers.get('content-type')?.includes('application/json'))return json({error:'需要 JSON 请求'},415);
 const raw=await request.text();if(raw.length>2_000_000)return json({error:'记录总量超过 2 MB，请缩短内容或使用图片外链'},413);
 try {
  const body=JSON.parse(raw);validateRecords(body.records,seed);
  if(typeof body.version!=='string')return json({error:'缺少版本号'},400);
  const version=crypto.randomUUID();const ok=await store.save(body.records,body.version,version);
  return ok?json({records:body.records,version}):json({error:'记录已在其他窗口更新。请先导出当前内容备份，再刷新页面后重试。'},409);
 }catch(e){return json({error:e.message||'无法保存'},400);}
}

