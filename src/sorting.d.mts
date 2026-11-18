import type { Figure } from './editor';
export const journalMetrics: Record<string, {impactFactor: number; year: number; source: string}>;
export function compareFigures(a: Figure, b: Figure): number;
