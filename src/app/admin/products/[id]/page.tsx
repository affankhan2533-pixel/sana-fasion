'use client';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { getAdminProduct, updateProduct, getProductRevisions, restoreProductRevision } from '@/lib/adminApi';
import ProductForm from '@/components/admin/ProductForm';
import { useAdminStore } from '@/lib/adminStore';
import { Loader2, History, RotateCcw } from 'lucide-react';

export default function EditProductPage() {
  const params = useParams();
  const router = useRouter();
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [revisions, setRevisions] = useState<any[]>([]);
  const [showHistory, setShowHistory] = useState(false);
  const { addToast } = useAdminStore();
  const id = params?.id as string;

  const fetchProductData = () => {
    if (!id) return;
    setLoading(true);
    getAdminProduct(id)
      .then((data) => {
        setProduct(data.product);
      })
      .catch((err) => {
        console.error(err);
        addToast({ type: 'error', message: 'Failed to load product.' });
      })
      .finally(() => setLoading(false));

    getProductRevisions(id)
      .then((data) => setRevisions(data.revisions || []))
      .catch((err) => console.error(err));
  };

  useEffect(() => {
    fetchProductData();
  }, [id]);

  const handleUpdate = async (payload: any) => {
    try {
      await updateProduct(id, payload);
      addToast({ type: 'success', message: 'Product updated successfully.' });
      router.push('/admin/products');
    } catch {
      addToast({ type: 'error', message: 'Failed to update product.' });
    }
  };

  const handleRestore = async (revId: string) => {
    if (!confirm('Are you sure you want to restore this older version?')) return;
    try {
      await restoreProductRevision(id, revId);
      addToast({ type: 'success', message: 'Older version restored!' });
      setShowHistory(false);
      fetchProductData();
    } catch {
      addToast({ type: 'error', message: 'Failed to restore revision.' });
    }
  };

  if (loading) {
    return (
      <div className="py-20 text-center">
        <Loader2 className="animate-spin text-[#C8851A] mx-auto mb-3" size={24} />
        <p className="text-[13px] text-[#9B8E7E]">Loading garment details...</p>
      </div>
    );
  }

  if (!product) {
    return <div className="text-center py-20 text-red-500">Product not found.</div>;
  }

  return (
    <div className="space-y-6">
      <div className="page-header">
        <div>
          <h1 className="page-title">Edit Garment: {product.name}</h1>
          <p className="page-subtitle">Refine pricing, variants, and descriptions.</p>
        </div>
        {revisions.length > 0 && (
          <button
            onClick={() => setShowHistory(!showHistory)}
            className="btn-secondary flex items-center gap-1.5"
          >
            <History size={14} /> History ({revisions.length})
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Main form */}
        <div className={showHistory ? 'lg:col-span-3' : 'lg:col-span-4'}>
          <ProductForm initialData={product} onSubmit={handleUpdate} />
        </div>

        {/* History / Revision sidebar panel */}
        {showHistory && (
          <div className="admin-card p-4 space-y-3 h-fit animate-slide-in-right">
            <h3 className="text-[14px] font-semibold text-[#1C1008] border-b border-[#F0EDE8] pb-1.5" style={{ fontFamily: 'Cormorant Garamond, serif' }}>
              Revision History
            </h3>
            <div className="space-y-3 max-h-[480px] overflow-y-auto pr-1">
              {revisions.map((rev) => (
                <div key={rev._id} className="p-3 bg-[#FAFAF8] rounded-lg border border-[#E8E2D9] text-[12px] space-y-2">
                  <div>
                    <p className="font-semibold text-[#1C1008]">{rev.label}</p>
                    <p className="text-[10px] text-[#9B8E7E] mt-0.5">
                      By {rev.createdBy?.name || 'Admin'}
                    </p>
                  </div>
                  <button
                    onClick={() => handleRestore(rev._id)}
                    className="w-full flex items-center justify-center gap-1 btn-secondary py-1 px-2 text-[11px] border-amber-600 text-amber-600"
                  >
                    <RotateCcw size={11} /> Restore version
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
