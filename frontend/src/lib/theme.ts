import type { Level } from './supabase';

export const LEVEL_STYLES: Record<Level, { bg: string; text: string; ring: string; dot: string }> = {
    A1: { bg: 'bg-emerald-50', text: 'text-emerald-700', ring: 'ring-emerald-200', dot: 'bg-emerald-500' },
    A2: { bg: 'bg-teal-50', text: 'text-teal-700', ring: 'ring-teal-200', dot: 'bg-teal-500' },
    B1: { bg: 'bg-sky-50', text: 'text-sky-700', ring: 'ring-sky-200', dot: 'bg-sky-500' },
    B2: { bg: 'bg-blue-50', text: 'text-blue-700', ring: 'ring-blue-200', dot: 'bg-blue-500' },
    C1: { bg: 'bg-indigo-50', text: 'text-indigo-700', ring: 'ring-indigo-200', dot: 'bg-indigo-500' },
    C2: { bg: 'bg-violet-50', text: 'text-violet-700', ring: 'ring-violet-200', dot: 'bg-violet-500' },
};

export const TOPIC_COLORS = [
    { key: 'blue', bg: 'bg-blue-500', soft: 'bg-blue-50', text: 'text-blue-600', ring: 'ring-blue-200' },
    { key: 'emerald', bg: 'bg-emerald-500', soft: 'bg-emerald-50', text: 'text-emerald-600', ring: 'ring-emerald-200' },
    { key: 'amber', bg: 'bg-amber-500', soft: 'bg-amber-50', text: 'text-amber-600', ring: 'ring-amber-200' },
    { key: 'rose', bg: 'bg-rose-500', soft: 'bg-rose-50', text: 'text-rose-600', ring: 'ring-rose-200' },
    { key: 'violet', bg: 'bg-violet-500', soft: 'bg-violet-50', text: 'text-violet-600', ring: 'ring-violet-200' },
    { key: 'cyan', bg: 'bg-cyan-500', soft: 'bg-cyan-50', text: 'text-cyan-600', ring: 'ring-cyan-200' },
];

export function getTopicColor(key: string) {
    return TOPIC_COLORS.find((c) => c.key === key) ?? TOPIC_COLORS[0];
}

export function shuffle<T>(arr: T[]): T[] {
    const a = [...arr];
    for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
}
