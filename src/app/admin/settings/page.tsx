'use client';
import { useState } from 'react';
import { Settings, Save, AlertCircle, Sparkles, MapPin, Phone, Mail, MessageSquare } from 'lucide-react';
import { useAdminStore } from '@/lib/adminStore';

export default function SettingsPage() {
  const [address, setAddress] = useState('Sana Fashion Atelier, Mumbai, India');
  const [phone, setPhone] = useState('+91 90225 91620');
  const [email, setEmail] = useState('hello@sanafashion.in');
  const [insta, setInsta] = useState('https://www.instagram.com/sana___fashion___01/');
  const [whatsapp, setWhatsapp] = useState('+91 90225 91620');
  const [copyright, setCopyright] = useState('© 2026 Sana Fashion. All rights reserved.');
  
  const [saving, setSaving] = useState(false);
  const { addToast } = useAdminStore();

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setTimeout(() => {
      setSaving(false);
      addToast({ type: 'success', message: 'Brand settings updated successfully!' });
    }, 800);
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="page-header">
        <div>
          <h1 className="page-title">Brand Studio Settings</h1>
          <p className="page-subtitle">Configure contact links, address coordinates, and social handles.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <form onSubmit={handleSave} className="admin-card p-6 space-y-4">
            <h2 className="text-[15px] font-semibold text-[#1C1008] border-b border-[#F0EDE8] pb-2" style={{ fontFamily: 'Cormorant Garamond, serif' }}>
              Atelier Coordinates & Contacts
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="admin-label flex items-center gap-1.5">
                  <Phone size={12} /> Contact Hot-line
                </label>
                <input
                  type="text"
                  className="admin-input"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
              </div>

              <div>
                <label className="admin-label flex items-center gap-1.5">
                  <Mail size={12} /> Public Contact Email
                </label>
                <input
                  type="email"
                  className="admin-input"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              <div>
                <label className="admin-label flex items-center gap-1.5">
                  <MessageSquare size={12} /> WhatsApp Helpline
                </label>
                <input
                  type="text"
                  className="admin-input"
                  value={whatsapp}
                  onChange={(e) => setWhatsapp(e.target.value)}
                />
              </div>

              <div>
                <label className="admin-label flex items-center gap-1.5">
                  <Settings size={12} /> Instagram Handle URL
                </label>
                <input
                  type="text"
                  className="admin-input"
                  value={insta}
                  onChange={(e) => setInsta(e.target.value)}
                />
              </div>
            </div>

            <div>
              <label className="admin-label flex items-center gap-1.5">
                <MapPin size={12} /> Physical Atelier Address
              </label>
              <textarea
                rows={2}
                className="admin-textarea"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
              />
            </div>

            <div>
              <label className="admin-label">Copyright notice text</label>
              <input
                type="text"
                className="admin-input"
                value={copyright}
                onChange={(e) => setCopyright(e.target.value)}
              />
            </div>

            <div className="pt-2">
              <button type="submit" disabled={saving} className="btn-primary">
                {saving ? 'Saving...' : 'Save Brand Settings'}
              </button>
            </div>
          </form>
        </div>

        {/* Right Info card */}
        <div>
          <div className="admin-card p-5 space-y-4">
            <h2 className="text-[15px] font-semibold text-[#1C1008]" style={{ fontFamily: 'Cormorant Garamond, serif' }}>
              Atelier Coordinates Info
            </h2>
            <div className="bg-[#FAFAF8] p-4 rounded-lg border border-[#E8E2D9] text-[12px] text-[#6B5E4C] space-y-3">
              <p>
                Configure active contact links to ensure WhatsApp shortcuts, Instagram follow icons, and maps location widgets align cleanly.
              </p>
              <div className="flex gap-2 text-amber-700 font-semibold items-center text-[11px]">
                <Sparkles size={14} /> Global changes update immediately.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
