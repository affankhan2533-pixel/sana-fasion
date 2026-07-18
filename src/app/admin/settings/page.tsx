'use client';
import { useState, useEffect } from 'react';
import { Settings, Save, Lock, LogOut, Loader2, Globe, ShieldCheck } from 'lucide-react';
import { useAdminStore } from '@/lib/adminStore';
import { changePassword } from '@/lib/adminApi';
import { useRouter } from 'next/navigation';

export default function SettingsPage() {
  const router = useRouter();
  const { addToast, clearAuth } = useAdminStore();

  // Brand configurations
  const [websiteName, setWebsiteName] = useState('SANA Fashion');
  const [logoUrl, setLogoUrl] = useState('/images/logo.png');
  const [whatsapp, setWhatsapp] = useState('+91 90225 91620');
  const [email, setEmail] = useState('hello@sanafashion.in');
  const [savingBrand, setSavingBrand] = useState(false);

  // Change Password state
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [changingPass, setChangingPass] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setWebsiteName(localStorage.getItem('brand_name') || 'SANA Fashion');
      setLogoUrl(localStorage.getItem('brand_logo') || '/images/logo.png');
      setWhatsapp(localStorage.getItem('brand_whatsapp') || '+91 90225 91620');
      setEmail(localStorage.getItem('brand_email') || 'hello@sanafashion.in');
    }
  }, []);

  const handleSaveBrand = (e: React.FormEvent) => {
    e.preventDefault();
    setSavingBrand(true);
    setTimeout(() => {
      localStorage.setItem('brand_name', websiteName);
      localStorage.setItem('brand_logo', logoUrl);
      localStorage.setItem('brand_whatsapp', whatsapp);
      localStorage.setItem('brand_email', email);
      setSavingBrand(false);
      addToast({ type: 'success', message: 'Brand settings updated successfully!' });
    }, 600);
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentPassword || !newPassword) {
      addToast({ type: 'warning', message: 'Please fill in all password fields.' });
      return;
    }
    if (newPassword !== confirmPassword) {
      addToast({ type: 'error', message: 'New passwords do not match.' });
      return;
    }

    setChangingPass(true);
    try {
      await changePassword({ currentPassword, newPassword });
      addToast({ type: 'success', message: 'Password changed successfully!' });
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err: any) {
      const msg = err.response?.data?.message || 'Failed to change password.';
      addToast({ type: 'error', message: msg });
    } finally {
      setChangingPass(false);
    }
  };

  const handleLogout = () => {
    clearAuth();
    router.push('/admin/login');
    addToast({ type: 'success', message: 'Logged out successfully.' });
  };

  return (
    <div className="max-w-md mx-auto space-y-6 animate-fade-in font-sans p-1 md:py-8">
      
      {/* Title */}
      <div className="border-b border-[#E6C280]/20 pb-4">
        <h1 className="text-[28px] font-semibold text-[#1C1008] font-serif" style={{ fontFamily: 'Cormorant Garamond, serif' }}>
          Settings
        </h1>
        <p className="text-[12px] text-[#9B8E7E]">Configure brand coordinates & credentials</p>
      </div>

      {/* 1. Website Branding Card */}
      <form onSubmit={handleSaveBrand} className="bg-white border border-[#E6C280]/20 rounded-2xl p-5 space-y-4 shadow-sm">
        <h2 className="text-[16px] font-bold text-[#1C1008] border-b border-[#F0EDE8] pb-2 font-serif flex items-center gap-1.5" style={{ fontFamily: 'Cormorant Garamond, serif' }}>
          <Globe size={16} className="text-[#C8851A]" />
          Website Branding
        </h2>

        {/* Website Name */}
        <div>
          <label className="block text-[11px] font-semibold tracking-wider uppercase text-[#6B5E4C] mb-1.5">Website Name</label>
          <input
            type="text"
            className="w-full h-12 px-4 rounded-xl border border-[#E8E2D9] text-[13px] bg-[#FAFAF8] outline-none focus:bg-white focus:border-[#C8851A]"
            value={websiteName}
            onChange={(e) => setWebsiteName(e.target.value)}
          />
        </div>

        {/* Logo URL */}
        <div>
          <label className="block text-[11px] font-semibold tracking-wider uppercase text-[#6B5E4C] mb-1.5">Logo Image Path / URL</label>
          <input
            type="text"
            className="w-full h-12 px-4 rounded-xl border border-[#E8E2D9] text-[13px] bg-[#FAFAF8] outline-none focus:bg-white focus:border-[#C8851A]"
            value={logoUrl}
            onChange={(e) => setLogoUrl(e.target.value)}
          />
        </div>

        {/* WhatsApp Number */}
        <div>
          <label className="block text-[11px] font-semibold tracking-wider uppercase text-[#6B5E4C] mb-1.5">WhatsApp Number</label>
          <input
            type="text"
            className="w-full h-12 px-4 rounded-xl border border-[#E8E2D9] text-[13px] bg-[#FAFAF8] outline-none focus:bg-white focus:border-[#C8851A]"
            value={whatsapp}
            onChange={(e) => setWhatsapp(e.target.value)}
          />
        </div>

        {/* Email */}
        <div>
          <label className="block text-[11px] font-semibold tracking-wider uppercase text-[#6B5E4C] mb-1.5">Email Address</label>
          <input
            type="email"
            className="w-full h-12 px-4 rounded-xl border border-[#E8E2D9] text-[13px] bg-[#FAFAF8] outline-none focus:bg-white focus:border-[#C8851A]"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        {/* Save brand settings button */}
        <button
          type="submit"
          disabled={savingBrand}
          className="w-full h-[52px] rounded-xl bg-[#C8851A] active:bg-[#B07414] text-white text-[12px] font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 cursor-pointer shadow-md mt-2"
        >
          {savingBrand ? <Loader2 size={16} className="animate-spin" /> : <Save size={14} />}
          Save Brand Info
        </button>
      </form>

      {/* 2. Security Change Password Card */}
      <form onSubmit={handleChangePassword} className="bg-white border border-[#E6C280]/20 rounded-2xl p-5 space-y-4 shadow-sm">
        <h2 className="text-[16px] font-bold text-[#1C1008] border-b border-[#F0EDE8] pb-2 font-serif flex items-center gap-1.5" style={{ fontFamily: 'Cormorant Garamond, serif' }}>
          <Lock size={16} className="text-[#C8851A]" />
          Change Password
        </h2>

        {/* Current Password */}
        <div>
          <label className="block text-[11px] font-semibold tracking-wider uppercase text-[#6B5E4C] mb-1.5">Current Password</label>
          <input
            type="password"
            className="w-full h-12 px-4 rounded-xl border border-[#E8E2D9] text-[13px] bg-[#FAFAF8] outline-none focus:bg-white focus:border-[#C8851A]"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            placeholder="••••••••"
          />
        </div>

        {/* New Password */}
        <div>
          <label className="block text-[11px] font-semibold tracking-wider uppercase text-[#6B5E4C] mb-1.5">New Password</label>
          <input
            type="password"
            className="w-full h-12 px-4 rounded-xl border border-[#E8E2D9] text-[13px] bg-[#FAFAF8] outline-none focus:bg-white focus:border-[#C8851A]"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            placeholder="••••••••"
          />
        </div>

        {/* Confirm New Password */}
        <div>
          <label className="block text-[11px] font-semibold tracking-wider uppercase text-[#6B5E4C] mb-1.5">Confirm New Password</label>
          <input
            type="password"
            className="w-full h-12 px-4 rounded-xl border border-[#E8E2D9] text-[13px] bg-[#FAFAF8] outline-none focus:bg-white focus:border-[#C8851A]"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="••••••••"
          />
        </div>

        {/* Change password button */}
        <button
          type="submit"
          disabled={changingPass}
          className="w-full h-[52px] rounded-xl bg-[#C8851A] active:bg-[#B07414] text-white text-[12px] font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 cursor-pointer shadow-md mt-2"
        >
          {changingPass ? <Loader2 size={16} className="animate-spin" /> : <ShieldCheck size={14} />}
          Update Password
        </button>
      </form>

      {/* 3. Logout Card */}
      <div className="pt-2">
        <button
          onClick={handleLogout}
          className="w-full h-[52px] rounded-xl bg-red-50 border border-red-200 text-red-600 hover:bg-red-100/50 text-[13px] font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 cursor-pointer"
        >
          <LogOut size={14} />
          Log Out of Studio
        </button>
      </div>

    </div>
  );
}
