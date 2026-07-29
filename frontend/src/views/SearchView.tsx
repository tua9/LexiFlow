import { useEffect, useState } from 'react';
import type { FormEvent } from 'react';
import { CheckCircle2, Search, X } from 'lucide-react';
import { useVocabSearch } from '../hooks/useVocabularies';
import PublicTopicCard from '../components/topics/PublicTopicCard';
import PublicTopicModal from '../components/topics/PublicTopicModal';
import { useTopics } from '../hooks/useTopics';
import { DictionaryPanel } from '../components/vocabulary/DictionaryPanel';
import { AddToTopicModal } from '../components/topics/AddToTopicModal';
import { usePublicTopics } from '../hooks/useTopics';
import { useViewStore } from '../store/useViewStore';
import type { Vocab, DictEntry, Topic } from '../types';

// ── External dictionary API ────────────────────────────────────────────────────
async function fetchDictionary(word: string): Promise<DictEntry | null> {
    try {
        const [mainRes, audioRes] = await Promise.all([
            fetch(`https://dictionary-api.eliaschen.dev/api/dictionary/en/${encodeURIComponent(word)}`),
            fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${encodeURIComponent(word)}`),
        ]);
        if (!mainRes.ok) return null;
        const data = await mainRes.json();
        if (!data?.word) return null;
        const entry = data as DictEntry;
        if (audioRes.ok) {
            const audioData = await audioRes.json();
            const audioUrl = audioData?.[0]?.phonetics?.find((p: { audio?: string }) => p.audio)?.audio ?? '';
            if (audioUrl) entry.audioUrl = audioUrl;
        }
        return entry;
    } catch {
        return null;
    }
}

async function fetchTranslation(text: string): Promise<string | null> {
    try {
        const response = await fetch(
            `https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=vi&dt=t&q=${encodeURIComponent(text)}`
        );
        if (!response.ok) return null;
        const body = await response.json();
        return Array.isArray(body?.[0]) && typeof body[0][0]?.[0] === 'string'
            ? String(body[0][0][0]).trim()
            : null;
    } catch {
        return null;
    }
}

// ── View ──────────────────────────────────────────────────────────────────────
export function SearchView() {
    const { query, setQuery } = useVocabSearch();
    const { topics, loading: loadingTopics, refetch: refetchTopics, copyPublicTopic } = useTopics();
    const [inputValue, setInputValue] = useState(query);
    const activeTopicId = useViewStore((state) => state.activeTopicId);
    const setActiveTopicId = useViewStore((state) => state.setActiveTopicId);

    const [copyingTopicId, setCopyingTopicId] = useState<string | null>(null);
    const [copyFeedback, setCopyFeedback] = useState<string | null>(null);
    const [publicDetailTopic, setPublicDetailTopic] = useState<Topic | null>(null);

    const activeTopic = activeTopicId ? topics.find((t) => t.id === activeTopicId) : null;

    // Keep input synced when query is changed externally.
    useEffect(() => {
        setInputValue(query);
    }, [query]);

    const { data: publicTopics = [], isLoading: publicTopicsLoading } = usePublicTopics();

    async function handleCopyPublicTopic(topicId: string) {
        setCopyingTopicId(topicId);
        setCopyFeedback(null);
        try {
            await copyPublicTopic(topicId);
            setCopyFeedback('Đã sao chép chủ đề vào danh sách của bạn.');
        } catch {
            setCopyFeedback('Không thể sao chép chủ đề này lúc này.');
        } finally {
            setCopyingTopicId(null);
        }
    }

    // ── Dictionary lookup ────────────────────────────────────────────────────
    const [dictEntry, setDictEntry] = useState<DictEntry | null>(null);
    const [dictLoading, setDictLoading] = useState(false);

    useEffect(() => {
        const trimmed = query.trim();
        if (!trimmed || /\s/.test(trimmed) || /[^a-zA-Z'-]/.test(trimmed)) {
            setDictEntry(null);
            return;
        }
        setDictLoading(true);
        let cancelled = false;
        const timer = setTimeout(async () => {
            const data = await fetchDictionary(trimmed);
            if (!cancelled) {
                setDictEntry(data);
                setDictLoading(false);
            }
        }, 400);
        return () => { cancelled = true; clearTimeout(timer); setDictEntry(null); setDictLoading(false); };
    }, [query]);

    useEffect(() => {
        if (!dictEntry || dictEntry.wordTranslation?.trim()) return;

        const word = dictEntry.word;
        let active = true;
        async function translateWord() {
            const translation = await fetchTranslation(word);
            if (!active) return;
            setDictEntry((previous) =>
                previous && previous.word === word
                    ? { ...previous, wordTranslation: translation ?? undefined }
                    : previous,
            );
        }

        translateWord();
        return () => {
            active = false;
        };
    }, [dictEntry]);

    function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setQuery(inputValue.trim());
    }

    function handleClear() {
        setInputValue('');
        setQuery('');
        setDictEntry(null);
    }

    // ── Add to topic ─────────────────────────────────────────────────────────
    const [pickedWord, setPickedWord] = useState<Vocab | null>(null);
    const [dictAdding, setDictAdding] = useState(false);

    function handleDictAdd() {
        if (!dictEntry) return;
        setDictAdding(true);
        const pron = dictEntry.pronunciation?.find((p) => p.lang === 'us') ?? dictEntry.pronunciation?.[0];
        const firstDef = dictEntry.definition?.[0];
        setPickedWord({
            id: 'dict-' + Date.now(),
            word: dictEntry.word,
            phonetic: pron?.pron ?? '',
            pos: dictEntry.pos?.[0] ?? '',
            meaning: firstDef?.text ?? '',
            example: firstDef?.example?.[0]?.text ?? '',
            level: 'A1',
            audioUrl: dictEntry.audioUrl,
            created_at: new Date().toISOString(),
        } as Vocab);
        setDictAdding(false);
    }

    return (
        <section className="anim-fade-up">
            {/* Header */}
            <div className="mb-6">
                <h1 className="font-display text-2xl font-bold tracking-tight sm:text-3xl">Tra từ vựng</h1>
                <p className="mt-1 text-sm text-muted">
                    Tìm từ trong từ điển và lưu vào chủ đề cá nhân để học.
                </p>
            </div>

            {/* Active topic banner */}
            {activeTopic && (
                <div className="mb-4 flex items-center justify-between gap-3 rounded-xl border border-brand-200 bg-brand-50 px-4 py-3">
                    <p className="text-sm text-brand-900">
                        Đang thêm từ vào chủ đề{' '}
                        <span className="font-semibold">{activeTopic.name}</span>
                    </p>
                    <button
                        onClick={() => setActiveTopicId(null)}
                        className="shrink-0 rounded-lg px-2.5 py-1 text-xs font-semibold text-brand-700 transition hover:bg-brand-100"
                    >
                        Bỏ chọn
                    </button>
                </div>
            )}

            {/* Search bar + level filter */}
            <div className="mb-5">
                <form onSubmit={handleSubmit} className="relative">
                    <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted" />
                    <input
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        placeholder="Nhập từ tiếng Anh hoặc nghĩa tiếng Việt..."
                        className="w-full rounded-xl border border-border bg-surface px-11 py-3 pr-14 text-sm shadow-soft outline-none transition placeholder:text-muted focus:border-brand-300 focus:ring-4 focus:ring-brand-50"
                    />
                    {inputValue && (
                        <button
                            type="button"
                            onClick={handleClear}
                            className="absolute right-11 top-1/2 -translate-y-1/2 grid h-6 w-6 place-items-center rounded-md text-muted hover:bg-ink/[0.06]"
                        >
                            <X size={15} />
                        </button>
                    )}
                    <button
                        type="submit"
                        className="absolute right-3 top-1/2 -translate-y-1/2 grid h-8 w-8 place-items-center rounded-md bg-brand-500 text-white shadow-sm transition hover:bg-brand-600"
                        aria-label="Tra từ"
                    >
                        <Search size={15} />
                    </button>
                </form>
            </div>


            {/* Dictionary panel */}
            {(dictLoading || dictEntry) && (
                <DictionaryPanel
                    entry={dictEntry}
                    loading={dictLoading}
                    onAdd={handleDictAdd}
                    adding={dictAdding}
                />
            )}


            {/* Messages */}
            {!query ? (
                <div className="rounded-2xl border border-border bg-surface p-6 text-sm text-muted mb-5">
                    Nhập một từ tiếng Anh vào thanh tìm kiếm để tra cứu.
                </div>
            ) : null}


            {/* Public topics */}
            <PublicTopics
                publicTopics={publicTopics}
                publicTopicsLoading={publicTopicsLoading}
                copyFeedback={copyFeedback}
                copyingTopicId={copyingTopicId}
                onCopyPublicTopic={handleCopyPublicTopic}
                onDetail={(t) => setPublicDetailTopic(t)}
            />

            {/* Add to topic modal */}
            <AddToTopicModal
                word={pickedWord}
                topics={topics}
                activeTopicId={activeTopicId}
                loadingTopics={loadingTopics}
                dictEntry={dictEntry}
                onClose={() => setPickedWord(null)}
                onAdded={() => { refetchTopics(); setPickedWord(null); }}
                onCreatedTopic={refetchTopics}
            />
            <PublicTopicModal topic={publicDetailTopic} onClose={() => setPublicDetailTopic(null)} />
        </section>
    );
}

function PublicTopics({
    publicTopics,
    publicTopicsLoading,
    copyFeedback,
    copyingTopicId,
    onCopyPublicTopic,
    onDetail,
}: {
    publicTopics: Topic[];
    publicTopicsLoading: boolean;
    copyFeedback: string | null;
    copyingTopicId: string | null;
    onCopyPublicTopic: (topicId: string) => void | Promise<void>;
    onDetail: (topic: Topic) => void;
}) {
    return (
        <div className="mb-6 rounded-2xl border border-border bg-surface p-4 shadow-soft">
            <div className="mb-3 flex items-center justify-between gap-3">
                <div>
                    <h2 className="text-sm font-semibold text-ink">Chủ đề công khai</h2>
                    <p className="text-xs text-muted">Sao chép topic public vào kho riêng của bạn để học tiếp.</p>
                </div>
            </div>

            {copyFeedback && (
                <div className="mb-3 flex items-center gap-2 rounded-lg border border-success-200 bg-success-50 px-3 py-2 text-sm text-success-700">
                    <CheckCircle2 size={15} />
                    <span>{copyFeedback}</span>
                </div>
            )}

            {publicTopicsLoading ? (
                <div className="space-y-2">
                    {Array.from({ length: 3 }).map((_, i) => (
                        <div key={i} className="h-12 animate-pulse rounded-xl bg-ink/[0.04]" />
                    ))}
                </div>
            ) : publicTopics.length === 0 ? (
                <p className="text-sm text-muted">Chưa có topic công khai nào được chia sẻ.</p>
            ) : (
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {publicTopics.map((topic) => (
                        <PublicTopicCard key={topic.id} topic={topic} copying={copyingTopicId === topic.id} onCopy={onCopyPublicTopic} onDetail={onDetail} />
                    ))}
                </div>
            )}
        </div>
    );
}
