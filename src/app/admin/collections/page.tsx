'use client';
import { useEffect, useState } from 'react';
import { getCollections, createCollection, updateCollection, deleteCollection, uploadMedia } from '@/lib/adminApi';
import { FolderPlus, Edit, Trash, Loader2, Upload, AlertCircle } from 'lucide-react';
import { useAdminStore } from '@/lib/adminStore';

export default function CollectionsPage() {
  const [collections, setCollections] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { addToast } = useAdminStore();

  // Create / Edit modal state
  const [isOpen, setIsOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [description, setDescription] = useState('');
  const [story, setStory] = useState('');
  const [bannerImage, setBannerImage] = useState('');
  const [featuredImage, setFeaturedImage] = useState('');
  const [visible, setVisible] = useState(true);
  const [status, setStatus] = useState('draft');
  const [order, setOrder] = useState(0);
  const [seoTitle, setSeoTitle] = useState('');
  const [seoDescription, setSeoDescription] = useState('');

  // Upload loaders
  const [uploadingBanner, setUploadingBanner] = useState(false);
  const [uploadingFeatured, setUploadingFeatured] = useState(false);
  const [saving, setSaving] = useState(false);

  const fetchCollections = () => {
    setLoading(true);
    getCollections()
      .then((data) => setCollections(data.collections || []))
      .catch((err) => {
        console.error(err);
        addToast({ type: 'error', message: 'Failed to load collections.' });
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchCollections();
  }, []);

  const openCreate = () => {
    setEditingId(null);
    setName('');
    setSlug('');
    setSubtitle('');
    setDescription('');
    setStory('');
    setBannerImage('');
    setFeaturedImage('');
    setVisible(true);
    setStatus('draft');
    setOrder(collections.length);
    setSeoTitle('');
    setSeoDescription('');
    setIsOpen(true);
  };

  const openEdit = (c: any) => {
    setEditingId(c._id);
    setName(c.name);
    setSlug(c.slug);
    setSubtitle(c.subtitle || '');
    setDescription(c.description || '');
    setStory(c.story || '');
    setBannerImage(c.bannerImage || '');
    setFeaturedImage(c.featuredImage || '');
    setVisible(c.visible ?? true);
    setStatus(c.status || 'draft');
    setOrder(c.order || 0);
    setSeoTitle(c.seoTitle || '');
    setSeoDescription(c.seoDescription || '');
    setIsOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this collection?')) return;
    try {
      await deleteCollection(id);
      addToast({ type: 'success', message: 'Collection deleted successfully.' });
      fetchCollections();
    } catch {
      addToast({ type: 'error', message: 'Failed to delete collection.' });
    }
  };

  const handleBannerUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.length) return;
    setUploadingBanner(true);
    const fd = new FormData();
    fd.append('files', e.target.files[0]);
    fd.append('folder', 'collections');
    try {
      const res = await uploadMedia(fd);
      if (res.success && res.assets?.[0]) {
        setBannerImage(res.assets[0].url);
        addToast({ type: 'success', message: 'Banner uploaded!' });
      }
    } catch {
      addToast({ type: 'error', message: 'Upload failed.' });
    } finally {
      setUploadingBanner(false);
    }
  };

  const handleFeaturedUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.length) return;
    setUploadingFeatured(true);
    const fd = new FormData();
    fd.append('files', e.target.files[0]);
    fd.append('folder', 'collections');
    try {
      const res = await uploadMedia(fd);
      if (res.success && res.assets?.[0]) {
        setFeaturedImage(res.assets[0].url);
        addToast({ type: 'success', message: 'Featured image uploaded!' });
      }
    } catch {
      addToast({ type: 'error', message: 'Upload failed.' });
    } finally {
      setUploadingFeatured(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !slug) {
      addToast({ type: 'warning', message: 'Name and Slug are required.' });
      return;
    }

    setSaving(true);
    const payload = {
      name, slug, subtitle, description, story,
      bannerImage, featuredImage, visible, status, order,
      seoTitle, seoDescription,
    };

    try {
      if (editingId) {
        await updateCollection(editingId, payload);
        addToast({ type: 'success', message: 'Collection updated successfully.' });
      } else {
        await createCollection(payload);
        addToast({ type: 'success', message: 'Collection created successfully.' });
      }
      setIsOpen(false);
      fetchCollections();
    } catch {
      addToast({ type: 'error', message: 'Failed to save collection.' });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="page-header">
        <div>
          <h1 className="page-title">Design Collections</h1>
          <p className="page-subtitle">Formulate and reorder bridal launch collections.</p>
        </div>
        <button onClick={openCreate} className="btn-primary">
          <FolderPlus size={15} /> Create Collection
        </button>
      </div>

      {/* Main List */}
      {loading ? (
        <div className="py-20 text-center">
          <Loader2 className="animate-spin text-[#C8851A] mx-auto mb-3" size={24} />
          <p className="text-[13px] text-[#9B8E7E]">Fetching collections...</p>
        </div>
      ) : collections.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {collections.map((c) => (
            <div key={c._id} className="admin-card overflow-hidden hover:shadow-card-hover transition-all duration-200">
              <div className="h-44 bg-gray-50 border-b border-[#E8E2D9] relative flex items-center justify-center overflow-hidden">
                {c.bannerImage ? (
                  <img src={c.bannerImage} alt={c.name} className="w-full h-full object-cover" />
                ) : (
                  <div className="text-[#9B8E7E] text-[12px] flex items-center gap-1.5">
                    <AlertCircle size={15} /> No banner image
                  </div>
                )}
                <div className="absolute bottom-3 left-3 flex gap-2">
                  <span className={`badge-${c.status}`}>{c.status}</span>
                  <span className={c.visible ? 'badge bg-emerald-50 text-emerald-600' : 'badge bg-gray-100 text-gray-500'}>
                    {c.visible ? 'Visible' : 'Hidden'}
                  </span>
                </div>
              </div>
              <div className="p-4 space-y-2">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-semibold text-[15px] text-[#1C1008]">{c.name}</h3>
                    {c.subtitle && <p className="text-[12px] text-[#9B8E7E] mt-0.5">{c.subtitle}</p>}
                  </div>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => openEdit(c)}
                      className="p-1.5 text-gray-400 hover:text-[#C8851A] rounded hover:bg-gray-50 cursor-pointer"
                      title="Edit"
                    >
                      <Edit size={14} />
                    </button>
                    <button
                      onClick={() => handleDelete(c._id)}
                      className="p-1.5 text-gray-400 hover:text-red-600 rounded hover:bg-red-50 cursor-pointer"
                      title="Delete"
                    >
                      <Trash size={14} />
                    </button>
                  </div>
                </div>
                <div className="text-[12px] text-[#6B5E4C] border-t border-[#F0EDE8] pt-2 flex justify-between items-center">
                  <span>Display order weight:</span>
                  <span className="font-semibold">{c.order}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="py-20 text-center">
          <AlertCircle className="text-gray-300 mx-auto mb-3" size={32} />
          <p className="text-[13px] text-[#9B8E7E]">No collections created yet.</p>
        </div>
      )}

      {/* Create / Edit Slide-over or Modal Overlay */}
      {isOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[9999] flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-modal w-full max-w-[560px] border border-[#E8E2D9] max-h-[90vh] overflow-y-auto p-6 animate-slide-up">
            <h2 className="text-[18px] font-semibold text-[#1C1008] border-b border-[#F0EDE8] pb-3" style={{ fontFamily: 'Cormorant Garamond, serif' }}>
              {editingId ? `Edit Collection: ${name}` : 'Create Launch Collection'}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4 mt-4">
              <div>
                <label className="admin-label">Collection Name</label>
                <input
                  type="text"
                  className="admin-input"
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value);
                    if (!editingId) setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''));
                  }}
                  placeholder="e.g. Royal Bridal Spring 2026"
                  required
                />
              </div>

              <div>
                <label className="admin-label">Slug</label>
                <input
                  type="text"
                  className="admin-input"
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  placeholder="e.g. royal-bridal-spring-2026"
                  required
                />
              </div>

              <div>
                <label className="admin-label">Subtitle</label>
                <input
                  type="text"
                  className="admin-input"
                  value={subtitle}
                  onChange={(e) => setSubtitle(e.target.value)}
                  placeholder="e.g. Generational Silk Lehengas"
                />
              </div>

              <div>
                <label className="admin-label">Description Summary</label>
                <textarea
                  rows={2}
                  className="admin-textarea"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>

              <div>
                <label className="admin-label">Collection Narrative Story</label>
                <textarea
                  rows={3}
                  className="admin-textarea"
                  value={story}
                  onChange={(e) => setStory(e.target.value)}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                {/* Banner Image */}
                <div>
                  <label className="admin-label">Landscape Banner</label>
                  {bannerImage ? (
                    <div className="relative h-24 bg-gray-50 border rounded-lg overflow-hidden group mb-2">
                      <img src={bannerImage} alt="Banner" className="w-full h-full object-cover" />
                      <button
                        type="button"
                        onClick={() => setBannerImage('')}
                        className="absolute top-1 right-1 p-1 bg-red-600 text-white rounded-full cursor-pointer"
                      >
                        <Trash size={10} />
                      </button>
                    </div>
                  ) : (
                    <label className="h-24 border border-dashed border-[#E8E2D9] hover:border-[#C8851A] rounded-lg flex flex-col items-center justify-center cursor-pointer transition-colors text-center p-2 mb-2 bg-[#FAFAF8]">
                      {uploadingBanner ? (
                        <Loader2 size={16} className="animate-spin text-[#C8851A]" />
                      ) : (
                        <>
                          <Upload size={16} className="text-[#9B8E7E] mb-1" />
                          <span className="text-[10px] text-[#6B5E4C]">Upload Banner</span>
                        </>
                      )}
                      <input type="file" className="hidden" accept="image/*" onChange={handleBannerUpload} />
                    </label>
                  )}
                </div>

                {/* Featured Image */}
                <div>
                  <label className="admin-label">Portrait cover Card</label>
                  {featuredImage ? (
                    <div className="relative h-24 bg-gray-50 border rounded-lg overflow-hidden group mb-2">
                      <img src={featuredImage} alt="Featured" className="w-full h-full object-cover" />
                      <button
                        type="button"
                        onClick={() => setFeaturedImage('')}
                        className="absolute top-1 right-1 p-1 bg-red-600 text-white rounded-full cursor-pointer"
                      >
                        <Trash size={10} />
                      </button>
                    </div>
                  ) : (
                    <label className="h-24 border border-dashed border-[#E8E2D9] hover:border-[#C8851A] rounded-lg flex flex-col items-center justify-center cursor-pointer transition-colors text-center p-2 mb-2 bg-[#FAFAF8]">
                      {uploadingFeatured ? (
                        <Loader2 size={16} className="animate-spin text-[#C8851A]" />
                      ) : (
                        <>
                          <Upload size={16} className="text-[#9B8E7E] mb-1" />
                          <span className="text-[10px] text-[#6B5E4C]">Upload Cover</span>
                        </>
                      )}
                      <input type="file" className="hidden" accept="image/*" onChange={handleFeaturedUpload} />
                    </label>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4 pt-2">
                <div>
                  <label className="admin-label">Display Order</label>
                  <input
                    type="number"
                    className="admin-input"
                    value={order}
                    onChange={(e) => setOrder(Number(e.target.value))}
                  />
                </div>
                <div>
                  <label className="admin-label">Status</label>
                  <select className="admin-select bg-white" value={status} onChange={(e) => setStatus(e.target.value)}>
                    <option value="draft">Draft</option>
                    <option value="published">Published</option>
                    <option value="archived">Archived</option>
                  </select>
                </div>
                <div>
                  <label className="admin-label">Visibility</label>
                  <select
                    className="admin-select bg-white"
                    value={visible ? 'true' : 'false'}
                    onChange={(e) => setVisible(e.target.value === 'true')}
                  >
                    <option value="true">Visible</option>
                    <option value="false">Hidden</option>
                  </select>
                </div>
              </div>

              {/* SEO Config */}
              <div className="border-t border-[#F0EDE8] pt-4 space-y-3">
                <h4 className="text-[13px] font-bold text-[#1C1008]">Search Engine Optimization (SEO)</h4>
                <div>
                  <label className="admin-label text-[11px] font-medium text-[#6B5E4C]">SEO Page Title</label>
                  <input
                    type="text"
                    className="admin-input text-[12.5px]"
                    value={seoTitle || ''}
                    onChange={(e) => setSeoTitle(e.target.value)}
                    placeholder="Search snippet page header..."
                  />
                </div>
                <div>
                  <label className="admin-label text-[11px] font-medium text-[#6B5E4C]">SEO Meta Description</label>
                  <textarea
                    rows={2}
                    className="admin-textarea text-[12.5px] py-2"
                    value={seoDescription || ''}
                    onChange={(e) => setSeoDescription(e.target.value)}
                    placeholder="Search snippet page summary description..."
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 border-t border-[#F0EDE8] pt-4 mt-6">
                <button type="button" onClick={() => setIsOpen(false)} className="btn-secondary cursor-pointer">
                  Cancel
                </button>
                <button type="submit" disabled={saving} className="btn-primary cursor-pointer">
                  {saving ? 'Saving...' : 'Save Collection'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
