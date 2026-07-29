import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type Vocab = {
    id: string;
    word: string;
    phonetic: string;
    pos: string;
    meaning: string;
    example: string;
    level: Level;
    created_at: string;
};

export type Topic = {
    id: string;
    name: string;
    description: string;
    color: string;
    created_at: string;
};

export type TopicWord = {
    id: string;
    topic_id: string;
    word_id: string;
    created_at: string;
};

export type TestResult = {
    id: string;
    score: number;
    total: number;
    level: Level;
    answers: AnswerRecord[];
    created_at: string;
};

export type Level = 'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'C2';

export type AnswerRecord = {
    word_id: string;
    word: string;
    correct_meaning: string;
    chosen: string | null;
    is_correct: boolean;
};

export const LEVELS: Level[] = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'];

export const LEVEL_LABELS: Record<Level, string> = {
    A1: 'Sơ cấp 1',
    A2: 'Sơ cấp 2',
    B1: 'Trung cấp 1',
    B2: 'Trung cấp 2',
    C1: 'Cao cấp 1',
    C2: 'Cao cấp 2',
};
