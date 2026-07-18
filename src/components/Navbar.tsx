"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { X, Search, ArrowRight, ShoppingBag, Volume2, VolumeX, ChevronDown } from "lucide-react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { cartState } from "@/data/cart";
import CartDrawer from "@/components/CartDrawer";

// ─── SVG Icons ────────────────────────────────────────────────────────────────

const InstagramIcon = () => (
  <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
    <circle cx="12" cy="12" r="4" />
    <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
  </svg>
);

const WhatsAppIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
  </svg>
);

// ─── Data ─────────────────────────────────────────────────────────────────────

const navLinks = [
  { label: "Home", href: "/" },
  { label: "Collections", href: "/collections" },
  { label: "Products", href: "/products" },
  { label: "Our Story", href: "/about" },
  { label: "Contact", href: "/contact" },
];

const popularSearches = ["Lehenga", "Anarkali", "Sharara", "Saree", "Suits", "Couture", "Bridal"];

const trendingCollections = [
  { name: "Bridal Couture '25", href: "/collections/bridal" },
  { name: "The Festive Edit", href: "/collections/festive" },
  { name: "Atelier Power Suits", href: "/collections/designer-suits" },
];

const recentlyViewedProducts = [
  { id: 1, name: "Royal Crimson Bridal Lehenga", category: "Wedding Collection", image: "/images/models/hero_bridal.png", price: 85000 },
  { id: 2, name: "Emerald Festive Anarkali", category: "Festive Collection", image: "/images/products/festive-anarkali-1.jpg", price: 38000 },
  { id: 3, name: "Ivory Pearl Wedding Sharara", category: "Wedding Collection", image: "/images/products/wedding-sharara-1.jpg", price: 62000 },
];

const searchSuggestionPool = [
  "Royal Crimson Bridal Lehenga", "Emerald Festive Anarkali", "Ivory Pearl Wedding Sharara",
  "Midnight Blue Power Suit", "Pink Banarasi Silk Lehenga", "Amber Gold Zardozi Anarkali",
  "Rose Gold Silk Sherwani", "Pastel Organza Lehenga Suit",
];

// ─── Boutique Experience Modes ────────────────────────────────────────────────

type ExperienceMode = "silent" | "ambience" | "piano" | "celebration";

const EXPERIENCE_MODES: {
  id: ExperienceMode;
  name: string;
  tagline: string;
  description: string[];
  src?: string;
  volume: number;
}[] = [
  {
    id: "silent",
    name: "Silent Mode",
    tagline: "No audio. Recommended for focused shopping.",
    description: [],
    volume: 0,
  },
  {
    id: "ambience",
    name: "Boutique Ambience",
    tagline: "Subtle boutique sounds. No music.",
    description: ["Soft footsteps", "Fabric movement", "Tailor scissors", "Gentle showroom ambience"],
    src: "https://assets.mixkit.co/music/preview/mixkit-fashion-lounge-164.mp3",
    volume: 0.12,
  },
  {
    id: "piano",
    name: "Classical Piano",
    tagline: "Soft instrumental piano.",
    description: ["Perfect for bridal browsing."],
    src: "https://assets.mixkit.co/music/preview/mixkit-dreaming-big-31.mp3",
    volume: 0.38,
  },
  {
    id: "celebration",
    name: "Celebration Mood",
    tagline: "Luxury Indian instrumental music.",
    description: ["Designed for wedding collections."],
    src: "https://assets.mixkit.co/music/preview/mixkit-serene-view-443.mp3",
    volume: 0.42,
  },
];

// ─── Mobile Menu Quick Links ───────────────────────────────────────────────────

const quickLinks = [
  { label: "New Arrivals", href: "/collections" },
  { label: "Bridal Collection", href: "/collections/bridal" },
  { label: "Festive Edit", href: "/collections/festive" },
  { label: "Designer Suits", href: "/collections/designer-suits" },
];

// ─── Component ────────────────────────────────────────────────────────────────

export default function Navbar() {
  const pathname = usePathname();
  const isLightPage = pathname !== "/";
  const shouldReduceMotion = useReducedMotion();

  // State
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(-1);

  // Boutique Experience state
  const [activeMode, setActiveMode] = useState<ExperienceMode>("silent");
  const [isMuted, setIsMuted] = useState(false);
  const [ambientOpen, setAmbientOpen] = useState(false);
  const [isFading, setIsFading] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);

  // Newsletter
  const [newsletterEmail, setNewsletterEmail] = useState("");
  const [newsletterDone, setNewsletterDone] = useState(false);

  // Refs
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const ambientPanelRef = useRef<HTMLDivElement>(null);
  const volumeFadeRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // ─── Scroll ───────────────────────────────────────────────────────
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // ─── Cart ─────────────────────────────────────────────────────────
  useEffect(() => {
    cartState.load();
    setCartCount(cartState.getCount());
    const unsubscribe = cartState.subscribe(() => setCartCount(cartState.getCount()));
    const handleSync = () => setCartCount(cartState.getCount());
    window.addEventListener("sana_cart_change", handleSync);
    return () => { unsubscribe(); window.removeEventListener("sana_cart_change", handleSync); };
  }, []);

  // ─── Body scroll lock ─────────────────────────────────────────────
  useEffect(() => {
    document.body.style.overflow = (mobileOpen || searchOpen) ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [mobileOpen, searchOpen]);

  // ─── Focus search input ───────────────────────────────────────────
  useEffect(() => {
    if (searchOpen) setTimeout(() => searchInputRef.current?.focus(), 120);
  }, [searchOpen]);

  // ─── Restore Boutique Experience mode from localStorage ──────────
  useEffect(() => {
    try {
      const saved = localStorage.getItem("sana_boutique_experience");
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.mode && EXPERIENCE_MODES.find(m => m.id === parsed.mode)) {
          setActiveMode(parsed.mode as ExperienceMode);
          // Never autoplay on restore — user must re-select
        }
        if (typeof parsed.muted === "boolean") setIsMuted(parsed.muted);
      }
    } catch {}
  }, []);

  // ─── Save Boutique Experience prefs ──────────────────────────────
  useEffect(() => {
    try { localStorage.setItem("sana_boutique_experience", JSON.stringify({ mode: activeMode, muted: isMuted })); } catch {}
  }, [activeMode, isMuted]);

  // ─── Auto-pause on video play ─────────────────────────────────────
  useEffect(() => {
    const handleVideoPlay = () => { if (isPlaying) fadeOutAudio(); };
    document.addEventListener("sana_video_play", handleVideoPlay);
    return () => document.removeEventListener("sana_video_play", handleVideoPlay);
  }, [isPlaying]);

  // ─── Close ambient panel on outside click ────────────────────────
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ambientPanelRef.current && !ambientPanelRef.current.contains(e.target as Node)) {
        setAmbientOpen(false);
      }
    };
    if (ambientOpen) document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [ambientOpen]);

  // ─── Global keyboard shortcuts ────────────────────────────────────
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        if (searchOpen) closeSearch();
        if (mobileOpen) setMobileOpen(false);
        if (ambientOpen) setAmbientOpen(false);
      }
      if ((e.metaKey || e.ctrlKey) && e.key === "k") { e.preventDefault(); setSearchOpen(true); }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [searchOpen, mobileOpen, ambientOpen]);

  // ─── Fade helpers ─────────────────────────────────────────────────
  const fadeInAudio = useCallback((targetVol: number) => {
    if (!audioRef.current) return;
    if (volumeFadeRef.current) clearInterval(volumeFadeRef.current);
    audioRef.current.volume = 0;
    audioRef.current.play().catch(console.warn);
    setIsFading(true);
    volumeFadeRef.current = setInterval(() => {
      if (!audioRef.current) return;
      const next = Math.min(audioRef.current.volume + 0.02, targetVol);
      audioRef.current.volume = next;
      if (next >= targetVol) { clearInterval(volumeFadeRef.current!); setIsFading(false); }
    }, 50);
  }, []);

  const fadeOutAudio = useCallback(() => {
    if (!audioRef.current) return;
    if (volumeFadeRef.current) clearInterval(volumeFadeRef.current);
    setIsFading(true);
    volumeFadeRef.current = setInterval(() => {
      if (!audioRef.current) return;
      const next = Math.max(audioRef.current.volume - 0.02, 0);
      audioRef.current.volume = next;
      if (next <= 0) {
        clearInterval(volumeFadeRef.current!);
        audioRef.current.pause();
        setIsPlaying(false);
        setIsFading(false);
      }
    }, 50);
  }, []);

  // ─── Mode selection handler ────────────────────────────────────────
  const selectMode = useCallback((modeId: ExperienceMode) => {
    const mode = EXPERIENCE_MODES.find(m => m.id === modeId)!;
    setActiveMode(modeId);
    if (modeId === "silent") {
      // Stop any playing audio
      if (audioRef.current && isPlaying) fadeOutAudio();
    } else {
      if (!mode.src) return;
      if (audioRef.current) {
        // If switching modes while playing, fade out first then switch
        if (isPlaying) {
          if (volumeFadeRef.current) clearInterval(volumeFadeRef.current);
          audioRef.current.pause();
          setIsPlaying(false);
        }
        audioRef.current.src = mode.src;
        audioRef.current.load();
        audioRef.current.loop = true;
        setIsPlaying(true);
        setIsMuted(false);
        setTimeout(() => fadeInAudio(mode.volume), 150);
      }
    }
  }, [isPlaying, fadeOutAudio, fadeInAudio]);

  // ─── Mute toggle ──────────────────────────────────────────────────
  const toggleMute = useCallback(() => {
    if (!audioRef.current) return;
    const nextMuted = !isMuted;
    setIsMuted(nextMuted);
    const mode = EXPERIENCE_MODES.find(m => m.id === activeMode);
    if (nextMuted) {
      audioRef.current.volume = 0;
    } else if (mode?.volume) {
      audioRef.current.volume = mode.volume;
    }
  }, [isMuted, activeMode]);

  // ─── Search ───────────────────────────────────────────────────────
  const closeSearch = () => { setSearchOpen(false); setSearchQuery(""); setSuggestions([]); setSelectedIndex(-1); };
  const handleSearchChange = (val: string) => {
    setSearchQuery(val);
    if (!val.trim()) { setSuggestions([]); setSelectedIndex(-1); return; }
    setSuggestions(searchSuggestionPool.filter(i => i.toLowerCase().includes(val.toLowerCase())));
    setSelectedIndex(-1);
  };
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") { e.preventDefault(); closeSearch(); }
    else if (e.key === "ArrowDown") { e.preventDefault(); if (suggestions.length > 0) setSelectedIndex(p => (p + 1) % suggestions.length); }
    else if (e.key === "ArrowUp") { e.preventDefault(); if (suggestions.length > 0) setSelectedIndex(p => (p - 1 + suggestions.length) % suggestions.length); }
    else if (e.key === "Enter") {
      e.preventDefault();
      const target = selectedIndex >= 0 ? suggestions[selectedIndex] : searchQuery.trim();
      if (target) { window.location.href = `/products?search=${encodeURIComponent(target)}`; closeSearch(); }
    }
  };

  // ─── Newsletter ───────────────────────────────────────────────────
  const handleNewsletter = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsletterEmail.trim()) return;
    setNewsletterDone(true);
    setNewsletterEmail("");
  };

  // ─── Theme helpers ────────────────────────────────────────────────
  const isLight = scrolled || isLightPage;
  const navColor = isLight ? "var(--text-primary)" : "#fff";
  const navMuted = isLight ? "var(--text-muted)" : "rgba(255,220,140,0.85)";

  return (
    <>
      {/* Hidden Audio — controlled programmatically, no autoplay */}
      <audio ref={audioRef} preload="none" loop />

      {/* ═══════════════════════════════════════════════
          DESKTOP + TABLET NAVBAR
      ═══════════════════════════════════════════════ */}
      <nav
        role="navigation"
        aria-label="Main navigation"
        className="fixed top-0 left-0 right-0 z-[100] transition-all duration-[300ms] ease-[cubic-bezier(0.22,1,0.36,1)]"
        style={{
          height: scrolled ? "80px" : "92px",
          background: isLight
            ? "rgba(255,251,244,0.96)"
            : "linear-gradient(to bottom, rgba(10,5,2,0.65) 0%, rgba(10,5,2,0.0) 100%)",
          backdropFilter: isLight ? "blur(24px) saturate(1.6)" : "none",
          WebkitBackdropFilter: isLight ? "blur(24px) saturate(1.6)" : "none",
          borderBottom: isLight ? "1px solid rgba(200,133,26,0.15)" : "1px solid transparent",
          boxShadow: isLight ? "0 1px 32px rgba(28,14,5,0.06)" : "none",
        }}
      >
        <div className="editorial-container h-full grid items-center" style={{ gridTemplateColumns: "1fr auto 1fr" }}>
          {/* Column 1: Logo */}
          <Link href="/" className="flex items-center justify-start" aria-label="Sana Fashion House — Home">
            <div
              className="relative transition-all duration-[300ms]"
              style={{ height: scrolled ? "48px" : "56px", width: scrolled ? "140px" : "164px" }}
            >
              <Image
                src="/Logo/image.png?v=3"
                alt="SANA Fashion House"
                fill
                className="object-contain object-left"
                priority
                unoptimized
              />
            </div>
          </Link>

          {/* Column 2: Desktop Nav Links — perfectly centered */}
          <nav
            aria-label="Site links"
            className="hidden lg:flex items-center justify-center gap-9"
          >
            {navLinks.map((l) => {
              const active = pathname === l.href;
              return (
                <Link
                  key={l.label}
                  href={l.href}
                  className="nav-link-luxury group relative font-accent uppercase tracking-[0.13em] transition-colors duration-[250ms] whitespace-nowrap"
                  style={{
                    fontSize: "13.5px",
                    fontWeight: 500,
                    color: active
                      ? isLight ? "var(--gold)" : "#E8A830"
                      : navColor,
                    textShadow: isLight ? "none" : "0 1px 4px rgba(0,0,0,0.4)",
                  }}
                  aria-current={active ? "page" : undefined}
                >
                  {l.label}
                  {/* Animated underline */}
                  <span
                    className="absolute -bottom-[3px] left-0 h-[1px] bg-[var(--gold)] transition-all duration-[350ms] ease-[cubic-bezier(0.22,1,0.36,1)]"
                    style={{ width: active ? "100%" : "0%" }}
                    aria-hidden="true"
                  />
                  {/* Hover underline */}
                  <span
                    className="absolute -bottom-[3px] left-0 h-[1px] bg-[var(--gold)] opacity-0 group-hover:opacity-100 group-hover:w-full w-0 transition-all duration-[350ms] ease-[cubic-bezier(0.22,1,0.36,1)]"
                    aria-hidden="true"
                  />
                </Link>
              );
            })}
          </nav>

          {/* Column 3: Right Actions */}
          <div className="flex items-center justify-end gap-[20px]">

            {/* Search — always visible */}
            <button
              id="navbar-search-btn"
              onClick={() => setSearchOpen(true)}
              className="nav-icon-btn group flex"
              style={{ color: navColor }}
              aria-label="Open search overlay (Ctrl+K)"
              title="Search (Ctrl K)"
            >
              <Search size={19} strokeWidth={1.6} className="transition-transform duration-300 group-hover:scale-110" />
            </button>

            {/* Cart / Bag — desktop only per spec */}
            <button
              id="navbar-cart-btn"
              onClick={() => setCartOpen(true)}
              className="nav-icon-btn group relative hidden lg:flex"
              style={{ color: navColor }}
              aria-label={`Open bag — ${cartCount} item${cartCount !== 1 ? "s" : ""}`}
            >
              <ShoppingBag size={19} strokeWidth={1.6} className="transition-transform duration-300 group-hover:scale-110" />
              <AnimatePresence>
                {cartCount > 0 && (
                  <motion.span
                    key="cart-count"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0 }}
                    className="absolute -top-1 -right-1 bg-[#8B1A3A] text-white font-accent text-[8px] w-[17px] h-[17px] rounded-full flex items-center justify-center font-bold leading-none"
                  >
                    {cartCount > 9 ? "9+" : cartCount}
                  </motion.span>
                )}
              </AnimatePresence>
            </button>

            {/* Instagram — desktop only */}
            <a
              id="navbar-instagram-link"
              href="https://www.instagram.com/sana___fashion___01/"
              target="_blank"
              rel="noopener noreferrer"
              className="nav-icon-btn group hidden lg:flex"
              style={{ color: navColor }}
              aria-label="Follow on Instagram"
            >
              <InstagramIcon />
            </a>

            {/* ── Boutique Experience ── */}
            <div className="relative block" ref={ambientPanelRef}>
              <button
                id="navbar-boutique-experience-btn"
                onClick={() => setAmbientOpen(o => !o)}
                className="nav-icon-btn group flex items-center gap-[7px]"
                style={{ color: navColor }}
                aria-label="Boutique Experience — audio atmosphere"
                aria-expanded={ambientOpen}
              >
                {/* Equalizer bars */}
                <div className="flex items-end h-[14px] gap-[2px]" aria-hidden="true">
                  {isPlaying && !isMuted ? (
                    <>
                      <span className="equalizer-bar eq-1 bg-[var(--gold)]" />
                      <span className="equalizer-bar eq-2 bg-[var(--gold)]" />
                      <span className="equalizer-bar eq-3 bg-[var(--gold)]" />
                      <span className="equalizer-bar eq-4 bg-[var(--gold)]" />
                    </>
                  ) : (
                    <>
                      <span className="w-[2.5px] h-[3px] rounded-sm" style={{ background: navMuted }} />
                      <span className="w-[2.5px] h-[7px] rounded-sm" style={{ background: navMuted }} />
                      <span className="w-[2.5px] h-[5px] rounded-sm" style={{ background: navMuted }} />
                      <span className="w-[2.5px] h-[4px] rounded-sm" style={{ background: navMuted }} />
                    </>
                  )}
                </div>
                <span
                  className="font-accent text-[10px] tracking-[0.16em] uppercase hidden lg:inline-block transition-colors duration-200"
                  style={{ color: navMuted }}
                >
                  Experience
                </span>
                <ChevronDown
                  size={11}
                  strokeWidth={2}
                  className={`hidden lg:block transition-transform duration-300 ${ambientOpen ? "rotate-180" : ""}`}
                  style={{ color: navMuted }}
                />
              </button>

              {/* Boutique Experience Panel */}
              <AnimatePresence>
                {ambientOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 8, scale: 0.97 }}
                    animate={{ opacity: 1, y: 0, scale: 1, transition: { duration: 0.22, ease: [0.22, 1, 0.36, 1] } }}
                    exit={{ opacity: 0, y: 6, scale: 0.97, transition: { duration: 0.18 } }}
                    className="boutique-exp-panel absolute right-0 mt-3 z-[200]"
                    role="dialog"
                    aria-label="Boutique Experience controls"
                  >
                    {/* Panel Header */}
                    <div className="boutique-exp-header">
                      <div className="flex items-start justify-between">
                        <div>
                          <span className="font-accent text-[8.5px] tracking-[0.28em] uppercase text-[var(--gold)] block mb-1">Boutique Experience</span>
                          <p className="font-serif text-[12px] text-[var(--text-secondary)] italic leading-snug">
                            Choose how you want to experience the atelier.
                          </p>
                        </div>
                        <div className="flex items-center gap-2 ml-3 flex-shrink-0">
                          {/* Mute toggle — only show when playing */}
                          {isPlaying && (
                            <button
                              onClick={toggleMute}
                              className="boutique-exp-mute-btn"
                              aria-label={isMuted ? "Unmute" : "Mute"}
                              title={isMuted ? "Unmute" : "Mute"}
                            >
                              {isMuted
                                ? <VolumeX size={13} strokeWidth={1.5} />
                                : <Volume2 size={13} strokeWidth={1.5} />
                              }
                            </button>
                          )}
                          <button
                            onClick={() => setAmbientOpen(false)}
                            className="boutique-exp-close-btn"
                            aria-label="Close boutique experience panel"
                          >
                            <X size={13} />
                          </button>
                        </div>
                      </div>
                      {/* Currently active mode indicator */}
                      {isPlaying && (
                        <div className="boutique-exp-now-playing">
                          <span className="flex items-center gap-1.5">
                            <span className="flex items-end gap-[1.5px] h-3">
                              <span className="equalizer-bar-sm eq-1 bg-[var(--gold)]" />
                              <span className="equalizer-bar-sm eq-2 bg-[var(--gold)]" />
                              <span className="equalizer-bar-sm eq-3 bg-[var(--gold)]" />
                            </span>
                            <span className="font-accent text-[8px] tracking-[0.15em] uppercase text-[var(--gold)]">
                              {EXPERIENCE_MODES.find(m => m.id === activeMode)?.name}
                            </span>
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Mode Cards */}
                    <div className="boutique-exp-modes">
                      {EXPERIENCE_MODES.map((mode) => {
                        const isActive = activeMode === mode.id;
                        const isCurrentlyPlaying = isActive && isPlaying;
                        return (
                          <button
                            key={mode.id}
                            id={`boutique-mode-${mode.id}`}
                            onClick={() => selectMode(mode.id)}
                            disabled={isFading}
                            className={`boutique-exp-mode-card ${
                              isActive ? "active" : ""
                            } ${isCurrentlyPlaying ? "playing" : ""}`}
                            aria-pressed={isActive}
                          >
                            {/* Radio dot */}
                            <span className="boutique-exp-radio" aria-hidden="true">
                              {isActive && <span className="boutique-exp-radio-fill" />}
                            </span>

                            <div className="flex-1 text-left">
                              <div className="flex items-center justify-between">
                                <span className="boutique-exp-mode-name">{mode.name}</span>
                                {mode.id === "silent" && (
                                  <span className="boutique-exp-default-badge">Default</span>
                                )}
                                {isCurrentlyPlaying && !isMuted && (
                                  <span className="flex items-end gap-[1.5px] h-3 ml-2">
                                    <span className="equalizer-bar-sm eq-1 bg-[var(--gold)]" />
                                    <span className="equalizer-bar-sm eq-2 bg-[var(--gold)]" />
                                    <span className="equalizer-bar-sm eq-3 bg-[var(--gold)]" />
                                  </span>
                                )}
                              </div>
                              <p className="boutique-exp-mode-tagline">{mode.tagline}</p>
                              {mode.description.length > 0 && (
                                <ul className="boutique-exp-mode-details">
                                  {mode.description.map((d) => (
                                    <li key={d}>{d}</li>
                                  ))}
                                </ul>
                              )}
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Book Appointment — Desktop */}
            <Link href="/contact" id="navbar-book-btn" className="hidden lg:block">
              <button className="book-appointment-btn group" aria-label="Book a consultation appointment">
                <span className="book-btn-shine" aria-hidden="true" />
                <span className="relative z-10 font-accent text-[12px] tracking-[0.18em] uppercase font-medium">
                  Book Appointment
                </span>
              </button>
            </Link>

            {/* Hamburger — Mobile only */}
            <button
              id="navbar-hamburger"
              onClick={() => setMobileOpen(true)}
              className="flex flex-col items-end justify-center gap-[5px] p-2 cursor-pointer lg:hidden group"
              aria-label="Open navigation menu"
              aria-expanded={mobileOpen}
            >
              <span
                className="block h-[1.5px] w-6 rounded-full transition-all duration-300 group-hover:w-4"
                style={{ backgroundColor: isLight ? "var(--text-primary)" : "var(--gold-light)" }}
              />
              <span
                className="block h-[1.5px] w-4 rounded-full transition-all duration-300 group-hover:w-6"
                style={{ backgroundColor: isLight ? "var(--text-primary)" : "var(--gold-light)" }}
              />
              <span
                className="block h-[1.5px] w-5 rounded-full transition-all duration-300 group-hover:w-3"
                style={{ backgroundColor: isLight ? "var(--text-primary)" : "var(--gold-light)" }}
              />
            </button>
          </div>
        </div>
      </nav>

      {/* ═══════════════════════════════════════════════
          MOBILE FULL-SCREEN DRAWER
      ═══════════════════════════════════════════════ */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              key="mobile-backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.35 }}
              onClick={() => setMobileOpen(false)}
              className="fixed inset-0 z-[9990] bg-[rgba(10,5,2,0.6)] backdrop-blur-sm"
              aria-hidden="true"
            />

            {/* Drawer Panel */}
            <motion.div
              key="mobile-drawer"
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
              className="fixed top-0 right-0 h-full w-[88vw] max-w-[400px] z-[9999] flex flex-col overflow-hidden"
              style={{ background: "var(--cream)", borderLeft: "1px solid rgba(200,133,26,0.12)" }}
              role="dialog"
              aria-modal="true"
              aria-label="Mobile navigation menu"
            >
              {/* Drawer Header */}
              <div className="flex items-center justify-between px-6 py-5 border-b border-[rgba(200,133,26,0.12)] flex-shrink-0">
                <Link href="/" onClick={() => setMobileOpen(false)} className="flex items-center" aria-label="Home">
                  <div className="relative h-9 w-28">
                    <Image src="/Logo/image.png?v=3" alt="SANA" fill className="object-contain object-left" unoptimized />
                  </div>
                </Link>

                <div className="flex items-center gap-3">
                  {/* Mobile Search */}
                  <button
                    onClick={() => { setMobileOpen(false); setTimeout(() => setSearchOpen(true), 300); }}
                    className="nav-icon-btn text-[var(--text-primary)]"
                    aria-label="Search"
                  >
                    <Search size={18} strokeWidth={1.6} />
                  </button>

                  {/* Mobile Boutique Experience */}
                  <button
                    onClick={() => { setMobileOpen(false); setTimeout(() => setAmbientOpen(true), 300); }}
                    className="nav-icon-btn text-[var(--text-primary)]"
                    aria-label="Open Boutique Experience"
                  >
                    <div className="flex items-end h-[14px] gap-[2px]" aria-hidden="true">
                      {isPlaying && !isMuted ? (
                        <>
                          <span className="equalizer-bar eq-1 bg-[var(--gold)]" />
                          <span className="equalizer-bar eq-2 bg-[var(--gold)]" />
                          <span className="equalizer-bar eq-3 bg-[var(--gold)]" />
                          <span className="equalizer-bar eq-4 bg-[var(--gold)]" />
                        </>
                      ) : (
                        <>
                          <span className="w-[2.5px] h-[3px] rounded-sm bg-[var(--text-muted)]" />
                          <span className="w-[2.5px] h-[7px] rounded-sm bg-[var(--text-muted)]" />
                          <span className="w-[2.5px] h-[5px] rounded-sm bg-[var(--text-muted)]" />
                          <span className="w-[2.5px] h-[4px] rounded-sm bg-[var(--text-muted)]" />
                        </>
                      )}
                    </div>
                  </button>

                  {/* Close */}
                  <button
                    onClick={() => setMobileOpen(false)}
                    className="w-9 h-9 rounded-full flex items-center justify-center border border-[rgba(200,133,26,0.2)] hover:border-[var(--gold)] hover:rotate-90 transition-all duration-500 text-[var(--text-primary)] cursor-pointer"
                    aria-label="Close menu"
                  >
                    <X size={15} />
                  </button>
                </div>
              </div>

              {/* Scrollable content */}
              <div className="flex-1 overflow-y-auto">
                {/* Main Nav Links */}
                <nav className="px-6 pt-6 pb-4" aria-label="Mobile navigation">
                  <p className="font-accent text-[8px] tracking-[0.3em] uppercase text-[var(--gold)] mb-4">Navigation</p>
                  {navLinks.map((l, i) => {
                    const active = pathname === l.href;
                    return (
                      <motion.div
                        key={l.label}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.35, delay: 0.1 + i * 0.06, ease: [0.22, 1, 0.36, 1] }}
                      >
                        <Link
                          href={l.href}
                          onClick={() => setMobileOpen(false)}
                          className={`mobile-nav-link group ${active ? "active" : ""}`}
                          aria-current={active ? "page" : undefined}
                        >
                          <span className="transition-transform duration-300 group-hover:translate-x-1.5 inline-block">
                            {l.label}
                          </span>
                          <ArrowRight size={16} className="opacity-0 group-hover:opacity-100 transition-all duration-300 text-[var(--gold)] -translate-x-2 group-hover:translate-x-0" />
                        </Link>
                      </motion.div>
                    );
                  })}
                </nav>

                {/* Quick Links */}
                <div className="px-6 py-4 border-t border-[rgba(200,133,26,0.08)]">
                  <p className="font-accent text-[8px] tracking-[0.3em] uppercase text-[var(--gold)] mb-3">Collections</p>
                  <div className="grid grid-cols-2 gap-2">
                    {quickLinks.map((l, i) => (
                      <motion.div
                        key={l.label}
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: 0.35 + i * 0.05, ease: [0.22, 1, 0.36, 1] }}
                      >
                        <Link
                          href={l.href}
                          onClick={() => setMobileOpen(false)}
                          className="block px-3.5 py-2.5 border border-[rgba(200,133,26,0.15)] hover:border-[var(--gold)] hover:bg-[rgba(200,133,26,0.05)] transition-all duration-250 font-accent text-[10.5px] tracking-[0.1em] uppercase text-[var(--text-secondary)] hover:text-[var(--gold)] rounded-sm"
                        >
                          {l.label}
                        </Link>
                      </motion.div>
                    ))}
                  </div>
                </div>

                {/* Social */}
                <div className="px-6 py-4 border-t border-[rgba(200,133,26,0.08)]">
                  <p className="font-accent text-[8px] tracking-[0.3em] uppercase text-[var(--gold)] mb-3">Connect</p>
                  <div className="flex flex-col gap-2.5">
                    <a
                      href="https://www.instagram.com/sana___fashion___01/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 text-[var(--text-secondary)] hover:text-[var(--gold)] transition-colors duration-200 group"
                      onClick={() => setMobileOpen(false)}
                    >
                      <InstagramIcon />
                      <span className="font-accent text-[11px] tracking-[0.06em]">@sana___fashion___01</span>
                    </a>
                    <a
                      href="https://wa.me/919022591620"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 text-[var(--text-secondary)] hover:text-[var(--gold)] transition-colors duration-200 group"
                      onClick={() => setMobileOpen(false)}
                    >
                      <WhatsAppIcon />
                      <span className="font-accent text-[11px] tracking-[0.06em]">+91 90225 91620</span>
                    </a>
                  </div>
                </div>

                {/* Newsletter */}
                <div className="px-6 py-4 border-t border-[rgba(200,133,26,0.08)]">
                  <p className="font-accent text-[8px] tracking-[0.3em] uppercase text-[var(--gold)] mb-1">Atelier Letters</p>
                  <p className="font-serif italic text-[11px] text-[var(--text-muted)] mb-3">Exclusive previews & invitations</p>
                  {newsletterDone ? (
                    <p className="font-accent text-[10px] tracking-[0.1em] text-[var(--gold)] py-2">✓ You're on the list</p>
                  ) : (
                    <form onSubmit={handleNewsletter} className="flex gap-2">
                      <input
                        type="email"
                        value={newsletterEmail}
                        onChange={e => setNewsletterEmail(e.target.value)}
                        placeholder="your@email.com"
                        className="flex-1 bg-transparent border border-[rgba(200,133,26,0.25)] px-3 py-2 font-body text-[11px] text-[var(--text-primary)] placeholder:text-[var(--text-muted)] outline-none focus:border-[var(--gold)] transition-colors duration-200 rounded-sm"
                        required
                        aria-label="Email address"
                      />
                      <button
                        type="submit"
                        className="px-3 py-2 bg-[var(--gold)] text-[var(--cream)] font-accent text-[9px] tracking-[0.15em] uppercase hover:bg-[var(--gold-dark)] transition-colors duration-200 rounded-sm"
                      >
                        Join
                      </button>
                    </form>
                  )}
                </div>
              </div>

              {/* Drawer Footer: Book Appointment */}
              <div className="px-6 py-5 border-t border-[rgba(200,133,26,0.15)] flex-shrink-0 bg-[var(--cream-warm)]">
                <Link href="/contact" onClick={() => setMobileOpen(false)} className="block">
                  <button className="book-appointment-btn w-full group" aria-label="Book an appointment">
                    <span className="book-btn-shine" aria-hidden="true" />
                    <span className="relative z-10 font-accent text-[12.5px] tracking-[0.18em] uppercase font-medium">
                      Book Appointment
                    </span>
                  </button>
                </Link>
                <p className="text-center font-accent text-[8px] tracking-[0.2em] uppercase text-[var(--text-muted)] mt-3">
                  © 2026 Sana Atelier · Crafted with intent
                </p>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* ═══════════════════════════════════════════════
          FULLSCREEN SEARCH OVERLAY
      ═══════════════════════════════════════════════ */}
      <AnimatePresence>
        {searchOpen && (
          <motion.div
            key="search-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-[9999] flex flex-col overflow-y-auto"
            style={{ background: "rgba(255,251,244,0.98)", backdropFilter: "blur(20px)" }}
            role="dialog"
            aria-modal="true"
            aria-label="Search"
          >
            {/* Search Header bar */}
            <motion.div
              initial={{ y: -24, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.35, delay: 0.05, ease: [0.22, 1, 0.36, 1] }}
              className="flex items-center justify-between px-6 sm:px-12 lg:px-24 pt-7 pb-6 border-b border-[rgba(200,133,26,0.12)] flex-shrink-0"
            >
              <span className="font-accent text-[9px] tracking-[0.3em] uppercase text-[var(--text-muted)]">Atelier Search</span>
              <div className="flex items-center gap-4">
                <span className="hidden sm:block font-accent text-[9px] tracking-[0.2em] uppercase text-[var(--text-muted)] bg-[rgba(200,133,26,0.08)] px-2.5 py-1 rounded-sm border border-[rgba(200,133,26,0.15)]">ESC</span>
                <button
                  onClick={closeSearch}
                  className="flex items-center gap-2 text-[var(--text-secondary)] hover:text-[var(--gold)] font-accent text-[10px] tracking-[0.2em] uppercase transition-colors duration-200 group cursor-pointer"
                  aria-label="Close search"
                >
                  <span>Close</span>
                  <X size={14} className="group-hover:rotate-90 transition-transform duration-300" />
                </button>
              </div>
            </motion.div>

            {/* Search Input */}
            <motion.div
              initial={{ y: -16, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.4, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
              className="px-6 sm:px-12 lg:px-24 pt-8 pb-6 max-w-[800px] w-full mx-auto"
            >
              <div className="relative flex items-center group">
                <Search size={22} strokeWidth={1.4} className="text-[var(--gold)] mr-4 flex-shrink-0" />
                <input
                  ref={searchInputRef}
                  type="text"
                  value={searchQuery}
                  onChange={e => handleSearchChange(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Search bridal, festive, suits…"
                  className="w-full bg-transparent font-display text-[26px] sm:text-[32px] lg:text-[38px] text-[var(--text-primary)] outline-none tracking-wide placeholder:text-[var(--text-muted)]/50 caret-[var(--gold)]"
                  aria-label="Search query"
                  aria-autocomplete="list"
                  aria-controls="search-suggestions"
                />
              </div>
              {/* Divider line */}
              <div className="h-[1px] bg-gradient-to-r from-transparent via-[rgba(200,133,26,0.35)] to-transparent mt-4" />
            </motion.div>

            {/* Search Results / Suggestions */}
            <motion.div
              initial={{ y: 12, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.4, delay: 0.18, ease: [0.22, 1, 0.36, 1] }}
              className="flex-1 px-6 sm:px-12 lg:px-24 pb-16 max-w-[800px] w-full mx-auto"
              id="search-suggestions"
            >
              {searchQuery.trim().length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-5 gap-8 pt-2">
                  {/* Text suggestions */}
                  <div className="md:col-span-3">
                    <p className="font-accent text-[8.5px] tracking-[0.28em] uppercase text-[var(--gold)] mb-4">Suggestions</p>
                    <div className="flex flex-col">
                      {suggestions.length > 0 ? suggestions.map((sug, idx) => (
                        <Link
                          key={sug}
                          href={`/products?search=${encodeURIComponent(sug)}`}
                          onClick={closeSearch}
                          className={`search-suggestion-item ${idx === selectedIndex ? "active" : ""}`}
                          role="option"
                          aria-selected={idx === selectedIndex}
                        >
                          <Search size={12} strokeWidth={1.5} className="flex-shrink-0 opacity-50" />
                          <span className="flex-1">{sug}</span>
                          <ArrowRight size={11} className="opacity-30 group-hover:opacity-80 transition-opacity" />
                        </Link>
                      )) : (
                        <p className="font-serif italic text-[var(--text-muted)] text-sm py-4">No results found for "{searchQuery}"</p>
                      )}
                    </div>
                  </div>
                  {/* Product cards */}
                  <div className="md:col-span-2">
                    <p className="font-accent text-[8.5px] tracking-[0.28em] uppercase text-[var(--gold)] mb-4">Products</p>
                    <div className="flex flex-col gap-3">
                      {recentlyViewedProducts
                        .filter(p => p.name.toLowerCase().includes(searchQuery.toLowerCase()) || p.category.toLowerCase().includes(searchQuery.toLowerCase()))
                        .slice(0, 3)
                        .map(prod => (
                          <Link key={prod.id} href="/products" onClick={closeSearch} className="search-product-card group">
                            <div className="relative w-10 h-[54px] overflow-hidden flex-shrink-0 border border-[rgba(200,133,26,0.12)]">
                              <Image src={prod.image} alt={prod.name} fill className="object-cover object-top group-hover:scale-105 transition-transform duration-500" />
                            </div>
                            <div className="flex flex-col overflow-hidden">
                              <span className="font-accent text-[7.5px] uppercase tracking-[0.15em] text-[var(--gold)] mb-0.5">{prod.category}</span>
                              <span className="font-display text-[11px] text-[var(--text-primary)] truncate">{prod.name}</span>
                              <span className="font-accent text-[9.5px] text-[var(--text-muted)] mt-0.5">₹{prod.price.toLocaleString("en-IN")}</span>
                            </div>
                            <ArrowRight size={12} className="ml-auto opacity-0 group-hover:opacity-60 transition-opacity" />
                          </Link>
                        ))}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col gap-9 pt-2">
                  {/* Popular searches */}
                  <div>
                    <p className="font-accent text-[8.5px] tracking-[0.28em] uppercase text-[var(--gold)] mb-4">Popular Searches</p>
                    <div className="flex flex-wrap gap-2.5">
                      {popularSearches.map(term => (
                        <Link
                          key={term}
                          href={`/products?search=${encodeURIComponent(term)}`}
                          onClick={closeSearch}
                          className="search-tag"
                        >
                          {term}
                        </Link>
                      ))}
                    </div>
                  </div>
                  {/* Recent */}
                  <div>
                    <p className="font-accent text-[8.5px] tracking-[0.28em] uppercase text-[var(--gold)] mb-4">Trending Collections</p>
                    <ul className="flex flex-col gap-3">
                      {trendingCollections.map(col => (
                        <li key={col.name}>
                          <Link
                            href={col.href}
                            onClick={closeSearch}
                            className="inline-flex items-center gap-3 group"
                          >
                            <span className="w-5 h-[1px] bg-[rgba(200,133,26,0.4)] group-hover:w-10 transition-all duration-300" />
                            <span className="font-display text-base text-[var(--text-secondary)] group-hover:text-[var(--gold)] transition-colors duration-200">
                              {col.name}
                            </span>
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                  {/* Instant product previews */}
                  <div>
                    <p className="font-accent text-[8.5px] tracking-[0.28em] uppercase text-[var(--gold)] mb-4">Curated Picks</p>
                    <div className="flex gap-4 overflow-x-auto pb-1" style={{ scrollbarWidth: "none" }}>
                      {recentlyViewedProducts.map(prod => (
                        <Link key={prod.id} href="/products" onClick={closeSearch} className="flex-shrink-0 group w-[120px]">
                          <div className="relative w-full h-[155px] overflow-hidden border border-[rgba(200,133,26,0.12)] mb-2">
                            <Image src={prod.image} alt={prod.name} fill className="object-cover object-top group-hover:scale-105 transition-transform duration-500" />
                          </div>
                          <p className="font-display text-[10.5px] text-[var(--text-primary)] group-hover:text-[var(--gold)] transition-colors line-clamp-2">{prod.name}</p>
                          <p className="font-accent text-[9px] text-[var(--text-muted)] mt-0.5">₹{prod.price.toLocaleString("en-IN")}</p>
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Cart Drawer */}
      <CartDrawer isOpen={cartOpen} onClose={() => setCartOpen(false)} />
    </>
  );
}
