'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAdminStore } from '@/lib/adminStore';
import { login, seedAdmin } from '@/lib/adminApi';
import { Eye, EyeOff, Loader2, Mail, Lock, Sparkles } from 'lucide-react';

export default function AdminLoginPage() {
  const [email, setEmail] = useState('admin@sana.in');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [seeding, setSeeding] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const { setAuth, token, addToast } = useAdminStore();
  const router = useRouter();

  useEffect(() => {
    if (token) router.replace('/admin');
  }, [token, router]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const data = await login(email, password);
      setAuth(data.token, data.admin);
      router.replace('/admin');
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message;
      setError(msg || 'Authentication failed. Please verify your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleSeedAdmin = async () => {
    setSeeding(true);
    try {
      const res = await seedAdmin();
      if (res.credentials) {
        setEmail(res.credentials.email);
        setPassword(res.credentials.password);
        addToast({ type: 'success', message: 'Credentials generated and pre-filled!' });
      }
    } catch {
      addToast({ type: 'error', message: 'Failed to update credentials.' });
    } finally {
      setSeeding(false);
    }
  };

  return (
    <div className="min-h-screen flex font-sans" style={{ background: '#FAFAF8' }}>
      
      {/* ── LEFT PANEL (40%): Luxury Editorial ── */}
      <div className="hidden lg:flex lg:w-[40%] relative flex-col justify-between p-12 overflow-hidden border-r border-[#E8E2D9]">
        {/* Editorial Cinematic Image Background */}
        <div 
          className="absolute inset-0 bg-cover bg-center transition-transform duration-[1500ms] hover:scale-105"
          style={{ 
            backgroundImage: `url('https://images.unsplash.com/photo-1595777457583-95e059d581b8?q=80&w=1200&auto=format&fit=crop')` 
          }}
        />
        {/* Dark Luxury Vignette Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/85 via-black/60 to-black/90 mix-blend-multiply" />
        
        {/* Top Branding Section */}
        <div className="relative z-10">
          <span className="text-[26px] font-medium tracking-[0.25em] text-[#FFF8F0] block" style={{ fontFamily: 'Cormorant Garamond, serif' }}>
            SANA
          </span>
          <div className="flex items-center gap-2 mt-1">
            <span className="h-[1px] w-6 bg-[#C8851A]" />
            <span className="text-[9px] tracking-[0.35em] uppercase text-[#9B8E7E] font-semibold">
              Admin Studio
            </span>
          </div>
        </div>

        {/* Center Editorial Text */}
        <div className="relative z-10 mb-20 space-y-4">
          <h2 className="text-[36px] font-light leading-tight text-[#FFF8F0] tracking-wide" style={{ fontFamily: 'Cormorant Garamond, serif' }}>
            Generational <br />
            <span className="italic text-[#D4AF37]">Craftsmanship</span>
          </h2>
          <p className="text-[13px] text-[#9B8E7E] leading-relaxed max-w-[320px]">
            Manage products, appointments, and homepage aesthetics in a bespoke digital atelier built for SANA Fashion.
          </p>
        </div>

        {/* Faint luxury pattern overlay */}
        <div className="absolute inset-0 opacity-[0.02] pointer-events-none"
          style={{ backgroundImage: 'radial-gradient(#C8851A 1.5px, transparent 1.5px)', backgroundSize: '24px 24px' }}
        />
      </div>

      {/* ── RIGHT PANEL (60%): Centered Login Card ── */}
      <div 
        className="flex-1 flex flex-col items-center justify-center p-6 sm:p-12 relative"
        style={{ 
          background: 'radial-gradient(circle at 60% 40%, #FFFDFB 0%, #FAF6EE 100%)' 
        }}
      >
        {/* Subtle fabric/linen SVG pattern overlay for texture */}
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none" 
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='4' height='4' viewBox='0 0 4 4'%3E%3Cpath d='M1 3h1v1H1V3zm2-2h1v1H3V1z' fill='%23C8851A' fill-opacity='0.4' fill-rule='evenodd'/%3E%3C/svg%3E")`
          }}
        />

        {/* Container for Login & Onboarding */}
        <div className="w-full max-w-[480px] space-y-8 z-10 animate-slide-up">
          
          {/* SANA Main Login Card */}
          <div className="bg-white rounded-[20px] p-8 sm:p-10 border border-[#E8E2D9] shadow-card hover:shadow-card-hover transition-shadow duration-300">
            
            {/* Header */}
            <div className="text-center mb-8">
              <h1 className="text-[32px] font-normal text-[#1C1008]" style={{ fontFamily: 'Cormorant Garamond, serif' }}>
                Welcome back
              </h1>
              <p className="text-[13px] text-[#6B5E4C] mt-2 font-medium tracking-wide">
                Sign in to manage your digital studio.
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleLogin} className="space-y-5">
              
              {/* Email Address */}
              <div>
                <label htmlFor="email" className="block text-[11px] font-semibold tracking-[0.2em] uppercase text-[#6B5E4C] mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    className="w-full h-[56px] pl-12 pr-4 rounded-[14px] border border-[#E8E2D9] bg-white text-[14px] text-[#1C1008] placeholder-[#9B8E7E] outline-none transition-all duration-300 focus:border-[#C8851A] focus:ring-1 focus:ring-[#C8851A] font-sans"
                    placeholder="e.g. admin@sana.in"
                    required
                    autoComplete="email"
                  />
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[#9B8E7E] transition-colors duration-300">
                    <Mail size={16} strokeWidth={1.5} />
                  </div>
                </div>
              </div>

              {/* Password */}
              <div>
                <label htmlFor="password" className="block text-[11px] font-semibold tracking-[0.2em] uppercase text-[#6B5E4C] mb-2">
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPass ? 'text' : 'password'}
                    id="password"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    className="w-full h-[56px] pl-12 pr-12 rounded-[14px] border border-[#E8E2D9] bg-white text-[14px] text-[#1C1008] placeholder-[#9B8E7E] outline-none transition-all duration-300 focus:border-[#C8851A] focus:ring-1 focus:ring-[#C8851A] font-sans"
                    placeholder="••••••••"
                    required
                    autoComplete="current-password"
                  />
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[#9B8E7E] transition-colors duration-300">
                    <Lock size={16} strokeWidth={1.5} />
                  </div>
                  <button
                    type="button"
                    onClick={() => setShowPass(!showPass)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-[#9B8E7E] hover:text-[#C8851A] transition-colors duration-200 cursor-pointer"
                  >
                    {showPass ? <EyeOff size={16} strokeWidth={1.5} /> : <Eye size={16} strokeWidth={1.5} />}
                  </button>
                </div>
              </div>

              {/* Remember Me / Forgot Pass */}
              <div className="flex items-center justify-between text-[13px] font-medium pt-1">
                <label className="flex items-center gap-2 cursor-pointer text-[#6B5E4C] hover:text-[#1C1008] transition-colors">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={e => setRememberMe(e.target.checked)}
                    className="rounded border-[#E8E2D9] text-[#C8851A] focus:ring-[#C8851A]"
                  />
                  Remember me
                </label>
                <a href="#" onClick={(e) => { e.preventDefault(); addToast({ type: 'info', message: 'Please contact super admin to recover password.' }); }} className="text-[#C8851A] hover:underline">
                  Forgot Password?
                </a>
              </div>

              {/* Error message */}
              {error && (
                <div className="p-4 rounded-[12px] bg-red-50 border border-red-100 text-[13px] text-red-600 leading-snug">
                  {error}
                </div>
              )}

              {/* Login Button */}
              <button
                type="submit"
                disabled={loading}
                className="relative w-full h-[56px] rounded-[14px] bg-gradient-to-r from-[#D4AF37] via-[#C8851A] to-[#B87333] text-white font-semibold text-[13px] uppercase tracking-[0.2em] shadow-md transition-all duration-300 hover:shadow-lg hover:-translate-y-[2px] active:translate-y-0 disabled:opacity-75 disabled:cursor-not-allowed overflow-hidden group cursor-pointer"
              >
                {/* Shine effect animation */}
                <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:animate-shine" />
                <span className="relative flex items-center justify-center gap-2">
                  {loading ? (
                    <><Loader2 size={16} className="animate-spin" /> Authenticating...</>
                  ) : (
                    'Sign In to Studio'
                  )}
                </span>
              </button>
            </form>
          </div>

          {/* ── FIRST TIME SETUP: Onboarding Card ── */}
          <div className="bg-white rounded-[16px] p-5 border border-[#E8E2D9] shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex gap-3">
              <div className="mt-0.5 p-2 rounded-lg bg-[rgba(200,133,26,0.06)] text-[#C8851A] h-fit">
                <Sparkles size={16} />
              </div>
              <div className="text-left">
                <h3 className="text-[13px] font-semibold text-[#1C1008]">First Time Setup</h3>
                <p className="text-[11px] text-[#9B8E7E] mt-0.5">
                  Generate or sync credentials from the active project configuration.
                </p>
              </div>
            </div>
            <button
              onClick={handleSeedAdmin}
              disabled={seeding}
              className="w-full sm:w-auto px-4 py-2.5 text-[12px] font-semibold rounded-lg border border-[#C8851A] text-[#C8851A] hover:bg-[rgba(200,133,26,0.05)] transition-colors cursor-pointer whitespace-nowrap"
            >
              {seeding ? <Loader2 size={12} className="animate-spin" /> : 'Create Account'}
            </button>
          </div>

          {/* Helper Credentials Hint */}
          <p className="text-center text-[11px] text-[#9B8E7E] font-medium tracking-wide">
            Active Studio configuration: <span className="text-[#6B5E4C]">admin@sana.in</span> / <span className="text-[#6B5E4C]">Sana@2025</span>
          </p>
        </div>
      </div>
    </div>
  );
}
