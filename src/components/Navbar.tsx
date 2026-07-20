"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
  X,
  Search,
  ArrowRight,
  ShoppingBag,
  Volume2,
  VolumeX,
  ChevronDown,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cartState } from "@/data/cart";
import CartDrawer from "@/components/CartDrawer";

// ─── SVG Icons ─────────────────────────────────────────────────────────────────

const InstagramIcon = () => (
  <svg
    width="19"
    height="19"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
    <circle cx="12" cy="12" r="4" />
    <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
  </svg>
);

const WhatsAppIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
  </svg>
);

// ─── Data ──────────────────────────────────────────────────────────────────────

const navLinks = [
  { label: "Home", href: "/" },
  { label: "Collections", href: "/collections" },
  { label: "Products", href: "/products" },
  { label: "Our Story", href: "/about" },
  { label: "Contact", href: "/contact" },
];

const mobileNavLinks = [
  { label: "Home", href: "/" },
  { label: "Collections", href: "/collections" },
  { label: "Products", href: "/products" },
  { label: "Our Story", href: "/about" },
  { label: "Appointments", href: "/contact" },
  { label: "Contact", href: "/contact" },
];

const popularSearches = [
  "Lehenga",
  "Anarkali",
  "Sharara",
  "Saree",
  "Suits",
  "Couture",
  "Bridal",
];

const trendingCollections = [
  { name: "Bridal Couture '25", href: "/collections/bridal" },
  { name: "The Festive Edit", href: "/collections/festive" },
  { name: "Atelier Power Suits", href: "/collections/designer-suits" },
];

const recentlyViewedProducts = [
  {
    id: 1,
    name: "Royal Crimson Bridal Lehenga",
    category: "Wedding Collection",
    image: "/images/models/hero_bridal.png",
    price: 85000,
  },
  {
    id: 2,
    name: "Emerald Festive Anarkali",
    category: "Festive Collection",
    image: "/images/products/festive-anarkali-1.jpg",
    price: 38000,
  },
  {
    id: 3,
    name: "Ivory Pearl Wedding Sharara",
    category: "Wedding Collection",
    image: "/images/products/wedding-sharara-1.jpg",
    price: 62000,
  },
];

const searchSuggestionPool = [
  "Royal Crimson Bridal Lehenga",
  "Emerald Festive Anarkali",
  "Ivory Pearl Wedding Sharara",
  "Midnight Blue Power Suit",
  "Pink Banarasi Silk Lehenga",
  "Amber Gold Zardozi Anarkali",
  "Rose Gold Silk Sherwani",
  "Pastel Organza Lehenga Suit",
];

// ─── Boutique Experience ───────────────────────────────────────────────────────

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
    description: [
      "Soft footsteps",
      "Fabric movement",
      "Tailor scissors",
      "Gentle showroom ambience",
    ],
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

// ─── Shared inline style helpers ───────────────────────────────────────────────

const iconBtn: React.CSSProperties = {
  background: "none",
  border: "none",
  cursor: "pointer",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  padding: "8px",
  borderRadius: "4px",
  WebkitTapHighlightColor: "transparent",
  flexShrink: 0,
};

// ─── Component ─────────────────────────────────────────────────────────────────

export default function Navbar() {
  const pathname = usePathname();

  // ── Responsive breakpoint via JS (no Tailwind class dependency) ──
  // Default to 1440 so SSR renders desktop and avoids layout shift flash.
  const [windowWidth, setWindowWidth] = useState(1440);

  useEffect(() => {
    const update = () => setWindowWidth(window.innerWidth);
    update();
    window.addEventListener("resize", update, { passive: true });
    return () => window.removeEventListener("resize", update);
  }, []);

  // Breakpoint flags
  const isDesktop = windowWidth >= 1024;   // 1024px+
  const showHamburger = windowWidth < 1024; // < 1024px: tablet + mobile

  // ── Page / scroll theme ───────────────────────────────────────────
  const isLightPage = pathname !== "/";
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const isLight = scrolled || isLightPage;

  // Colours derived from theme
  const navFg = isLight ? "var(--text-primary)" : "#ffffff";
  const navMuted = isLight ? "var(--text-muted)" : "rgba(255,220,140,0.85)";
  const hamColor = isLight ? "var(--text-primary)" : "#E8A830";

  // ── State ─────────────────────────────────────────────────────────
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(-1);

  // Boutique Experience
  const [activeMode, setActiveMode] = useState<ExperienceMode>("silent");
  const [isMuted, setIsMuted] = useState(false);
  const [ambientOpen, setAmbientOpen] = useState(false);
  const [isFading, setIsFading] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);

  // Newsletter
  const [newsletterEmail, setNewsletterEmail] = useState("");
  const [newsletterDone, setNewsletterDone] = useState(false);

  // ── Refs ──────────────────────────────────────────────────────────
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const ambientPanelRef = useRef<HTMLDivElement>(null);
  const volumeFadeRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // ── Effects ───────────────────────────────────────────────────────

  // Cart sync
  useEffect(() => {
    cartState.load();
    setCartCount(cartState.getCount());
    const unsub = cartState.subscribe(() => setCartCount(cartState.getCount()));
    const sync = () => setCartCount(cartState.getCount());
    window.addEventListener("sana_cart_change", sync);
    return () => {
      unsub();
      window.removeEventListener("sana_cart_change", sync);
    };
  }, []);

  // Body scroll lock when overlay is open
  useEffect(() => {
    document.body.style.overflow = mobileOpen || searchOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen, searchOpen]);

  // Auto-focus search input
  useEffect(() => {
    if (searchOpen) setTimeout(() => searchInputRef.current?.focus(), 120);
  }, [searchOpen]);

  // Restore Boutique Experience prefs
  useEffect(() => {
    try {
      const saved = localStorage.getItem("sana_boutique_experience");
      if (saved) {
        const p = JSON.parse(saved);
        if (p.mode && EXPERIENCE_MODES.find((m) => m.id === p.mode))
          setActiveMode(p.mode as ExperienceMode);
        if (typeof p.muted === "boolean") setIsMuted(p.muted);
      }
    } catch {}
  }, []);

  // Save Boutique Experience prefs
  useEffect(() => {
    try {
      localStorage.setItem(
        "sana_boutique_experience",
        JSON.stringify({ mode: activeMode, muted: isMuted })
      );
    } catch {}
  }, [activeMode, isMuted]);

  // Pause audio when a video plays on the page
  useEffect(() => {
    const h = () => {
      if (isPlaying) fadeOutAudio();
    };
    document.addEventListener("sana_video_play", h);
    return () => document.removeEventListener("sana_video_play", h);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isPlaying]);

  // Close ambient panel on outside click
  useEffect(() => {
    const h = (e: MouseEvent) => {
      if (
        ambientPanelRef.current &&
        !ambientPanelRef.current.contains(e.target as Node)
      )
        setAmbientOpen(false);
    };
    if (ambientOpen) document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, [ambientOpen]);

  // Global keyboard shortcuts
  useEffect(() => {
    const h = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        if (searchOpen) closeSearch();
        if (mobileOpen) setMobileOpen(false);
        if (ambientOpen) setAmbientOpen(false);
      }
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setSearchOpen(true);
      }
    };
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchOpen, mobileOpen, ambientOpen]);

  // ── Audio helpers ─────────────────────────────────────────────────

  const fadeInAudio = useCallback(
    (targetVol: number) => {
      if (!audioRef.current) return;
      if (volumeFadeRef.current) clearInterval(volumeFadeRef.current);
      audioRef.current.volume = 0;
      audioRef.current.play().catch(console.warn);
      setIsFading(true);
      volumeFadeRef.current = setInterval(() => {
        if (!audioRef.current) return;
        const next = Math.min(audioRef.current.volume + 0.02, targetVol);
        audioRef.current.volume = next;
        if (next >= targetVol) {
          clearInterval(volumeFadeRef.current!);
          setIsFading(false);
        }
      }, 50);
    },
    []
  );

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

  const selectMode = useCallback(
    (modeId: ExperienceMode) => {
      const mode = EXPERIENCE_MODES.find((m) => m.id === modeId)!;
      setActiveMode(modeId);
      if (modeId === "silent") {
        if (audioRef.current && isPlaying) fadeOutAudio();
      } else {
        if (!mode.src) return;
        if (audioRef.current) {
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
    },
    [isPlaying, fadeOutAudio, fadeInAudio]
  );

  const toggleMute = useCallback(() => {
    if (!audioRef.current) return;
    const next = !isMuted;
    setIsMuted(next);
    const mode = EXPERIENCE_MODES.find((m) => m.id === activeMode);
    if (next) audioRef.current.volume = 0;
    else if (mode?.volume) audioRef.current.volume = mode.volume;
  }, [isMuted, activeMode]);

  // ── Search helpers ────────────────────────────────────────────────

  const closeSearch = () => {
    setSearchOpen(false);
    setSearchQuery("");
    setSuggestions([]);
    setSelectedIndex(-1);
  };

  const handleSearchChange = (val: string) => {
    setSearchQuery(val);
    if (!val.trim()) {
      setSuggestions([]);
      setSelectedIndex(-1);
      return;
    }
    setSuggestions(
      searchSuggestionPool.filter((i) =>
        i.toLowerCase().includes(val.toLowerCase())
      )
    );
    setSelectedIndex(-1);
  };

  const handleSearchKey = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      e.preventDefault();
      closeSearch();
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      if (suggestions.length > 0)
        setSelectedIndex((p) => (p + 1) % suggestions.length);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      if (suggestions.length > 0)
        setSelectedIndex(
          (p) => (p - 1 + suggestions.length) % suggestions.length
        );
    } else if (e.key === "Enter") {
      e.preventDefault();
      const target =
        selectedIndex >= 0 ? suggestions[selectedIndex] : searchQuery.trim();
      if (target) {
        window.location.href = `/products?search=${encodeURIComponent(target)}`;
        closeSearch();
      }
    }
  };

  const handleNewsletter = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsletterEmail.trim()) return;
    setNewsletterDone(true);
    setNewsletterEmail("");
  };

  // ── Render ────────────────────────────────────────────────────────

  return (
    <>
      {/* Hidden Audio — no autoplay */}
      <audio ref={audioRef} preload="none" loop />

      {/* ══════════════════════════════════════════════════════════════
          NAVBAR
          z-index: 100
      ══════════════════════════════════════════════════════════════ */}
      <nav
        role="navigation"
        aria-label="Main navigation"
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 100,
          height: scrolled ? "64px" : "80px",
          background: isLight
            ? "rgba(255,251,244,0.97)"
            : "linear-gradient(to bottom, rgba(10,5,2,0.72) 0%, rgba(10,5,2,0) 100%)",
          backdropFilter: isLight ? "blur(24px) saturate(1.6)" : "none",
          WebkitBackdropFilter: isLight ? "blur(24px) saturate(1.6)" : "none",
          borderBottom: isLight
            ? "1px solid rgba(200,133,26,0.15)"
            : "1px solid transparent",
          boxShadow: isLight ? "0 1px 32px rgba(28,14,5,0.06)" : "none",
          transition: "height 0.3s ease, background 0.3s ease, box-shadow 0.3s ease",
          paddingTop: "env(safe-area-inset-top, 0px)",
        }}
      >
        <div
          style={{
            maxWidth: "1400px",
            margin: "0 auto",
            padding: "0 20px",
            height: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: "16px",
          }}
        >
          {/* ── Logo ────────────────────────────────────────────────── */}
          <Link
            href="/"
            aria-label="Sana Fashion House — Home"
            style={{ display: "flex", alignItems: "center", flexShrink: 0 }}
          >
            <div
              style={{
                position: "relative",
                height: scrolled ? "38px" : "48px",
                width: scrolled ? "120px" : "152px",
                transition: "all 0.3s ease",
              }}
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

          {/* ── Desktop Nav Links (1024px+) ──────────────────────────── */}
          {isDesktop && (
            <nav
              aria-label="Site links"
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "36px",
                flex: 1,
              }}
            >
              {navLinks.map((l) => {
                const active = pathname === l.href;
                return (
                  <Link
                    key={l.label}
                    href={l.href}
                    aria-current={active ? "page" : undefined}
                    style={{
                      fontFamily: "var(--font-accent)",
                      fontSize: "13px",
                      fontWeight: 500,
                      letterSpacing: "0.13em",
                      textTransform: "uppercase",
                      color: active ? "var(--gold)" : navFg,
                      textDecoration: "none",
                      whiteSpace: "nowrap",
                      position: "relative",
                      transition: "color 0.25s ease",
                      textShadow: isLight ? "none" : "0 1px 4px rgba(0,0,0,0.4)",
                    }}
                  >
                    {l.label}
                    {/* Active underline */}
                    {active && (
                      <span
                        aria-hidden="true"
                        style={{
                          position: "absolute",
                          bottom: "-3px",
                          left: 0,
                          right: 0,
                          height: "1px",
                          background: "var(--gold)",
                        }}
                      />
                    )}
                  </Link>
                );
              })}
            </nav>
          )}

          {/* ── Right Actions ────────────────────────────────────────── */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "4px",
              flexShrink: 0,
            }}
          >
            {/* Search — always visible */}
            <button
              id="navbar-search-btn"
              onClick={() => setSearchOpen(true)}
              aria-label="Open search (Ctrl+K)"
              title="Search (Ctrl K)"
              style={{ ...iconBtn, color: navFg }}
            >
              <Search size={20} strokeWidth={1.6} />
            </button>

            {/* Cart — always visible */}
            <button
              id="navbar-cart-btn"
              onClick={() => setCartOpen(true)}
              aria-label={`Shopping bag — ${cartCount} item${cartCount !== 1 ? "s" : ""}`}
              style={{ ...iconBtn, color: navFg, position: "relative" }}
            >
              <ShoppingBag size={20} strokeWidth={1.6} />
              <AnimatePresence>
                {cartCount > 0 && (
                  <motion.span
                    key="cart-badge"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0 }}
                    style={{
                      position: "absolute",
                      top: "2px",
                      right: "2px",
                      background: "#8B1A3A",
                      color: "#fff",
                      fontSize: "8px",
                      width: "16px",
                      height: "16px",
                      borderRadius: "50%",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontWeight: 700,
                      lineHeight: 1,
                    }}
                  >
                    {cartCount > 9 ? "9+" : cartCount}
                  </motion.span>
                )}
              </AnimatePresence>
            </button>

            {/* Instagram — desktop only */}
            {isDesktop && (
              <a
                id="navbar-instagram-link"
                href="https://www.instagram.com/sana___fashion___01/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Follow on Instagram"
                style={{ ...iconBtn, color: navFg }}
              >
                <InstagramIcon />
              </a>
            )}

            {/* Boutique Experience — desktop only */}
            {isDesktop && (
              <div ref={ambientPanelRef} style={{ position: "relative" }}>
                <button
                  id="navbar-boutique-experience-btn"
                  onClick={() => setAmbientOpen((o) => !o)}
                  aria-label="Boutique Experience — audio atmosphere"
                  aria-expanded={ambientOpen}
                  style={{ ...iconBtn, color: navFg, gap: "6px" }}
                >
                  {/* Equalizer bars */}
                  <div
                    aria-hidden="true"
                    style={{
                      display: "flex",
                      alignItems: "flex-end",
                      height: "14px",
                      gap: "2px",
                    }}
                  >
                    {isPlaying && !isMuted ? (
                      <>
                        <span className="equalizer-bar eq-1 bg-[var(--gold)]" />
                        <span className="equalizer-bar eq-2 bg-[var(--gold)]" />
                        <span className="equalizer-bar eq-3 bg-[var(--gold)]" />
                        <span className="equalizer-bar eq-4 bg-[var(--gold)]" />
                      </>
                    ) : (
                      <>
                        <span
                          style={{ display: "block", width: "2.5px", height: "3px", borderRadius: "2px", background: navMuted }}
                        />
                        <span
                          style={{ display: "block", width: "2.5px", height: "7px", borderRadius: "2px", background: navMuted }}
                        />
                        <span
                          style={{ display: "block", width: "2.5px", height: "5px", borderRadius: "2px", background: navMuted }}
                        />
                        <span
                          style={{ display: "block", width: "2.5px", height: "4px", borderRadius: "2px", background: navMuted }}
                        />
                      </>
                    )}
                  </div>
                  <span
                    style={{
                      fontFamily: "var(--font-accent)",
                      fontSize: "10px",
                      letterSpacing: "0.16em",
                      textTransform: "uppercase",
                      color: navMuted,
                    }}
                  >
                    Experience
                  </span>
                  <ChevronDown
                    size={11}
                    strokeWidth={2}
                    style={{
                      color: navMuted,
                      transform: ambientOpen ? "rotate(180deg)" : "rotate(0deg)",
                      transition: "transform 0.3s ease",
                    }}
                  />
                </button>

                {/* Boutique Experience Panel */}
                <AnimatePresence>
                  {ambientOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 8, scale: 0.97 }}
                      animate={{
                        opacity: 1,
                        y: 0,
                        scale: 1,
                        transition: { duration: 0.22, ease: [0.22, 1, 0.36, 1] },
                      }}
                      exit={{
                        opacity: 0,
                        y: 6,
                        scale: 0.97,
                        transition: { duration: 0.18 },
                      }}
                      className="boutique-exp-panel"
                      style={{ position: "absolute", right: 0, marginTop: "12px", zIndex: 200 }}
                      role="dialog"
                      aria-label="Boutique Experience controls"
                    >
                      {/* Panel Header */}
                      <div className="boutique-exp-header">
                        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>
                          <div>
                            <span
                              style={{
                                fontFamily: "var(--font-accent)",
                                fontSize: "8.5px",
                                letterSpacing: "0.28em",
                                textTransform: "uppercase",
                                color: "var(--gold)",
                                display: "block",
                                marginBottom: "4px",
                              }}
                            >
                              Boutique Experience
                            </span>
                            <p
                              style={{
                                fontFamily: "var(--font-serif)",
                                fontSize: "12px",
                                color: "var(--text-secondary)",
                                fontStyle: "italic",
                                lineHeight: "1.4",
                              }}
                            >
                              Choose how you want to experience the atelier.
                            </p>
                          </div>
                          <div style={{ display: "flex", alignItems: "center", gap: "8px", marginLeft: "12px", flexShrink: 0 }}>
                            {isPlaying && (
                              <button
                                onClick={toggleMute}
                                className="boutique-exp-mute-btn"
                                aria-label={isMuted ? "Unmute" : "Mute"}
                              >
                                {isMuted ? (
                                  <VolumeX size={13} strokeWidth={1.5} />
                                ) : (
                                  <Volume2 size={13} strokeWidth={1.5} />
                                )}
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
                        {/* Now playing */}
                        {isPlaying && (
                          <div className="boutique-exp-now-playing">
                            <span style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                              <span style={{ display: "flex", alignItems: "flex-end", gap: "1.5px", height: "12px" }}>
                                <span className="equalizer-bar-sm eq-1 bg-[var(--gold)]" />
                                <span className="equalizer-bar-sm eq-2 bg-[var(--gold)]" />
                                <span className="equalizer-bar-sm eq-3 bg-[var(--gold)]" />
                              </span>
                              <span
                                style={{
                                  fontFamily: "var(--font-accent)",
                                  fontSize: "8px",
                                  letterSpacing: "0.15em",
                                  textTransform: "uppercase",
                                  color: "var(--gold)",
                                }}
                              >
                                {EXPERIENCE_MODES.find((m) => m.id === activeMode)?.name}
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
                              className={`boutique-exp-mode-card ${isActive ? "active" : ""} ${isCurrentlyPlaying ? "playing" : ""}`}
                              aria-pressed={isActive}
                            >
                              <span className="boutique-exp-radio" aria-hidden="true">
                                {isActive && <span className="boutique-exp-radio-fill" />}
                              </span>
                              <div style={{ flex: 1, textAlign: "left" }}>
                                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                                  <span className="boutique-exp-mode-name">{mode.name}</span>
                                  {mode.id === "silent" && (
                                    <span className="boutique-exp-default-badge">Default</span>
                                  )}
                                  {isCurrentlyPlaying && !isMuted && (
                                    <span style={{ display: "flex", alignItems: "flex-end", gap: "1.5px", height: "12px", marginLeft: "8px" }}>
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
            )}

            {/* Book Appointment — desktop only */}
            {isDesktop && (
              <Link href="/contact" id="navbar-book-btn" style={{ marginLeft: "8px" }}>
                <button
                  className="book-appointment-btn group"
                  aria-label="Book a consultation appointment"
                >
                  <span className="book-btn-shine" aria-hidden="true" />
                  <span
                    style={{
                      position: "relative",
                      zIndex: 10,
                      fontFamily: "var(--font-accent)",
                      fontSize: "12px",
                      letterSpacing: "0.18em",
                      textTransform: "uppercase",
                      fontWeight: 500,
                    }}
                  >
                    Book Appointment
                  </span>
                </button>
              </Link>
            )}

            {/* ── Hamburger — Mobile + Tablet (< 1024px) ──────────────
                Uses React state (showHamburger) — zero CSS class dependency.
                Always renders a visible 3-bar icon.
            ─────────────────────────────────────────────────────────── */}
            {showHamburger && (
              <button
                id="navbar-hamburger"
                onClick={() => setMobileOpen(true)}
                aria-label="Open navigation menu"
                aria-expanded={mobileOpen}
                aria-controls="mobile-nav-drawer"
                style={{
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "flex-end",
                  justifyContent: "center",
                  gap: "5px",
                  padding: "10px 8px",
                  minWidth: "44px",
                  minHeight: "44px",
                  flexShrink: 0,
                  WebkitTapHighlightColor: "transparent",
                  marginLeft: "4px",
                }}
              >
                <span
                  style={{
                    display: "block",
                    height: "2px",
                    width: "24px",
                    borderRadius: "2px",
                    backgroundColor: hamColor,
                    transition: "background-color 0.3s ease",
                  }}
                />
                <span
                  style={{
                    display: "block",
                    height: "2px",
                    width: "16px",
                    borderRadius: "2px",
                    backgroundColor: hamColor,
                    transition: "background-color 0.3s ease",
                  }}
                />
                <span
                  style={{
                    display: "block",
                    height: "2px",
                    width: "20px",
                    borderRadius: "2px",
                    backgroundColor: hamColor,
                    transition: "background-color 0.3s ease",
                  }}
                />
              </button>
            )}
          </div>
        </div>
      </nav>

      {/* ══════════════════════════════════════════════════════════════
          MOBILE FULL-SCREEN DRAWER
          Backdrop z-index: 105  |  Drawer z-index: 110
      ══════════════════════════════════════════════════════════════ */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              key="mobile-backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.32 }}
              onClick={() => setMobileOpen(false)}
              aria-hidden="true"
              style={{
                position: "fixed",
                inset: 0,
                zIndex: 105,
                background: "rgba(10,5,2,0.65)",
                backdropFilter: "blur(4px)",
                WebkitBackdropFilter: "blur(4px)",
              }}
            />

            {/* Drawer Panel */}
            <motion.div
              key="mobile-drawer"
              id="mobile-nav-drawer"
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ duration: 0.44, ease: [0.22, 1, 0.36, 1] }}
              role="dialog"
              aria-modal="true"
              aria-label="Mobile navigation menu"
              style={{
                position: "fixed",
                top: 0,
                right: 0,
                bottom: 0,
                width: "min(88vw, 420px)",
                zIndex: 110,
                display: "flex",
                flexDirection: "column",
                overflow: "hidden",
                background: "var(--cream)",
                borderLeft: "1px solid rgba(200,133,26,0.12)",
                paddingTop: "env(safe-area-inset-top, 0px)",
                paddingBottom: "env(safe-area-inset-bottom, 0px)",
              }}
            >
              {/* ── Drawer Header ──────────────────────────────────── */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "20px 24px",
                  borderBottom: "1px solid rgba(200,133,26,0.1)",
                  flexShrink: 0,
                }}
              >
                <Link
                  href="/"
                  onClick={() => setMobileOpen(false)}
                  aria-label="Home"
                >
                  <div style={{ position: "relative", height: "36px", width: "112px" }}>
                    <Image
                      src="/Logo/image.png?v=3"
                      alt="SANA"
                      fill
                      className="object-contain object-left"
                      unoptimized
                    />
                  </div>
                </Link>

                <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                  {/* Search shortcut */}
                  <button
                    onClick={() => {
                      setMobileOpen(false);
                      setTimeout(() => setSearchOpen(true), 300);
                    }}
                    aria-label="Search"
                    style={{ ...iconBtn, color: "var(--text-primary)" }}
                  >
                    <Search size={18} strokeWidth={1.6} />
                  </button>

                  {/* Cart shortcut */}
                  <button
                    onClick={() => {
                      setMobileOpen(false);
                      setTimeout(() => setCartOpen(true), 300);
                    }}
                    aria-label="Shopping bag"
                    style={{ ...iconBtn, color: "var(--text-primary)", position: "relative" }}
                  >
                    <ShoppingBag size={18} strokeWidth={1.6} />
                    {cartCount > 0 && (
                      <span
                        style={{
                          position: "absolute",
                          top: "2px",
                          right: "2px",
                          background: "#8B1A3A",
                          color: "#fff",
                          fontSize: "7px",
                          width: "14px",
                          height: "14px",
                          borderRadius: "50%",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontWeight: 700,
                        }}
                      >
                        {cartCount > 9 ? "9+" : cartCount}
                      </span>
                    )}
                  </button>

                  {/* Close */}
                  <button
                    onClick={() => setMobileOpen(false)}
                    aria-label="Close menu"
                    style={{
                      width: "36px",
                      height: "36px",
                      borderRadius: "50%",
                      border: "1px solid rgba(200,133,26,0.2)",
                      background: "transparent",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      cursor: "pointer",
                      color: "var(--text-primary)",
                      WebkitTapHighlightColor: "transparent",
                    }}
                  >
                    <X size={15} />
                  </button>
                </div>
              </div>

              {/* ── Scrollable Content ──────────────────────────────── */}
              <div style={{ flex: 1, overflowY: "auto" }}>

                {/* Navigation Links */}
                <nav style={{ padding: "24px 24px 8px" }} aria-label="Mobile navigation">
                  <p
                    style={{
                      fontFamily: "var(--font-accent)",
                      fontSize: "8px",
                      letterSpacing: "0.3em",
                      textTransform: "uppercase",
                      color: "var(--gold)",
                      marginBottom: "8px",
                    }}
                  >
                    Navigation
                  </p>

                  {mobileNavLinks.map((l, i) => {
                    const active = pathname === l.href;
                    return (
                      <motion.div
                        key={`${l.label}-${i}`}
                        initial={{ opacity: 0, x: 24 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{
                          duration: 0.32,
                          delay: 0.06 + i * 0.05,
                          ease: [0.22, 1, 0.36, 1],
                        }}
                      >
                        <Link
                          href={l.href}
                          onClick={() => setMobileOpen(false)}
                          aria-current={active ? "page" : undefined}
                          style={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                            padding: "15px 0",
                            borderBottom: "1px solid rgba(200,133,26,0.07)",
                            fontFamily: "var(--font-display)",
                            fontSize: "24px",
                            fontWeight: 400,
                            letterSpacing: "-0.01em",
                            color: active ? "var(--gold)" : "var(--text-primary)",
                            textDecoration: "none",
                          }}
                        >
                          <span>{l.label}</span>
                          <ArrowRight
                            size={16}
                            style={{
                              color: "var(--gold)",
                              opacity: active ? 1 : 0.35,
                              flexShrink: 0,
                            }}
                          />
                        </Link>
                      </motion.div>
                    );
                  })}
                </nav>

                {/* Social */}
                <div
                  style={{
                    padding: "20px 24px",
                    borderTop: "1px solid rgba(200,133,26,0.08)",
                  }}
                >
                  <p
                    style={{
                      fontFamily: "var(--font-accent)",
                      fontSize: "8px",
                      letterSpacing: "0.3em",
                      textTransform: "uppercase",
                      color: "var(--gold)",
                      marginBottom: "14px",
                    }}
                  >
                    Connect
                  </p>
                  <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
                    <a
                      href="https://www.instagram.com/sana___fashion___01/"
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => setMobileOpen(false)}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "12px",
                        color: "var(--text-secondary)",
                        textDecoration: "none",
                      }}
                    >
                      <InstagramIcon />
                      <span
                        style={{
                          fontFamily: "var(--font-accent)",
                          fontSize: "11px",
                          letterSpacing: "0.06em",
                        }}
                      >
                        @sana___fashion___01
                      </span>
                    </a>
                    <a
                      href="https://wa.me/919022591620"
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => setMobileOpen(false)}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "12px",
                        color: "var(--text-secondary)",
                        textDecoration: "none",
                      }}
                    >
                      <WhatsAppIcon />
                      <span
                        style={{
                          fontFamily: "var(--font-accent)",
                          fontSize: "11px",
                          letterSpacing: "0.06em",
                        }}
                      >
                        +91 90225 91620
                      </span>
                    </a>
                  </div>
                </div>

                {/* Newsletter */}
                <div
                  style={{
                    padding: "20px 24px",
                    borderTop: "1px solid rgba(200,133,26,0.08)",
                  }}
                >
                  <p
                    style={{
                      fontFamily: "var(--font-accent)",
                      fontSize: "8px",
                      letterSpacing: "0.3em",
                      textTransform: "uppercase",
                      color: "var(--gold)",
                      marginBottom: "4px",
                    }}
                  >
                    Atelier Letters
                  </p>
                  <p
                    style={{
                      fontFamily: "var(--font-serif)",
                      fontStyle: "italic",
                      fontSize: "11px",
                      color: "var(--text-muted)",
                      marginBottom: "12px",
                    }}
                  >
                    Exclusive previews &amp; invitations
                  </p>
                  {newsletterDone ? (
                    <p
                      style={{
                        fontFamily: "var(--font-accent)",
                        fontSize: "10px",
                        letterSpacing: "0.1em",
                        color: "var(--gold)",
                        paddingTop: "8px",
                      }}
                    >
                      ✓ You&apos;re on the list
                    </p>
                  ) : (
                    <form
                      onSubmit={handleNewsletter}
                      style={{ display: "flex", gap: "8px" }}
                    >
                      <input
                        type="email"
                        value={newsletterEmail}
                        onChange={(e) => setNewsletterEmail(e.target.value)}
                        placeholder="your@email.com"
                        required
                        aria-label="Email address"
                        style={{
                          flex: 1,
                          background: "transparent",
                          border: "1px solid rgba(200,133,26,0.25)",
                          padding: "8px 12px",
                          fontFamily: "var(--font-body)",
                          fontSize: "11px",
                          color: "var(--text-primary)",
                          outline: "none",
                          borderRadius: "2px",
                        }}
                      />
                      <button
                        type="submit"
                        style={{
                          padding: "8px 12px",
                          background: "var(--gold)",
                          color: "var(--cream)",
                          border: "none",
                          cursor: "pointer",
                          fontFamily: "var(--font-accent)",
                          fontSize: "9px",
                          letterSpacing: "0.15em",
                          textTransform: "uppercase",
                          borderRadius: "2px",
                          flexShrink: 0,
                        }}
                      >
                        Join
                      </button>
                    </form>
                  )}
                </div>
              </div>

              {/* ── Drawer Footer ───────────────────────────────────── */}
              <div
                style={{
                  padding: "20px 24px",
                  borderTop: "1px solid rgba(200,133,26,0.15)",
                  flexShrink: 0,
                  background: "var(--cream-warm)",
                }}
              >
                <Link
                  href="/contact"
                  onClick={() => setMobileOpen(false)}
                  style={{ display: "block" }}
                >
                  <button
                    className="book-appointment-btn group"
                    aria-label="Book an appointment"
                    style={{ width: "100%" }}
                  >
                    <span className="book-btn-shine" aria-hidden="true" />
                    <span
                      style={{
                        position: "relative",
                        zIndex: 10,
                        fontFamily: "var(--font-accent)",
                        fontSize: "12.5px",
                        letterSpacing: "0.18em",
                        textTransform: "uppercase",
                        fontWeight: 500,
                      }}
                    >
                      Book Appointment
                    </span>
                  </button>
                </Link>
                <p
                  style={{
                    textAlign: "center",
                    fontFamily: "var(--font-accent)",
                    fontSize: "8px",
                    letterSpacing: "0.2em",
                    textTransform: "uppercase",
                    color: "var(--text-muted)",
                    marginTop: "12px",
                  }}
                >
                  © 2026 Sana Atelier · Crafted with intent
                </p>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* ══════════════════════════════════════════════════════════════
          FULLSCREEN SEARCH OVERLAY
          z-index: 9999
      ══════════════════════════════════════════════════════════════ */}
      <AnimatePresence>
        {searchOpen && (
          <motion.div
            key="search-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.28 }}
            role="dialog"
            aria-modal="true"
            aria-label="Search"
            style={{
              position: "fixed",
              inset: 0,
              zIndex: 9999,
              display: "flex",
              flexDirection: "column",
              overflowY: "auto",
              background: "rgba(255,251,244,0.98)",
              backdropFilter: "blur(20px)",
              WebkitBackdropFilter: "blur(20px)",
            }}
          >
            {/* Search Header */}
            <motion.div
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.3, delay: 0.06 }}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "28px 24px 22px",
                borderBottom: "1px solid rgba(200,133,26,0.12)",
                flexShrink: 0,
              }}
            >
              <span
                style={{
                  fontFamily: "var(--font-accent)",
                  fontSize: "9px",
                  letterSpacing: "0.3em",
                  textTransform: "uppercase",
                  color: "var(--text-muted)",
                }}
              >
                Atelier Search
              </span>
              <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
                <span
                  style={{
                    fontFamily: "var(--font-accent)",
                    fontSize: "9px",
                    letterSpacing: "0.2em",
                    textTransform: "uppercase",
                    color: "var(--text-muted)",
                    background: "rgba(200,133,26,0.08)",
                    padding: "4px 10px",
                    borderRadius: "2px",
                    border: "1px solid rgba(200,133,26,0.15)",
                  }}
                >
                  ESC
                </span>
                <button
                  onClick={closeSearch}
                  aria-label="Close search"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "6px",
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    color: "var(--text-secondary)",
                    fontFamily: "var(--font-accent)",
                    fontSize: "10px",
                    letterSpacing: "0.2em",
                    textTransform: "uppercase",
                  }}
                >
                  <span>Close</span>
                  <X size={14} />
                </button>
              </div>
            </motion.div>

            {/* Search Input */}
            <motion.div
              initial={{ y: -14, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.36, delay: 0.1 }}
              style={{
                padding: "32px 24px 24px",
                maxWidth: "800px",
                width: "100%",
                margin: "0 auto",
              }}
            >
              <div style={{ display: "flex", alignItems: "center" }}>
                <Search
                  size={22}
                  strokeWidth={1.4}
                  style={{ color: "var(--gold)", marginRight: "16px", flexShrink: 0 }}
                />
                <input
                  ref={searchInputRef}
                  type="text"
                  value={searchQuery}
                  onChange={(e) => handleSearchChange(e.target.value)}
                  onKeyDown={handleSearchKey}
                  placeholder="Search bridal, festive, suits…"
                  aria-label="Search query"
                  style={{
                    flex: 1,
                    background: "transparent",
                    border: "none",
                    outline: "none",
                    fontFamily: "var(--font-display)",
                    fontSize: "clamp(22px, 5vw, 38px)",
                    color: "var(--text-primary)",
                    caretColor: "var(--gold)",
                  }}
                />
              </div>
              <div
                style={{
                  height: "1px",
                  background:
                    "linear-gradient(to right, transparent, rgba(200,133,26,0.35), transparent)",
                  marginTop: "16px",
                }}
              />
            </motion.div>

            {/* Search Results / Suggestions */}
            <motion.div
              initial={{ y: 10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.36, delay: 0.18 }}
              style={{
                flex: 1,
                padding: "0 24px 64px",
                maxWidth: "800px",
                width: "100%",
                margin: "0 auto",
              }}
            >
              {searchQuery.trim().length > 0 ? (
                <div>
                  <p
                    style={{
                      fontFamily: "var(--font-accent)",
                      fontSize: "8.5px",
                      letterSpacing: "0.28em",
                      textTransform: "uppercase",
                      color: "var(--gold)",
                      marginBottom: "16px",
                    }}
                  >
                    Suggestions
                  </p>
                  <div>
                    {suggestions.length > 0 ? (
                      suggestions.map((sug, idx) => (
                        <Link
                          key={sug}
                          href={`/products?search=${encodeURIComponent(sug)}`}
                          onClick={closeSearch}
                          className={`search-suggestion-item ${idx === selectedIndex ? "active" : ""}`}
                          role="option"
                          aria-selected={idx === selectedIndex}
                        >
                          <Search
                            size={12}
                            strokeWidth={1.5}
                            style={{ flexShrink: 0, opacity: 0.5 }}
                          />
                          <span style={{ flex: 1 }}>{sug}</span>
                          <ArrowRight size={11} style={{ opacity: 0.3 }} />
                        </Link>
                      ))
                    ) : (
                      <p
                        style={{
                          fontFamily: "var(--font-serif)",
                          fontStyle: "italic",
                          color: "var(--text-muted)",
                          fontSize: "14px",
                          padding: "16px 0",
                        }}
                      >
                        No results found for &ldquo;{searchQuery}&rdquo;
                      </p>
                    )}
                  </div>
                </div>
              ) : (
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "36px",
                    paddingTop: "8px",
                  }}
                >
                  {/* Popular Searches */}
                  <div>
                    <p
                      style={{
                        fontFamily: "var(--font-accent)",
                        fontSize: "8.5px",
                        letterSpacing: "0.28em",
                        textTransform: "uppercase",
                        color: "var(--gold)",
                        marginBottom: "16px",
                      }}
                    >
                      Popular Searches
                    </p>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
                      {popularSearches.map((term) => (
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

                  {/* Trending Collections */}
                  <div>
                    <p
                      style={{
                        fontFamily: "var(--font-accent)",
                        fontSize: "8.5px",
                        letterSpacing: "0.28em",
                        textTransform: "uppercase",
                        color: "var(--gold)",
                        marginBottom: "16px",
                      }}
                    >
                      Trending Collections
                    </p>
                    <ul
                      style={{
                        listStyle: "none",
                        padding: 0,
                        display: "flex",
                        flexDirection: "column",
                        gap: "12px",
                      }}
                    >
                      {trendingCollections.map((col) => (
                        <li key={col.name}>
                          <Link
                            href={col.href}
                            onClick={closeSearch}
                            style={{
                              display: "inline-flex",
                              alignItems: "center",
                              gap: "12px",
                              textDecoration: "none",
                            }}
                          >
                            <span
                              style={{
                                width: "20px",
                                height: "1px",
                                background: "rgba(200,133,26,0.4)",
                              }}
                            />
                            <span
                              style={{
                                fontFamily: "var(--font-display)",
                                fontSize: "18px",
                                color: "var(--text-secondary)",
                              }}
                            >
                              {col.name}
                            </span>
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Curated Picks */}
                  <div>
                    <p
                      style={{
                        fontFamily: "var(--font-accent)",
                        fontSize: "8.5px",
                        letterSpacing: "0.28em",
                        textTransform: "uppercase",
                        color: "var(--gold)",
                        marginBottom: "16px",
                      }}
                    >
                      Curated Picks
                    </p>
                    <div
                      style={{
                        display: "flex",
                        gap: "16px",
                        overflowX: "auto",
                        paddingBottom: "4px",
                      }}
                    >
                      {recentlyViewedProducts.map((prod) => (
                        <Link
                          key={prod.id}
                          href="/products"
                          onClick={closeSearch}
                          style={{
                            flexShrink: 0,
                            width: "120px",
                            textDecoration: "none",
                          }}
                        >
                          <div
                            style={{
                              position: "relative",
                              width: "100%",
                              height: "155px",
                              overflow: "hidden",
                              border: "1px solid rgba(200,133,26,0.12)",
                              marginBottom: "8px",
                            }}
                          >
                            <Image
                              src={prod.image}
                              alt={prod.name}
                              fill
                              className="object-cover object-top"
                            />
                          </div>
                          <p
                            style={{
                              fontFamily: "var(--font-display)",
                              fontSize: "10.5px",
                              color: "var(--text-primary)",
                              lineHeight: 1.3,
                              display: "-webkit-box",
                              WebkitLineClamp: 2,
                              WebkitBoxOrient: "vertical",
                              overflow: "hidden",
                            }}
                          >
                            {prod.name}
                          </p>
                          <p
                            style={{
                              fontFamily: "var(--font-accent)",
                              fontSize: "9px",
                              color: "var(--text-muted)",
                              marginTop: "4px",
                            }}
                          >
                            ₹{prod.price.toLocaleString("en-IN")}
                          </p>
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
