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
      if (data.success) {
        addToast({ type: 'success', message: 'Product created successfully.' });
        router.push('/admin/products');
      }
    } catch {
      addToast({ type: 'error', message: 'Failed to create product.' });
    }
  };

  return (
    <PageLayout maxWidth="form">
      <PageHeader
        title="Create New Garment"
        subtitle="Formulate new premium bridal collections & apparel."
      />

      <ProductForm onSubmit={handleCreate} />
    </PageLayout>
  );
}
