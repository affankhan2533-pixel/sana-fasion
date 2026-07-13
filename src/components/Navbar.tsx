"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
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

  const drawerWrapperRef = useRef<HTMLDivElement>(null);
  const searchWrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Side Drawer navigation entry animations
  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = "hidden";
      gsap.registerPlugin(ScrollTrigger);

      const timer = setTimeout(() => {
        if (!drawerWrapperRef.current) return;

        const ctx = gsap.context(() => {
          const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

          gsap.set(".drawer-content", { xPercent: 100 });

          tl.fromTo(".drawer-overlay",
            { opacity: 0 },
            { opacity: 1, duration: 0.4 }
          );

          tl.fromTo(".drawer-content",
            { xPercent: 100 },
            { xPercent: 0, duration: 0.5 },
            "-=0.35"
          );

          const navItems = gsap.utils.toArray(".drawer-nav-item");
          if (navItems.length > 0) {
            tl.fromTo(navItems,
              { x: 30, opacity: 0 },
              { x: 0, opacity: 1, duration: 0.4, stagger: 0.08 },
              "-=0.25"
            );
          }

          const footerItems = gsap.utils.toArray(".drawer-footer-item");
          if (footerItems.length > 0) {
            tl.fromTo(footerItems,
              { y: 15, opacity: 0 },
              { y: 0, opacity: 1, duration: 0.5, stagger: 0.08 },
              "-=0.2"
            );
          }
        }, drawerWrapperRef);
      }, 50);

      return () => {
        clearTimeout(timer);
        document.body.style.overflow = "";
      };
    }
  }, [mobileOpen]);

  const handleCloseDrawer = () => {
    const footerItems = gsap.utils.toArray(".drawer-footer-item");
    const navItems = gsap.utils.toArray(".drawer-nav-item");

    const tl = gsap.timeline();

    if (footerItems.length > 0) {
      tl.to(footerItems, {
        y: 15,
        opacity: 0,
        duration: 0.25,
        stagger: 0.05,
        ease: "power2.in",
      });
    }

    if (navItems.length > 0) {
      tl.to(navItems, {
        x: 20,
        opacity: 0,
        duration: 0.25,
        stagger: 0.05,
        ease: "power2.in",
      }, footerItems.length > 0 ? "-=0.2" : 0);
    }

    tl.to(".drawer-content", {
      xPercent: 100,
      duration: 0.4,
      ease: "power3.in",
    }, "-=0.15");

    tl.to(".drawer-overlay", {
      opacity: 0,
      duration: 0.35,
      ease: "power2.in",
      onComplete: () => {
        setMobileOpen(false);
      }
    }, "-=0.3");
  };

  // Fullscreen search display animations
  useEffect(() => {
    if (searchOpen) {
      document.body.style.overflow = "hidden";
      gsap.registerPlugin(ScrollTrigger);

      setTimeout(() => {
        searchInputRef.current?.focus();
      }, 80);

      const timer = setTimeout(() => {
        if (!searchWrapperRef.current) return;

        const ctx = gsap.context(() => {
          const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

          tl.fromTo(searchWrapperRef.current,
            { opacity: 0 },
            { opacity: 1, duration: 0.4 }
          );

          tl.fromTo(".search-container",
            { y: -30, opacity: 0 },
            { y: 0, opacity: 1, duration: 0.6 },
            "-=0.25"
          );

          const animateItems = gsap.utils.toArray(".search-animate-item");
          if (animateItems.length > 0) {
            tl.fromTo(animateItems,
              { y: 15, opacity: 0 },
              { y: 0, opacity: 1, duration: 0.5, stagger: 0.08 },
              "-=0.3"
            );
          }
        }, searchWrapperRef);
      }, 50);

      return () => {
        clearTimeout(timer);
        document.body.style.overflow = "";
      };
    }
  }, [searchOpen]);

  const handleCloseSearch = () => {
    const containerExists = document.querySelector(".search-container");
    const backdropExists = document.querySelector(".search-backdrop");

    if (containerExists) {
      gsap.to(".search-container", {
        y: -20,
        opacity: 0,
        duration: 0.3,
        ease: "power2.in",
      });
    }

    if (backdropExists) {
      gsap.to(".search-backdrop", {
        opacity: 0,
        duration: 0.35,
        ease: "power2.in",
        onComplete: () => {
          setSearchOpen(false);
          setSearchQuery("");
          setSuggestions([]);
          setSelectedIndex(-1);
        }
      });
    } else {
      setSearchOpen(false);
      setSearchQuery("");
      setSuggestions([]);
      setSelectedIndex(-1);
    }
  };

  const handleSearchChange = (val: string) => {
    setSearchQuery(val);
    if (!val.trim()) {
      setSuggestions([]);
      setSelectedIndex(-1);
      return;
    }
    const filtered = searchSuggestionPool.filter(item =>
      item.toLowerCase().includes(val.toLowerCase())
    );
    setSuggestions(filtered);
    setSelectedIndex(-1);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      e.preventDefault();
      handleCloseSearch();
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      if (suggestions.length > 0) {
        setSelectedIndex(prev => (prev + 1) % suggestions.length);
      }
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      if (suggestions.length > 0) {
        setSelectedIndex(prev => (prev - 1 + suggestions.length) % suggestions.length);
      }
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (selectedIndex >= 0 && selectedIndex < suggestions.length) {
        const selected = suggestions[selectedIndex];
        window.location.href = `/products?search=${encodeURIComponent(selected)}`;
        handleCloseSearch();
      } else if (searchQuery.trim()) {
        window.location.href = `/products?search=${encodeURIComponent(searchQuery)}`;
        handleCloseSearch();
      }
    }
  };

  const togglePlay = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play().catch((err) => {
        console.warn("Audio play blocked until direct user interaction: ", err);
      });
    }
    setIsPlaying(!isPlaying);
  };

  return (
    <>
      <audio
        ref={audioRef}
        src="https://assets.mixkit.co/music/preview/mixkit-fashion-lounge-164.mp3"
        loop
        preload="auto"
      />

      <nav
        className="fixed top-0 left-0 right-0 z-[100] transition-all duration-[250ms] ease-[cubic-bezier(0.22,1,0.36,1)] flex items-center"
        style={{
          height: scrolled ? "68px" : "80px",
          background: (scrolled || isLightPage)
            ? "rgba(255, 251, 244, 0.94)"
            : "linear-gradient(to bottom, rgba(10,5,2,0.6) 0%, rgba(10,5,2,0.0) 100%)",
          backdropFilter: (scrolled || isLightPage) ? "blur(20px)" : "none",
          WebkitBackdropFilter: (scrolled || isLightPage) ? "blur(20px)" : "none",
          borderBottom: (scrolled || isLightPage) ? "1px solid rgba(200,133,26,0.18)" : "1px solid transparent",
        }}
      >
        <div className="mx-auto px-6 sm:px-12 flex items-center justify-between w-full max-w-[1400px]">
          <Link href="/" className="flex items-center">
            <div className="relative h-[50px] w-[138px] lg:h-[60px] lg:w-[165px] transition-all duration-[250ms] ease-[cubic-bezier(0.22,1,0.36,1)]">
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
                className="underline-grow font-accent tracking-[0.08em] uppercase transition-colors duration-[250ms] hover:opacity-85"
                style={{
                  color: (scrolled || isLightPage) ? "var(--text-primary)" : "#fff",
                  fontSize: "16px",
                  fontWeight: 500,
                  textShadow: (scrolled || isLightPage) ? "none" : "0 1px 3px rgba(0,0,0,0.35)",
                }}
              >
                {l.label}
              </Link>
            ))}
          </div>

          {/* Right Action Icons & Book Consult button */}
          <div className="flex items-center gap-6">
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
                    <span className="w-[2px] bg-[var(--gold)] h-[70%] animate-[pulse_0.8s_infinite_delay-100]"></span>
                    <span className="w-[2px] bg-[var(--gold)] h-[50%] animate-[pulse_1.3s_infinite_delay-200]"></span>
                    <span className="w-[2px] bg-[var(--gold)] h-[85%] animate-[pulse_0.9s_infinite_delay-300]"></span>
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
                className="font-accent text-[9.5px] tracking-[0.18em] uppercase hidden md:inline-block"
                style={{ color: (scrolled || isLightPage) ? "var(--text-muted)" : "rgba(255,220,140,0.9)" }}
              >
                Atelier Sound
              </span>
            </button>

            {/* Search Icon */}
            <button
              onClick={() => setSearchOpen(true)}
              className="transition-opacity hover:opacity-75 p-1 cursor-pointer"
              style={{ color: (scrolled || isLightPage) ? "var(--text-primary)" : "#fff" }}
              aria-label="Open Search"
            >
              <Search size={22} />
            </button>

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

            <Link href="/contact" className="hidden lg:block">
              <LuxuryButton variant="secondary" className="!h-[50px] !px-6 !rounded-[14px]">
                Book Appointment
              </LuxuryButton>
            </Link>

            {/* Drawer Hamburger */}
            <button
              onClick={() => setMobileOpen(true)}
              className="group flex flex-col items-end gap-[6px] p-2.5 relative z-50 cursor-pointer animate-fade-in"
              aria-label="Open luxury drawer"
            >
              <span 
                className="w-6 h-[2px] transition-all duration-[250ms] group-hover:w-4" 
                style={{ backgroundColor: (scrolled || isLightPage) ? "var(--text-primary)" : "var(--gold-light)" }}
              />
              <span 
                className="w-4 h-[2px] transition-all duration-[250ms] group-hover:w-6" 
                style={{ backgroundColor: (scrolled || isLightPage) ? "var(--text-primary)" : "var(--gold-light)" }}
              />
              <span 
                className="w-5 h-[2px] transition-all duration-[250ms] group-hover:w-3" 
                style={{ backgroundColor: (scrolled || isLightPage) ? "var(--text-primary)" : "var(--gold-light)" }}
              />
            </button>
          </div>
        </div>
      </nav>

      {/* Fullscreen Luxury Dedicated Search Overlay */}
      <AnimatePresence>
        {searchOpen && (
          <div 
            ref={searchWrapperRef}
            className="search-backdrop fixed inset-0 z-[9999] bg-[#F8F6F2] flex flex-col justify-start overflow-y-auto pt-24 sm:pt-32 pb-12 px-6 sm:px-12 lg:px-24 text-text-primary"
          >
            
            {/* Grain background overlay */}
            <div 
              className="absolute inset-0 opacity-[0.02] pointer-events-none"
              style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`
              }}
            />

            <div className="search-container max-w-[660px] w-full mx-auto flex flex-col gap-8 relative">
              {/* Header */}
              <div className="flex justify-between items-center w-full search-animate-item">
                <span className="font-accent text-[8.5px] tracking-[0.25em] text-text-muted uppercase">Atelier Search</span>
                <button
                  onClick={handleCloseSearch}
                  className="flex items-center gap-2 text-text-secondary hover:text-accent-gold font-accent text-[9.5px] tracking-[0.2em] uppercase transition-colors p-1 cursor-pointer"
                  aria-label="Close search overlay"
                >
                  Close <X size={14} className="inline" />
                </button>
              </div>

              {/* Input block */}
              <div className="relative flex items-center border-b border-border-strong focus-within:border-accent-gold transition-colors pb-4 search-animate-item">
                <Search size={22} className="text-accent-gold mr-4 flex-shrink-0" />
                <input
                  ref={searchInputRef}
                  type="text"
                  value={searchQuery}
                  onChange={e => handleSearchChange(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Search bridal, festive, suits…"
                  className="w-full bg-transparent font-display text-xl sm:text-2xl lg:text-3xl text-text-primary outline-none tracking-wide"
                  style={{ color: "var(--text-primary)" }}
                />
              </div>

              {/* Search Suggestions */}
              {searchQuery.trim().length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-5 gap-8 search-animate-item">
                  <div className="md:col-span-3 flex flex-col gap-3">
                    <span className="label block text-[8px] tracking-[0.25em] text-accent-gold uppercase mb-1">
                      Search Suggestions
                    </span>
                    <div role="listbox" className="flex flex-col bg-cream border border-border-strong p-2 max-h-[350px] overflow-y-auto">
                      {suggestions.length > 0 ? (
                        suggestions.map((sug, idx) => (
                          <Link
                            key={sug}
                            href={`/products?search=${encodeURIComponent(sug)}`}
                            onClick={handleCloseSearch}
                            className={`px-4 py-2.5 font-body text-xs transition-all duration-150 flex items-center justify-between rounded ${
                              idx === selectedIndex ? "bg-accent-gold/15 text-accent-gold-dark font-medium" : "text-text-secondary hover:bg-black/5 hover:text-text-primary"
                            }`}
                          >
                            <span>{sug}</span>
                            <ArrowRight size={12} className={idx === selectedIndex ? "translate-x-1 transition-transform text-accent-gold" : "opacity-30"} />
                          </Link>
                        ))
                      ) : (
                        <div className="px-4 py-6 text-center text-text-muted font-body text-xs">
                          No matching luxury pieces found.
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="md:col-span-2 flex flex-col gap-3">
                    <span className="label block text-[8px] tracking-[0.25em] text-accent-gold uppercase mb-1">
                      Matching Products
                    </span>
                    <div className="flex flex-col gap-3">
                      {recentlyViewedProducts.filter(p => 
                        p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                        p.category.toLowerCase().includes(searchQuery.toLowerCase())
                      ).slice(0, 3).map((prod) => (
                        <Link
                          key={prod.id}
                          href={`/products`}
                          onClick={handleCloseSearch}
                          className="flex items-center gap-3.5 group bg-cream border border-border/40 hover:border-accent-gold/30 p-2 transition-all duration-300 rounded animate-fade-in"
                        >
                          <div className="relative w-9 h-12 overflow-hidden flex-shrink-0 border border-border/20">
                            <Image
                              src={prod.image}
                              alt={prod.name}
                              fill
                              className="object-cover object-top transition-transform duration-700 group-hover:scale-105"
                            />
                          </div>
                          <div className="flex flex-col overflow-hidden">
                            <span className="label block text-[7px] text-accent-gold mb-0.5">{prod.category}</span>
                            <span className="font-display text-[11px] text-text-primary group-hover:text-accent-gold transition-colors truncate">{prod.name}</span>
                            <span className="font-accent text-[9px] text-text-secondary mt-0.5">₹{prod.price.toLocaleString("en-IN")}</span>
                          </div>
                        </Link>
                      ))}
                      {recentlyViewedProducts.filter(p => 
                        p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                        p.category.toLowerCase().includes(searchQuery.toLowerCase())
                      ).length === 0 && (
                        <div className="px-3 py-6 text-center text-text-muted/60 font-body text-[11px] border border-dashed border-border-strong rounded bg-[#FFFBF4] opacity-80">
                          No product matches.
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col gap-8">
                  <div className="search-animate-item">
                    <span className="label block text-[9.5px] tracking-[0.25em] text-accent-gold mb-4">
                      Popular Searches
                    </span>
                    <div className="flex flex-nowrap overflow-x-auto sm:flex-wrap gap-3.5 scrollbar-hide pb-2 sm:pb-0" style={{ scrollbarWidth: "none" }}>
                      {popularSearches.map((term) => (
                        <Link
                          key={term}
                          href={`/products?search=${encodeURIComponent(term)}`}
                          onClick={handleCloseSearch}
                          className="px-6 py-3 bg-cream hover:bg-accent-gold/15 border border-border-strong hover:border-accent-gold text-[10.5px] tracking-[0.2em] uppercase font-accent text-text-primary hover:text-accent-gold transition-all duration-500 flex-shrink-0 shadow-soft hover:-translate-y-[1px]"
                        >
                          {term}
                        </Link>
                      ))}
                    </div>
                  </div>

                  <div className="search-animate-item">
                    <span className="label block text-[9.5px] tracking-[0.25em] text-accent-gold mb-4">
                      Trending Collections
                    </span>
                    <ul className="flex flex-col gap-4">
                      {trendingCollections.map((col) => (
                        <li key={col.name}>
                          <Link
                            href={col.href}
                            onClick={handleCloseSearch}
                            className="font-display text-sm text-text-secondary hover:text-accent-gold transition-colors inline-flex items-center gap-2 group"
                          >
                            <span className="w-1.5 h-[1px] bg-accent-gold/40 group-hover:w-4 transition-all duration-300"></span>
                            {col.name}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </AnimatePresence>

      {/* Redesigned Premium Luxury Side Drawer Navigation */}
      <AnimatePresence>
        {mobileOpen && (
          <div ref={drawerWrapperRef} className="fixed inset-0 z-[9998] flex justify-end">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={handleCloseDrawer}
              className="drawer-overlay fixed inset-0 bg-black/50 backdrop-blur-sm"
              style={{ opacity: 0 }}
            />

            <div 
              className="drawer-content relative w-[85vw] max-w-[380px] md:w-[420px] md:max-w-none h-full bg-[#FFFBF4] shadow-lift flex flex-col z-10 overflow-y-auto translate-x-full border-l border-[#E6C280]/20"
            >
              <div 
                className="absolute inset-0 opacity-[0.02] pointer-events-none"
                style={{
                  backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`
                }}
              />

              {/* Logo & Close Button */}
              <div className="flex justify-between items-center px-8 py-6 border-b border-[#E6C280]/15 drawer-footer-item relative z-10">
                <Link href="/" onClick={handleCloseDrawer} className="flex items-center">
                  <div className="relative h-10 w-28 md:h-12 md:w-36">
                    <Image
                      src="/Logo/image.png?v=3"
                      alt="SANA Fashion House"
                      fill
                      className="object-contain object-left"
                      unoptimized
                    />
                  </div>
                </Link>
                <button
                  onClick={handleCloseDrawer}
                  className="w-10 h-10 rounded-full flex items-center justify-center border border-accent-gold/20 hover:border-accent-gold hover:rotate-90 transition-all duration-500 cursor-pointer"
                  style={{ color: "var(--text-primary)" }}
                  aria-label="Close menu drawer"
                >
                  <X size={16} />
                </button>
              </div>

              {/* Middle Section Navigation Links */}
              <nav className="flex flex-col gap-5 px-8 py-10 flex-grow relative z-10">
                {navLinks.map((l) => (
                  <Link
                    key={l.label}
                    href={l.href}
                    onClick={handleCloseDrawer}
                    className="drawer-nav-item font-serif text-2xl sm:text-3xl text-text-primary hover:text-accent-gold transition-colors duration-300 flex items-center justify-between group py-2 relative"
                    style={{ opacity: 0 }}
                  >
                    <span className="relative flex items-center transition-transform duration-300 group-hover:translate-x-3">
                      {l.label}
                      <span className="absolute bottom-0 left-0 w-0 h-[1px] bg-accent-gold group-hover:w-full transition-all duration-300" />
                    </span>
                    <ArrowRight 
                      size={18} 
                      className="opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all duration-500 text-accent-gold" 
                    />
                  </Link>
                ))}
              </nav>

              {/* Bottom Section */}
              <div className="px-8 py-8 border-t border-[#E6C280]/15 bg-cream-warm flex flex-col gap-6 mt-auto relative z-10">
                <Link href="/contact" onClick={handleCloseDrawer} className="w-full drawer-footer-item block" style={{ opacity: 0 }}>
                  <LuxuryButton variant="primary" className="w-full">
                    Book Appointment
                  </LuxuryButton>
                </Link>

                <div className="flex flex-col gap-3.5 pt-2 text-xs font-body text-text-secondary drawer-footer-item" style={{ opacity: 0 }}>
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
                    <Phone size={13} /> +91 90225 91620 (Atelier Whatsapp)
                  </a>

                  <div className="text-[11px] text-text-muted mt-2 leading-relaxed">
                    <span className="block text-[8px] font-accent tracking-wider text-accent-gold uppercase mb-1">Store Atelier Address</span>
                    Sana Fashion House, Heritage Boulevard, Mumbai, India
                  </div>

                  <p className="text-[10px] text-text-muted/60 mt-4 pt-4 border-t border-[#E6C280]/10">
                    © 2026 Sana Atelier. Crafted with intent, worn with pride.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
