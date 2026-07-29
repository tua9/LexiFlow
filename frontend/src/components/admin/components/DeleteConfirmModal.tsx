import React, { useState } from 'react';
import { AlertTriangle, Loader2, Trash2 } from 'lucide-react';
import { type UserProfileDTO } from '../../../types/admin';
import { getFullName } from '../../../utils/adminHelpers';

interface DeleteConfirmModalProps {
  user: UserProfileDTO | null;
  onConfirm: () => Promise<void>;
  onCancel: () => void;
}

export const DeleteConfirmModal: React.FC<DeleteConfirmModalProps> = ({
  user,
  onConfirm,
  onCancel,
}) => {
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState('');

  if (!user) return null;

  const handleDelete = async () => {
    setDeleting(true);
    setError('');
    try {
      await onConfirm();
    } catch (err: any) {
      setError(err?.response?.data?.message ?? err?.message ?? 'Xóa thất bại, thử lại sau.');
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="rounded-xl border border-red-200 bg-red-50 p-3.5 space-y-3">
      <div className="flex items-start gap-2">
        <AlertTriangle size={15} className="text-red-500 flex-shrink-0 mt-0.5" />
        <p className="text-xs text-red-700">
          Bạn có chắc muốn xóa học viên{' '}
          <strong>{getFullName(user)}</strong>? Hành động này không thể hoàn tác.
        </p>
      </div>
      {error && <p className="text-xs text-red-700 font-medium">{error}</p>}
      <div className="flex gap-2">
        <button
          onClick={onCancel}
          disabled={deleting}
          className="flex-1 rounded-lg border border-red-200 bg-white py-2 text-xs font-semibold text-red-600 hover:bg-red-50 transition-all disabled:opacity-60"
        >
          Hủy
        </button>
        <button
          onClick={handleDelete}
          disabled={deleting}
          className="flex flex-1 items-center justify-center gap-1.5 rounded-lg bg-red-600 py-2 text-xs font-semibold text-white hover:bg-red-700 transition-all disabled:opacity-60"
        >
          {deleting ? <Loader2 size={12} className="animate-spin" /> : <Trash2 size={12} />}
          {deleting ? 'Đang xóa...' : 'Xác nhận xóa'}
        </button>
      </div>
    </div>
  );
};