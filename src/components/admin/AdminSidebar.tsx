'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAdminStore } from '@/lib/adminStore';
import {
  LayoutDashboard, Package, FolderOpen, CalendarDays, ShoppingBag, Users,
  Image as ImageIcon, Globe, Settings, ChevronRight, ChevronDown,
  PanelLeftClose, PanelLeftOpen, Search, Menu, AlignJustify, HelpCircle
} from 'lucide-react';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function AdminSidebar() {
  const pathname = usePathname();
  const { sidebarCollapsed, toggleSidebar, admin } = useAdminStore();

  // Collapsible Submenu states
  const [catalogOpen, setCatalogOpen] = useState(true);
  const [websiteOpen, setWebsiteOpen] = useState(true);

  const isActive = (href: string, exact?: boolean) => {
    if (exact) return pathname === href;
    return pathname.startsWith(href) && href !== '/admin';
  };

  return (
    <motion.aside
      animate={{ width: sidebarCollapsed ? 64 : 240 }}
      transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
      className="flex-shrink-0 flex flex-col h-screen bg-[#17100A] overflow-hidden"
      style={{ borderRight: '1px solid rgba(200,133,26,0.12)' }}
    >
      {/* Logo */}
      <div className="flex items-center justify-between px-4 py-4 border-b border-[rgba(200,133,26,0.1)]" style={{ minHeight: 64 }}>
        <AnimatePresence>
          {!sidebarCollapsed && (
            <motion.div
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -8 }}
              transition={{ duration: 0.2 }}
              className="flex flex-col"
            >
              <span className="text-[15px] font-semibold tracking-wide" style={{ color: '#F5C842', fontFamily: 'Cormorant Garamond, serif' }}>
                SANA
              </span>
              <span className="text-[9px] tracking-[0.2em] uppercase" style={{ color: 'rgba(255,240,210,0.4)' }}>
                Admin Studio
              </span>
            </motion.div>
          )}
        </AnimatePresence>
        <button
          onClick={toggleSidebar}
          className="p-1.5 rounded-lg transition-all duration-200 flex-shrink-0"
          style={{ color: 'rgba(255,240,210,0.5)' }}
          onMouseEnter={e => (e.currentTarget.style.color = 'rgba(255,240,210,1)')}
          onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,240,210,0.5)')}
        >
          {sidebarCollapsed ? <PanelLeftOpen size={16} /> : <PanelLeftClose size={16} />}
        </button>
      </div>

      {/* Navigation menu list */}
      <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1.5">
        
        {/* 🏠 Dashboard Link */}
        <Link
          href="/admin"
          className={`admin-sidebar-link ${isActive('/admin', true) ? 'active' : ''} ${sidebarCollapsed ? 'justify-center px-2' : ''}`}
        >
          <LayoutDashboard size={16} className="flex-shrink-0" />
          {!sidebarCollapsed && <span className="flex-1 text-[13px]">Dashboard</span>}
        </Link>

        {/* 🛍 Catalog Group */}
        <div>
          {sidebarCollapsed ? (
            <Link
              href="/admin/products"
              title="Catalog"
              className={`admin-sidebar-link ${isActive('/admin/products') || isActive('/admin/collections') ? 'active' : ''} justify-center px-2`}
            >
              <Package size={16} />
            </Link>
          ) : (
            <>
              <button
                onClick={() => setCatalogOpen(!catalogOpen)}
                className="w-full flex items-center justify-between px-3 py-2 text-[11px] font-semibold tracking-wider text-[rgba(255,240,210,0.35)] uppercase hover:text-[rgba(255,240,210,0.85)] transition-colors cursor-pointer"
              >
                <span>🛍 Catalog</span>
                {catalogOpen ? <ChevronDown size={12} /> : <ChevronRight size={12} />}
              </button>

              <AnimatePresence initial={false}>
                {catalogOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="pl-3 space-y-0.5 overflow-hidden"
                  >
                    <Link
                      href="/admin/products"
                      className={`admin-sidebar-link ${isActive('/admin/products') ? 'active' : ''}`}
                    >
                      <span className="text-[12.5px]">Products</span>
                    </Link>
                    <Link
                      href="/admin/collections"
                      className={`admin-sidebar-link ${isActive('/admin/collections') ? 'active' : ''}`}
                    >
                      <span className="text-[12.5px]">Collections</span>
                    </Link>
                    <Link
                      href="/admin/products?tab=categories"
                      className={`admin-sidebar-link ${pathname.includes('categories') ? 'active' : ''}`}
                    >
                      <span className="text-[12.5px]">Categories</span>
                    </Link>
                  </motion.div>
                )}
              </AnimatePresence>
            </>
          )}
        </div>

        {/* 🌐 Website Content Group */}
        <div>
          {sidebarCollapsed ? (
            <Link
              href="/admin/cms"
              title="Website content"
              className={`admin-sidebar-link ${isActive('/admin/cms') || isActive('/admin/media') ? 'active' : ''} justify-center px-2`}
            >
              <Globe size={16} />
            </Link>
          ) : (
            <>
              <button
                onClick={() => setWebsiteOpen(!websiteOpen)}
                className="w-full flex items-center justify-between px-3 py-2 text-[11px] font-semibold tracking-wider text-[rgba(255,240,210,0.35)] uppercase hover:text-[rgba(255,240,210,0.85)] transition-colors cursor-pointer"
              >
                <span>🌐 Website</span>
                {websiteOpen ? <ChevronDown size={12} /> : <ChevronRight size={12} />}
              </button>

              <AnimatePresence initial={false}>
                {websiteOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="pl-3 space-y-0.5 overflow-hidden"
                  >
                    <Link
                      href="/admin/cms"
                      className={`admin-sidebar-link ${isActive('/admin/cms') && !pathname.includes('navigation') && !pathname.includes('footer') ? 'active' : ''}`}
                    >
                      <span className="text-[12.5px]">Website Content</span>
                    </Link>
                    <Link
                      href="/admin/media"
                      className={`admin-sidebar-link ${isActive('/admin/media') ? 'active' : ''}`}
                    >
                      <span className="text-[12.5px]">Photos & Videos</span>
                    </Link>
                    <Link
                      href="/admin/cms?tab=navigation"
                      className={`admin-sidebar-link ${pathname.includes('navigation') ? 'active' : ''}`}
                    >
                      <span className="text-[12.5px]">Navigation</span>
                    </Link>
                    <Link
                      href="/admin/cms?tab=footer"
                      className={`admin-sidebar-link ${pathname.includes('footer') ? 'active' : ''}`}
                    >
                      <span className="text-[12.5px]">Footer</span>
                    </Link>
                    <Link
                      href="/admin/seo"
                      className={`admin-sidebar-link ${isActive('/admin/seo') ? 'active' : ''}`}
                    >
                      <span className="text-[12.5px]">Google Search</span>
                    </Link>
                  </motion.div>
                )}
              </AnimatePresence>
            </>
          )}
        </div>

        {/* 📅 Appointments Link */}
        <Link
          href="/admin/appointments"
          className={`admin-sidebar-link ${isActive('/admin/appointments') ? 'active' : ''} ${sidebarCollapsed ? 'justify-center px-2' : ''}`}
        >
          <CalendarDays size={16} className="flex-shrink-0" />
          {!sidebarCollapsed && <span className="flex-1 text-[13px]">Appointments</span>}
        </Link>

        {/* 📦 Orders Link */}
        <Link
          href="/admin/orders"
          className={`admin-sidebar-link ${isActive('/admin/orders') ? 'active' : ''} ${sidebarCollapsed ? 'justify-center px-2' : ''}`}
        >
          <ShoppingBag size={16} className="flex-shrink-0" />
          {!sidebarCollapsed && <span className="flex-1 text-[13px]">Orders</span>}
        </Link>

        {/* 👥 Customers Link */}
        <Link
          href="/admin/customers"
          className={`admin-sidebar-link ${isActive('/admin/customers') ? 'active' : ''} ${sidebarCollapsed ? 'justify-center px-2' : ''}`}
        >
          <Users size={16} className="flex-shrink-0" />
          {!sidebarCollapsed && <span className="flex-1 text-[13px]">Customers</span>}
        </Link>

        {/* ⚙ Settings Link */}
        <Link
          href="/admin/settings"
          className={`admin-sidebar-link ${isActive('/admin/settings') ? 'active' : ''} ${sidebarCollapsed ? 'justify-center px-2' : ''}`}
        >
          <Settings size={16} className="flex-shrink-0" />
          {!sidebarCollapsed && <span className="flex-1 text-[13px]">Settings</span>}
        </Link>

      </nav>

      {/* User profile footer */}
      {admin && (
        <div
          className="px-3 py-3 border-t flex items-center gap-3"
          style={{ borderColor: 'rgba(200,133,26,0.1)' }}
        >
          <div
            className="w-7 h-7 rounded-full flex items-center justify-center text-[11px] font-bold flex-shrink-0"
            style={{ background: 'rgba(200,133,26,0.25)', color: '#F5C842' }}
          >
            {admin.name?.charAt(0).toUpperCase()}
          </div>
          <AnimatePresence>
            {!sidebarCollapsed && (
              <motion.div
                initial={{ opacity: 0, x: -4 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0 }}
                className="flex-1 min-w-0"
              >
                <p className="text-[12px] font-medium truncate" style={{ color: 'rgba(255,240,210,0.85)' }}>
                  {admin.name}
                </p>
                <p className="text-[10px] capitalize" style={{ color: 'rgba(255,240,210,0.4)' }}>
                  {admin.role?.replace('_', ' ')}
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}
    </motion.aside>
  );
}
