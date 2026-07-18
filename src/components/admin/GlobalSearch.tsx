'use client';
import { useEffect, useState, useRef } from 'react';
import { useAdminStore } from '@/lib/adminStore';
import { Search, X, Package, FolderOpen, CalendarDays, ShoppingBag, Globe, FileImage } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { AnimatePresence, motion } from 'framer-motion';
import { api } from '@/lib/adminApi';

interface SearchResult {
  id: string;
  title: string;
  subtitle?: string;
  type: 'product' | 'collection' | 'appointment' | 'order' | 'cms' | 'media';
  link: string;
}

export default function GlobalSearch() {
  const { searchOpen, setSearchOpen } = useAdminStore();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setSearchOpen(!searchOpen);
      }
      if (e.key === 'Escape') {
        setSearchOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [searchOpen, setSearchOpen]);

  useEffect(() => {
    if (searchOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
      setQuery('');
      setResults([]);
    }
  }, [searchOpen]);

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }

    const delayDebounce = setTimeout(async () => {
      setLoading(true);
      try {
        // Parallel search query across endpoints
        const [prodRes, collRes, appRes] = await Promise.all([
          api.get(`/admin/products?search=${query}&limit=5`).catch(() => ({ data: { products: [] } })),
          api.get(`/admin/collections?search=${query}`).catch(() => ({ data: { collections: [] } })),
          api.get(`/appointments?search=${query}`).catch(() => ({ data: { appointments: [] } })),
        ]);

        const merged: SearchResult[] = [];

        // Add Products
        (prodRes.data?.products || []).forEach((p: any) => {
          merged.push({
            id: p._id,
            title: p.name,
            subtitle: `${p.category} • ₹${p.price.toLocaleString('en-IN')}`,
            type: 'product',
            link: `/admin/products/${p._id}`,
          });
        });

        // Add Collections
        (collRes.data?.collections || []).forEach((c: any) => {
          merged.push({
            id: c._id,
            title: c.name,
            subtitle: c.season ? `${c.season} Collection` : 'Collection',
            type: 'collection',
            link: `/admin/collections/${c._id}`,
          });
        });

        // Add Appointments
        (appRes.data?.appointments || []).forEach((a: any) => {
          merged.push({
            id: a._id,
            title: a.name,
            subtitle: `${a.serviceType} • ${new Date(a.date).toLocaleDateString('en-IN')}`,
            type: 'appointment',
            link: `/admin/appointments`,
          });
        });

        setResults(merged);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }, 300);

    return () => clearTimeout(delayDebounce);
  }, [query]);

  const handleNavigate = (link: string) => {
    router.push(link);
    setSearchOpen(false);
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'product': return <Package size={15} className="text-amber-600" />;
      case 'collection': return <FolderOpen size={15} className="text-blue-600" />;
      case 'appointment': return <CalendarDays size={15} className="text-emerald-600" />;
      case 'order': return <ShoppingBag size={15} className="text-purple-600" />;
      case 'cms': return <Globe size={15} className="text-indigo-600" />;
      default: return <FileImage size={15} className="text-gray-500" />;
    }
  };

  if (!searchOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[999] flex items-start justify-center pt-[15vh]">
        <motion.div
          initial={{ opacity: 0, scale: 0.97, y: -8 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.97, y: -8 }}
          transition={{ duration: 0.15 }}
          className="w-full max-w-[560px] bg-white rounded-xl shadow-modal overflow-hidden border border-[#E8E2D9] mx-4"
        >
          {/* Header */}
          <div className="flex items-center gap-3 px-4 py-3 border-b border-[#E8E2D9]">
            <Search size={18} className="text-[#9B8E7E]" />
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search products, collections, appointments..."
              className="flex-1 text-[14px] text-[#1C1008] placeholder-[#9B8E7E] outline-none"
            />
            {query && (
              <button onClick={() => setQuery('')} className="p-1 hover:bg-gray-100 rounded cursor-pointer">
                <X size={14} className="text-[#9B8E7E]" />
              </button>
            )}
            <kbd className="text-[10px] px-1.5 py-0.5 bg-[#F5F5F4] rounded border border-gray-200 text-[#9B8E7E]">ESC</kbd>
          </div>

          {/* Results Body */}
          <div className="max-h-[360px] overflow-y-auto p-2">
            {loading ? (
              <div className="py-8 text-center text-[13px] text-[#9B8E7E]">Searching...</div>
            ) : results.length > 0 ? (
              <div className="space-y-0.5">
                {results.map((r) => (
                  <button
                    key={r.id}
                    onClick={() => handleNavigate(r.link)}
                    className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-[rgba(200,133,26,0.04)] text-left cursor-pointer transition-colors"
                  >
                    <div className="w-7 h-7 rounded bg-gray-50 flex items-center justify-center flex-shrink-0">
                      {getIcon(r.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[13px] font-medium text-[#1C1008] truncate">{r.title}</p>
                      {r.subtitle && <p className="text-[11px] text-[#9B8E7E] truncate mt-0.5">{r.subtitle}</p>}
                    </div>
                    <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-gray-100 text-[#6B5E4C]">
                      {r.type}
                    </span>
                  </button>
                ))}
              </div>
            ) : query.trim() ? (
              <div className="py-8 text-center text-[13px] text-[#9B8E7E]">No results found for "{query}"</div>
            ) : (
              <div className="py-6 px-4 text-center">
                <p className="text-[13px] text-[#6B5E4C] font-medium">Quick Searches</p>
                <div className="flex flex-wrap justify-center gap-1.5 mt-3">
                  {['Lehenga', 'Anarkali', 'Bridal', 'Suits', 'Wedding'].map((term) => (
                    <button
                      key={term}
                      onClick={() => setQuery(term)}
                      className="px-2.5 py-1 text-[11px] font-medium border border-[#E8E2D9] rounded-full hover:border-[#C8851A] hover:bg-[rgba(200,133,26,0.03)] text-[#6B5E4C] cursor-pointer"
                    >
                      {term}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
