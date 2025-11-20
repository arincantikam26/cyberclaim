// lib/api/users.ts
import { User, UserFormData } from '@/types/user';
import { mockUsers } from '@/lib/mock-data/users';

export interface UserQuery {
  page?: number;
  limit?: number;
  search?: string;
  facility_id?: string;
  role_id?: string;
  is_active?: boolean;
}

export interface UsersResponse {
  data: User[];
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

// --- Get Users With Pagination ---
export async function getUsers(query?: UserQuery): Promise<UsersResponse> {
  await new Promise(resolve => setTimeout(resolve, 400));

  const page = query?.page ?? 1;
  const limit = query?.limit ?? 10;
  const search = query?.search?.toLowerCase() || '';

  let filteredUsers = mockUsers;

  // Apply filters
  if (search) {
    filteredUsers = filteredUsers.filter(user =>
      user.username.toLowerCase().includes(search) ||
      user.full_name.toLowerCase().includes(search) ||
      user.email.toLowerCase().includes(search)
    );
  }

  if (query?.facility_id) {
    filteredUsers = filteredUsers.filter(user => user.facility_id === query.facility_id);
  }

  if (query?.role_id) {
    filteredUsers = filteredUsers.filter(user => user.role_id === query.role_id);
  }

  if (typeof query?.is_active === 'boolean') {
    filteredUsers = filteredUsers.filter(user => user.is_active === query.is_active);
  }

  // Sort by latest created first
  filteredUsers.sort((a, b) => 
    new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  );

  const total = filteredUsers.length;
  const totalPages = Math.ceil(total / limit);

  const start = (page - 1) * limit;
  const end = start + limit;

  const paginated = filteredUsers.slice(start, end);

  return {
    data: paginated,
    page,
    limit,
    total,
    totalPages
  };
}

// --- Get Single User ---
export async function getUser(id: string): Promise<User> {
  await new Promise(resolve => setTimeout(resolve, 300));

  const user = mockUsers.find(u => u.id === id);
  if (!user) throw new Error('User not found');

  return user;
}

// --- Create User ---
export async function createUser(data: UserFormData): Promise<User> {
  await new Promise(resolve => setTimeout(resolve, 800));

  // Validation
  if (!data.username || !data.password || !data.full_name || !data.email || !data.role_id) {
    throw new Error('Required fields are missing');
  }

  // Check for duplicate username
  const existingUser = mockUsers.find(user => user.username === data.username);
  if (existingUser) {
    throw new Error('Username already exists');
  }

  // Check for duplicate email
  const existingEmail = mockUsers.find(user => user.email === data.email);
  if (existingEmail) {
    throw new Error('Email already registered');
  }

  const newUser: User = {
    ...data,
    id: (mockUsers.length + 1).toString(),
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  };

  mockUsers.unshift(newUser);
  return newUser;
}

// --- Update User ---
export async function updateUser(id: string, data: UserFormData): Promise<User> {
  await new Promise(resolve => setTimeout(resolve, 800));

  const idx = mockUsers.findIndex(u => u.id === id);
  if (idx === -1) throw new Error('User not found');

  // Check for duplicate username (excluding current user)
  const existingUsername = mockUsers.find(
    user => user.username === data.username && user.id !== id
  );
  if (existingUsername) {
    throw new Error('Username already taken');
  }

  // Check for duplicate email (excluding current user)
  const existingEmail = mockUsers.find(
    user => user.email === data.email && user.id !== id
  );
  if (existingEmail) {
    throw new Error('Email already registered');
  }

  mockUsers[idx] = {
    ...mockUsers[idx],
    ...data,
    updated_at: new Date().toISOString()
  };

  return mockUsers[idx];
}

// --- Delete User ---
export async function deleteUser(id: string): Promise<void> {
  await new Promise(resolve => setTimeout(resolve, 500));

  const idx = mockUsers.findIndex(u => u.id === id);
  if (idx === -1) throw new Error('User not found');

  mockUsers.splice(idx, 1);
}

// --- Toggle User Status ---
export async function toggleUserStatus(id: string): Promise<User> {
  await new Promise(resolve => setTimeout(resolve, 400));

  const idx = mockUsers.findIndex(u => u.id === id);
  if (idx === -1) throw new Error('User not found');

  const updatedUser: User = {
    ...mockUsers[idx],
    is_active: !mockUsers[idx].is_active,
    updated_at: new Date().toISOString()
  };

  mockUsers[idx] = updatedUser;
  return updatedUser;
}

// --- Update Last Login ---
export async function updateLastLogin(id: string): Promise<User> {
  await new Promise(resolve => setTimeout(resolve, 200));

  const idx = mockUsers.findIndex(u => u.id === id);
  if (idx === -1) throw new Error('User not found');

  mockUsers[idx].last_login = new Date().toISOString();
  mockUsers[idx].updated_at = new Date().toISOString();

  return mockUsers[idx];
}

// --- Get User Statistics ---
export async function getUserStats(): Promise<{
  total: number;
  active: number;
  inactive: number;
  byRole: Record<string, number>;
  byFacility: Record<string, number>;
}> {
  await new Promise(resolve => setTimeout(resolve, 300));

  const total = mockUsers.length;
  const active = mockUsers.filter(u => u.is_active).length;
  const inactive = mockUsers.filter(u => !u.is_active).length;

  const byRole: Record<string, number> = {};
  const byFacility: Record<string, number> = {};

  mockUsers.forEach(user => {
    byRole[user.role_id] = (byRole[user.role_id] || 0) + 1;
    byFacility[user.facility_id] = (byFacility[user.facility_id] || 0) + 1;
  });

  return {
    total,
    active,
    inactive,
    byRole,
    byFacility
  };
}