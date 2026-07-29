import client from './client'
import type { User, CreateUserDTO } from '../types/user';

export const userApi = {
  // GET all users
  getUsers: async (): Promise<User[]> => {
    const response = await client.get('/users');
    return response.data;
  },

  // GET user by ID
  getUserById: async (id: string): Promise<User> => {
    const response = await client.get(`/users/${id}`);
    return response.data;
  },

  // POST create user
  createUser: async (data: CreateUserDTO): Promise<User> => {
    const response = await client.post('/users', data);
    return response.data;
  },

  // PUT update user
  updateUser: async (id: string, data: FormData): Promise<User> => {
    const response = await client.put(`/users/${id}`, data);
    return response.data;
  },

  // DELETE user
  deleteUser: async (id: string): Promise<void> => {
    await client.delete(`/users/${id}`);
  },
};