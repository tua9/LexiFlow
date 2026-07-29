import type { TopicDTO, Topic } from '../types';
import api from './client';

// ── DTOs ──────────────────────────────────────────────────────────────────────

export type CreateTopicDTO = {
    name: string;
    description?: string;
    color?: string;
    isPublic?: boolean;
    userId: string;
};

export type UpdateTopicDTO = {
    name?: string;
    color?: string;
    isPublic?: boolean;
    description?: string;
};

// ── API Object ────────────────────────────────────────────────────────────────

export const topicApi = {
    // GET topics của một user
    getUserTopics: async (userId: string): Promise<TopicDTO[]> => {
        const res = await api.get(`/users/${userId}/topics`);
        return res.data as TopicDTO[];
    },

    // GET topics công khai
    getPublicTopics: async (): Promise<TopicDTO[]> => {
        const res = await api.get('/topics/public');
        return res.data as TopicDTO[];
    },

    // POST duplicate topic công khai vào user
    duplicate: async (topicId: string, userId: string): Promise<TopicDTO> => {
        const res = await api.post(`/topics/${topicId}/duplicate`, {
            userId,
            isPublic: false,
        });
        return res.data as TopicDTO;
    },

    // POST tạo topic mới
    create: async (data: CreateTopicDTO): Promise<TopicDTO> => {
        const res = await api.post('/topics', data);
        return res.data as TopicDTO;
    },

    // PUT cập nhật topic
    update: async (topicId: string, data: UpdateTopicDTO): Promise<TopicDTO> => {
        const res = await api.put(`/topics/${topicId}`, data);
        return res.data as TopicDTO;
    },

    // DELETE xóa topic
    delete: async (topicId: string): Promise<void> => {
        await api.delete(`/topics/${topicId}`);
    },

    // Utility: map TopicDTO → Topic cho UI
    mapDTO: (dto: TopicDTO, wordCount = 0): Topic => ({
        id: dto.id,
        name: dto.title ?? dto.name ?? 'Untitled topic',
        description: dto.description ?? '',
        color: dto.color ?? 'blue',
        created_at: dto.createdAt ?? new Date().toISOString(),
        word_count: wordCount,
        is_public: dto.isPublic ?? false,
    }),
};
