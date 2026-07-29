import { create } from 'zustand';
import type { Vocab } from '../types';

type VocabStoreState = {
  vocabs: Vocab[];
  vocabLoading: boolean;
  query: string;
};

type VocabStoreActions = {
  setVocabs: (vocabs: Vocab[]) => void;
  setVocabLoading: (loading: boolean) => void;
  setQuery: (query: string) => void;
};

export type VocabStore = VocabStoreState & VocabStoreActions;

export const useVocabStore = create<VocabStore>((set) => ({
  vocabs: [],
  vocabLoading: false,
  query: '',
  setVocabs: (vocabs) => set({ vocabs }),
  setVocabLoading: (vocabLoading) => set({ vocabLoading }),
  setQuery: (query) => set({ query }),
}));
