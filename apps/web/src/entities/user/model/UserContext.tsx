'use client';

import { createContext, useState, ReactNode } from 'react';
import type { User } from '../lib/types';

type UserContextValue = {
  user: User;
  setUser: (u: User) => void;
  logout: () => void;
};

export const UserContext = createContext<UserContextValue | null>(null);

export function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User>(null);

  const logout = () => {
    setUser(null);
    localStorage.removeItem('token');
  };

  return (
    <UserContext.Provider value={{ user, setUser, logout }}>
      {children}
    </UserContext.Provider>
  );
}
