import { useEffect, useState } from 'react';
import { ChevronLeft, ChevronRight, RotateCw, Check, X, GraduationCap, Sparkles } from 'lucide-react';
import { useTopics } from '../hooks/useTopics';
import { useStudySession } from '../hooks/useStudySession';
import { vocabularyApi } from '../api';
import { useViewStore } from '../store/useViewStore';
import { getTopicColor } from '../lib/theme';
import { LevelBadge } from '../components/LevelBadge';
import { EmptyState } from '../components/ui/EmptyState';
import type { Level, Vocab } from '../types';

interface StudyViewProps {
    onPickTopic: () => void;
}

export function StudyView({ onPickTopic }: StudyViewProps) {
    const { topics, loading: loadingTopics } = useTopics();
    const studyTopicId = useViewStore((state) => state.studyTopicId);
    const setStudyTopicId = useViewStore((state) => state.setStudyTopicId);
    const [loadingWords, setLoadingWords] = useState(false);

    const session = useStudySession([]);

    // Load words khi topic thay đổi
    useEffect(() => {
        let active = true;

        if (!studyTopicId) {
            session.reset([]);
            return;
        }

        setLoadingWords(true);

        const activeTopic = topics.find((t) => t.id === studyTopicId);
        if (!activeTopic) {
            setLoadingWords(false);
            return;
        }

        vocabularyApi.getByTopic(activeTopic.id)
            .then((topicWords) => {
                if (!active) return;
                session.reset(topicWords);
            })
            .catch((error) => {
                console.error('[StudyView] fetchTopicVocabularies failed:', error);
                if (active) session.reset([]);
            })
            .finally(() => {
                if (active) setLoadingWords(false);
            });

        return () => {
            active = false;
        };
    }, [studyTopicId, topics, session.reset]);

    const { current, index, flipped, flip, next, prev, mark, shuffleCards, progress, total } = session;

    if (loadingTopics || loadingWords) {
        return (
            <div className="grid h-72 place-items-center">
                <div className="h-10 w-10 animate-spin rounded-full border-2 border-brand-200 border-t-brand-500" />
            </div>
        );
    }

    return (
        <section className="anim-fade-up">
            <div className="mb-6">
                <h1 className="font-display text-2xl font-bold tracking-tight sm:text-3xl">Học flashcard</h1>
                <p className="mt-1 text-sm text-muted">Lật thẻ để xem nghĩa, tự đánh giá mức độ ghi nhớ.</p>
            </div>

            <TopicSwitcher
                topics={topics}
                activeTopicId={studyTopicId}
                onPick={setStudyTopicId}
                onOpenTopics={onPickTopic}
            />

            {!studyTopicId ? (
                <EmptyState
                    icon={<GraduationCap size={26} />}
                    title="Chọn một chủ đề để học"
                    description="Mỗi chủ đề là một bộ flashcard riêng."
                    action={{ label: 'Xem chủ đề', onClick: onPickTopic }}
                />
            ) : total === 0 ? (
                <EmptyState
                    icon={<GraduationCap size={26} />}
                    title="Chủ đề này chưa có từ"
                    description='Thêm từ vựng vào chủ đề ở mục "Tra từ vựng" trước khi học.'
                    action={{ label: 'Chọn chủ đề khác', onClick: onPickTopic }}
                />
            ) : (
                <div className="mx-auto max-w-2xl">
                    {/* Progress */}
                    <div className="mb-4">
                        <div className="mb-1.5 flex items-center justify-between text-xs font-medium text-muted">
                            <span>Thẻ {index + 1} / {total}</span>
                            <span>{progress}% đã thuộc</span>
                        </div>
                        <div className="h-2 overflow-hidden rounded-full bg-ink/[0.06]">
                            <div
                                className="h-full rounded-full bg-gradient-to-r from-brand-400 to-brand-600 transition-all duration-500"
                                style={{ width: `${progress}%` }}
                            />
                        </div>
                    </div>

                    {current && (
                        <FlashCard vocab={current} flipped={flipped} onFlip={flip} level={current.level as Level} />
                    )}

                    {/* Navigation */}
                    <div className="mt-4 flex items-center justify-center gap-2">
                        <button
                            onClick={prev}
                            disabled={index === 0}
                            className="grid h-11 w-11 place-items-center rounded-xl bg-surface text-muted ring-1 ring-border transition hover:text-ink disabled:opacity-40"
                        >
                            <ChevronLeft size={20} />
                        </button>
                        <button
                            onClick={flip}
                            className="flex items-center gap-2 rounded-xl bg-ink px-5 py-2.5 text-sm font-semibold text-white transition hover:opacity-90"
                        >
                            <RotateCw size={15} /> Lật thẻ
                        </button>
                        <button
                            onClick={next}
                            disabled={index === total - 1}
                            className="grid h-11 w-11 place-items-center rounded-xl bg-surface text-muted ring-1 ring-border transition hover:text-ink disabled:opacity-40"
                        >
                            <ChevronRight size={20} />
                        </button>
                    </div>

                    {/* Mark known/learning */}
                    {flipped && (
                        <div className="mt-5 anim-fade-up">
                            <p className="mb-2 text-center text-xs font-medium text-muted">Bạn đã thuộc từ này?</p>
                            <div className="grid grid-cols-2 gap-3">
                                <button
                                    onClick={() => mark('learning', next)}
                                    className="flex items-center justify-center gap-2 rounded-xl border border-warning-100 bg-warning-50 py-3 text-sm font-semibold text-warning-600 transition hover:brightness-95"
                                >
                                    <X size={16} /> Chưa thuộc
                                </button>
                                <button
                                    onClick={() => mark('known', next)}
                                    className="flex items-center justify-center gap-2 rounded-xl border border-success-100 bg-success-50 py-3 text-sm font-semibold text-success-700 transition hover:brightness-95"
                                >
                                    <Check size={16} /> Đã thuộc
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Footer controls */}
                    <div className="mt-5 flex items-center justify-center gap-3 text-xs text-muted">
                        <button
                            onClick={shuffleCards}
                            className="flex items-center gap-1.5 rounded-lg bg-surface px-3 py-1.5 font-medium ring-1 ring-border transition hover:text-ink"
                        >
                            <Sparkles size={13} /> Trộn thẻ
                        </button>
                        <span>{index + 1} / {total}</span>
                    </div>
                </div>
            )}
        </section>
    );
}

// ── Sub-components (view-local, nhỏ và không tái sử dụng ở nơi khác) ──────────

function TopicSwitcher({
    topics,
    activeTopicId,
    onPick,
    onOpenTopics,
}: {
    topics: { id: string; name: string; color: string; word_count: number }[];
    activeTopicId: string | null;
    onPick: (id: string) => void;
    onOpenTopics: () => void;
}) {
    if (topics.length === 0) return null;
    return (
        <div className="mb-5">
            <div className="mb-2 flex items-center justify-between">
                <p className="text-xs font-semibold text-muted">Chọn chủ đề để học</p>
                <button onClick={onOpenTopics} className="text-xs font-medium text-brand-600 hover:underline">
                    Quản lý chủ đề
                </button>
            </div>
            <div className="flex gap-2 overflow-x-auto py-1 scroll-thin">
                {topics.map((t) => {
                    const c = getTopicColor(t.color);
                    const active = t.id === activeTopicId;
                    return (
                        <button
                            key={t.id}
                            onClick={() => onPick(t.id)}
                            className={`flex shrink-0 items-center gap-2 rounded-full px-3.5 py-2 text-xs font-semibold transition ${
                                active ? 'bg-ink text-white' : 'bg-surface text-muted ring-1 ring-border hover:text-ink'
                            }`}
                        >
                            <span className={`h-1.5 w-1.5 rounded-full ${c.bg}`} />
                            {t.name}
                            <span className={`rounded-full px-1.5 text-[10px] ${active ? 'bg-white/20' : 'bg-ink/[0.06]'}`}>
                                {t.word_count}
                            </span>
                        </button>
                    );
                })}
            </div>
        </div>
    );
}

function FlashCard({
    vocab,
    flipped,
    onFlip,
    level,
}: {
    vocab: Vocab;
    flipped: boolean;
    onFlip: () => void;
    level: Level;
}) {
    return (
        <div className="flash-card-flip h-72 cursor-pointer select-none sm:h-80" onClick={onFlip}>
            <div className={`flash-card-inner relative h-full w-full ${flipped ? 'is-flipped' : ''}`}>
                {/* Front */}
                <div className="flash-card-face absolute inset-0 flex flex-col items-center justify-center rounded-3xl border border-border bg-gradient-to-br from-ink to-brand-900 p-6 text-center shadow-card-hover">
                    <div className="absolute left-4 top-4"><LevelBadge level={level} /></div>
                    <span className="mb-2 text-xs font-semibold uppercase tracking-widest text-brand-200">Flashcard</span>
                    <h2 className="font-display text-4xl font-bold text-white sm:text-5xl">{vocab.word}</h2>
                    {vocab.phonetic && <p className="mt-2 font-mono text-sm text-brand-200">{vocab.phonetic}</p>}
                    {vocab.pos && <span className="mt-3 rounded-full bg-white/10 px-2.5 py-0.5 text-[10px] font-semibold uppercase text-white/80">{vocab.pos}</span>}
                    <span className="absolute bottom-4 right-4 flex items-center gap-1 text-[11px] text-white/50">
                        <RotateCw size={11} /> Nhấn để lật
                    </span>
                </div>
                {/* Back */}
                <div className="flash-card-back flash-card-face absolute inset-0 flex flex-col justify-center rounded-3xl border border-border bg-surface p-6 shadow-card-hover">
                    <span className="mb-2 text-xs font-semibold uppercase tracking-widest text-brand-500">Nghĩa</span>
                    <p className="font-display text-2xl font-bold leading-snug sm:text-3xl">{vocab.meaning}</p>
                    {vocab.example && (
                        <div className="mt-4 rounded-xl bg-brand-50 p-3.5">
                            <p className="text-sm italic leading-relaxed text-brand-800">"{vocab.example}"</p>
                        </div>
                    )}
                    <span className="absolute bottom-4 right-4 flex items-center gap-1 text-[11px] text-muted">
                        <RotateCw size={11} /> Nhấn để lật
                    </span>
                </div>
            </div>
        </div>
    );
}
