// hooks/useUsers.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useCallback } from 'react';
import { userApi } from '../api/userApi';
import type { User, CreateUserDTO } from '../types/user';

// Query Keys
export const USER_QUERY_KEYS = {
    all: ['users'] as const,
    detail: (id: string) => [...USER_QUERY_KEYS.all, id] as const,
    // details: () => [...USER_QUERY_KEYS.all, 'detail'] as const,
    // lists: () => [...USER_QUERY_KEYS.all, 'list'] as const,
    // list: () => [...USER_QUERY_KEYS.lists()] as const,
} as const;

interface UseUsersOptions {
    autoFetch?: boolean;
}

export function useUsers(options: UseUsersOptions = {}) {
    const { autoFetch = true } = options;
    const queryClient = useQueryClient();

    // 1. GET: Lấy danh sách users
    const {
        data: users = [],
        isLoading: isLoadingUsers,
        error: usersError,
        refetch: refetchUsers,
    } = useQuery({
        queryKey: USER_QUERY_KEYS.all,
        queryFn: userApi.getUsers,
        enabled: autoFetch,
        staleTime: 2 * 60 * 1000,
    });
    console.log("[useUsers] userList", users)

    // 2. GET: Lấy user theo userId
    const useUser = ({ userId, enabled = true }: { userId: string; enabled?: boolean }) => {
        return useQuery({
            queryKey: USER_QUERY_KEYS.detail(userId),
            queryFn: () => userApi.getUserById(userId),
            enabled: !!userId && enabled,
            staleTime: 2 * 1000,
        });
    };

    // 3. POST: Tạo user mới
    const {
        mutateAsync: createUserMutation,
        isPending: isCreating,
        error: createError,
    } = useMutation({
        mutationFn: (data: CreateUserDTO) => userApi.createUser(data),
        onSuccess: (newUser) => {
            // Invalidate và cập nhật cache
            queryClient.invalidateQueries({
                queryKey: USER_QUERY_KEYS.all
            });

            // Cập nhật cache chi tiết
            queryClient.setQueryData(
                USER_QUERY_KEYS.detail(newUser.id),
                newUser
            );
        },
        onError: (error) => {
            console.error('Failed to create user:', error);
        },
    });

    // 4. PUT: Cập nhật user
    const {
        mutateAsync: updateUserMutation,
        isPending: isUpdating,
        error: updateError,
    } = useMutation({
        mutationFn: ({ id, data }: { id: string; data: FormData }) =>
            userApi.updateUser(id, data),
        onSuccess: (updatedUser) => {
            console.log("\n\n[useUser.ts] updatedUser la: ", updatedUser)
            // Update cache chi tiết
            queryClient.setQueryData(
                USER_QUERY_KEYS.detail(updatedUser.id),
                updatedUser
            );

            // Update trong danh sách
            queryClient.setQueryData<User[]>(
                USER_QUERY_KEYS.all,
                (oldUsers) => {
                    if (!oldUsers) return oldUsers;
                    return oldUsers.map((user) =>
                        user.id === updatedUser.id ? updatedUser : user
                    );
                }
            );

            // queryClient.invalidateQueries({
            //     queryKey: USER_QUERY_KEYS.all,
            //     refetchType: 'active',
            // });

            queryClient.invalidateQueries({
                queryKey: USER_QUERY_KEYS.detail(updatedUser.id),
                refetchType: 'active',
            });
        },
        onError: (error) => {
            console.error('Failed to update user:', error);
        },
    });

    // 5. DELETE: Xóa user
    const {
        mutateAsync: deleteUserMutation,
        isPending: isDeleting,
        error: deleteError,
    } = useMutation({
        mutationFn: (id: string) => userApi.deleteUser(id),
        onSuccess: (_, deletedId) => {
            // Xóa khỏi cache chi tiết
            queryClient.removeQueries({
                queryKey: USER_QUERY_KEYS.detail(deletedId)
            });

            // Cập nhật danh sách
            queryClient.setQueryData<User[]>(
                USER_QUERY_KEYS.all,
                (oldUsers) => {
                    if (!oldUsers) return oldUsers;
                    return oldUsers.filter((user) => user.id !== deletedId);
                }
            );
        },
        onError: (error) => {
            console.error('Failed to delete user:', error);
        },
    });

    // Helper functions
    const prefetchUser = useCallback(
        (userId: string) => {
            return queryClient.prefetchQuery({
                queryKey: USER_QUERY_KEYS.detail(userId),
                queryFn: () => userApi.getUserById(userId),
            });
        },
        [queryClient]
    );

    const invalidateUsers = useCallback(() => {
        return queryClient.invalidateQueries({
            queryKey: USER_QUERY_KEYS.all
        });
    }, [queryClient]);

    const refetchUser = useCallback(
        (userId: string) => {
            return queryClient.refetchQueries({
                queryKey: USER_QUERY_KEYS.detail(userId),
            });
        },
        [queryClient]
    );

    return {
        // Data
        users,

        // User detail
        useUser,

        // Loading states
        isLoading: isLoadingUsers,
        isCreating,
        isUpdating,
        isDeleting,

        // Errors
        error: usersError,
        createError,
        updateError,
        deleteError,

        // Mutation functions
        createUser: createUserMutation,
        updateUser: updateUserMutation,
        deleteUser: deleteUserMutation,

        // Utility functions
        refetch: refetchUsers,
        prefetchUser,
        invalidateUsers,
        refetchUser,
    };
}

// Export individual hooks for specific use cases
export function useAllUsers() {
    return useUsers();
}

export function useUserDetail(userId: string, enabled = true) {
    console.log("call use User Detail")
    return useQuery({
        queryKey: USER_QUERY_KEYS.detail(userId),
        queryFn: () => userApi.getUserById(userId),
        enabled: !!userId && enabled,
        staleTime: 5 * 1000,
    });
}

// Hook cho user form (create/update)
export function useUserForm() {
    const queryClient = useQueryClient();

    const createMutation = useMutation({
        mutationFn: (data: CreateUserDTO) => userApi.createUser(data),
        onSuccess: (newUser) => {
            queryClient.setQueryData(
                USER_QUERY_KEYS.detail(newUser.id),
                newUser
            );
            queryClient.invalidateQueries({
                queryKey: USER_QUERY_KEYS.all
            });
        },
    });

    const updateMutation = useMutation({
        mutationFn: ({ id, data }: { id: string; data: FormData }) =>
            userApi.updateUser(id, data),
        onSuccess: (updatedUser) => {
            queryClient.setQueryData(
                USER_QUERY_KEYS.detail(updatedUser.id),
                updatedUser
            );
            queryClient.invalidateQueries({
                queryKey: USER_QUERY_KEYS.all
            });
        },
    });

    return {
        createUser: createMutation.mutateAsync,
        updateUser: updateMutation.mutateAsync,
        isCreating: createMutation.isPending,
        isUpdating: updateMutation.isPending,
        error: createMutation.error || updateMutation.error,
    };
}