import React from 'react';
import { Users, BarChart3, Award, UserCheck, GraduationCap, Loader2 } from 'lucide-react';
import { type UserProfileDTO } from '../../../types/admin';
import { UserAvatar } from '../components/UserAvatar';
import { LEVEL_ORDER, getLevelColor, LEVEL_BACKGROUNDS } from '../constants/levels';
import { calculateStats } from '../../../utils/adminHelpers';

interface DashboardTabProps {
  users: UserProfileDTO[];
  loading: boolean;
}

export const DashboardTab: React.FC<DashboardTabProps> = ({ users, loading }) => {
  const stats = calculateStats(users);

  const statItems = [
    {
      label: 'Tổng học viên',
      value: loading ? '...' : stats.total,
      icon: Users,
      iconBg: 'bg-brand-50',
      iconColor: 'text-brand-500',
      sub: 'Đã đăng ký',
      subColor: 'text-brand-600',
    },
    {
      label: 'Học viên C1/C2',
      value: loading ? '...' : stats.advanced,
      icon: Award,
      iconBg: 'bg-purple-50',
      iconColor: 'text-purple-500',
      sub: 'Trình độ cao',
      subColor: 'text-purple-600',
    },
    {
      label: 'Cấp độ đa dạng',
      value: loading ? '...' : Object.values(stats.levels).filter((v) => v > 0).length,
      icon: BarChart3,
      iconBg: 'bg-amber-50',
      iconColor: 'text-amber-500',
      sub: 'CEFR levels',
      subColor: 'text-amber-600',
    },
    {
      label: 'Mới nhất',
      value: loading ? '...' : stats.recent.length,
      icon: UserCheck,
      iconBg: 'bg-emerald-50',
      iconColor: 'text-emerald-500',
      sub: 'Gần đây',
      subColor: 'text-emerald-600',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Hero Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-brand-600 to-blue-900 p-6 text-white shadow-xl">
        <div className="absolute right-0 top-0 translate-x-10 -translate-y-10 opacity-10">
          <GraduationCap size={200} />
        </div>
        <div className="relative z-10 space-y-2 max-w-xl">
          <span className="inline-block rounded-full bg-white/20 px-3 py-1 text-xs font-semibold uppercase tracking-wider border border-white/10">
            English Proficiency Manager
          </span>
          <h2 className="text-2xl font-bold md:text-3xl">
            Quản lý, Theo dõi và Phát triển hành trình học của học viên!
          </h2>
          <p className="text-sm text-blue-100/90 leading-relaxed">
            Kiểm tra tiến độ CEFR, theo dõi xu hướng học tập cá nhân và quản lý tài khoản người dùng
            trong hệ thống.
          </p>
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {statItems.map((stat) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.label}
              className="rounded-2xl border border-border bg-surface p-5 shadow-soft hover:shadow-md transition-all"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-muted">
                  {stat.label}
                </span>
                <div className={`rounded-xl ${stat.iconBg} p-2.5 ${stat.iconColor}`}>
                  <Icon size={18} />
                </div>
              </div>
              <div className="mt-4 flex items-baseline gap-2">
                <span className="text-3xl font-bold tracking-tight text-ink">{stat.value}</span>
                <span className={`text-xs font-semibold ${stat.subColor}`}>{stat.sub}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* CEFR Distribution + Recent Users */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Level Distribution */}
        <div className="rounded-2xl border border-border bg-surface p-5 shadow-soft lg:col-span-2">
          <div className="border-b border-border pb-4 mb-5">
            <h3 className="font-bold text-ink">Phân bổ cấp độ CEFR</h3>
            <p className="text-xs text-muted mt-0.5">Số lượng học viên theo từng cấp độ tiếng Anh</p>
          </div>
          {loading ? (
            <div className="flex items-center justify-center h-40 text-muted">
              <Loader2 className="animate-spin mr-2" size={18} /> Đang tải...
            </div>
          ) : (
            <div className="space-y-3">
              {LEVEL_ORDER.map((level) => {
                const count = stats.levels[level] ?? 0;
                const pct = users.length > 0 ? (count / users.length) * 100 : 0;
                const c = getLevelColor(level);
                return (
                  <div key={level} className="flex items-center gap-3">
                    <span
                      className={`w-10 text-center text-xs font-bold rounded-lg px-1.5 py-0.5 border ${c.bg} ${c.text} ${c.border} flex-shrink-0`}
                    >
                      {level}
                    </span>
                    <div className="flex-1 h-2.5 bg-ink/[0.06] rounded-full overflow-hidden">
                      <div
                        className="h-full transition-all duration-700"
                        style={{
                          width: `${pct}%`,
                          background: LEVEL_BACKGROUNDS[level] || '#94a3b8',
                        }}
                      />
                    </div>
                    <span className="w-16 text-right text-xs font-semibold text-muted">
                      {count} người ({pct.toFixed(0)}%)
                    </span>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Recent Users */}
        <div className="rounded-2xl border border-border bg-surface p-5 shadow-soft">
          <div className="border-b border-border pb-4 mb-5">
            <h3 className="font-bold text-ink">Học viên gần đây</h3>
            <p className="text-xs text-muted mt-0.5">Mới đăng ký hệ thống</p>
          </div>
          {loading ? (
            <div className="flex items-center justify-center h-32 text-muted">
              <Loader2 className="animate-spin" size={18} />
            </div>
          ) : stats.recent.length === 0 ? (
            <p className="text-center text-muted text-sm py-8">Chưa có học viên nào.</p>
          ) : (
            <div className="space-y-3">
              {stats.recent.map((u) => {
                const c = getLevelColor(u.level);
                return (
                  <div
                    key={u.userId || u.id}
                    className="flex items-center gap-3 rounded-xl hover:bg-ink/[0.03] p-2 transition-colors"
                  >
                    <UserAvatar user={u} size="sm" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-ink truncate">
                        {u.firstname} {u.lastname}
                      </p>
                      <p className="text-xs text-muted truncate">{u.email}</p>
                    </div>
                    <span
                      className={`text-[10px] font-bold rounded-full px-2 py-0.5 border ${c.bg} ${c.text} ${c.border}`}
                    >
                      {u.level || '—'}
                    </span>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};