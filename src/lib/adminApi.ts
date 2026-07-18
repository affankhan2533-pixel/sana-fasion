import axios from 'axios';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export const api = axios.create({ baseURL: API_BASE, timeout: 30000 });

// Attach token from localStorage on each request
api.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    try {
      const stored = JSON.parse(localStorage.getItem('sana-admin-store') || '{}');
      const token = stored?.state?.token;
      if (token) config.headers.Authorization = `Bearer ${token}`;
    } catch {}
  }
  return config;
});

// Redirect to login on 401
api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401 && typeof window !== 'undefined') {
      localStorage.removeItem('sana-admin-store');
      window.location.href = '/admin/login';
    }
    return Promise.reject(err);
  }
);

// ── Dashboard ────────────────────────────────────────────────────────────────
export const getDashboardStats = () => api.get('/dashboard/stats').then(r => r.data);
export const changePassword = (data: unknown) => api.put('/auth/change-password', data).then(r => r.data);

// ── Products ─────────────────────────────────────────────────────────────────
export const getAdminProducts = (params?: Record<string, unknown>) =>
  api.get('/admin/products', { params }).then(r => r.data);
export const getAdminProduct = (id: string) => api.get(`/admin/products/${id}`).then(r => r.data);
export const createProduct = (data: unknown) => api.post('/admin/products', data).then(r => r.data);
export const updateProduct = (id: string, data: unknown) => api.put(`/admin/products/${id}`, data).then(r => r.data);
export const quickEditProduct = (id: string, data: unknown) => api.patch(`/admin/products/${id}/quick-edit`, data).then(r => r.data);
export const deleteProduct = (id: string) => api.delete(`/admin/products/${id}`).then(r => r.data);
export const duplicateProduct = (id: string) => api.post(`/admin/products/${id}/duplicate`).then(r => r.data);
export const bulkProductAction = (data: unknown) => api.post('/admin/products/bulk', data).then(r => r.data);
export const generateProductContent = (data: unknown) => api.post('/admin/products/ai/generate', data).then(r => r.data);
export const getProductRevisions = (id: string) => api.get(`/admin/products/${id}/revisions`).then(r => r.data);
export const restoreProductRevision = (id: string, revId: string) =>
  api.post(`/admin/products/${id}/restore/${revId}`).then(r => r.data);

// ── Collections ───────────────────────────────────────────────────────────────
export const getCollections = (params?: Record<string, unknown>) =>
  api.get('/admin/collections', { params }).then(r => r.data);
export const getCollection = (id: string) => api.get(`/admin/collections/${id}`).then(r => r.data);
export const createCollection = (data: unknown) => api.post('/admin/collections', data).then(r => r.data);
export const updateCollection = (id: string, data: unknown) => api.put(`/admin/collections/${id}`, data).then(r => r.data);
export const deleteCollection = (id: string) => api.delete(`/admin/collections/${id}`).then(r => r.data);
export const reorderCollections = (orders: { id: string; order: number }[]) =>
  api.post('/admin/collections/reorder', { orders }).then(r => r.data);

// ── Appointments ──────────────────────────────────────────────────────────────
export const getAppointments = (params?: Record<string, unknown>) =>
  api.get('/appointments', { params }).then(r => r.data);
export const updateAppointment = (id: string, data: unknown) =>
  api.put(`/appointments/${id}`, data).then(r => r.data);

// ── Inquiries ─────────────────────────────────────────────────────────────────
export const getInquiries = (params?: Record<string, unknown>) =>
  api.get('/inquiries', { params }).then(r => r.data);
export const updateInquiry = (id: string, data: unknown) =>
  api.put(`/inquiries/${id}`, data).then(r => r.data);
export const deleteInquiry = (id: string) =>
  api.delete(`/inquiries/${id}`).then(r => r.data);

// ── CMS ───────────────────────────────────────────────────────────────────────
export const getCmsSections = () => api.get('/admin/cms').then(r => r.data);
export const getCmsSection = (key: string) => api.get(`/admin/cms/${key}`).then(r => r.data);
export const updateCmsSection = (key: string, data: unknown) =>
  api.put(`/admin/cms/${key}`, data).then(r => r.data);
export const toggleSectionVisibility = (key: string, visible: boolean) =>
  api.patch(`/admin/cms/${key}/visibility`, { visible }).then(r => r.data);
export const reorderCmsSections = (orders: { id: string; order: number }[]) =>
  api.post('/admin/cms/reorder', { orders }).then(r => r.data);
export const seedCmsSections = () => api.post('/admin/cms/seed').then(r => r.data);
export const getSectionRevisions = (key: string) => api.get(`/admin/cms/${key}/revisions`).then(r => r.data);
export const restoreSectionRevision = (key: string, revId: string) =>
  api.post(`/admin/cms/${key}/restore/${revId}`).then(r => r.data);

// ── Media ─────────────────────────────────────────────────────────────────────
export const getMedia = (params?: Record<string, unknown>) =>
  api.get('/admin/media', { params }).then(r => r.data);
export const uploadMedia = (formData: FormData) =>
  api.post('/admin/media/upload', formData, { headers: { 'Content-Type': 'multipart/form-data' } }).then(r => r.data);
export const updateMedia = (id: string, data: unknown) => api.patch(`/admin/media/${id}`, data).then(r => r.data);
export const deleteMedia = (id: string) => api.delete(`/admin/media/${id}`).then(r => r.data);
export const bulkDeleteMedia = (ids: string[]) => api.post('/admin/media/bulk-delete', { ids }).then(r => r.data);

// ── Admin Users ───────────────────────────────────────────────────────────────
export const getAdminUsers = () => api.get('/admin/users').then(r => r.data);
export const createAdminUser = (data: unknown) => api.post('/admin/users', data).then(r => r.data);
export const updateAdminUser = (id: string, data: unknown) => api.put(`/admin/users/${id}`, data).then(r => r.data);
export const deleteAdminUser = (id: string) => api.delete(`/admin/users/${id}`).then(r => r.data);

// ── Categories ───────────────────────────────────────────────────────────────
export const getAdminCategories = (params?: Record<string, unknown>) =>
  api.get('/admin/categories', { params }).then(r => r.data);
export const getAdminCategory = (id: string) => api.get(`/admin/categories/${id}`).then(r => r.data);
export const createCategory = (data: unknown) => api.post('/admin/categories', data).then(r => r.data);
export const updateCategory = (id: string, data: unknown) => api.put(`/admin/categories/${id}`, data).then(r => r.data);
export const deleteCategory = (id: string) => api.delete(`/admin/categories/${id}`).then(r => r.data);
export const reorderCategories = (orders: { id: string; order: number }[]) =>
  api.post('/admin/categories/reorder', { orders }).then(r => r.data);

// ── Customers ────────────────────────────────────────────────────────────────
export const getAdminCustomers = (params?: Record<string, unknown>) =>
  api.get('/admin/customers', { params }).then(r => r.data);
export const getAdminCustomer = (id: string) => api.get(`/admin/customers/${id}`).then(r => r.data);
export const createCustomer = (data: unknown) => api.post('/admin/customers', data).then(r => r.data);
export const updateCustomer = (id: string, data: unknown) => api.put(`/admin/customers/${id}`, data).then(r => r.data);
export const deleteCustomer = (id: string) => api.delete(`/admin/customers/${id}`).then(r => r.data);

// ── Orders ───────────────────────────────────────────────────────────────────
export const getAdminOrders = (params?: Record<string, unknown>) =>
  api.get('/admin/orders', { params }).then(r => r.data);
export const getAdminOrder = (id: string) => api.get(`/admin/orders/${id}`).then(r => r.data);
export const createOrder = (data: unknown) => api.post('/admin/orders', data).then(r => r.data);
export const updateOrder = (id: string, data: unknown) => api.put(`/admin/orders/${id}`, data).then(r => r.data);
export const deleteOrder = (id: string) => api.delete(`/admin/orders/${id}`).then(r => r.data);

// ── Auth ──────────────────────────────────────────────────────────────────────
export const login = (email: string, password: string) =>
  api.post('/auth/login', { email, password }).then(r => r.data);
export const seedAdmin = () => api.post('/auth/seed').then(r => r.data);
