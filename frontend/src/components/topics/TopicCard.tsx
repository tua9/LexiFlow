import { Brain, GraduationCap, Layers } from 'lucide-react';
import { getTopicColor } from '../../lib/theme';
import type { Topic } from '../../types';

interface TopicCardProps {
    topic: Topic;
    index?: number;
    onOpen: () => void;
    onStudy: () => void;
    onEdit?: () => void;
    onTest?: () => void;
}

/** Card hiển thị 1 topic trong danh sách chủ đề cá nhân. */
export function TopicCard({ topic, index = 0, onOpen, onStudy, onEdit, onTest }: TopicCardProps) {
    const c = getTopicColor(topic.color);
    return (
        <div
            className="anim-fade-up overflow-hidden rounded-2xl border border-border bg-surface shadow-soft transition hover:-translate-y-0.5 hover:shadow-card-hover"
            style={{ animationDelay: `${Math.min(index, 6) * 40}ms` }}
        >
            <div className={`relative h-1.5 ${c.bg}`} />
            <div className="p-5">
                <div className="mb-2 flex items-start justify-between gap-2">
                    <div>
                        <h3 className="font-display text-base font-bold leading-tight">{topic.name}</h3>
                        <div className="mt-1">
                            <span className={`inline-flex items-center gap-2 rounded-full px-2 py-0.5 text-xs font-semibold ${topic.is_public ? 'border border-success-200 bg-success-50 text-success-700' : 'border border-border bg-surface text-muted'}`}>
                                {topic.is_public ? 'Public' : 'Private'}
                            </span>
                        </div>
                    </div>
                    <span className={`grid h-8 w-8 shrink-0 place-items-center rounded-lg ${c.soft} ${c.text}`}>
                        <Layers size={16} />
                    </span>
                </div>

                <p className="mb-4 line-clamp-2 min-h-[2.5rem] text-xs leading-relaxed text-muted">
                    {topic.description || 'Chưa có mô tả.'}
                </p>

                <div className="flex items-center justify-between gap-2">
                    <span className="text-xs font-medium text-muted">
                        <span className={`font-display text-lg font-bold ${c.text}`}>
                            {topic.word_count}
                        </span>{' '}
                        từ
                    </span>
                    <div className="flex items-center gap-1">
                        <button
                            onClick={onOpen}
                            className="rounded-lg px-2.5 py-1.5 text-xs font-semibold text-muted transition hover:bg-ink/[0.06] hover:text-ink"
                        >
                            Chi tiết
                        </button>
                        {onEdit ? (
                            <button
                                onClick={onEdit}
                                className="rounded-lg px-2.5 py-1.5 text-xs font-semibold text-muted transition hover:bg-ink/[0.06] hover:text-ink"
                            >
                                Sửa
                            </button>
                        ) : null}
                        {onTest && (
                            <button
                                onClick={onTest}
                                disabled={topic.word_count === 0}
                                title="Kiểm tra"
                                className="flex items-center gap-1 rounded-lg border border-border px-3 py-1.5 text-xs font-semibold text-ink transition hover:border-brand-200 hover:bg-brand-50 hover:text-brand-600 disabled:cursor-not-allowed disabled:opacity-40"
                            >
                                <Brain size={13} /> Kiểm tra
                            </button>
                        )}
                        <button
                            onClick={onStudy}
                            disabled={topic.word_count === 0}
                            className="flex items-center gap-1 rounded-lg bg-ink px-3 py-1.5 text-xs font-semibold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
                        >
                            <GraduationCap size={13} /> Học
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
