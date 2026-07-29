// ── API Objects ───────────────────────────────────────────────────────────────
export { topicApi } from './topicsApi';
export type { CreateTopicDTO, UpdateTopicDTO } from './topicsApi';

export { vocabularyApi } from './vocabulariesApi';
export type { CreateVocabPayload } from './vocabulariesApi';

export { userApi } from './userApi';

// ── Re-exports for backward compat ─────────────────────────────────────────────
export { topicApi as default } from './topicsApi';
export { default as apiClient } from './client';
