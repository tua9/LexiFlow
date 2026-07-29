import { useEffect, useState } from 'react';
import { Modal } from '../Modal';
import { TOPIC_COLORS } from '../../lib/theme';
import { useTopics } from '../../hooks/useTopics';

interface CreateTopicModalProps {
    open: boolean;
    onClose: () => void;
    onCreated: () => void;
}

function CheckMark() {
    return (
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path d="M3 7L6 10L11 4" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    );
}

/** Modal tạo chủ đề mới — gọi API và notify parent khi xong. */
export function CreateTopicModal({ open, onClose, onCreated }: CreateTopicModalProps) {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [isPublic, setIsPublic] = useState(false);
    const [color, setColor] = useState(TOPIC_COLORS[0].key);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');
    const { createTopic } = useTopics({ autoFetch: false });

    useEffect(() => {
        if (open) {
            setName('');
            setDescription('');
            setIsPublic(false);
            setColor(TOPIC_COLORS[0].key);
            setError('');
        }
    }, [open]);

    async function submit() {
        if (!name.trim()) {
            setError('Vui lòng nhập tên chủ đề');
            return;
        }
        setSaving(true);
        try {
            await createTopic({ name: name.trim(), color, isPublic, description: description.trim() });
            onCreated();
            onClose();
        } catch {
            setError('Không thể tạo chủ đề. Vui lòng thử lại.');
        } finally {
            setSaving(false);
        }
    }

    return (
        <Modal open={open} onClose={onClose} title="Tạo chủ đề mới" size="sm">
            <div className="space-y-4">
                <div>
                    <label className="mb-1.5 block text-xs font-semibold text-muted">Tên chủ đề</label>
                    <input
                        autoFocus
                        value={name}
                        onChange={(e) => { setName(e.target.value); setError(''); }}
                        onKeyDown={(e) => e.key === 'Enter' && submit()}
                        placeholder="VD: Từ vựng công việc"
                        className="w-full rounded-xl border border-border bg-surface px-3.5 py-2.5 text-sm shadow-soft outline-none transition focus:border-brand-300 focus:ring-4 focus:ring-brand-50"
                    />
                </div>

                <div className="grid gap-4">
                    <div className="flex items-center justify-between gap-4">
                        <div>
                            <label className="mb-2 block text-xs font-semibold text-muted">Công khai</label>
                            <p className="text-xs text-muted">Chia sẻ chủ đề với người dùng khác.</p>
                        </div>
                        <button
                            type="button"
                            onClick={() => setIsPublic((current) => !current)}
                            className={`rounded-full border px-3.5 py-2 text-xs font-semibold transition ${isPublic ? 'border-brand-500 bg-brand-500 text-white' : 'border-border bg-surface text-muted hover:bg-ink/[0.06]'}`}
                        >
                            {isPublic ? 'Public' : 'Private'}
                        </button>
                    </div>
                    <label className="mb-2 block text-xs font-semibold text-muted">Mô tả</label>
                    <textarea
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        rows={3}
                        placeholder="Mô tả ngắn về chủ đề"
                        className="w-full rounded-2xl border border-border bg-surface px-3.5 py-2.5 text-sm shadow-soft outline-none transition focus:border-brand-300 focus:ring-4 focus:ring-brand-50"
                    />
                </div>

                <div>
                    <label className="mb-2 block text-xs font-semibold text-muted">Màu sắc</label>
                    <div className="flex flex-wrap gap-2">
                        {TOPIC_COLORS.map((c) => (
                            <button
                                key={c.key}
                                onClick={() => setColor(c.key)}
                                className={`grid h-9 w-9 place-items-center rounded-lg ${c.bg} text-white ring-offset-2 transition ${color === c.key ? 'ring-2 ring-ink' : ''}`}
                                title={c.key}
                            >
                                {color === c.key ? <CheckMark /> : null}
                            </button>
                        ))}
                    </div>
                </div>

                {error && (
                    <p className="rounded-lg bg-error-50 px-3 py-2 text-xs font-medium text-error-600">
                        {error}
                    </p>
                )}

                <div className="flex justify-end gap-2 pt-1">
                    <button
                        onClick={onClose}
                        className="rounded-xl px-4 py-2.5 text-sm font-semibold text-muted transition hover:bg-ink/[0.06]"
                    >
                        Hủy
                    </button>
                    <button
                        onClick={submit}
                        disabled={saving}
                        className="rounded-xl bg-brand-500 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-brand-600 disabled:opacity-50"
                    >
                        {saving ? 'Đang tạo...' : 'Tạo chủ đề'}
                    </button>
                </div>
            </div>
        </Modal>
    );
}
