'use client';
import { useEffect, useState } from 'react';
import {
  getAdminProducts, quickEditProduct, deleteProduct,
  getAdminCategories, seedAdmin
} from '@/lib/adminApi';
import {
  Search, Plus, Loader2, Sparkles, LayoutGrid, ChevronLeft, ChevronRight, Package
} from 'lucide-react';
import Link from 'next/link';
import { useAdminStore } from '@/lib/adminStore';

// Design System components
import PageLayout from '@/design-system/layouts/PageLayout';
import PageHeader from '@/design-system/layouts/PageHeader';
import PageContent from '@/design-system/layouts/PageContent';
import Button from '@/design-system/components/Button';
import Input, { Dropdown } from '@/design-system/components/Input';
import ProductCard from '@/design-system/components/ProductCard';
import BottomSheet from '@/design-system/components/BottomSheet';
import EmptyState from '@/design-system/components/EmptyState';
import Badge from '@/design-system/components/Badge';

export default function ProductsPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [seeding, setSeeding] = useState(false);
  const { addToast } = useAdminStore();

  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [categoriesList, setCategoriesList] = useState<any[]>([]);

  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [total, setTotal] = useState(0);

  const [selectedProduct, setSelectedProduct] = useState<any>(null);

  useEffect(() => {
    getAdminCategories()
      .then(data => setCategoriesList(data.categories || []))
      .catch(() => {});
  }, []);

  const fetchProducts = () => {
    setLoading(true);
    const params: any = {
      page,
      limit,
      search: search.trim() || undefined,
      category: category || undefined,
      status: statusFilter || undefined,
    };
    getAdminProducts(params)
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
  }, [page, category, statusFilter]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    fetchProducts();
  };

  const handleToggleStock = async (p: any) => {
    const isOut = p.stock === 0;
    const newStock = isOut ? 15 : 0;
    const newStatus = isOut ? 'in_stock' : 'out_of_stock';
    try {
      await quickEditProduct(p._id, { stock: newStock, stockStatus: newStatus });
      addToast({ type: 'success', message: `"${p.name}" marked ${isOut ? 'In Stock' : 'Out of Stock'}!` });
      
      setProducts((prev: any[]) => prev.map(item => item._id === p._id ? { ...item, stock: newStock, stockStatus: newStatus } : item));
      if (selectedProduct?._id === p._id) {
        setSelectedProduct((prev: any) => ({ ...prev, stock: newStock, stockStatus: newStatus }));
      }
    } catch {
      addToast({ type: 'error', message: 'Failed to toggle stock.' });
    }
  };

  const handleDelete = async (p: any) => {
    if (!confirm(`Are you sure you want to delete "${p.name}"?`)) return;
    try {
      await deleteProduct(p._id);
      addToast({ type: 'success', message: 'Product deleted.' });
      
      if (selectedProduct?._id === p._id) {
        setSelectedProduct(null);
      }
      fetchProducts();
    } catch {
      addToast({ type: 'error', message: 'Failed to delete product.' });
    }
  };

  const handleSeed = async () => {
    setSeeding(true);
    try {
      await seedAdmin();
      addToast({ type: 'success', message: 'Demo catalog synchronized!' });
      fetchProducts();
    } catch {
      addToast({ type: 'error', message: 'Failed to synchronize.' });
    } finally {
      setSeeding(false);
    }
  };

  return (
    <PageLayout maxWidth="desktop">
      
      {/* Page Header */}
      <PageHeader
        title="Products"
        subtitle="Design catalog & boutique collection listings"
        actions={
          <Link href="/admin/products/new">
            <button className="h-11 w-11 rounded-[10px] bg-[#C8851A] hover:bg-[#B07414] text-white flex items-center justify-center cursor-pointer shadow active:scale-95 transition-transform">
              <Plus size={20} strokeWidth={2.5} />
            </button>
          </Link>
        }
      />

      {/* Search & Filter Row */}
      <div className="flex flex-col sm:flex-row gap-3 mb-4">
        <form onSubmit={handleSearchSubmit} className="relative flex-1">
          <Input
            label="Search catalog..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            icon={<Search size={15} />}
          />
        </form>

        <Dropdown
          label="Catalog Status"
          value={statusFilter}
          onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
          options={[
            { value: '', label: 'All Statuses' },
            { value: 'published', label: 'Published' },
            { value: 'draft', label: 'Draft' },
            { value: 'archived', label: 'Archived' }
          ]}
          containerClassName="w-full sm:w-56"
        />
      </div>

      {/* Category scrollable row */}
      <div className="scroll-pills flex items-center mb-6">
        <button
          onClick={() => { setCategory(''); setPage(1); }}
          className={`h-9 px-4 rounded-[8px] text-[12px] font-bold border whitespace-nowrap flex-shrink-0 transition-colors cursor-pointer ${
            category === '' ? 'bg-[#C8851A] text-white border-[#C8851A]' : 'bg-white border-[#E8E2D9] text-[#6B5E4C] hover:bg-gray-50'
          }`}
        >
          All Categories
        </button>
        {categoriesList.map(c => (
          <button
            key={c._id}
            onClick={() => { setCategory(c.name); setPage(1); }}
            className={`h-9 px-4 rounded-[8px] text-[12px] font-bold border whitespace-nowrap flex-shrink-0 transition-colors cursor-pointer ${
              category === c.name ? 'bg-[#C8851A] text-white border-[#C8851A]' : 'bg-white border-[#E8E2D9] text-[#6B5E4C] hover:bg-gray-50'
            }`}
          >
            {c.name}
          </button>
        ))}
      </div>

      {/* Catalog lists */}
      {loading ? (
        <div className="py-20 text-center flex flex-col items-center justify-center gap-2">
          <Loader2 className="animate-spin text-[#C8851A]" size={28} />
          <p className="text-[12px] text-[#9B8E7E] font-medium">Fetching design files...</p>
        </div>
      ) : products.length > 0 ? (
        <PageContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
            {products.map((p) => (
              <ProductCard
                key={p._id}
                product={p}
                onSelect={() => setSelectedProduct(p)}
                onToggleStock={() => handleToggleStock(p)}
                onDelete={() => handleDelete(p)}
              />
            ))}
          </div>

          {/* Pagination controls */}
          <div className="flex items-center justify-between pt-4 border-t border-[#E6C280]/15 px-1">
            <button
              onClick={() => setPage(p => Math.max(p - 1, 1))}
              disabled={page === 1}
              className="h-10 px-4 border border-[#E8E2D9] rounded-[10px] disabled:opacity-40 font-bold text-[12px] flex items-center gap-1 bg-white cursor-pointer"
            >
              <ChevronLeft size={14} /> Prev
            </button>
            <span className="text-[12px] text-[#9B8E7E] font-medium">Page {page} of {Math.ceil(total / limit) || 1}</span>
            <button
              onClick={() => setPage(p => (p * limit < total ? p + 1 : p))}
              disabled={page * limit >= total}
              className="h-10 px-4 border border-[#E8E2D9] rounded-[10px] disabled:opacity-40 font-bold text-[12px] flex items-center gap-1 bg-white cursor-pointer"
            >
              Next <ChevronRight size={14} />
            </button>
          </div>
        </PageContent>
      ) : (
        /* Empty state placeholder */
        <EmptyState
          icon={<LayoutGrid size={28} />}
          title="No garments catalogued"
          description="Start cataloguing your luxury apparel collections in the digital boutique."
        >
          <Link href="/admin/products/new" className="w-full">
            <Button variant="primary" className="w-full">
              Add Product
            </Button>
          </Link>
          <Button
            variant="secondary"
            onClick={handleSeed}
            disabled={seeding}
            className="w-full"
            icon={seeding ? <Loader2 size={13} className="animate-spin" /> : <Sparkles size={13} />}
          >
            Import Products
          </Button>
        </EmptyState>
      )}

      {/* Apple style sliding drawer sheet */}
      <BottomSheet isOpen={!!selectedProduct} onClose={() => setSelectedProduct(null)}>
        {selectedProduct && (
          <div className="px-4 pt-2 pb-6 space-y-5">
            <div className="aspect-[16/10] max-h-[260px] rounded-[12px] bg-gray-50 border border-[#E6C280]/20 overflow-hidden relative">
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
