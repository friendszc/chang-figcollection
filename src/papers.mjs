export function normalizeDoi(value) {
 return value.trim().replace(/^https?:\/\/(?:dx\.)?doi\.org\//i,'').replace(/^doi\s*:\s*/i,'').trim().toLowerCase();
}
export function normalizeTitle(value) {
 return value.normalize('NFKC').toLowerCase().replace(/[\p{P}\p{Z}\s]+/gu,'');
}
export function samePaper(a,b) {
 const da=normalizeDoi(a.doi),db=normalizeDoi(b.doi);
 if(da&&db)return da===db;
 const ta=normalizeTitle(a.title),tb=normalizeTitle(b.title);
 return !!ta&&ta===tb;
}
