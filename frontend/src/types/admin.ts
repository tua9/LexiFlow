import { type CEFRLevel } from '../components/admin/constants/levels';

export interface UserFormData {
  firstname: string;
  lastname: string;
  email: string;
  level: CEFRLevel;
  role: string;
  permissions?: string[];
}

export type FormMode = 'create' | 'edit';

export interface UserProfileDTO {
  id?: string;
  userId?: string;
  firstname: string;
  lastname: string;
  email: string;
  level: CEFRLevel;
  urlAvatar?: string;
  avatarUrl?: string;
  roles?: string[];
  role?: string;
  permissions?: string[];
}

export interface StatsData {
  total: number;
  advanced: number;
  levels: Record<CEFRLevel, number>;
  recent: UserProfileDTO[];
}