import React, { useMemo } from 'react';
import { Award, Loader2 } from 'lucide-react';
import { type UserProfileDTO } from '../../../types/admin';
import { UserAvatar } from '../components/UserAvatar';
import { LEVEL_ORDER, getLevelColor, LEVEL_BACKGROUNDS } from '../constants/levels';
import { getFullName } from '../../../utils/adminHelpers';

interface AnalyticsTabProps {
  users: UserProfileDTO[];
  loading: boolean;
}

export const AnalyticsTab: React.FC<AnalyticsTabProps> = ({ users, loading }) => {
  const levelCounts = useMemo(() => {
    const map: Record<string, number> = {};
    LEVEL_ORDER.forEach((l) => (map[l] = 0));
    users.forEach((u) => {
      if (u.level) map[u.level] = (map[u.level] ?? 0) + 1;
    });
    return map;
  }, [users]);

  const topUsers = useMemo(() => {
    return [...users]
      .filter((u) => u.level)
      .sort((a, b) => LEVEL_ORDER.indexOf(b.level) - LEVEL_ORDER.indexOf(a.level))
      .slice(0, 6);
  }, [users]);

  return (
    <div className="space-y-6">
      {/* Top stats row */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {LEVEL_ORDER.map((level) => {
          const count = levelCounts[level] ?? 0;
          const pct = users.length > 0 ? ((count / users.length) * 100).toFixed(1) : '0.0';
          const c = getLevelColor(level);
          return (
            <div key={level} className={`rounded-2xl border p-4 shadow-soft ${c.bg} ${c.border}`}>
              <div className="flex items-center justify-between mb-2">
                <span className={`text-xs font-bold uppercase tracking-wider ${c.text}`}>
                  CEFR {level}
                </span>
                <span className={`text-2xl font-bold ${c.text}`}>
                  {loading ? '...' : count}
                </span>
              </div>
              <div className="h-1.5 bg-white/50 rounded-full overflow-hidden">
                <div
                  className={`h-full ${c.text.replace('text-', 'bg-').replace('-700', '-400')}`}
                  style={{ width: `${pct}%` }}
                />
              </div>
              <p className={`text-[10px] font-semibold mt-1 ${c.text} opacity-70`}>
                {pct}% tổng số
              </p>
            </div>
          );
        })}
      </div>

      {/* Leaderboard */}
      <div className="rounded-2xl border border-border bg-surface p-5 shadow-soft">
        <div className="flex items-center justify-between border-b border-border pb-4 mb-5">
          <div>
            <h3 className="font-bold text-ink">Học viên trình độ cao nhất</h3>
            <p className="text-xs text-muted mt-0.5">Xếp hạng theo cấp độ CEFR hiện tại</p>
          </div>
          <span className="text-xs font-semibold text-emerald-600 flex items-center gap-1">
            <Award size={12} /> Top {topUsers.length}
          </span>
        </div>
        {loading ? (
          <div className="flex items-center justify-center py-10 text-muted">
            <Loader2 className="animate-spin mr-2" size={16} />
            Đang tải...
          </div>
        ) : topUsers.length === 0 ? (
          <p className="text-center text-muted text-sm py-8">Không có dữ liệu.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {topUsers.map((user, idx) => {
              const c = getLevelColor(user.level);
              const medals = ['🥇', '🥈', '🥉'];
              return (
                <div
                  key={user.userId || user.id}
                  className={`rounded-2xl border p-4 flex items-center gap-3 ${
                    idx < 3 ? `${c.bg} ${c.border}` : 'bg-surface border-border'
                  }`}
                >
                  <div className="text-2xl leading-none w-8 text-center">
                    {medals[idx] ?? `#${idx + 1}`}
                  </div>
                  <UserAvatar user={user} size="sm" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-ink truncate">{getFullName(user)}</p>
                    <span
                      className={`text-[10px] font-bold rounded-full border px-2 py-0.5 ${c.bg} ${c.text} ${c.border}`}
                    >
                      {user.level}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Distribution table */}
      <div className="rounded-2xl border border-border bg-surface p-5 shadow-soft overflow-hidden">
        <div className="border-b border-border pb-4 mb-5">
          <h3 className="font-bold text-ink">Bảng thống kê chi tiết</h3>
          <p className="text-xs text-muted mt-0.5">Số lượng và tỷ lệ học viên theo cấp độ CEFR</p>
        </div>
        <table className="w-full text-sm">
          <thead className="text-[10px] uppercase tracking-wider text-muted font-bold border-b border-border">
            <tr>
              <th className="pb-3 text-left">Cấp độ</th>
              <th className="pb-3 text-right">Số học viên</th>
              <th className="pb-3 text-right">Tỷ lệ</th>
              <th className="pb-3 pl-4">Phân bổ</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {LEVEL_ORDER.map((level) => {
              const count = levelCounts[level] ?? 0;
              const pct = users.length > 0 ? (count / users.length) * 100 : 0;
              const c = getLevelColor(level);
              return (
                <tr key={level}>
                  <td className="py-3">
                    <span
                      className={`inline-block rounded-full border px-2.5 py-0.5 text-[10px] font-bold ${c.bg} ${c.text} ${c.border}`}
                    >
                      {level}
                    </span>
                  </td>
                  <td className="py-3 text-right font-semibold text-ink">
                    {loading ? '...' : count}
                  </td>
                  <td className="py-3 text-right text-muted text-xs">{pct.toFixed(1)}%</td>
                  <td className="py-3 pl-4">
                    <div className="h-2 w-full bg-ink/[0.06] rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-700"
                        style={{
                          width: `${pct}%`,
                          background: LEVEL_BACKGROUNDS[level] || '#94a3b8',
                        }}
                      />
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};