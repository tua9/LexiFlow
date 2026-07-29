import { useCallback, useMemo, useState } from 'react';
import { shuffle } from '../lib/theme';
import type { Vocab } from '../types';

type KnownState = 'unknown' | 'known' | 'learning';

/**
 * Hook quản lý toàn bộ session học flashcard.
 * StudyView chỉ cần bind các handlers này vào UI.
 */
export function useStudySession(initialWords: Vocab[]) {
    const [words, setWords] = useState<Vocab[]>(initialWords);
    const [index, setIndex] = useState(0);
    const [flipped, setFlipped] = useState(false);
    const [states, setStates] = useState<Record<string, KnownState>>({});

    // Sync khi initialWords thay đổi (topic mới được chọn)
    const reset = useCallback((newWords: Vocab[]) => {
        setWords(newWords);
        setIndex(0);
        setFlipped(false);
        setStates({});
    }, []);

    const progress = useMemo(() => {
        if (!words.length) return 0;
        const known = Object.values(states).filter((s) => s === 'known').length;
        return Math.round((known / words.length) * 100);
    }, [words, states]);

    const current = words[index];

    const flip = useCallback(() => setFlipped((f) => !f), []);

    const next = useCallback(() => {
        if (index < words.length - 1) {
            setIndex((i) => i + 1);
            setFlipped(false);
        }
    }, [index, words.length]);

    const prev = useCallback(() => {
        if (index > 0) {
            setIndex((i) => i - 1);
            setFlipped(false);
        }
    }, [index]);

    const mark = useCallback(
        (state: KnownState, afterMark?: () => void) => {
            if (current) setStates((p) => ({ ...p, [current.id]: state }));
            setFlipped(false);
            if (afterMark) setTimeout(afterMark, 250);
        },
        [current],
    );

    const shuffleCards = useCallback(() => {
        setWords((w) => shuffle(w));
        setIndex(0);
        setFlipped(false);
    }, []);

    return {
        words,
        current,
        index,
        flipped,
        flip,
        next,
        prev,
        mark,
        shuffleCards,
        progress,
        states,
        reset,
        total: words.length,
    };
}
