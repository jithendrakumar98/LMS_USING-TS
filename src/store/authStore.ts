import { create } from 'zustand';
import { User } from '../types';

interface AuthState {
  user: User | null;
  setUser: (user: User | null) => void;
  isAuthenticated: boolean;
}

export const useAuthStore = create<AuthState>((set) => {
  const storedAuth = localStorage.getItem('isAuthenticated');
  const initialIsAuthenticated = storedAuth === 'true';

  const userRole = localStorage.getItem('userRole');

  const initialUser = userRole ? { role: userRole } as User : null;

  return {
    user: initialUser,
    isAuthenticated: initialIsAuthenticated, 
    setUser: (user) => {
      if (user) {
        localStorage.setItem('userRole', user.role);
        localStorage.setItem('isAuthenticated', 'true');
      } else {
        localStorage.removeItem('userRole');
        localStorage.setItem('isAuthenticated', 'false');
      }
      set({ user, isAuthenticated: !!user });
    },
  };
});
