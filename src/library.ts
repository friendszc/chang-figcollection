import { useEffect, useState } from 'react';
import type { Figure } from './editor';
export function useLibrary(){
 const [records,setRecords]=useState<Figure[]>([]);const [version,setVersion]=useState('');
 const [session,setSession]=useState({canEdit:false,signedIn:false,mode:'cloud'});const [message,setMessage]=useState('正在加载图形记录…');const [busy,setBusy]=useState(false);
 useEffect(()=>{let active=true;
 if(import.meta.env.MODE==='pages'){
  setSession({canEdit:false,signedIn:false,mode:'pages'});
  fetch(import.meta.env.BASE_URL+'figures.json',{cache:'no-store'}).then(async r=>{if(!r.ok)throw new Error('数据加载失败');return r.json();}).then(records=>{if(active){setRecords(records);setMessage('');}}).catch(()=>{if(active)setMessage('图形记录加载失败，请刷新重试。');});
  return()=>{active=false;};
 }
 Promise.all([fetch('/api/figures',{cache:'no-store'}).then(async r=>{if(!r.ok)throw new Error('无法读取记录');return r.json();}),fetch('/api/session',{cache:'no-store'}).then(async r=>{if(!r.ok)throw new Error('无法读取权限');return r.json();})]).then(([data,user])=>{if(active){setRecords(data.records);setVersion(data.version);setSession(user);setMessage('');}}).catch(()=>{if(active)setMessage('加载失败，请刷新重试；本地请使用 start.cmd 启动。');});return()=>{active=false;};},[]);
 async function save(next:Figure[]){if(import.meta.env.MODE==='pages')throw new Error('在线浏览版请在本机维护后发布');if(busy)throw new Error('正在保存，请稍后');setBusy(true);try{const r=await fetch('/api/figures',{method:'PUT',headers:{'Content-Type':'application/json'},body:JSON.stringify({records:next,version})});const data=await r.json();if(!r.ok)throw new Error(data.error||'保存失败');setRecords(data.records);setVersion(data.version);setMessage('已保存'+(session.mode==='cloud'?'到云端':'到本地 JSON'));}finally{setBusy(false);}}
 return {records,session,message,busy,save,setMessage};
}
