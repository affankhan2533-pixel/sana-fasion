'use client';
import { useAdminStore } from '@/lib/adminStore';
import { useRouter, usePathname } from 'next/navigation';
import { Bell, LogOut, Search, ChevronRight } from 'lucide-react';
import { useState } from 'react';

// Map pathnames to human-readable breadcrumbs
const crumbMap: Record<string, string> = {
  '/admin': 'Dashboard',
  '/admin/products': 'Products',
  '/admin/products/new': 'New Product',
  '/admin/collections': 'Collections',
  '/admin/appointments': 'Appointments',
  '/admin/orders': 'Orders',
  '/admin/customers': 'Customers',
  '/admin/inquiries': 'Enquiries',
  '/admin/cms': 'Homepage Builder',
  '/admin/media': 'Media Library',
  '/admin/seo': 'SEO Manager',
  '/admin/settings': 'Settings',
  '/admin/users': 'Admin Users',
  '/admin/logs': 'Activity Logs',
};

function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return 'Good Morning';
  if (h < 17) return 'Good Afternoon';
  return 'Good Evening';
}

function buildBreadcrumbs(pathname: string) {
  const parts = pathname.split('/').filter(Boolean);
  const crumbs: { label: string; href: string }[] = [];
  let path = '';
  for (const part of parts) {
    path += `/${part}`;
    const label = crumbMap[path] || part.charAt(0).toUpperCase() + part.slice(1).replace(/-/g, ' ');
    crumbs.push({ label, href: path });
  }
  return crumbs;
}

export default function AdminTopbar() {
  const { admin, clearAuth, unreadCount, setSearchOpen } = useAdminStore();
  const router = useRouter();
  const pathname = usePathname();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const crumbs = buildBreadcrumbs(pathname);
  const isHome = pathname === '/admin';

  const handleLogout = () => {
    clearAuth();
    router.push('/admin/login');
  };

  return (
    <header className="h-16 bg-white border-b border-[#E8E2D9] px-6 flex items-center justify-between flex-shrink-0 z-10">
      {/* Left: breadcrumb / greeting */}
      <div>
        {isHome ? (
          <div>
            <p className="text-[13px] text-[#9B8E7E]">{getGreeting()},</p>
            <h1 className="text-[17px] font-semibold text-[#1C1008] -mt-0.5" style={{ fontFamily: 'Cormorant Garamond, serif' }}>
              {admin?.name || 'Admin'} ✨
            </h1>
          </div>
        ) : (
          <nav className="flex items-center gap-1.5 text-[13px]">
            {crumbs.map((c, i) => (
              <span key={c.href} className="flex items-center gap-1.5">
                {i > 0 && <ChevronRight size={12} className="text-[#9B8E7E]" />}
                <span className={i === crumbs.length - 1 ? 'text-[#1C1008] font-medium' : 'text-[#9B8E7E]'}>
                  {c.label}
                </span>
              </span>
            ))}
          </nav>
        )}
      </div>

      {/* Right: actions */}
      <div className="flex items-center gap-3">
        {/* Search */}
        <button
          onClick={() => setSearchOpen(true)}
          className="flex items-center gap-2 px-3 py-2 rounded-lg border border-[#E8E2D9] text-[12px] text-[#9B8E7E] hover:border-[#C8851A] hover:text-[#1C1008] transition-all duration-200 cursor-pointer"
        >
          <Search size={13} />
          <span className="hidden sm:inline">Search...</span>
          <kbd className="hidden sm:inline text-[10px] px-1.5 py-0.5 bg-[#F5F5F4] rounded text-[#9B8E7E]">⌘K</kbd>
        </button>

        {/* Notifications */}
        <button className="relative p-2 rounded-lg hover:bg-[rgba(200,133,26,0.06)] transition-colors cursor-pointer">
          <Bell size={16} className="text-[#6B5E4C]" />
          {unreadCount > 0 && (
            <span className="absolute top-1 right-1 w-4 h-4 bg-[#C8851A] rounded-full text-[9px] font-bold text-white flex items-center justify-center">
              {unreadCount > 9 ? '9+' : unreadCount}
            </span>
          )}
        </button>

        {/* Divider */}
        <div className="w-px h-5 bg-[#E8E2D9]" />

        {/* User avatar + menu */}
        <div className="relative">
          <button
            onClick={() => setShowUserMenu(!showUserMenu)}
            className="flex items-center gap-2.5 cursor-pointer"
          >
            <div className="w-8 h-8 rounded-full flex items-center justify-center text-[12px] font-bold"
              style={{ background: 'rgba(200,133,26,0.12)', color: '#C8851A' }}>
              {admin?.name?.charAt(0).toUpperCase() || 'A'}
            </div>
            <div className="hidden sm:block text-left">
              <p className="text-[12px] font-medium text-[#1C1008]">{admin?.name}</p>
              <p className="text-[10px] text-[#9B8E7E] capitalize">{admin?.role?.replace('_', ' ')}</p>
            </div>
          </button>

          {showUserMenu && (
            <div
              className="absolute right-0 top-full mt-2 w-44 bg-white border border-[#E8E2D9] rounded-[10px] shadow-[0_8px_32px_rgba(0,0,0,0.1)] py-1.5 z-50 animate-slide-up"
              onMouseLeave={() => setShowUserMenu(false)}
            >
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-2.5 px-3.5 py-2.5 text-[13px] text-[#DC2626] hover:bg-[#FEF2F2] transition-colors cursor-pointer"
              >
                <LogOut size={14} />
                Sign Out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
