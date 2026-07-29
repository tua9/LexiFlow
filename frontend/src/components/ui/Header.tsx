import { GraduationCap, Search, Layers, Brain, BarChart3, Users } from 'lucide-react';
import keycloak from '../../keycloak';
import type { View } from '../../types';

const NAV: { id: View; label: string; icon: typeof Search }[] = [
  { id: 'dashboard', label: 'Tổng quan', icon: BarChart3 },
  { id: 'search', label: 'Tra từ vựng', icon: Search },
  { id: 'topics', label: 'Chủ đề cá nhân', icon: Layers },
  { id: 'study', label: 'Học flashcard', icon: GraduationCap },
  { id: 'test', label: 'Kiểm tra trình độ', icon: Brain },
];

interface HeaderProps {
  view: View;
  onNavigate: (v: View) => void;
  fullName: string;
  avatarUrl?: string;
  onOpenProfile: () => void;
}

export function Header({ view, onNavigate, fullName, avatarUrl, onOpenProfile }: HeaderProps) {
  console.log("123 " + avatarUrl);
  return (
    <header className="sticky top-0 z-30 border-b border-border bg-canvas/85 backdrop-blur-md">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
        <button onClick={() => onNavigate('dashboard')} className="flex items-center gap-2.5">
          <span className="grid h-9 w-9 place-items-center rounded-xl bg-brand-500 text-white shadow-soft">
            <GraduationCap size={20} />
          </span>
          <span className="hidden font-display text-lg font-bold tracking-tight sm:block">
            Lexi<span className="text-brand-600">Flow</span>
          </span>
        </button>
        <nav className="hidden items-center gap-1 md:flex">
          {[...NAV, ...(keycloak.hasRealmRole('ROLE_ADMIN') ? [{ id: 'admin' as View, label: 'Quản lý', icon: Users }] : [])].map((item) => {
            const Icon = item.icon;
            const active = view === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onNavigate(item.id)}
                className={`flex items-center gap-2 rounded-full px-3.5 py-2 text-sm font-medium transition ${active ? 'bg-ink text-white shadow-soft' : 'text-muted hover:bg-ink/[0.06] hover:text-ink'
                  }`}
              >
                <Icon size={16} />
                {item.label}
              </button>
            );
          })}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onOpenProfile}
              className="group rounded-full border border-border bg-surface text-sm font-medium text-muted transition hover:bg-ink/[0.06]"
            >
              {avatarUrl ? (
                <img
                  src={avatarUrl}
                  alt={fullName}
                  className="h-8 w-8 rounded-full object-cover"
                />
              ) : (
                <span className="px-2 py-1.5">{fullName}</span>
              )}
            </button>
            <button
              onClick={() => keycloak.logout({ redirectUri: window.location.origin })}
              className="rounded-full border border-border bg-surface px-3.5 py-2 text-sm font-medium text-ink transition hover:border-ink hover:bg-ink/5"
            >
              Logout
            </button>
          </div>
        </nav>
      </div>
    </header>
  );
}

interface MobileNavProps {
  view: View;
  onNavigate: (v: View) => void;
}

export function MobileNav({ view, onNavigate }: MobileNavProps) {
  return (
    <nav className="fixed inset-x-0 bottom-0 z-30 border-t border-border bg-surface/95 backdrop-blur-md md:hidden">
      <div className="mx-auto flex w-full max-w-6xl items-stretch justify-between px-1">
        {[...NAV, ...(keycloak.hasRealmRole('ROLE_ADMIN') ? [{ id: 'admin' as View, label: 'Quản lý', icon: Users }] : [])].map((item) => {
          const Icon = item.icon;
          const active = view === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`flex flex-1 flex-col items-center gap-0.5 py-2.5 text-[11px] font-medium transition ${active ? 'text-brand-600' : 'text-muted'
                }`}
            >
              <Icon size={18} strokeWidth={active ? 2.5 : 2} />
              <span className="leading-tight">{item.label.split(' ')[0]}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
