// lib/mock-data/users.ts
import { User } from '@/types/users';

export const mockUsers: User[] = [
  {
    id: '1',
    facility_id: 'faskes-1',
    username: 'admin',
    password: 'hashed_password_123',
    full_name: 'Administrator System',
    email: 'admin@klinik.com',
    role_id: 'role-1',
    is_active: true,
    last_login: '2024-01-15T08:30:00Z',
    created_at: '2023-01-10T10:00:00Z',
    updated_at: '2024-01-15T08:30:00Z'
  },
  {
    id: '2',
    facility_id: 'faskes-1',
    username: 'dokter.ahmad',
    password: 'hashed_password_123',
    full_name: 'Dr. Ahmad Wijaya, Sp.PD',
    email: 'ahmad.wijaya@klinik.com',
    role_id: 'role-2',
    is_active: true,
    last_login: '2024-01-14T14:20:00Z',
    created_at: '2023-02-15T09:15:00Z',
    updated_at: '2024-01-14T14:20:00Z'
  },
  {
    id: '3',
    facility_id: 'faskes-1',
    username: 'perawat.siti',
    password: 'hashed_password_123',
    full_name: 'Siti Rahayu, S.Kep',
    email: 'siti.rahayu@klinik.com',
    role_id: 'role-3',
    is_active: true,
    last_login: '2024-01-14T16:45:00Z',
    created_at: '2023-03-20T11:30:00Z',
    updated_at: '2024-01-14T16:45:00Z'
  },
  {
    id: '4',
    facility_id: 'faskes-2',
    username: 'dokter.budi',
    password: 'hashed_password_123',
    full_name: 'Dr. Budi Santoso, Sp.JP',
    email: 'budi.santoso@klinik.com',
    role_id: 'role-2',
    is_active: true,
    last_login: '2024-01-13T10:15:00Z',
    created_at: '2023-04-10T08:45:00Z',
    updated_at: '2024-01-13T10:15:00Z'
  },
  {
    id: '5',
    facility_id: 'faskes-1',
    username: 'frontdesk.maya',
    password: 'hashed_password_123',
    full_name: 'Maya Sari',
    email: 'maya.sari@klinik.com',
    role_id: 'role-4',
    is_active: true,
    last_login: '2024-01-15T09:00:00Z',
    created_at: '2023-05-05T14:20:00Z',
    updated_at: '2024-01-15T09:00:00Z'
  },
  {
    id: '6',
    facility_id: 'faskes-2',
    username: 'perawat.rizki',
    password: 'hashed_password_123',
    full_name: 'Rizki Pratama, S.Kep',
    email: 'rizki.pratama@klinik.com',
    role_id: 'role-3',
    is_active: false,
    last_login: '2023-12-20T13:10:00Z',
    created_at: '2023-06-15T10:30:00Z',
    updated_at: '2024-01-10T11:20:00Z'
  },
  {
    id: '7',
    facility_id: 'faskes-1',
    username: 'dokter.dewi',
    password: 'hashed_password_123',
    full_name: 'Dr. Dewi Anggraini, Sp.A',
    email: 'dewi.anggraini@klinik.com',
    role_id: 'role-2',
    is_active: true,
    last_login: '2024-01-14T11:45:00Z',
    created_at: '2023-07-22T09:15:00Z',
    updated_at: '2024-01-14T11:45:00Z'
  },
  {
    id: '8',
    facility_id: 'faskes-3',
    username: 'admin.branch',
    password: 'hashed_password_123',
    full_name: 'Branch Administrator',
    email: 'admin.branch@klinik.com',
    role_id: 'role-1',
    is_active: true,
    last_login: '2024-01-12T15:30:00Z',
    created_at: '2023-08-30T16:45:00Z',
    updated_at: '2024-01-12T15:30:00Z'
  }
];