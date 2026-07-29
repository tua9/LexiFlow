import { useState, useCallback, useEffect } from 'react';
import { Plus, GraduationCap, Layers, BookMarked, Search, ArrowLeft, Trash2, Brain, Check, X, RotateCw, Clock, ChevronRight } from 'lucide-react';
import { useTopics } from '../hooks/useTopics';
import { TopicCard } from '../components/topics/TopicCard';
import { CreateTopicModal } from '../components/topics/CreateTopicModal';
import { EditTopicModal } from '../components/topics/EditTopicModal';
import { EmptyState } from '../components/ui/EmptyState';
import { SkeletonGrid } from '../components/ui/SkeletonGrid';
import { Modal } from '../components/Modal';
import { LevelBadge } from '../components/LevelBadge';
import { getTopicColor, LEVEL_STYLES, shuffle } from '../lib/theme';
import { topicApi } from '../api/topicsApi';
import { vocabularyApi } from '../api/vocabulariesApi';
import type { Topic, Vocab } from '../types';
import { LEVEL_LABELS, LEVELS, type Level } from '../lib/supabase';

const QUESTIONS_PER_TOPIC_TEST = 10;

type Phase = 'intro' | 'playing' | 'result';
type Question = { vocab: Vocab; options: string[]; correct: string };
type AnswerRecord = { word: string; correct_meaning: string; chosen: string; is_correct: boolean };

interface TopicsViewProps {
    onStudy: (topicId: string) => void;
    onAddWords: (topicId: string) => void;
}

export function TopicsView({ onStudy, onAddWords }: TopicsViewProps) {
    const { topics, loading, refetch } = useTopics();
    const [creating, setCreating] = useState(false);
    const [openTopic, setOpenTopic] = useState<Topic | null>(null);
    const [editingTopic, setEditingTopic] = useState<Topic | null>(null);
    const [testingTopic, setTestingTopic] = useState<Topic | null>(null);

    return (
        <section className="anim-fade-up">
            {/* Header */}
            <div className="mb-6 flex items-center justify-between">
                <div>
                    <h1 className="font-display text-2xl font-bold tracking-tight sm:text-3xl">
                        Chủ đề cá nhân
                    </h1>
                    <p className="mt-1 text-sm text-muted">
                        Tạo bộ từ riêng và học theo đúng nhu cầu của bạn.
                    </p>
                </div>
                <button
                    onClick={() => setCreating(true)}
                    className="flex items-center gap-2 rounded-xl bg-ink px-4 py-2.5 text-sm font-semibold text-white shadow-soft transition hover:opacity-90"
                >
                    <Plus size={17} />
                    <span className="hidden sm:inline">Tạo chủ đề</span>
                </button>
            </div>

            {/* Content */}
            {loading ? (
                <SkeletonGrid count={3} height="h-36" />
            ) : topics.length === 0 ? (
                <EmptyState
                    icon={<BookMarked size={26} />}
                    title="Chưa có chủ đề cá nhân"
                    description="Tạo chủ đề, sau đó thêm từ vựng để bắt đầu việc học."
                    action={{ label: '+ Tạo chủ đề đầu tiên', onClick: () => setCreating(true) }}
                />
            ) : (
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {topics.map((t, i) => (
                        <TopicCard
                            key={t.id}
                            topic={t}
                            index={i}
                            onOpen={() => setOpenTopic(t)}
                            onStudy={() => onStudy(t.id)}
                            onEdit={() => setEditingTopic(t)}
                            onTest={() => setTestingTopic(t)}
                        />
                    ))}
                </div>
            )}

            <CreateTopicModal
                open={creating}
                onClose={() => setCreating(false)}
                onCreated={refetch}
            />

            <EditTopicModal
                open={!!editingTopic}
                topic={editingTopic}
                onClose={() => setEditingTopic(null)}
                onSaved={() => { refetch(); setEditingTopic(null); }}
            />

            <TopicDetailModal
                topic={openTopic}
                onClose={() => setOpenTopic(null)}
                onStudy={() => { if (openTopic) onStudy(openTopic.id); setOpenTopic(null); }}
                onAddWords={onAddWords}
                onChanged={refetch}
            />

            <TopicTestModal
                topic={testingTopic}
                onClose={() => setTestingTopic(null)}
            />
        </section>
    );
}

// ── TopicDetailModal (view-local, chưa đủ lớn để tách riêng file) ────────────
interface TopicDetailModalProps {
    topic: Topic | null;
    onClose: () => void;
    onStudy: () => void;
    onAddWords: (topicId: string) => void;
    onChanged: () => void;
}

function TopicDetailModal({ topic, onClose, onStudy, onAddWords, onChanged }: TopicDetailModalProps) {
    const [words, setWords] = useState<Vocab[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!topic) return;
        setLoading(true);
        vocabularyApi.getByTopic(topic.id)
            .then((topicWords) => {
                setWords(topicWords);
            })
            .catch(console.error)
            .finally(() => setLoading(false));
    }, [topic]);

    async function removeWord(wordId: string) {
        await vocabularyApi.delete(wordId);
        setWords((p) => p.filter((w) => w.id !== wordId));
        onChanged();
    }

    async function removeTopic() {
        if (!topic) return;
        try {
            await topicApi.delete(topic.id);
            onChanged();
            onClose();
        } catch (error) {
            console.error('[TopicDetailModal] removeTopic:', error);
        }
    }

    const c = topic ? getTopicColor(topic.color) : null;

    return (
        <Modal open={!!topic} onClose={onClose} size="lg">
            {topic && c && (
                <div>
                    {/* Header */}
                    <div className="mb-4 flex items-start justify-between gap-3">
                        <div className="flex items-start gap-3">
                            <span className={`grid h-10 w-10 place-items-center rounded-xl ${c.bg} text-white`}>
                                <Layers size={18} />
                            </span>
                            <div>
                                <div className="flex items-center gap-2">
                                    <h3 className="font-display text-lg font-bold">{topic.name}</h3>
                                    <span className={`rounded-full ${c.soft} ${c.text} px-2 py-0.5 text-[10px] font-semibold`}>
                                        {words.length} từ
                                    </span>
                                </div>
                                {topic.description && (
                                    <p className="mt-0.5 text-xs text-muted">{topic.description}</p>
                                )}
                            </div>
                        </div>
                        <button
                            onClick={() => {
                                if (topic && confirm(`Xoá chủ đề "${topic.name}"?`)) {
                                    removeTopic();
                                }
                            }}
                            className="grid h-8 w-8 place-items-center rounded-lg text-muted transition hover:bg-error-50 hover:text-error-600"
                            title="Xoá chủ đề"
                        >
                            <Trash2 size={16} />
                        </button>
                    </div>

                    {/* Word list */}
                    {loading ? (
                        <div className="space-y-2">
                            {Array.from({ length: 4 }).map((_, i) => (
                                <div key={i} className="h-14 animate-pulse rounded-xl bg-ink/[0.04]" />
                            ))}
                        </div>
                    ) : words.length === 0 ? (
                        <div className="py-10 text-center">
                            <div className="mx-auto grid h-12 w-12 place-items-center rounded-xl bg-ink/[0.06] text-muted">
                                <Search size={20} />
                            </div>
                            <p className="mt-3 text-sm font-medium">Chủ đề chưa có từ vựng</p>
                            <p className="mt-1 text-xs text-muted">Tra cứu từ vựng và thêm vào chủ đề này.</p>
                            <button
                                onClick={() => { onAddWords(topic.id); onClose(); }}
                                className="mt-4 inline-flex items-center gap-2 rounded-xl bg-brand-500 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-brand-600"
                            >
                                <Plus size={16} /> Thêm từ vựng
                            </button>
                        </div>
                    ) : (
                        <div className="space-y-1.5">
                            {words.map((w) => (
                                <div
                                    key={w.id}
                                    className="group flex items-center justify-between gap-3 rounded-xl border border-border bg-surface px-3.5 py-2.5"
                                >
                                    <div className="min-w-0">
                                        <div className="flex items-center gap-2">
                                            <span className="truncate font-display text-sm font-bold">{w.word}</span>
                                            <LevelBadge level={w.level} />
                                        </div>
                                        <p className="truncate text-xs text-muted">{w.meaning}</p>
                                    </div>
                                    <button
                                        onClick={() => removeWord(w.id)}
                                        className="shrink-0 rounded-lg p-1.5 text-muted opacity-0 transition hover:bg-error-50 hover:text-error-600 group-hover:opacity-100"
                                    >
                                        <Trash2 size={14} />
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Footer */}
                    <div className="mt-5 flex items-center justify-between border-t border-border pt-4">
                        <button
                            onClick={onClose}
                            className="flex items-center gap-1 text-sm font-semibold text-muted transition hover:text-ink"
                        >
                            <ArrowLeft size={15} /> Đóng
                        </button>
                        <div className="flex items-center gap-2">
                            <button
                                onClick={() => { onAddWords(topic.id); onClose(); }}
                                className="flex items-center gap-1.5 rounded-xl border border-border px-3.5 py-2.5 text-sm font-semibold text-ink transition hover:border-brand-200 hover:bg-brand-50"
                            >
                                <Plus size={15} /> Thêm từ
                            </button>
                            <button
                                onClick={onStudy}
                                disabled={words.length === 0}
                                className="flex items-center gap-2 rounded-xl bg-brand-500 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-brand-600 disabled:opacity-40"
                            >
                                <GraduationCap size={16} /> Bắt đầu học
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </Modal>
    );
}

// ── TopicTestModal ─────────────────────────────────────────────────────────────
interface TopicTestModalProps {
    topic: Topic | null;
    onClose: () => void;
}

function TopicTestModal({ topic, onClose }: TopicTestModalProps) {
    const [phase, setPhase] = useState<Phase>('intro');
    const [questions, setQuestions] = useState<Question[]>([]);
    const [current, setCurrent] = useState(0);
    const [selected, setSelected] = useState<string | null>(null);
    const [answers, setAnswers] = useState<AnswerRecord[]>([]);
    const [elapsed, setElapsed] = useState(0);
    const [emptyMessage, setEmptyMessage] = useState<string | null>(null);
    const [loadingVocab, setLoadingVocab] = useState(false);

    // Reset when topic changes
    useEffect(() => {
        if (!topic) {
            setPhase('intro');
            setQuestions([]);
            setCurrent(0);
            setSelected(null);
            setAnswers([]);
            setElapsed(0);
            setEmptyMessage(null);
        }
    }, [topic]);

    // Timer
    useEffect(() => {
        if (phase !== 'playing') return;
        const t = setInterval(() => setElapsed((e) => e + 1), 1000);
        return () => clearInterval(t);
    }, [phase]);

    const start = useCallback(async () => {
        if (!topic) return;
        setEmptyMessage(null);
        setLoadingVocab(true);
        try {
            const vocabs = await vocabularyApi.getByTopic(topic.id);
            if (vocabs.length < 4) {
                setEmptyMessage('Chủ đề này cần ít nhất 4 từ để làm bài kiểm tra.');
                setLoadingVocab(false);
                return;
            }
            const picked = shuffle(vocabs).slice(0, Math.min(QUESTIONS_PER_TOPIC_TEST, vocabs.length));
            const qs: Question[] = picked.map((vocab) => {
                const distractors = shuffle(
                    [...new Set(
                        vocabs
                            .filter((item) => item.id !== vocab.id && item.meaning !== vocab.meaning)
                            .map((item) => item.meaning)
                    )]
                ).slice(0, 3);
                const options = shuffle([vocab.meaning, ...distractors]);
                return { vocab, options, correct: vocab.meaning };
            });
            setQuestions(qs);
            setCurrent(0);
            setSelected(null);
            setAnswers([]);
            setElapsed(0);
            setPhase('playing');
        } catch (err) {
            console.error('[TopicTestModal] start:', err);
            setEmptyMessage('Không thể tải từ vựng. Vui lòng thử lại.');
        } finally {
            setLoadingVocab(false);
        }
    }, [topic]);

    const choose = useCallback(
        (opt: string) => {
            if (selected) return;
            setSelected(opt);
            const q = questions[current];
            const isCorrect = opt === q.correct;
            const record: AnswerRecord = {
                word: q.vocab.word,
                correct_meaning: q.correct,
                chosen: opt,
                is_correct: isCorrect,
            };
            const next = [...answers, record];
            setAnswers(next);
            setTimeout(() => {
                if (current < questions.length - 1) {
                    setCurrent((i) => i + 1);
                    setSelected(null);
                } else {
                    setPhase('result');
                }
            }, 900);
        },
        [selected, questions, current, answers],
    );

    const restart = useCallback(() => {
        setPhase('intro');
        setQuestions([]);
        setCurrent(0);
        setSelected(null);
        setAnswers([]);
        setElapsed(0);
        setEmptyMessage(null);
    }, []);

    const c = topic ? getTopicColor(topic.color) : null;
    const score = answers.filter((a) => a.is_correct).length;

    function formatTime(sec: number) {
        const m = Math.floor(sec / 60).toString();
        const s = (sec % 60).toString().padStart(2, '0');
        return `${m}:${s}`;
    }

    function computeLevel(ratio: number): Level {
        if (ratio >= 0.9) return 'C2';
        if (ratio >= 0.78) return 'C1';
        if (ratio >= 0.65) return 'B2';
        if (ratio >= 0.5) return 'B1';
        if (ratio >= 0.35) return 'A2';
        return 'A1';
    }

    return (
        <Modal open={!!topic} onClose={onClose} size="lg" title={phase === 'intro' ? `Kiểm tra: ${topic?.name ?? ''}` : undefined}>
            {topic && c && (
                <div>
                    {phase === 'intro' && (
                        <div>
                            {/* Hero banner */}
                            <div className={`relative overflow-hidden rounded-2xl ${c.bg} p-6 text-white`}>
                                <div className="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-white/10 blur-2xl" />
                                <div className="relative">
                                    <div className="grid h-12 w-12 place-items-center rounded-xl bg-white/20 backdrop-blur">
                                        <Brain size={22} />
                                    </div>
                                    <h2 className="mt-3 font-display text-xl font-bold">{topic.name}</h2>
                                    <p className="mt-1 text-sm text-white/70">
                                        Trắc nghiệm tối đa {QUESTIONS_PER_TOPIC_TEST} câu từ chủ đề này.
                                    </p>
                                    <div className="mt-4 flex flex-wrap items-center gap-3 text-xs text-white/70">
                                        <span className="flex items-center gap-1.5">
                                            <span className="grid h-5 w-5 place-items-center rounded bg-white/20 font-semibold text-[11px]">
                                                {Math.min(topic.word_count, QUESTIONS_PER_TOPIC_TEST)}
                                            </span>
                                            câu hỏi
                                        </span>
                                        <span className="flex items-center gap-1.5">
                                            <Clock size={13} /> ~{Math.ceil(Math.min(topic.word_count, QUESTIONS_PER_TOPIC_TEST) * 0.3)} phút
                                        </span>
                                    </div>
                                    <button
                                        onClick={start}
                                        disabled={loadingVocab}
                                        className="mt-5 flex items-center gap-2 rounded-xl bg-white/90 px-5 py-2.5 text-sm font-bold text-ink transition hover:bg-white disabled:opacity-60"
                                    >
                                        {loadingVocab ? 'Đang tải...' : (<>Bắt đầu <ChevronRight size={16} /></>)}
                                    </button>
                                </div>
                            </div>
                            {emptyMessage && (
                                <div className="mt-4 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-700">
                                    {emptyMessage}
                                </div>
                            )}
                            {/* Level legend */}
                            <div className="mt-5">
                                <p className="mb-2 text-xs font-semibold text-muted">Thang năng lực CEFR</p>
                                <div className="grid grid-cols-3 gap-1.5 sm:grid-cols-6">
                                    {LEVELS.map((lv) => {
                                        const s = LEVEL_STYLES[lv];
                                        return (
                                            <div key={lv} className={`rounded-lg border border-border ${s.bg} px-2 py-2`}>
                                                <p className={`font-display text-sm font-bold ${s.text}`}>{lv}</p>
                                                <p className="mt-0.5 text-[10px] text-muted">{LEVEL_LABELS[lv]}</p>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>
                    )}

                    {phase === 'playing' && questions.length > 0 && (() => {
                        const q = questions[current];
                        const progress = Math.round(((current + (selected ? 1 : 0)) / questions.length) * 100);
                        return (
                            <div>
                                {/* Progress */}
                                <div className="mb-3 flex items-center justify-between">
                                    <span className="text-xs font-semibold text-muted">Câu {current + 1} / {questions.length}</span>
                                    <span className="flex items-center gap-1 text-xs font-medium text-muted">
                                        <Clock size={12} /> {formatTime(elapsed)}
                                    </span>
                                </div>
                                <div className="mb-5 h-1.5 overflow-hidden rounded-full bg-ink/[0.06]">
                                    <div
                                        className="h-full rounded-full bg-gradient-to-r from-brand-400 to-brand-600 transition-all duration-300"
                                        style={{ width: `${progress}%` }}
                                    />
                                </div>
                                {/* Word card */}
                                <div className="mb-5 rounded-2xl border border-border bg-surface p-5 text-center shadow-soft">
                                    <div className="mb-2 flex items-center justify-center gap-2">
                                        <LevelBadge level={q.vocab.level} />
                                        {q.vocab.pos && (
                                            <span className="rounded bg-ink/[0.05] px-1.5 py-0.5 text-[10px] font-semibold uppercase text-muted">
                                                {q.vocab.pos}
                                            </span>
                                        )}
                                    </div>
                                    <h2 className="font-display text-3xl font-bold tracking-tight sm:text-4xl">{q.vocab.word}</h2>
                                    {q.vocab.phonetic && (
                                        <p className="mt-1 font-mono text-xs text-muted">{q.vocab.phonetic}</p>
                                    )}
                                    <p className="mt-2 text-xs text-muted">Chọn nghĩa đúng</p>
                                </div>
                                {/* Options */}
                                <div className="grid gap-2">
                                    {q.options.map((opt, i) => {
                                        const isPicked = selected === opt;
                                        const isCorrect = opt === q.correct;
                                        const reveal = selected !== null;
                                        let cls = 'bg-surface ring-1 ring-border hover:ring-brand-200 hover:bg-brand-50/40 text-ink';
                                        if (reveal && isCorrect) cls = 'bg-success-50 ring-2 ring-success-500 text-success-700';
                                        else if (reveal && isPicked && !isCorrect) cls = 'bg-error-50 ring-2 ring-error-500 text-error-700';
                                        else if (reveal) cls = 'bg-surface ring-1 ring-border opacity-60 text-muted';
                                        return (
                                            <button
                                                key={i}
                                                onClick={() => choose(opt)}
                                                disabled={!!reveal}
                                                className={`flex items-center justify-between rounded-xl px-4 py-3 text-left text-sm font-medium transition ${cls}`}
                                            >
                                                <span>{opt}</span>
                                                {reveal && isCorrect && <Check size={16} className="shrink-0" />}
                                                {reveal && isPicked && !isCorrect && <X size={16} className="shrink-0" />}
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>
                        );
                    })()}

                    {phase === 'result' && (() => {
                        const ratio = score / Math.max(answers.length, 1);
                        const level = computeLevel(ratio);
                        const pct = Math.round(ratio * 100);
                        const s = LEVEL_STYLES[level];
                        const wrong = answers.filter((a) => !a.is_correct);
                        return (
                            <div>
                                {/* Result banner */}
                                <div className={`relative overflow-hidden rounded-2xl border ${s.ring} bg-surface p-6 text-center shadow-soft`}>
                                    <div className={`absolute -right-12 -top-12 h-40 w-40 rounded-full ${s.bg} opacity-60 blur-3xl`} />
                                    <div className="relative">
                                        <div className={`mx-auto grid h-14 w-14 place-items-center rounded-2xl ${s.bg} ${s.text}`}>
                                            <Brain size={24} />
                                        </div>
                                        <p className="mt-3 text-xs font-semibold uppercase tracking-widest text-muted">Kết quả</p>
                                        <h2 className={`mt-1 font-display text-4xl font-bold ${s.text}`}>{level}</h2>
                                        <p className="mt-0.5 text-sm text-muted">{LEVEL_LABELS[level]}</p>
                                        <div className="mx-auto mt-5 grid max-w-xs grid-cols-3 gap-2">
                                            <div className="rounded-xl border border-border bg-canvas px-3 py-2">
                                                <p className="font-display text-lg font-bold">{score}/{answers.length}</p>
                                                <p className="mt-0.5 text-[11px] text-muted">Điểm</p>
                                            </div>
                                            <div className="rounded-xl border border-border bg-canvas px-3 py-2">
                                                <p className="font-display text-lg font-bold">{pct}%</p>
                                                <p className="mt-0.5 text-[11px] text-muted">Tỉ lệ</p>
                                            </div>
                                            <div className="rounded-xl border border-border bg-canvas px-3 py-2">
                                                <p className="font-display text-lg font-bold">{wrong.length}</p>
                                                <p className="mt-0.5 text-[11px] text-muted">Sai</p>
                                            </div>
                                        </div>
                                        <div className="mt-5 flex items-center justify-center gap-2">
                                            <button
                                                onClick={restart}
                                                className="flex items-center gap-2 rounded-xl border border-border px-4 py-2.5 text-sm font-semibold text-ink transition hover:bg-ink/[0.04]"
                                            >
                                                <RotateCw size={15} /> Làm lại
                                            </button>
                                            <button
                                                onClick={onClose}
                                                className="flex items-center gap-2 rounded-xl bg-ink px-4 py-2.5 text-sm font-semibold text-white transition hover:opacity-90"
                                            >
                                                Xong <ChevronRight size={15} />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                                {/* Wrong answers */}
                                {wrong.length > 0 && (
                                    <div className="mt-5">
                                        <h3 className="mb-3 font-display text-sm font-bold">Cần ôn lại ({wrong.length})</h3>
                                        <div className="space-y-2">
                                            {wrong.map((a, i) => (
                                                <div key={i} className="flex items-center justify-between gap-3 rounded-xl border border-border bg-surface px-4 py-3">
                                                    <div className="min-w-0">
                                                        <p className="font-display text-sm font-bold">{a.word}</p>
                                                        <p className="truncate text-xs text-muted">Đúng: {a.correct_meaning}</p>
                                                    </div>
                                                    <p className="flex shrink-0 items-center gap-1 text-xs text-error-600">
                                                        <X size={12} /> {a.chosen}
                                                    </p>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        );
                    })()}
                </div>
            )}
        </Modal>
    );
}
