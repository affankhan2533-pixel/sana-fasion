"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { X, Search, ArrowRight, Phone } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import LuxuryButton from "@/components/LuxuryButton";

const InstagramIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
    <circle cx="12" cy="12" r="4" />
    <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
  </svg>
);

const navLinks = [
  { label: "Home", href: "/" },
  { label: "Collections", href: "/collections" },
  { label: "Products", href: "/products" },
  { label: "Our Story", href: "/about" },
  { label: "Contact", href: "/contact" },
];

const popularSearches = ["Lehenga", "Anarkali", "Sharara", "Saree", "Suits", "Couture"];

const trendingCollections = [
  { name: "Bridal Couture '25", href: "/collections/bridal" },
  { name: "The Festive Edit", href: "/collections/festive" },
  { name: "Atelier Power Suits", href: "/collections/designer-suits" }
];

const recentlyViewedProducts = [
  { id: 1, name: "Royal Crimson Bridal Lehenga", category: "Wedding Collection", image: "/images/models/hero_bridal.png", price: 85000 },
  { id: 2, name: "Emerald Festive Anarkali", category: "Festive Collection", image: "/images/products/festive-anarkali-1.jpg", price: 38000 },
  { id: 3, name: "Ivory Pearl Wedding Sharara", category: "Wedding Collection", image: "/images/products/wedding-sharara-1.jpg", price: 62000 }
];

const searchSuggestionPool = [
  "Royal Crimson Bridal Lehenga",
  "Emerald Festive Anarkali",
  "Ivory Pearl Wedding Sharara",
  "Midnight Blue Power Suit",
  "Pink Banarasi Silk Lehenga",
  "Amber Gold Zardozi Anarkali",
  "Rose Gold Silk Sherwani",
  "Pastel Organza Lehenga Suit"
];

// Drawer animation variants
const overlayVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.3 } },
  exit: { opacity: 0, transition: { duration: 0.3, delay: 0.1 } },
};

const drawerVariants = {
  hidden: { x: "100%" },
  visible: { x: 0, transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] } },
  exit: { x: "100%", transition: { duration: 0.35, ease: [0.22, 1, 0.36, 1] } },
};

const navItemVariants = {
  hidden: { x: 30, opacity: 0 },
  visible: (i: number) => ({
    x: 0,
    opacity: 1,
    transition: { duration: 0.35, delay: 0.2 + i * 0.07, ease: [0.22, 1, 0.36, 1] },
  }),
};

const footerVariants = {
  hidden: { y: 15, opacity: 0 },
  visible: { y: 0, opacity: 1, transition: { duration: 0.4, delay: 0.55, ease: [0.22, 1, 0.36, 1] } },
};

export default function Navbar() {
  const pathname = usePathname();
  const isLightPage = pathname !== "/";

  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(-1);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Lock body scroll when drawer or search is open
  useEffect(() => {
    if (mobileOpen || searchOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [mobileOpen, searchOpen]);

  // Focus search input when search opens
  useEffect(() => {
    if (searchOpen) {
      setTimeout(() => searchInputRef.current?.focus(), 100);
    }
  }, [searchOpen]);

  const closeDrawer = () => setMobileOpen(false);
  const closeSearch = () => {
    setSearchOpen(false);
    setSearchQuery("");
    setSuggestions([]);
    setSelectedIndex(-1);
  };

  const handleSearchChange = (val: string) => {
    setSearchQuery(val);
    if (!val.trim()) { setSuggestions([]); setSelectedIndex(-1); return; }
    setSuggestions(searchSuggestionPool.filter(item => item.toLowerCase().includes(val.toLowerCase())));
    setSelectedIndex(-1);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") { e.preventDefault(); closeSearch(); }
    else if (e.key === "ArrowDown") { e.preventDefault(); if (suggestions.length > 0) setSelectedIndex(prev => (prev + 1) % suggestions.length); }
    else if (e.key === "ArrowUp") { e.preventDefault(); if (suggestions.length > 0) setSelectedIndex(prev => (prev - 1 + suggestions.length) % suggestions.length); }
    else if (e.key === "Enter") {
      e.preventDefault();
      const target = selectedIndex >= 0 ? suggestions[selectedIndex] : searchQuery.trim();
      if (target) { window.location.href = `/products?search=${encodeURIComponent(target)}`; closeSearch(); }
    }
  };

  const togglePlay = () => {
    if (!audioRef.current) return;
    if (isPlaying) { audioRef.current.pause(); } else {
      audioRef.current.play().catch(err => console.warn("Audio blocked:", err));
    }
    setIsPlaying(!isPlaying);
  };

  return (
    <>
      <audio ref={audioRef} src="https://assets.mixkit.co/music/preview/mixkit-fashion-lounge-164.mp3" loop preload="auto" />

      {/* ===== NAVBAR ===== */}
      <nav
        className="fixed top-0 left-0 right-0 z-[100] transition-all duration-[250ms] ease-[cubic-bezier(0.22,1,0.36,1)] flex items-center"
        style={{
          height: scrolled ? "80px" : "96px",
          background: (scrolled || isLightPage)
            ? "rgba(255, 251, 244, 0.94)"
            : "linear-gradient(to bottom, rgba(10,5,2,0.6) 0%, rgba(10,5,2,0.0) 100%)",
          backdropFilter: (scrolled || isLightPage) ? "blur(20px)" : "none",
          WebkitBackdropFilter: (scrolled || isLightPage) ? "blur(20px)" : "none",
          borderBottom: (scrolled || isLightPage) ? "1px solid rgba(200,133,26,0.18)" : "1px solid transparent",
        }}
      >
        <div className="editorial-container flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center flex-shrink-0">
            <div className="relative h-[44px] w-[120px] lg:h-[56px] lg:w-[155px] transition-all duration-[250ms]">
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

          {/* Desktop Navigation Links */}
          <div className="hidden lg:flex items-center gap-10">
            {navLinks.map((l) => (
              <Link
                key={l.label}
                href={l.href}
                className="underline-grow font-accent tracking-[0.1em] uppercase transition-colors duration-[250ms] hover:opacity-85"
                style={{
                  color: (scrolled || isLightPage) ? "var(--text-primary)" : "#fff",
                  fontSize: "17px",
                  fontWeight: 500,
                  textShadow: (scrolled || isLightPage) ? "none" : "0 1px 3px rgba(0,0,0,0.35)",
                }}
              >
                {l.label}
              </Link>
            ))}
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-4 sm:gap-6 lg:gap-8">
            {/* Ambient Player */}
            <button
              onClick={togglePlay}
              className="flex items-center gap-2 transition-all hover:opacity-80 p-1.5 cursor-pointer"
              style={{ color: (scrolled || isLightPage) ? "var(--text-primary)" : "#fff" }}
              aria-label="Toggle ambient music"
            >
              <div className="flex items-end h-3 gap-[2.5px] px-0.5">
                {isPlaying ? (
                  <>
                    <span className="w-[2px] bg-[var(--gold)] h-full animate-[pulse_1.0s_infinite]"></span>
                    <span className="w-[2px] bg-[var(--gold)] h-[70%] animate-[pulse_0.8s_infinite]"></span>
                    <span className="w-[2px] bg-[var(--gold)] h-[50%] animate-[pulse_1.3s_infinite]"></span>
                    <span className="w-[2px] bg-[var(--gold)] h-[85%] animate-[pulse_0.9s_infinite]"></span>
                  </>
                ) : (
                  <>
                    <span className="w-[2px] h-[3px] bg-[var(--gold)]"></span>
                    <span className="w-[2px] h-[6px] bg-[var(--gold)]"></span>
                    <span className="w-[2px] h-[4px] bg-[var(--gold)]"></span>
                    <span className="w-[2px] h-[2px] bg-[var(--gold)]"></span>
                  </>
                )}
              </div>
              <span
                className="font-accent text-[9px] tracking-[0.18em] uppercase hidden md:inline-block"
                style={{ color: (scrolled || isLightPage) ? "var(--text-muted)" : "rgba(255,220,140,0.9)" }}
              >
                Atelier Sound
              </span>
            </button>

            {/* Search */}
            <button
              onClick={() => setSearchOpen(true)}
              className="transition-opacity hover:opacity-75 p-1.5 cursor-pointer"
              style={{ color: (scrolled || isLightPage) ? "var(--text-primary)" : "#fff" }}
              aria-label="Open Search"
            >
              <Search size={20} />
            </button>

            {/* Instagram (hidden on small mobile) */}
            <a
              href="https://www.instagram.com/sana___fashion___01/"
              target="_blank"
              rel="noopener noreferrer"
              className="transition-opacity hover:opacity-75 p-1 hidden sm:block"
              style={{ color: (scrolled || isLightPage) ? "var(--text-primary)" : "#fff" }}
              aria-label="Instagram"
            >
              <InstagramIcon />
            </a>

            {/* Book Appointment (Desktop only) */}
            <Link href="/contact" className="hidden lg:block">
              <LuxuryButton 
                variant="secondary" 
                themeType={(scrolled || isLightPage) ? "light" : "dark"}
                className="!h-[50px] !px-6 !rounded-[14px]"
              >
                Book Appointment
              </LuxuryButton>
            </Link>

            {/* Hamburger — hidden on desktop (lg:hidden) */}
            <button
              onClick={() => setMobileOpen(true)}
              className="group flex flex-col items-end gap-[5px] p-2 cursor-pointer lg:hidden"
              aria-label="Open navigation menu"
            >
              <span
                className="w-6 h-[1.5px] transition-all duration-300 group-hover:w-4"
                style={{ backgroundColor: (scrolled || isLightPage) ? "var(--text-primary)" : "var(--gold-light)" }}
              />
              <span
                className="w-4 h-[1.5px] transition-all duration-300 group-hover:w-6"
                style={{ backgroundColor: (scrolled || isLightPage) ? "var(--text-primary)" : "var(--gold-light)" }}
              />
              <span
                className="w-5 h-[1.5px] transition-all duration-300 group-hover:w-3"
                style={{ backgroundColor: (scrolled || isLightPage) ? "var(--text-primary)" : "var(--gold-light)" }}
              />
            </button>
          </div>
        </div>
      </nav>

      {/* ===== MOBILE SIDE DRAWER (Failsafe Tailwind transition) ===== */}
      <div 
        className={`fixed inset-0 z-[9998] transition-opacity duration-300 ease-in-out ${
          mobileOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
      >
        {/* Backdrop overlay */}
        <div 
          onClick={closeDrawer}
          className="absolute inset-0 bg-black/45 backdrop-blur-sm"
        />

        {/* Drawer Panel */}
        <div 
          className={`absolute top-0 right-0 w-[85vw] max-w-[360px] h-full bg-[#FFFBF4] shadow-2xl flex flex-col z-[9999] overflow-y-auto border-l border-[#E6C280]/20 transform transition-transform duration-300 ease-out ${
            mobileOpen ? "translate-x-0" : "translate-x-full"
          }`}
        >
          {/* Header: Logo + Close */}
          <div className="flex justify-between items-center px-6 py-5 border-b border-[#E6C280]/15 flex-shrink-0">
            <Link href="/" onClick={closeDrawer} className="flex items-center">
              <div className="relative h-9 w-24">
                <Image src="/Logo/image.png?v=3" alt="SANA Fashion House" fill className="object-contain object-left" unoptimized />
              </div>
            </Link>
            <button
              onClick={closeDrawer}
              className="w-9 h-9 rounded-full flex items-center justify-center border border-accent-gold/20 hover:border-accent-gold hover:rotate-90 transition-all duration-500 cursor-pointer text-text-primary"
              aria-label="Close menu"
            >
              <X size={15} />
            </button>
          </div>

          {/* Nav Links */}
          <nav className="flex flex-col gap-1 px-6 py-6 flex-grow justify-center">
            {navLinks.map((l) => (
              <div key={l.label}>
                <Link
                  href={l.href}
                  onClick={closeDrawer}
                  className="font-serif text-2xl sm:text-3xl text-text-primary hover:text-accent-gold transition-all duration-300 flex items-center justify-between group py-4 pl-0 hover:pl-3 border-b border-[#E6C280]/10 last:border-0 border-l-0 hover:border-l-2 hover:border-accent-gold"
                >
                  <span className="relative transition-transform duration-300 group-hover:translate-x-2">
                    {l.label}
                  </span>
                  <ArrowRight
                    size={20}
                    className="opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all duration-400 text-accent-gold"
                  />
                </Link>
              </div>
            ))}
          </nav>

          {/* Footer */}
          <div className="px-6 py-6 border-t border-[#E6C280]/15 bg-cream-warm flex flex-col gap-5 flex-shrink-0">
            <Link href="/contact" onClick={closeDrawer} className="w-full block">
              <LuxuryButton variant="primary" className="w-full !h-[56px] !text-[16px] !rounded-[16px]">
                Book Appointment
              </LuxuryButton>
            </Link>

            <div className="flex flex-col gap-3 text-xs font-body text-text-secondary">
              <a
                href="https://www.instagram.com/sana___fashion___01/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2.5 hover:text-accent-gold transition-colors"
              >
                <InstagramIcon /> @sana___fashion___01
              </a>

              <a
                href="https://wa.me/919022591620"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2.5 hover:text-accent-gold transition-colors"
              >
                <Phone size={13} /> +91 90225 91620 (WhatsApp)
              </a>

              <div className="text-[10px] text-text-muted mt-1 leading-relaxed">
                <span className="block text-[7.5px] font-accent tracking-wider text-accent-gold uppercase mb-1">Store Atelier Address</span>
                Sana Fashion House, Heritage Boulevard, Mumbai, India
              </div>

              <p className="text-[9.5px] text-text-muted/60 mt-2 pt-3 border-t border-[#E6C280]/10">
                © 2026 Sana Atelier. Crafted with intent, worn with pride.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ===== FULLSCREEN SEARCH OVERLAY ===== */}
      <AnimatePresence>
        {searchOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1, transition: { duration: 0.3 } }}
            exit={{ opacity: 0, transition: { duration: 0.25 } }}
            className="fixed inset-0 z-[9999] bg-[#F8F6F2] flex flex-col justify-start overflow-y-auto pt-20 sm:pt-28 pb-12 px-5 sm:px-12 lg:px-24 text-text-primary"
          >
            <motion.div
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1, transition: { duration: 0.4, delay: 0.1 } }}
              className="max-w-[660px] w-full mx-auto flex flex-col gap-7"
            >
              {/* Header */}
              <div className="flex justify-between items-center w-full">
                <span className="font-accent text-[8.5px] tracking-[0.25em] text-text-muted uppercase">Atelier Search</span>
                <button
                  onClick={closeSearch}
                  className="flex items-center gap-2 text-text-secondary hover:text-accent-gold font-accent text-[9.5px] tracking-[0.2em] uppercase transition-colors p-1 cursor-pointer"
                  aria-label="Close search"
                >
                  Close <X size={14} className="inline" />
                </button>
              </div>

              {/* Input */}
              <div className="relative flex items-center border-b border-border-strong focus-within:border-accent-gold transition-colors pb-3">
                <Search size={20} className="text-accent-gold mr-3 flex-shrink-0" />
                <input
                  ref={searchInputRef}
                  type="text"
                  value={searchQuery}
                  onChange={e => handleSearchChange(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Search bridal, festive, suits…"
                  className="w-full bg-transparent font-display text-xl sm:text-2xl lg:text-3xl text-text-primary outline-none tracking-wide"
                />
              </div>

              {/* Results */}
              <motion.div
                initial={{ y: 10, opacity: 0 }}
                animate={{ y: 0, opacity: 1, transition: { duration: 0.3, delay: 0.2 } }}
              >
                {searchQuery.trim().length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
                    <div className="md:col-span-3 flex flex-col gap-2">
                      <span className="text-[8px] tracking-[0.25em] text-accent-gold uppercase mb-1">Suggestions</span>
                      <div className="flex flex-col bg-cream border border-border-strong p-2 max-h-[300px] overflow-y-auto">
                        {suggestions.length > 0 ? suggestions.map((sug, idx) => (
                          <Link
                            key={sug}
                            href={`/products?search=${encodeURIComponent(sug)}`}
                            onClick={closeSearch}
                            className={`px-3 py-2.5 font-body text-xs transition-all flex items-center justify-between rounded ${idx === selectedIndex ? "bg-accent-gold/15 text-accent-gold-dark font-medium" : "text-text-secondary hover:bg-black/5"}`}
                          >
                            <span>{sug}</span>
                            <ArrowRight size={11} className={idx === selectedIndex ? "text-accent-gold" : "opacity-30"} />
                          </Link>
                        )) : (
                          <div className="px-4 py-5 text-center text-text-muted font-body text-xs">No results found.</div>
                        )}
                      </div>
                    </div>
                    <div className="md:col-span-2 flex flex-col gap-2">
                      <span className="text-[8px] tracking-[0.25em] text-accent-gold uppercase mb-1">Products</span>
                      <div className="flex flex-col gap-2">
                        {recentlyViewedProducts.filter(p =>
                          p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          p.category.toLowerCase().includes(searchQuery.toLowerCase())
                        ).slice(0, 3).map(prod => (
                          <Link key={prod.id} href="/products" onClick={closeSearch} className="flex items-center gap-3 group bg-cream border border-border/40 hover:border-accent-gold/30 p-2 transition-all rounded">
                            <div className="relative w-8 h-11 overflow-hidden flex-shrink-0 border border-border/20">
                              <Image src={prod.image} alt={prod.name} fill className="object-cover object-top" />
                            </div>
                            <div className="flex flex-col overflow-hidden">
                              <span className="text-[7px] text-accent-gold mb-0.5">{prod.category}</span>
                              <span className="font-display text-[10px] text-text-primary truncate">{prod.name}</span>
                              <span className="font-accent text-[9px] text-text-secondary mt-0.5">₹{prod.price.toLocaleString("en-IN")}</span>
                            </div>
                          </Link>
                        ))}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col gap-7">
                    <div>
                      <span className="text-[9px] tracking-[0.25em] text-accent-gold mb-3 block">Popular Searches</span>
                      <div className="flex flex-nowrap overflow-x-auto sm:flex-wrap gap-2.5 pb-1" style={{ scrollbarWidth: "none" }}>
                        {popularSearches.map(term => (
                          <Link
                            key={term}
                            href={`/products?search=${encodeURIComponent(term)}`}
                            onClick={closeSearch}
                            className="px-5 py-2.5 bg-cream hover:bg-accent-gold/15 border border-border-strong hover:border-accent-gold text-[10px] tracking-[0.2em] uppercase font-accent text-text-primary hover:text-accent-gold transition-all flex-shrink-0"
                          >
                            {term}
                          </Link>
                        ))}
                      </div>
                    </div>
                    <div>
                      <span className="text-[9px] tracking-[0.25em] text-accent-gold mb-3 block">Trending Collections</span>
                      <ul className="flex flex-col gap-3">
                        {trendingCollections.map(col => (
                          <li key={col.name}>
                            <Link href={col.href} onClick={closeSearch} className="font-display text-sm text-text-secondary hover:text-accent-gold transition-colors inline-flex items-center gap-2 group">
                              <span className="w-1.5 h-[1px] bg-accent-gold/40 group-hover:w-4 transition-all duration-300"></span>
                              {col.name}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )}
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
