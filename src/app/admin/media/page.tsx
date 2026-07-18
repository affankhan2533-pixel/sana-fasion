'use client';
import { useEffect, useState } from 'react';
import { getMedia, uploadMedia, deleteMedia, bulkDeleteMedia, updateMedia } from '@/lib/adminApi';
import {
  Image as ImageIcon, Search, Upload, Trash, Loader2, Folder, Tag, Plus, Check,
  AlertCircle, Grid, List, Info, RefreshCw, Clipboard
} from 'lucide-react';
import { useAdminStore } from '@/lib/adminStore';

export default function MediaLibraryPage() {
  const [assets, setAssets] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [folder, setFolder] = useState('general');
  const [uploading, setUploading] = useState(false);
  const { addToast } = useAdminStore();

  // Selection
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  
  // Inspect asset sidebar panel
  const [inspectedAsset, setInspectedAsset] = useState<any>(null);
  const [altText, setAltText] = useState('');
  const [updatingAsset, setUpdatingAsset] = useState(false);

  const fetchMedia = () => {
    setLoading(true);
    getMedia({
      search: search.trim() || undefined,
      folder: folder || undefined,
    })
      .then((data) => setAssets(data.assets || []))
      .catch((err) => {
        console.error(err);
        addToast({ type: 'error', message: 'Failed to load media library.' });
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchMedia();
  }, [folder]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchMedia();
  };

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.length) return;
    setUploading(true);
    const files = Array.from(e.target.files);
    const fd = new FormData();
    files.forEach((f) => fd.append('files', f));
    fd.append('folder', folder);

    try {
      const res = await uploadMedia(fd);
      if (res.success && res.assets) {
        addToast({ type: 'success', message: `${res.assets.length} items uploaded and WebP optimised!` });
        fetchMedia();
      }
    } catch {
      addToast({ type: 'error', message: 'Upload failed.' });
    } finally {
      setUploading(false);
    }
  };

  const handleInspect = (a: any) => {
    setInspectedAsset(a);
    setAltText(a.altText || '');
  };

  const handleUpdateAssetDetails = async () => {
    if (!inspectedAsset) return;
    setUpdatingAsset(true);
    try {
      await updateMedia(inspectedAsset._id, { altText });
      addToast({ type: 'success', message: 'Alt text updated.' });
      fetchMedia();
      setInspectedAsset((prev: any) => ({ ...prev, altText }));
    } catch {
      addToast({ type: 'error', message: 'Update failed.' });
    } finally {
      setUpdatingAsset(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this file?')) return;
    try {
      await deleteMedia(id);
      addToast({ type: 'success', message: 'File deleted successfully.' });
      setInspectedAsset(null);
      fetchMedia();
    } catch {
      addToast({ type: 'error', message: 'Failed to delete file.' });
    }
  };

  const handleBulkDelete = async () => {
    if (selectedIds.length === 0) return;
    if (!confirm(`Delete ${selectedIds.length} files permanently?`)) return;

    try {
      await bulkDeleteMedia(selectedIds);
      addToast({ type: 'success', message: 'Bulk delete completed successfully.' });
      setSelectedIds([]);
      fetchMedia();
    } catch {
      addToast({ type: 'error', message: 'Failed to perform bulk delete.' });
    }
  };

  const handleSelectOne = (id: string, checked: boolean) => {
    if (checked) {
      setSelectedIds([...selectedIds, id]);
    } else {
      setSelectedIds(selectedIds.filter((x) => x !== id));
    }
  };

  const copyToClipboard = (url: string) => {
    navigator.clipboard.writeText(url);
    addToast({ type: 'success', message: 'Copied file URL to clipboard!' });
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="page-header">
        <div>
          <h1 className="page-title">Media Library</h1>
          <p className="page-subtitle">Manage, crop, and store campaign images.</p>
        </div>
        <label className="btn-primary">
          {uploading ? (
            <><Loader2 size={15} className="animate-spin" /> Uploading...</>
          ) : (
            <><Upload size={15} /> Upload Files</>
          )}
          <input type="file" multiple accept="image/*" className="hidden" onChange={handleUpload} />
        </label>
      </div>

      {/* Folder Tabs / Search */}
      <div className="admin-card p-4 flex flex-col md:flex-row gap-4 justify-between items-center">
        {/* Folder tabs */}
        <div className="flex gap-2">
          {['general', 'products', 'collections', 'homepage'].map((f) => (
            <button
              key={f}
              onClick={() => { setFolder(f); setSelectedIds([]); setInspectedAsset(null); }}
              className={`px-3 py-1.5 rounded-lg text-[12px] font-semibold tracking-wide uppercase transition-colors cursor-pointer ${folder === f ? 'bg-[rgba(200,133,26,0.12)] text-[#C8851A]' : 'hover:bg-gray-100 text-gray-500'}`}
            >
              {f}
            </button>
          ))}
        </div>

        {/* Search */}
        <form onSubmit={handleSearchSubmit} className="flex gap-2 w-full md:max-w-[280px]">
          <input
            type="text"
            className="admin-input py-1.5 text-[12px]"
            placeholder="Search filenames..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <button type="submit" className="btn-secondary py-1.5 px-3">
            <Search size={14} />
          </button>
        </form>
      </div>

      {/* Bulk action header */}
      {selectedIds.length > 0 && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-[10px] flex justify-between items-center">
          <span className="text-[13px] text-red-900 font-medium">{selectedIds.length} items selected</span>
          <button onClick={handleBulkDelete} className="btn-danger py-1 px-3 text-[12px]">
            Delete Selected
          </button>
        </div>
      )}

      {/* Main Showcase Split grid */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Left: Gallery Grid */}
        <div className="lg:col-span-3">
          {loading ? (
            <div className="py-20 text-center">
              <Loader2 className="animate-spin text-[#C8851A] mx-auto mb-3" size={24} />
              <p className="text-[13px] text-[#9B8E7E]">Fetching assets...</p>
            </div>
          ) : assets.length > 0 ? (
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-4">
              {assets.map((asset) => {
                const isSelected = selectedIds.includes(asset._id);
                return (
                  <div
                    key={asset._id}
                    className="relative aspect-square border bg-[#FAFAF8] rounded-lg overflow-hidden group hover:border-[#C8851A] transition-all cursor-pointer"
                    onClick={() => handleInspect(asset)}
                  >
                    <img src={asset.url} alt={asset.filename} className="w-full h-full object-cover" />
                    
                    {/* Checkbox selector */}
                    <div className="absolute top-1.5 left-1.5 z-10" onClick={(e) => e.stopPropagation()}>
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={(e) => handleSelectOne(asset._id, e.target.checked)}
                      />
                    </div>

                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity gap-1.5">
                      <button
                        onClick={(e) => { e.stopPropagation(); copyToClipboard(asset.url); }}
                        className="p-1.5 bg-white rounded-md text-[#1C1008] hover:bg-gray-100 shadow"
                        title="Copy Link"
                      >
                        <Clipboard size={12} />
                      </button>
                      <button
                        onClick={(e) => { e.stopPropagation(); handleDelete(asset._id); }}
                        className="p-1.5 bg-red-600 rounded-md text-white hover:bg-red-700 shadow"
                        title="Delete"
                      >
                        <Trash size={12} />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="py-20 text-center border-2 border-dashed border-[#E8E2D9] rounded-xl bg-white">
              <ImageIcon className="text-gray-300 mx-auto mb-3" size={32} />
              <p className="text-[13px] text-[#9B8E7E]">No files uploaded to folder "{folder}" yet.</p>
            </div>
          )}
        </div>

        {/* Right: Inspection Sidebar */}
        <div>
          {inspectedAsset ? (
            <div className="admin-card p-4 space-y-4 animate-slide-up h-fit sticky top-6">
              <h3 className="font-semibold text-[14px] text-[#1C1008] border-b border-[#F0EDE8] pb-1.5" style={{ fontFamily: 'Cormorant Garamond, serif' }}>
                File Inspector
              </h3>
              
              <div className="aspect-square bg-gray-50 border rounded-lg overflow-hidden relative">
                <img src={inspectedAsset.url} alt="Inspect" className="w-full h-full object-contain" />
              </div>

              <div className="text-[11px] text-[#9B8E7E] space-y-1 pb-2 border-b border-[#F0EDE8]">
                <p className="font-semibold text-[#6B5E4C] truncate">{inspectedAsset.filename}</p>
                {inspectedAsset.size && <p>File size: {(inspectedAsset.size / 1024).toFixed(1)} KB</p>}
                {inspectedAsset.width && <p>Dimensions: {inspectedAsset.width} × {inspectedAsset.height} px</p>}
                {inspectedAsset.format && <p className="uppercase">Format: {inspectedAsset.format} (WebP optimised)</p>}
              </div>

              <div>
                <label className="admin-label">Image Alt Text (SEO)</label>
                <input
                  type="text"
                  className="admin-input text-[12px] py-1.5"
                  value={altText}
                  onChange={(e) => setAltText(e.target.value)}
                  placeholder="Describe image layout for search engines"
                />
              </div>

              <div className="flex gap-2">
                <button
                  onClick={handleUpdateAssetDetails}
                  disabled={updatingAsset}
                  className="flex-1 btn-primary py-1.5 px-3 text-[11px]"
                >
                  {updatingAsset ? 'Saving...' : 'Update Details'}
                </button>
                <button
                  onClick={() => handleDelete(inspectedAsset._id)}
                  className="btn-danger py-1.5 px-3 text-[11px] bg-red-600"
                >
                  Delete
                </button>
              </div>
            </div>
          ) : (
            <div className="admin-card p-6 text-center text-gray-400 italic text-[12px] h-fit">
              Select an image from the gallery grid to inspect its metadata and edit alt text.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
