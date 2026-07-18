'use client';
import { useEffect, useState } from 'react';
import { getDashboardStats, getAdminProducts, getInquiries, quickEditProduct, deleteProduct } from '@/lib/adminApi';
import { Package, CheckCircle2, AlertCircle, MessageSquare, Phone, ArrowRight, Loader2, Plus } from 'lucide-react';
import Link from 'next/link';
import { useAdminStore } from '@/lib/adminStore';

// Design System components
import PageLayout from '@/design-system/layouts/PageLayout';
import PageHeader from '@/design-system/layouts/PageHeader';
import PageContent from '@/design-system/layouts/PageContent';
import Card from '@/design-system/components/Card';
import Badge from '@/design-system/components/Badge';
import Button from '@/design-system/components/Button';
import ProductCard from '@/design-system/components/ProductCard';
import BottomSheet from '@/design-system/components/BottomSheet';
import Avatar from '@/design-system/components/Avatar';
import FAB from '@/components/admin/ui/FAB';

export default function AdminDashboard() {
  const [stats, setStats] = useState<any>(null);
  const [recentProducts, setRecentProducts] = useState<any[]>([]);
  const [recentInquiries, setRecentInquiries] = useState<any[]>([]);
  const [outOfStockProducts, setOutOfStockProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { addToast } = useAdminStore();
  
  const [selectedProduct, setSelectedProduct] = useState<any>(null);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [statsData, productsData, inquiriesData, alertsData] = await Promise.all([
        getDashboardStats(),
        getAdminProducts({ limit: 4, sort: '-createdAt' }),
        getInquiries(),
        getAdminProducts({ stockStatus: 'out_of_stock', limit: 4 })
      ]);
      setStats(statsData?.stats || null);
      setRecentProducts(productsData?.products?.slice(0, 4) || []);
      setRecentInquiries(inquiriesData?.inquiries?.slice(0, 4) || inquiriesData?.slice(0, 4) || []);
      setOutOfStockProducts(alertsData?.products || []);
    } catch (err) {
      console.error(err);
      addToast({ type: 'error', message: 'Failed to load boutique updates.' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const getGreeting = () => {
    const hours = new Date().getHours();
    if (hours < 12) return 'Good Morning';
    if (hours < 17) return 'Good Afternoon';
    return 'Good Evening';
  };

  const handleToggleStock = async (p: any) => {
    const isOut = p.stock === 0;
    const newStock = isOut ? 15 : 0;
    const newStatus = isOut ? 'in_stock' : 'out_of_stock';
    try {
      await quickEditProduct(p._id, { stock: newStock, stockStatus: newStatus });
      addToast({ type: 'success', message: `"${p.name}" marked ${isOut ? 'In Stock' : 'Out of Stock'}!` });
      
      setRecentProducts((prev: any[]) => prev.map(item => item._id === p._id ? { ...item, stock: newStock, stockStatus: newStatus } : item));
      setOutOfStockProducts((prev: any[]) => prev.filter(item => item._id !== p._id));
      if (selectedProduct?._id === p._id) {
        setSelectedProduct((prev: any) => ({ ...prev, stock: newStock, stockStatus: newStatus }));
      }
      
      const d = await getDashboardStats();
      setStats(d.stats);
    } catch {
      addToast({ type: 'error', message: 'Failed to update stock.' });
    }
  };

  const handleDeleteProduct = async (p: any) => {
    if (!confirm(`Are you sure you want to delete "${p.name}"?`)) return;
    try {
      await deleteProduct(p._id);
      addToast({ type: 'success', message: 'Garment deleted.' });
      if (selectedProduct?._id === p._id) setSelectedProduct(null);
      fetchData();
    } catch {
      addToast({ type: 'error', message: 'Failed to delete garment.' });
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-3 bg-[#FAF6F0]">
        <Loader2 size={32} className="animate-spin text-[#C8851A]" />
        <p className="text-[13px] text-[#9B8E7E] font-medium tracking-wide">Loading SANA Atelier...</p>
      </div>
    );
  }

  const totalProducts = stats?.products?.total || 0;
  const outOfStock = stats?.inventory?.outOfStock || 0;
  const inStock = Math.max(0, totalProducts - outOfStock);
  const newInquiries = stats?.inquiries?.new || 0;

  return (
    <PageLayout maxWidth="desktop">
      
      {/* ========================================================================= */}
      {/* 📱 1. MOBILE LAYOUT (0px - 768px)                                         */}
      {/* ========================================================================= */}
      <div className="md:hidden space-y-7">
        {/* 👑 Brand & Greeting Header */}
        <div className="flex justify-between items-center">
          <div className="space-y-1">
            <p className="text-[10px] tracking-[0.15em] text-[#C8851A] uppercase font-bold">
              {new Date().toLocaleDateString('en-IN', { weekday: 'long', month: 'short', day: 'numeric' })}
            </p>
            <h1 className="text-[26px] font-semibold text-[#1C1008] font-serif leading-tight animate-fade-in" style={{ fontFamily: 'Cormorant Garamond, serif' }}>
              {getGreeting()}, Admin
            </h1>
            <p className="text-[12px] text-[#9B8E7E] font-medium">Boutique Overview</p>
          </div>
          <Avatar name="Admin" size="lg" />
        </div>

        {/* 📊 Today's Summary (2x2 Grid) */}
        <div className="space-y-3">
          <h2 className="text-[10px] tracking-wider uppercase font-bold text-[#6B5E4C]">Today's Summary</h2>
          <div className="grid grid-cols-2 gap-3">
            {/* Total Products */}
            <Link href="/admin/products" className="bg-white border border-[#E6C280]/15 rounded-xl p-4 flex items-center gap-3 shadow-sm active:scale-98 transition-transform">
              <div className="p-2 rounded-xl bg-amber-50 text-[#C8851A] flex-shrink-0">
                <Package size={18} />
              </div>
              <div className="space-y-0.5 min-w-0">
                <span className="text-[10px] font-bold text-[#9B8E7E] uppercase block truncate">Products</span>
                <span className="text-[18px] font-bold text-[#1C1008] leading-none block font-serif" style={{ fontFamily: 'Cormorant Garamond, serif' }}>
                  {totalProducts}
                </span>
              </div>
            </Link>

            {/* In Stock */}
            <Link href="/admin/products" className="bg-white border border-[#E6C280]/15 rounded-xl p-4 flex items-center gap-3 shadow-sm active:scale-98 transition-transform">
              <div className="p-2 rounded-xl bg-emerald-50 text-[#16A34A] flex-shrink-0">
                <CheckCircle2 size={18} />
              </div>
              <div className="space-y-0.5 min-w-0">
                <span className="text-[10px] font-bold text-[#9B8E7E] uppercase block truncate">In Stock</span>
                <span className="text-[18px] font-bold text-emerald-700 leading-none block font-serif" style={{ fontFamily: 'Cormorant Garamond, serif' }}>
                  {inStock}
                </span>
              </div>
            </Link>

            {/* Out of Stock */}
            <Link href="/admin/products?filter=out_of_stock" className="bg-white border border-[#E6C280]/15 rounded-xl p-4 flex items-center gap-3 shadow-sm active:scale-98 transition-transform">
              <div className={`p-2 rounded-xl flex-shrink-0 ${outOfStock > 0 ? 'bg-red-50 text-red-600' : 'bg-gray-50 text-gray-400'}`}>
                <AlertCircle size={18} />
              </div>
              <div className="space-y-0.5 min-w-0">
                <span className="text-[10px] font-bold text-[#9B8E7E] uppercase block truncate">Out of Stock</span>
                <span className={`text-[18px] font-bold leading-none block font-serif ${outOfStock > 0 ? 'text-red-600' : 'text-[#1C1008]'}`} style={{ fontFamily: 'Cormorant Garamond, serif' }}>
                  {outOfStock}
                </span>
              </div>
            </Link>

            {/* New Enquiries */}
            <Link href="/admin/inquiries" className="bg-white border border-[#E6C280]/15 rounded-xl p-4 flex items-center gap-3 shadow-sm active:scale-98 transition-transform">
              <div className={`p-2 rounded-xl flex-shrink-0 ${newInquiries > 0 ? 'bg-amber-50 text-[#C8851A]' : 'bg-gray-50 text-gray-400'}`}>
                <MessageSquare size={18} />
              </div>
              <div className="space-y-0.5 min-w-0">
                <span className="text-[10px] font-bold text-[#9B8E7E] uppercase block truncate">New Enquiries</span>
                <span className={`text-[18px] font-bold leading-none block font-serif ${newInquiries > 0 ? 'text-[#C8851A]' : 'text-[#1C1008]'}`} style={{ fontFamily: 'Cormorant Garamond, serif' }}>
                  {newInquiries}
                </span>
              </div>
            </Link>
          </div>
        </div>

        {/* 👗 Recent Garments */}
        <div className="space-y-3">
          <div className="flex justify-between items-baseline">
            <h2 className="text-[10px] tracking-wider uppercase font-bold text-[#6B5E4C]">Recent Garments</h2>
            <Link href="/admin/products" className="text-[11px] font-bold text-[#C8851A] flex items-center gap-0.5 hover:underline">
              See all <ArrowRight size={10} />
            </Link>
          </div>

          {recentProducts.length > 0 ? (
            <div className="bg-white border border-[#E6C280]/15 rounded-xl divide-y divide-[#FAF6F0] overflow-hidden shadow-sm">
              {recentProducts.map((p) => {
                const isOut = p.stock === 0;
                return (
                  <div
                    key={p._id}
                    onClick={() => setSelectedProduct(p)}
                    className="flex items-center gap-3 p-3 hover:bg-[#FAF6F0]/40 active:bg-[#FAF6F0] transition-colors cursor-pointer"
                  >
                    <div className="w-12 h-12 rounded-lg bg-gray-50 border border-[#E6C280]/15 overflow-hidden flex-shrink-0 relative">
                      {p.images?.[0] ? (
                        <img src={p.images[0]} alt={p.name} className="w-full h-full object-cover object-top" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-300">
                          <Package size={16} />
                        </div>
                      )}
                    </div>
                    
                    <div className="flex-1 min-w-0 space-y-0.5">
                      <h4 className="text-[13px] font-bold text-[#1C1008] truncate font-serif" style={{ fontFamily: 'Cormorant Garamond, serif' }}>
                        {p.name}
                      </h4>
                      <p className="text-[10px] text-[#9B8E7E] uppercase font-bold tracking-wider">{p.category}</p>
                    </div>

                    <div className="text-right flex-shrink-0 space-y-1.5">
                      <span className="text-[13px] font-bold text-[#C8851A] block">
                        ₹{p.price?.toLocaleString('en-IN')}
                      </span>
                      <Badge type={isOut ? 'out_of_stock' : 'in_stock'} />
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="bg-white border border-[#E6C280]/15 rounded-xl p-6 text-center text-[#9B8E7E] text-[12px]">
              No garments catalogued yet.
            </div>
          )}
        </div>

        {/* 💬 Recent Enquiries */}
        <div className="space-y-3">
          <div className="flex justify-between items-baseline">
            <h2 className="text-[10px] tracking-wider uppercase font-bold text-[#6B5E4C]">Recent Enquiries</h2>
            <Link href="/admin/inquiries" className="text-[11px] font-bold text-[#C8851A] flex items-center gap-0.5 hover:underline">
              See all <ArrowRight size={10} />
            </Link>
          </div>

          {recentInquiries.length > 0 ? (
            <div className="bg-white border border-[#E6C280]/15 rounded-xl divide-y divide-[#FAF6F0] overflow-hidden shadow-sm">
              {recentInquiries.map((inq) => {
                const isNew = inq.status === 'new';
                
                const cleanPhone = inq.phone ? inq.phone.replace(/[^0-9]/g, '') : '';
                const formattedPhone = cleanPhone.startsWith('91') || cleanPhone.length > 10 ? cleanPhone : `91${cleanPhone}`;
                const waLink = inq.phone
                  ? `https://wa.me/${formattedPhone}?text=Hello%20${encodeURIComponent(inq.name)},%20thank%20you%20for%20reaching%20out%20to%20Sana%20Fashion.`
                  : null;

                return (
                  <div key={inq._id} className="p-3.5 flex items-center justify-between gap-3 hover:bg-[#FAF6F0]/40 active:bg-[#FAF6F0] transition-colors">
                    <Avatar name={inq.name} size="lg" />

                    <div className="flex-1 min-w-0 space-y-0.5">
                      <div className="flex items-center gap-1.5">
                        <h4 className="text-[13px] font-bold text-[#1C1008] truncate font-serif" style={{ fontFamily: 'Cormorant Garamond, serif' }}>
                          {inq.name}
                        </h4>
                        {isNew && (
                          <span className="w-1.5 h-1.5 rounded-full bg-[#C8851A] flex-shrink-0" />
                        )}
                      </div>
                      <p className="text-[11px] text-[#6B5E4C] truncate">{inq.message}</p>
                      <p className="text-[9px] text-[#9B8E7E] uppercase font-bold tracking-wider">
                        {new Date(inq.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                      </p>
                    </div>

                    {inq.phone && (
                      <div className="flex items-center gap-1.5 flex-shrink-0">
                        <a href={`tel:${inq.phone}`} className="w-8 h-8 rounded-[8px] bg-white border border-[#E8E2D9] text-[#6B5E4C] flex items-center justify-center shadow-sm active:bg-gray-50">
                          <Phone size={12} className="text-[#C8851A]" />
                        </a>
                        {waLink && (
                          <a href={waLink} target="_blank" rel="noopener noreferrer" className="w-8 h-8 rounded-[8px] bg-[#FAF6F0] border border-[#E6C280]/25 text-[#1C1008] flex items-center justify-center shadow-sm active:bg-amber-100/50">
                            <MessageSquare size={12} className="text-[#C8851A]" />
                          </a>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="bg-white border border-[#E6C280]/15 rounded-xl p-6 text-center text-[#9B8E7E] text-[12px]">
              No enquiries received yet.
            </div>
          )}
        </div>

        {/* FAB */}
        <FAB href="/admin/products/new" />
      </div>

      {/* ========================================================================= */}
      {/* 🖥️ 2. DESKTOP & TABLET LAYOUT (769px+)                                    */}
      {/* ========================================================================= */}
      <div className="hidden md:block space-y-8 animate-fade-in">
        
        {/* Title bar */}
        <PageHeader
          title={`${getGreeting()}, Admin`}
          subtitle="Realtime Boutique Overview & Collections Studio"
        />

        {/* 📊 Summary Cards Row (4 Equal-sized cards) */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Card 1: Total Products */}
          <Card className="flex items-center justify-between">
            <div className="space-y-2">
              <span className="text-[11px] font-bold text-[#9B8E7E] uppercase tracking-wider block">Total Products</span>
              <span className="text-[32px] font-semibold text-[#1C1008] font-serif leading-none block" style={{ fontFamily: 'Cormorant Garamond, serif' }}>
                {totalProducts}
              </span>
            </div>
            <div className="p-3.5 rounded-xl bg-amber-50 text-[#C8851A]">
              <Package size={24} />
            </div>
          </Card>

          {/* Card 2: In Stock */}
          <Card className="flex items-center justify-between">
            <div className="space-y-2">
              <span className="text-[11px] font-bold text-[#9B8E7E] uppercase tracking-wider block">In Stock</span>
              <span className="text-[32px] font-semibold text-emerald-700 font-serif leading-none block" style={{ fontFamily: 'Cormorant Garamond, serif' }}>
                {inStock}
              </span>
            </div>
            <div className="p-3.5 rounded-xl bg-emerald-50 text-emerald-600">
              <CheckCircle2 size={24} />
            </div>
          </Card>

          {/* Card 3: Out Of Stock */}
          <Card className="flex items-center justify-between">
            <div className="space-y-2">
              <span className="text-[11px] font-bold text-[#9B8E7E] uppercase tracking-wider block">Out of Stock</span>
              <span className={`text-[32px] font-semibold font-serif leading-none block ${outOfStock > 0 ? 'text-red-600' : 'text-[#1C1008]'}`} style={{ fontFamily: 'Cormorant Garamond, serif' }}>
                {outOfStock}
              </span>
            </div>
            <div className={`p-3.5 rounded-xl ${outOfStock > 0 ? 'bg-red-50 text-red-600' : 'bg-gray-50 text-gray-400'}`}>
              <AlertCircle size={24} />
            </div>
          </Card>

          {/* Card 4: New Enquiries */}
          <Card className="flex items-center justify-between">
            <div className="space-y-2">
              <span className="text-[11px] font-bold text-[#9B8E7E] uppercase tracking-wider block">New Enquiries</span>
              <span className={`text-[32px] font-semibold font-serif leading-none block ${newInquiries > 0 ? 'text-[#C8851A]' : 'text-[#1C1008]'}`} style={{ fontFamily: 'Cormorant Garamond, serif' }}>
                {newInquiries}
              </span>
            </div>
            <div className={`p-3.5 rounded-xl ${newInquiries > 0 ? 'bg-amber-50 text-[#C8851A]' : 'bg-gray-50 text-gray-400'}`}>
              <MessageSquare size={24} />
            </div>
          </Card>
        </div>

        {/* 🏢 Content Grid (10-Column Responsive Layout: Left 70%, Right 30%) */}
        <PageContent columns={10}>
          
          {/* Recent Products */}
          <div className="lg:col-span-7 space-y-5">
            <div className="flex justify-between items-baseline">
              <h3 className="text-[16px] font-bold text-[#1C1008] font-serif" style={{ fontFamily: 'Cormorant Garamond, serif' }}>
                Recent Garments
              </h3>
              <Link href="/admin/products" className="text-[12px] font-bold text-[#C8851A] hover:underline flex items-center gap-1">
                View entire catalog <ArrowRight size={12} />
              </Link>
            </div>

            {recentProducts.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
                {recentProducts.map((p) => (
                  <ProductCard
                    key={p._id}
                    product={p}
                    onSelect={() => setSelectedProduct(p)}
                    onToggleStock={() => handleToggleStock(p)}
                    onDelete={() => handleDeleteProduct(p)}
                  />
                ))}
              </div>
            ) : (
              <div className="bg-white border border-[#E6C280]/20 rounded-[12px] p-8 text-center text-[#9B8E7E] text-[13px]">
                No garments catalogued.
              </div>
            )}
          </div>

          {/* Enquiries & Quick Actions */}
          <div className="lg:col-span-3 space-y-6">
            <Card className="space-y-4">
              <h3 className="text-[14px] font-bold text-[#1C1008] font-serif border-b border-[#FAF6F0] pb-2" style={{ fontFamily: 'Cormorant Garamond, serif' }}>
                Quick Utilities
              </h3>
              <div className="grid grid-cols-1 gap-2">
                <Link href="/admin/products/new" className="w-full">
                  <Button variant="primary" className="w-full" icon={<Plus size={14} />}>
                    Add New Garment
                  </Button>
                </Link>
              </div>
            </Card>

            <Card className="space-y-4">
              <div className="flex justify-between items-baseline border-b border-[#FAF6F0] pb-2">
                <h3 className="text-[14px] font-bold text-[#1C1008] font-serif" style={{ fontFamily: 'Cormorant Garamond, serif' }}>
                  Recent Enquiries
                </h3>
                <Link href="/admin/inquiries" className="text-[11px] font-bold text-[#C8851A] hover:underline">
                  View All
                </Link>
              </div>

              {recentInquiries.length > 0 ? (
                <div className="divide-y divide-[#FAF6F0] space-y-3 pt-1">
                  {recentInquiries.slice(0, 3).map((inq) => {
                    const isNew = inq.status === 'new';
                    const cleanPhone = inq.phone ? inq.phone.replace(/[^0-9]/g, '') : '';
                    const formattedPhone = cleanPhone.startsWith('91') || cleanPhone.length > 10 ? cleanPhone : `91${cleanPhone}`;
                    const waLink = inq.phone
                      ? `https://wa.me/${formattedPhone}?text=Hello%20${encodeURIComponent(inq.name)},%20thank%20you%20for%20reaching%20out.`
                      : null;

                    return (
                      <div key={inq._id} className="pt-3 first:pt-0 space-y-2">
                        <div className="flex justify-between items-start gap-2">
                          <div className="min-w-0">
                            <div className="flex items-center gap-1.5">
                              <h4 className="text-[13px] font-bold text-[#1C1008] truncate font-serif" style={{ fontFamily: 'Cormorant Garamond, serif' }}>
                                {inq.name}
                              </h4>
                              {isNew && (
                                <span className="w-1.5 h-1.5 rounded-full bg-[#C8851A]" />
                              )}
                            </div>
                            <p className="text-[9px] text-[#9B8E7E] uppercase font-bold tracking-wider">
                              {new Date(inq.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                            </p>
                          </div>
                          
                          {inq.phone && (
                            <div className="flex items-center gap-1 flex-shrink-0">
                              <a href={`tel:${inq.phone}`} className="w-7 h-7 rounded-[8px] bg-white border border-[#E8E2D9] text-[#6B5E4C] flex items-center justify-center shadow-sm active:bg-gray-50" title="Call">
                                <Phone size={10} className="text-[#C8851A]" />
                              </a>
                              {waLink && (
                                <a href={waLink} target="_blank" rel="noopener noreferrer" className="w-7 h-7 rounded-[8px] bg-[#FAF6F0] border border-[#E6C280]/25 text-[#1C1008] flex items-center justify-center shadow-sm active:bg-amber-100/50" title="WhatsApp">
                                  <MessageSquare size={10} className="text-[#C8851A]" />
                                </a>
                              )}
                            </div>
                          )}
                        </div>

                        <p className="text-[12px] text-[#6B5E4C] leading-snug break-words line-clamp-2">
                          {inq.message}
                        </p>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <p className="text-[12px] text-[#9B8E7E]">No enquiries found.</p>
              )}
            </Card>

            <Card className="space-y-3">
              <h3 className="text-[14px] font-bold text-[#1C1008] font-serif border-b border-[#FAF6F0] pb-2" style={{ fontFamily: 'Cormorant Garamond, serif' }}>
                Stock Warnings
              </h3>

              {outOfStockProducts.length > 0 ? (
                <div className="space-y-3 pt-1">
                  {outOfStockProducts.map((p) => (
                    <div key={p._id} className="flex justify-between items-center gap-2">
                      <div className="min-w-0">
                        <h4 className="text-[12px] font-bold text-[#1C1008] truncate font-serif" style={{ fontFamily: 'Cormorant Garamond, serif' }}>
                          {p.name}
                        </h4>
                        <Badge type="out_of_stock" />
                      </div>
                      <Button
                        variant="secondary"
                        onClick={() => handleToggleStock(p)}
                        className="h-8 text-[10px] px-3.5"
                      >
                        Restock
                      </Button>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-[12px] text-[#9B8E7E]">All garments in stock!</p>
              )}
            </Card>
          </div>

        </PageContent>
      </div>

      {/* FAB (Desktop View) */}
      <FAB href="/admin/products/new" />

      {/* Bottom Sheet Drawer for mobile detail view */}
      <BottomSheet isOpen={!!selectedProduct} onClose={() => setSelectedProduct(null)}>
        {selectedProduct && (
          <div className="px-4 pt-2 pb-6 space-y-5">
            <div className="aspect-[4/3] rounded-[12px] bg-gray-50 border border-[#E6C280]/20 overflow-hidden relative">
              {selectedProduct.images?.[0] ? (
                <img src={selectedProduct.images[0]} alt={selectedProduct.name} className="w-full h-full object-cover object-top" />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center text-gray-400">
                  <Package size={36} />
                  <span className="text-[10px] uppercase font-bold tracking-wider mt-2">No image uploaded</span>
                </div>
              )}
              
              <div className="absolute bottom-3 left-3 flex gap-1.5 z-10">
                <Badge type={selectedProduct.stock === 0 ? 'out_of_stock' : 'in_stock'} />
                {selectedProduct.featured && <Badge type="featured" />}
              </div>
              <div className="absolute top-3 right-3 z-10">
                <Badge type={selectedProduct.status} />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-start gap-4">
                <div>
                  <h2 className="text-[20px] font-bold text-[#1C1008] font-serif leading-tight" style={{ fontFamily: 'Cormorant Garamond, serif' }}>
                    {selectedProduct.name}
                  </h2>
                  <p className="text-[11px] text-[#9B8E7E] tracking-wider uppercase font-semibold mt-1">
                    {selectedProduct.category} {selectedProduct.fabric ? `• ${selectedProduct.fabric}` : ''}
                  </p>
                </div>
                <span className="text-[18px] font-bold text-[#C8851A] font-serif">
                  ₹{selectedProduct.price?.toLocaleString('en-IN')}
                </span>
              </div>

              <p className="text-[13px] text-[#6B5E4C] leading-relaxed pt-2 border-t border-[#F0EDE8] whitespace-pre-line">
                {selectedProduct.description || 'No description provided.'}
              </p>
            </div>

            <div className="space-y-2 pt-4">
              <div className="grid grid-cols-2 gap-2.5">
                <Link href={`/admin/products/${selectedProduct._id}`} className="w-full">
                  <Button variant="secondary" className="w-full">
                    Edit Details
                  </Button>
                </Link>

                <Button
                  onClick={() => handleToggleStock(selectedProduct)}
                  variant={selectedProduct.stock === 0 ? 'primary' : 'secondary'}
                  className="w-full"
                >
                  {selectedProduct.stock === 0 ? 'Mark In Stock' : 'Mark Out Stock'}
                </Button>
              </div>

              <div className="grid grid-cols-2 gap-2.5 pt-0.5">
                <a
                  href={`/products/${selectedProduct.slug}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="h-11 rounded-[10px] bg-[#FAF6F0] border border-[#E6C280]/20 text-[#6B5E4C] text-[11px] font-bold uppercase flex items-center justify-center gap-1.5 cursor-pointer hover:bg-[#F2ECE2] transition-colors"
                >
                  Preview Shop
                </a>

                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => setSelectedProduct(null)}
                  className="w-full text-[11px] !h-11 !rounded-[10px]"
                >
                  Close Info
                </Button>
              </div>
            </div>
          </div>
        )}
      </BottomSheet>

    </PageLayout>
  );
}
