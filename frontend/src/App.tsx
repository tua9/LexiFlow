import { useEffect, useState } from 'react';
import { SearchView } from './views/SearchView';
import { TopicsView } from './views/TopicsView';
import { StudyView } from './views/StudyView';
import { TestView } from './views/TestView';
import { DashboardView } from './views/DashboardView';
import keycloak from './keycloak';
import { Header, MobileNav } from './components/ui/Header';
import { UserProfileModal } from './components/UserProfileModal';
// import { useUserProfile } from './hooks/useUserProfile';
import { useViewStore } from './store/useViewStore';
import { AdminView } from './components/admin/AdminView';
import { getTokenPayload } from './utils/jwtHelper';
import { useUserDetail, useUsers } from './hooks/useUser';
import type { View } from './types';


const STORAGE_KEYS = {
  view: 'learningapp:view',
  activeTopicId: 'learningapp:activeTopicId',
  studyTopicId: 'learningapp:studyTopicId',
};

export default function App() {
  console.log('Keycloak token:', keycloak.token);

  const view = useViewStore((state) => state.view);
  const setView = useViewStore((state) => state.setView);
  const studyTopicId = useViewStore((state) => state.studyTopicId);
  const setStudyTopicId = useViewStore((state) => state.setStudyTopicId);
  const activeTopicId = useViewStore((state) => state.activeTopicId);
  const setActiveTopicId = useViewStore((state) => state.setActiveTopicId);

  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const openProfile = () => setIsProfileOpen(true);
  const closeProfile = () => setIsProfileOpen(false);


  const tokenPayload = getTokenPayload();
  const { updateUser } = useUsers();
  const { data: user } = useUserDetail(tokenPayload?.sub);
  console.log("User Detail:", user)


  useEffect(() => {
    if (typeof window === 'undefined') return;
    const storedView = (window.localStorage.getItem(STORAGE_KEYS.view) as View) ?? 'dashboard';
    const storedActiveTopicId = window.localStorage.getItem(STORAGE_KEYS.activeTopicId);
    const storedStudyTopicId = window.localStorage.getItem(STORAGE_KEYS.studyTopicId);

    setView(storedView);
    setActiveTopicId(storedActiveTopicId);
    setStudyTopicId(storedStudyTopicId);
  }, [setView, setActiveTopicId, setStudyTopicId]);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    window.localStorage.setItem(STORAGE_KEYS.view, view);
    if (activeTopicId) {
      window.localStorage.setItem(STORAGE_KEYS.activeTopicId, activeTopicId);
    } else {
      window.localStorage.removeItem(STORAGE_KEYS.activeTopicId);
    }
    if (studyTopicId) {
      window.localStorage.setItem(STORAGE_KEYS.studyTopicId, studyTopicId);
    } else {
      window.localStorage.removeItem(STORAGE_KEYS.studyTopicId);
    }
  }, [view, activeTopicId, studyTopicId]);



  function go(next: View, opts?: { topicId?: string }) {
    if (opts?.topicId !== undefined) {
      if (next === 'study') setStudyTopicId(opts.topicId);
      if (next === 'search') setActiveTopicId(opts.topicId);
    } else {
      if (next !== 'search') {
        setActiveTopicId(null);
      }
      if (next !== 'study') {
        setStudyTopicId(null);
      }
    }
    setView(next);
    if (typeof window !== 'undefined') window.scrollTo({ top: 0 });
  }


  return (
    <div className="min-h-screen bg-canvas text-ink">
      <Header
        view={view}
        onNavigate={go}
        fullName={user?.firstname + ' ' + user?.lastname}
        avatarUrl={user?.urlAvatar}
        onOpenProfile={openProfile}
      />
      <main className="mx-auto w-full max-w-6xl px-4 pb-24 pt-6 sm:px-6 lg:px-8">
        {view === 'dashboard' && <DashboardView onNavigate={go} />}
        {view === 'search' && <SearchView />}
        {view === 'topics' && (
          <TopicsView
            onStudy={(id) => go('study', { topicId: id })}
            onAddWords={(id) => go('search', { topicId: id })}
          />
        )}
        {view === 'study' && <StudyView onPickTopic={() => go('topics')} />}
        {view === 'test' && <TestView />}
        {view === 'admin' && <AdminView />}
      </main>
      <MobileNav view={view} onNavigate={go} />
      {isProfileOpen && <UserProfileModal
        open={isProfileOpen}
        onClose={closeProfile}
        profile={user}
        onSave={updateUser}
      />}
    </div>
  );
}
