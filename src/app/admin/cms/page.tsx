'use client';
import { useEffect, useState } from 'react';
import { getCmsSections, updateCmsSection, toggleSectionVisibility, seedCmsSections, uploadMedia } from '@/lib/adminApi';
import {
  Globe, Eye, EyeOff, Edit, Copy, Trash, Loader2, Sparkles,
  ArrowUp, ArrowDown, Check, FileText, Settings, Layout, RefreshCw, Smartphone, Laptop, Upload, ImageIcon
} from 'lucide-react';
import { useAdminStore } from '@/lib/adminStore';

export default function HomepageBuilder() {
  const [sections, setSections] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { addToast } = useAdminStore();

  // CMS Editor Sidebar state
  const [activeSection, setActiveSection] = useState<any>(null);
  const [title, setTitle] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [body, setBody] = useState('');
  const [bgImage, setBgImage] = useState('');
  const [btnLabel, setBtnLabel] = useState('');
  const [btnHref, setBtnHref] = useState('');
  const [visible, setVisible] = useState(true);
  
  const [saving, setSaving] = useState(false);
  const [seeding, setSeeding] = useState(false);
  const [uploading, setUploading] = useState(false);

  // Live preview layout toggles
  const [previewDevice, setPreviewDevice] = useState<'mobile' | 'desktop'>('desktop');

  const fetchSections = () => {
    setLoading(true);
    getCmsSections()
      .then((data) => {
        setSections(data.sections || []);
      })
      .catch((err) => {
        console.error(err);
        addToast({ type: 'error', message: 'Failed to load CMS sections.' });
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchSections();
  }, []);

  const handleSeed = async () => {
    setSeeding(true);
    try {
      await seedCmsSections();
      addToast({ type: 'success', message: 'CMS default sections seeded successfully.' });
      fetchSections();
    } catch {
      addToast({ type: 'error', message: 'Failed to seed defaults.' });
    } finally {
      setSeeding(false);
    }
  };

  const handleToggleVisibility = async (key: string, currentVis: boolean) => {
    try {
      await toggleSectionVisibility(key, !currentVis);
      addToast({ type: 'success', message: `Section visibility toggled.` });
      fetchSections();
      if (activeSection?.key === key) {
        setVisible(!currentVis);
      }
    } catch {
      addToast({ type: 'error', message: 'Failed to toggle visibility.' });
    }
  };

  const openEditor = (sec: any) => {
    setActiveSection(sec);
    setTitle(sec.title || '');
    setSubtitle(sec.subtitle || '');
    setBody(sec.body || '');
    setBgImage(sec.bgImage || '');
    setBtnLabel(sec.buttons?.[0]?.label || '');
    setBtnHref(sec.buttons?.[0]?.href || '');
    setVisible(sec.visible ?? true);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.length) return;
    setUploading(true);
    const fd = new FormData();
    fd.append('files', e.target.files[0]);
    fd.append('folder', 'cms');
    try {
      const res = await uploadMedia(fd);
      if (res.success && res.assets?.[0]) {
        setBgImage(res.assets[0].url);
        addToast({ type: 'success', message: 'Hero background image uploaded!' });
      }
    } catch {
      addToast({ type: 'error', message: 'Upload failed.' });
    } finally {
      setUploading(false);
    }
  };

  const handleSaveDraft = async () => {
    if (!activeSection) return;
    setSaving(true);
    const payload = {
      ...activeSection,
      title,
      subtitle,
      body,
      bgImage,
      buttons: btnLabel ? [{ label: btnLabel, href: btnHref || '#', variant: 'primary' }] : [],
      visible,
      status: 'draft',
    };
    try {
      await updateCmsSection(activeSection.key, payload);
      addToast({ type: 'success', message: 'Section draft saved locally.' });
      fetchSections();
    } catch {
      addToast({ type: 'error', message: 'Failed to save draft.' });
    } finally {
      setSaving(false);
    }
  };

  const handlePublish = async () => {
    if (!activeSection) return;
    setSaving(true);
    const payload = {
      ...activeSection,
      title,
      subtitle,
      body,
      bgImage,
      buttons: btnLabel ? [{ label: btnLabel, href: btnHref || '#', variant: 'primary' }] : [],
      visible,
      status: 'published',
    };
    try {
      await updateCmsSection(activeSection.key, payload);
      addToast({ type: 'success', message: 'Section changes published live!' });
      fetchSections();
    } catch {
      addToast({ type: 'error', message: 'Failed to publish section.' });
    } finally {
      setSaving(false);
    }
  };

  // Reorder index shifters
  const moveOrder = async (idx: number, direction: 'up' | 'down') => {
    const targetIdx = direction === 'up' ? idx - 1 : idx + 1;
    if (targetIdx < 0 || targetIdx >= sections.length) return;

    const list = [...sections];
    const temp = list[idx].order;
    list[idx].order = list[targetIdx].order;
    list[targetIdx].order = temp;

    setSections(list.sort((a, b) => a.order - b.order));
  };

  return (
    <div className="space-y-6 p-4 md:p-10 max-w-full mx-auto animate-fade-in font-sans">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-[#E8E2D9] pb-6">
        <div>
          <h1 className="text-[28px] font-semibold text-[#1C1008]" style={{ fontFamily: 'Cormorant Garamond, serif' }}>
            Website Editor
          </h1>
          <p className="text-[13px] text-[#9B8E7E] mt-0.5">
            Configure images, stories, testomonials, and navigation links. No coding required.
          </p>
        </div>
        {sections.length === 0 && (
          <button onClick={handleSeed} disabled={seeding} className="btn-primary h-11 px-5 flex items-center gap-2 cursor-pointer">
            {seeding ? <Loader2 size={14} className="animate-spin" /> : <RefreshCw size={14} />} Seed Default Content
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left: Sections List (4 cols) */}
        <div className="lg:col-span-4 space-y-4">
          <div className="bg-white border border-[#E8E2D9] rounded-[20px] p-5 shadow-sm">
            <h2 className="text-[15px] font-semibold text-[#1C1008] border-b border-[#F0EDE8] pb-2 mb-3" style={{ fontFamily: 'Cormorant Garamond, serif' }}>
              Layout blocks
            </h2>

            {loading ? (
              <div className="py-8 text-center flex flex-col items-center gap-2 text-[#9B8E7E] text-[13px]">
                <Loader2 className="animate-spin text-[#C8851A]" size={20} />
                Loading layout sections...
              </div>
            ) : sections.length > 0 ? (
              <div className="space-y-2">
                {sections.map((sec, idx) => {
                  const isActive = activeSection?.key === sec.key;
                  return (
                    <div
                      key={sec._id}
                      className={`flex items-center justify-between p-3.5 border rounded-xl transition-all ${
                        isActive ? 'border-[#C8851A] bg-[rgba(200,133,26,0.04)] shadow-sm' : 'border-[#E8E2D9]'
                      }`}
                    >
                      <div className="flex-1 min-w-0" onClick={() => openEditor(sec)}>
                        <p className="text-[13.5px] font-semibold text-[#1C1008] truncate cursor-pointer">{sec.sectionName}</p>
                        <p className="text-[10px] text-[#9B8E7E] mt-0.5 capitalize font-medium">{sec.status}</p>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => handleToggleVisibility(sec.key, sec.visible)}
                          className="p-1.5 hover:bg-gray-50 rounded text-[#9B8E7E] hover:text-[#1C1008] cursor-pointer"
                        >
                          {sec.visible ? <Eye size={14} /> : <EyeOff size={14} />}
                        </button>
                        <button
                          onClick={() => moveOrder(idx, 'up')}
                          disabled={idx === 0}
                          className="p-1.5 hover:bg-gray-50 rounded text-[#9B8E7E] hover:text-[#1C1008] disabled:opacity-30 cursor-pointer"
                        >
                          <ArrowUp size={14} />
                        </button>
                        <button
                          onClick={() => moveOrder(idx, 'down')}
                          disabled={idx === sections.length - 1}
                          className="p-1.5 hover:bg-gray-50 rounded text-[#9B8E7E] hover:text-[#1C1008] disabled:opacity-30 cursor-pointer"
                        >
                          <ArrowDown size={14} />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="py-8 text-center text-[#9B8E7E] text-[13px]">
                No layout blocks configured.
              </div>
            )}
          </div>
        </div>

        {/* Center: Block Editor (4 cols) */}
        <div className="lg:col-span-4">
          {activeSection ? (
            <div className="bg-white border border-[#E8E2D9] rounded-[20px] p-5 sm:p-6 space-y-4 shadow-sm animate-slide-up">
              <div className="flex justify-between items-center border-b border-[#F0EDE8] pb-2.5">
                <h3 className="font-semibold text-[15px] text-[#1C1008]" style={{ fontFamily: 'Cormorant Garamond, serif' }}>
                  Configure: {activeSection.sectionName}
                </h3>
                <span className={`badge-${activeSection.status}`}>{activeSection.status}</span>
              </div>

              <div>
                <label className="admin-label">Headline Title</label>
                <input
                  type="text"
                  className="admin-input text-[13px]"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </div>

              <div>
                <label className="admin-label">Subtitle / Tagline</label>
                <input
                  type="text"
                  className="admin-input text-[13px]"
                  value={subtitle}
                  onChange={(e) => setSubtitle(e.target.value)}
                />
              </div>

              <div>
                <label className="admin-label">Paragraph Body Text</label>
                <textarea
                  rows={4}
                  className="admin-textarea text-[13px]"
                  value={body}
                  onChange={(e) => setBody(e.target.value)}
                />
              </div>

              {/* Background Image upload for sections */}
              <div className="border-t border-[#F0EDE8] pt-3">
                <label className="admin-label">Background / Cover Image</label>
                <div className="flex items-center gap-4 mt-2">
                  <div className="w-14 h-14 rounded-lg border bg-[#FAFAF8] overflow-hidden flex items-center justify-center">
                    {bgImage ? <img src={bgImage} className="w-full h-full object-cover" /> : <ImageIcon size={18} className="text-[#9B8E7E]" />}
                  </div>
                  <label className="flex items-center gap-1.5 px-3 py-2 border rounded-lg hover:bg-gray-50 text-[12px] font-semibold text-[#6B5E4C] cursor-pointer">
                    {uploading ? <Loader2 size={12} className="animate-spin text-[#C8851A]" /> : <Upload size={12} />}
                    Replace Image
                    <input type="file" onChange={handleImageUpload} className="hidden" />
                  </label>
                </div>
              </div>

              {/* Button link settings */}
              <div className="border-t border-[#F0EDE8] pt-3 grid grid-cols-2 gap-3">
                <div>
                  <label className="admin-label">Button Label</label>
                  <input
                    type="text"
                    className="admin-input text-[12px]"
                    value={btnLabel}
                    onChange={(e) => setBtnLabel(e.target.value)}
                    placeholder="e.g. Explore"
                  />
                </div>
                <div>
                  <label className="admin-label">Button Redirect Link</label>
                  <input
                    type="text"
                    className="admin-input text-[12px]"
                    value={btnHref}
                    onChange={(e) => setBtnHref(e.target.value)}
                    placeholder="e.g. /collections"
                  />
                </div>
              </div>

              {/* Visibility toggle */}
              <div className="pt-2">
                <label className="flex items-center gap-2 cursor-pointer font-medium text-[13px] text-[#6B5E4C]">
                  <input
                    type="checkbox"
                    checked={visible}
                    onChange={(e) => setVisible(e.target.checked)}
                    className="rounded border-[#E8E2D9] text-[#C8851A] focus:ring-[#C8851A]"
                  />
                  Show this section on homepage
                </label>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2 pt-3 border-t border-[#F0EDE8]">
                <button
                  type="button"
                  onClick={handleSaveDraft}
                  disabled={saving}
                  className="flex-1 btn-secondary text-[12px] py-2 cursor-pointer"
                >
                  Save Draft
                </button>
                <button
                  type="button"
                  onClick={handlePublish}
                  disabled={saving}
                  className="flex-1 btn-primary text-[12px] py-2 cursor-pointer"
                >
                  {saving ? 'Publishing...' : 'Publish Live'}
                </button>
              </div>
            </div>
          ) : (
            <div className="bg-white border border-[#E8E2D9] rounded-[20px] p-8 text-center text-[#9B8E7E] italic text-[13px]">
              Select a layout block on the left panel to configure its content, images, and button triggers.
            </div>
          )}
        </div>

        {/* Right: Live Preview Panel (4 cols) */}
        <div className="lg:col-span-4 space-y-4">
          <div className="bg-white border border-[#E8E2D9] rounded-[20px] overflow-hidden shadow-sm">
            <div className="px-4 py-3 bg-[#FAFAF8] border-b border-[#E8E2D9] flex justify-between items-center">
              <span className="text-[12px] font-semibold text-[#6B5E4C] flex items-center gap-1.5">
                <Globe size={13} /> Live Preview
              </span>
              <div className="flex border rounded overflow-hidden bg-white text-gray-500">
                <button
                  onClick={() => setPreviewDevice('mobile')}
                  className={`p-1.5 cursor-pointer ${previewDevice === 'mobile' ? 'bg-[#C8851A] text-white' : 'hover:bg-gray-100'}`}
                >
                  <Smartphone size={13} />
                </button>
                <button
                  onClick={() => setPreviewDevice('desktop')}
                  className={`p-1.5 cursor-pointer ${previewDevice === 'desktop' ? 'bg-[#C8851A] text-white' : 'hover:bg-gray-100'}`}
                >
                  <Laptop size={13} />
                </button>
              </div>
            </div>

            {/* Simulating live preview device view */}
            <div className="p-4 bg-gray-100 flex justify-center">
              <div
                className={`bg-white border shadow-inner transition-all duration-300 overflow-y-auto ${
                  previewDevice === 'mobile' ? 'w-[240px] h-[360px]' : 'w-full h-[360px]'
                }`}
              >
                <div className="p-3 space-y-3">
                  <p className="text-[9px] tracking-widest uppercase font-bold text-center text-[#C8851A] border-b pb-1.5">SANA ATELIER</p>
                  
                  {sections.filter(s => s.visible).map(sec => {
                    const isEditingThis = activeSection?.key === sec.key;
                    const previewTitle = isEditingThis ? title : sec.title;
                    const previewSubtitle = isEditingThis ? subtitle : sec.subtitle;
                    const previewBody = isEditingThis ? body : sec.body;

                    return (
                      <div
                        key={sec._id}
                        className={`p-2.5 rounded border text-left ${isEditingThis ? 'border-[#C8851A] bg-amber-50/10' : 'border-gray-200'}`}
                      >
                        <span className="text-[7.5px] uppercase font-bold text-[#9B8E7E] block">{sec.sectionName}</span>
                        {previewSubtitle && <p className="text-[8px] italic text-[#C8851A] mt-0.5">{previewSubtitle}</p>}
                        {previewTitle && <p className="text-[10px] font-semibold text-[#1C1008] leading-tight mt-0.5">{previewTitle}</p>}
                        {previewBody && <p className="text-[8px] text-[#6B5E4C] line-clamp-2 mt-1">{previewBody}</p>}
                      </div>
                    );
                  })}
                  <p className="text-[8px] text-[#9B8E7E] text-center pt-3 border-t">© 2026 SANA FASHION</p>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
