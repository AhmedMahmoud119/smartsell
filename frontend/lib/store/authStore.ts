import { create } from 'zustand';
import { User, Workspace } from '../types';

interface AuthState {
  user: User | null;
  workspace: Workspace | null;
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  setAuth: (data: {
    user: User;
    workspace: Workspace;
    accessToken: string;
    refreshToken: string;
  }) => void;
  clearAuth: () => void;
  initAuth: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  workspace: null,
  accessToken: null,
  refreshToken: null,
  isAuthenticated: false,

  setAuth: ({ user, workspace, accessToken, refreshToken }) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('accessToken', accessToken);
      localStorage.setItem('refreshToken', refreshToken);
    }
    set({
      user,
      workspace,
      accessToken,
      refreshToken,
      isAuthenticated: true,
    });
  },

  clearAuth: () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
    }
    set({
      user: null,
      workspace: null,
      accessToken: null,
      refreshToken: null,
      isAuthenticated: false,
    });
  },

  initAuth: () => {
    if (typeof window !== 'undefined') {
      const accessToken = localStorage.getItem('accessToken');
      const refreshToken = localStorage.getItem('refreshToken');

      if (accessToken && refreshToken) {
        set({
          accessToken,
          refreshToken,
          isAuthenticated: true,
        });
      }
    }
  },
}));
