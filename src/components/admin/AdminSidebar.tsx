'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Package, MessageSquare, Settings } from 'lucide-react';

export default function AdminSidebar() {
  const pathname = usePathname();

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
    <aside
      className="hidden md:flex flex-col h-screen bg-[#17100A] border-r border-[#E6C280]/20 flex-shrink-0 transition-all duration-300 w-[72px] lg:w-[280px]"
    >
      {/* Brand Logo Header */}
      <div className="h-16 flex items-center px-4 border-b border-[#E6C280]/10 justify-center lg:justify-between">
        {/* Desktop Logo */}
        <div className="hidden lg:flex flex-col">
          <span className="text-[16px] font-bold text-[#C8851A] tracking-wider font-serif" style={{ fontFamily: 'Cormorant Garamond, serif' }}>
            SANA ATELIER
          </span>
          <span className="text-[9px] tracking-[0.2em] text-[#9B8E7E] uppercase font-semibold">
            Admin Studio
          </span>
        </div>
        {/* Tablet Logo (Icon Only) */}
        <span className="lg:hidden text-[18px] font-bold text-[#C8851A] font-serif">S</span>
      </div>

      {/* Navigation links */}
      <nav className="flex-1 py-6 px-3 space-y-2">
        {navItems.map((item) => {
          const active = isActive(item.href, item.exact);
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 p-3 lg:px-4 lg:py-3.5 rounded-xl transition-all justify-center lg:justify-start ${
                active
                  ? 'bg-[#C8851A] text-white shadow-sm'
                  : 'text-[#9B8E7E] hover:bg-white/5 hover:text-white'
              }`}
              title={item.label}
            >
              <Icon size={20} className="flex-shrink-0" />
              {/* Show labels only on desktop */}
              <span className="hidden lg:inline text-[13px] font-semibold tracking-wide">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Footer / User Profile */}
      <div className="p-4 border-t border-[#E6C280]/10 text-center hidden lg:block">
        <p className="text-[10px] text-[#9B8E7E] tracking-wider uppercase font-bold">
          Boutique Workspace
        </p>
      </div>
    </aside>
  );
}
