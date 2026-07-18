'use client';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
  Plus, Trash, Image as ImageIcon, Upload, ArrowRight, ArrowLeft, Camera, Image as GalleryIcon, Eye, Tag, FileText, IndianRupee, Sparkles, Layers, Loader2, Package
} from 'lucide-react';
import { uploadMedia } from '@/lib/adminApi';
import { useAdminStore } from '@/lib/adminStore';
import { useRouter } from 'next/navigation';

// Design System components
import Button from '@/design-system/components/Button';
import Input, { Textarea, Dropdown } from '@/design-system/components/Input';
import Card from '@/design-system/components/Card';
import Stepper from '@/design-system/components/Stepper';
import Badge from '@/design-system/components/Badge';

const schema = z.object({
  name: z.string().min(1, 'Name is required'),
  price: z.number().min(0, 'Price must be positive'),
  category: z.string().min(1, 'Category is required'),
  description: z.string().min(1, 'Description is required'),
  stock: z.number().min(0, 'Stock must be positive'),
  stockStatus: z.string().default('in_stock'),
  featured: z.boolean().default(false),
  status: z.string().default('draft'),
});

interface ProductFormProps {
  initialData?: any;
  onSubmit: (data: any) => Promise<void>;
}

// Client-side image compressor (converts to high-quality JPEG and downscales to max 1200px)
const compressImage = (file: File): Promise<File> => {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;
        
        const MAX_WIDTH = 1200;
        if (width > MAX_WIDTH) {
          height = Math.round((height * MAX_WIDTH) / width);
          width = MAX_WIDTH;
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx?.drawImage(img, 0, 0, width, height);

        canvas.toBlob(
          (blob) => {
            if (blob) {
              const compressedFile = new File([blob], file.name.replace(/\.[^/.]+$/, "") + ".jpg", {
                type: 'image/jpeg',
                lastModified: Date.now(),
              });
              resolve(compressedFile);
            } else {
              resolve(file);
            }
          },
          'image/jpeg',
          0.85 // 85% high quality compression
        );
      };
      img.src = event.target?.result as string;
    };
    reader.readAsDataURL(file);
  });
};

export default function ProductForm({ initialData, onSubmit }: ProductFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const { addToast } = useAdminStore();

  // Multi-step state: 1, 2, 3, 4
  const [step, setStep] = useState(1);

  // Images state
  const [images, setImages] = useState<string[]>(initialData?.images || []);
  const [uploading, setUploading] = useState(false);

  // Draft/Publish state helper
  const [submitStatus, setSubmitStatus] = useState(initialData?.status || 'draft');

  const { register, handleSubmit, setValue, watch, trigger, formState: { errors } } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      name: initialData?.name || '',
      price: initialData?.price || 0,
      category: initialData?.category || 'Bridal',
      description: initialData?.description || '',
      stock: initialData?.stock || 10,
      stockStatus: initialData?.stockStatus || 'in_stock',
      featured: initialData?.featured || false,
      status: initialData?.status || 'draft',
    },
  });

  const formValues = watch();

  const handleNextStep = async () => {
    // Validate current step fields before progressing
    if (step === 1) {
      const isValid = await trigger(['name', 'category']);
      if (!isValid) return;
    } else if (step === 2) {
      if (images.length === 0) {
        addToast({ type: 'warning', message: 'Please upload at least one image.' });
        return;
      }
    } else if (step === 3) {
      const isValid = await trigger(['price', 'description', 'stock', 'stockStatus']);
      if (!isValid) return;
    }
    setStep(s => s + 1);
  };

  const handlePrevStep = () => {
    setStep(s => Math.max(s - 1, 1));
  };

  // Natively support Camera & Gallery upload via Native Browser APIs
  const handleImageSelection = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.length) return;
    setUploading(true);
    const files = Array.from(e.target.files);
    const fd = new FormData();

    try {
      // Compress each image file on client side first
      const compressedFiles = await Promise.all(files.map(f => compressImage(f)));
      compressedFiles.forEach(f => fd.append('files', f));
      fd.append('folder', 'products');

      const res = await uploadMedia(fd);
      if (res.success && res.assets) {
        const uploadedUrls = res.assets.map((a: any) => a.url);
        setImages([...images, ...uploadedUrls]);
        addToast({ type: 'success', message: `${uploadedUrls.length} images compressed and uploaded!` });
      }
    } catch (err) {
      console.error(err);
      addToast({ type: 'error', message: 'Failed to upload images.' });
    } finally {
      setUploading(false);
    }
  };

  const handleReplaceImage = async (idx: number, e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.length) return;
    setUploading(true);
    const fd = new FormData();
    try {
      const compressed = await compressImage(e.target.files[0]);
      fd.append('files', compressed);
      fd.append('folder', 'products');

      const res = await uploadMedia(fd);
      if (res.success && res.assets?.[0]) {
        const list = [...images];
        list[idx] = res.assets[0].url;
        setImages(list);
        addToast({ type: 'success', message: 'Image replaced.' });
      }
    } catch {
      addToast({ type: 'error', message: 'Failed to replace image.' });
    } finally {
      setUploading(false);
    }
  };

  const removeImage = (idx: number) => {
    setImages(images.filter((_, i) => i !== idx));
  };

  const moveImage = (idx: number, direction: 'left' | 'right') => {
    const list = [...images];
    const targetIdx = direction === 'left' ? idx - 1 : idx + 1;
    if (targetIdx < 0 || targetIdx >= list.length) return;
    const temp = list[idx];
    list[idx] = list[targetIdx];
    list[targetIdx] = temp;
    setImages(list);
  };

  const handleFormSubmit = async (data: any) => {
    setLoading(true);
    try {
      const payload = {
        ...data,
        images,
        status: submitStatus,
      };
      await onSubmit(payload);
    } catch {
      addToast({ type: 'error', message: 'Failed to save product listing.' });
    } finally {
      setLoading(false);
    }
  };

  const categories = [
    'Bridal', 'Festive', 'Designer Suits', 'Cotton', 'Premium',
    'Printed', 'Rayon', 'Lawn', 'Embroidery', 'New Arrivals', 'Best Sellers'
  ];

  return (
    <div className="w-full">
      {/* Stepper Header */}
      <Card className="mb-6 bg-white p-5 border border-[#E6C280]/15 shadow-sm rounded-[12px]">
        <Stepper currentStep={step} steps={['Basic', 'Images', 'Pricing', 'Publish']} />
      </Card>

      <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
        
        {/* ================= STEP 1: Basic details & Category ================= */}
        {step === 1 && (
          <div className="space-y-6 animate-fade-in">
            {/* Basic Info Section */}
            <Card className="space-y-4 border border-[#E6C280]/15 shadow-sm rounded-[12px] p-6">
              <div className="flex items-center gap-2 border-b border-[#FAF6F0] pb-3 mb-2">
                <FileText size={18} className="text-[#C8851A]" />
                <h3 className="text-[16px] font-bold text-[#1C1008] font-serif" style={{ fontFamily: 'Cormorant Garamond, serif' }}>
                  Basic Information
                </h3>
              </div>
              
              <Input
                label="Product / Garment Name"
                icon={<Tag size={16} />}
                error={errors.name?.message as string}
                {...register('name')}
              />
            </Card>

            {/* Category Selection Section */}
            <Card className="space-y-5 border border-[#E6C280]/15 shadow-sm rounded-[12px] p-6">
              <div className="flex items-center gap-2 border-b border-[#FAF6F0] pb-3 mb-2">
                <Layers size={18} className="text-[#C8851A]" />
                <h3 className="text-[16px] font-bold text-[#1C1008] font-serif" style={{ fontFamily: 'Cormorant Garamond, serif' }}>
                  Category & Silhouette
                </h3>
              </div>

              <Dropdown
                label="Primary Category"
                options={categories.map(c => ({ value: c, label: c }))}
                error={errors.category?.message as string}
                {...register('category')}
              />

              <div className="space-y-2 pt-1">
                <label className="block text-[10px] font-bold text-[#6B5E4C] uppercase tracking-wider">Quick Category Select</label>
                <div className="flex flex-wrap gap-2">
                  {categories.map((cat) => {
                    const selected = formValues.category === cat;
                    return (
                      <button
                        key={cat}
                        type="button"
                        onClick={() => setValue('category', cat)}
                        className={`h-10 px-5 rounded-[8px] text-[11px] font-bold border transition-all cursor-pointer active:scale-95 ${
                          selected
                            ? 'bg-[#C8851A] text-white border-[#C8851A] shadow-sm'
                            : 'bg-white border-[#E8E2D9] text-[#6B5E4C] hover:bg-gray-50'
                        }`}
                      >
                        {cat}
                      </button>
                    );
                  })}
                </div>
              </div>
            </Card>
          </div>
        )}

        {/* ================= STEP 2: Images upload ================= */}
        {step === 2 && (
          <div className="space-y-6 animate-fade-in">
            <Card className="space-y-5 border border-[#E6C280]/15 shadow-sm rounded-[12px] p-6">
              <div className="flex items-center gap-2 border-b border-[#FAF6F0] pb-3 mb-2">
                <ImageIcon size={18} className="text-[#C8851A]" />
                <h3 className="text-[16px] font-bold text-[#1C1008] font-serif" style={{ fontFamily: 'Cormorant Garamond, serif' }}>
                  Apparel Images
                </h3>
              </div>

              {/* Upload Selectors Grid */}
              <div className="grid grid-cols-3 gap-3">
                {/* Camera */}
                <label className="h-24 rounded-[12px] border border-dashed border-[#E6C280]/30 flex flex-col items-center justify-center cursor-pointer bg-[#FAF6F0] active:scale-95 transition-all">
                  <Camera size={20} className="text-[#C8851A] mb-1" />
                  <span className="text-[9px] font-bold text-[#6B5E4C] uppercase tracking-wider">Camera</span>
                  <input
                    type="file"
                    accept="image/*"
                    capture="environment"
                    onChange={handleImageSelection}
                    className="hidden"
                  />
                </label>

                {/* Gallery */}
                <label className="h-24 rounded-[12px] border border-dashed border-[#E6C280]/30 flex flex-col items-center justify-center cursor-pointer bg-[#FAF6F0] active:scale-95 transition-all">
                  <GalleryIcon size={20} className="text-[#C8851A] mb-1" />
                  <span className="text-[9px] font-bold text-[#6B5E4C] uppercase tracking-wider">Gallery</span>
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleImageSelection}
                    className="hidden"
                  />
                </label>

                {/* Files */}
                <label className="h-24 rounded-[12px] border border-dashed border-[#E6C280]/30 flex flex-col items-center justify-center cursor-pointer bg-[#FAF6F0] active:scale-95 transition-all">
                  <Upload size={20} className="text-[#C8851A] mb-1" />
                  <span className="text-[9px] font-bold text-[#6B5E4C] uppercase tracking-wider">Files</span>
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleImageSelection}
                    className="hidden"
                  />
                </label>
              </div>

              {uploading && (
                <div className="flex items-center justify-center gap-2 py-3 text-[12px] text-[#9B8E7E] font-medium">
                  <Loader2 className="animate-spin text-[#C8851A]" size={16} />
                  Compressing and uploading assets...
                </div>
              )}

              {/* Uploaded Images List */}
              {images.length > 0 && (
                <div className="space-y-3 pt-2">
                  <label className="block text-[10px] font-bold text-[#6B5E4C] uppercase tracking-wider">Image Sequence (Drag/Reorder)</label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {images.map((url, idx) => (
                      <div
                        key={url}
                        className="bg-[#FAFAF8] border border-[#E6C280]/20 rounded-[12px] p-3 flex gap-3 relative"
                      >
                        <div className="w-16 h-20 rounded-lg bg-gray-50 border border-[#E6C280]/15 overflow-hidden flex-shrink-0 relative">
                          <img src={url} alt={`Preview ${idx + 1}`} className="w-full h-full object-cover object-top" />
                          <span className="absolute top-1 left-1 bg-black/60 text-white text-[9px] font-bold px-1.5 py-0.5 rounded">
                            #{idx + 1}
                          </span>
                        </div>

                        <div className="flex-1 flex flex-col justify-between py-0.5">
                          <div>
                            <p className="text-[11px] font-bold text-[#1C1008] font-serif truncate">garment_asset_{idx + 1}.jpg</p>
                            <p className="text-[9px] text-[#9B8E7E] uppercase font-semibold">Active thumbnail</p>
                          </div>

                          {/* Reordering & control icons */}
                          <div className="flex gap-2">
                            {idx > 0 && (
                              <button
                                type="button"
                                onClick={() => moveImage(idx, 'left')}
                                className="w-7 h-7 rounded-[6px] bg-white border border-[#E8E2D9] text-[#6B5E4C] flex items-center justify-center cursor-pointer active:scale-90 transition-transform"
                                title="Move up"
                              >
                                <ArrowLeft size={12} />
                              </button>
                            )}
                            {idx < images.length - 1 && (
                              <button
                                type="button"
                                onClick={() => moveImage(idx, 'right')}
                                className="w-7 h-7 rounded-[6px] bg-white border border-[#E8E2D9] text-[#6B5E4C] flex items-center justify-center cursor-pointer active:scale-90 transition-transform"
                                title="Move down"
                              >
                                <ArrowRight size={12} />
                              </button>
                            )}
                            
                            <label className="w-7 h-7 rounded-[6px] bg-white border border-[#E8E2D9] text-[#6B5E4C] flex items-center justify-center cursor-pointer active:scale-90 transition-transform" title="Replace file">
                              <Sparkles size={11} className="text-[#C8851A]" />
                              <input
                                type="file"
                                accept="image/*"
                                onChange={(e) => handleReplaceImage(idx, e)}
                                className="hidden"
                              />
                            </label>

                            <button
                              type="button"
                              onClick={() => removeImage(idx)}
                              className="w-7 h-7 rounded-[6px] bg-white border border-red-100 text-red-600 flex items-center justify-center cursor-pointer active:scale-90 transition-transform hover:bg-red-50"
                              title="Delete"
                            >
                              <Trash size={12} />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </Card>
          </div>
        )}

        {/* ================= STEP 3: Pricing, Stock, Description ================= */}
        {step === 3 && (
          <div className="space-y-6 animate-fade-in">
            {/* Pricing Section */}
            <Card className="space-y-4 border border-[#E6C280]/15 shadow-sm rounded-[12px] p-6">
              <div className="flex items-center gap-2 border-b border-[#FAF6F0] pb-3 mb-2">
                <IndianRupee size={18} className="text-[#C8851A]" />
                <h3 className="text-[16px] font-bold text-[#1C1008] font-serif" style={{ fontFamily: 'Cormorant Garamond, serif' }}>
                  Pricing Information
                </h3>
              </div>
              
              <Input
                label="Price (INR ₹)"
                type="number"
                error={errors.price?.message as string}
                {...register('price', { valueAsNumber: true })}
              />
            </Card>

            {/* Stock Section */}
            <Card className="space-y-5 border border-[#E6C280]/15 shadow-sm rounded-[12px] p-6">
              <div className="flex items-center gap-2 border-b border-[#FAF6F0] pb-3 mb-2">
                <Package size={18} className="text-[#C8851A]" />
                <h3 className="text-[16px] font-bold text-[#1C1008] font-serif" style={{ fontFamily: 'Cormorant Garamond, serif' }}>
                  Stock Inventory
                </h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="Stock Count"
                  type="number"
                  error={errors.stock?.message as string}
                  {...register('stock', { valueAsNumber: true })}
                />
                <Dropdown
                  label="Inventory Status"
                  options={[
                    { value: 'in_stock', label: 'In Stock' },
                    { value: 'out_of_stock', label: 'Out of Stock' }
                  ]}
                  error={errors.stockStatus?.message as string}
                  {...register('stockStatus')}
                />
              </div>

              <div className="flex items-center gap-2.5 pt-2">
                <input
                  type="checkbox"
                  id="featured"
                  className="w-4 h-4 text-[#C8851A] rounded border-[#E8E2D9] focus:ring-[#C8851A] cursor-pointer"
                  {...register('featured')}
                />
                <label htmlFor="featured" className="text-[11px] font-bold text-[#6B5E4C] uppercase tracking-wider select-none cursor-pointer">
                  Highlight this product as Featured collection
                </label>
              </div>
            </Card>

            {/* Description Section */}
            <Card className="space-y-4 border border-[#E6C280]/15 shadow-sm rounded-[12px] p-6">
              <div className="flex items-center gap-2 border-b border-[#FAF6F0] pb-3 mb-2">
                <FileText size={18} className="text-[#C8851A]" />
                <h3 className="text-[16px] font-bold text-[#1C1008] font-serif" style={{ fontFamily: 'Cormorant Garamond, serif' }}>
                  Description Details
                </h3>
              </div>

              <Textarea
                label="Product Narrative & Care Instructions"
                error={errors.description?.message as string}
                {...register('description')}
              />
            </Card>
          </div>
        )}

        {/* ================= STEP 4: Live Preview & Publish ================= */}
        {step === 4 && (
          <div className="space-y-6 animate-fade-in">
            <Card className="border border-[#E6C280]/15 shadow-sm rounded-[12px] p-6">
              <div className="flex items-center gap-2 border-b border-[#FAF6F0] pb-3 mb-4">
                <Eye size={18} className="text-[#C8851A]" />
                <h3 className="text-[16px] font-bold text-[#1C1008] font-serif" style={{ fontFamily: 'Cormorant Garamond, serif' }}>
                  Design Check & Live Preview
                </h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
                {/* Visual Card representation */}
                <div className="border border-[#E6C280]/15 rounded-[12px] overflow-hidden bg-[#FAFAF8] shadow-sm max-w-sm mx-auto w-full">
                  <div className="aspect-[4/5] bg-gray-100 relative overflow-hidden">
                    {images[0] ? (
                      <img src={images[0]} alt="Thumbnail" className="w-full h-full object-cover object-top" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-300">No Image</div>
                    )}
                    
                    <div className="absolute bottom-3 left-3 flex gap-1.5 z-10">
                      <Badge type={formValues.stock === 0 ? 'out_of_stock' : 'in_stock'} />
                      {formValues.featured && <Badge type="featured" />}
                    </div>
                    <div className="absolute top-3 right-3 z-10">
                      <Badge type={submitStatus as any} />
                    </div>
                  </div>
                  <div className="p-4 space-y-1 bg-white">
                    <div className="flex justify-between items-baseline gap-2">
                      <h4 className="text-[16px] font-bold text-[#1C1008] font-serif truncate" style={{ fontFamily: 'Cormorant Garamond, serif' }}>
                        {formValues.name || 'Untitled Garment'}
                      </h4>
                      <span className="text-[15px] font-bold text-[#C8851A]">
                        ₹{formValues.price?.toLocaleString('en-IN') || '0'}
                      </span>
                    </div>
                    <p className="text-[10px] text-[#9B8E7E] uppercase font-bold tracking-wider">{formValues.category}</p>
                  </div>
                </div>

                {/* Listing metadata summary */}
                <div className="space-y-4 py-2">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#9B8E7E] block">Product Description</span>
                    <p className="text-[13px] text-[#6B5E4C] leading-relaxed whitespace-pre-line mt-1">
                      {formValues.description || 'No description provided.'}
                    </p>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 border-t border-[#FAF6F0] pt-4">
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-[#9B8E7E] block">Primary Category</span>
                      <span className="text-[13px] text-[#1C1008] font-semibold block mt-0.5">{formValues.category}</span>
                    </div>
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-[#9B8E7E] block">Stock Inventory</span>
                      <span className="text-[13px] text-[#1C1008] font-semibold block mt-0.5">{formValues.stock} units</span>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        )}

        {/* ================= BUTTON ACTION FOOTERS (Global Component system: 52px tall, 12px rounded-xl) ================= */}
        <div className="flex gap-3 pt-4 mt-4">
          {step > 1 && (
            <Button
              type="button"
              variant="secondary"
              onClick={handlePrevStep}
              icon={<ArrowLeft size={14} />}
              className="w-32"
            >
              Back
            </Button>
          )}

          {step < 4 ? (
            <Button
              type="button"
              variant="primary"
              onClick={handleNextStep}
              icon={<ArrowRight size={14} />}
              className="flex-1"
            >
              Continue
            </Button>
          ) : (
            <div className="flex-1 flex flex-col sm:flex-row gap-3">
              <Button
                type="submit"
                variant="secondary"
                onClick={() => setSubmitStatus('draft')}
                loading={loading && submitStatus === 'draft'}
                className="flex-1"
              >
                Save Draft
              </Button>

              <Button
                type="submit"
                variant="primary"
                onClick={() => setSubmitStatus('published')}
                loading={loading && submitStatus === 'published'}
                className="flex-1"
              >
                Publish Live
              </Button>
            </div>
          )}
        </div>

        {step === 1 && (
          <div className="text-center pt-2">
            <button
              type="button"
              onClick={() => router.push('/admin/products')}
              className="text-[12px] font-bold text-[#9B8E7E] uppercase tracking-wider hover:text-[#1C1008] transition-colors cursor-pointer"
            >
              Cancel & Exit Form
            </button>
          </div>
        )}

      </form>
    </div>
  );
}
