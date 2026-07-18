'use client';
import { useState } from 'react';
import { Globe, Search, ArrowRight, Check, AlertCircle } from 'lucide-react';
import { useAdminStore } from '@/lib/adminStore';

export default function SeoManagerPage() {
  const [siteTitle, setSiteTitle] = useState('Sana Fashion — Luxury Ethnic Wear & Bridal Collections');
  const [siteDesc, setSiteDesc] = useState('Sana Fashion is a premium luxury fashion house specialising in bridal lehengas, festive anarkalis, and designer suits crafted with generational artistry.');
  const [keywords, setKeywords] = useState('luxury ethnic wear, bridal lehenga, designer suits, festive wear, Indian fashion, Sana Fashion');
  const [robots, setRobots] = useState('index, follow');
  const [saving, setSaving] = useState(false);
  const { addToast } = useAdminStore();

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setTimeout(() => {
      setSaving(false);
      addToast({ type: 'success', message: 'Global SEO configurations saved!' });
    }, 800);
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="page-header">
        <div>
          <h1 className="page-title">SEO Manager</h1>
          <p className="page-subtitle">Configure global indexing, keywords, and Google search presence.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: configuration form */}
        <div className="lg:col-span-2 space-y-6">
          <form onSubmit={handleSave} className="admin-card p-6 space-y-4">
            <h2 className="text-[15px] font-semibold text-[#1C1008] border-b border-[#F0EDE8] pb-2" style={{ fontFamily: 'Cormorant Garamond, serif' }}>
              Global Search Configurations
            </h2>

            <div>
              <label className="admin-label">Default SEO Title template</label>
              <input
                type="text"
                className="admin-input"
                value={siteTitle}
                onChange={(e) => setSiteTitle(e.target.value)}
              />
            </div>

            <div>
              <label className="admin-label">Default Meta Description</label>
              <textarea
                rows={4}
                className="admin-textarea"
                value={siteDesc}
                onChange={(e) => setSiteDesc(e.target.value)}
              />
            </div>

            <div>
              <label className="admin-label">SEO Target Keywords (comma separated)</label>
              <input
                type="text"
                className="admin-input"
                value={keywords}
                onChange={(e) => setKeywords(e.target.value)}
              />
            </div>

            <div>
              <label className="admin-label">Robots Index settings</label>
              <select className="admin-select" value={robots} onChange={(e) => setRobots(e.target.value)}>
                <option value="index, follow">Index, Follow (Recommended)</option>
                <option value="noindex, nofollow">No Index, No Follow</option>
              </select>
            </div>

            <div className="pt-2">
              <button type="submit" disabled={saving} className="btn-primary">
                {saving ? 'Saving...' : 'Save Global SEO Settings'}
              </button>
            </div>
          </form>
        </div>

        {/* Right: Search result preview card */}
        <div className="space-y-6">
          <div className="admin-card p-5 space-y-4">
            <h2 className="text-[15px] font-semibold text-[#1C1008]" style={{ fontFamily: 'Cormorant Garamond, serif' }}>
              Google Search Snippet Preview
            </h2>
            
            <div className="p-4 bg-white border border-[#E8E2D9] rounded-lg space-y-1.5 shadow-sm">
              <span className="text-[11px] text-gray-500 block truncate">https://sanafashion.in</span>
              <p className="text-[15px] font-medium text-blue-800 hover:underline leading-tight cursor-pointer truncate">
                {siteTitle}
              </p>
              <p className="text-[12px] text-gray-700 leading-normal line-clamp-3">
                {siteDesc}
              </p>
            </div>

            <div className="bg-[#FAFAF8] p-4 rounded-lg border border-[#E8E2D9] text-[11px] text-[#9B8E7E] flex gap-2">
              <AlertCircle size={16} className="text-[#C8851A] flex-shrink-0 mt-0.5" />
              <span>
                Google dynamically formats titles and descriptions based on user search intent. Ensure keywords are woven in cleanly.
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
