export const LEVEL_ORDER = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'] as const;

export type CEFRLevel = typeof LEVEL_ORDER[number];

export const LEVEL_COLORS: Record<CEFRLevel, { bg: string; text: string; border: string }> = {
  A1: { bg: 'bg-slate-100', text: 'text-slate-700', border: 'border-slate-300' },
  A2: { bg: 'bg-cyan-50', text: 'text-cyan-700', border: 'border-cyan-200' },
  B1: { bg: 'bg-indigo-50', text: 'text-indigo-700', border: 'border-indigo-200' },
  B2: { bg: 'bg-orange-50', text: 'text-orange-700', border: 'border-orange-200' },
  C1: { bg: 'bg-purple-50', text: 'text-purple-700', border: 'border-purple-200' },
  C2: { bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200' },
};

export const LEVEL_BACKGROUNDS: Record<CEFRLevel, string> = {
  A1: '#94a3b8',
  A2: '#22d3ee',
  B1: '#818cf8',
  B2: '#fb923c',
  C1: '#c084fc',
  C2: '#34d399',
};

export function getLevelColor(level: string) {
  return LEVEL_COLORS[level as CEFRLevel] ?? { 
    bg: 'bg-slate-100', 
    text: 'text-slate-600', 
    border: 'border-slate-200' 
  };
}