"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowRight } from "lucide-react";

const runwayPanels = [
  {
    step: "Atelier Step 01",
    title: "The Vision & Sketch",
    italic: "Where thoughts take form",
    desc: "Every couture ensemble starts as a hand-drawn sketch, guided by seasonal inspirations, silhouettes, and personal bridal histories.",
    image: "/images/models/brand-story.jpg",
    number: "01",
  },
  {
    step: "Atelier Step 02",
    title: "Thread Sourcing & Looms",
    italic: "The organic thread of legacy",
    desc: "We pick premium Katan silks and raw zari thread by hand from Varanasi, Jaipur, and local craft centers to establish a structural baseline.",
    image: "/images/models/wedding-collection.jpg",
    number: "02",
  },
  {
    step: "Atelier Step 03",
    title: "Zardozi Hand Embroidery",
    italic: "Stitched by generational hands",
    desc: "Craftsmen spend up to 400 hours on a single bridal piece, threading gold wires, pearls, and mirrors onto custom fabrics.",
    image: "/images/models/hero_bridal.png",
    number: "03",
  },
  {
    step: "Atelier Step 04",
    title: "The Keepsake Box",
    italic: "Delivered in royal custody",
    desc: "Your garment arrives tucked inside a velvet-lined heritage wooden chest, preserving its structure for generations.",
    image: "/images/models/festive-collection.jpg",
    number: "04",
  },
];

export default function RunwaySection() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      // 1. Desktop progress line drawing
      const desktopLine = document.querySelector(".timeline-progress-line");
      if (desktopLine) {
        gsap.fromTo(desktopLine, 
          { scaleY: 0 },
          { 
            scaleY: 1, 
            ease: "none",
            transformOrigin: "top center",
            scrollTrigger: {
              trigger: ".timeline-items-wrapper",
              start: "top 35%",
              end: "bottom 65%",
              scrub: true,
            }
          }
        );
      }

      // 2. Individual step animations
      const items = gsap.utils.toArray(".timeline-item");
      if (items.length === 0) return;

      items.forEach((item: any) => {
        const dot = item.querySelector(".timeline-dot-container");
        const activeDot = item.querySelector(".timeline-dot-active");
        const imgWrapper = item.querySelector(".timeline-image-wrapper");
        const parallaxContainer = item.querySelector(".timeline-image-parallax");
        const number = item.querySelector(".timeline-number");
        const stepName = item.querySelector(".timeline-step-name");
        const title = item.querySelector(".timeline-title");
        const italic = item.querySelector(".timeline-italic");
        const desc = item.querySelector(".timeline-desc");
        const divider = item.querySelector(".timeline-divider");
        const nextStep = item.querySelector(".timeline-next-step");

        // Subtle image parallax scroll trigger
        if (parallaxContainer) {
          gsap.fromTo(parallaxContainer,
            { yPercent: -8 },
            { 
              yPercent: 8,
              ease: "none",
              scrollTrigger: {
                trigger: imgWrapper,
                start: "top bottom",
                end: "bottom top",
                scrub: true,
              }
            }
          );
        }

        // Active dot glow scroll trigger
        if (activeDot) {
          gsap.fromTo(activeDot,
            { opacity: 0, scale: 0.5 },
            {
              opacity: 1,
              scale: 1,
              duration: 0.6,
              ease: "power2.out",
              scrollTrigger: {
                trigger: item,
                start: "top 55%",
                end: "bottom 45%",
                toggleActions: "play reverse play reverse",
              }
            }
          );
        }

        // Main reveal timeline for step details
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: item,
            start: "top 78%",
            toggleActions: "play none none reverse",
          }
        });

        // Soft reveal for timeline dot container
        if (dot) {
          tl.fromTo(dot,
            { opacity: 0 },
            { opacity: 1, duration: 0.4 },
            "0"
          );
        }

        // Clip-path image reveal
        if (imgWrapper) {
          tl.fromTo(imgWrapper,
            { clipPath: "polygon(0 0, 100% 0, 100% 0, 0 0)" },
            { clipPath: "polygon(0 0, 100% 0, 100% 100%, 0 100%)", duration: 1.4, ease: "power4.inOut" },
            "0.1"
          );
        }

        // Watermark step number fade-in
        if (number) {
          tl.fromTo(number,
            { opacity: 0, y: 15 },
            { opacity: 0.05, y: 0, duration: 1.0, ease: "power3.out" },
            "0.2"
          );
        }

        // Headings fade upward
        const headingElements = [stepName, title].filter(Boolean);
        if (headingElements.length > 0) {
          tl.fromTo(headingElements,
            { opacity: 0, y: 30 },
            { opacity: 1, y: 0, duration: 0.8, stagger: 0.12, ease: "power3.out" },
            "0.3"
          );
        }

        // Body elements stagger reveal
        const bodyElements = [italic, desc, divider, nextStep].filter(Boolean);
        if (bodyElements.length > 0) {
          tl.fromTo(bodyElements,
            { opacity: 0, y: 20 },
            { opacity: 1, y: 0, duration: 0.8, stagger: 0.12, ease: "power3.out" },
            "0.5"
          );
        }
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <div 
      ref={containerRef} 
      className="relative py-16 sm:py-20 md:py-24 overflow-hidden w-full bg-[#FFFBF4]"
    >
      {/* CSS Pulse & Gradient animations for premium details */}
      <style>{`
        @keyframes lux-pulse {
          0% {
            transform: scale(0.9);
            box-shadow: 0 0 0 0 rgba(200, 133, 26, 0.45);
          }
          70% {
            transform: scale(1.2);
            box-shadow: 0 0 0 16px rgba(200, 133, 26, 0);
          }
          100% {
            transform: scale(0.9);
            box-shadow: 0 0 0 0 rgba(200, 133, 26, 0);
          }
        }
        .lux-pulse-dot {
          animation: lux-pulse 2.5s infinite cubic-bezier(0.25, 0, 0, 1);
        }
        .timeline-line-static {
          background: linear-gradient(to bottom, 
            rgba(200, 133, 26, 0) 0%,
            rgba(200, 133, 26, 0.25) 10%,
            rgba(200, 133, 26, 0.25) 90%,
            rgba(200, 133, 26, 0) 100%
          );
        }
        .timeline-line-active {
          background: linear-gradient(to bottom, 
            rgba(200, 133, 26, 0) 0%,
            rgba(200, 133, 26, 1) 10%,
            rgba(200, 133, 26, 1) 90%,
            rgba(200, 133, 26, 0) 100%
          );
          box-shadow: 0 0 10px rgba(200, 133, 26, 0.5);
        }
      `}</style>

      {/* Section Title */}
      <div className="container mx-auto px-6 sm:px-12 lg:px-24 mb-16 md:mb-20 text-center">
        <span className="label block mb-3 text-gold tracking-[0.3em] uppercase text-[10px] font-accent">
          — The Atelier Journey
        </span>
        <h2 className="heading-xl text-text-primary text-4xl sm:text-5xl lg:text-6xl font-light font-display">
          The Journey of a <em className="text-gold font-serif italic font-medium">Thread</em>
        </h2>
        <div className="divider-line mx-auto mt-4 w-20 h-[1.5px]" style={{ background: "linear-gradient(90deg, transparent, var(--gold), transparent)" }} />
      </div>

      {/* Timeline container */}
      <div className="container mx-auto px-4 sm:px-8 lg:px-16 relative timeline-items-wrapper max-w-[1100px]">
        
        {/* Background static line - Desktop center */}
        <div className="absolute top-16 bottom-16 left-1/2 w-[2px] transform -translate-x-1/2 pointer-events-none hidden md:block timeline-line-static will-change-transform" />
        
        {/* Active gold progress line - Desktop center */}
        <div className="timeline-progress-line absolute top-16 bottom-16 left-1/2 w-[3.5px] transform -translate-x-1/2 pointer-events-none hidden md:block timeline-line-active will-change-transform" />

        {/* Steps List */}
        <div className="flex flex-col gap-20 md:gap-24 w-full relative">
          {runwayPanels.map((panel, idx) => (
            <div 
              key={idx} 
              className={`timeline-item flex flex-col md:flex-row items-center justify-between gap-8 md:gap-12 lg:gap-16 w-full relative ${
                idx % 2 === 1 ? "md:flex-row-reverse" : "md:flex-row"
              }`}
            >
              {/* Connector Dot (Desktop Center) */}
              <div className="timeline-dot-container absolute top-1/2 left-1/2 w-10 h-10 -translate-x-1/2 -translate-y-1/2 hidden md:flex items-center justify-center pointer-events-none z-10">
                {/* Permanent static backing dot */}
                <div className="w-2.5 h-2.5 rounded-full bg-accent-gold/30" />
                
                {/* Active glow dot */}
                <div className="timeline-dot-active absolute inset-0 flex items-center justify-center">
                  <div className="absolute w-10 h-10 rounded-full bg-accent-gold/35 blur-[3px] lux-pulse-dot" />
                  <div className="absolute w-7 h-7 rounded-full border border-accent-gold/60 shadow-[0_0_10px_rgba(200,133,26,0.4)]" />
                  <div className="w-4 h-4 rounded-full bg-accent-gold border-2 border-[#FFFBF4] shadow-[0_0_15px_rgba(200,133,26,0.75)]" />
                </div>
              </div>

              {/* Step Image */}
              <div className="w-full md:w-[46%] relative overflow-hidden flex justify-center">
                <div 
                  className="group timeline-image-wrapper relative overflow-hidden aspect-[3/4] w-full max-w-[380px] shadow-luxury rounded-[2px] border border-accent-gold/20"
                >
                  {/* Parallax Container */}
                  <div className="timeline-image-parallax absolute inset-0 w-full h-[120%] -top-[10%] will-change-transform">
                    <Image
                      src={panel.image}
                      alt={panel.title}
                      fill
                      className="timeline-image object-cover object-top filter brightness-[0.94] transition-transform duration-[1500ms] ease-out md:group-hover:scale-108"
                      sizes="(max-width: 768px) 100vw, 45vw"
                      priority={idx === 0}
                    />
                  </div>
                </div>
              </div>

              {/* Step Text Details */}
              <div className="w-full md:w-[46%] flex flex-col justify-center items-center md:items-start text-center md:text-left px-4 md:px-0 relative py-4">
                {/* Step Number Watermark (Very Large Editorial Serif) */}
                <div className="timeline-number absolute -top-8 md:-top-16 left-1/2 md:left-0 transform -translate-x-1/2 md:translate-x-0 font-serif text-[8rem] md:text-[10rem] font-light text-accent-gold select-none pointer-events-none leading-none z-0" style={{ opacity: 0.05 }}>
                  {panel.number}
                </div>
                
                <div className="relative z-10 flex flex-col items-center md:items-start w-full">
                  {/* Step Name */}
                  <div className="timeline-step-name label text-[10px] tracking-[0.3em] text-accent-gold uppercase font-accent mb-3">
                    {panel.step}
                  </div>

                  {/* Title */}
                  <h3 className="timeline-title font-serif text-2xl sm:text-3xl md:text-4xl font-light text-text-primary mb-3 tracking-wide leading-tight">
                    {panel.title}
                  </h3>
                  
                  {/* Italic phrase */}
                  <em className="timeline-italic font-serif text-sm sm:text-base text-accent-gold mb-4 block italic">
                    &ldquo;{panel.italic}&rdquo;
                  </em>

                  {/* Description */}
                  <p className="timeline-desc font-body text-xs sm:text-sm leading-relaxed md:leading-[1.75] text-text-secondary max-w-[420px]">
                    {panel.desc}
                  </p>

                  {/* Elegant Divider (Mobile only) */}
                  <div className="timeline-divider w-20 h-[1px] bg-accent-gold/20 my-6 block md:hidden" />

                  {/* Next Step Link CTA */}
                  {idx < runwayPanels.length - 1 ? (
                    <div className="timeline-next-step mt-6">
                      <button 
                        onClick={() => {
                          const items = document.querySelectorAll(".timeline-item");
                          items[idx + 1]?.scrollIntoView({ behavior: "smooth", block: "center" });
                        }}
                        className="font-accent text-[10px] tracking-[0.22em] uppercase text-accent-gold hover:text-text-primary transition-all duration-300 flex items-center gap-2 group cursor-pointer"
                      >
                        Next Step <ArrowRight size={10} className="group-hover:translate-x-1.5 transition-transform" />
                      </button>
                    </div>
                  ) : (
                    <div className="timeline-next-step mt-6 opacity-0 h-4 pointer-events-none md:block" />
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
