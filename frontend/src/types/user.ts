export type Level = 'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'C2';

export const LEVELS: Level[] = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'];

export interface User {
    id: string;
    userId: string;
    firstname: string;
    lastname: string;
    email: string;
    urlAvatar: string;
    level: Level;
    createAt: string | null;
    roles?: string[];
    permissions?: string[];
}

export interface CreateUserDTO {
    avatar?: string | File | null;
    username: string;
    password: string;
    firstname: string;
    lastname: string;
    email?: string;
    phone?: string;
    role?: string;
    permissions?: string[];
}

export interface UpdateUserDTO extends Partial<CreateUserDTO> { }