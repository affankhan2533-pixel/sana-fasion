'use client';
import { useAdminStore } from '@/lib/adminStore';
import { useRouter } from 'next/navigation';
import { Bell, LogOut, Search } from 'lucide-react';
import { useState } from 'react';

function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return 'Good Morning';
  if (h < 17) return 'Good Afternoon';
  return 'Good Evening';
}

export default function AdminTopbar() {
  const { admin, clearAuth, unreadCount, setSearchOpen } = useAdminStore();
  const router = useRouter();
  const [showUserMenu, setShowUserMenu] = useState(false);

  const handleLogout = () => {
    clearAuth();
    router.push('/admin/login');
  };

  return (
    <header className="hidden md:flex h-16 bg-white border-b border-[#E8E2D9] px-6 lg:px-10 items-center justify-between flex-shrink-0 z-10 w-full">
      <div className="max-w-[1600px] mx-auto w-full flex items-center justify-between">
        
        {/* Left: Greeting & Date */}
        <div className="flex flex-col lg:flex-row lg:items-baseline lg:gap-3 text-left">
          <h1 className="text-[16px] font-semibold text-[#1C1008] font-serif leading-tight" style={{ fontFamily: 'Cormorant Garamond, serif' }}>
            {getGreeting()}, {admin?.name || 'Admin'} ✨
          </h1>
          <span className="text-[10px] text-[#9B8E7E] uppercase font-bold tracking-wider">
            {new Date().toLocaleDateString('en-IN', { weekday: 'long', month: 'short', day: 'numeric' })}
          </span>
        </div>

        {/* Right: Search, Notifications, Profile */}
        <div className="flex items-center gap-4">
          {/* Search Button */}
          <button
            onClick={() => setSearchOpen(true)}
            className="flex items-center gap-2 px-3 py-1.5 rounded-xl border border-[#E8E2D9] text-[12px] text-[#9B8E7E] hover:border-[#C8851A] hover:text-[#1C1008] transition-all duration-200 cursor-pointer bg-[#FAFAF8]"
          >
            <Search size={14} />
            <span className="hidden sm:inline">Search...</span>
            <kbd className="hidden sm:inline text-[9px] px-1.5 py-0.5 bg-white rounded text-[#9B8E7E] border border-gray-100">⌘K</kbd>
          </button>

          {/* Notifications */}
          <button className="relative p-2 rounded-xl hover:bg-[rgba(200,133,26,0.06)] transition-colors cursor-pointer text-[#6B5E4C]">
            <Bell size={18} />
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 w-4 h-4 bg-[#C8851A] rounded-full text-[9px] font-bold text-white flex items-center justify-center">
                {unreadCount > 9 ? '9+' : unreadCount}
              </span>
            )}
          </button>

          {/* Divider */}
          <div className="w-px h-5 bg-[#E8E2D9]" />

          {/* User profile dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="flex items-center gap-2.5 cursor-pointer focus:outline-none"
            >
              <div className="w-8 h-8 rounded-full flex items-center justify-center text-[12px] font-bold"
                style={{ background: 'rgba(200,133,26,0.12)', color: '#C8851A' }}>
                {admin?.name?.charAt(0).toUpperCase() || 'A'}
              </div>
              <div className="hidden sm:block text-left">
                <p className="text-[12px] font-bold text-[#1C1008] leading-tight">{admin?.name}</p>
                <p className="text-[9px] text-[#9B8E7E] capitalize tracking-wide font-semibold mt-0.5">{admin?.role?.replace('_', ' ')}</p>
              </div>
            </button>

            {showUserMenu && (
              <div
                className="absolute right-0 top-full mt-2 w-44 bg-white border border-[#E8E2D9] rounded-xl shadow-[0_8px_32px_rgba(0,0,0,0.1)] py-1.5 z-50 animate-slide-up"
                onMouseLeave={() => setShowUserMenu(false)}
              >
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-2.5 px-3.5 py-2.5 text-[13px] text-[#DC2626] hover:bg-[#FEF2F2] transition-colors cursor-pointer font-bold"
                >
                  <LogOut size={14} />
                  Sign Out
                </button>
              </div>
            )}
          </div>
        </div>

      </div>
    </header>
  );
}
