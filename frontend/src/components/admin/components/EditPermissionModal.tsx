import React, { useEffect, useState } from 'react';
import { X, Loader2, ShieldCheck, Check } from 'lucide-react';
import type { UserProfileDTO } from '../../../types/admin';

interface EditPermissionModalProps {
  open: boolean;
  user: UserProfileDTO | null;
  onClose: () => void;
  onSubmit: (user: UserProfileDTO, permissions: string[]) => Promise<void>;
}

const AVAILABLE_PERMISSIONS = [
  { id: 'MANAGE_USERS', label: 'Quản lý học viên', description: 'Có thể thêm, sửa, xóa học viên' },
  { id: 'MANAGE_TOPICS', label: 'Quản lý chủ đề', description: 'Tạo, sửa, xóa các chủ đề học' },
  { id: 'MANAGE_VOCABULARIES', label: 'Quản lý từ vựng', description: 'Cập nhật nội dung từ vựng' },
  { id: 'VIEW_STATS', label: 'Xem thống kê', description: 'Xem số liệu tổng hợp hệ thống' },
];

export const EditPermissionModal: React.FC<EditPermissionModalProps> = ({
  open,
  user,
  onClose,
  onSubmit,
}) => {
  const [permissions, setPermissions] = useState<string[]>([]);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (open && user) {
      setPermissions(user.permissions || []);
      setError('');
      setSaving(false);
    }
  }, [open, user]);

  const togglePermission = (id: string) => {
    setPermissions((prev) =>
      prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    
    setSaving(true);
    setError('');

    try {
      await onSubmit(user, permissions);
      onClose();
    } catch (err: any) {
      setError(err?.response?.data?.message ?? err?.message ?? 'Có lỗi xảy ra, thử lại sau.');
    } finally {
      setSaving(false);
    }
  };

  if (!open || !user) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
      <div
        className="relative w-full max-w-md rounded-2xl border border-border bg-surface shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border px-6 py-4">
          <div>
            <h2 className="font-bold text-ink flex items-center gap-2">
              <ShieldCheck size={18} className="text-brand-600" />
              Phân quyền tài khoản
            </h2>
            <p className="text-xs text-muted mt-0.5">
              Tùy chỉnh quyền hạn cho {user.firstname} {user.lastname}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1.5 text-muted hover:bg-ink/[0.06] transition-colors"
          >
            <X size={16} />
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="space-y-2">
            {AVAILABLE_PERMISSIONS.map((perm) => {
              const active = permissions.includes(perm.id);
              return (
                <div
                  key={perm.id}
                  onClick={() => togglePermission(perm.id)}
                  className={`flex items-start gap-3 p-3 rounded-xl border cursor-pointer transition-all ${
                    active
                      ? 'bg-brand-50 border-brand-200'
                      : 'bg-canvas border-border hover:border-brand-300'
                  }`}
                >
                  <div className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded border ${
                    active ? 'bg-brand-600 border-brand-600' : 'bg-surface border-border'
                  }`}>
                    {active && <Check size={12} className="text-white" />}
                  </div>
                  <div>
                    <h4 className={`text-sm font-semibold ${active ? 'text-brand-700' : 'text-ink'}`}>
                      {perm.label}
                    </h4>
                    <p className={`text-xs mt-0.5 ${active ? 'text-brand-600/70' : 'text-muted'}`}>
                      {perm.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          {error && (
            <div className="mt-4 flex items-center gap-2 rounded-xl bg-red-50 border border-red-200 px-3.5 py-2.5 text-sm text-red-700">
              {error}
            </div>
          )}

          <div className="flex gap-2.5 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 rounded-xl border border-border bg-surface py-2.5 text-sm font-medium text-muted hover:bg-ink/[0.05] transition-all"
            >
              Hủy
            </button>
            <button
              type="submit"
              disabled={saving}
              className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-brand-600 py-2.5 text-sm font-semibold text-white hover:bg-brand-700 disabled:opacity-60 transition-all shadow-sm"
            >
              {saving ? <Loader2 size={14} className="animate-spin" /> : <ShieldCheck size={14} />}
              {saving ? 'Đang lưu...' : 'Lưu quyền hạn'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
