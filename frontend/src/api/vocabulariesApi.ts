import type { VocabDTO, Vocab } from '../types';
import { translate } from '../utils/translate';
import api from './client';

// ── DTOs ──────────────────────────────────────────────────────────────────────

export type CreateVocabPayload = {
    word: string;
    wordType: string;
    meaning: string;
    sampleSentence: string;
    pronunciation: string;
    audioUrl: string;
    level?: string;
    urlImage?: string;
    urlSound?: string;
};

// ── API Object ────────────────────────────────────────────────────────────────

export const vocabularyApi = {
    // GET danh sách từ vựng của một topic
    getByTopic: async (topicId: string): Promise<Vocab[]> => {
        const res = await api.get(`/topics/${topicId}/vocabularies`);
        const payload = res.data;
        const items: VocabDTO[] = Array.isArray(payload)
            ? payload
            : (payload?.vocabularies ?? payload?.items ?? []);
        return items.map(vocabularyApi.mapDTO);
    },

    // POST tạo từ vựng mới
    create: async (payload: CreateVocabPayload, topicId?: string): Promise<VocabDTO> => {
        const translatedMeaning = await translate(payload.word);
        const res = await api.post('/vocabularies', {
            word: payload.word,
            wordType: payload.wordType,
            pronunciation: payload.pronunciation,
            meaning: translatedMeaning,
            sampleSentence: payload.sampleSentence,
            level: payload.level ?? 'A1',
            urlImage: payload.urlImage ?? '',
            urlSound: payload.urlSound ?? payload.audioUrl ?? '',
            topicId: topicId ? Number(topicId) : undefined,
        });
        return (res.data ?? res) as VocabDTO;
    },

    // POST thêm từ vựng đã có vào topic
    addToTopic: async (topicId: string, vocabularyId: string): Promise<void> => {
        await api.post(`/topics/${topicId}/vocabularies`, { vocabularyId });
    },

    // POST tạo từ vựng + gắn vào topic (compound operation)
    post: async (topicId: string, payload: CreateVocabPayload): Promise<void> => {
        const vocabulary = await vocabularyApi.create(payload, topicId);
        await vocabularyApi.addToTopic(topicId, String(vocabulary.id));
    },

    // DELETE xóa từ vựng
    delete: async (id: string): Promise<void> => {
        await api.delete(`/vocabularies/${id}`);
    },

    // Utility: map VocabDTO → Vocab cho UI
    mapDTO: (dto: VocabDTO): Vocab => ({
        id: String(dto.id),
        word: dto.word ?? '',
        phonetic: dto.pronunciation ?? '',
        pos: dto.wordType ?? '',
        meaning: dto.meaning ?? '',
        example: dto.sampleSentence ?? '',
        level: 'A1',
        audioUrl: dto.audioUrl ?? '',
        topicTitle: dto.topicTitle ?? dto.topic_name,
        topicId: dto.topicId ?? dto.topic_id,
        created_at: dto.createdAt ?? '',
    }),
};