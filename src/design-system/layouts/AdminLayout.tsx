'use client';
import React, { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAdminStore } from '@/lib/adminStore';
import AdminSidebar from '@/components/admin/AdminSidebar';
import AdminTopbar from '@/components/admin/AdminTopbar';
import ToastContainer from '@/components/admin/ToastContainer';
import GlobalSearch from '@/components/admin/GlobalSearch';
import Link from 'next/link';
import { LayoutDashboard, Package, MessageSquare, Settings } from 'lucide-react';

interface AdminLayoutProps {
  children: React.ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const { token } = useAdminStore();
  const router = useRouter();
  const pathname = usePathname();
  const isLoginPage = pathname === '/admin/login';
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted && !token && !isLoginPage) {
      router.replace('/admin/login');
    }
  }, [token, isLoginPage, router, mounted]);

  if (!mounted) return null;

  // Login page layout bypasses full shell
  if (isLoginPage) {
    return (
      <>
        <div>{children}</div>
        <ToastContainer />
      </>
    );
  }

  if (!token) return null;

  const isActive = (href: string, exact?: boolean) => {
    if (exact) return pathname === href;
    return pathname.startsWith(href) && href !== '/admin';
  };

  const navItems = [
    { href: '/admin', label: 'Dashboard', icon: LayoutDashboard, exact: true },
    { href: '/admin/products', label: 'Products', icon: Package },
    { href: '/admin/inquiries', label: 'Enquiries', icon: MessageSquare },
    { href: '/admin/settings', label: 'Settings', icon: Settings },
  ];

  return (
    <div className="flex h-screen bg-[#FAF6F0] text-[#1C1008] font-sans overflow-hidden">
      
      {/* Sidebar — desktop/tablet, fixed left column */}
      <AdminSidebar />

      {/* Right column: topbar + scrollable page content */}
      <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
        {/* Top Header Bar (desktop only) */}
        <AdminTopbar />

        {/* Page content — scrollable, padded for mobile bottom nav */}
        <main className="flex-1 overflow-y-auto pb-20 md:pb-0">
          {children}
        </main>
      </div>

      {/* ── Mobile Bottom Navigation ── */}
      <nav
        className="md:hidden fixed bottom-0 inset-x-0 bg-white border-t border-[#E6C280]/20 z-50"
        style={{ height: '64px', boxShadow: '0 -1px 0 rgba(200,133,26,0.08), 0 -4px 20px rgba(0,0,0,0.06)' }}
      >
        <div className="flex items-center justify-around h-full px-2">
          {navItems.map((item) => {
            const active = isActive(item.href, item.exact);
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className="flex flex-col items-center justify-center gap-1 flex-1 h-full"
              >
                <div
                  className={`flex items-center justify-center w-10 h-7 rounded-full transition-all duration-200 active:scale-90 ${
                    active
                      ? 'bg-[rgba(200,133,26,0.12)]'
                      : ''
                  }`}
                >
                  <Icon
                    size={22}
                    className={active ? 'text-[#C8851A]' : 'text-[#9B8E7E]'}
                  />
                </div>
                <span
                  className={`text-[9px] font-bold tracking-wide leading-none ${
                    active ? 'text-[#C8851A]' : 'text-[#9B8E7E]'
                  }`}
                >
                  {item.label}
                </span>
              </Link>
            );
          })}
        </div>
      </nav>

      <ToastContainer />
      <GlobalSearch />
    </div>
  );
}
