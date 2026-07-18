'use client';
import './admin.css';
import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAdminStore } from '@/lib/adminStore';
import AdminSidebar from '@/components/admin/AdminSidebar';
import AdminTopbar from '@/components/admin/AdminTopbar';
import ToastContainer from '@/components/admin/ToastContainer';
import GlobalSearch from '@/components/admin/GlobalSearch';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { token } = useAdminStore();
  const router = useRouter();
  const pathname = usePathname();
  const isLoginPage = pathname === '/admin/login';

  useEffect(() => {
    if (!token && !isLoginPage) {
      router.replace('/admin/login');
    }
  }, [token, isLoginPage, router]);

  // Login page has its own full-screen layout
  if (isLoginPage) {
    return (
      <>
        <div>{children}</div>
        <ToastContainer />
      </>
    );
  }

  // Not authenticated yet — don't flash the admin UI
  if (!token) return null;

  return (
    <div className="flex h-screen overflow-hidden bg-[#FAFAF8]">
      <AdminSidebar />
      <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
        <AdminTopbar />
        <main className="flex-1 overflow-y-auto p-6">
          {children}
        </main>
      </div>
      <ToastContainer />
      <GlobalSearch />
    </div>
  );
}
