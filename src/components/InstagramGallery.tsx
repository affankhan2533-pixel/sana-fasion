"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { motion, useInView, AnimatePresence } from "framer-motion";
import { X, ChevronLeft, ChevronRight } from "lucide-react";

const InstagramIcon = ({ size = 16, color = "currentColor" }: { size?: number; color?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
    <circle cx="12" cy="12" r="4" />
    <circle cx="17.5" cy="6.5" r="1" fill={color} stroke="none" />
  </svg>
);

const images = [
  { src: "/images/models/hero_bridal.png", alt: "Bridal Campaign" },
  { src: "/images/models/wedding-collection.jpg", alt: "Wedding Collection" },
  { src: "/images/products/festive-anarkali-1.jpg", alt: "Festive Anarkali" },
  { src: "/images/models/festive-collection.jpg", alt: "Festive Collection" },
  { src: "/images/models/hero_editorial.png", alt: "Editorial" },
  { src: "/images/products/power-suit-1.jpg", alt: "Designer Suit" },
  { src: "/images/products/party-gown-1.jpg", alt: "Party Gown" },
  { src: "/images/models/brand-story.jpg", alt: "Atelier" },
  { src: "/images/models/gallery-1.jpg", alt: "Gallery" },
  { src: "/images/products/product-001.png", alt: "Festive Couture Look" },
  { src: "/images/products/product-002.png", alt: "Artisanal Silk Fit" },
  { src: "/images/products/product-003.png", alt: "Bridal Lehenga Close-up" },
];

export default function InstagramGallery() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-60px" });
  const [lightbox, setLightbox] = useState<number | null>(null);

  const prev = () => setLightbox(i => (i !== null ? (i - 1 + images.length) % images.length : 0));
  const next = () => setLightbox(i => (i !== null ? (i + 1) % images.length : 0));

  return (
    <section className="section-spacing relative overflow-hidden bg-[#FFFBF4]">
      {/* Subtle top border divider */}
      <div className="absolute top-0 inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-accent-gold/15 to-transparent" />

      <div className="editorial-container">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="mb-12 md:mb-16 flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-accent-gold/10 pb-6 md:pb-8"
        >
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-2 mb-1">
              <InstagramIcon size={14} color="var(--gold)" />
              <span className="eyebrow-text text-gold">@sana___fashion___01</span>
            </div>
            <h2 className="section-title-text">
              Follow Our <span className="italic font-normal text-gold">Story</span>
            </h2>
          </div>
          <div className="pb-1.5">
            <a
              href="https://www.instagram.com/sana___fashion___01/"
              target="_blank"
              rel="noopener noreferrer"
            >
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className="flex items-center gap-2 font-accent text-[15px] tracking-[0.2em] uppercase text-[#C8851A] hover:text-[#9A5F0A] transition-colors border-b border-accent-gold/45 pb-1 cursor-pointer"
              >
                <InstagramIcon size={13} color="currentColor" /> Follow Us
              </motion.button>
            </a>
          </div>
        </motion.div>

        {/* Mobile: Horizontal scroll, Desktop: Uniform responsive 4-col grid */}
        <div ref={ref} className="flex overflow-x-auto md:grid md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8 w-full snap-x snap-mandatory scrollbar-hide pb-6 -mx-6 px-6 md:mx-0 md:px-0">
          {images.map((img, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 25 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7, delay: i * 0.05 }}
              className="group relative overflow-hidden cursor-pointer w-[68vw] md:w-full flex-shrink-0 snap-start rounded-[2px] shadow-sm border border-accent-gold/10"
              onClick={() => setLightbox(i)}
            >
              <div className="relative overflow-hidden aspect-[3/4] w-full bg-cream-warm">
                <Image
                  src={img.src}
                  alt={img.alt}
                  fill
                  className="object-cover object-top filter brightness-[0.92] transition-transform duration-1000 ease-[cubic-bezier(0.25,1,0.5,1)] group-hover:scale-105"
                  sizes="(max-width: 768px) 90vw, (max-width: 1024px) 45vw, 22vw"
                />
                
                {/* Champagne Gold Frame overlay */}
                <div className="absolute inset-3 border border-[#E6C280]/40 scale-95 opacity-0 group-hover:scale-100 group-hover:opacity-100 transition-all duration-700 pointer-events-none z-10" />

                {/* Hover Instagram icon overlay */}
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-all duration-500 flex items-center justify-center z-20">
                  <InstagramIcon size={24} color="#FFFBF4" />
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Lightbox Modal */}
      <AnimatePresence>
        {lightbox !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="lightbox z-50 p-4"
            onClick={() => setLightbox(null)}
          >
            {/* Close Button */}
            <button
              onClick={() => setLightbox(null)}
              className="absolute top-4 right-4 z-50 w-10 h-10 rounded-full flex items-center justify-center bg-black/40 hover:bg-black/60 transition-colors text-white cursor-pointer"
              aria-label="Close Lightbox"
            >
              <X size={18} />
            </button>

            {/* Prev Button */}
            <button
              onClick={(e) => { e.stopPropagation(); prev(); }}
              className="absolute left-4 top-1/2 -translate-y-1/2 z-50 w-10 h-10 rounded-full flex items-center justify-center bg-black/40 hover:bg-black/60 transition-colors text-white cursor-pointer"
              aria-label="Previous image"
            >
              <ChevronLeft size={20} />
            </button>

            {/* Next Button */}
            <button
              onClick={(e) => { e.stopPropagation(); next(); }}
              className="absolute right-4 top-1/2 -translate-y-1/2 z-50 w-10 h-10 rounded-full flex items-center justify-center bg-black/40 hover:bg-black/60 transition-colors text-white cursor-pointer"
              aria-label="Next image"
            >
              <ChevronRight size={20} />
            </button>

            {/* Image Box */}
            <motion.div
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.95 }}
              className="relative w-full max-w-lg aspect-[3/4] rounded-[2px] overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <Image
                src={images[lightbox].src}
                alt={images[lightbox].alt}
                fill
                className="object-cover object-top"
                sizes="(max-width: 768px) 100vw, 600px"
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
