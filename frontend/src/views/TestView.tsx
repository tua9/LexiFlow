import { useCallback, useEffect, useState } from 'react';
import { Brain, Check, X, Trophy, RotateCw, ChevronRight, Clock } from 'lucide-react';
import { supabase, LEVEL_LABELS, LEVELS, type AnswerRecord, type Level, type TestResult } from '../lib/supabase';
import { vocabularyApi } from '../api';
import { useTopics } from '../hooks/useTopics';
import { LevelBadge } from '../components/LevelBadge';
import { LEVEL_STYLES, shuffle } from '../lib/theme';
import type { Vocab } from '../types';

type Phase = 'intro' | 'playing' | 'result';

type Question = {
    vocab: Vocab;
    options: string[];
    correct: string;
};

const QUESTIONS_PER_TEST = 15;

export function TestView() {
    const { topics } = useTopics();
    const [phase, setPhase] = useState<Phase>('intro');
    const [questions, setQuestions] = useState<Question[]>([]);
    const [current, setCurrent] = useState(0);
    const [selected, setSelected] = useState<string | null>(null);
    const [answers, setAnswers] = useState<AnswerRecord[]>([]);
    const [history, setHistory] = useState<TestResult[]>([]);
    const [elapsed, setElapsed] = useState(0);
    const [emptyMessage, setEmptyMessage] = useState<string | null>(null);

    const loadHistory = useCallback(async () => {
        try {
            const { data, error } = await supabase.from('test_results').select('*').order('created_at', { ascending: false }).limit(10);
            if (error) throw error;
            setHistory((data ?? []) as TestResult[]);
        } catch (error) {
            console.error('[TestView] loadHistory failed:', error);
            setHistory([]);
        }
    }, []);

    useEffect(() => {
        void loadHistory();
    }, [loadHistory]);

    useEffect(() => {
        if (phase !== 'playing') return;
        const t = setInterval(() => setElapsed((e) => e + 1), 1000);
        return () => clearInterval(t);
    }, [phase]);

    const start = useCallback(async () => {
        setEmptyMessage(null);

        try {
            const topicVocabLists = await Promise.allSettled(
                topics.map((topic) => vocabularyApi.getByTopic(topic.id)),
            );
            const all = topicVocabLists.flatMap((result) => result.status === 'fulfilled' ? result.value : []);
            const uniqueVocab = all.filter((vocab, index, self) => self.findIndex((item) => item.id === vocab.id) === index);

            if (uniqueVocab.length < 4) {
                setEmptyMessage('Bạn chưa có đủ từ vựng để làm bài kiểm tra. Hãy thêm từ vào chủ đề của mình trước.');
                setQuestions([]);
                setCurrent(0);
                setSelected(null);
                setAnswers([]);
                setElapsed(0);
                setPhase('intro');
                return;
            }

            const picked = shuffle(uniqueVocab).slice(0, Math.min(QUESTIONS_PER_TEST, uniqueVocab.length));
            const qs: Question[] = picked.map((vocab) => {
                const distractors = shuffle(
                    [...new Set(
                        uniqueVocab
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
        } catch (error) {
            console.error('[TestView] start failed:', error);
            setEmptyMessage('Không thể tải dữ liệu kiểm tra lúc này. Vui lòng thử lại sau.');
            setQuestions([]);
            setCurrent(0);
            setSelected(null);
            setAnswers([]);
            setElapsed(0);
            setPhase('intro');
        }
    }, [topics]);

    const choose = useCallback(
        (opt: string) => {
            if (selected) return;
            setSelected(opt);
            const q = questions[current];
            const isCorrect = opt === q.correct;
            const record: AnswerRecord = {
                word_id: q.vocab.id,
                word: q.vocab.word,
                correct_meaning: q.correct,
                chosen: opt,
                is_correct: isCorrect,
            };
            setAnswers((p) => [...p, record]);
            setTimeout(() => {
                if (current < questions.length - 1) {
                    setCurrent((i) => i + 1);
                    setSelected(null);
                } else {
                    finish([...answers, record]);
                }
            }, 900);
        },
        [selected, questions, current, answers],
    );

    const finish = useCallback(async (finalAnswers: AnswerRecord[]) => {
        const score = finalAnswers.filter((a) => a.is_correct).length;
        const total = finalAnswers.length;
        const ratio = score / total;
        let level: Level = 'A1';
        if (ratio >= 0.9) level = 'C2';
        else if (ratio >= 0.78) level = 'C1';
        else if (ratio >= 0.65) level = 'B2';
        else if (ratio >= 0.5) level = 'B1';
        else if (ratio >= 0.35) level = 'A2';
        else level = 'A1';

        try {
            await supabase.from('test_results').insert({ score, total, level, answers: finalAnswers });
            await loadHistory();
        } catch (error) {
            console.error('[TestView] save result failed:', error);
        }

        setPhase('result');
    }, [loadHistory]);

    if (phase === 'intro') return <Intro onStart={start} history={history} emptyMessage={emptyMessage} />;
    if (phase === 'playing' && questions.length) {
        const q = questions[current];
        return (
            <Playing
                q={q}
                index={current}
                total={questions.length}
                selected={selected}
                onChoose={choose}
                elapsed={elapsed}
            />
        );
    }
    if (phase === 'result') {
        const score = answers.filter((a) => a.is_correct).length;
        const ratio = score / Math.max(answers.length, 1);
        let level: Level = 'A1';
        if (ratio >= 0.9) level = 'C2';
        else if (ratio >= 0.78) level = 'C1';
        else if (ratio >= 0.65) level = 'B2';
        else if (ratio >= 0.5) level = 'B1';
        else if (ratio >= 0.35) level = 'A2';
        return <Result score={score} total={answers.length} level={level} answers={answers} history={history} onRestart={start} />;
    }
    return null;
}

function Intro({ onStart, history, emptyMessage }: { onStart: () => void; history: TestResult[]; emptyMessage: string | null }) {
    return (
        <section className="anim-fade-up">
            <div className="mb-6">
                <h1 className="font-display text-2xl font-bold tracking-tight sm:text-3xl">Kiểm tra trình độ</h1>
                <p className="mt-1 text-sm text-muted">Bài kiểm tra trắc nghiệm {QUESTIONS_PER_TEST} câu, chẩn đoán trình độ CEFR.</p>
            </div>

            <div className="relative overflow-hidden rounded-3xl border border-border bg-gradient-to-br from-ink to-brand-900 p-8 text-white shadow-card-hover sm:p-10">
                <div className="absolute -right-12 -top-12 h-48 w-48 rounded-full bg-brand-500/20 blur-2xl" />
                <div className="absolute -bottom-12 -left-12 h-48 w-48 rounded-full bg-brand-400/10 blur-2xl" />
                <div className="relative">
                    <div className="grid h-14 w-14 place-items-center rounded-2xl bg-white/10 backdrop-blur">
                        <Brain size={26} />
                    </div>
                    <h2 className="mt-4 font-display text-2xl font-bold sm:text-3xl">Sẵn sàng kiểm tra?</h2>
                    <p className="mt-2 max-w-md text-sm text-white/70">
                        Chọn nghĩa đúng cho mỗi từ tiếng Anh. Hệ thống sẽ chẩn đoán trình độ theo chuẩn CEFR (A1–C2).
                    </p>
                    <div className="mt-5 flex flex-wrap items-center gap-4 text-xs text-white/70">
                        <span className="flex items-center gap-1.5">
                            <span className="grid h-6 w-6 place-items-center rounded-md bg-white/10 font-semibold">{QUESTIONS_PER_TEST}</span>
                            câu hỏi
                        </span>
                        <span className="flex items-center gap-1.5">
                            <Clock size={14} /> ~5 phút
                        </span>
                        <span className="flex items-center gap-1.5">
                            <Trophy size={14} /> Chẩn đoán A1–C2
                        </span>
                    </div>
                    <button
                        onClick={onStart}
                        className="mt-6 flex items-center gap-2 rounded-xl bg-white px-6 py-3 text-sm font-bold text-ink transition hover:bg-brand-50"
                    >
                        Bắt đầu kiểm tra <ChevronRight size={17} />
                    </button>
                </div>
            </div>

            {emptyMessage && (
                <div className="mt-6 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-700">
                    {emptyMessage}
                </div>
            )}

            <LevelLegend />

            {history.length > 0 && (
                <div className="mt-8">
                    <h3 className="mb-3 font-display text-base font-bold">Lịch sử kiểm tra</h3>
                    <div className="space-y-2">
                        {history.map((h) => (
                            <HistoryRow key={h.id} result={h} />
                        ))}
                    </div>
                </div>
            )}
        </section>
    );
}

function LevelLegend() {
    return (
        <div className="mt-6">
            <p className="mb-2 text-xs font-semibold text-muted">Thang năng lực ngôn ngữ CEFR</p>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-6">
                {LEVELS.map((lv) => {
                    const s = LEVEL_STYLES[lv];
                    return (
                        <div key={lv} className={`rounded-xl border border-border ${s.bg} px-3 py-2.5`}>
                            <p className={`font-display text-sm font-bold ${s.text}`}>{lv}</p>
                            <p className="mt-0.5 text-[11px] text-muted">{LEVEL_LABELS[lv]}</p>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

function HistoryRow({ result }: { result: TestResult }) {
    const pct = Math.round((result.score / result.total) * 100);
    const s = LEVEL_STYLES[result.level as Level];
    return (
        <div className="flex items-center justify-between gap-3 rounded-xl border border-border bg-surface px-4 py-3">
            <div className="flex items-center gap-3">
                <span className={`grid h-9 w-9 place-items-center rounded-lg ${s.bg} ${s.text} font-display text-sm font-bold`}>
                    {result.level}
                </span>
                <div>
                    <p className="text-sm font-semibold">
                        {result.score}/{result.total} đúng
                    </p>
                    <p className="text-xs text-muted">{new Date(result.created_at).toLocaleDateString('vi-VN', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
                </div>
            </div>
            <div className="flex items-center gap-2">
                <div className="hidden h-1.5 w-20 overflow-hidden rounded-full bg-ink/[0.06] sm:block">
                    <div className={`h-full ${s.dot}`} style={{ width: `${pct}%` }} />
                </div>
                <span className="text-xs font-semibold text-muted">{pct}%</span>
            </div>
        </div>
    );
}

function Playing({
    q,
    index,
    total,
    selected,
    onChoose,
    elapsed,
}: {
    q: Question;
    index: number;
    total: number;
    selected: string | null;
    onChoose: (opt: string) => void;
    elapsed: number;
}) {
    const progress = Math.round(((index + (selected ? 1 : 0)) / total) * 100);
    return (
        <section className="mx-auto max-w-2xl anim-fade-up">
            <div className="mb-4 flex items-center justify-between">
                <span className="text-xs font-semibold text-muted">
                    Câu {index + 1} / {total}
                </span>
                <span className="flex items-center gap-1 text-xs font-medium text-muted">
                    <Clock size={12} /> {formatTime(elapsed)}
                </span>
            </div>
            <div className="mb-6 h-1.5 overflow-hidden rounded-full bg-ink/[0.06]">
                <div className="h-full rounded-full bg-gradient-to-r from-brand-400 to-brand-600 transition-all duration-300" style={{ width: `${progress}%` }} />
            </div>

            <div className="mb-6 rounded-3xl border border-border bg-surface p-6 text-center shadow-card-hover sm:p-8">
                <div className="mb-3 flex items-center justify-center gap-2">
                    <LevelBadge level={q.vocab.level} />
                    {q.vocab.pos && <span className="rounded bg-ink/[0.05] px-1.5 py-0.5 text-[10px] font-semibold uppercase text-muted">{q.vocab.pos}</span>}
                </div>
                <h2 className="font-display text-4xl font-bold tracking-tight sm:text-5xl">{q.vocab.word}</h2>
                {q.vocab.phonetic && <p className="mt-1 font-mono text-sm text-muted">{q.vocab.phonetic}</p>}
                <p className="mt-3 text-xs text-muted">Chọn nghĩa đúng của từ này</p>
            </div>

            <div className="grid gap-2.5">
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
                            onClick={() => onChoose(opt)}
                            disabled={reveal}
                            className={`flex items-center justify-between rounded-2xl px-4 py-3.5 text-left text-sm font-medium transition ${cls}`}
                        >
                            <span>{opt}</span>
                            {reveal && isCorrect && <Check size={18} className="shrink-0" />}
                            {reveal && isPicked && !isCorrect && <X size={18} className="shrink-0" />}
                        </button>
                    );
                })}
            </div>
        </section>
    );
}

function Result({
    score,
    total,
    level,
    answers,
    history,
    onRestart,
}: {
    score: number;
    total: number;
    level: Level;
    answers: AnswerRecord[];
    history: TestResult[];
    onRestart: () => void;
}) {
    const pct = Math.round((score / Math.max(total, 1)) * 100);
    const s = LEVEL_STYLES[level];
    const wrong = answers.filter((a) => !a.is_correct);

    return (
        <section className="anim-fade-up">
            <div className="mx-auto max-w-2xl">
                <div className={`relative overflow-hidden rounded-3xl border ${s.ring} bg-surface p-8 shadow-card-hover`}>
                    <div className={`absolute -right-16 -top-16 h-48 w-48 rounded-full ${s.bg} blur-3xl opacity-70`} />
                    <div className="relative text-center">
                        <div className={`mx-auto grid h-16 w-16 place-items-center rounded-2xl ${s.bg} ${s.text}`}>
                            <Trophy size={28} />
                        </div>
                        <p className="mt-3 text-xs font-semibold uppercase tracking-widest text-muted">Trình độ của bạn</p>
                        <h2 className="mt-1 font-display text-5xl font-bold tracking-tight">
                            <span className={s.text}>{level}</span>
                        </h2>
                        <p className="mt-1 text-sm text-muted">{LEVEL_LABELS[level]}</p>
                        <div className="mx-auto mt-6 grid max-w-xs grid-cols-3 gap-3">
                            <Stat label="Điểm" value={`${score}/${total}`} />
                            <Stat label="Tỉ lệ" value={`${pct}%`} />
                            <Stat label="Sai" value={String(wrong.length)} />
                        </div>
                        <button
                            onClick={onRestart}
                            className="mt-7 inline-flex items-center gap-2 rounded-xl bg-ink px-5 py-2.5 text-sm font-semibold text-white transition hover:opacity-90"
                        >
                            <RotateCw size={16} /> Làm lại
                        </button>
                    </div>
                </div>

                {wrong.length > 0 && (
                    <div className="mt-6">
                        <h3 className="mb-3 font-display text-base font-bold">Cần ôn lại ({wrong.length})</h3>
                        <div className="space-y-2">
                            {wrong.map((a, i) => (
                                <div key={i} className="flex items-center justify-between gap-3 rounded-xl border border-border bg-surface px-4 py-3">
                                    <div className="min-w-0">
                                        <p className="font-display text-sm font-bold">{a.word}</p>
                                        <p className="truncate text-xs text-muted">Đúng: {a.correct_meaning}</p>
                                    </div>
                                    <div className="shrink-0 text-right">
                                        <p className="flex items-center justify-end gap-1 text-xs text-error-600">
                                            <X size={12} /> {a.chosen}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {history.length > 0 && (
                    <div className="mt-8">
                        <h3 className="mb-3 font-display text-base font-bold">Lịch sử kiểm tra</h3>
                        <div className="space-y-2">
                            {history.map((h) => (
                                <HistoryRow key={h.id} result={h} />
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </section>
    );
}

function Stat({ label, value }: { label: string; value: string }) {
    return (
        <div className="rounded-xl border border-border bg-canvas px-3 py-2.5">
            <p className="font-display text-lg font-bold leading-none">{value}</p>
            <p className="mt-1 text-[11px] text-muted">{label}</p>
        </div>
    );
}

function formatTime(sec: number) {
    const m = Math.floor(sec / 60).toString().padStart(1, '0');
    const s = (sec % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
}
