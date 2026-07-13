"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  Heart, Share2, MessageCircle, Calendar,
  ArrowLeft, ArrowRight, ChevronDown, ChevronUp,
  Check, Truck, Scissors, Globe, ShieldCheck,
  X, ZoomIn
} from "lucide-react";
import { type Product } from "@/data/image_analyzer";
import LuxuryButton from "@/components/LuxuryButton";

/* ─────────────────────────────────────────────────────────────
   TYPES
───────────────────────────────────────────────────────────── */
interface Props {
  product: Product;
  products: Product[];
}

/* ─────────────────────────────────────────────────────────────
   MAIN COMPONENT
───────────────────────────────────────────────────────────── */
export default function ProductDetails({ product, products }: Props) {
  /* gallery */
  const allImages = Array.from(new Set([product.thumbnail, ...product.gallery, ...product.modelImages])).filter(Boolean);
  const [activeIdx, setActiveIdx]     = useState(0);
  const [zoomed,    setZoomed]        = useState(false);
  const [zoomPos,   setZoomPos]       = useState({ x: 50, y: 50 });

  /* ui */
  const [wishlisted,  setWishlisted]  = useState(false);
  const [recentSlugs, setRecentSlugs] = useState<string[]>([]);
  const [openAccordion, setOpenAccordion] = useState<string | null>("narrative");
  const [copied, setCopied]           = useState(false);

  /* on mount: wishlist + recently-viewed */
  useEffect(() => {
    const wl = localStorage.getItem("sana_wishlist");
    if (wl) try { setWishlisted(JSON.parse(wl).includes(product.id)); } catch {}

    const rv = localStorage.getItem("sana_recently_viewed");
    let list: string[] = [];
    if (rv) try { list = JSON.parse(rv); } catch {}
    list = list.filter(s => s !== product.slug);
    list.unshift(product.slug);
    list = list.slice(0, 6);
    localStorage.setItem("sana_recently_viewed", JSON.stringify(list));
    setRecentSlugs(list);
  }, [product]);

  const toggleWishlist = () => {
    const wl = localStorage.getItem("sana_wishlist");
    let list: number[] = [];
    if (wl) try { list = JSON.parse(wl); } catch {}
    if (wishlisted) list = list.filter(id => id !== product.id);
    else list.push(product.id);
    localStorage.setItem("sana_wishlist", JSON.stringify(list));
    setWishlisted(!wishlisted);
  };

  const share = () => {
    if (navigator.share) {
      navigator.share({ title: product.title, url: window.location.href });
    } else {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  /* zoom handler */
  const handleImageMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top)  / rect.height) * 100;
    setZoomPos({ x, y });
  };

  /* related products */
  const related = products
    .filter(p => p.id !== product.id && (p.category === product.category || p.fabric === product.fabric))
    .slice(0, 6);

  /* recently viewed products (exclude current) */
  const recentProducts = recentSlugs
    .slice(1)
    .map(slug => products.find(p => p.slug === slug))
    .filter(Boolean) as Product[];

  /* accordion data */
  const accordionSections = [
    {
      id: "narrative",
      title: "The Story",
      content: `${product.title} is a masterpiece of Indian artisanal craft — each piece individually cut, stitched and finished by our atelier's master karigars. Designed for the woman who carries tradition with effortless grace.`
    },
    {
      id: "craftsmanship",
      title: "Craftsmanship",
      content: `Crafted from premium ${product.fabric}, this piece is finished with intricate ${product.work}. Every detail — from the neckline to the hem — is executed with obsessive precision across 40–60 hours of handwork.`
    },
    {
      id: "fabric",
      title: "Fabric & Materials",
      content: `Primary Fabric: ${product.fabric} · Work: ${product.work} · Colour: ${product.color} · Lining: Premium Santoon · All fabrics are hand-sourced from the finest weavers of Varanasi and Surat.`
    },
    {
      id: "care",
      title: "Care Instructions",
      content: "Dry clean only. Store in a breathable garment bag away from direct sunlight. For embellished pieces, avoid folding across embroidery. Use a soft press cloth when steaming."
    },
    {
      id: "styling",
      title: "Styling Notes",
      content: "Pair with uncut diamond jewellery and statement juttis for a complete bridal look. For festive wear, layer with a silk dupatta and classic kohl eyes. Works beautifully with both statement and minimal accessories."
    }
  ];

  /* ───────── RENDER ───────── */
  return (
    <div style={{ background: "#FAFAF7", minHeight: "100vh", color: "#1A0F0A" }}>

      {/* ══════════════════════════════════════════
          BREADCRUMB
      ══════════════════════════════════════════ */}
      <div style={{ borderBottom: "1px solid #E8E0D0", background: "#FAFAF7" }}>
        <div style={{ maxWidth: "1400px", margin: "0 auto", padding: "0 24px" }}>
          <nav style={{ display: "flex", alignItems: "center", gap: "8px", height: "52px" }}>
            <Link href="/" style={{ fontFamily: "'Josefin Sans', sans-serif", fontSize: "11px", letterSpacing: "0.15em", textTransform: "uppercase", color: "#9A8070", textDecoration: "none" }}>Home</Link>
            <span style={{ color: "#D0C8BC", fontSize: "12px" }}>/</span>
            <Link href="/products" style={{ fontFamily: "'Josefin Sans', sans-serif", fontSize: "11px", letterSpacing: "0.15em", textTransform: "uppercase", color: "#9A8070", textDecoration: "none" }}>Products</Link>
            <span style={{ color: "#D0C8BC", fontSize: "12px" }}>/</span>
            <span style={{ fontFamily: "'Josefin Sans', sans-serif", fontSize: "11px", letterSpacing: "0.15em", textTransform: "uppercase", color: "#1A0F0A", fontWeight: 600 }}>{product.productCode}</span>
          </nav>
        </div>
      </div>

      {/* ══════════════════════════════════════════
          MAIN LAYOUT — Gallery + Info
      ══════════════════════════════════════════ */}
      <div style={{ maxWidth: "1400px", margin: "0 auto", padding: "0 24px" }}>
        <div className="pd-main-grid">

          {/* ──────────────────────────────────────
              LEFT COLUMN — IMAGE GALLERY
          ────────────────────────────────────── */}
          <div className="pd-gallery-col">

            {/* Hero Image */}
            <div
              className="pd-hero-img-wrap"
              style={{
                position: "relative",
                width: "100%",
                maxWidth: "620px",
                aspectRatio: "3/4",
                borderRadius: "24px",
                overflow: "hidden",
                background: "#F0EAE0",
                boxShadow: "0 24px 64px rgba(26,15,10,0.14)",
                cursor: zoomed ? "zoom-out" : "zoom-in"
              }}
              onMouseMove={handleImageMove}
              onClick={() => setZoomed(z => !z)}
              onMouseLeave={() => setZoomed(false)}
            >
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeIdx}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  style={{ position: "absolute", inset: 0 }}
                >
                  <Image
                    src={allImages[activeIdx] || product.thumbnail}
                    alt={product.title}
                    fill
                    priority
                    sizes="(max-width:768px) 100vw, 55vw"
                    style={{
                      objectFit: "cover",
                      objectPosition: "top",
                      transition: "transform 0.4s ease",
                      transform: zoomed
                        ? `scale(1.8) translate(${(50 - zoomPos.x) * 0.4}%, ${(50 - zoomPos.y) * 0.4}%)`
                        : "scale(1)"
                    }}
                  />
                </motion.div>
              </AnimatePresence>

              {/* Zoom icon */}
              <div style={{ position: "absolute", bottom: "16px", right: "16px", background: "rgba(255,255,255,0.88)", borderRadius: "50%", width: "36px", height: "36px", display: "flex", alignItems: "center", justifyContent: "center", backdropFilter: "blur(6px)", border: "1px solid rgba(255,255,255,0.6)", pointerEvents: "none" }}>
                <ZoomIn size={15} color="#1A0F0A" />
              </div>

              {/* Navigation arrows when multiple images */}
              {allImages.length > 1 && (
                <>
                  <button
                    onClick={e => { e.stopPropagation(); setActiveIdx(i => Math.max(0, i - 1)); setZoomed(false); }}
                    disabled={activeIdx === 0}
                    style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", width: "36px", height: "36px", borderRadius: "50%", background: "rgba(255,255,255,0.88)", border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", backdropFilter: "blur(6px)", opacity: activeIdx === 0 ? 0.4 : 1 }}
                  >
                    <ArrowLeft size={15} />
                  </button>
                  <button
                    onClick={e => { e.stopPropagation(); setActiveIdx(i => Math.min(allImages.length - 1, i + 1)); setZoomed(false); }}
                    disabled={activeIdx === allImages.length - 1}
                    style={{ position: "absolute", right: "12px", top: "50%", transform: "translateY(-50%)", width: "36px", height: "36px", borderRadius: "50%", background: "rgba(255,255,255,0.88)", border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", backdropFilter: "blur(6px)", opacity: activeIdx === allImages.length - 1 ? 0.4 : 1 }}
                  >
                    <ArrowRight size={15} />
                  </button>
                </>
              )}
            </div>

            {/* Horizontal Thumbnails */}
            {allImages.length > 1 && (
              <div style={{ display: "flex", gap: "10px", marginTop: "16px", maxWidth: "620px", overflowX: "auto", paddingBottom: "4px" }}>
                {allImages.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => { setActiveIdx(i); setZoomed(false); }}
                    style={{
                      flexShrink: 0,
                      width: "72px",
                      height: "90px",
                      borderRadius: "10px",
                      overflow: "hidden",
                      border: i === activeIdx ? "2px solid #C8851A" : "2px solid transparent",
                      outline: "none",
                      cursor: "pointer",
                      position: "relative",
                      background: "#F0EAE0",
                      transition: "border-color 0.2s ease, opacity 0.2s ease",
                      opacity: i === activeIdx ? 1 : 0.65,
                      padding: 0
                    }}
                  >
                    <Image src={img} alt={`View ${i + 1}`} fill style={{ objectFit: "cover", objectPosition: "top" }} sizes="72px" />
                  </button>
                ))}
              </div>
            )}

            {/* 2-Column Secondary Gallery (desktop only) */}
            {allImages.length > 2 && (
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginTop: "16px", maxWidth: "620px" }} className="pd-sub-gallery">
                {allImages.slice(1, 5).map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveIdx(i + 1)}
                    style={{ position: "relative", aspectRatio: "3/4", borderRadius: "16px", overflow: "hidden", background: "#F0EAE0", border: "none", cursor: "pointer", padding: 0 }}
                  >
                    <Image src={img} alt="" fill style={{ objectFit: "cover", objectPosition: "top", transition: "transform 0.4s ease" }} sizes="200px"
                      onMouseEnter={e => { (e.target as HTMLImageElement).style.transform = "scale(1.05)"; }}
                      onMouseLeave={e => { (e.target as HTMLImageElement).style.transform = "scale(1)"; }}
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* ──────────────────────────────────────
              RIGHT COLUMN — PRODUCT INFORMATION
          ────────────────────────────────────── */}
          <div className="pd-info-col">
            <div className="pd-sticky-info">

              {/* Category + SKU */}
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "12px" }}>
                <span style={{ fontFamily: "'Josefin Sans', sans-serif", fontSize: "11px", letterSpacing: "0.2em", textTransform: "uppercase", color: "#C8851A", fontWeight: 700 }}>
                  {product.category}
                </span>
                <span style={{ fontFamily: "'Josefin Sans', sans-serif", fontSize: "10px", letterSpacing: "0.15em", textTransform: "uppercase", color: "#B0A090" }}>
                  {product.productCode}
                </span>
              </div>

              {/* Product Name */}
              <h1 style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: "clamp(28px, 3.5vw, 44px)", fontWeight: 300, lineHeight: 1.1, letterSpacing: "-0.015em", color: "#1A0F0A", marginBottom: "16px" }}>
                {product.title}
              </h1>

              {/* Price + Badge */}
              <div style={{ display: "flex", alignItems: "center", gap: "16px", marginBottom: "24px" }}>
                <span style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "clamp(24px, 2.5vw, 34px)", fontWeight: 400, color: "#1A0F0A", letterSpacing: "-0.01em" }}>
                  ₹{product.price.toLocaleString("en-IN")}
                </span>
                {product.originalPrice && (
                  <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "14px", color: "#B0A090", textDecoration: "line-through", fontWeight: 300 }}>
                    ₹{product.originalPrice.toLocaleString("en-IN")}
                  </span>
                )}
                <span style={{
                  fontFamily: "'Josefin Sans', sans-serif",
                  fontSize: "10px", letterSpacing: "0.15em", textTransform: "uppercase", fontWeight: 700,
                  padding: "4px 10px", borderRadius: "999px",
                  background: product.availability ? "#EFF7F2" : "#FFF3ED",
                  color: product.availability ? "#1B5E35" : "#C8851A",
                  border: `1px solid ${product.availability ? "#B8DFC7" : "#F0D5B0"}`
                }}>
                  {product.availability ? "In Stock" : "Coming Soon"}
                </span>
              </div>

              {/* Spec Cards Grid */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px", marginBottom: "28px" }}>
                {[
                  { label: "Fabric",     value: product.fabric },
                  { label: "Colour",     value: product.color },
                  { label: "Collection", value: product.collection },
                  { label: "Work",       value: product.work },
                ].map(item => (
                  <div key={item.label} style={{ background: "#FFFFFF", border: "1px solid #EAE3D8", borderRadius: "12px", padding: "12px 14px" }}>
                    <p style={{ fontFamily: "'Josefin Sans', sans-serif", fontSize: "9px", letterSpacing: "0.18em", textTransform: "uppercase", color: "#9A8070", marginBottom: "4px", fontWeight: 600 }}>
                      {item.label}
                    </p>
                    <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "13px", color: "#1A0F0A", fontWeight: 500 }}>
                      {item.value}
                    </p>
                  </div>
                ))}
              </div>

              {/* ── PRIMARY BUTTONS ── */}
              <div style={{ display: "flex", flexDirection: "column", gap: "10px", marginBottom: "20px" }}>
                {/* WhatsApp */}
                <ActionButton
                  as="a"
                  href={`https://wa.me/919022591620?text=Hi! I am interested in "${product.title}" (${product.productCode}). Could you please share availability and details?`}
                  bg="#1B5E35"
                  hoverBg="#C8851A"
                  color="#FFFFFF"
                  icon={<MessageCircle size={16} />}
                  label="WhatsApp Enquiry"
                />
                {/* Book Appointment */}
                <ActionButton
                  as="link"
                  href="/contact"
                  bg="#C8851A"
                  hoverBg="#1A0F0A"
                  color="#FFFFFF"
                  icon={<Calendar size={16} />}
                  label="Book Private Appointment"
                />
              </div>

              {/* Secondary Actions */}
              <div style={{ display: "flex", gap: "10px", marginBottom: "28px" }}>
                {/* Wishlist */}
                <button
                  onClick={toggleWishlist}
                  style={{
                    flex: 1, height: "48px", borderRadius: "10px",
                    border: wishlisted ? "1.5px solid #C8851A" : "1.5px solid #E0D8CC",
                    background: wishlisted ? "#FFF5E6" : "#FFFFFF",
                    color: wishlisted ? "#C8851A" : "#5A4035",
                    fontFamily: "'Josefin Sans', sans-serif", fontSize: "11px",
                    letterSpacing: "0.12em", textTransform: "uppercase", fontWeight: 700,
                    display: "flex", alignItems: "center", justifyContent: "center", gap: "8px",
                    cursor: "pointer", transition: "all 0.25s ease"
                  }}
                >
                  <Heart size={14} fill={wishlisted ? "currentColor" : "none"} />
                  {wishlisted ? "Saved" : "Wishlist"}
                </button>

                {/* Share */}
                <button
                  onClick={share}
                  style={{
                    width: "48px", height: "48px", borderRadius: "10px",
                    border: "1.5px solid #E0D8CC", background: "#FFFFFF",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    cursor: "pointer", color: "#5A4035",
                    position: "relative", transition: "border-color 0.2s ease"
                  }}
                  title="Share"
                >
                  {copied ? <Check size={15} color="#1B5E35" /> : <Share2 size={15} />}
                </button>
              </div>

              {/* ── TRUST ICONS ── */}
              <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "8px", paddingTop: "20px", borderTop: "1px solid #E8E0D0" }}>
                {[
                  { icon: <Scissors size={15} />, label: "Handcrafted" },
                  { icon: <ShieldCheck size={15} />, label: "Authentic" },
                  { icon: <Globe size={15} />, label: "Worldwide Ship" },
                  { icon: <Check size={15} />, label: "Custom Tailoring" },
                  { icon: <Truck size={15} />, label: "Secure Delivery" },
                  { icon: <ShieldCheck size={15} />, label: "Secure Payment" },
                ].map(t => (
                  <div key={t.label} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "6px", padding: "10px 4px", background: "#FFFFFF", borderRadius: "10px", border: "1px solid #EAE3D8" }}>
                    <span style={{ color: "#C8851A" }}>{t.icon}</span>
                    <span style={{ fontFamily: "'Josefin Sans', sans-serif", fontSize: "9px", letterSpacing: "0.1em", textTransform: "uppercase", color: "#7A6458", fontWeight: 600, textAlign: "center" }}>{t.label}</span>
                  </div>
                ))}
              </div>

              {/* ── ACCORDION ── */}
              <div style={{ marginTop: "28px", borderTop: "1px solid #E8E0D0" }}>
                {accordionSections.map(sec => (
                  <AccordionItem
                    key={sec.id}
                    id={sec.id}
                    title={sec.title}
                    content={sec.content}
                    isOpen={openAccordion === sec.id}
                    onToggle={() => setOpenAccordion(openAccordion === sec.id ? null : sec.id)}
                  />
                ))}
              </div>

            </div>
          </div>
        </div>
      </div>

      {/* ══════════════════════════════════════════
          COMPLETE THE LOOK — Related Products
      ══════════════════════════════════════════ */}
      {related.length > 0 && (
        <section style={{ padding: "80px 0", background: "#F5F0E8" }}>
          <div style={{ maxWidth: "1400px", margin: "0 auto", padding: "0 24px" }}>
            <SectionHeading eyebrow="You may also love" title="Complete The Look" />
            <HorizontalSlider products={related} />
          </div>
        </section>
      )}

      {/* ══════════════════════════════════════════
          EDITORIAL BLOCK — Craftsmanship
      ══════════════════════════════════════════ */}
      <section style={{ padding: "80px 0", background: "#FAFAF7" }}>
        <div style={{ maxWidth: "1400px", margin: "0 auto", padding: "0 24px" }}>
          <div className="pd-editorial-grid">
            {/* Image */}
            <div style={{ position: "relative", aspectRatio: "4/5", borderRadius: "20px", overflow: "hidden", background: "#F0EAE0" }}>
              <Image
                src={product.thumbnail}
                alt="Craftsmanship"
                fill
                style={{ objectFit: "cover", objectPosition: "top" }}
                sizes="50vw"
              />
            </div>

            {/* Text */}
            <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", padding: "0 8px" }}>
              <span style={{ fontFamily: "'Josefin Sans', sans-serif", fontSize: "11px", letterSpacing: "0.2em", textTransform: "uppercase", color: "#C8851A", fontWeight: 700, marginBottom: "16px" }}>
                Our Craft
              </span>
              <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "clamp(32px, 4vw, 52px)", fontWeight: 300, lineHeight: 1.1, color: "#1A0F0A", marginBottom: "20px", letterSpacing: "-0.01em" }}>
                The Art of<br /><em>Handcrafted Couture</em>
              </h2>
              <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "15px", lineHeight: 1.75, color: "#5A4035", fontWeight: 300, marginBottom: "32px", maxWidth: "420px" }}>
                Every piece that leaves our atelier carries the mark of our master karigars — artisans who have spent decades perfecting ancient needlework techniques, passed down through generations. We believe luxury is not just in the fabric but in the hours of silent dedication woven into every stitch.
              </p>
              <Link href="/about" style={{ textDecoration: "none" }}>
                <LuxuryButton variant="primary" showArrow>
                  Explore Atelier
                </LuxuryButton>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          RECENTLY VIEWED
      ══════════════════════════════════════════ */}
      {recentProducts.length > 0 && (
        <section style={{ padding: "64px 0 120px", background: "#F5F0E8" }}>
          <div style={{ maxWidth: "1400px", margin: "0 auto", padding: "0 24px" }}>
            <SectionHeading eyebrow="Your browsing" title="Recently Viewed" />
            <HorizontalSlider products={recentProducts.slice(0, 5)} />
          </div>
        </section>
      )}

      {/* Responsive CSS */}
      <style>{`
        /* Main split layout */
        .pd-main-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 40px;
          padding: 40px 0 80px;
        }
        @media(min-width: 900px) {
          .pd-main-grid {
            grid-template-columns: 55fr 45fr;
            gap: 60px;
            padding: 56px 0 100px;
            align-items: start;
          }
          .pd-sticky-info {
            position: sticky;
            top: 96px;
          }
        }

        /* Gallery columns */
        .pd-gallery-col { display: flex; flex-direction: column; }
        .pd-info-col { display: flex; flex-direction: column; }

        /* Sub gallery hidden on mobile */
        .pd-sub-gallery { display: none; }
        @media(min-width: 640px) { .pd-sub-gallery { display: grid; } }

        /* Editorial grid */
        .pd-editorial-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 40px;
          align-items: center;
        }
        @media(min-width: 900px) {
          .pd-editorial-grid {
            grid-template-columns: 1fr 1fr;
            gap: 72px;
          }
        }

        /* Hide scrollbar */
        *::-webkit-scrollbar { display: none; }
        * { scrollbar-width: none; }

        /* Smooth image transitions */
        img { transition: opacity 0.3s ease; }

        /* ══════════════════
           MOBILE OVERRIDES
           max-width: 768px
        ══════════════════ */
        @media(max-width: 768px) {

          /* ── Main layout padding ── */
          .pd-main-grid {
            gap: 24px;
            padding: 24px 16px 48px;
          }

          /* ── Hero image: cap at 420px, don't let it dominate ── */
          .pd-hero-img-wrap {
            max-width: 100% !important;
            aspect-ratio: auto !important;
            height: 420px !important;
            border-radius: 20px !important;
          }

          /* ── Thumbnails: slightly smaller ── */
          .pd-thumb-strip { max-width: 100% !important; }

          /* ── Info padding ── */
          .pd-info-col { padding: 0; }

          /* ── Price size ── */
          .pd-price {
            font-size: 28px !important;
          }

          /* ── Spec cards: full-width grid ── */
          .pd-spec-grid {
            grid-template-columns: 1fr 1fr !important;
            gap: 8px !important;
          }

          /* ── Action buttons: full width, 52px ── */
          .pd-action-btn {
            height: 52px !important;
            border-radius: 14px !important;
          }

          /* ── Wishlist / Share row ── */
          .pd-secondary-row { gap: 8px; }

          /* ── Trust grid: 3 cols on mobile ── */
          .pd-trust-grid {
            grid-template-columns: repeat(3, 1fr) !important;
            gap: 6px !important;
          }

          /* ── Sections: tighter padding ── */
          .pd-section-mobile { padding: 48px 16px !important; }

          /* ── Editorial: stack vertically, smaller image ── */
          .pd-editorial-grid {
            gap: 24px !important;
            padding: 0 16px;
          }
          .pd-editorial-img {
            aspect-ratio: 4/3 !important;
          }

          /* ── Related / Recently Viewed sections ── */
          .pd-related-section { padding: 48px 0 !important; }
          .pd-slider-wrap { padding: 0 16px !important; }

          /* ── Slider cards ── */
          .pd-slider-card {
            width: 175px !important;
            min-width: 175px !important;
          }

          /* ── Footer top margin ── */
          .pd-pre-footer { margin-top: 48px; }

          /* ── Typography ── */
          h1.pd-product-title {
            font-size: 28px !important;
            line-height: 1.15 !important;
          }
          .pd-accordion-body {
            font-size: 14px !important;
            line-height: 1.7 !important;
          }
        }

        @media(max-width: 390px) {
          .pd-hero-img-wrap { height: 360px !important; }
          .pd-trust-grid { grid-template-columns: repeat(3, 1fr) !important; }
          .pd-slider-card { width: 155px !important; min-width: 155px !important; }
        }
      `}</style>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────
   ACTION BUTTON — generic luxury button (link or anchor)
───────────────────────────────────────────────────────────── */
interface ActionButtonProps {
  as: "a" | "link";
  href: string;
  bg: string;
  hoverBg: string;
  color: string;
  icon?: React.ReactNode;
  label: string;
  target?: string;
}
function ActionButton({ as, href, bg, hoverBg, color, icon, label, target }: ActionButtonProps) {
  const style: React.CSSProperties = {
    width: "100%", height: "56px", borderRadius: "12px",
    background: bg, color,
    fontFamily: "'Josefin Sans', sans-serif", fontSize: "12px",
    letterSpacing: "0.15em", textTransform: "uppercase", fontWeight: 700,
    display: "flex", alignItems: "center", justifyContent: "center", gap: "10px",
    textDecoration: "none", border: "none", cursor: "pointer",
    transition: "background 0.25s ease, transform 0.2s ease"
  };
  const handleEnter = (e: React.MouseEvent) => {
    (e.currentTarget as HTMLElement).style.background = hoverBg;
    (e.currentTarget as HTMLElement).style.transform = "translateY(-1px)";
  };
  const handleLeave = (e: React.MouseEvent) => {
    (e.currentTarget as HTMLElement).style.background = bg;
    (e.currentTarget as HTMLElement).style.transform = "translateY(0)";
  };

  if (as === "a") {
    return (
      <a href={href} target={target || "_blank"} rel="noopener noreferrer" style={style} onMouseEnter={handleEnter} onMouseLeave={handleLeave}>
        {icon} {label}
      </a>
    );
  }
  return (
    <Link href={href} style={style} onMouseEnter={handleEnter} onMouseLeave={handleLeave}>
      {icon} {label}
    </Link>
  );
}

/* ─────────────────────────────────────────────────────────────
   ACCORDION ITEM
───────────────────────────────────────────────────────────── */
function AccordionItem({ id, title, content, isOpen, onToggle }: { id: string; title: string; content: string; isOpen: boolean; onToggle: () => void; }) {
  return (
    <div style={{ borderBottom: "1px solid #E8E0D0" }}>
      <button
        onClick={onToggle}
        style={{
          width: "100%", padding: "16px 0",
          display: "flex", alignItems: "center", justifyContent: "space-between",
          background: "none", border: "none", cursor: "pointer",
          fontFamily: "'Josefin Sans', sans-serif", fontSize: "11px",
          letterSpacing: "0.15em", textTransform: "uppercase", fontWeight: 700,
          color: "#1A0F0A", textAlign: "left"
        }}
      >
        {title}
        {isOpen ? <ChevronUp size={15} color="#C8851A" /> : <ChevronDown size={15} color="#9A8070" />}
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            style={{ overflow: "hidden" }}
          >
            <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "14px", lineHeight: 1.75, color: "#5A4035", fontWeight: 300, paddingBottom: "18px" }}>
              {content}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────
   SECTION HEADING
───────────────────────────────────────────────────────────── */
function SectionHeading({ eyebrow, title }: { eyebrow: string; title: string }) {
  return (
    <div style={{ marginBottom: "36px" }}>
      <p style={{ fontFamily: "'Josefin Sans', sans-serif", fontSize: "11px", letterSpacing: "0.2em", textTransform: "uppercase", color: "#C8851A", fontWeight: 700, marginBottom: "8px" }}>
        {eyebrow}
      </p>
      <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "clamp(28px, 3.5vw, 42px)", fontWeight: 300, color: "#1A0F0A", lineHeight: 1.1, letterSpacing: "-0.01em" }}>
        {title}
      </h2>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────
   HORIZONTAL SLIDER — Related / Recently Viewed
───────────────────────────────────────────────────────────── */
function HorizontalSlider({ products }: { products: Product[] }) {
  const [wishlisted, setWishlisted] = useState<number[]>([]);
  useEffect(() => {
    const wl = localStorage.getItem("sana_wishlist");
    if (wl) try { setWishlisted(JSON.parse(wl)); } catch {}
  }, []);

  const toggleWish = (id: number) => {
    let next: number[];
    if (wishlisted.includes(id)) next = wishlisted.filter(x => x !== id);
    else next = [...wishlisted, id];
    setWishlisted(next);
    localStorage.setItem("sana_wishlist", JSON.stringify(next));
  };

  return (
    <div style={{ display: "flex", gap: "20px", overflowX: "auto", paddingBottom: "8px" }}>
      {products.map(p => (
        <SliderCard key={p.id} product={p} wishlisted={wishlisted.includes(p.id)} onWishlist={() => toggleWish(p.id)} />
      ))}
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────
   SLIDER CARD
───────────────────────────────────────────────────────────── */
function SliderCard({ product: p, wishlisted, onWishlist }: { product: Product; wishlisted: boolean; onWishlist: () => void; }) {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        flexShrink: 0,
        width: "clamp(200px, 22vw, 280px)",
        background: "#FFFFFF",
        borderRadius: "18px",
        border: "1px solid #EAE3D8",
        overflow: "hidden",
        boxShadow: hovered ? "0 16px 40px rgba(26,15,10,0.12)" : "0 2px 8px rgba(26,15,10,0.05)",
        transform: hovered ? "translateY(-3px)" : "translateY(0)",
        transition: "all 0.3s ease"
      }}
    >
      {/* Image */}
      <div style={{ position: "relative", aspectRatio: "3/4", overflow: "hidden", background: "#F0EAE0" }}>
        <Image
          src={p.thumbnail}
          alt={p.title}
          fill
          sizes="280px"
          style={{ objectFit: "cover", objectPosition: "top", transform: hovered ? "scale(1.05)" : "scale(1)", transition: "transform 0.5s ease" }}
        />
        <button
          onClick={e => { e.preventDefault(); onWishlist(); }}
          style={{
            position: "absolute", top: "10px", right: "10px",
            width: "32px", height: "32px", borderRadius: "50%",
            background: "rgba(255,255,255,0.9)", border: "1px solid #E0D8CC",
            display: "flex", alignItems: "center", justifyContent: "center",
            cursor: "pointer", color: wishlisted ? "#C8851A" : "#9A8070",
            transition: "all 0.2s"
          }}
        >
          <Heart size={12} fill={wishlisted ? "currentColor" : "none"} />
        </button>
      </div>

      {/* Info */}
      <div style={{ padding: "16px" }}>
        <span style={{ fontFamily: "'Josefin Sans', sans-serif", fontSize: "9px", letterSpacing: "0.15em", textTransform: "uppercase", color: "#C8851A", fontWeight: 700, display: "block", marginBottom: "4px" }}>
          {p.productCode}
        </span>
        <h4 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "17px", fontWeight: 400, color: "#1A0F0A", lineHeight: 1.2, marginBottom: "4px", overflow: "hidden", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical" }}>
          {p.title}
        </h4>
        <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "12px", color: "#9A8070", fontWeight: 300, marginBottom: "12px" }}>
          {p.fabric}
        </p>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "8px" }}>
          <span style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "18px", fontWeight: 500, color: "#1A0F0A" }}>
            ₹{p.price.toLocaleString("en-IN")}
          </span>
          <Link
            href={`/products/${p.slug}`}
            style={{
              height: "36px", padding: "0 14px",
              borderRadius: "8px", background: "#1A0F0A", color: "#FFFFFF",
              fontFamily: "'Josefin Sans', sans-serif", fontSize: "10px",
              letterSpacing: "0.1em", textTransform: "uppercase", fontWeight: 700,
              display: "flex", alignItems: "center", gap: "5px",
              textDecoration: "none", transition: "background 0.2s ease",
              flexShrink: 0
            }}
            onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.background = "#C8851A"; }}
            onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.background = "#1A0F0A"; }}
          >
            View <ArrowRight size={11} />
          </Link>
        </div>
      </div>
    </div>
  );
}
