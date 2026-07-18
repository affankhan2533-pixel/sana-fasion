'use client';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { getAdminProduct, updateProduct } from '@/lib/adminApi';
import ProductForm from '@/components/admin/ProductForm';
import { useAdminStore } from '@/lib/adminStore';
import { Loader2 } from 'lucide-react';

// Design System components
import PageLayout from '@/design-system/layouts/PageLayout';
import PageHeader from '@/design-system/layouts/PageHeader';

export default function EditProductPage() {
  const params = useParams();
  const router = useRouter();
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
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

  if (loading) {
    return (
      <div className="py-20 text-center flex flex-col items-center justify-center gap-2">
        <Loader2 className="animate-spin text-[#C8851A] mx-auto" size={28} />
        <p className="text-[12px] text-[#9B8E7E]">Loading garment details...</p>
      </div>
    );
  }

  if (!product) {
    return <div className="text-center py-20 text-red-500 font-bold">Product not found.</div>;
  }

  return (
    <PageLayout maxWidth="form">
      <PageHeader
        title="Edit Garment"
        subtitle="Refine pricing, images, and description details."
      />

      <ProductForm initialData={product} onSubmit={handleUpdate} />
    </PageLayout>
  );
}
