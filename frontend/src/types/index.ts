// ── Domain types ──────────────────────────────────────────────────────────────
// Single source of truth cho tất cả business types trong app.

export type View = 'dashboard' | 'search' | 'topics' | 'study' | 'test' | 'admin';

export type Level = 'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'C2';

export const LEVELS: Level[] = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'];


export type UserProfile = {
    id: string;
    userId: string;
    firstname: string;
    lastname: string;
    email: string;
    urlAvatar: string;
    level: Level | string;
};

export const LEVEL_LABELS: Record<Level, string> = {
    A1: 'Sơ cấp 1',
    A2: 'Sơ cấp 2',
    B1: 'Trung cấp 1',
    B2: 'Trung cấp 2',
    C1: 'Cao cấp 1',
    C2: 'Cao cấp 2',
};

// ── Vocabulary ────────────────────────────────────────────────────────────────

/** Từ vựng như được trả về từ API backend (camelCase). */
export type VocabDTO = {
    id: string;
    word: string;
    wordType: string;
    meaning: string;
    sampleSentence: string;
    pronunciation: string;
    audioUrl?: string;
    topicTitle?: string;
    topicId?: string;
    topic_id?: string;
    topic_name?: string;
    createdAt?: string;
    updatedAt?: string;
};

/** Từ vựng đã được normalize để UI dùng. */
export type Vocab = {
    id: string;
    word: string;
    /** IPA notation, mapped từ `pronunciation` */
    phonetic: string;
    /** Part of speech, mapped từ `wordType` */
    pos: string;
    meaning: string;
    /** Câu ví dụ, mapped từ `sampleSentence` */
    example: string;
    level: Level;
    audioUrl?: string;
    topicTitle?: string;
    topicId?: string;
    created_at: string;
};

// ── Topic ─────────────────────────────────────────────────────────────────────

/** Topic như được trả về từ API backend. */
export type TopicDTO = {
    id: string;
    title?: string;
    name?: string;
    description?: string;
    color?: string;
    userId?: string;
    isPublic?: boolean;
    createdAt?: string;
    updatedAt?: string;
};

/** Topic đã normalize cho UI, bổ sung word_count. */
export type Topic = {
    id: string;
    name: string;
    description: string;
    color: string;
    created_at: string;
    word_count: number;
    user_id?: string;
    is_public?: boolean;
};

// ── Test ──────────────────────────────────────────────────────────────────────

export type AnswerRecord = {
    word_id: string;
    word: string;
    correct_meaning: string;
    chosen: string | null;
    is_correct: boolean;
};

export type TestResult = {
    id: string;
    score: number;
    total: number;
    level: Level;
    answers: AnswerRecord[];
    created_at: string;
};

// ── Dictionary API (external: eliaschen.dev) ──────────────────────────────────

export type DictPronunciation = { lang: string; pron: string; url: string };

export type DictExample = { id: number; text: string; translation?: string };

export type DictDefinitionItem = {
    id: number;
    pos: string;
    text: string;
    translation?: string;
    autoTranslation?: string;
    example: DictExample[];
};

export type DictEntry = {
    word: string;
    pos: string[];
    pronunciation: DictPronunciation[];
    definition: DictDefinitionItem[];
    audioUrl?: string;
    wordTranslation?: string;
};
