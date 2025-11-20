// hooks/useAuth.ts
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { UserSession } from '@/types/auth';
import { logout } from '@/lib/api/auth';

export const useAuth = () => {
  const router = useRouter();
  const [user, setUser] = useState<UserSession['user'] | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const userData = localStorage.getItem('user');
    const token = localStorage.getItem('token');
    
    if (userData && token) {
      setUser(JSON.parse(userData));
    }
    setLoading(false);
  }, []);

  const handleLogout = async () => {
    setLoading(true);
    try {
      await logout();
      
      // Clear local storage
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      localStorage.removeItem('remember_me');
      
      // Clear session storage
      sessionStorage.clear();
      
      // Redirect to login
      router.push('/login');
    } catch (error) {
      console.error('Logout failed:', error);
      // Force logout even if API fails
      localStorage.clear();
      sessionStorage.clear();
      router.push('/login');
    } finally {
      setLoading(false);
    }
  };

  return {
    user,
    loading,
    logout: handleLogout
  };
};