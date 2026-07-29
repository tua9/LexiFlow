import { useState } from 'react';
import { Plus, Volume2, Loader2 } from 'lucide-react';
import type { DictEntry } from '../../types';

interface DictionaryPanelProps {
    entry: DictEntry | null;
    loading: boolean;
    onAdd: () => void;
    adding: boolean;
}

/** Panel hiển thị kết quả tra từ điển ngoài (eliaschen.dev). */
export function DictionaryPanel({ entry, loading, onAdd, adding }: DictionaryPanelProps) {
    const [playing, setPlaying] = useState(false);

    async function handlePlay(word: string, audioUrl?: string) {
        if (audioUrl) {
            try {
                setPlaying(true);
                const audio = new Audio(audioUrl);
                audio.onended = () => setPlaying(false);
                audio.onerror = () => {
                    setPlaying(false);
                    speakFallback(word);
                };
                await audio.play();
                return;
            } catch {
                setPlaying(false);
            }
        }
        speakFallback(word);
    }

    function speakFallback(word: string) {
        if (!window.speechSynthesis) return;
        window.speechSynthesis.cancel();
        const utt = new SpeechSynthesisUtterance(word);
        utt.lang = 'en-US';
        utt.rate = 0.9;
        window.speechSynthesis.speak(utt);
    }

    if (loading) {
        return (
            <div className="mb-5 flex items-center gap-2 rounded-2xl border border-border bg-surface p-4 text-sm text-muted">
                <Loader2 size={16} className="animate-spin" /> Đang tra từ điển...
            </div>
        );
    }

    if (!entry) return null;

    const pron = entry.pronunciation?.find((p) => p.lang === 'us') ?? entry.pronunciation?.[0];

    // Deduplicate + group definitions theo part-of-speech
    const seen = new Set<string>();
    const defs = (entry.definition ?? []).filter((d) => {
        if (seen.has(d.text)) return false;
        seen.add(d.text);
        return true;
    });
    const grouped = defs.reduce<Record<string, typeof defs>>((acc, d) => {
        (acc[d.pos] ??= []).push(d);
        return acc;
    }, {});
    const wordTranslation = entry.wordTranslation?.trim();
    const hasVietnamese = Boolean(wordTranslation);

    return (
        <div className="mb-5 rounded-2xl border border-brand-200 bg-gradient-to-br from-brand-50 to-surface p-5 shadow-soft anim-fade-up">
            {/* Header */}
            <div className="mb-3 flex items-center gap-3">
                <div>
                    <h2 className="font-display text-xl font-bold">{entry.word}</h2>
                    {pron?.pron && <span className="font-mono text-sm text-muted">{pron.pron}</span>}
                </div>

                <button
                    onClick={() => handlePlay(entry.word, entry.audioUrl)}
                    disabled={playing}
                    className="grid h-7 w-7 place-items-center rounded-lg bg-brand-100 text-brand-600 transition hover:bg-brand-500 hover:text-white disabled:opacity-60"
                    title={entry.audioUrl ? 'Phát âm (giọng thật)' : 'Phát âm'}
                >
                    {playing ? <Loader2 size={14} className="animate-spin" /> : <Volume2 size={14} />}
                </button>

                <button
                    onClick={onAdd}
                    disabled={adding}
                    className="ml-auto flex items-center gap-1.5 rounded-lg bg-brand-500 px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-brand-600 disabled:opacity-60"
                >
                    {adding ? <Loader2 size={13} className="animate-spin" /> : <Plus size={13} />}
                    Thêm vào chủ đề
                </button>
            </div>
            <div className="mb-4 rounded-xl bg-brand-50 px-4 py-3 text-sm text-brand-700">
                {hasVietnamese ? (
                    <>
                        <span className="font-semibold">Meaning:</span>{' '}
                        {wordTranslation}
                    </>
                ) : (
                    'Không tìm thấy nghĩa tiếng Việt trong nguồn tra từ điển hiện tại.'
                )}
            </div>

            {/* Definitions grouped by POS */}
            <div className="space-y-3">
                {Object.entries(grouped)
                    .slice(0, 3)
                    .map(([pos, items]) => (
                        <div key={pos}>
                            <span className="mb-1.5 inline-block rounded bg-brand-100 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-brand-700">
                                {pos}
                            </span>
                            <ul className="space-y-1.5">
                                {items.slice(0, 3).map((d) => (
                                    <li key={d.id} className="text-sm">
                                        <span className="font-medium">{d.text}</span>
                                        {d.example?.[0]?.text && (
                                            <p className="mt-1 italic text-muted">
                                                — "{d.example[0].text}"
                                                {d.example[0].translation ? (
                                                    <span className="ml-1 text-[11px] text-muted/80">
                                                        ({d.example[0].translation})
                                                    </span>
                                                ) : null}
                                            </p>
                                        )}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
            </div>
        </div>
    );
}
