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
    <div className="flex h-screen overflow-hidden bg-[#FAF6F0] text-[#1C1008] font-sans pb-16 md:pb-0">
      
      {/* Sidebar (Desktop & Tablet) */}
      <AdminSidebar />
      
      <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
        {/* Top Header Bar */}
        <AdminTopbar />
        
        {/* Child Pages Shell */}
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>

      {/* 📱 Premium Bottom Navigation (Mobile Viewports Only) */}
      <div className="md:hidden fixed bottom-0 inset-x-0 h-18 bg-[#FAF6F0] border-t border-[#E6C280]/20 flex items-center justify-around z-40 px-2 shadow-lg">
        {navItems.map((item) => {
          const active = isActive(item.href, item.exact);
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className="flex flex-col items-center justify-center w-20 h-16 transition-all"
            >
              <div className={`px-4.5 py-1.5 rounded-full transition-all duration-200 flex items-center justify-center active:scale-95 ${
                active ? 'text-[#C8851A] bg-[rgba(200,133,26,0.12)] border border-[#E6C280]/15' : 'text-[#9B8E7E]'
              }`}>
                <Icon size={24} />
              </div>
              <span className={`text-[9px] tracking-wider font-bold transition-all mt-0.5 ${
                active ? 'text-[#C8851A]' : 'text-[#9B8E7E]'
              }`}>
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>

      <ToastContainer />
      <GlobalSearch />
    </div>
  );
}
