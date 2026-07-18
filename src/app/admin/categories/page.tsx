'use client';
import { useEffect, useState } from 'react';
import { getAdminCategories, createCategory, updateCategory, deleteCategory } from '@/lib/adminApi';
import { useAdminStore } from '@/lib/adminStore';
import { Loader2, Plus, Edit2, Trash2, Eye, EyeOff, Upload, Search, ChevronRight, X, Image as ImageIcon } from 'lucide-react';
import { uploadMedia } from '@/lib/adminApi';

export default function CategoriesPage() {
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { addToast } = useAdminStore();

  // Selected Category for Editor
  const [editCat, setEditCat] = useState<any | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  // Form fields
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [parentCategory, setParentCategory] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState('');
  const [banner, setBanner] = useState('');
  const [visible, setVisible] = useState(true);
  const [seoTitle, setSeoTitle] = useState('');
  const [seoDescription, setSeoDescription] = useState('');

  const [uploadingImg, setUploadingImg] = useState(false);
  const [uploadingBanner, setUploadingBanner] = useState(false);

  const fetchCategories = () => {
    setLoading(true);
    getAdminCategories()
      .then((res) => setCategories(res.categories || []))
      .catch(() => addToast({ type: 'error', message: 'Failed to load categories.' }))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const startNew = () => {
    setEditCat(null);
    setIsEditing(true);
    setName('');
    setSlug('');
    setParentCategory('');
    setDescription('');
    setImage('');
    setBanner('');
    setVisible(true);
    setSeoTitle('');
    setSeoDescription('');
  };

  const startEdit = (cat: any) => {
    setEditCat(cat);
    setIsEditing(true);
    setName(cat.name);
    setSlug(cat.slug);
    setParentCategory(cat.parentCategory?._id || cat.parentCategory || '');
    setDescription(cat.description || '');
    setImage(cat.image || '');
    setBanner(cat.banner || '');
    setVisible(cat.visible);
    setSeoTitle(cat.seoTitle || '');
    setSeoDescription(cat.seoDescription || '');
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name) return addToast({ type: 'warning', message: 'Name is required.' });

    const payload = {
      name,
      slug: slug || name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      parentCategory: parentCategory || null,
      description,
      image,
      banner,
      visible,
      seoTitle,
      seoDescription,
    };

    try {
      if (editCat) {
        await updateCategory(editCat._id, payload);
        addToast({ type: 'success', message: 'Category updated successfully.' });
      } else {
        await createCategory(payload);
        addToast({ type: 'success', message: 'Category created successfully.' });
      }
      setIsEditing(false);
      fetchCategories();
    } catch {
      addToast({ type: 'error', message: 'Failed to save category.' });
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this category?')) return;
    try {
      await deleteCategory(id);
      addToast({ type: 'success', message: 'Category deleted successfully.' });
      fetchCategories();
    } catch {
      addToast({ type: 'error', message: 'Failed to delete category.' });
    }
  };

  const handleMediaUpload = async (e: React.ChangeEvent<HTMLInputElement>, target: 'image' | 'banner') => {
    if (!e.target.files?.length) return;
    if (target === 'image') setUploadingImg(true);
    else setUploadingBanner(true);

    const fd = new FormData();
    fd.append('files', e.target.files[0]);
    fd.append('folder', 'categories');

    try {
      const res = await uploadMedia(fd);
      if (res.success && res.assets) {
        const url = res.assets[0].url;
        if (target === 'image') setImage(url);
        else setBanner(url);
        addToast({ type: 'success', message: 'Media uploaded!' });
      }
    } catch {
      addToast({ type: 'error', message: 'Upload failed.' });
    } finally {
      setUploadingImg(false);
      setUploadingBanner(false);
    }
  };

  return (
    <div className="space-y-6 p-4 md:p-10 max-w-full mx-auto animate-fade-in font-sans">
      
      {/* Title */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-[#E8E2D9] pb-6">
        <div>
          <h1 className="text-[28px] font-semibold text-[#1C1008]" style={{ fontFamily: 'Cormorant Garamond, serif' }}>
            Categories Directory
          </h1>
          <p className="text-[13px] text-[#9B8E7E] mt-0.5">
            Organize bridal wear, festive kurtas, and collections in hierarchical business channels.
          </p>
        </div>
        {!isEditing && (
          <button onClick={startNew} className="btn-primary flex items-center gap-2 h-11 px-5 cursor-pointer">
            <Plus size={16} /> Add Category
          </button>
        )}
      </div>

      {isEditing ? (
        /* Edit or Create View */
        <div className="bg-white border border-[#E8E2D9] rounded-[24px] p-6 sm:p-8 max-w-3xl mx-auto shadow-sm animate-slide-up">
          <div className="flex justify-between items-center border-b border-[#F0EDE8] pb-4 mb-6">
            <h2 className="text-[18px] font-bold text-[#1C1008]" style={{ fontFamily: 'Cormorant Garamond, serif' }}>
              {editCat ? `Edit Category: ${editCat.name}` : 'Create New Category'}
            </h2>
            <button onClick={() => setIsEditing(false)} className="p-1.5 hover:bg-gray-50 rounded-full cursor-pointer">
              <X size={18} className="text-[#9B8E7E]" />
            </button>
          </div>

          <form onSubmit={handleSave} className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="admin-label">Category Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => { setName(e.target.value); setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, '-')); }}
                  placeholder="e.g. Wedding Silk"
                  className="admin-input"
                  required
                />
              </div>
              <div>
                <label className="admin-label">Slug</label>
                <input
                  type="text"
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  placeholder="wedding-silk"
                  className="admin-input"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="admin-label">Parent Category (Hierarchical Placement)</label>
                <select
                  value={parentCategory}
                  onChange={(e) => setParentCategory(e.target.value)}
                  className="admin-select bg-white"
                >
                  <option value="">None (Top-Level Category)</option>
                  {categories
                    .filter(c => c._id !== editCat?._id)
                    .map((cat) => (
                      <option key={cat._id} value={cat._id}>{cat.name}</option>
                    ))}
                </select>
              </div>
              <div>
                <label className="admin-label">Visibility Status</label>
                <select
                  value={visible ? 'true' : 'false'}
                  onChange={(e) => setVisible(e.target.value === 'true')}
                  className="admin-select bg-white"
                >
                  <option value="true">Visible (Public)</option>
                  <option value="false">Hidden (Draft)</option>
                </select>
              </div>
            </div>

            <div>
              <label className="admin-label">Category Description</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Brief introduction detailing the weave, colors, and styling story..."
                rows={3}
                className="admin-input py-3 resize-y"
              />
            </div>

            {/* Media Upload Block */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-2">
              {/* Category Icon/Image */}
              <div className="space-y-2">
                <label className="admin-label">Category Profile Image</label>
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-xl border border-[#E8E2D9] bg-[#FAFAF8] overflow-hidden flex-shrink-0 flex items-center justify-center">
                    {image ? <img src={image} className="w-full h-full object-cover" /> : <ImageIcon size={20} className="text-[#9B8E7E]" />}
                  </div>
                  <label className="flex items-center gap-1.5 px-3 py-2 border rounded-lg hover:bg-gray-50 text-[12px] font-semibold text-[#6B5E4C] cursor-pointer">
                    {uploadingImg ? <Loader2 size={12} className="animate-spin" /> : <Upload size={12} />}
                    Upload Image
                    <input type="file" onChange={(e) => handleMediaUpload(e, 'image')} className="hidden" />
                  </label>
                </div>
              </div>

              {/* Category Banner */}
              <div className="space-y-2">
                <label className="admin-label">Category Banner Card</label>
                <div className="flex items-center gap-4">
                  <div className="w-24 h-16 rounded-xl border border-[#E8E2D9] bg-[#FAFAF8] overflow-hidden flex-shrink-0 flex items-center justify-center">
                    {banner ? <img src={banner} className="w-full h-full object-cover" /> : <ImageIcon size={20} className="text-[#9B8E7E]" />}
                  </div>
                  <label className="flex items-center gap-1.5 px-3 py-2 border rounded-lg hover:bg-gray-50 text-[12px] font-semibold text-[#6B5E4C] cursor-pointer">
                    {uploadingBanner ? <Loader2 size={12} className="animate-spin" /> : <Upload size={12} />}
                    Upload Banner
                    <input type="file" onChange={(e) => handleMediaUpload(e, 'banner')} className="hidden" />
                  </label>
                </div>
              </div>
            </div>

            {/* SEO section */}
            <div className="border-t border-[#F0EDE8] pt-4 space-y-4">
              <h3 className="text-[14px] font-bold text-[#1C1008]" style={{ fontFamily: 'Cormorant Garamond, serif' }}>
                Search Engine Listing (SEO)
              </h3>
              <div className="space-y-3">
                <div>
                  <label className="admin-label font-medium">Meta Title</label>
                  <input
                    type="text"
                    value={seoTitle}
                    onChange={(e) => setSeoTitle(e.target.value)}
                    placeholder="Luxury wedding silks online..."
                    className="admin-input text-[12.5px]"
                  />
                </div>
                <div>
                  <label className="admin-label font-medium">Meta Description</label>
                  <textarea
                    value={seoDescription}
                    onChange={(e) => setSeoDescription(e.target.value)}
                    placeholder="Browse handcrafted couture and designer outfits..."
                    rows={2}
                    className="admin-input text-[12.5px] py-2"
                  />
                </div>
              </div>
            </div>

            {/* Footer Buttons */}
            <div className="border-t border-[#F0EDE8] pt-6 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="px-5 py-2.5 border rounded-xl text-[13px] text-[#6B5E4C] hover:bg-gray-50 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-2.5 bg-[#C8851A] hover:bg-[#B07414] text-white font-semibold rounded-xl text-[13px] tracking-wide cursor-pointer"
              >
                Save Category
              </button>
            </div>

          </form>
        </div>
      ) : (
        /* Grid table lists */
        <div className="bg-white border border-[#E8E2D9] rounded-[20px] overflow-hidden shadow-sm">
          {loading ? (
            <div className="py-20 text-center flex flex-col items-center justify-center gap-3">
              <Loader2 size={32} className="animate-spin text-[#C8851A]" />
              <p className="text-[13px] text-[#9B8E7E]">Fetching category hierarchy...</p>
            </div>
          ) : categories.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-[#FAF8F5] border-b border-[#E8E2D9] text-[11px] font-semibold tracking-wider text-[#6B5E4C] uppercase">
                    <th className="py-4 px-6">Image</th>
                    <th className="py-4 px-6">Category Name</th>
                    <th className="py-4 px-6">Slug</th>
                    <th className="py-4 px-6">Parent</th>
                    <th className="py-4 px-6">Visibility</th>
                    <th className="py-4 px-6 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#F0EDE8] text-[13px] text-[#1C1008]">
                  {categories.map((cat) => (
                    <tr key={cat._id} className="hover:bg-[#FCFBF9] transition-colors">
                      <td className="py-4 px-6">
                        <div className="w-10 h-10 rounded-lg border border-[#E8E2D9] bg-gray-50 overflow-hidden flex items-center justify-center">
                          {cat.image ? <img src={cat.image} className="w-full h-full object-cover" /> : <ImageIcon size={16} className="text-[#9B8E7E]" />}
                        </div>
                      </td>
                      <td className="py-4 px-6 font-semibold">{cat.name}</td>
                      <td className="py-4 px-6 text-mono text-[#6B5E4C]">{cat.slug}</td>
                      <td className="py-4 px-6 text-[#9B8E7E]">
                        {cat.parentCategory?.name || '—'}
                      </td>
                      <td className="py-4 px-6">
                        <span className={`inline-flex items-center gap-1 text-[11.5px] font-semibold ${cat.visible ? 'text-emerald-600' : 'text-amber-600'}`}>
                          {cat.visible ? <Eye size={12} /> : <EyeOff size={12} />}
                          {cat.visible ? 'Visible' : 'Hidden'}
                        </span>
                      </td>
                      <td className="py-4 px-6 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => startEdit(cat)}
                            className="p-1.5 rounded-md hover:bg-gray-100 text-[#C8851A] cursor-pointer"
                          >
                            <Edit2 size={14} />
                          </button>
                          <button
                            onClick={() => handleDelete(cat._id)}
                            className="p-1.5 rounded-md hover:bg-red-50 text-red-600 cursor-pointer"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="p-20 text-center text-[#9B8E7E]">
              No categories configured. Use the **First Time Setup** button on the login screen to seed default categories.
            </div>
          )}
        </div>
      )}

    </div>
  );
}
