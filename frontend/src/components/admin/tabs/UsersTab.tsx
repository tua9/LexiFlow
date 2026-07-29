import React, { useState, useMemo } from 'react';
import { Search, RotateCcw, Plus, Pencil, Trash2, ShieldCheck, Users as UsersIcon, X, Loader2 } from 'lucide-react';
import type { UserProfileDTO, UserFormData, FormMode } from '../../../types/admin';
import { UserAvatar } from '../components/UserAvatar';
import { UserFormModal } from '../components/UserFormModal';
import { DeleteConfirmModal } from '../components/DeleteConfirmModal';
import { EditPermissionModal } from '../components/EditPermissionModal';
import { LEVEL_ORDER, getLevelColor, LEVEL_BACKGROUNDS, type CEFRLevel } from '../constants/levels';
import { filterUsers, getFullName } from '../../../utils/adminHelpers';

interface UsersTabProps {
  users: UserProfileDTO[];
  loading: boolean;
  onAdd: (data: UserFormData) => Promise<void>;
  onUpdate: (user: UserProfileDTO, data: UserFormData) => Promise<void>;
  onDelete: (user: UserProfileDTO) => Promise<void>;
}

export const UsersTab: React.FC<UsersTabProps> = ({
  users,
  loading,
  onAdd,
  onUpdate,
  onDelete,
}) => {
  const [search, setSearch] = useState('');
  const [filterLevel, setFilterLevel] = useState('All');
  const [sortBy, setSortBy] = useState('name-asc');
  const [selected, setSelected] = useState<UserProfileDTO | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<FormMode>('create');
  const [modalInitial, setModalInitial] = useState<UserProfileDTO | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<UserProfileDTO | null>(null);
  const [permissionTarget, setPermissionTarget] = useState<UserProfileDTO | null>(null);

  const filtered = useMemo(
    () => filterUsers(users, search, filterLevel, sortBy),
    [users, search, filterLevel, sortBy]
  );

  const openCreate = () => {
    setModalMode('create');
    setModalInitial(null);
    setModalOpen(true);
  };

  const openEdit = (user: UserProfileDTO) => {
    setModalMode('edit');
    setModalInitial(user);
    setModalOpen(true);
  };

  const handleModalSubmit = async (data: UserFormData) => {
    if (modalMode === 'create') {
      await onAdd(data);
    } else if (modalInitial) {
      await onUpdate(modalInitial, data);
      setSelected((prev) => (prev ? { ...prev, ...data } : prev));
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;
    await onDelete(deleteTarget);
    if (selected?.id === deleteTarget.id || selected?.userId === deleteTarget.userId) {
      setSelected(null);
    }
    setDeleteTarget(null);
  };

  return (
    <div className="space-y-5">
      {/* Filters Bar */}
      <div className="rounded-2xl border border-border bg-surface p-4 shadow-soft flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted" />
          <input
            type="text"
            placeholder="Tìm theo tên, email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-xl border border-border bg-canvas py-2 pl-10 pr-4 text-sm outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 transition-all"
          />
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <select
            value={filterLevel}
            onChange={(e) => setFilterLevel(e.target.value)}
            className="rounded-xl border border-border bg-canvas px-3 py-2 text-xs font-semibold outline-none focus:border-brand-500 transition-all"
          >
            <option value="All">Tất cả cấp độ</option>
            {LEVEL_ORDER.map((l) => (
              <option key={l} value={l}>
                {l}
              </option>
            ))}
          </select>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="rounded-xl border border-border bg-canvas px-3 py-2 text-xs font-semibold outline-none focus:border-brand-500 transition-all"
          >
            <option value="name-asc">Tên: A → Z</option>
            <option value="name-desc">Tên: Z → A</option>
            <option value="level-asc">Cấp độ: thấp → cao</option>
            <option value="level-desc">Cấp độ: cao → thấp</option>
          </select>
          <button
            onClick={() => {
              setSearch('');
              setFilterLevel('All');
              setSortBy('name-asc');
            }}
            className="rounded-xl border border-border bg-surface p-2 text-muted hover:bg-ink/[0.05] transition-all"
            title="Đặt lại bộ lọc"
          >
            <RotateCcw size={13} />
          </button>
        </div>
      </div>

      {/* Two-column layout */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">
        {/* Table */}
        <div className="xl:col-span-2 rounded-2xl border border-border bg-surface overflow-hidden shadow-soft">
          <div className="flex items-center justify-between px-5 py-4 border-b border-border bg-ink/[0.02]">
            <div className="flex items-center gap-3">
              <h3 className="font-bold text-ink">Danh sách học viên</h3>
              <span className="rounded-full bg-brand-50 px-2.5 py-0.5 text-xs font-semibold text-brand-600">
                {filtered.length} người dùng
              </span>
            </div>
            <button
              onClick={openCreate}
              className="flex items-center gap-1.5 rounded-xl bg-brand-600 px-3.5 py-2 text-xs font-semibold text-white hover:bg-brand-700 transition-all shadow-sm"
            >
              <Plus size={13} />
              Thêm học viên
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-border text-[10px] uppercase tracking-wider text-muted font-bold">
                <tr>
                  <th className="px-5 py-3">Học viên</th>
                  <th className="px-5 py-3">Họ và tên</th>
                  <th className="px-5 py-3">Cấp độ</th>
                  <th className="px-5 py-3 hidden md:table-cell">Email</th>
                  <th className="px-5 py-3">Vai trò</th>
                  <th className="px-5 py-3 text-right">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {loading ? (
                  <tr>
                    <td colSpan={5} className="px-5 py-10 text-center text-muted">
                      <Loader2 className="animate-spin inline mr-2" size={16} />
                      Đang tải dữ liệu...
                    </td>
                  </tr>
                ) : filtered.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-5 py-10 text-center text-muted">
                      Không tìm thấy học viên phù hợp.
                    </td>
                  </tr>
                ) : (
                  filtered.map((user) => {
                    const c = getLevelColor(user.level);
                    const uid = user.userId || user.id;
                    const isActive =
                      !!uid &&
                      !!selected &&
                      (selected.userId === uid || selected.id === uid);
                    const fullName = getFullName(user);
                    return (
                      <tr
                        key={uid}
                        onClick={() => setSelected(isActive ? null : user)}
                        className={`cursor-pointer transition-colors ${isActive ? 'bg-brand-50' : 'hover:bg-ink/[0.02]'
                          }`}
                      >
                        <td className="px-5 py-3.5">
                          <div className="flex items-center gap-3">
                            <UserAvatar user={user} size="sm" />
                          </div>
                        </td>
                        <td className="px-5 py-3.5">
                          <span className="font-semibold text-ink">{fullName || '—'}</span>
                        </td>
                        <td className="px-5 py-3.5">
                          <span
                            className={`inline-block rounded-full border px-2.5 py-0.5 text-[10px] font-bold ${c.bg} ${c.text} ${c.border}`}
                          >
                            {user.level || '—'}
                          </span>
                        </td>
                        <td className="px-5 py-3.5 hidden md:table-cell text-muted text-xs">
                          {user.email}
                        </td>
                        <td className="px-5 py-3.5 text-xs font-medium">
                          {user.role === 'ROLE_ADMIN' || user.roles?.includes('ROLE_ADMIN') ? (
                            <span className="rounded bg-brand-50 px-2 py-1 text-brand-600">Admin</span>
                          ) : (
                            <span className="rounded bg-ink/5 px-2 py-1 text-muted">User</span>
                          )}
                        </td>
                        <td className="px-5 py-3.5">
                          <div
                            className="flex items-center justify-end gap-1"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <button
                              title="Phân quyền"
                              onClick={() => setPermissionTarget(user)}
                              className="rounded-lg p-1.5 text-muted hover:bg-brand-50 hover:text-brand-600 transition-colors"
                            >
                              <ShieldCheck size={13} />
                            </button>
                            <button
                              title="Chỉnh sửa"
                              onClick={() => openEdit(user)}
                              className="rounded-lg p-1.5 text-muted hover:bg-brand-50 hover:text-brand-600 transition-colors"
                            >
                              <Pencil size={13} />
                            </button>
                            <button
                              title="Xóa"
                              onClick={() => {
                                setSelected(user);
                                setDeleteTarget(user);
                              }}
                              className="rounded-lg p-1.5 text-muted hover:bg-red-50 hover:text-red-600 transition-colors"
                            >
                              <Trash2 size={13} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Detail Card */}
        <div className="xl:col-span-1">
          <div className="rounded-2xl border border-border bg-surface p-5 shadow-soft sticky top-24 min-h-[200px]">
            {!selected ? (
              <div className="flex flex-col items-center justify-center py-14 text-center gap-3">
                <div className="grid h-14 w-14 place-items-center rounded-full bg-ink/[0.05] text-muted">
                  <UsersIcon size={24} />
                </div>
                <h4 className="font-bold text-ink">Chọn một học viên</h4>
                <p className="text-xs text-muted max-w-[200px]">
                  Nhấn vào tên bất kỳ trong danh sách để xem thông tin chi tiết.
                </p>
              </div>
            ) : (
              <div className="space-y-5">
                {/* Header */}
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <UserAvatar user={selected} size="lg" />
                    <div>
                      <h3 className="font-bold text-ink leading-tight">
                        {selected.firstname} {selected.lastname}
                      </h3>
                      <p className="text-xs text-muted mt-0.5">{selected.email}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setSelected(null)}
                    className="rounded-lg p-1 text-muted hover:bg-ink/[0.06] transition-colors"
                  >
                    <X size={16} />
                  </button>
                </div>

                {/* Info Grid */}
                <div className="grid grid-cols-2 gap-3 bg-ink/[0.03] rounded-xl p-3 border border-border text-center">
                  <div>
                    <span className="block text-[10px] font-bold text-muted uppercase tracking-wider">
                      Cấp độ CEFR
                    </span>
                    {(() => {
                      const c = getLevelColor(selected.level);
                      return (
                        <span
                          className={`mt-1 inline-block rounded-full border px-2.5 py-0.5 text-xs font-bold ${c.bg} ${c.text} ${c.border}`}
                        >
                          {selected.level || '—'}
                        </span>
                      );
                    })()}
                  </div>
                  <div>
                    <span className="block text-[10px] font-bold text-muted uppercase tracking-wider">
                      User ID
                    </span>
                    <span className="text-xs font-mono text-ink mt-1 block truncate">
                      {selected.userId || selected.id || '—'}
                    </span>
                  </div>
                </div>

                <div className="bg-ink/[0.03] rounded-xl p-3 border border-border text-center">
                  <span className="block text-[10px] font-bold text-muted uppercase tracking-wider">
                    Vai trò
                  </span>
                  <span className="text-xs font-semibold mt-1 block">
                    {selected.role === 'ROLE_ADMIN' || selected.roles?.includes('ROLE_ADMIN') ? (
                      <span className="text-brand-600">Quản trị viên</span>
                    ) : (
                      <span className="text-muted">Học viên</span>
                    )}
                  </span>
                </div>

                {/* CEFR Progress */}
                <div className="space-y-2">
                  <h4 className="text-[10px] font-bold text-muted uppercase tracking-wider">
                    Tiến trình CEFR
                  </h4>
                  <div className="flex items-center gap-1">
                    {LEVEL_ORDER.map((l, i) => {
                      const reached = LEVEL_ORDER.indexOf(selected.level as CEFRLevel) >= i;
                      return (
                        <div
                          key={l}
                          className={`flex-1 h-2 rounded-full transition-all ${reached ? '' : 'bg-ink/[0.08]'
                            }`}
                          style={
                            reached
                              ? { background: LEVEL_BACKGROUNDS[l] }
                              : {}
                          }
                        />
                      );
                    })}
                  </div>
                  <div className="flex justify-between text-[9px] font-bold text-muted">
                    {LEVEL_ORDER.map((l) => (
                      <span key={l}>{l}</span>
                    ))}
                  </div>
                </div>

                {/* Full Info */}
                <div className="space-y-2 border-t border-border pt-4 text-xs">
                  {[
                    { label: 'Họ tên', value: getFullName(selected) },
                    { label: 'Email', value: selected.email || '—' },
                    { label: 'Cấp độ', value: selected.level || '—' },
                  ].map(({ label, value }) => (
                    <div key={label} className="flex items-center justify-between">
                      <span className="text-muted font-medium">{label}</span>
                      <span className="font-semibold text-ink">{value}</span>
                    </div>
                  ))}
                </div>

                {/* Actions */}
                <div className="flex gap-2 border-t border-border pt-4">
                  <button
                    onClick={() => openEdit(selected)}
                    className="flex flex-1 items-center justify-center gap-1.5 rounded-xl border border-border bg-surface py-2.5 text-xs font-semibold text-ink hover:bg-ink/[0.05] transition-all"
                  >
                    <Pencil size={13} />
                    Chỉnh sửa
                  </button>
                  <button
                    onClick={() => setDeleteTarget(selected)}
                    className="flex flex-1 items-center justify-center gap-1.5 rounded-xl border border-red-200 bg-red-50 py-2.5 text-xs font-semibold text-red-600 hover:bg-red-100 transition-all"
                  >
                    <Trash2 size={13} />
                    Xóa
                  </button>
                </div>

                {/* Delete Confirm */}
                <DeleteConfirmModal
                  user={deleteTarget}
                  onConfirm={handleDeleteConfirm}
                  onCancel={() => setDeleteTarget(null)}
                />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Create/Edit Modal */}
      <UserFormModal
        open={modalOpen}
        mode={modalMode}
        initial={modalInitial}
        onClose={() => setModalOpen(false)}
        onSubmit={handleModalSubmit}
      />

      {/* Permission Modal */}
      <EditPermissionModal
        open={!!permissionTarget}
        user={permissionTarget}
        onClose={() => setPermissionTarget(null)}
        onSubmit={async (u, permissions) => {
          const formData: UserFormData = {
            firstname: u.firstname,
            lastname: u.lastname,
            email: u.email,
            level: u.level,
            role: u.role || 'ROLE_USER',
            permissions
          };
          await onUpdate(u, formData);
          setSelected((prev) => (prev && prev.id === u.id ? { ...prev, permissions } : prev));
        }}
      />
    </div>
  );
};