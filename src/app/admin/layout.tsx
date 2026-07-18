'use client';
import './admin.css';
import AdminLayout from '@/design-system/layouts/AdminLayout';

export default function RootAdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <AdminLayout>
      {children}
    </AdminLayout>
  );
}
