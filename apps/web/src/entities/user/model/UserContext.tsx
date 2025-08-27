'use client';

import { createContext, useState, ReactNode, useEffect } from 'react';
import type { User } from '../lib/types';
import { getCurrentUser } from '../api/userApi';

type UserContextValue = {
  user: User;
  setUser: (u: User) => void;
  isLoading: boolean;
  setIsLoading: (u: boolean) => void;
  logout: () => void;
};

export const UserContext = createContext<UserContextValue | null>(null);

export function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const logout = () => {
    setUser(null);
    localStorage.removeItem('token');
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      setIsLoading(false);
      return;
    }

    getCurrentUser()
      .then((res) => {
        setUser(res);
      })
      .catch(() => {
        localStorage.removeItem('token');
        setUser(null);
      })
      .finally(() => setIsLoading(false));
  }, []);

  return (
    <UserContext.Provider
      value={{ user, setUser, isLoading, setIsLoading, logout }}
    >
      {children}
    </UserContext.Provider>
  );
}
