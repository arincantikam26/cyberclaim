// app/lib/auth.ts
import { cookies } from 'next/headers';

export interface SessionUser {
  id: string;
  name: string;
  email: string;
  role: 'superadmin' | 'admin' | 'faskes';
}

export async function getSession(): Promise<SessionUser | null> {
  const cookieStore = cookies();
  const session = (await cookieStore).get('session');

  if (!session) return null;

  try {
    return JSON.parse(session.value) as SessionUser;
  } catch {
    return null;
  }
}
