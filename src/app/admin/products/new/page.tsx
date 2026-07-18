'use client';
import { createProduct } from '@/lib/adminApi';
import ProductForm from '@/components/admin/ProductForm';
import { useRouter } from 'next/navigation';
import { useAdminStore } from '@/lib/adminStore';

export default function NewProductPage() {
  const router = useRouter();
  const { addToast } = useAdminStore();

  const handleCreate = async (payload: any) => {
    try {
      const data = await createProduct(payload);
      if (data.success) {
        addToast({ type: 'success', message: 'Product created successfully.' });
        router.push('/admin/products');
      }
    } catch {
      addToast({ type: 'error', message: 'Failed to create product.' });
    }
  };

  return (
    <div className="space-y-6">
      <div className="page-header">
        <div>
          <h1 className="page-title">Create New Garment</h1>
          <p className="page-subtitle">Formulate new premium bridal collections & apparel.</p>
        </div>
      </div>

      <ProductForm onSubmit={handleCreate} />
    </div>
  );
}
