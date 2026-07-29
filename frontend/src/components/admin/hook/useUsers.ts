import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { UserProfileDTO, UserFormData } from '../../../types/admin';
import { userApi } from '../../../api';

export const useUsers = (isAdmin: boolean) => {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ['users'],
    queryFn: userApi.getUsers,
    enabled: isAdmin,
  });

  const addMutation = useMutation({
    mutationFn: (data: UserFormData) =>
      userApi.createUser({
        firstname: data.firstname,
        lastname: data.lastname,
        email: data.email,
        username: data.email,
        password: '',
        role: data.role,
        permissions: data.permissions,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ user, data }: { user: UserProfileDTO; data: UserFormData }) => {
      const id = user.userId || user.id || '';
      const formData = new FormData();
      const jsonBlob = new Blob([JSON.stringify(data)], { type: 'application/json' });
      formData.append('data', jsonBlob);
      await userApi.updateUser(id, formData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (user: UserProfileDTO) => {
      const uid = user.userId || user.id || '';
      await userApi.deleteUser(uid);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
  });

  const handleAdd = async (data: UserFormData) => {
    await addMutation.mutateAsync(data);
  };

  const handleUpdate = async (user: UserProfileDTO, data: UserFormData) => {
    await updateMutation.mutateAsync({ user, data });
  };

  const handleDelete = async (user: UserProfileDTO) => {
    await deleteMutation.mutateAsync(user);
  };

  return {
    users: (query.data ?? []) as UserProfileDTO[],
    loading: query.isLoading,
    handleAdd,
    handleUpdate,
    handleDelete,
  };
};