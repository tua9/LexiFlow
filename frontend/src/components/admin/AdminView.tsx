import React, { useState } from 'react';
import { ShieldAlert, LayoutDashboard, Users, BarChart3 } from 'lucide-react';
import keycloak from '../../keycloak';
import { DashboardTab } from './tabs/DashboardTab';
import { UsersTab } from './tabs/UsersTab';
import { AnalyticsTab } from './tabs/AnalyticsTab';
import { useUsers } from './hook/useUsers';

type AdminTab = 'dashboard' | 'users' | 'analytics';

const TABS: { id: AdminTab; label: string; icon: typeof LayoutDashboard }[] = [
  { id: 'dashboard', label: 'Tổng quan', icon: LayoutDashboard },
  { id: 'users', label: 'Học viên', icon: Users },
  { id: 'analytics', label: 'Thống kê', icon: BarChart3 },
];

export const AdminView: React.FC = () => {
  const isAdmin = keycloak.hasRealmRole('ROLE_ADMIN');
  const [tab, setTab] = useState<AdminTab>('dashboard');
  const { users, loading, handleAdd, handleUpdate, handleDelete } = useUsers(isAdmin);

  if (!isAdmin) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <ShieldAlert size={64} className="text-red-500 mb-4" />
        <h2 className="text-2xl font-bold text-ink">Không có quyền truy cập</h2>
        <p className="text-muted mt-2">Bạn cần có quyền quản trị viên để xem trang này.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-display font-bold text-ink">Quản trị hệ thống</h1>
          <p className="text-sm text-muted mt-0.5">
            Quản lý học viên, theo dõi tiến trình và thống kê CEFR.
          </p>
        </div>
        <div className="flex items-center gap-2 rounded-xl border border-border bg-surface p-1 shadow-soft w-fit">
          {TABS.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setTab(id)}
              className={`flex items-center gap-2 rounded-lg px-3.5 py-2 text-sm font-medium transition-all ${
                tab === id
                  ? 'bg-ink text-white shadow-soft'
                  : 'text-muted hover:bg-ink/[0.06] hover:text-ink'
              }`}
            >
              <Icon size={15} />
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      {tab === 'dashboard' && <DashboardTab users={users} loading={loading} />}
      {tab === 'users' && (
        <UsersTab
          users={users}
          loading={loading}
          onAdd={handleAdd}
          onUpdate={handleUpdate}
          onDelete={handleDelete}
        />
      )}
      {tab === 'analytics' && <AnalyticsTab users={users} loading={loading} />}
    </div>
  );
};