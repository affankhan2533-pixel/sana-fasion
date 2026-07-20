'use client';
import { createProduct } from '@/lib/adminApi';
import ProductForm from '@/components/admin/ProductForm';
import { useRouter } from 'next/navigation';
import { useAdminStore } from '@/lib/adminStore';

// Design System layouts
import PageLayout from '@/design-system/layouts/PageLayout';
import PageHeader from '@/design-system/layouts/PageHeader';

export default function NewProductPage() {
  const router = useRouter();
  const { addToast } = useAdminStore();

  const handleCreate = async (payload: any) => {
    try {
      const data = await createProduct(payload);
      if (data.success || data.product) {
        addToast({ type: 'success', message: 'Garment created and added to boutique catalog!' });
        router.push('/admin/products');
      } else {
        addToast({ type: 'error', message: data.message || 'Failed to create product.' });
      }
    } catch (err: any) {
      const msg = err.response?.data?.message || 'Failed to create product.';
      addToast({ type: 'error', message: msg });
    }
  };

  return (
    <PageLayout maxWidth="desktop">
      <div className="max-w-4xl mx-auto">
        <PageHeader
          title="Create New Garment"
          subtitle="Formulate new premium bridal collections & apparel."
        />

        <ProductForm onSubmit={handleCreate} />
      </div>
    </PageLayout>
  );
}
