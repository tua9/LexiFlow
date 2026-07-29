import { useEffect, useState } from 'react';
import { Camera, Upload } from 'lucide-react';
import { Modal } from './Modal';
import type { UserProfile } from '../types';
import type { User } from '../types/user';

interface UserProfileModalProps {
    open: boolean;
    onClose: () => void;
    profile: UserProfile;
    onSave: ({ id, data }: { id: string, data: FormData }) => Promise<User> | void;
}

export function UserProfileModal({ open, onClose, profile, onSave }: UserProfileModalProps) {
    const [formState, setFormState] = useState<UserProfile>(profile);
    const [avatarFile, setAvatarFile] = useState<File | null>(null);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        if (open) {
            setFormState(profile);
            setAvatarFile(null);
            console.log('[UserProfileModal] open, set formState to profile', profile);
        }
    }, [open, profile]);

    async function handleSave() {
        setSaving(true);
        try {
            const formData = new FormData();

            const jsonBlob = new Blob([JSON.stringify(formState)], { type: "application/json" });
            formData.append("data", jsonBlob);

            if (avatarFile) {
                formData.append("file", avatarFile);
            }

            await onSave({ id: profile.userId, data: formData });
            onClose();
        } catch (err) {
            console.error('[UserProfileModal] save error', err);
        } finally {
            setSaving(false);
        }
    }

    return (
        <Modal open={open} onClose={onClose} title="Chỉnh sửa thông tin người dùng" size="md">
            <div className="space-y-5">
                <div className="grid gap-3">
                    <label className="block text-xs font-semibold text-muted">Ảnh đại diện</label>
                    <div className="flex justify-center">
                        <div className="relative group cursor-pointer">
                            <input
                                type="file"
                                accept="image/png, image/jpeg"
                                className="hidden"
                                id="avatar-upload"
                                onChange={(e) => {
                                    const file = e.target.files?.[0];
                                    if (file) {
                                        setAvatarFile(file);
                                        const reader = new FileReader();
                                        reader.onloadend = () => {
                                            setFormState((curr) => ({ ...curr, urlAvatar: reader.result as string }));
                                        };
                                        reader.readAsDataURL(file);
                                    }
                                }}
                            />
                            <label htmlFor="avatar-upload" className="block relative cursor-pointer">
                                {formState.urlAvatar ? (
                                    <img src={formState.urlAvatar} alt="Avatar" className="w-24 h-24 rounded-full object-cover border-2 border-border shadow-soft" />
                                ) : (
                                    <div className="w-24 h-24 rounded-full bg-surface border-2 border-dashed border-border flex items-center justify-center text-muted shadow-soft transition group-hover:border-brand-300">
                                        <Camera size={28} />
                                    </div>
                                )}
                                <div className="absolute inset-0 bg-ink/50 rounded-full opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                                    <Upload size={24} className="text-white" />
                                </div>
                            </label>
                        </div>
                    </div>
                </div>
                <div className="grid gap-4">
                    <label className="block text-xs font-semibold text-muted">ID tài khoản</label>
                    <input
                        value={formState.userId}
                        disabled
                        className="w-full rounded-xl text-gray-500 border border-border bg-surface/70 px-3.5 py-2.5 text-sm shadow-soft outline-none transition disabled:cursor-not-allowed disabled:bg-surface"
                    />
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                    <div className="grid gap-2">
                        <label className="block text-xs font-semibold text-muted">Tên</label>
                        <input
                            value={formState.firstname}
                            onChange={(event) => setFormState((current) => ({ ...current, firstname: event.target.value }))}
                            className="w-full rounded-xl border border-border bg-surface px-3.5 py-2.5 text-sm shadow-soft outline-none transition focus:border-brand-300 focus:ring-4 focus:ring-brand-50"
                            placeholder="First name"
                        />
                    </div>
                    <div className="grid gap-2">
                        <label className="block text-xs font-semibold text-muted">Họ</label>
                        <input
                            value={formState.lastname}
                            onChange={(event) => setFormState((current) => ({ ...current, lastname: event.target.value }))}
                            className="w-full rounded-xl border border-border bg-surface px-3.5 py-2.5 text-sm shadow-soft outline-none transition focus:border-brand-300 focus:ring-4 focus:ring-brand-50"
                            placeholder="Last name"
                        />
                    </div>
                </div>

                <div className="grid gap-4">
                    <label className="block text-xs font-semibold text-muted">Email</label>
                    <input
                        type="email"
                        value={formState.email}
                        onChange={(event) => setFormState((current) => ({ ...current, email: event.target.value }))}
                        className="w-full rounded-xl border border-border bg-surface px-3.5 py-2.5 text-sm shadow-soft outline-none transition focus:border-brand-300 focus:ring-4 focus:ring-brand-50"
                        placeholder="name@example.com"
                    />
                </div>



                <div className="grid gap-4">
                    <label className="block text-xs font-semibold text-muted">Level</label>
                    <input
                        value={formState.level}
                        disabled
                        className="w-full rounded-xl border border-border bg-surface/70 px-3.5 py-2.5 text-sm shadow-soft outline-none transition disabled:cursor-not-allowed disabled:bg-surface"
                    />
                </div>

                <div className="flex justify-end gap-2 pt-1">
                    <button
                        type="button"
                        onClick={onClose}
                        className="rounded-xl px-4 py-2.5 text-sm font-semibold text-muted transition hover:bg-ink/[0.06]"
                    >
                        Hủy
                    </button>
                    <button
                        type="button"
                        onClick={handleSave}
                        disabled={saving}
                        className="rounded-xl bg-brand-500 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-brand-600 disabled:opacity-60"
                    >
                        {saving ? 'Đang lưu...' : 'Lưu thay đổi'}
                    </button>
                </div>
            </div>
        </Modal>
    );
}
