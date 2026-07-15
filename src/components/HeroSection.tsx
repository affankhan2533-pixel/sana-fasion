"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowRight } from "lucide-react";
import LuxuryButton from "@/components/LuxuryButton";

const slides = [
  {
    image: "/images/models/hero_bridal.png",
    label: "Bridal Couture '25",
    lines: ["THE ART OF", "GENERATIONAL", "LUXURY"],
    sub: "Exquisite hand-drawn bridal ensembles featuring pure zardozi wirework crafted by master artisans.",
  },
  {
    image: "/images/models/hero_editorial.png",
    label: "The Festive Edit",
    lines: ["DRESSED IN", "GOLDEN LIGHT", "AND SPLENDOUR"],
    sub: "Vibrant jewel-toned silks and shimmering threadwork designed for celebrations that demand majesty.",
  },
  {
    image: "/images/models/hero_3.png",
    label: "Bespoke Atelier",
    lines: ["CRAFTING YOUR", "MOST BEAUTIFUL", "CHAPTER"],
    sub: "Indulge in a private heritage styling consultation curated exclusively for the discerning bride.",
  },
];

const marqueeItems = [
  "Bridal Couture", "✦", "Festive Edit", "✦", "Designer Suits", "✦", "Luxury Heritage Wear", "✦",
  "Bridal Couture", "✦", "Festive Edit", "✦", "Designer Suits", "✦", "Luxury Heritage Wear", "✦",
];

interface HeroSectionProps {
  isLoaded?: boolean;
}

export default function HeroSection({ isLoaded = true }: HeroSectionProps) {
  const [current, setCurrent] = useState(0);
  const [mouseOffset, setMouseOffset] = useState({ x: 0, y: 0 });
  const heroRef = useRef<HTMLElement>(null);
  
  const labelRef = useRef<HTMLSpanElement>(null);
  const titleContainerRef = useRef<HTMLHeadingElement>(null);
  const subRef = useRef<HTMLParagraphElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const bgY = useTransform(scrollYProgress, [0, 1], ["0%", "20%"]);
  const textY = useTransform(scrollYProgress, [0, 1], ["0%", "10%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.6], [1, 0]);

  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  useEffect(() => {
    if (isMobile) return; // Skip mouse parallax on mobile
    const handleMouseMove = (e: MouseEvent) => {
      // Calculate responsive offsets (max 15px shift)
      const x = (e.clientX / window.innerWidth - 0.5) * 15;
      const y = (e.clientY / window.innerHeight - 0.5) * 15;
      setMouseOffset({ x, y });
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [isMobile]);


  const animateIn = () => {
    const tl = gsap.timeline({ defaults: { ease: "power4.out" } });

    // Grab title lines
    const titleElements = titleContainerRef.current?.querySelectorAll(".hero-title-line");
    
    gsap.killTweensOf([
      labelRef.current,
      titleElements,
      subRef.current,
      ctaRef.current,
    ]);

    tl.set([labelRef.current, subRef.current, ctaRef.current], { opacity: 0, y: 30 });
    if (titleElements) {
      tl.set(titleElements, { opacity: 0, y: 100 });
    }

    // Continuous slow zoom for the active slide background
    if (!isMobile) {
      gsap.fromTo(`.hero-bg-img-${current}`,
        { scale: 1.18 },
        { scale: 1.03, duration: 8.5, ease: "power2.out" }
      );
    }

    tl.to(labelRef.current, { opacity: 1, y: 0, duration: 0.8 });
    if (titleElements && titleElements.length > 0) {
      tl.to(titleElements, {
        opacity: 1,
        y: 0,
        duration: isMobile ? 0.6 : 1.2,
        stagger: isMobile ? 0.1 : 0.18,
      }, "-=0.6");
    }
    tl.to(subRef.current, { opacity: 1, y: 0, duration: 0.8 }, "-=0.5");
    tl.to(ctaRef.current, { opacity: 1, y: 0, duration: 0.8 }, "-=0.6");
  };

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    // Dynamic exit and overlay scale-fade on scroll
    const scrollCtx = gsap.context(() => {
      gsap.timeline({
        scrollTrigger: {
          trigger: heroRef.current,
          start: "top top",
          end: "bottom top",
          scrub: true,
        }
      })
      .to(".hero-bg-wrapper", { scale: 0.94, opacity: 0.35, ease: "none" }, 0)
      .to(".hero-overlay-scroll", { opacity: 0.9, ease: "none" }, 0);
    });

    return () => {
      scrollCtx.revert();
    };
  }, []);

  // Trigger animations once preloader completes
  useEffect(() => {
    if (isLoaded) {
      const timer = setTimeout(animateIn, 150);
      return () => clearTimeout(timer);
    }
  }, [isLoaded, current]);

  // Auto slide
  useEffect(() => {
    const t = setInterval(() => setCurrent(c => (c + 1) % slides.length), 7500);
    return () => clearInterval(t);
  }, []);

  const s = slides[current];

  return (
    <section 
      ref={heroRef} 
      className="relative overflow-hidden w-full" 
      style={{ height: "100vh", minHeight: "600px", background: "var(--parchment)" }}
    >
      {/* Immersive slide backgrounds using dynamic clip-path reveals */}
      {slides.map((sl, i) => (
        <motion.div
          key={i}
          className="absolute inset-0 hero-bg-wrapper"
          style={{ y: i === current ? bgY : "0%", zIndex: i === current ? 1 : 0 }}
          initial={false}
          animate={{ 
            opacity: i === current ? 1 : 0,
            clipPath: !isMobile
              ? (i === current 
                  ? "polygon(0 0, 100% 0, 100% 100%, 0 100%)" 
                  : "polygon(100% 0, 100% 0, 100% 100%, 100% 100%)")
              : undefined
          }}
          transition={{ duration: isMobile ? 0.6 : 1.5, ease: [0.76, 0, 0.24, 1] }}
        >
          <div className="relative w-full h-full overflow-hidden">
            <motion.div
              className="absolute inset-0 w-full h-full scale-[1.05]"
              animate={{ x: -mouseOffset.x, y: -mouseOffset.y }}
              transition={{ type: "tween", ease: "easeOut", duration: 0.8 }}
            >
              <Image
                src={sl.image}
                alt={sl.label}
                fill
                priority={i === 0}
                className={`object-cover object-top filter brightness-[0.82] hero-bg-img-${i}`}
                sizes="100vw"
              />
            </motion.div>
            {/* Vibrant warm cinematic overlays */}
            <div className="absolute inset-0 z-10" style={{ background: "linear-gradient(120deg, rgba(28,10,5,0.75) 0%, rgba(80,30,10,0.40) 55%, rgba(180,80,20,0.1) 100%)" }} />
            <div className="absolute inset-0 z-10 hero-overlay-scroll bg-ink opacity-0 pointer-events-none" />
            <div className="absolute bottom-0 left-0 right-0 z-10" style={{ height: "40%", background: "linear-gradient(to top, rgba(28,10,5,0.85) 0%, transparent 100%)" }} />
          </div>
        </motion.div>
      ))}

      {/* Floating particles background */}
      <div className="absolute inset-0 z-10 pointer-events-none overflow-hidden">
        {Array.from({ length: 15 }).map((_, idx) => (
          <motion.div
            key={idx}
            className="absolute w-[2.5px] h-[2.5px] rounded-full"
            style={{
              left: `${10 + idx * 6.5}%`,
              top: "100%",
              backgroundColor: "var(--accent-gold-light)",
              opacity: 0.15 + (idx % 3) * 0.15,
            }}
            animate={{
              y: ["0vh", "-105vh"],
              opacity: [0, 0.5, 0.5, 0],
            }}
            transition={{
              duration: 9 + (idx % 5) * 3,
              repeat: Infinity,
              delay: idx * 0.5,
              ease: "linear",
            }}
          />
        ))}
      </div>

      {/* Decorative High-Fashion Frame Lines */}
      <div className="absolute top-24 bottom-10 left-6 right-6 border border-[rgba(200,133,26,0.18)] z-10 pointer-events-none hidden md:block">
        <div className="absolute top-0 left-0 w-8 h-8 border-t border-l border-[var(--gold-light)]"></div>
        <div className="absolute top-0 right-0 w-8 h-8 border-t border-r border-[var(--gold-light)]"></div>
        <div className="absolute bottom-0 left-0 w-8 h-8 border-b border-l border-[var(--gold-light)]"></div>
        <div className="absolute bottom-0 right-0 w-8 h-8 border-b border-r border-[var(--gold-light)]"></div>
      </div>

      {/* Hero Content Panel */}
      <motion.div
        style={{ y: textY, opacity }}
        className="relative z-20 h-full flex flex-col justify-center editorial-container hero-content-inner"
      >
        {/* Label */}
        <span 
          ref={labelRef} 
          className="label mb-4 sm:mb-5 block text-xs" 
          style={{ color: "var(--gold-light)", opacity: 0 }}
        >
          — {s.label}
        </span>

        {/* Headline */}
        <h1 
          ref={titleContainerRef}
          className="mb-5 sm:mb-7 flex flex-col gap-1 sm:gap-2" 
          style={{ lineHeight: 0.95 }}
        >
          {s.lines.map((line, i) => (
            <span key={`${current}-${i}`} className="block overflow-hidden py-1">
              <span
                className="hero-title-line font-display block"
                style={{
                  fontSize: "clamp(36px, 8.5vw, 105px)",
                  fontWeight: 300,
                  letterSpacing: "-0.015em",
                  color: i === 1 ? "var(--gold-light)" : "white",
                  fontStyle: i === 1 ? "italic" : "normal",
                  transform: "translateY(100%)",
                }}
              >
                {line}
              </span>
            </span>
          ))}
        </h1>

        {/* Subtitle */}
        <p
          ref={subRef}
          className="font-body mb-8 sm:mb-10 max-w-sm sm:max-w-md text-sm md:text-base leading-relaxed"
          style={{ color: "rgba(253,252,247,0.65)", opacity: 0 }}
        >
          {s.sub}
        </p>

        {/* Action Buttons - Animated Independently */}
        <div ref={ctaRef} className="flex flex-wrap gap-4 sm:gap-5" style={{ opacity: 0 }}>
          <Link href="/collections">
            <LuxuryButton variant="primary" showArrow>
              Explore Collections
            </LuxuryButton>
          </Link>
          <Link href="/contact">
            <LuxuryButton variant="secondary" themeType="dark">
              Book Atelier Consult
            </LuxuryButton>
          </Link>
        </div>

        {/* Interactive Slide indicators */}
        <div className="flex items-center gap-3 mt-10 sm:mt-16">
          {slides.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              className="transition-all duration-700 relative py-2"
              aria-label={`Go to slide ${i + 1}`}
            >
              <div 
                style={{
                  height: "1px",
                  width: i === current ? "44px" : "16px",
                  background: i === current ? "var(--gold)" : "rgba(253,252,247,0.25)",
                }}
                className="transition-all duration-750"
              />
            </button>
          ))}
        </div>
      </motion.div>

      {/* Luxury scroll indicator */}
      <div className="absolute bottom-12 right-8 sm:right-16 z-20 flex-col items-center gap-3 hidden sm:flex">
        <span 
          className="font-accent text-[8px] tracking-[0.35em] uppercase text-white/50" 
          style={{ writingMode: "vertical-rl" }}
        >
          Scroll to Atelier
        </span>
        <div className="w-[1px] h-12 bg-white/10 relative overflow-hidden">
          <motion.div 
            className="absolute top-0 inset-x-0 bg-accent-gold" 
            style={{ height: "100%", originY: 0 }}
            animate={{
              y: ["-100%", "100%"]
            }}
            transition={{
              duration: 2.2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
        </div>
      </div>

      {/* Elegant Bottom Marquee Strip */}
      <div 
        className="absolute bottom-0 left-0 right-0 z-20 marquee-wrapper py-3" 
        style={{ 
          background: "linear-gradient(90deg, var(--gold-dark), var(--gold), var(--amber), var(--gold))",
          borderTop: "none"
        }}
      >
        <div className="marquee-track">
          {[...marqueeItems, ...marqueeItems].map((item, i) => (
            <span 
              key={i} 
              className="font-accent text-[8.5px] tracking-[0.28em] uppercase px-6" 
              style={{ color: "#1C0E05", whiteSpace: "nowrap" }}
            >
              {item}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
