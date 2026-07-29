import type { UserProfileDTO, StatsData } from '../types/admin';
import { LEVEL_ORDER, type CEFRLevel } from '../components/admin/constants/levels';

export const getFullName = (user: UserProfileDTO): string => {
  return `${user.firstname || ''} ${user.lastname || ''}`.trim();
};

export const getInitials = (user: UserProfileDTO): string => {
  const initials = ((user.firstname?.charAt(0) ?? '') + (user.lastname?.charAt(0) ?? '')).toUpperCase();
  return initials || user.email?.charAt(0)?.toUpperCase() || '?';
};

export const calculateStats = (users: UserProfileDTO[]): StatsData => {
  const levelCounts: Record<CEFRLevel, number> = {} as Record<CEFRLevel, number>;
  LEVEL_ORDER.forEach((l) => (levelCounts[l] = 0));
  
  users.forEach((u) => {
    if (u.level) {
      levelCounts[u.level] = (levelCounts[u.level] ?? 0) + 1;
    }
  });

  const advancedCount = (levelCounts['C1'] ?? 0) + (levelCounts['C2'] ?? 0);
  const recentUsers = [...users].slice(-3).reverse();

  return {
    total: users.length,
    advanced: advancedCount,
    levels: levelCounts,
    recent: recentUsers,
  };
};

export const filterUsers = (
  users: UserProfileDTO[],
  search: string,
  filterLevel: string,
  sortBy: string
): UserProfileDTO[] => {
  let list = [...users];

  // Search filter
  if (search.trim()) {
    const q = search.toLowerCase();
    list = list.filter((u) => 
      getFullName(u).toLowerCase().includes(q) || 
      u.email.toLowerCase().includes(q)
    );
  }

  // Level filter
  if (filterLevel !== 'All') {
    list = list.filter((u) => u.level === filterLevel);
  }

  // Sort
  switch (sortBy) {
    case 'name-asc':
      list.sort((a, b) => getFullName(a).localeCompare(getFullName(b)));
      break;
    case 'name-desc':
      list.sort((a, b) => getFullName(b).localeCompare(getFullName(a)));
      break;
    case 'level-asc':
      list.sort((a, b) => LEVEL_ORDER.indexOf(a.level) - LEVEL_ORDER.indexOf(b.level));
      break;
    case 'level-desc':
      list.sort((a, b) => LEVEL_ORDER.indexOf(b.level) - LEVEL_ORDER.indexOf(a.level));
      break;
    default:
      break;
  }

  return list;
};