import { create } from 'zustand';
import type { View } from '../types';

type ViewStoreState = {
  view: View;
  activeTopicId: string | null;
  studyTopicId: string | null;
};

type ViewStoreActions = {
  setView: (view: View) => void;
  setActiveTopicId: (topicId: string | null) => void;
  setStudyTopicId: (topicId: string | null) => void;
};

export type ViewStore = ViewStoreState & ViewStoreActions;

export const useViewStore = create<ViewStore>((set) => ({
  view: 'dashboard',
  activeTopicId: null,
  studyTopicId: null,
  setView: (view) => set({ view }),
  setActiveTopicId: (activeTopicId) => set({ activeTopicId }),
  setStudyTopicId: (studyTopicId) => set({ studyTopicId }),
}));
