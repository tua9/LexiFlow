// Re-export từ hooks/ để giữ backward compatibility.
// Các file mới nên import trực tiếp từ '../hooks/useTopics'.
export { useTopics } from '../hooks/useTopics';
export type { Topic as TopicWithCount } from '../types';
