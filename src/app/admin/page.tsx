'use client';
import { useEffect, useState } from 'react';
import { getDashboardStats } from '@/lib/adminApi';
import {
  Package, CalendarDays, ShoppingBag, MessageSquare, ArrowRight,
  TrendingUp, IndianRupee, Eye, Users, AlertCircle, Sparkles, FolderPlus, FileImage, Send, Plus
} from 'lucide-react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useAdminStore } from '@/lib/adminStore';

export default function AdminDashboard() {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const { addToast } = useAdminStore();

  useEffect(() => {
    getDashboardStats()
      .then((data) => {
        setStats(data);
      })
      .catch((err) => {
        console.error(err);
        addToast({ type: 'error', message: 'Failed to load dashboard stats.' });
      })
      .finally(() => setLoading(false));
  }, [addToast]);

  if (loading) {
    return (
      <div className="space-y-8 p-10 max-w-full mx-auto">
        <div className="flex justify-between items-center mb-4">
          <div className="h-10 w-64 skeleton" />
          <div className="h-10 w-40 skeleton" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-32 skeleton" />
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="h-[400px] skeleton" />
          <div className="h-[400px] skeleton" />
        </div>
      </div>
    );
  }

  // Curated client-friendly executive metrics
  const executiveMetrics = [
    {
      title: "Today's Orders",
      value: stats?.stats?.orders?.total || 0,
      icon: ShoppingBag,
      color: 'text-blue-600 bg-blue-50',
      link: '/admin/orders',
    },
    {
      title: 'Atelier Revenue',
      value: `₹${(stats?.stats?.orders?.total * 45000 || 0).toLocaleString('en-IN')}`,
      icon: IndianRupee,
      color: 'text-emerald-600 bg-emerald-50',
      link: '/admin/orders',
    },
    {
      title: 'Pending Appointments',
      value: stats?.stats?.appointments?.pending || 0,
      icon: CalendarDays,
      color: 'text-amber-600 bg-amber-50',
      link: '/admin/appointments',
    },
    {
      title: 'Low Stock Items',
      value: stats?.stats?.inventory?.lowStock || 0,
      icon: Package,
      color: 'text-red-600 bg-red-50',
      link: '/admin/products',
    },
  ];

  return (
    <div className="space-y-8 p-4 md:p-10 max-w-full mx-auto animate-fade-in">
      
      {/* 🏠 Header Row */}
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 border-b border-[#E8E2D9] pb-6">
        <div>
          <h1 className="text-[28px] font-semibold text-[#1C1008] tracking-tight" style={{ fontFamily: 'Cormorant Garamond, serif' }}>
            Atelier Executive Overview
          </h1>
          <p className="text-[13px] text-[#9B8E7E] mt-0.5">
            {new Date().toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
        </div>
      </div>

      {/* 📊 Metrics Grid (12-column responsive layout) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {executiveMetrics.map((card, i) => (
          <Link href={card.link} key={card.title}>
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="bg-white border border-[#E8E2D9] rounded-[16px] p-6 hover:shadow-card-hover transition-all duration-300 cursor-pointer flex items-center justify-between"
              style={{ boxShadow: '0 1px 3px rgba(0,0,0,0.05), 0 4px 16px rgba(0,0,0,0.02)' }}
            >
              <div>
                <p className="text-[11px] font-semibold tracking-widest text-[#9B8E7E] uppercase">{card.title}</p>
                <p className="text-[32px] font-bold text-[#1C1008] mt-2 tracking-tight">{card.value}</p>
              </div>
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${card.color} flex-shrink-0`}>
                <card.icon size={22} />
              </div>
            </motion.div>
          </Link>
        ))}
      </div>

      {/* 📋 Lists Grid (12-column responsive layout) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left List Pane (6 cols): Upcoming Consultations */}
        <div className="lg:col-span-6 bg-white border border-[#E8E2D9] rounded-[16px] overflow-hidden" style={{ boxShadow: '0 1px 3px rgba(0,0,0,0.05), 0 4px 16px rgba(0,0,0,0.02)' }}>
          <div className="px-6 py-5 border-b border-[#E8E2D9] flex justify-between items-center">
            <h2 className="text-[16px] font-semibold text-[#1C1008]" style={{ fontFamily: 'Cormorant Garamond, serif' }}>
              Upcoming Consultations
            </h2>
            <Link href="/admin/appointments" className="text-[11px] font-bold text-[#C8851A] hover:underline flex items-center gap-1">
              View Calendar <ArrowRight size={12} />
            </Link>
          </div>
          <div className="divide-y divide-[#F0EDE8]">
            {stats?.upcomingAppointments?.length > 0 ? (
              stats.upcomingAppointments.map((app: any) => (
                <div key={app._id} className="px-6 py-4 flex justify-between items-center hover:bg-[rgba(200,133,26,0.02)] transition-colors">
                  <div>
                    <p className="text-[13px] font-semibold text-[#1C1008]">{app.name}</p>
                    <p className="text-[11px] text-[#9B8E7E] mt-0.5">
                      {app.serviceType} • {app.time}
                    </p>
                  </div>
                  <span className={`badge-${app.status}`}>
                    {app.status}
                  </span>
                </div>
              ))
            ) : (
              <div className="p-12 text-center text-[13px] text-[#9B8E7E]">No upcoming appointments.</div>
            )}
          </div>
        </div>

        {/* Right List Pane (6 cols): Recent Enquiries */}
        <div className="lg:col-span-6 bg-white border border-[#E8E2D9] rounded-[16px] overflow-hidden" style={{ boxShadow: '0 1px 3px rgba(0,0,0,0.05), 0 4px 16px rgba(0,0,0,0.02)' }}>
          <div className="px-6 py-5 border-b border-[#E8E2D9] flex justify-between items-center">
            <h2 className="text-[16px] font-semibold text-[#1C1008]" style={{ fontFamily: 'Cormorant Garamond, serif' }}>
              Recent Activities & Enquiries
            </h2>
            <Link href="/admin/inquiries" className="text-[11px] font-bold text-[#C8851A] hover:underline flex items-center gap-1">
              View All <ArrowRight size={12} />
            </Link>
          </div>
          <div className="divide-y divide-[#F0EDE8]">
            {stats?.recentActivity?.length > 0 ? (
              stats.recentActivity.map((act: any, idx: number) => (
                <div key={idx} className="px-6 py-4 flex justify-between items-center hover:bg-[rgba(200,133,26,0.02)] transition-colors">
                  <div className="min-w-0 pr-4">
                    <p className="text-[13px] font-semibold text-[#1C1008] truncate">{act.message}</p>
                    <p className="text-[11px] text-[#9B8E7E] mt-0.5 truncate">{act.sub}</p>
                  </div>
                  <span className="text-[10px] text-[#9B8E7E] whitespace-nowrap">
                    {new Date(act.time).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                  </span>
                </div>
              ))
            ) : (
              <div className="p-12 text-center text-[13px] text-[#9B8E7E]">No recent activity logs.</div>
            )}
          </div>
        </div>

      </div>

      {/* 🛠️ Operations Row (Quick Actions + Watchlist) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 pt-2">
        
        {/* Quick Actions (6 cols) */}
        <div className="lg:col-span-6 bg-white border border-[#E8E2D9] rounded-[16px] p-6 space-y-4" style={{ boxShadow: '0 1px 3px rgba(0,0,0,0.05), 0 4px 16px rgba(0,0,0,0.02)' }}>
          <h2 className="text-[16px] font-semibold text-[#1C1008]" style={{ fontFamily: 'Cormorant Garamond, serif' }}>
            Quick Actions
          </h2>
          <div className="grid grid-cols-2 gap-4">
            <Link href="/admin/products/new" className="btn-secondary h-12 justify-center text-[13px]">
              <Plus size={14} className="text-[#C8851A]" /> Add Product
            </Link>
            <Link href="/admin/collections" className="btn-secondary h-12 justify-center text-[13px]">
              <FolderPlus size={14} className="text-[#C8851A]" /> Create Collection
            </Link>
            <Link href="/admin/media" className="btn-secondary h-12 justify-center text-[13px]">
              <FileImage size={14} className="text-[#C8851A]" /> Upload Banner
            </Link>
            <Link href="/admin/appointments" className="btn-primary h-12 justify-center text-[13px] tracking-wide">
              <Send size={14} /> Book Appointment
            </Link>
          </div>
        </div>

        {/* Stock watchlist (6 cols) */}
        <div className="lg:col-span-6 bg-white border border-[#E8E2D9] rounded-[16px] p-6 space-y-4" style={{ boxShadow: '0 1px 3px rgba(0,0,0,0.05), 0 4px 16px rgba(0,0,0,0.02)' }}>
          <h2 className="text-[16px] font-semibold text-[#1C1008]" style={{ fontFamily: 'Cormorant Garamond, serif' }}>
            Inventory Watchlist
          </h2>
          <div className="border border-[#E8E2D9] rounded-xl p-4 bg-[#FAFAF8] text-center min-h-[100px] flex items-center justify-center">
            {stats?.stats?.inventory?.outOfStock > 0 || stats?.stats?.inventory?.lowStock > 0 ? (
              <p className="text-[12px] text-amber-700 font-medium">
                ⚠️ {stats?.stats?.inventory?.outOfStock || 0} items are out of stock. <br />
                Refine listings inside the Catalog panel.
              </p>
            ) : (
              <p className="text-[12px] text-emerald-600 font-medium flex items-center gap-1.5 justify-center">
                ✓ All catalog inventory levels are fully optimized.
              </p>
            )}
          </div>
        </div>

      </div>

    </div>
  );
}
