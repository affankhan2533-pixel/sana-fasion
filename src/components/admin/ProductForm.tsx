'use client';
import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Loader2, Plus, Trash, Sparkles, Image as ImageIcon, Check, Upload, HelpCircle, RefreshCw, Star } from 'lucide-react';
import { generateProductContent, uploadMedia, getCollections } from '@/lib/adminApi';
import { useAdminStore } from '@/lib/adminStore';
import { useRouter } from 'next/navigation';

const schema = z.object({
  name: z.string().min(1, 'Name is required'),
  price: z.number().min(0, 'Price must be positive'),
  salePrice: z.number().optional().nullable(),
  sku: z.string().optional(),
  productCode: z.string().optional(),
  category: z.string().min(1, 'Category is required'),
  subcategory: z.string().optional(),
  collection: z.string().optional().nullable(),
  fabric: z.string().optional(),
  occasion: z.string().optional(),
  embroidery: z.string().optional(),
  workType: z.string().optional(),
  stock: z.number().min(0, 'Stock must be positive'),
  description: z.string().min(1, 'Description is required'),
  story: z.string().optional(),
  careInstructions: z.string().optional(),
  shippingInfo: z.string().optional(),
  returnPolicy: z.string().optional(),
  seoTitle: z.string().optional(),
  seoDescription: z.string().optional(),
  status: z.string().default('draft'),
  tags: z.array(z.string()).default([]),
  featured: z.boolean().default(false),
  newArrival: z.boolean().default(false),
  bestSeller: z.boolean().default(false),
});

interface ProductFormProps {
  initialData?: any;
  onSubmit: (data: any) => Promise<void>;
}

export default function ProductForm({ initialData, onSubmit }: ProductFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [collections, setCollections] = useState<any[]>([]);
  const { addToast } = useAdminStore();

  // Tab State
  const [activeTab, setActiveTab] = useState('general');

  // Images state
  const [images, setImages] = useState<string[]>(initialData?.images || []);
  const [uploading, setUploading] = useState(false);

  // AI assistant status
  const [generatingAI, setGeneratingAI] = useState(false);

  // Variant manager
  const [variants, setVariants] = useState<any[]>(initialData?.variants || []);
  const [newVarColor, setNewVarColor] = useState('');
  const [newVarSize, setNewVarSize] = useState('');
  const [newVarStock, setNewVarStock] = useState(1);
  const [newVarPrice, setNewVarPrice] = useState<number | ''>('');

  const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      name: initialData?.name || '',
      price: initialData?.price || 0,
      salePrice: initialData?.salePrice || null,
      sku: initialData?.sku || '',
      productCode: initialData?.productCode || '',
      category: initialData?.category || 'Wedding Collection',
      subcategory: initialData?.subcategory || '',
      collection: initialData?.collection?._id || initialData?.collection || '',
      fabric: initialData?.fabric || '',
      occasion: initialData?.occasion || '',
      embroidery: initialData?.embroidery || '',
      workType: initialData?.workType || '',
      stock: initialData?.stock || 0,
      description: initialData?.description || '',
      story: initialData?.story || '',
      careInstructions: initialData?.careInstructions || '',
      shippingInfo: initialData?.shippingInfo || '',
      returnPolicy: initialData?.returnPolicy || '',
      seoTitle: initialData?.seoTitle || '',
      seoDescription: initialData?.seoDescription || '',
      status: initialData?.status || 'draft',
      tags: initialData?.tags || [],
      featured: initialData?.featured || false,
      newArrival: initialData?.newArrival || false,
      bestSeller: initialData?.bestSeller || false,
    },
  });

  const formValues = watch();

  useEffect(() => {
    getCollections()
      .then((data) => setCollections(data.collections || []))
      .catch((err) => console.error(err));
  }, []);

  // AI Content Generator
  const handleAIAssistant = async () => {
    const name = formValues.name;
    const fabric = formValues.fabric;
    const category = formValues.category;
    const occasion = formValues.occasion;

    if (!name) {
      addToast({ type: 'warning', message: 'Please enter a product name first.' });
      return;
    }

    setGeneratingAI(true);
    try {
      const data = await generateProductContent({ name, fabric, category, occasion });
      if (data.success && data.generated) {
        const { description, story, seoTitle, seoDescription, tags } = data.generated;
        setValue('description', description);
        setValue('story', story);
        setValue('seoTitle', seoTitle);
        setValue('seoDescription', seoDescription);
        setValue('tags', tags);
        addToast({ type: 'success', message: '✨ Luxury details generated with AI!' });
      }
    } catch {
      addToast({ type: 'error', message: 'AI generation failed.' });
    } finally {
      setGeneratingAI(false);
    }
  };

  // Image upload
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.length) return;
    setUploading(true);
    const files = Array.from(e.target.files);
    const fd = new FormData();
    files.forEach((f) => fd.append('files', f));
    fd.append('folder', 'products');

    try {
      const res = await uploadMedia(fd);
      if (res.success && res.assets) {
        const uploadedUrls = res.assets.map((a: any) => a.url);
        setImages([...images, ...uploadedUrls]);
        addToast({ type: 'success', message: 'Images uploaded successfully.' });
      }
    } catch {
      addToast({ type: 'error', message: 'Image upload failed.' });
    } finally {
      setUploading(false);
    }
  };

  const removeImage = (idx: number) => {
    setImages(images.filter((_, i) => i !== idx));
  };

  // Variant helper
  const addVariant = () => {
    if (!newVarSize && !newVarColor) {
      addToast({ type: 'warning', message: 'Please specify color or size.' });
      return;
    }
    const label = [newVarColor, newVarSize].filter(Boolean).join(' / ');
    const newVariant = {
      label,
      color: newVarColor,
      size: newVarSize,
      stock: newVarStock,
      price: newVarPrice || null,
      sku: `${formValues.sku || 'VAR'}-${label.replace(/\s+/g, '')}`,
    };
    setVariants([...variants, newVariant]);
    setNewVarColor('');
    setNewVarSize('');
    setNewVarStock(1);
    setNewVarPrice('');
  };

  const removeVariant = (idx: number) => {
    setVariants(variants.filter((_, i) => i !== idx));
  };

  const handleFormSubmit = async (data: any) => {
    setLoading(true);
    try {
      const payload = { ...data, images, variants };
      await onSubmit(payload);
    } catch {
      addToast({ type: 'error', message: 'Failed to save product.' });
    } finally {
      setLoading(false);
    }
  };

  const formTabs = [
    { id: 'general', label: 'Basic Info' },
    { id: 'images', label: 'Photos & Videos' },
    { id: 'pricing', label: 'Pricing & Stock' },
    { id: 'categories', label: 'Categorization' },
    { id: 'variants', label: 'Variants & Specs' },
    { id: 'seo', label: 'SEO & Search' },
    { id: 'shipping', label: 'Shipping & Returns' },
  ];

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-8 max-w-full mx-auto">
      
      {/* Tab Segment Controls */}
      <div className="flex overflow-x-auto border-b border-[#E8E2D9] pb-px scrollbar-none gap-2 bg-white p-2 rounded-xl border">
        {formTabs.map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2.5 rounded-lg text-[13px] font-semibold whitespace-nowrap transition-colors cursor-pointer ${
              activeTab === tab.id
                ? 'bg-[#C8851A] text-white'
                : 'text-[#6B5E4C] hover:bg-gray-50'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* 12-Column Responsive Layout Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column (8 cols): Tab Content */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* General Tab */}
          {activeTab === 'general' && (
            <div className="bg-white border border-[#E8E2D9] rounded-[20px] p-6 space-y-4 shadow-sm animate-fade-in">
              <div className="flex justify-between items-center pb-2 border-b border-[#F0EDE8]">
                <h2 className="text-[16px] font-bold text-[#1C1008]" style={{ fontFamily: 'Cormorant Garamond, serif' }}>
                  Basic Information & Story
                </h2>
                <button
                  type="button"
                  onClick={handleAIAssistant}
                  disabled={generatingAI}
                  className="inline-flex items-center gap-1.5 text-[11px] font-bold text-[#C8851A] bg-[rgba(200,133,26,0.06)] px-3 py-2 rounded-full border border-[rgba(200,133,26,0.15)] hover:bg-[rgba(200,133,26,0.12)] transition-colors cursor-pointer"
                >
                  {generatingAI ? (
                    <><RefreshCw size={12} className="animate-spin" /> Generating...</>
                  ) : (
                    <><Sparkles size={12} /> ✨ Generate with AI</>
                  )}
                </button>
              </div>

              <div>
                <label className="admin-label">Product Name</label>
                <input type="text" className="admin-input" {...register('name')} placeholder="e.g. Royal Crimson Bridal Lehenga" />
                {errors.name && <p className="text-[11px] text-red-500 mt-1">{errors.name.message as string}</p>}
              </div>

              <div>
                <label className="admin-label">Product Description</label>
                <textarea rows={4} className="admin-input py-3 resize-y min-h-[100px]" {...register('description')} placeholder="Describe the garment details, texture, drape..." />
                {errors.description && <p className="text-[11px] text-red-500 mt-1">{errors.description.message as string}</p>}
              </div>

              <div>
                <label className="admin-label">Atelier Brand Story (Heritage/Craftsmanship)</label>
                <textarea rows={3} className="admin-input py-3 resize-y" {...register('story')} placeholder="The tale behind the design, artisans involved..." />
              </div>

              <div>
                <label className="admin-label">Care & Textile Maintenance Instructions</label>
                <textarea rows={2} className="admin-input py-3 resize-y" {...register('careInstructions')} placeholder="e.g. Dry clean only, store in muslin sleeve..." />
              </div>
            </div>
          )}

          {/* Photos & Videos Tab */}
          {activeTab === 'images' && (
            <div className="bg-white border border-[#E8E2D9] rounded-[20px] p-6 space-y-4 shadow-sm animate-fade-in">
              <h2 className="text-[16px] font-bold text-[#1C1008] border-b border-[#F0EDE8] pb-2" style={{ fontFamily: 'Cormorant Garamond, serif' }}>
                Photos & Videos
              </h2>
              
              {/* Media gallery grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {images.map((img, i) => (
                  <div key={i} className="relative aspect-[3/4] rounded-xl overflow-hidden border border-[#E8E2D9] group bg-gray-50">
                    <img src={img} alt="Product image" className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => removeImage(i)}
                      className="absolute top-2 right-2 bg-black/75 text-white p-1.5 rounded-full hover:bg-black transition-colors cursor-pointer"
                    >
                      <Trash size={12} />
                    </button>
                    <div className="absolute bottom-2 left-2 bg-black/60 text-white text-[9px] px-1.5 py-0.5 rounded uppercase font-semibold">
                      {i === 0 ? 'Cover' : `Slide ${i}`}
                    </div>
                  </div>
                ))}

                {/* Upload block */}
                <label className="aspect-[3/4] rounded-xl border-2 border-dashed border-[#E8E2D9] hover:border-[#C8851A] transition-colors flex flex-col items-center justify-center cursor-pointer p-4 text-center bg-[#FAFAF8]">
                  {uploading ? (
                    <><Loader2 size={24} className="animate-spin text-[#C8851A] mb-2" /> Uploading...</>
                  ) : (
                    <>
                      <Upload size={24} className="text-[#9B8E7E] mb-2" />
                      <span className="text-[11px] font-semibold text-[#6B5E4C] uppercase tracking-wider">Upload files</span>
                      <span className="text-[9px] text-[#9B8E7E] mt-1">PNG, JPG up to 10MB</span>
                    </>
                  )}
                  <input type="file" multiple accept="image/*" onChange={handleImageUpload} className="hidden" />
                </label>
              </div>
            </div>
          )}

          {/* Pricing & Stock Tab */}
          {activeTab === 'pricing' && (
            <div className="bg-white border border-[#E8E2D9] rounded-[20px] p-6 space-y-4 shadow-sm animate-fade-in">
              <h2 className="text-[16px] font-bold text-[#1C1008] border-b border-[#F0EDE8] pb-2" style={{ fontFamily: 'Cormorant Garamond, serif' }}>
                Pricing & Inventory
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="admin-label">Retail Price (INR ₹)</label>
                  <input
                    type="number"
                    className="admin-input"
                    {...register('price', { valueAsNumber: true })}
                    placeholder="85000"
                  />
                  {errors.price && <p className="text-[11px] text-red-500 mt-1">{errors.price.message as string}</p>}
                </div>
                <div>
                  <label className="admin-label">Sale/Offer Price (INR ₹)</label>
                  <input
                    type="number"
                    className="admin-input"
                    {...register('salePrice', { valueAsNumber: true })}
                    placeholder="e.g. 78000 (optional)"
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                <div>
                  <label className="admin-label">SKU Reference</label>
                  <input type="text" className="admin-input" {...register('sku')} placeholder="BR-LEH-001" />
                </div>
                <div>
                  <label className="admin-label">Product Code</label>
                  <input type="text" className="admin-input" {...register('productCode')} placeholder="SANA-2026-09" />
                </div>
                <div>
                  <label className="admin-label">Total Inventory Stock</label>
                  <input
                    type="number"
                    className="admin-input"
                    {...register('stock', { valueAsNumber: true })}
                  />
                  {errors.stock && <p className="text-[11px] text-red-500 mt-1">{errors.stock.message as string}</p>}
                </div>
              </div>
            </div>
          )}

          {/* Categorization Tab */}
          {activeTab === 'categories' && (
            <div className="bg-white border border-[#E8E2D9] rounded-[20px] p-6 space-y-4 shadow-sm animate-fade-in">
              <h2 className="text-[16px] font-bold text-[#1C1008] border-b border-[#F0EDE8] pb-2" style={{ fontFamily: 'Cormorant Garamond, serif' }}>
                Categorization & Tags
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="admin-label">Design Category</label>
                  <select className="admin-select" {...register('category')}>
                    <option value="Wedding Collection">Wedding Collection</option>
                    <option value="Festive Collection">Festive Collection</option>
                    <option value="Designer Suits">Designer Suits</option>
                    <option value="New Arrivals">New Arrivals</option>
                    <option value="Best Sellers">Best Sellers</option>
                  </select>
                </div>
                <div>
                  <label className="admin-label">Luxury Collection Bind</label>
                  <select className="admin-select" {...register('collection')}>
                    <option value="">None (Independent Product)</option>
                    {collections.map((col) => (
                      <option key={col._id} value={col._id}>{col.name}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div>
                <label className="admin-label">Tags (Comma-separated search keywords)</label>
                <input
                  type="text"
                  placeholder="silk, embroidery, bride, lehenga"
                  className="admin-input"
                  value={formValues.tags?.join(', ')}
                  onChange={(e) => setValue('tags', e.target.value.split(',').map(t => t.trim()).filter(Boolean))}
                />
              </div>
            </div>
          )}

          {/* Variants & Specs Tab */}
          {activeTab === 'variants' && (
            <div className="bg-white border border-[#E8E2D9] rounded-[20px] p-6 space-y-6 shadow-sm animate-fade-in">
              <div>
                <h2 className="text-[16px] font-bold text-[#1C1008] border-b border-[#F0EDE8] pb-2" style={{ fontFamily: 'Cormorant Garamond, serif' }}>
                  Fabric & Occasion Attributes
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                  <div>
                    <label className="admin-label">Fabric / Textile Type</label>
                    <input type="text" className="admin-input" {...register('fabric')} placeholder="e.g. Banarasi Raw Silk" />
                  </div>
                  <div>
                    <label className="admin-label">Occasion Suitability</label>
                    <input type="text" className="admin-input" {...register('occasion')} placeholder="e.g. Bridal Sangeet, Reception" />
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                  <div>
                    <label className="admin-label">Embroidery Type</label>
                    <input type="text" className="admin-input" {...register('embroidery')} placeholder="e.g. Zardozi, Gota Patti" />
                  </div>
                  <div>
                    <label className="admin-label">Craftsmanship Work Type</label>
                    <input type="text" className="admin-input" {...register('workType')} placeholder="e.g. Handcrafted, Machine" />
                  </div>
                </div>
              </div>

              {/* Variant manager */}
              <div className="border-t border-[#F0EDE8] pt-4 space-y-4">
                <h3 className="text-[14px] font-semibold text-[#1C1008]">Product Variants (Colors & Sizes)</h3>
                
                <div className="bg-[#FAFAF8] border border-[#E8E2D9] rounded-xl p-4 grid grid-cols-2 sm:grid-cols-5 gap-3 items-end">
                  <div>
                    <label className="admin-label">Color</label>
                    <input type="text" value={newVarColor} onChange={e => setNewVarColor(e.target.value)} placeholder="e.g. Crimson" className="admin-input h-10" />
                  </div>
                  <div>
                    <label className="admin-label">Size</label>
                    <input type="text" value={newVarSize} onChange={e => setNewVarSize(e.target.value)} placeholder="e.g. XL" className="admin-input h-10" />
                  </div>
                  <div>
                    <label className="admin-label">Stock</label>
                    <input type="number" value={newVarStock} onChange={e => setNewVarStock(Number(e.target.value))} className="admin-input h-10" />
                  </div>
                  <div>
                    <label className="admin-label">Price (override)</label>
                    <input type="number" value={newVarPrice} onChange={e => setNewVarPrice(e.target.value ? Number(e.target.value) : '')} placeholder="Use main" className="admin-input h-10" />
                  </div>
                  <button type="button" onClick={addVariant} className="btn-secondary h-10 justify-center text-[12px] font-semibold cursor-pointer">
                    <Plus size={14} /> Add Variant
                  </button>
                </div>

                {variants.length > 0 ? (
                  <div className="border border-[#E8E2D9] rounded-xl overflow-hidden divide-y divide-[#F0EDE8]">
                    {variants.map((v, i) => (
                      <div key={i} className="p-3 bg-white flex justify-between items-center text-[12.5px]">
                        <div>
                          <span className="font-semibold text-[#1C1008]">{v.label}</span>
                          <span className="text-[#9B8E7E] ml-2">• Stock: {v.stock}</span>
                          {v.price && <span className="text-[#C8851A] ml-2">• Price: ₹{v.price}</span>}
                        </div>
                        <button type="button" onClick={() => removeVariant(i)} className="text-red-600 hover:text-red-800 p-1 cursor-pointer">
                          <Trash size={14} />
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-[12px] text-[#9B8E7E] italic">No active variants added. Listing will sell as a single unified item.</p>
                )}
              </div>
            </div>
          )}

          {/* SEO & Search Tab */}
          {activeTab === 'seo' && (
            <div className="bg-white border border-[#E8E2D9] rounded-[20px] p-6 space-y-4 shadow-sm animate-fade-in">
              <h2 className="text-[16px] font-bold text-[#1C1008] border-b border-[#F0EDE8] pb-2" style={{ fontFamily: 'Cormorant Garamond, serif' }}>
                Google Search Engine Listing (SEO)
              </h2>
              <div>
                <label className="admin-label">Meta Search Title</label>
                <input type="text" className="admin-input" {...register('seoTitle')} placeholder="e.g. Royal Crimson Bridal Lehenga | SANA Fashion" />
              </div>
              <div>
                <label className="admin-label">Meta Search Description</label>
                <textarea rows={3} className="admin-input py-3 resize-y" {...register('seoDescription')} placeholder="Brief preview text that appears under the Google link page listing..." />
              </div>
            </div>
          )}

          {/* Shipping & Returns Tab */}
          {activeTab === 'shipping' && (
            <div className="bg-white border border-[#E8E2D9] rounded-[20px] p-6 space-y-4 shadow-sm animate-fade-in">
              <h2 className="text-[16px] font-bold text-[#1C1008] border-b border-[#F0EDE8] pb-2" style={{ fontFamily: 'Cormorant Garamond, serif' }}>
                Shipping & Delivery Specifications
              </h2>
              <div>
                <label className="admin-label">Shipping dispatch timing info</label>
                <textarea rows={2} className="admin-input py-3 resize-y" {...register('shippingInfo')} placeholder="e.g. Dispatched in 3-4 weeks due to hand embroidery craft..." />
              </div>
              <div>
                <label className="admin-label">Return/Exchange Policy details</label>
                <textarea rows={2} className="admin-input py-3 resize-y" {...register('returnPolicy')} placeholder="e.g. Made-to-order garments are non-returnable..." />
              </div>
            </div>
          )}

        </div>

        {/* Right Column (4 cols): Status, flags & publish triggers */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* Status Settings Card */}
          <div className="bg-white border border-[#E8E2D9] rounded-[20px] p-6 space-y-4 shadow-sm">
            <h3 className="text-[14px] font-bold text-[#1C1008] border-b border-[#F0EDE8] pb-2">Status & Visibility</h3>
            
            <div>
              <label className="admin-label">Publishing status</label>
              <select className="admin-select" {...register('status')}>
                <option value="draft">Draft (Hidden)</option>
                <option value="published">Published (Visible)</option>
                <option value="archived">Archived</option>
              </select>
            </div>

            <div className="pt-2 border-t border-[#F0EDE8] space-y-3">
              <label className="block text-[11px] font-semibold tracking-wider uppercase text-[#6B5E4C]">Display Settings</label>
              
              <label className="flex items-center gap-2 text-[13px] text-[#6B5E4C] cursor-pointer">
                <input
                  type="checkbox"
                  checked={formValues.featured}
                  onChange={(e) => setValue('featured', e.target.checked)}
                  className="rounded border-[#E8E2D9] text-[#C8851A] focus:ring-[#C8851A]"
                />
                Feature in home gallery
              </label>

              <label className="flex items-center gap-2 text-[13px] text-[#6B5E4C] cursor-pointer">
                <input
                  type="checkbox"
                  checked={formValues.newArrival}
                  onChange={(e) => setValue('newArrival', e.target.checked)}
                  className="rounded border-[#E8E2D9] text-[#C8851A] focus:ring-[#C8851A]"
                />
                Mark as New Arrival
              </label>

              <label className="flex items-center gap-2 text-[13px] text-[#6B5E4C] cursor-pointer">
                <input
                  type="checkbox"
                  checked={formValues.bestSeller}
                  onChange={(e) => setValue('bestSeller', e.target.checked)}
                  className="rounded border-[#E8E2D9] text-[#C8851A] focus:ring-[#C8851A]"
                />
                Mark as Bestseller
              </label>
            </div>
          </div>

          {/* Form Actions */}
          <div className="bg-white border border-[#E8E2D9] rounded-[20px] p-6 space-y-3 shadow-sm">
            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full h-12 justify-center font-semibold text-[13px] tracking-widest uppercase cursor-pointer"
            >
              {loading ? (
                <><Loader2 size={16} className="animate-spin" /> Saving changes...</>
              ) : (
                'Save Garment'
              )}
            </button>
            <button
              type="button"
              onClick={() => router.push('/admin/products')}
              className="btn-secondary w-full h-12 justify-center font-medium text-[13px] cursor-pointer"
            >
              Discard & Exit
            </button>
          </div>

        </div>

      </div>

    </form>
  );
}
