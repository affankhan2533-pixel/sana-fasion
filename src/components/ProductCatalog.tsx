"use client";

import React, { useState, useMemo, useEffect, useRef, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Heart, MessageCircle, ArrowRight, X, ChevronLeft, ChevronRight, Eye, SlidersHorizontal, Check } from "lucide-react";
import { type Product } from "@/data/image_analyzer";
import { cartState } from "@/data/cart";

/* ─── Constants ───────────────────────────────────────── */
const FABRIC_OPTIONS  = ["All Fabrics","Raw Silk","Organza","Chiffon","Banarasi Silk","Velvet","Cotton","Rayon","Lawn Cotton","Georgette"];
const COLOR_OPTIONS   = ["All Colors","Crimson Red","Ivory White","Emerald Green","Gold","Midnight Blue","Peach Pink","Indigo Blue","Mustard Gold","Wine Purple"];
const PRICE_OPTIONS   = [{ label:"All Prices", value:"all" },{ label:"Under ₹20K", value:"under-20k" },{ label:"₹20K – ₹50K", value:"20k-50k" },{ label:"Over ₹50K", value:"over-50k" }];
const SORT_OPTIONS    = [{ label:"Newest", value:"newest" },{ label:"Price ↑", value:"price-asc" },{ label:"Price ↓", value:"price-desc" }];

interface Props { initialCategory?: string; products: Product[]; }

/* ─── Main Component ──────────────────────────────────── */
export default function ProductCatalog({ initialCategory = "All", products }: Props) {
  const searchParams = useSearchParams();

  /* state */
  const [activeCategory, setActiveCategory] = useState(initialCategory);
  const [query,          setQuery]           = useState("");
  const [wishlist,       setWishlist]        = useState<number[]>([]);
  const [hoverProduct,   setHoverProduct]    = useState<number | null>(null);
  const [quickView,      setQuickView]       = useState<Product | null>(null);
  const [filterOpen,     setFilterOpen]      = useState(false);
  const [isMobile,       setIsMobile]        = useState(false);

  /* filters */
  const [fabric,  setFabric]  = useState("All Fabrics");
  const [color,   setColor]   = useState("All Colors");
  const [price,   setPrice]   = useState("all");
  const [sort,    setSort]    = useState("newest");

  /* pagination — per category */
  const [pages, setPages] = useState<Record<string,number>>({});
  const [perPage, setPerPage] = useState(16);

  /* responsive per page + mobile detection */
  useEffect(() => {
    const fn = () => {
      setPerPage(window.innerWidth < 640 ? 8 : window.innerWidth < 1024 ? 12 : 16);
      setIsMobile(window.innerWidth < 768);
    };
    fn(); window.addEventListener("resize", fn);
    return () => window.removeEventListener("resize", fn);
  }, []);

  /* sync URL search */
  useEffect(() => {
    const v = searchParams.get("search"); if (v) setQuery(v);
  }, [searchParams]);

  /* sync initialCategory prop */
  useEffect(() => { setActiveCategory(initialCategory); }, [initialCategory]);

  /* wishlist persistence */
  useEffect(() => {
    const s = localStorage.getItem("sana_wishlist");
    if (s) try { setWishlist(JSON.parse(s)); } catch {}
  }, []);

  const toggleWishlist = useCallback((id: number) => {
    setWishlist(prev => {
      const next = prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id];
      localStorage.setItem("sana_wishlist", JSON.stringify(next));
      return next;
    });
  }, []);

  /* page helpers */
  const curPage = pages[activeCategory] || 1;
  const goPage  = (p: number) => {
    setPages(prev => ({ ...prev, [activeCategory]: p }));
    document.getElementById("catalog-grid")?.scrollIntoView({ behavior:"smooth", block:"start" });
  };
  const resetPages = () => setPages({});

  /* derived: categories that actually have products */
  const availableCategories = useMemo(() => {
    const cats = new Set<string>();
    products.forEach(p => { if (p.category) cats.add(p.category); });
    return ["All", ...Array.from(cats)];
  }, [products]);

  /* derived: filtered + sorted list */
  const filtered = useMemo(() => {
    let list = activeCategory === "All" ? products : products.filter(p => p.category === activeCategory);

    if (query.trim()) {
      const q = query.toLowerCase();
      list = list.filter(p =>
        p.title.toLowerCase().includes(q) ||
        p.productCode.toLowerCase().includes(q) ||
        p.fabric.toLowerCase().includes(q) ||
        p.color.toLowerCase().includes(q)
      );
    }

    if (fabric !== "All Fabrics") list = list.filter(p => p.fabric === fabric);
    if (color  !== "All Colors")  list = list.filter(p => p.color === color);
    if (price === "under-20k") list = list.filter(p => p.price < 20000);
    if (price === "20k-50k")   list = list.filter(p => p.price >= 20000 && p.price <= 50000);
    if (price === "over-50k")  list = list.filter(p => p.price > 50000);

    if (sort === "price-asc")  return [...list].sort((a,b) => a.price - b.price);
    if (sort === "price-desc") return [...list].sort((a,b) => b.price - a.price);
    return [...list].sort((a,b) => b.id - a.id);
  }, [activeCategory, products, query, fabric, color, price, sort]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / perPage));
  const paginated  = filtered.slice((curPage-1)*perPage, curPage*perPage);

  const anyFilter = fabric !== "All Fabrics" || color !== "All Colors" || price !== "all" || query.trim();
  const clearAll  = () => { setFabric("All Fabrics"); setColor("All Colors"); setPrice("all"); setSort("newest"); setQuery(""); resetPages(); };

  /* close desktop filter dropdown on outside click */
  const filterRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (isMobile) return; // mobile uses bottom-sheet with overlay
    const fn = (e: MouseEvent) => { if (filterRef.current && !filterRef.current.contains(e.target as Node)) setFilterOpen(false); };
    if (filterOpen) document.addEventListener("mousedown", fn);
    return () => document.removeEventListener("mousedown", fn);
  }, [filterOpen, isMobile]);

  /* lock body scroll when mobile filter sheet is open */
  useEffect(() => {
    if (isMobile && filterOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [isMobile, filterOpen]);

  /* ─── RENDER ─────────────────────────────────────────── */
  return (
    <>
      {/* GLOBAL PAGE WRAPPER */}
      <div className="min-h-screen" style={{ background:"#FAFAF7", color:"#1A0F0A" }}>

        {/* ═══════════════════════════════════════════════
            SECTION 1 — COMPACT LUXURY HERO
        ═══════════════════════════════════════════════ */}
        <section className="catalog-hero">
          <div style={{ maxWidth:"1400px", margin:"0 auto", padding:"0 16px", textAlign:"center" }}>
            {/* Breadcrumb */}
            <p style={{ fontFamily:"'Josefin Sans', sans-serif", fontSize:"11px", letterSpacing:"0.18em", textTransform:"uppercase", color:"#9A8070", marginBottom:"8px", fontWeight:400 }}>
              Home &nbsp;/&nbsp; Products
            </p>

            {/* Title */}
            <h1 className="catalog-hero-title">
              The Collection
            </h1>

            {/* One line */}
            <p className="catalog-hero-sub">
              Artisanal Indian couture, crafted for modern luxury.
            </p>

            {/* Count */}
            <span style={{ fontFamily:"'Josefin Sans', sans-serif", fontSize:"11px", letterSpacing:"0.15em", textTransform:"uppercase", color:"#C8851A", fontWeight:600 }}>
              {filtered.length} Pieces
            </span>
          </div>
        </section>

        {/* ═══════════════════════════════════════════════
            SECTION 2 — SEARCH BAR
        ═══════════════════════════════════════════════ */}
        <div className="catalog-search-wrap">
          <div style={{ maxWidth:"600px", margin:"0 auto", position:"relative" }}>
            <div style={{ position:"absolute", left:"16px", top:"50%", transform:"translateY(-50%)", color:"#9A8070", pointerEvents:"none" }}>
              <Search size={16} />
            </div>
            <input
              type="text"
              placeholder="Search by name, fabric, colour…"
              value={query}
              onChange={e => { setQuery(e.target.value); resetPages(); }}
              className="catalog-search-input"
              onFocus={e => { e.currentTarget.style.borderColor = "#C8851A"; }}
              onBlur={e  => { e.currentTarget.style.borderColor = "#E0D8CC"; }}
            />
            {query && (
              <button
                onClick={() => { setQuery(""); resetPages(); }}
                style={{ position:"absolute", right:"14px", top:"50%", transform:"translateY(-50%)", background:"none", border:"none", cursor:"pointer", color:"#9A8070", display:"flex", alignItems:"center", minWidth:"44px", minHeight:"44px", justifyContent:"center" }}
              >
                <X size={15} />
              </button>
            )}
          </div>
        </div>

        {/* ═══════════════════════════════════════════════
            SECTION 3 — STICKY CATEGORY TABS
        ═══════════════════════════════════════════════ */}
        <div className="catalog-filter-bar">
          <div style={{ maxWidth:"1400px", margin:"0 auto", padding:"0 16px" }}>
            {/* Tab Strip + Filter Trigger in same row */}
            <div className="catalog-chip-row">
              {availableCategories.map(cat => {
                const active = cat === activeCategory;
                return (
                  <button
                    key={cat}
                    onClick={() => { setActiveCategory(cat); resetPages(); }}
                    className={`catalog-chip ${active ? "catalog-chip-active" : ""}`}
                    onMouseEnter={e => { if (!active) { e.currentTarget.style.borderColor = "#C8851A"; e.currentTarget.style.color = "#C8851A"; }}}
                    onMouseLeave={e => { if (!active) { e.currentTarget.style.borderColor = "#E0D8CC"; e.currentTarget.style.color = "#3A2018"; }}}
                  >
                    {cat}
                  </button>
                );
              })}

              {/* Filter Trigger */}
              <div ref={filterRef} style={{ position:"relative", flexShrink:0, marginLeft:"auto" }}>
                <button
                  onClick={() => setFilterOpen(o => !o)}
                  className={`catalog-filter-btn ${(filterOpen || anyFilter) ? "catalog-filter-btn-active" : ""}`}
                >
                  <SlidersHorizontal size={13} />
                  Filters {anyFilter ? "•" : ""}
                </button>

                {/* ── DESKTOP FILTER DROPDOWN (hidden on mobile) ── */}
                {!isMobile && (
                  <AnimatePresence>
                    {filterOpen && (
                      <motion.div
                        initial={{ opacity:0, y:8, scale:0.97 }}
                        animate={{ opacity:1, y:0, scale:1 }}
                        exit={{ opacity:0, y:8, scale:0.97 }}
                        transition={{ duration:0.18, ease:"easeOut" }}
                        style={{
                          position:"absolute", top:"calc(100% + 10px)", right:0,
                          background:"#FFFFFF", border:"1.5px solid #E0D8CC",
                          borderRadius:"20px", padding:"24px", minWidth:"320px",
                          zIndex:100, boxShadow:"0 24px 60px rgba(26,15,10,0.14)"
                        }}
                      >
                        <FilterSheet
                          sort={sort} setSort={v => { setSort(v); resetPages(); }}
                          fabric={fabric} setFabric={v => { setFabric(v); resetPages(); }}
                          color={color} setColor={v => { setColor(v); resetPages(); }}
                          price={price} setPrice={v => { setPrice(v); resetPages(); }}
                          anyFilter={!!anyFilter}
                          onClear={() => { clearAll(); setFilterOpen(false); }}
                          onClose={() => setFilterOpen(false)}
                        />
                      </motion.div>
                    )}
                  </AnimatePresence>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* ── MOBILE BOTTOM SHEET FILTER ── */}
        <AnimatePresence>
          {isMobile && filterOpen && (
            <>
              {/* Backdrop */}
              <motion.div
                initial={{ opacity:0 }}
                animate={{ opacity:1 }}
                exit={{ opacity:0 }}
                onClick={() => setFilterOpen(false)}
                style={{ position:"fixed", inset:0, background:"rgba(26,15,10,0.6)", zIndex:9000, backdropFilter:"blur(4px)" }}
              />
              {/* Sheet */}
              <motion.div
                initial={{ y:"100%" }}
                animate={{ y:0 }}
                exit={{ y:"100%" }}
                transition={{ type:"spring", damping:30, stiffness:300 }}
                style={{
                  position:"fixed", bottom:0, left:0, right:0,
                  background:"#FAFAF7", borderRadius:"24px 24px 0 0",
                  zIndex:9001, maxHeight:"85svh", overflowY:"auto",
                  padding:"0 0 40px", boxShadow:"0 -20px 60px rgba(26,15,10,0.18)"
                }}
              >
                {/* Handle */}
                <div style={{ display:"flex", justifyContent:"center", padding:"12px 0 8px" }}>
                  <div style={{ width:"36px", height:"4px", borderRadius:"2px", background:"#D0C8BC" }} />
                </div>
                {/* Header */}
                <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", padding:"12px 20px 20px", borderBottom:"1px solid #E8E0D0" }}>
                  <span style={{ fontFamily:"'Josefin Sans', sans-serif", fontSize:"13px", letterSpacing:"0.15em", textTransform:"uppercase", fontWeight:700, color:"#1A0F0A" }}>Filter &amp; Sort</span>
                  <button onClick={() => setFilterOpen(false)} style={{ width:"36px", height:"36px", borderRadius:"50%", border:"1px solid #E0D8CC", background:"#FFFFFF", display:"flex", alignItems:"center", justifyContent:"center", cursor:"pointer" }}>
                    <X size={14} />
                  </button>
                </div>
                {/* Content */}
                <div style={{ padding:"20px" }}>
                  <FilterSheet
                    sort={sort} setSort={v => { setSort(v); resetPages(); }}
                    fabric={fabric} setFabric={v => { setFabric(v); resetPages(); }}
                    color={color} setColor={v => { setColor(v); resetPages(); }}
                    price={price} setPrice={v => { setPrice(v); resetPages(); }}
                    anyFilter={!!anyFilter}
                    onClear={() => { clearAll(); }}
                    onClose={() => setFilterOpen(false)}
                    showApply
                  />
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>

        {/* ═══════════════════════════════════════════════
            SECTION 4 — PRODUCT GRID
        ═══════════════════════════════════════════════ */}
        <main id="catalog-grid" className="catalog-grid-outer">
          <AnimatePresence mode="wait">
            {paginated.length > 0 ? (
              <motion.div
                key={`${activeCategory}-${curPage}-${query}-${fabric}-${color}-${price}-${sort}`}
                initial={{ opacity:0, y:10 }}
                animate={{ opacity:1, y:0 }}
                exit={{ opacity:0 }}
                transition={{ duration:0.3 }}
              >
                <div className="catalog-products-grid sm-grid-2 md-grid-3 lg-grid-4">
                  {paginated.map((p, idx) => (
                    <ProductCard
                      key={p.id}
                      product={p}
                      priority={idx < 4}
                      wishlisted={wishlist.includes(p.id)}
                      onWishlist={() => toggleWishlist(p.id)}
                      onQuickView={() => setQuickView(p)}
                    />
                  ))}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <Pagination current={curPage} total={totalPages} onPageChange={goPage} />
                )}
              </motion.div>
            ) : (
              <motion.div
                key="empty"
                initial={{ opacity:0 }}
                animate={{ opacity:1 }}
                style={{ textAlign:"center", padding:"80px 24px" }}
              >
                <div style={{ fontSize:"48px", marginBottom:"16px" }}>🪡</div>
                <h3 style={{ fontFamily:"'Cormorant Garamond', serif", fontSize:"28px", fontWeight:300, color:"#1A0F0A", marginBottom:"8px" }}>No pieces found</h3>
                <p style={{ fontFamily:"'DM Sans', sans-serif", fontSize:"14px", color:"#9A8070", marginBottom:"24px" }}>Try a different category or clear your filters.</p>
                {anyFilter && (
                  <button
                    onClick={clearAll}
                    style={{ height:"48px", padding:"0 32px", borderRadius:"999px", background:"#1A0F0A", color:"#FFFFFF", fontFamily:"'Josefin Sans', sans-serif", fontSize:"11px", letterSpacing:"0.15em", textTransform:"uppercase", fontWeight:700, border:"none", cursor:"pointer" }}
                  >
                    Clear Filters
                  </button>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </main>
      </div>

      {/* QUICK VIEW MODAL */}
      <AnimatePresence>
        {quickView && (
          <div style={{ position:"fixed", inset:0, zIndex:9999, display:"flex", alignItems:"center", justifyContent:"center", padding:"16px" }}>
            <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }}
              onClick={() => setQuickView(null)}
              style={{ position:"absolute", inset:0, background:"rgba(26,15,10,0.7)", backdropFilter:"blur(6px)" }}
            />
            <motion.div
              initial={{ opacity:0, scale:0.94, y:20 }}
              animate={{ opacity:1, scale:1, y:0 }}
              exit={{ opacity:0, scale:0.94, y:20 }}
              transition={{ duration:0.3, ease:[0.16,1,0.3,1] }}
              className="qv-modal-wrapper"
            >
              {/* Close */}
              <button onClick={() => setQuickView(null)} className="qv-modal-close-btn">
                <X size={15} />
              </button>

              <div className="qv-modal-inner">
                {/* Image */}
                <div className="qv-modal-image-wrap">
                  <Image src={quickView.thumbnail} alt={quickView.title} fill className="object-cover object-top" sizes="(max-width: 767px) 100vw, 45vw" />
                </div>

                {/* Details */}
                <div className="qv-modal-details-wrap">
                  <span className="qv-modal-code" style={{ fontFamily:"'Josefin Sans', sans-serif", fontSize:"11px", letterSpacing:"0.15em", textTransform:"uppercase", color:"#C8851A", fontWeight:700 }}>
                    {quickView.productCode}
                  </span>
                  <h2 className="qv-modal-title" style={{ fontFamily:"'Cormorant Garamond', serif", fontSize:"clamp(22px, 3vw, 30px)", fontWeight:300, color:"#1A0F0A", margin:"8px 0 4px", lineHeight:1.2 }}>
                    {quickView.title}
                  </h2>
                  <p className="qv-modal-category" style={{ fontFamily:"'Josefin Sans', sans-serif", fontSize:"11px", letterSpacing:"0.12em", textTransform:"uppercase", color:"#9A8070", marginBottom:"20px" }}>
                    {quickView.category}
                  </p>

                  <div className="qv-modal-specs" style={{ borderTop:"1px solid #E8E0D0", borderBottom:"1px solid #E8E0D0", padding:"16px 0", marginBottom:"20px", display:"grid", gridTemplateColumns:"1fr 1fr", gap:"12px" }}>
                    <DetailRow label="Fabric" value={quickView.fabric} />
                    <DetailRow label="Colour" value={quickView.color} />
                    <DetailRow label="Collection" value={quickView.collection} />
                    <DetailRow label="Availability" value={quickView.availability ? "In Stock" : "Coming Soon"} />
                  </div>

                  <p className="qv-modal-price" style={{ fontFamily:"'Cormorant Garamond', serif", fontSize:"clamp(24px, 3vw, 32px)", fontWeight:400, color:"#1A0F0A", marginBottom:"24px" }}>
                    ₹{quickView.price.toLocaleString("en-IN")}
                  </p>

                  <div className="qv-modal-btns">
                    <button
                      onClick={() => {
                        cartState.add({
                          id: quickView.id,
                          title: quickView.title,
                          price: quickView.price,
                          thumbnail: quickView.thumbnail,
                          productCode: quickView.productCode
                        });
                        setQuickView(null);
                      }}
                      className="qv-btn-add-to-bag"
                      style={{ height:"52px", borderRadius:"12px", background:"#C8851A", color:"#FFFFFF", fontFamily:"'Josefin Sans', sans-serif", fontSize:"12px", letterSpacing:"0.15em", textTransform:"uppercase", fontWeight:700, display:"flex", alignItems:"center", justifyContent:"center", gap:"8px", cursor:"pointer", border:"none" }}
                    >
                      Add to Bag
                    </button>
                    <Link href={`/products/${quickView.slug}`}
                      className="qv-btn-primary"
                      style={{ height:"52px", borderRadius:"12px", background:"#1A0F0A", color:"#FFFFFF", fontFamily:"'Josefin Sans', sans-serif", fontSize:"12px", letterSpacing:"0.15em", textTransform:"uppercase", fontWeight:700, display:"flex", alignItems:"center", justifyContent:"center", gap:"8px", textDecoration:"none", transition:"background 0.25s" }}
                      onClick={() => setQuickView(null)}
                    >
                      View Full Details <ArrowRight size={14} />
                    </Link>
                    <a href={`https://wa.me/919022591620?text=Hi! I want to enquire about "${quickView.title}" (${quickView.productCode}).`}
                      target="_blank" rel="noopener noreferrer"
                      className="qv-btn-wa"
                      style={{ height:"52px", borderRadius:"12px", background:"#1B5E35", color:"#FFFFFF", fontFamily:"'Josefin Sans', sans-serif", fontSize:"12px", letterSpacing:"0.15em", textTransform:"uppercase", fontWeight:700, display:"flex", alignItems:"center", justifyContent:"center", gap:"8px", textDecoration:"none" }}
                    >
                      <MessageCircle size={14} /> WhatsApp Enquiry
                    </a>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ══ ALL RESPONSIVE STYLES ══ */}
      <style>{`
        /* ─ Hero ─ */
        .catalog-hero {
          padding-top: 80px;
          padding-bottom: 20px;
          background: linear-gradient(180deg,#F5F0E8 0%,#FAFAF7 100%);
          border-bottom: 1px solid #E8E0D0;
        }
        .catalog-hero-title {
          font-family: 'Cormorant Garamond', Georgia, serif;
          font-weight: 300;
          font-size: clamp(28px, 7vw, 64px);
          line-height: 1.05;
          letter-spacing: -0.02em;
          color: #1A0F0A;
          margin-bottom: 8px;
        }
        .catalog-hero-sub {
          font-family: 'DM Sans', sans-serif;
          font-size: 14px;
          color: #7A6458;
          font-weight: 300;
          margin-bottom: 12px;
          letter-spacing: 0.01em;
          line-height: 1.5;
        }
        @media(min-width:768px) {
          .catalog-hero { padding-top: 120px; padding-bottom: 40px; }
          .catalog-hero-title { font-size: clamp(36px,6vw,64px); margin-bottom: 12px; }
          .catalog-hero-sub { font-size: clamp(13px,1.8vw,16px); margin-bottom: 20px; }
        }

        /* ─ Search ─ */
        .catalog-search-wrap {
          background: #FAFAF7;
          padding: 16px 16px 0;
          position: sticky;
          top: 0;
          z-index: 50;
        }
        .catalog-search-input {
          width: 100%;
          height: 52px;
          padding-left: 44px;
          padding-right: 44px;
          border-radius: 16px;
          border: 1.5px solid #E0D8CC;
          background: #FFFFFF;
          font-family: 'DM Sans', sans-serif;
          font-size: 14px;
          color: #1A0F0A;
          outline: none;
          transition: all 250ms cubic-bezier(0.22, 1, 0.36, 1);
          box-sizing: border-box;
        }
        .catalog-search-input:focus {
          border-color: #C8851A;
          box-shadow: 0 0 0 4px rgba(200, 133, 26, 0.15);
        }
        @media(min-width:768px) {
          .catalog-search-wrap { padding: 32px 24px 0; position: static; }
        }

        /* ─ Filter Bar ─ */
        .catalog-filter-bar {
          position: sticky;
          top: 69px;
          z-index: 40;
          background: rgba(250,250,247,0.97);
          backdrop-filter: blur(16px);
          -webkit-backdrop-filter: blur(16px);
          border-bottom: 1px solid #E8E0D0;
          padding: 12px 0;
        }
        @media(min-width:768px) {
          .catalog-filter-bar { top: 72px; padding: 16px 0; }
        }

        /* ─ Chip Row ─ */
        .catalog-chip-row {
          display: flex;
          gap: 8px;
          overflow-x: auto;
          scroll-snap-type: x mandatory;
          -webkit-overflow-scrolling: touch;
          scrollbar-width: none;
        }
        .catalog-chip-row::-webkit-scrollbar { display: none; }

        /* ─ Individual Chip ─ */
        .catalog-chip {
          flex-shrink: 0;
          scroll-snap-align: start;
          height: 46px;
          padding: 0 18px;
          border-radius: 999px;
          border: 1.5px solid #E0D8CC;
          background: #FFFFFF;
          color: #3A2018;
          font-family: 'Josefin Sans', sans-serif;
          font-size: 11px;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          font-weight: 500;
          cursor: pointer;
          white-space: nowrap;
          transition: all 0.2s ease;
        }
        .catalog-chip-active {
          border-color: #C8851A !important;
          background: #C8851A !important;
          color: #FFFFFF !important;
          font-weight: 700 !important;
        }

        /* ─ Filter button ─ */
        .catalog-filter-btn {
          height: 46px;
          padding: 0 18px;
          border-radius: 999px;
          border: 1.5px solid #E0D8CC;
          background: #FFFFFF;
          color: #3A2018;
          font-family: 'Josefin Sans', sans-serif;
          font-size: 11px;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          font-weight: 600;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 8px;
          white-space: nowrap;
          transition: all 0.2s ease;
        }
        .catalog-filter-btn-active {
          border-color: #C8851A !important;
          background: #FFF8F0 !important;
          color: #C8851A !important;
        }

        /* ─ Grid outer ─ */
        .catalog-grid-outer {
          max-width: 1400px;
          margin: 0 auto;
          padding: 24px 16px 80px;
        }
        @media(min-width:768px) {
          .catalog-grid-outer { padding: 40px 24px 120px; }
        }

        /* ─ Grid columns ─ */
        .catalog-products-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 12px;
        }
        @media(min-width:640px)  { .sm-grid-2 { grid-template-columns:repeat(2,1fr) !important; gap:20px !important; } }
        @media(min-width:900px)  { .md-grid-3 { grid-template-columns:repeat(3,1fr) !important; gap:24px !important; } }
        @media(min-width:1200px) { .lg-grid-4 { grid-template-columns:repeat(4,1fr) !important; gap:28px !important; } }

        /* ─ Card buttons ─ */
        .card-btn-row {
          display: flex;
          flex-direction: row;
          gap: 6px;
        }

        .card-btn-primary {
          flex: 1;
          height: 40px;
          border-radius: 6px;
          background: #1A0F0A;
          color: #FFFFFF;
          font-family: 'Josefin Sans', sans-serif;
          font-size: 9px;
          letter-spacing: 0.05em;
          text-transform: uppercase;
          font-weight: 700;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 5px;
          text-decoration: none;
          transition: all 0.25s cubic-bezier(0.22, 1, 0.36, 1);
          white-space: nowrap;
          flex-shrink: 0;
          overflow: hidden;
        }
        @media(min-width:600px) {
          .card-btn-primary { height: 40px; font-size: 10px; letter-spacing: 0.1em; border-radius: 10px; }
        }
        .card-btn-primary:hover {
          background: #C8851A;
          box-shadow: 0 4px 12px rgba(200, 133, 26, 0.25);
          transform: translateY(-1px);
        }

        .card-btn-wa {
          width: 40px;
          height: 40px;
          border-radius: 6px;
          background: #1B5E35;
          color: #FFFFFF;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
          text-decoration: none;
          transition: all 0.25s cubic-bezier(0.22, 1, 0.36, 1);
          flex-shrink: 0;
          font-family: 'Josefin Sans', sans-serif;
          font-size: 9px;
          letter-spacing: 0.05em;
          text-transform: uppercase;
          font-weight: 700;
          white-space: nowrap;
        }
        @media(min-width:600px) {
          .card-btn-wa { width: 40px; height: 40px; border-radius: 10px; }
        }
        .card-btn-wa:hover {
          background: #123C21;
          box-shadow: 0 4px 12px rgba(27, 94, 53, 0.25);
          transform: translateY(-1px);
        }
        .card-btn-wa-text { display: none; }

        /* ─ Card metadata ─ */
        .card-meta { padding: 10px 10px 12px; }
        @media(min-width:600px) { .card-meta { padding: 16px 16px 18px; } }

        /* ─ Card name font ─ */
        .card-name {
          font-family: 'Cormorant Garamond', serif;
          font-size: 13px;
          font-weight: 500;
          color: #1A0F0A;
          line-height: 1.2;
          margin-bottom: 4px;
          overflow: hidden;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
        }
        @media(min-width:600px) { .card-name { font-size: clamp(16px,2vw,20px); font-weight: 400; line-height: 1.25; margin-bottom: 5px; } }

        /* ─ Price ─ */
        .card-price {
          font-family: 'Cormorant Garamond', serif;
          font-size: 14px;
          font-weight: 500;
          color: #1A0F0A;
          margin-bottom: 10px;
          white-space: nowrap;
        }
        @media(min-width:600px) { .card-price { font-size: clamp(18px,2.2vw,22px); margin-bottom: 12px; } }

        .card-original-price {
          font-family: 'DM Sans', sans-serif;
          font-size: 10px;
          color: #B0A090;
          font-weight: 300;
          margin-left: 6px;
          text-decoration: line-through;
        }
        @media(min-width:600px) {
          .card-original-price { font-size: 12px; margin-left: 8px; }
        }

        /* Scrollbar */
        *::-webkit-scrollbar { display:none; }
        * { scrollbar-width:none; }

        /* ─── Quick View Modal Mobile Responsiveness ─── */
        .qv-modal-wrapper {
          position: relative;
          width: 100%;
          max-width: 860px;
          background: #FAFAF7;
          border-radius: 24px;
          overflow: hidden;
          display: flex;
          flex-direction: column;
          max-height: 90vh;
          border: 1px solid #E0D8CC;
          box-shadow: 0 40px 100px rgba(26,15,10,0.22);
        }
        
        .qv-modal-inner {
          display: flex;
          flex-direction: row;
          flex: 1;
          overflow: hidden;
        }

        .qv-modal-image-wrap {
          flex: 0 0 45%;
          position: relative;
          background: #F5EFE6;
        }

        .qv-modal-details-wrap {
          flex: 1;
          overflow-y: auto;
          padding: 40px 32px;
          display: flex;
          flex-direction: column;
        }

        .qv-modal-close-btn {
          position: absolute;
          top: 16px;
          right: 16px;
          width: 36px;
          height: 36px;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.9);
          border: 1px solid #E0D8CC;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 50;
          color: #1A0F0A;
          transition: all 0.2s ease;
        }

        @media (max-width: 767px) {
          .qv-modal-wrapper {
            width: 93vw !important;
            max-width: 93vw !important;
            max-height: 90vh !important;
            border-radius: 16px !important;
            display: flex !important;
            flex-direction: column !important;
          }

          .qv-modal-inner {
            flex-direction: column !important;
            overflow-y: auto !important;
            flex: 1 !important;
          }

          .qv-modal-image-wrap {
            width: 100% !important;
            aspect-ratio: 4/5 !important;
            flex: none !important;
            height: auto !important;
          }

          .qv-modal-details-wrap {
            padding: 20px !important;
            flex: none !important;
            overflow: visible !important;
          }

          .qv-modal-close-btn {
            position: absolute !important;
            top: 16px !important;
            right: 16px !important;
            box-shadow: 0 2px 8px rgba(0,0,0,0.15) !important;
          }

          /* Ordering layout: Title -> Price -> Specs -> Buttons */
          .qv-modal-code { order: 1 !important; margin-bottom: 2px !important; font-size: 13px !important; }
          .qv-modal-title { order: 2 !important; margin: 4px 0 2px !important; font-size: 30px !important; line-height: 1.15 !important; }
          .qv-modal-category { order: 3 !important; margin-bottom: 16px !important; font-size: 13px !important; }
          
          .qv-modal-price { 
            order: 4 !important; 
            margin-bottom: 20px !important; 
            font-size: 36px !important; 
            line-height: 1.1 !important;
          }
          
          .qv-modal-specs { 
            order: 5 !important; 
            margin-bottom: 24px !important; 
            padding: 16px 0 !important;
            gap: 16px !important;
          }
          
          .qv-modal-btns { 
            order: 6 !important; 
            gap: 12px !important;
          }

          .qv-btn-primary {
            height: 48px !important;
            font-size: 12px !important;
            border-radius: 10px !important;
          }

          .qv-btn-wa {
            height: 48px !important;
            font-size: 12px !important;
            border-radius: 10px !important;
          }

          .qv-detail-label {
            font-size: 13px !important;
            margin-bottom: 4px !important;
          }

          .qv-detail-value {
            font-size: 15px !important;
          }
        }

        /* ─── Premium Luxury Pagination ─── */
        .pagination-container {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          margin-top: 64px;
          padding-top: 40px;
          border-top: 1px solid #E8E0D0;
          width: 100%;
        }

        .pagination-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 42px;
          height: 42px;
          border-radius: 12px;
          font-family: 'Josefin Sans', sans-serif;
          font-size: 13px;
          font-weight: 600;
          letter-spacing: 0.02em;
          cursor: pointer;
          transition: all 300ms cubic-bezier(0.22, 1, 0.36, 1);
          border: 1px solid #E0D8CC;
          background: #FFFFFF;
          color: #1A0F0A;
          user-select: none;
          outline: none;
        }

        @media (min-width: 768px) {
          .pagination-btn {
            width: 48px;
            height: 48px;
            font-size: 14px;
          }
        }

        .pagination-btn:hover:not(:disabled) {
          border-color: #1A0F0A;
          background: #FAFAF7;
          transform: translateY(-1px);
        }

        .pagination-btn-active {
          background: #1A0F0A !important;
          border-color: #1A0F0A !important;
          color: #FFFFFF !important;
          box-shadow: 0 8px 20px rgba(26, 15, 10, 0.15);
          transform: scale(1.05) !important;
          cursor: default;
        }

        .pagination-btn:disabled {
          opacity: 0.4;
          cursor: not-allowed;
          transform: none !important;
          box-shadow: none !important;
        }

        .pagination-dots {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 42px;
          height: 42px;
          color: #9A8070;
          font-family: 'Josefin Sans', sans-serif;
          font-size: 14px;
          font-weight: 500;
          user-select: none;
        }

        @media (min-width: 768px) {
          .pagination-dots {
            width: 48px;
            height: 48px;
            font-size: 16px;
          }
        }
      `}</style>
    </>
  );
}

/* ─── Product Card ─────────────────────────────────────── */
interface CardProps {
  product: Product;
  priority: boolean;
  wishlisted: boolean;
  onWishlist: () => void;
  onQuickView: () => void;
}

function ProductCard({ product: p, priority, wishlisted, onWishlist, onQuickView }: CardProps) {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background:"#FFFBF7",
        borderRadius:"2px",
        border:"1px solid rgba(200, 133, 26, 0.15)",
        overflow:"hidden",
        display:"flex",
        flexDirection:"column",
        transition:"box-shadow 250ms cubic-bezier(0.22,1,0.36,1), transform 250ms cubic-bezier(0.22,1,0.36,1)",
        boxShadow: hovered ? "var(--shadow-lift)" : "var(--shadow-card)",
        transform: hovered ? "translateY(-4px)" : "translateY(0)"
      }}
    >
      {/* ── Image ── */}
      <Link href={`/products/${p.slug}`} style={{ display:"block", position:"relative", aspectRatio:"3/4", overflow:"hidden", background:"#F5EFE6", borderRadius:"2px 2px 0 0", flexShrink:0 }}>
        <Image
          src={p.thumbnail}
          alt={p.title}
          fill
          priority={priority}
          sizes="(max-width:640px) 50vw, (max-width:900px) 33vw, 25vw"
          style={{ objectFit:"cover", objectPosition:"top", transition:"transform 0.5s ease", transform: hovered ? "scale(1.05)" : "scale(1)" }}
        />

        {/* Badges */}
        <div style={{ position:"absolute", top:"12px", left:"12px", display:"flex", flexDirection:"column", gap:"4px", zIndex:2 }}>
          {p.newArrival  && <Badge label="New"          bg="#C8851A" />}
          {p.bestSeller  && <Badge label="Bestseller"   bg="#1A0F0A" />}
          {p.comingSoon  && <Badge label="Coming Soon"  bg="#7A6458" />}
        </div>
      </Link>

      {/* Wishlist */}
      <button
        onClick={e => { e.preventDefault(); e.stopPropagation(); onWishlist(); }}
        style={{
          position:"absolute", top:"12px", right:"12px", zIndex:2,
          width:"36px", height:"36px", borderRadius:"50%",
          background: wishlisted ? "#C8851A" : "rgba(255,255,255,0.88)",
          border:"1px solid " + (wishlisted ? "#C8851A" : "#E0D8CC"),
          display:"flex", alignItems:"center", justifyContent:"center",
          cursor:"pointer", transition:"all 0.2s ease",
          color: wishlisted ? "#FFFFFF" : "#C8851A"
        }}
        aria-label="Wishlist"
      >
        <Heart size={14} fill={wishlisted ? "currentColor" : "none"} />
      </button>

      {/* Desktop Quick View — appears on hover */}
      <AnimatePresence>
        {hovered && (
          <motion.button
            initial={{ opacity:0, y:8 }}
            animate={{ opacity:1, y:0 }}
            exit={{ opacity:0, y:8 }}
            whileHover={{ scale: 1.05 }}
            transition={{ duration:0.18 }}
            onClick={e => { e.preventDefault(); e.stopPropagation(); onQuickView(); }}
            style={{
              position:"absolute", bottom:"12px", left:"50%", transform:"translateX(-50%)",
              height:"36px", padding:"0 16px", borderRadius:"999px",
              background:"rgba(255,255,255,0.95)", border:"1px solid #E0D8CC",
              display:"flex", alignItems:"center", gap:"6px",
              fontFamily:"'Josefin Sans', sans-serif", fontSize:"10px",
              letterSpacing:"0.12em", textTransform:"uppercase", fontWeight:700,
              color:"#1A0F0A", cursor:"pointer", zIndex:3, whiteSpace:"nowrap",
              backdropFilter:"blur(8px)",
              boxShadow:"0 4px 12px rgba(26, 15, 10, 0.15)"
            }}
            className="qv-btn"
            aria-label="Quick View"
          >
            <Eye size={12} /> Quick View
          </motion.button>
        )}
      </AnimatePresence>

      {/* ── Metadata ── */}
      <div className="card-meta" style={{ display:"flex", flexDirection:"column", flex:1 }}>
        <Link href={`/products/${p.slug}`} style={{ textDecoration:"none", color:"inherit", display:"flex", flexDirection:"column", flex:1 }}>
          {/* Code */}
          <span style={{ fontFamily:"'Josefin Sans', sans-serif", fontSize:"10px", letterSpacing:"0.18em", textTransform:"uppercase", color:"#C8851A", fontWeight:700, marginBottom:"4px" }}>
            {p.productCode}
          </span>

          {/* Name */}
          <h3 className="card-name">
            {p.title.length > 30 ? p.title.slice(0, 28) + "..." : p.title}
          </h3>

          {/* Collection + Fabric */}
          <p style={{ fontFamily:"'DM Sans', sans-serif", fontSize:"11px", color:"#9A8070", fontWeight:300, marginBottom:"1px" }}>
            {p.collection}
          </p>
          <p style={{ fontFamily:"'DM Sans', sans-serif", fontSize:"11px", color:"#9A8070", fontWeight:300, marginBottom:"8px" }}>
            {p.fabric}
          </p>

          {/* Price */}
          <p className="card-price">
            ₹{p.price.toLocaleString("en-IN")}
            {p.originalPrice && (
              <span style={{ fontFamily:"'DM Sans', sans-serif", fontSize:"12px", color:"#B0A090", fontWeight:300, marginLeft:"8px", textDecoration:"line-through" }}>
                ₹{p.originalPrice.toLocaleString("en-IN")}
              </span>
            )}
          </p>
        </Link>

        {/* Buttons */}
        <div className="card-btn-row" style={{ marginTop:"auto", zIndex:2 }}>
          <button
            onClick={e => {
              e.preventDefault();
              e.stopPropagation();
              cartState.add({
                id: p.id,
                title: p.title,
                price: p.price,
                thumbnail: p.thumbnail,
                productCode: p.productCode
              });
            }}
            className="card-btn-primary"
            style={{ border: "none", cursor: "pointer" }}
          >
            Add to Bag
          </button>

          <a
            href={`https://wa.me/919022591620?text=Hi! I want to enquire about "${p.title}" (${p.productCode}).`}
            target="_blank"
            rel="noopener noreferrer"
            className="card-btn-wa"
            aria-label="WhatsApp Enquiry"
          >
            <MessageCircle size={16} />
            <span className="card-btn-wa-text">WhatsApp</span>
          </a>
        </div>
      </div>
    </div>
  );
}

/* ─── Helper components ────────────────────────────────── */
function Badge({ label, bg }: { label: string; bg: string }) {
  return (
    <span style={{ fontFamily:"'Josefin Sans', sans-serif", fontSize:"9px", letterSpacing:"0.12em", textTransform:"uppercase", fontWeight:700, background:bg, color:"#FFFFFF", padding:"3px 8px", borderRadius:"4px" }}>
      {label}
    </span>
  );
}

function FilterSection({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom:"20px" }}>
      <p style={{ fontFamily:"'Josefin Sans', sans-serif", fontSize:"10px", letterSpacing:"0.15em", textTransform:"uppercase", color:"#9A8070", fontWeight:600, marginBottom:"10px" }}>{label}</p>
      {children}
    </div>
  );
}

function FilterPills({ options, active, onSelect }: { options: string[]; active: string; onSelect: (v: string) => void }) {
  return (
    <div style={{ display:"flex", flexWrap:"wrap", gap:"6px" }}>
      {options.map(opt => {
        const isActive = opt === active;
        return (
          <button
            key={opt}
            onClick={() => onSelect(opt)}
            style={{
              height:"34px", padding:"0 14px", borderRadius:"999px",
              border: isActive ? "1.5px solid #C8851A" : "1.5px solid #E0D8CC",
              background: isActive ? "#FFF5E6" : "#FAFAF7",
              color: isActive ? "#C8851A" : "#5A4035",
              fontFamily:"'DM Sans', sans-serif", fontSize:"12px", fontWeight: isActive ? 600 : 400,
              cursor:"pointer", transition:"all 0.15s ease", whiteSpace:"nowrap"
            }}
          >
            {opt}
          </button>
        );
      })}
    </div>
  );
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p style={{ fontFamily:"'Josefin Sans', sans-serif", fontSize:"10px", letterSpacing:"0.12em", textTransform:"uppercase", color:"#9A8070", marginBottom:"2px" }}>{label}</p>
      <p style={{ fontFamily:"'DM Sans', sans-serif", fontSize:"13px", color:"#1A0F0A", fontWeight:500 }}>{value}</p>
    </div>
  );
}

function Pagination({ current, total, onPageChange }: { current: number; total: number; onPageChange: (p: number) => void }) {
  const pages = Array.from({ length: total }, (_, i) => i + 1).filter(p => {
    if (total <= 7) return true;
    return p === 1 || p === total || Math.abs(p - current) <= 1;
  });

  return (
    <div className="pagination-container">
      <button
        disabled={current === 1}
        onClick={() => onPageChange(current - 1)}
        className="pagination-btn"
        aria-label="Previous Page"
      >
        <ChevronLeft size={16} />
      </button>

      {pages.map((p, i) => {
        const prev = pages[i - 1];
        const showDots = prev && p - prev > 1;
        return (
          <React.Fragment key={p}>
            {showDots && <span className="pagination-dots">…</span>}
            <button
              onClick={() => onPageChange(p)}
              className={`pagination-btn ${p === current ? "pagination-btn-active" : ""}`}
              aria-label={`Page ${p}`}
              aria-current={p === current ? "page" : undefined}
            >
              {p}
            </button>
          </React.Fragment>
        );
      })}

      <button
        disabled={current === total}
        onClick={() => onPageChange(current + 1)}
        className="pagination-btn"
        aria-label="Next Page"
      >
        <ChevronRight size={16} />
      </button>
    </div>
  );
}

/* ─── FilterSheet — shared by desktop dropdown + mobile bottom-sheet ── */
interface FilterSheetProps {
  sort: string; setSort: (v: string) => void;
  fabric: string; setFabric: (v: string) => void;
  color: string; setColor: (v: string) => void;
  price: string; setPrice: (v: string) => void;
  anyFilter: boolean;
  onClear: () => void;
  onClose: () => void;
  showApply?: boolean;
}
function FilterSheet({ sort, setSort, fabric, setFabric, color, setColor, price, setPrice, anyFilter, onClear, onClose, showApply }: FilterSheetProps) {
  return (
    <>
      <FilterSection label="Sort By">
        <FilterPills
          options={SORT_OPTIONS.map(o => o.label)}
          active={SORT_OPTIONS.find(o => o.value === sort)?.label || ""}
          onSelect={v => setSort(SORT_OPTIONS.find(o => o.label === v)?.value || "newest")}
        />
      </FilterSection>
      <FilterSection label="Fabric">
        <FilterPills options={FABRIC_OPTIONS} active={fabric} onSelect={setFabric} />
      </FilterSection>
      <FilterSection label="Colour">
        <FilterPills options={COLOR_OPTIONS} active={color} onSelect={setColor} />
      </FilterSection>
      <FilterSection label="Price Range">
        <FilterPills
          options={PRICE_OPTIONS.map(o => o.label)}
          active={PRICE_OPTIONS.find(o => o.value === price)?.label || ""}
          onSelect={v => setPrice(PRICE_OPTIONS.find(o => o.label === v)?.value || "all")}
        />
      </FilterSection>

      <div style={{ display: "flex", gap: "8px", marginTop: "16px" }}>
        {anyFilter && (
          <button
            onClick={onClear}
            style={{
              flex: 1, height: "48px", borderRadius: "12px",
              border: "1.5px solid #E0D8CC", background: "#FAFAF7",
              fontFamily: "'Josefin Sans', sans-serif", fontSize: "11px",
              letterSpacing: "0.12em", textTransform: "uppercase",
              color: "#9A8070", cursor: "pointer", fontWeight: 600
            }}
          >
            Clear All
          </button>
        )}
        {showApply && (
          <button
            onClick={onClose}
            style={{
              flex: 2, height: "48px", borderRadius: "12px",
              background: "#1A0F0A", color: "#FFFFFF",
              fontFamily: "'Josefin Sans', sans-serif", fontSize: "11px",
              letterSpacing: "0.15em", textTransform: "uppercase",
              fontWeight: 700, border: "none", cursor: "pointer",
              transition: "background 0.25s ease"
            }}
          >
            Apply Filters
          </button>
        )}
      </div>
    </>
  );
}
