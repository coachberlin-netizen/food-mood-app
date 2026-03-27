import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface User {
  id: string;
  name: string;
  email: string;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  waitlistCount: number;
  login: (user: Omit<User, 'id'>) => void;
  register: (user: Omit<User, 'id'>, joinWaitlist: boolean) => void;
  logout: () => void;
  incrementWaitlist: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      waitlistCount: 247, // Mock initial count

      login: (userData) => {
        set({
          user: { ...userData, id: Math.random().toString(36).substr(2, 9) },
          isAuthenticated: true,
        });
      },

      register: (userData, joinWaitlist) => {
        set((state) => ({
          user: { ...userData, id: Math.random().toString(36).substr(2, 9) },
          isAuthenticated: true,
          waitlistCount: joinWaitlist ? state.waitlistCount + 1 : state.waitlistCount,
        }));
      },

      logout: () => {
        set({ user: null, isAuthenticated: false });
      },

      incrementWaitlist: () => {
        set((state) => ({ waitlistCount: state.waitlistCount + 1 }));
      }
    }),
    {
      name: 'food-mood-auth',
    }
  )
);
