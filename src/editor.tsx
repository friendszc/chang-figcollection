import { useState } from 'react';

export interface Figure {
 id: string; title: string; authors: string; journal: string; year: number; doi: string;
 articleUrl: string; figureUrl: string; figureNumber: string; directions: string[]; types: string[]; tags: string[];
 previewUrl: string; previewAlt: string; status: string; question: string; composition: string;
 figureTitle?: string; captionEn?: string; captionExcerpt?: string; thumbnailUrl?: string;
 learning: string; transfer: string; boundaries: string; notes: string;
}

export function validate(value: unknown): Figure[] {
 if (!Array.isArray(value)) throw new Error('文件内容必须是记录数组');
 const ids = new Set<string>();
 for (const row of value) {
  if (!row || typeof row !== 'object') throw new Error('记录格式不正确');
  for (const [key, sample] of Object.entries(newFigure())) {
   const v = row[key];
   if (Array.isArray(sample) ? !Array.isArray(v) || v.some((x: unknown)=>typeof x !== 'string') : typeof v !== typeof sample) throw new Error(`字段 ${key} 格式不正确`);
  }
  if (!row.id || !row.title.trim() || ids.has(row.id)) throw new Error('记录 ID 必须唯一，标题不能为空');
  if (!Number.isInteger(row.year) || row.year < 1000 || row.year > 9999) throw new Error('年份应为四位整数');
  if (row.directions.some((x:string)=>!['农业','interface'].includes(x)) || row.types.some((x:string)=>!['地图','时间序列','柱状图','流程图','复合图','其他'].includes(x))) throw new Error('研究方向或图形类型不正确');
  for (const k of ['articleUrl','figureUrl','previewUrl']) if(row[k] && !/^https?:\/\//i.test(row[k]) && !(k==='previewUrl' && /^\/(?!\/)/.test(row[k]))) throw new Error('链接应以 https:// 或 http:// 开头，图片也可使用 /images/ 路径');
  for (const k of ['figureTitle','captionEn','captionExcerpt','thumbnailUrl']) if(row[k] !== undefined && typeof row[k] !== 'string') throw new Error(`字段 ${k} 格式不正确`);
  if(row.thumbnailUrl && !/^https?:\/\//i.test(row.thumbnailUrl) && !/^\/(?!\/)/.test(row.thumbnailUrl)) throw new Error('缩略图链接格式不正确');
  ids.add(row.id);
 }
 return value;
}
export function downloadRecords(records: unknown, name = 'figure-notes.json') {
 const url=URL.createObjectURL(new Blob([JSON.stringify(records,null,2)],{type:'application/json'}));
 const a=document.createElement('a');a.href=url;a.download=name;a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);
}
export function newFigure(): Figure {return {id:crypto.randomUUID(),title:'',authors:'',journal:'',year:new Date().getFullYear(),doi:'',articleUrl:'',figureUrl:'',figureNumber:'待补充',directions:['农业'],types:[],tags:[],previewUrl:'',previewAlt:'整幅 Figure 预览',status:'待精读',question:'',composition:'',learning:'',transfer:'',boundaries:'',notes:''};}
const fields: [keyof Figure,string][]=[['title','论文完整题目'],['authors','作者'],['journal','期刊'],['year','年份'],['doi','DOI'],['articleUrl','原文链接'],['figureUrl','官方 Figure 页面链接'],['figureNumber','Figure 编号（整幅图）'],['previewUrl','预览图片链接（可留空）'],['previewAlt','图片说明'],['question','这张图回答的问题'],['composition','图形组成与阅读顺序'],['learning','值得学习的图形表达'],['transfer','迁移到我的研究'],['boundaries','方法与结论边界'],['notes','备注'],['figureTitle','Figure 英文短标题（完整）'],['captionEn','Figure caption（英文原文，由您提供）'],['thumbnailUrl','缩略图链接（可选；高清图仍使用预览图片链接）']];
export function Editor({initial,isExisting,onSave,onCancel}:{initial:Figure,isExisting:boolean,onSave:(r:Figure)=>Promise<void>,onCancel:()=>void}){
 const [draft,setDraft]=useState(initial); const [tags,setTags]=useState(initial.tags.join('，'));const [error,setError]=useState('');const [dirty,setDirty]=useState(false); const [saving,setSaving]=useState(false);
 const update=(key:keyof Figure,value:unknown)=>{setDraft(p=>({...p,[key]:value}));setDirty(true);};
 const cancel=()=>{if(!dirty||window.confirm('放弃尚未保存的修改？'))onCancel();};
 return <form className="editor" onSubmit={async e=>{e.preventDefault();setSaving(true);try{const r={...draft,tags:Array.from(new Set(tags.split(/[,，]/).map(t=>t.trim()).filter(Boolean))),title:draft.title.trim()};validate([r]);await onSave(r);}catch(e){setError((e as Error).message);}finally{setSaving(false);}}}>
 <h2>{isExisting?'编辑图形笔记':'新增整幅 Figure'}</h2><p>每条记录保留一整幅图。面板解读请填写在“图形组成与阅读顺序”。</p>
 <div className="editor-grid">{fields.map(([key,label],i)=><label className={i===0||i>=10?'wide':''} key={key}>{label}{i>=10?<textarea value={String(draft[key] ?? '')} onChange={e=>update(key,e.target.value)} rows={3}/>:<input required={key==='title'||key==='figureNumber'||key==='year'} type={key==='year'?'number':'text'} min={key==='year'?1000:undefined} max={key==='year'?9999:undefined} value={String(draft[key])} onChange={e=>update(key,key==='year'?Number(e.target.value):e.target.value)}/>}</label>)}
 <fieldset className="wide"><legend>研究方向（同时勾选即为交叉）</legend>{['农业','interface'].map(x=><label className="check" key={x}><input type="checkbox" checked={draft.directions.includes(x)} onChange={e=>update('directions',e.target.checked?[...draft.directions,x]:draft.directions.filter(y=>y!==x))}/>{x}</label>)}</fieldset>
 <fieldset className="wide"><legend>图形类型（可多选）</legend>{['地图','时间序列','柱状图','流程图','复合图','其他'].map(x=><label className="check" key={x}><input type="checkbox" checked={draft.types.includes(x)} onChange={e=>update('types',e.target.checked?[...draft.types,x]:draft.types.filter(y=>y!==x))}/>{x}</label>)}</fieldset>
 <label className="wide">自定义标签（用逗号分隔）<input value={tags} onChange={e=>{setTags(e.target.value);setDirty(true);}}/></label><label>阅读状态<select value={draft.status} onChange={e=>update('status',e.target.value)}>{Array.from(new Set(['待精读','已记笔记','已复盘',initial.status])).map(s=><option key={s}>{s}</option>)}</select></label></div>
 {error&&<p role="alert">{error}</p>}<div className="editor-actions"><button type="button" onClick={cancel}>取消</button><button disabled={saving} className="primary" type="submit">{saving?'保存中…':'保存记录'}</button></div></form>;
}
