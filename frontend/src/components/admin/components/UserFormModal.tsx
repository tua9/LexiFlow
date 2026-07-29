import React, { useEffect, useRef, useState } from 'react';
import { X, Loader2, AlertTriangle, Check } from 'lucide-react';
import type { UserProfileDTO, UserFormData, FormMode } from '../../../types/admin';
import { LEVEL_ORDER, getLevelColor } from '../constants/levels';

interface UserFormModalProps {
  open: boolean;
  mode: FormMode;
  initial?: UserProfileDTO | null;
  onClose: () => void;
  onSubmit: (data: UserFormData) => Promise<void>;
}

export const UserFormModal: React.FC<UserFormModalProps> = ({
  open,
  mode,
  initial,
  onClose,
  onSubmit,
}) => {
  const [formData, setFormData] = useState<UserFormData>({
    firstname: '',
    lastname: '',
    email: '',
    level: 'A1',
    role: 'ROLE_USER',
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const firstRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open) {
      setFormData({
        firstname: initial?.firstname ?? '',
        lastname: initial?.lastname ?? '',
        email: initial?.email ?? '',
        level: initial?.level ?? 'A1',
        role: initial?.role || (initial?.roles?.includes('ROLE_ADMIN') ? 'ROLE_ADMIN' : 'ROLE_USER'),
      });
      setError('');
      setSaving(false);
      setTimeout(() => firstRef.current?.focus(), 50);
    }
  }, [open, initial]);

  const handleChange = (field: keyof UserFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const { firstname, lastname, email, level, role } = formData;
    
    if (!firstname.trim() || !lastname.trim() || !email.trim()) {
      setError('Vui lòng điền đầy đủ họ, tên và email.');
      return;
    }

    setSaving(true);
    setError('');

    try {
      await onSubmit({
        firstname: firstname.trim(),
        lastname: lastname.trim(),
        email: email.trim(),
        level,
        role,
      });
      onClose();
    } catch (err: any) {
      setError(err?.response?.data?.message ?? err?.message ?? 'Có lỗi xảy ra, thử lại sau.');
    } finally {
      setSaving(false);
    }
  };

  if (!open) return null;

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
            <h2 className="font-bold text-ink">
              {mode === 'create' ? 'Thêm học viên mới' : 'Chỉnh sửa học viên'}
            </h2>
            <p className="text-xs text-muted mt-0.5">
              {mode === 'create' ? 'Tạo hồ sơ học viên trong hệ thống' : 'Cập nhật thông tin học viên'}
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
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="mb-1.5 block text-xs font-bold text-muted uppercase tracking-wider">
                Họ
              </label>
              <input
                ref={firstRef}
                type="text"
                value={formData.firstname}
                onChange={(e) => handleChange('firstname', e.target.value)}
                placeholder="Nguyễn"
                className="w-full rounded-xl border border-border bg-canvas px-3.5 py-2.5 text-sm outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 transition-all"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-bold text-muted uppercase tracking-wider">
                Tên
              </label>
              <input
                type="text"
                value={formData.lastname}
                onChange={(e) => handleChange('lastname', e.target.value)}
                placeholder="Văn A"
                className="w-full rounded-xl border border-border bg-canvas px-3.5 py-2.5 text-sm outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 transition-all"
              />
            </div>
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-bold text-muted uppercase tracking-wider">
              Email
            </label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => handleChange('email', e.target.value)}
              placeholder="hocvien@example.com"
              disabled={mode === 'edit'}
              className="w-full rounded-xl border border-border bg-canvas px-3.5 py-2.5 text-sm outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            />
            {mode === 'edit' && (
              <p className="mt-1 text-[11px] text-muted">Email không thể thay đổi sau khi tạo.</p>
            )}
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-bold text-muted uppercase tracking-wider">
              Cấp độ CEFR
            </label>
            <div className="grid grid-cols-6 gap-1.5">
              {LEVEL_ORDER.map((level) => {
                const c = getLevelColor(level);
                const active = formData.level === level;
                return (
                  <button
                    key={level}
                    type="button"
                    onClick={() => handleChange('level', level)}
                    className={`rounded-lg border py-2 text-xs font-bold transition-all ${
                      active
                        ? `${c.bg} ${c.text} ${c.border} shadow-sm scale-105`
                        : 'border-border text-muted hover:border-brand-300 hover:text-ink'
                    }`}
                  >
                    {level}
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-bold text-muted uppercase tracking-wider">
              Vai trò
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => handleChange('role', 'ROLE_USER')}
                className={`rounded-lg border py-2 text-xs font-bold transition-all ${
                  formData.role !== 'ROLE_ADMIN'
                    ? 'bg-brand-50 text-brand-600 border-brand-200 shadow-sm scale-105'
                    : 'border-border text-muted hover:border-brand-300 hover:text-ink'
                }`}
              >
                Học viên
              </button>
              <button
                type="button"
                onClick={() => handleChange('role', 'ROLE_ADMIN')}
                className={`rounded-lg border py-2 text-xs font-bold transition-all ${
                  formData.role === 'ROLE_ADMIN'
                    ? 'bg-brand-50 text-brand-600 border-brand-200 shadow-sm scale-105'
                    : 'border-border text-muted hover:border-brand-300 hover:text-ink'
                }`}
              >
                Quản trị viên
              </button>
            </div>
          </div>

          {error && (
            <div className="flex items-center gap-2 rounded-xl bg-red-50 border border-red-200 px-3.5 py-2.5 text-sm text-red-700">
              <AlertTriangle size={14} className="flex-shrink-0" />
              {error}
            </div>
          )}

          <div className="flex gap-2.5 pt-1">
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
              {saving ? <Loader2 size={14} className="animate-spin" /> : <Check size={14} />}
              {saving ? 'Đang lưu...' : mode === 'create' ? 'Tạo học viên' : 'Lưu thay đổi'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};