import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: string;
  avatar?: string;
  permissions: Record<string, boolean>;
}

export interface Toast {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  message: string;
  duration?: number;
}

interface AdminStore {
  // Auth
  token: string | null;
  admin: AdminUser | null;
  setAuth: (token: string, admin: AdminUser) => void;
  clearAuth: () => void;

  // Sidebar
  sidebarCollapsed: boolean;
  toggleSidebar: () => void;

  // Toasts
  toasts: Toast[];
  addToast: (toast: Omit<Toast, 'id'>) => void;
  removeToast: (id: string) => void;

  // Global search
  searchOpen: boolean;
  setSearchOpen: (v: boolean) => void;

  // Notification count
  unreadCount: number;
  setUnreadCount: (n: number) => void;
}

export const useAdminStore = create<AdminStore>()(
  persist(
    (set, get) => ({
      // Auth
      token: null,
      admin: null,
      setAuth: (token, admin) => set({ token, admin }),
      clearAuth: () => set({ token: null, admin: null }),

      // Sidebar
      sidebarCollapsed: false,
      toggleSidebar: () => set(s => ({ sidebarCollapsed: !s.sidebarCollapsed })),

      // Toasts
      toasts: [],
      addToast: (toast) => {
        const id = `toast-${Date.now()}`;
        set(s => ({ toasts: [...s.toasts, { ...toast, id }] }));
        const duration = toast.duration ?? 4000;
        if (duration > 0) setTimeout(() => get().removeToast(id), duration);
      },
      removeToast: (id) => set(s => ({ toasts: s.toasts.filter(t => t.id !== id) })),

      // Search
      searchOpen: false,
      setSearchOpen: (v) => set({ searchOpen: v }),

      // Notifications
      unreadCount: 0,
      setUnreadCount: (n) => set({ unreadCount: n }),
    }),
    {
      name: 'sana-admin-store',
      partialize: (s) => ({ token: s.token, admin: s.admin, sidebarCollapsed: s.sidebarCollapsed }),
    }
  )
);
