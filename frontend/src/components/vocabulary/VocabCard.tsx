import { Plus } from 'lucide-react';
import { LevelBadge } from '../LevelBadge';
import type { Vocab } from '../../types';

interface VocabCardProps {
    vocab: Vocab;
    index?: number;
    onAdd: () => void;
}

/** Card hiển thị 1 từ vựng trong danh sách kết quả tìm kiếm. */
export function VocabCard({ vocab, index = 0, onAdd }: VocabCardProps) {
    return (
        <div
            className="group rounded-2xl border border-border bg-surface p-4 shadow-soft transition hover:-translate-y-0.5 hover:shadow-card-hover anim-fade-up"
            style={{ animationDelay: `${Math.min(index, 8) * 30}ms` }}
        >
            <div className="mb-2 flex items-start justify-between gap-2">
                <div>
                    <div className="flex items-center gap-2">
                        <h3 className="font-display text-base font-bold leading-tight">
                            {vocab.word}
                        </h3>
                        <LevelBadge level={vocab.level} />
                    </div>
                    {vocab.phonetic && (
                        <p className="mt-0.5 font-mono text-xs text-muted">{vocab.phonetic}</p>
                    )}
                </div>
                <button
                    type="button"
                    onClick={(e) => {
                        e.stopPropagation();
                        onAdd();
                    }}
                    className="grid h-8 w-8 place-items-center rounded-lg bg-brand-50 text-brand-600 transition hover:bg-brand-500 hover:text-white"
                    title="Thêm vào chủ đề"
                >
                    <Plus size={16} />
                </button>
            </div>

            <p className="mb-1 flex items-center gap-1.5 text-sm">
                {vocab.pos && (
                    <span className="rounded bg-ink/[0.05] px-1.5 py-0.5 text-[10px] font-semibold uppercase text-muted">
                        {vocab.pos}
                    </span>
                )}
                <span className="font-medium">{vocab.meaning}</span>
            </p>

            {vocab.example && (
                <p className="mt-2 border-l-2 border-brand-100 pl-2.5 text-xs italic leading-relaxed text-muted">
                    "{vocab.example}"
                </p>
            )}
        </div>
    );
}
