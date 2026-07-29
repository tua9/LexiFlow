import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { vocabularyApi } from '../api/vocabulariesApi';
import { useVocabStore } from '../store/useVocabStore';
import type { CreateVocabPayload } from '../api/vocabulariesApi';
import type { Vocab } from '../types';

// ── Query Keys ────────────────────────────────────────────────────────────────

export const VOCAB_QUERY_KEYS = {
    all: ['vocabularies'] as const,
    byTopic: (topicId: string) => [...VOCAB_QUERY_KEYS.all, 'topic', topicId] as const,
} as const;

// ── Hook quản lý search state (SearchView) ────────────────────────────────────

export function useVocabSearch() {
    const query = useVocabStore((state) => state.query);
    const setQuery = useVocabStore((state) => state.setQuery);
    return { query, setQuery };
}

// ── Hook chính: từ vựng theo topic ───────────────────────────────────────────

export function useVocabularies(topicId?: string) {
    const queryClient = useQueryClient();

    // 1. GET: Danh sách từ vựng theo topic
    const {
        data: vocabularies = [],
        isLoading,
        error,
        refetch,
    } = useQuery({
        queryKey: VOCAB_QUERY_KEYS.byTopic(topicId ?? ''),
        queryFn: () => vocabularyApi.getByTopic(topicId!),
        enabled: !!topicId,
        staleTime: 2 * 60 * 1000,
    });

    // 2. POST: Tạo từ vựng và gắn vào topic
    const {
        mutateAsync: addVocabularyMutation,
        isPending: isAdding,
        error: addError,
    } = useMutation({
        mutationFn: ({
            payload,
            targetTopicId,
        }: {
            payload: CreateVocabPayload;
            targetTopicId: string;
        }) => vocabularyApi.post(targetTopicId, payload),
        onSuccess: (_, { targetTopicId }) => {
            queryClient.invalidateQueries({
                queryKey: VOCAB_QUERY_KEYS.byTopic(targetTopicId),
            });
        },
        onError: (err) => {
            console.error('[useVocabularies] Failed to add vocabulary:', err);
        },
    });

    // 3. DELETE: Xóa từ vựng
    const {
        mutateAsync: deleteVocabularyMutation,
        isPending: isDeleting,
        error: deleteError,
    } = useMutation({
        mutationFn: (id: string) => vocabularyApi.delete(id),
        onSuccess: (_, deletedId) => {
            if (topicId) {
                // Optimistic update: xóa khỏi cache ngay
                queryClient.setQueryData<Vocab[]>(
                    VOCAB_QUERY_KEYS.byTopic(topicId),
                    (old) => old?.filter((v) => v.id !== deletedId) ?? [],
                );
            }
        },
        onError: (err) => {
            console.error('[useVocabularies] Failed to delete vocabulary:', err);
        },
    });

    return {
        // Data
        vocabularies,

        // Loading states
        isLoading,
        isAdding,
        isDeleting,

        // Errors
        error,
        addError,
        deleteError,

        // Mutations
        addVocabulary: addVocabularyMutation,
        deleteVocabulary: deleteVocabularyMutation,

        // Utilities
        refetch,
    };
}
