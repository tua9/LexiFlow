import { useQuery } from '@tanstack/react-query';
import { Modal } from '../Modal';
import { vocabularyApi } from '../../api';
import type { Topic } from '../../types';
import { LevelBadge } from '../LevelBadge';
import { Search } from 'lucide-react';

interface Props {
  topic: Topic | null;
  onClose: () => void;
}

export function PublicTopicModal({ topic, onClose }: Props) {
  const { data: words = [], isLoading: loading } = useQuery({
    queryKey: ['vocabularies', topic?.id],
    queryFn: () => vocabularyApi.getByTopic(topic!.id),
    enabled: !!topic?.id,
  });

  return (
    <Modal open={!!topic} onClose={onClose} title={topic ? topic.name : 'Topic'} size="lg">
      {topic && (
        <div>
          {topic.description && <p className="mb-4 text-sm text-muted">{topic.description}</p>}

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
              <p className="mt-1 text-xs text-muted">Bạn có thể copy chủ đề này để bắt đầu thêm từ.</p>
            </div>
          ) : (
            <div className="space-y-2">
              {words.map((w) => (
                <div key={w.id} className="group flex items-center justify-between gap-3 rounded-xl border border-border bg-surface px-3.5 py-2.5">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="truncate font-display text-sm font-bold">{w.word}</span>
                      <LevelBadge level={w.level} />
                    </div>
                    <p className="truncate text-xs text-muted">{w.meaning}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </Modal>
  );
}

export default PublicTopicModal;
