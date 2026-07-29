import React from 'react';
import { type UserProfileDTO } from '../../../types/admin';
import { getInitials } from '../../../utils/adminHelpers';

interface UserAvatarProps {
  user: UserProfileDTO & { avatarUrl?: string };
  size?: 'sm' | 'md' | 'lg';
}

export const UserAvatar: React.FC<UserAvatarProps> = ({ user, size = 'md' }) => {
  const sizeClasses = {
    sm: 'h-8 w-8 text-sm',
    md: 'h-10 w-10 text-base',
    lg: 'h-14 w-14 text-xl',
  };

  const avatarSrc = user.urlAvatar || user.avatarUrl || '';
  const initials = getInitials(user);

  if (avatarSrc) {
    return (
      <img
        src={avatarSrc}
        alt={user.firstname}
        className={`${sizeClasses[size]} rounded-full object-cover border border-border flex-shrink-0`}
      />
    );
  }

  return (
    <div
      className={`${sizeClasses[size]} grid place-items-center rounded-full bg-brand-50 text-brand-600 font-bold flex-shrink-0`}
    >
      {initials}
    </div>
  );
};