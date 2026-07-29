import type { Level } from '../lib/supabase';
import { LEVEL_STYLES } from '../lib/theme';

export function LevelBadge({ level, size = 'sm' }: { level: Level; size?: 'sm' | 'md' }) {
    const s = LEVEL_STYLES[level];
    const dim = size === 'md' ? 'px-3 py-1 text-xs' : 'px-2 py-0.5 text-[10px]';
    return (
        <span className={`inline-flex items-center gap-1 rounded-full font-semibold ring-1 ${s.bg} ${s.text} ${s.ring} ${dim}`}>
            <span className={`h-1.5 w-1.5 rounded-full ${s.dot}`} />
            {level}
        </span>
    );
}
