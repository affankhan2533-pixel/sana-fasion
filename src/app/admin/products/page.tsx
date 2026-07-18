'use client';
import { useEffect, useState } from 'react';
import { getAdminProducts, quickEditProduct, deleteProduct, bulkProductAction, seedAdmin } from '@/lib/adminApi';
import {
  Search, Plus, Filter, MoreHorizontal, Edit, Trash, Copy, Eye,
  Sparkles, Check, X, ShieldAlert, ChevronLeft, ChevronRight, Loader2, ChevronDown, Archive, Star, ShoppingCart, RefreshCw
} from 'lucide-react';
import Link from 'next/link';
import { useAdminStore } from '@/lib/adminStore';
import { motion } from 'framer-motion';

export default function ProductsPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [sortField, setSortField] = useState('createdAt');
  const [sortOrder, setSortOrder] = useState('desc');
  const [activeTab, setActiveTab] = useState('all');

  // Filter Drawer / Selection
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [bulkAction, setBulkAction] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  // Quick edit modal
  const [quickEditId, setQuickEditId] = useState<string | null>(null);
  const [quickPrice, setQuickPrice] = useState<number>(0);
  const [quickStock, setQuickStock] = useState<number>(0);
  const [quickFeatured, setQuickFeatured] = useState(false);
  const [quickNewArrival, setQuickNewArrival] = useState(false);
  const [quickBestSeller, setQuickBestSeller] = useState(false);
  const [quickStatus, setQuickStatus] = useState('draft');
  const [savingQuick, setSavingQuick] = useState(false);

  const { addToast } = useAdminStore();

  const tabs = [
    { id: 'all', label: 'All Products' },
    { id: 'draft', label: 'Drafts' },
    { id: 'published', label: 'Published' },
    { id: 'out_of_stock', label: 'Out of Stock' },
    { id: 'low_stock', label: 'Low Stock' },
    { id: 'featured', label: 'Featured' },
    { id: 'new_arrivals', label: 'New Arrivals' },
    { id: 'best_sellers', label: 'Best Sellers' },
    { id: 'archived', label: 'Archived' },
  ];

  const fetchProducts = () => {
    setLoading(true);

    // Map active tab to API params
    let statusParam: string | undefined = undefined;
    let stockStatusParam: string | undefined = undefined;
    let featuredParam: string | undefined = undefined;
    let newArrivalParam: string | undefined = undefined;
    let bestSellerParam: string | undefined = undefined;

    if (activeTab === 'draft') statusParam = 'draft';
    else if (activeTab === 'published') statusParam = 'published';
    else if (activeTab === 'archived') statusParam = 'archived';
    else if (activeTab === 'out_of_stock') stockStatusParam = 'out_of_stock';
    else if (activeTab === 'low_stock') stockStatusParam = 'low_stock';
    else if (activeTab === 'featured') featuredParam = 'true';
    else if (activeTab === 'new_arrivals') newArrivalParam = 'true';
    else if (activeTab === 'best_sellers') bestSellerParam = 'true';

    getAdminProducts({
      page,
      limit,
      search: search.trim() || undefined,
      category: category || undefined,
      status: statusParam,
      stockStatus: stockStatusParam,
      featured: featuredParam,
      newArrival: newArrivalParam,
      bestSeller: bestSellerParam,
      sort: `${sortOrder === 'desc' ? '-' : ''}${sortField}`,
    })
      .then((data) => {
        setProducts(data.products || []);
        setTotal(data.total || 0);
      })
      .catch((err) => {
        console.error(err);
        addToast({ type: 'error', message: 'Failed to load products.' });
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchProducts();
  }, [page, activeTab, category, sortField, sortOrder]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    fetchProducts();
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this product?')) return;
    try {
      await deleteProduct(id);
      addToast({ type: 'success', message: 'Product deleted successfully.' });
      fetchProducts();
    } catch {
      addToast({ type: 'error', message: 'Failed to delete product.' });
    }
  };

  const handleBulkAction = async () => {
    if (selectedIds.length === 0 || !bulkAction) return;
    if (!confirm(`Are you sure you want to perform "${bulkAction}" on ${selectedIds.length} items?`)) return;

    try {
      await bulkProductAction({ ids: selectedIds, action: bulkAction });
      addToast({ type: 'success', message: `Bulk action "${bulkAction}" applied successfully.` });
      setSelectedIds([]);
      setBulkAction('');
      fetchProducts();
    } catch {
      addToast({ type: 'error', message: 'Bulk action failed.' });
    }
  };

  const toggleSelectAll = () => {
    if (selectedIds.length === products.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(products.map(p => p._id));
    }
  };

  const toggleSelectOne = (id: string) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter(x => x !== id));
    } else {
      setSelectedIds([...selectedIds, id]);
    }
  };

  // Toggle quick edit
  const openQuickEdit = (p: any) => {
    setQuickEditId(p._id);
    setQuickPrice(p.price);
    setQuickStock(p.stock);
    setQuickFeatured(p.featured || false);
    setQuickNewArrival(p.newArrival || false);
    setQuickBestSeller(p.bestSeller || false);
    setQuickStatus(p.status || 'draft');
  };

  const handleQuickSave = async () => {
    if (!quickEditId) return;
    setSavingQuick(true);
    try {
      await quickEditProduct(quickEditId, {
        price: quickPrice,
        stock: quickStock,
        featured: quickFeatured,
        newArrival: quickNewArrival,
        bestSeller: quickBestSeller,
        status: quickStatus,
      });
      addToast({ type: 'success', message: 'Product updated successfully.' });
      setQuickEditId(null);
      fetchProducts();
    } catch {
      addToast({ type: 'error', message: 'Failed to save changes.' });
    } finally {
      setSavingQuick(false);
    }
  };

  return (
    <div className="space-y-6 p-4 md:p-10 max-w-full mx-auto animate-fade-in font-sans">
      
      {/* 🏷️ Title Row */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-[#E8E2D9] pb-6">
        <div>
          <h1 className="text-[28px] font-semibold text-[#1C1008]" style={{ fontFamily: 'Cormorant Garamond, serif' }}>
            Products Catalogue
          </h1>
          <p className="text-[13px] text-[#9B8E7E] mt-0.5">
            Manage, publish, and track your couture garments in the digital showroom.
          </p>
        </div>
        <Link href="/admin/products/new" className="btn-primary flex items-center gap-2 h-11 px-5">
          <Plus size={16} /> Add Product
        </Link>
      </div>

      {/* 🗂️ Luxury Segment Tabs */}
      <div className="flex overflow-x-auto border-b border-[#E8E2D9] pb-px scrollbar-none gap-2">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => { setActiveTab(tab.id); setPage(1); }}
            className={`px-4 py-3 text-[13px] font-medium transition-all duration-200 border-b-2 whitespace-nowrap cursor-pointer ${
              activeTab === tab.id
                ? 'border-[#C8851A] text-[#C8851A] font-semibold'
                : 'border-transparent text-[#9B8E7E] hover:text-[#1C1008]'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* 🔍 Search & Filters Bar */}
      <div className="bg-white border border-[#E8E2D9] rounded-[16px] p-4 flex flex-col md:flex-row gap-4 justify-between items-center shadow-sm">
        
        {/* Search Input */}
        <form onSubmit={handleSearchSubmit} className="relative w-full md:w-96 flex">
          <input
            type="text"
            placeholder="Search by name, SKU..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full h-11 pl-10 pr-4 rounded-xl border border-[#E8E2D9] bg-white text-[13px] outline-none focus:border-[#C8851A] transition-colors"
          />
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#9B8E7E]" />
          <button type="submit" className="hidden" />
        </form>

        {/* Filters Dropdown / Statuses */}
        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto justify-end">
          
          {/* Category Quick Filter */}
          <select
            value={category}
            onChange={(e) => { setCategory(e.target.value); setPage(1); }}
            className="h-11 px-3.5 rounded-xl border border-[#E8E2D9] text-[13px] bg-white text-[#1C1008] outline-none focus:border-[#C8851A]"
          >
            <option value="">All Categories</option>
            <option value="Wedding Collection">Wedding Collection</option>
            <option value="Festive Collection">Festive Collection</option>
            <option value="Casual">Casual</option>
            <option value="Accessories">Accessories</option>
          </select>

          {/* Sort Field */}
          <select
            value={`${sortField}-${sortOrder}`}
            onChange={(e) => {
              const [field, order] = e.target.value.split('-');
              setSortField(field);
              setSortOrder(order);
            }}
            className="h-11 px-3.5 rounded-xl border border-[#E8E2D9] text-[13px] bg-white text-[#1C1008] outline-none focus:border-[#C8851A]"
          >
            <option value="createdAt-desc">Newest First</option>
            <option value="createdAt-asc">Oldest First</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
            <option value="stock-desc">Stock: High to Low</option>
          </select>

          {/* Refresh Button */}
          <button onClick={fetchProducts} className="h-11 w-11 flex items-center justify-center rounded-xl border border-[#E8E2D9] hover:bg-gray-50 text-[#6B5E4C] cursor-pointer">
            <RefreshCw size={15} />
          </button>

        </div>
      </div>

      {/* 📦 Bulk Selection Actions Bar */}
      {selectedIds.length > 0 && (
        <div className="bg-amber-50 border border-[#E8D9C2] rounded-xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4 animate-slide-up">
          <span className="text-[13px] font-semibold text-[#8C5D19]">
            ✓ {selectedIds.length} products selected
          </span>
          <div className="flex gap-2">
            <select
              value={bulkAction}
              onChange={(e) => setBulkAction(e.target.value)}
              className="h-10 px-3 rounded-lg border border-[#E8D9C2] text-[12px] bg-white outline-none focus:border-[#C8851A]"
            >
              <option value="">Choose Action</option>
              <option value="publish">Publish Selection</option>
              <option value="archive">Archive Selection</option>
              <option value="delete">Delete Selection</option>
            </select>
            <button
              onClick={handleBulkAction}
              disabled={!bulkAction}
              className="px-4 py-2 bg-[#C8851A] text-white rounded-lg text-[12px] font-semibold hover:bg-[#B07414] transition-colors disabled:opacity-50 cursor-pointer"
            >
              Apply Action
            </button>
          </div>
        </div>
      )}

      {/* 🖥️ Shopify-Style Large Table Container */}
      <div className="bg-white border border-[#E8E2D9] rounded-[20px] overflow-hidden shadow-sm">
        
        {loading ? (
          <div className="p-20 text-center flex flex-col items-center justify-center gap-3">
            <Loader2 size={32} className="animate-spin text-[#C8851A]" />
            <p className="text-[13px] text-[#9B8E7E] font-medium">Fetching couture directory...</p>
          </div>
        ) : products.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#FAF8F5] border-b border-[#E8E2D9] text-[11px] font-semibold tracking-wider text-[#6B5E4C] uppercase">
                  <th className="py-4 px-6 w-12">
                    <input
                      type="checkbox"
                      checked={selectedIds.length === products.length && products.length > 0}
                      onChange={toggleSelectAll}
                      className="rounded border-[#E8E2D9] text-[#C8851A] focus:ring-[#C8851A]"
                    />
                  </th>
                  <th className="py-4 px-6">Image</th>
                  <th className="py-4 px-6">Product Name</th>
                  <th className="py-4 px-6">SKU</th>
                  <th className="py-4 px-6">Category</th>
                  <th className="py-4 px-6">Price</th>
                  <th className="py-4 px-6">Stock</th>
                  <th className="py-4 px-6">Status</th>
                  <th className="py-4 px-6">Badges</th>
                  <th className="py-4 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F0EDE8] text-[13px] text-[#1C1008]">
                {products.map((p) => {
                  const outOfStock = p.stock === 0;
                  const lowStock = p.stock > 0 && p.stock <= 5;
                  
                  return (
                    <tr key={p._id} className="hover:bg-[#FCFBF9] transition-colors">
                      
                      {/* Checkbox */}
                      <td className="py-4 px-6">
                        <input
                          type="checkbox"
                          checked={selectedIds.includes(p._id)}
                          onChange={() => toggleSelectOne(p._id)}
                          className="rounded border-[#E8E2D9] text-[#C8851A] focus:ring-[#C8851A]"
                        />
                      </td>

                      {/* Product Image */}
                      <td className="py-4 px-6">
                        <div className="w-12 h-16 rounded-md bg-gray-50 border border-[#E8E2D9] overflow-hidden flex-shrink-0">
                          {p.images?.[0] ? (
                            <img src={p.images[0]} alt={p.name} className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-[10px] text-[#9B8E7E]">No image</div>
                          )}
                        </div>
                      </td>

                      {/* Product Name */}
                      <td className="py-4 px-6 font-medium">
                        <div className="flex flex-col">
                          <span className="font-semibold hover:text-[#C8851A] transition-colors">{p.name}</span>
                          <span className="text-[11px] text-[#9B8E7E] mt-0.5">{p.fabric || 'Premium Fabric'}</span>
                        </div>
                      </td>

                      {/* SKU */}
                      <td className="py-4 px-6 text-mono text-[#6B5E4C]">{p.sku || 'N/A'}</td>

                      {/* Category */}
                      <td className="py-4 px-6 font-medium text-[#6B5E4C]">{p.category}</td>

                      {/* Price */}
                      <td className="py-4 px-6 font-semibold">₹{p.price?.toLocaleString('en-IN')}</td>

                      {/* Stock */}
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-1.5">
                          <span className={`w-1.5 h-1.5 rounded-full ${outOfStock ? 'bg-red-500' : lowStock ? 'bg-amber-500' : 'bg-emerald-500'}`} />
                          <span className="font-medium">
                            {p.stock} ({outOfStock ? 'Out of stock' : lowStock ? 'Low stock' : 'In stock'})
                          </span>
                        </div>
                      </td>

                      {/* Status */}
                      <td className="py-4 px-6">
                        <span className={`badge-${p.status || 'draft'}`}>
                          {p.status || 'draft'}
                        </span>
                      </td>

                      {/* Badges */}
                      <td className="py-4 px-6">
                        <div className="flex flex-wrap gap-1">
                          {p.featured && <span className="px-2 py-0.5 bg-yellow-50 text-yellow-700 text-[10px] font-bold rounded border border-yellow-200 uppercase tracking-wider">Featured</span>}
                          {p.newArrival && <span className="px-2 py-0.5 bg-blue-50 text-blue-700 text-[10px] font-bold rounded border border-blue-200 uppercase tracking-wider">New</span>}
                          {p.bestSeller && <span className="px-2 py-0.5 bg-emerald-50 text-emerald-700 text-[10px] font-bold rounded border border-emerald-200 uppercase tracking-wider">Bestseller</span>}
                        </div>
                      </td>

                      {/* Actions */}
                      <td className="py-4 px-6 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => openQuickEdit(p)}
                            title="Quick Edit"
                            className="p-1.5 rounded-md hover:bg-gray-100 text-[#6B5E4C] cursor-pointer"
                          >
                            <Edit size={14} />
                          </button>
                          <Link
                            href={`/admin/products/${p._id}`}
                            title="Edit Full Details"
                            className="p-1.5 rounded-md hover:bg-gray-100 text-[#C8851A] cursor-pointer"
                          >
                            <Eye size={14} />
                          </Link>
                          <button
                            onClick={() => handleDelete(p._id)}
                            title="Delete Product"
                            className="p-1.5 rounded-md hover:bg-red-50 text-red-600 cursor-pointer"
                          >
                            <Trash size={14} />
                          </button>
                        </div>
                      </td>

                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-20 text-center flex flex-col items-center justify-center gap-4 text-[#9B8E7E] text-[14px]">
            <p>No couture products matching this segment found.</p>
            <button
              onClick={async () => {
                try {
                  setLoading(true);
                  await seedAdmin();
                  addToast({ type: 'success', message: 'Showcase garments seeded successfully!' });
                  fetchProducts();
                } catch {
                  addToast({ type: 'error', message: 'Failed to seed data.' });
                  setLoading(false);
                }
              }}
              className="px-5 py-2.5 bg-[#C8851A] text-white font-semibold rounded-xl text-[12px] tracking-wide hover:bg-[#B07414] transition-colors cursor-pointer flex items-center gap-2"
            >
              <Sparkles size={14} /> Seed Showcase Garments
            </button>
          </div>
        )}

      </div>

      {/* 📟 Pagination Foot */}
      {products.length > 0 && (
        <div className="flex justify-between items-center px-2">
          <span className="text-[12px] text-[#9B8E7E]">
            Showing {(page - 1) * limit + 1} - {Math.min(page * limit, total)} of {total} listings
          </span>
          <div className="flex gap-2">
            <button
              onClick={() => setPage(p => Math.max(p - 1, 1))}
              disabled={page === 1}
              className="p-2 rounded-lg border border-[#E8E2D9] hover:bg-gray-50 disabled:opacity-40 cursor-pointer"
            >
              <ChevronLeft size={16} />
            </button>
            <button
              onClick={() => setPage(p => (p * limit < total ? p + 1 : p))}
              disabled={page * limit >= total}
              className="p-2 rounded-lg border border-[#E8E2D9] hover:bg-gray-50 disabled:opacity-40 cursor-pointer"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      )}

      {/* 📝 Quick Edit Modal Drawer */}
      {quickEditId && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white border border-[#E8E2D9] rounded-[24px] max-w-md w-full p-6 shadow-2xl relative"
          >
            <button
              onClick={() => setQuickEditId(null)}
              className="absolute right-5 top-5 p-1 rounded-full hover:bg-gray-100 text-[#9B8E7E] cursor-pointer"
            >
              <X size={18} />
            </button>
            
            <h3 className="text-[18px] font-semibold text-[#1C1008] border-b border-[#E8E2D9] pb-3" style={{ fontFamily: 'Cormorant Garamond, serif' }}>
              Quick Edit Garment Listing
            </h3>

            <div className="space-y-4 mt-5">
              
              {/* Price */}
              <div>
                <label className="block text-[11px] font-semibold tracking-wider uppercase text-[#6B5E4C] mb-1.5">Price (₹)</label>
                <input
                  type="number"
                  value={quickPrice}
                  onChange={(e) => setQuickPrice(Number(e.target.value))}
                  className="w-full h-11 px-3.5 rounded-xl border border-[#E8E2D9] text-[13px] outline-none focus:border-[#C8851A]"
                />
              </div>

              {/* Stock */}
              <div>
                <label className="block text-[11px] font-semibold tracking-wider uppercase text-[#6B5E4C] mb-1.5">Stock Count</label>
                <input
                  type="number"
                  value={quickStock}
                  onChange={(e) => setQuickStock(Number(e.target.value))}
                  className="w-full h-11 px-3.5 rounded-xl border border-[#E8E2D9] text-[13px] outline-none focus:border-[#C8851A]"
                />
              </div>

              {/* Status */}
              <div>
                <label className="block text-[11px] font-semibold tracking-wider uppercase text-[#6B5E4C] mb-1.5">Publish Status</label>
                <select
                  value={quickStatus}
                  onChange={(e) => setQuickStatus(e.target.value)}
                  className="w-full h-11 px-3.5 rounded-xl border border-[#E8E2D9] text-[13px] outline-none focus:border-[#C8851A] bg-white"
                >
                  <option value="draft">Draft</option>
                  <option value="published">Published</option>
                  <option value="archived">Archived</option>
                </select>
              </div>

              {/* Badges */}
              <div className="pt-2 space-y-2.5">
                <label className="block text-[11px] font-semibold tracking-wider uppercase text-[#6B5E4C]">Couture Badges</label>
                <div className="grid grid-cols-3 gap-2">
                  <label className="flex items-center gap-1.5 text-[12px] text-[#6B5E4C] cursor-pointer">
                    <input
                      type="checkbox"
                      checked={quickFeatured}
                      onChange={(e) => setQuickFeatured(e.target.checked)}
                      className="rounded border-[#E8E2D9] text-[#C8851A] focus:ring-[#C8851A]"
                    />
                    Featured
                  </label>
                  <label className="flex items-center gap-1.5 text-[12px] text-[#6B5E4C] cursor-pointer">
                    <input
                      type="checkbox"
                      checked={quickNewArrival}
                      onChange={(e) => setQuickNewArrival(e.target.checked)}
                      className="rounded border-[#E8E2D9] text-[#C8851A] focus:ring-[#C8851A]"
                    />
                    New
                  </label>
                  <label className="flex items-center gap-1.5 text-[12px] text-[#6B5E4C] cursor-pointer">
                    <input
                      type="checkbox"
                      checked={quickBestSeller}
                      onChange={(e) => setQuickBestSeller(e.target.checked)}
                      className="rounded border-[#E8E2D9] text-[#C8851A] focus:ring-[#C8851A]"
                    />
                    Bestseller
                  </label>
                </div>
              </div>

            </div>

            <div className="mt-6 flex justify-end gap-2 border-t border-[#E8E2D9] pt-4">
              <button
                onClick={() => setQuickEditId(null)}
                className="px-4 py-2 border border-[#E8E2D9] rounded-xl text-[12.5px] text-[#6B5E4C] hover:bg-gray-50 cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleQuickSave}
                disabled={savingQuick}
                className="px-5 py-2 bg-[#C8851A] text-white rounded-xl text-[12.5px] font-semibold hover:bg-[#B07414] disabled:opacity-50 cursor-pointer"
              >
                {savingQuick ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </motion.div>
        </div>
      )}

    </div>
  );
}
