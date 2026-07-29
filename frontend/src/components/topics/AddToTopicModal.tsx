import { useEffect, useState } from 'react';
import { Check, ChevronRight, Plus, Loader2 } from 'lucide-react';
import { Modal } from '../Modal';
import { TOPIC_COLORS } from '../../lib/theme';
import { vocabularyApi } from '../../api';
import { useQueryClient } from '@tanstack/react-query';
import { useTopics } from '../../hooks/useTopics';
import type { Vocab, Topic } from '../../types';
import type { DictEntry } from '../../types';

interface AddToTopicModalProps {
    /** Từ đang được thêm (null = modal đóng). */
    word: Vocab | null;
    topics: Topic[];
    activeTopicId?: string | null;
    loadingTopics: boolean;
    /** Dict entry để lấy audioUrl khi postVocabulary. */
    dictEntry?: DictEntry | null;
    onClose: () => void;
    onAdded: () => void;
    onCreatedTopic: () => void;
}

const COLOR_KEYS = TOPIC_COLORS.map((c) => c.key);
const DOT_BG: Record<string, string> = Object.fromEntries(
    TOPIC_COLORS.map((c) => [c.key, c.bg]),
);
function dotColor(key: string) {
    const map: Record<string, string> = {
        blue: 'bg-blue-500',
        emerald: 'bg-emerald-500',
        amber: 'bg-amber-500',
        rose: 'bg-rose-500',
        violet: 'bg-violet-500',
        cyan: 'bg-cyan-500',
    };
    return map[key] ?? 'bg-blue-500';
}

/**
 * Modal thêm từ vựng vào chủ đề.
 * Tự fetch trạng thái "đã thêm" và gọi postVocabulary khi user chọn topic.
 */
export function AddToTopicModal({
    word,
    topics,
    activeTopicId,
    loadingTopics,
    dictEntry,
    onClose,
    onAdded,
    onCreatedTopic,
}: AddToTopicModalProps) {
    const queryClient = useQueryClient();
    const { createTopic } = useTopics({ autoFetch: false });
    const [added, setAdded] = useState<Record<string, boolean>>({});
    const [submitting, setSubmitting] = useState<string | null>(null);
    const [creating, setCreating] = useState(false);
    const [newName, setNewName] = useState('');
    const [newColor, setNewColor] = useState(COLOR_KEYS[0]);
    const [creatingError, setCreatingError] = useState('');
    const [savingNew, setSavingNew] = useState(false);

    // Reset + tính "đã thêm" khi word thay đổi
    useEffect(() => {
        console.log("word la : ", word)
        if (!word) {
            setCreating(false);
            setNewName('');
            setCreatingError('');
            setAdded({});
            return;
        }
        setAdded({});
        setCreating(false);
        setCreatingError('');

        (async () => {
            try {
                const topicChecks = await Promise.allSettled(
                    topics.map((topic) => vocabularyApi.getByTopic(topic.id)),
                );
                const map: Record<string, boolean> = {};
                topicChecks.forEach((result, index) => {
                    if (result.status !== 'fulfilled') return;
                    const topic = topics[index];
                    if (!topic) return;
                    const exists = result.value.some((v) => v.word.toLowerCase() === word.word.toLowerCase());
                    if (exists) map[topic.id] = true;
                });
                setAdded(map);
            } catch (err) {
                console.error('[AddToTopicModal] fetch added state:', err);
            }
        })();
    }, [word, topics]);

    async function addTo(topicId: string) {
        if (!word || added[topicId]) return;
        const topic = topics.find((t) => t.id === topicId);
        if (!topic) return;

        setSubmitting(topicId);
        try {
            await vocabularyApi.post(topicId, {
                word: word.word,
                wordType: word.pos ?? '',
                meaning: word.meaning ?? '',
                sampleSentence: word.example ?? '',
                pronunciation: word.phonetic ?? '',
                audioUrl: dictEntry?.audioUrl ?? word.audioUrl ?? '',
            });
            setAdded((p) => ({ ...p, [topicId]: true }));

            // Invalidate topics and vocabularies list
            void queryClient.invalidateQueries({ queryKey: ['topics'] });
            void queryClient.invalidateQueries({ queryKey: ['vocabularies', topicId] });
            onAdded();
        } catch (err) {
            console.error('[AddToTopicModal] addTo:', err);
        } finally {
            setSubmitting(null);
        }
    }

    async function createAndAdd() {
        if (!word || !newName.trim()) {
            setCreatingError('Vui lòng nhập tên chủ đề');
            return;
        }
        setSavingNew(true);
        setCreatingError('');
        try {
            const created = await createTopic({ name: newName.trim() });
            await vocabularyApi.post(created.id, {
                word: word.word,
                wordType: word.pos ?? '',
                meaning: word.meaning ?? '',
                sampleSentence: word.example ?? '',
                pronunciation: word.phonetic ?? '',
                audioUrl: dictEntry?.audioUrl ?? word.audioUrl ?? '',
            });

            // Invalidate topics and vocabularies list
            void queryClient.invalidateQueries({ queryKey: ['topics'] });
            onCreatedTopic();
            setAdded((p) => ({ ...p, [created.id]: true }));
            setNewName('');
            setCreating(false);
        } catch {
            setCreatingError('Không thể tạo chủ đề. Vui lòng thử lại.');
        } finally {
            setSavingNew(false);
        }
    }

    const sortedTopics = activeTopicId
        ? [...topics].sort((a, b) => {
            if (a.id === activeTopicId) return -1;
            if (b.id === activeTopicId) return 1;
            return 0;
        })
        : topics;

    const anyAdded = Object.values(added).some(Boolean);

    return (
        <Modal open={!!word} onClose={onClose} title="Thêm vào chủ đề" size="sm">
            {word && (
                <div>
                    {/* Word preview */}
                    <div className="mb-4 rounded-xl bg-brand-50 p-3.5">
                        <div className="flex items-center gap-2">
                            <span className="font-display text-base font-bold">{word.word}</span>
                            {word.phonetic && (
                                <span className="font-mono text-xs text-muted">{word.phonetic}</span>
                            )}
                        </div>
                        <p className="mt-0.5 text-sm font-medium text-brand-800">{word.meaning}</p>
                    </div>

                    {creating ? (
                        /* ── Tạo chủ đề mới inline ── */
                        <div className="space-y-3 rounded-xl border border-border bg-canvas p-4">
                            <p className="text-xs font-semibold text-muted">Tạo chủ đề mới</p>
                            <input
                                autoFocus
                                value={newName}
                                onChange={(e) => { setNewName(e.target.value); setCreatingError(''); }}
                                onKeyDown={(e) => e.key === 'Enter' && createAndAdd()}
                                placeholder="Tên chủ đề, VD: Du lịch"
                                className="w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm outline-none focus:border-brand-300 focus:ring-4 focus:ring-brand-50"
                            />
                            <div className="flex flex-wrap gap-1.5">
                                {COLOR_KEYS.map((c) => (
                                    <button
                                        key={c}
                                        onClick={() => setNewColor(c)}
                                        className={`h-7 w-7 rounded-full ${DOT_BG[c]} ${newColor === c ? 'ring-2 ring-ink ring-offset-2' : ''}`}
                                    />
                                ))}
                            </div>
                            {creatingError && (
                                <p className="text-xs font-medium text-error-600">{creatingError}</p>
                            )}
                            <div className="flex justify-end gap-2">
                                <button
                                    onClick={() => { setCreating(false); setCreatingError(''); }}
                                    className="rounded-lg px-3 py-1.5 text-xs font-semibold text-muted transition hover:bg-ink/[0.06]"
                                >
                                    Hủy
                                </button>
                                <button
                                    onClick={createAndAdd}
                                    disabled={savingNew}
                                    className="rounded-lg bg-brand-500 px-4 py-1.5 text-xs font-semibold text-white transition hover:bg-brand-600 disabled:opacity-50"
                                >
                                    {savingNew ? 'Đang tạo...' : 'Tạo & Thêm'}
                                </button>
                            </div>
                        </div>
                    ) : loadingTopics ? (
                        <div className="space-y-2">
                            {Array.from({ length: 3 }).map((_, i) => (
                                <div key={i} className="h-11 animate-pulse rounded-xl bg-ink/[0.04]" />
                            ))}
                        </div>
                    ) : topics.length === 0 ? (
                        <div className="py-4 text-center">
                            <p className="mb-3 text-sm text-muted">Bạn chưa có chủ đề nào.</p>
                            <button
                                onClick={() => setCreating(true)}
                                className="flex items-center gap-1.5 rounded-lg bg-ink px-4 py-2 text-sm font-medium text-white transition hover:opacity-90"
                            >
                                <Plus size={15} /> Tạo chủ đề đầu tiên
                            </button>
                        </div>
                    ) : (
                        <>
                            <div className="mb-2 text-xs font-semibold text-muted">
                                Chọn chủ đề cần thêm vào
                            </div>
                            <div className="space-y-1.5">
                                {sortedTopics.map((t) => {
                                    const inIt = added[t.id];
                                    const isSubmitting = submitting === t.id;
                                    const isActive = t.id === activeTopicId;
                                    return (
                                        <button
                                            key={t.id}
                                            onClick={() => addTo(t.id)}
                                            disabled={!!inIt || isSubmitting}
                                            className={`flex w-full items-center justify-between rounded-xl border px-3.5 py-2.5 text-left transition disabled:opacity-70 ${isActive
                                                ? 'border-brand-300 bg-brand-50 hover:border-brand-400'
                                                : 'border-border bg-surface hover:border-brand-200'
                                                }`}
                                        >
                                            <span className="flex items-center gap-2.5">
                                                <span className={`h-2.5 w-2.5 rounded-full ${dotColor(t.color)}`} />
                                                <span className="text-sm font-medium">{t.name}</span>
                                                {isActive && (
                                                    <span className="rounded-full bg-brand-100 px-2 py-0.5 text-[10px] font-semibold text-brand-700">
                                                        Đang chọn
                                                    </span>
                                                )}
                                            </span>
                                            {inIt ? (
                                                <span className="flex items-center gap-1 rounded-lg bg-success-50 px-3 py-1.5 text-xs font-semibold text-success-700">
                                                    <Check size={13} /> Đã thêm
                                                </span>
                                            ) : isSubmitting ? (
                                                <span className="flex items-center gap-1 rounded-lg bg-ink/[0.06] px-3 py-1.5 text-xs font-semibold text-muted">
                                                    <Loader2 size={13} className="animate-spin" /> Đang thêm...
                                                </span>
                                            ) : (
                                                <span className="flex items-center gap-1 rounded-lg bg-ink px-3 py-1.5 text-xs font-semibold text-white">
                                                    <Plus size={13} /> Thêm
                                                </span>
                                            )}
                                        </button>
                                    );
                                })}
                            </div>
                            <button
                                onClick={() => setCreating(true)}
                                className="mt-3 flex w-full items-center justify-center gap-1.5 rounded-xl border border-dashed border-border py-2.5 text-xs font-semibold text-muted transition hover:border-brand-200 hover:text-brand-600"
                            >
                                <Plus size={14} /> Tạo chủ đề mới
                            </button>
                        </>
                    )}

                    {anyAdded && (
                        <button
                            onClick={onAdded}
                            className="mt-4 flex w-full items-center justify-center gap-1.5 rounded-xl bg-brand-500 py-3 text-sm font-semibold text-white transition hover:bg-brand-600"
                        >
                            Xong <ChevronRight size={16} />
                        </button>
                    )}
                </div>
            )}
        </Modal>
    );
}
