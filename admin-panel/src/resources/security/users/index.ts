export { UserList } from './UsersList';
export { UserCreate } from './UserCreateForm';
export { UserEdit } from './UserEditForm';
export { UserShow } from './UserShow';

export type UserRecord = {
    id: string;
    username: string;
    email: string;
    fullName: string;
    role: 'SUPER_ADMIN' | 'ADMINISTRATOR' | 'MANAGER' | 'CRM_MANAGER';
    permissions: string[];
    isActive: boolean;
    twoFactorEnabled: boolean;
    lastLogin?: string;
    createdAt: string;
    updatedAt: string;
};

