// Same metric year for all papers, irrespective of publication year.
// Official journal metrics checked 2026-11-18. Update here when adding journals.
export const journalMetrics = {
  'nature': { impactFactor: 56.1, year: 2025, source: 'https://www.nature.com/nature/journal-impact' },
  'nature sustainability': { impactFactor: 32.1, year: 2025, source: 'https://www.nature.com/natsustain/journal-impact' },
  'nature food': { impactFactor: 24.7, year: 2025, source: 'https://www.nature.com/natfood/journal-impact' },
  'nature communications': { impactFactor: 18.1, year: 2025, source: 'https://www.nature.com/ncomms/' },
};
const collator = new Intl.Collator('en', { sensitivity: 'base', numeric: true });
const journalKey = value => value.trim().replace(/\s+/g, ' ').toLowerCase();
const factor = record => journalMetrics[journalKey(record.journal)]?.impactFactor ?? -1;
export function compareFigures(a, b) {
  return b.year - a.year
    || factor(b) - factor(a)
    || collator.compare(a.title.trim(), b.title.trim())
    || collator.compare(a.figureNumber, b.figureNumber)
    || collator.compare(a.id, b.id);
}
