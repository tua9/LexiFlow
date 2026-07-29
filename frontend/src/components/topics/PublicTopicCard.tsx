import type { Topic } from '../../types';
import { Copy, Loader2, Layers } from 'lucide-react';
import { getTopicColor } from '../../lib/theme';

interface Props {
  topic: Topic;
  copying?: boolean;
  onCopy: (id: string) => void | Promise<void>;
  onDetail?: (topic: Topic) => void;
}

export function PublicTopicCard({ topic, copying, onCopy, onDetail }: Props) {
  const c = getTopicColor(topic.color);

  const created = topic.created_at ? new Date(topic.created_at).toLocaleDateString() : '-';

  return (
    <article className="anim-fade-up h-full overflow-hidden rounded-2xl border border-border bg-canvas shadow-soft transition hover:-translate-y-0.5 hover:shadow-card-hover">
      <div className={`relative h-1.5 ${c.bg}`} />
      <div className="p-4 flex h-full flex-col">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-start gap-3 min-w-0">
            <span className={`grid h-10 w-10 place-items-center rounded-xl ${c.bg} text-white`}>
              <Layers size={16} />
            </span>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <h3 className="truncate font-display text-sm font-semibold text-ink">{topic.name}</h3>
                <span className={`inline-flex items-center gap-2 rounded-full px-2 py-0.5 text-xs font-semibold ${topic.is_public ? 'border border-success-200 bg-success-50 text-success-700' : 'border border-border bg-surface text-muted'}`}>
                  {topic.is_public ? 'Public' : 'Private'}
                </span>
              </div>
              <p className="mt-2 text-xs text-muted line-clamp-3">{topic.description || 'Chủ đề công khai để học từ vựng.'}</p>
            </div>
          </div>

          <div className="flex-shrink-0 text-right">
            <span className={`rounded-full ${c.soft} ${c.text} px-2 py-0.5 text-[12px] font-semibold`}>{topic.word_count} từ</span>
          </div>
        </div>

        <div className="mt-auto flex items-center justify-between gap-3 pt-4">
          <p className="text-xs text-muted">Tạo: {created}</p>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => onDetail && onDetail(topic)}
              className="rounded-lg px-2 py-1 text-xs font-semibold text-muted transition hover:bg-ink/[0.06] hover:text-ink"
            >
              Chi tiết
            </button>
            <button
              type="button"
              onClick={() => void onCopy(topic.id)}
              disabled={!!copying}
              className="flex shrink-0 items-center gap-2 whitespace-nowrap rounded-xl bg-brand-500 px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-brand-600 disabled:opacity-70 disabled:cursor-not-allowed"
              aria-label={copying ? 'Đang sao chép' : 'Sao chép vào của tôi'}
            >
              {copying ? <><Loader2 size={13} className="animate-spin" /> Đang sao chép...</> : <><Copy size={13} /> Copy</>}
            </button>
          </div>
        </div>
      </div>
    </article>
  );
}

export default PublicTopicCard;
