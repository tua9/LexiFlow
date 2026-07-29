import { useEffect, useState } from 'react';
import { Search, Layers, GraduationCap, Brain, ArrowRight, TrendingUp, BookOpen, Target } from 'lucide-react';
import { supabase, LEVEL_LABELS, type Level, type TestResult } from '../lib/supabase';
import { useTopics } from '../hooks/useTopics';
import { LEVEL_STYLES } from '../lib/theme';
import type { View } from '../types';

export function DashboardView({ onNavigate }: { onNavigate: (v: View) => void }) {
    const { topics } = useTopics();
    const [lastTest, setLastTest] = useState<TestResult | null>(null);
    const [bestLevel, setBestLevel] = useState<{ level: Level; score: number; total: number } | null>(null);

    useEffect(() => {
        // Test results vẫn dùng Supabase (chưa migrate)
        (async () => {
            const { data } = await supabase.from('test_results').select('*').order('created_at', { ascending: false });
            const results = (data ?? []) as TestResult[];
            if (results.length > 0) setLastTest(results[0]);
            const ranked: Level[] = ['C2', 'C1', 'B2', 'B1', 'A2', 'A1'];
            const best = results
                .slice()
                .sort((a, b) => ranked.indexOf(a.level as Level) - ranked.indexOf(b.level as Level) || b.score - a.score)[0];
            if (best) setBestLevel({ level: best.level as Level, score: best.score, total: best.total });
        })();
    }, []);

    const totalPrivateWords = topics
        .reduce((sum, t) => sum + t.word_count, 0);
    console.log('topics: ', topics);
    console.log('totalPrivateWords: ', totalPrivateWords);
    // Debug logs removed; use browser console if further inspection is needed

    return (
        <section className="anim-fade-up">
            {/* Hero */}
            <div className="relative overflow-hidden rounded-3xl border border-border bg-gradient-to-br from-ink to-brand-900 p-7 text-white shadow-card-hover sm:p-10">
                <div className="absolute -right-16 -top-16 h-56 w-56 rounded-full bg-brand-500/20 blur-3xl" />
                <div className="absolute -bottom-20 -left-10 h-56 w-56 rounded-full bg-brand-400/10 blur-3xl" />
                <div className="relative">
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1 text-xs font-semibold text-brand-100">
                        <TrendingUp size={13} /> Học tiếng Anh thông minh
                    </span>
                    <h1 className="mt-3 font-display text-3xl font-bold leading-tight tracking-tight sm:text-4xl">
                        Tra cứu. Lưu từ. Học chủ đề.<br className="hidden sm:block" /> Kiểm tra trình độ.
                    </h1>
                    <p className="mt-3 max-w-xl text-sm leading-relaxed text-white/70">
                        LexiFlow biến việc học từ vựng thành hành trình cá nhân hoá — tạo chủ đề riêng, học flashcard ghi nhớ sâu, và đo trình độ theo chuẩn CEFR.
                    </p>
                    <div className="mt-6 flex flex-wrap gap-2.5">
                        <button
                            onClick={() => onNavigate('search')}
                            className="flex items-center gap-2 rounded-xl bg-white px-4 py-2.5 text-sm font-bold text-ink transition hover:bg-brand-50"
                        >
                            <Search size={16} /> Tra từ vựng
                        </button>
                        <button
                            onClick={() => onNavigate('test')}
                            className="flex items-center gap-2 rounded-xl bg-white/10 px-4 py-2.5 text-sm font-bold text-white backdrop-blur transition hover:bg-white/15"
                        >
                            <Brain size={16} /> Kiểm tra trình độ
                        </button>
                    </div>
                </div>
            </div>

            {/* Stats */}
            <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
                <StatCard icon={BookOpen} label="Từ vựng" value={String(totalPrivateWords)} hint="số từ đã lưu" tone="brand" />
                <StatCard icon={Layers} label="Chủ đề" value={String(topics.length)} hint="cá nhân" tone="emerald" />
                <StatCard icon={Target} label="Từ đã lưu" value={String(totalPrivateWords)} hint="trong chủ đề private" tone="amber" />
                <StatCard
                    icon={GraduationCap}
                    label="Trình độ"
                    value={bestLevel?.level ?? '—'}
                    hint={bestLevel ? `${bestLevel.score}/${bestLevel.total} đúng` : 'chưa kiểm tra'}
                    tone="violet"
                />
            </div>

            {/* Quick actions */}
            <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <ActionCard
                    icon={Search}
                    title="Tra từ vựng"
                    desc="Tìm kiếm và lưu từ mới"
                    onClick={() => onNavigate('search')}
                />
                <ActionCard
                    icon={Layers}
                    title="Chủ đề cá nhân"
                    desc="Quản lý bộ từ của bạn"
                    onClick={() => onNavigate('topics')}
                />
                <ActionCard
                    icon={GraduationCap}
                    title="Học flashcard"
                    desc="Lật thẻ ghi nhớ từ"
                    onClick={() => onNavigate('study')}
                />
                <ActionCard
                    icon={Brain}
                    title="Kiểm tra trình độ"
                    desc="Chẩn đoán CEFR"
                    onClick={() => onNavigate('test')}
                />
            </div>

            {/* Last test summary */}
            {lastTest && (
                <div className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-2">
                    <div className="rounded-2xl border border-border bg-surface p-5 shadow-soft">
                        <div className="flex items-center justify-between">
                            <h3 className="font-display text-base font-bold">Lần kiểm tra gần nhất</h3>
                            <button onClick={() => onNavigate('test')} className="text-xs font-medium text-brand-600 hover:underline">
                                Xem tất cả
                            </button>
                        </div>
                        {(() => {
                            const lv = lastTest.level as Level;
                            const s = LEVEL_STYLES[lv];
                            const pct = Math.round((lastTest.score / lastTest.total) * 100);
                            return (
                                <div className="mt-4 flex items-center gap-4">
                                    <div className={`grid h-16 w-16 shrink-0 place-items-center rounded-2xl ${s.bg} ${s.text}`}>
                                        <span className="font-display text-xl font-bold">{lv}</span>
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-sm font-semibold">
                                            {lastTest.score}/{lastTest.total} đúng · {pct}%
                                        </p>
                                        <p className="text-xs text-muted">{LEVEL_LABELS[lv]}</p>
                                        <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-ink/[0.06]">
                                            <div className={`h-full ${s.dot}`} style={{ width: `${pct}%` }} />
                                        </div>
                                    </div>
                                </div>
                            );
                        })()}
                    </div>

                    <div className="rounded-2xl border border-border bg-surface p-5 shadow-soft">
                        <h3 className="font-display text-base font-bold">Chủ đề nổi bật</h3>
                        <div className="mt-3 space-y-2">
                            {topics.slice(0, 3).map((t) => (
                                <button
                                    key={t.id}
                                    onClick={() => onNavigate('topics')}
                                    className="flex w-full items-center justify-between rounded-xl border border-border bg-canvas px-3.5 py-2.5 text-left transition hover:border-brand-200"
                                >
                                    <span className="truncate text-sm font-medium">{t.name}</span>
                                    <span className="flex shrink-0 items-center gap-1.5 text-xs text-muted">
                                        {t.word_count} từ <ArrowRight size={13} />
                                    </span>
                                </button>
                            ))}
                            {topics.length === 0 && (
                                <p className="py-4 text-center text-xs text-muted">Chưa có chủ đề nào. Tạo chủ đề để bắt đầu học.</p>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </section>
    );
}

function StatCard({
    icon: Icon,
    label,
    value,
    hint,
    tone,
}: {
    icon: typeof Search;
    label: string;
    value: string;
    hint: string;
    tone: 'brand' | 'emerald' | 'amber' | 'violet';
}) {
    const tones = {
        brand: 'bg-brand-50 text-brand-500',
        emerald: 'bg-emerald-50 text-emerald-500',
        amber: 'bg-amber-50 text-amber-500',
        violet: 'bg-violet-50 text-violet-500',
    };
    return (
        <div className="rounded-2xl border border-border bg-surface p-4 shadow-soft transition hover:shadow-card">
            <div className={`grid h-9 w-9 place-items-center rounded-lg ${tones[tone]}`}>
                <Icon size={17} />
            </div>
            <p className="mt-3 font-display text-2xl font-bold leading-none">{value}</p>
            <p className="mt-1 text-xs font-medium text-muted">{label}</p>
            <p className="text-[11px] text-muted/70">{hint}</p>
        </div>
    );
}

function ActionCard({
    icon: Icon,
    title,
    desc,
    onClick,
}: {
    icon: typeof Search;
    title: string;
    desc: string;
    onClick: () => void;
}) {
    return (
        <button
            onClick={onClick}
            className="group rounded-2xl border border-border bg-surface p-5 text-left shadow-soft transition hover:-translate-y-0.5 hover:border-brand-200 hover:shadow-card-hover"
        >
            <div className="flex items-center justify-between">
                <span className="grid h-10 w-10 place-items-center rounded-xl bg-ink text-white transition group-hover:bg-brand-500">
                    <Icon size={18} />
                </span>
                <ArrowRight size={16} className="text-muted transition group-hover:translate-x-1 group-hover:text-brand-600" />
            </div>
            <p className="mt-3 font-display text-base font-bold">{title}</p>
            <p className="mt-0.5 text-xs text-muted">{desc}</p>
        </button>
    );
}
