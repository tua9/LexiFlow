import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useCallback } from 'react';
import { topicApi } from '../api/topicsApi';
import { vocabularyApi } from '../api/vocabulariesApi';
import { getTokenPayload } from '../utils/jwtHelper';
import type { Topic } from '../types';

// ── Query Keys ────────────────────────────────────────────────────────────────

export const TOPIC_QUERY_KEYS = {
    all: ['topics'] as const,
    user: (userId: string) => [...TOPIC_QUERY_KEYS.all, 'user', userId] as const,
    public: () => [...TOPIC_QUERY_KEYS.all, 'public'] as const,
    detail: (topicId: string) => [...TOPIC_QUERY_KEYS.all, topicId] as const,
} as const;

// ── Options ───────────────────────────────────────────────────────────────────

interface UseTopicsOptions {
    autoFetch?: boolean;
}

// ── Hook chính ────────────────────────────────────────────────────────────────

export function useTopics(options: UseTopicsOptions = {}) {
    const { autoFetch = true } = options;
    const queryClient = useQueryClient();
    const tokenPayload = getTokenPayload();
    const userId = tokenPayload?.sub ?? '';

    // 1. GET: Topics của user kèm word_count
    const {
        data: topics = [],
        isLoading,
        error,
        refetch,
    } = useQuery({
        queryKey: TOPIC_QUERY_KEYS.user(userId),
        queryFn: async () => {
            if (!userId) return [];
            const topicDTOs = await topicApi.getUserTopics(userId);
            const counts: Record<string, number> = {};

            const results = await Promise.allSettled(
                topicDTOs.map((t) => vocabularyApi.getByTopic(t.id)),
            );

            results.forEach((r, i) => {
                if (r.status === 'fulfilled') {
                    counts[topicDTOs[i].id] = r.value.length;
                }
            });

            return topicDTOs
                .map((dto) => topicApi.mapDTO(dto, counts[dto.id] ?? 0))
                .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
        },
        enabled: autoFetch && !!userId,
        staleTime: 2 * 60 * 1000,
    });

    // 2. POST: Tạo topic mới
    const {
        mutateAsync: createTopicMutation,
        isPending: isCreating,
        error: createError,
    } = useMutation({
        mutationFn: ({ name, color, isPublic, description }: {
            name: string;
            color?: string;
            isPublic?: boolean;
            description?: string;
        }) =>
            topicApi.create({ name, color, isPublic, description, userId }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: TOPIC_QUERY_KEYS.user(userId) });
        },
        onError: (err) => {
            console.error('[useTopics] Failed to create topic:', err);
        },
    });

    // 3. PUT: Cập nhật topic
    const {
        mutateAsync: updateTopicMutation,
        isPending: isUpdating,
        error: updateError,
    } = useMutation({
        mutationFn: ({ id, data }: {
            id: string;
            data: { name?: string; color?: string; isPublic?: boolean; description?: string };
        }) => topicApi.update(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: TOPIC_QUERY_KEYS.user(userId) });
        },
        onError: (err) => {
            console.error('[useTopics] Failed to update topic:', err);
        },
    });

    // 4. DELETE: Xóa topic
    const {
        mutateAsync: deleteTopicMutation,
        isPending: isDeleting,
        error: deleteError,
    } = useMutation({
        mutationFn: (id: string) => topicApi.delete(id),
        onSuccess: (_, deletedId) => {
            // Optimistic update: xóa khỏi cache ngay
            queryClient.setQueryData<Topic[]>(
                TOPIC_QUERY_KEYS.user(userId),
                (old) => old?.filter((t) => t.id !== deletedId) ?? [],
            );
        },
        onError: (err) => {
            console.error('[useTopics] Failed to delete topic:', err);
        },
    });

    // 5. POST: Duplicate (copy) public topic về user
    const {
        mutateAsync: copyPublicTopicMutation,
        isPending: isCopying,
        error: copyError,
    } = useMutation({
        mutationFn: (topicId: string) => topicApi.duplicate(topicId, userId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: TOPIC_QUERY_KEYS.user(userId) });
            queryClient.invalidateQueries({ queryKey: TOPIC_QUERY_KEYS.public() });
        },
        onError: (err) => {
            console.error('[useTopics] Failed to copy public topic:', err);
        },
    });

    // Utility
    const invalidateTopics = useCallback(
        () => queryClient.invalidateQueries({ queryKey: TOPIC_QUERY_KEYS.user(userId) }),
        [queryClient, userId],
    );

    return {
        // Data
        topics,

        // Loading states
        isLoading,
        isCreating,
        isUpdating,
        isDeleting,
        isCopying,

        // Errors
        error,
        createError,
        updateError,
        deleteError,
        copyError,

        // Mutations
        createTopic: createTopicMutation,
        updateTopic: updateTopicMutation,
        deleteTopic: deleteTopicMutation,
        copyPublicTopic: copyPublicTopicMutation,

        // Utilities
        refetch,
        invalidateTopics,

        // Backward compat alias
        loading: isLoading,
    };
}

// ── Hook cho public topics ────────────────────────────────────────────────────

export function usePublicTopics() {
    return useQuery({
        queryKey: TOPIC_QUERY_KEYS.public(),
        queryFn: async () => {
            const data = await topicApi.getPublicTopics();
            const results = await Promise.allSettled(
                data.map((dto) => vocabularyApi.getByTopic(dto.id)),
            );
            return data.map((dto, i) => {
                const count =
                    results[i]?.status === 'fulfilled'
                        ? (results[i] as PromiseFulfilledResult<unknown[]>).value.length
                        : 0;
                return topicApi.mapDTO(dto, count);
            });
        },
        staleTime: 5 * 60 * 1000,
    });
}
