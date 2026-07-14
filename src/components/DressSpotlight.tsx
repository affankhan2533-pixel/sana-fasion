"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { Sparkles, Crown, Scissors } from "lucide-react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

const highlights = [
  {
    icon: Sparkles,
    title: "Hand Embroidery",
    desc: "Master artisans spend up to 300 hours hand-threading 14k gold zardozi wires and pearls.",
  },
  {
    icon: Crown,
    title: "Premium Fabrics",
    desc: "Sourced raw Doupion silks and Varanasi brocades establish structural baseline luxury.",
  },
  {
    icon: Scissors,
    title: "Bespoke Tailoring",
    desc: "Individually drafted paper patterns and physical muslin fittings ensure a flawless silhouette.",
  },
];

export default function DressSpotlight() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    // Skip GSAP animations on mobile to prevent blank content
    if (isMobile) return;

    const ctx = gsap.context(() => {
      // 1. Image reveal
      const imgWrapper = document.querySelector(".spotlight-image-wrapper");
      if (imgWrapper) {
        gsap.fromTo(imgWrapper,
          { clipPath: "polygon(0 0, 100% 0, 100% 0, 0 0)" },
          {
            clipPath: "polygon(0 0, 100% 0, 100% 100%, 0 100%)",
            duration: 1.4,
            ease: "power4.inOut",
            scrollTrigger: {
              trigger: imgWrapper,
              start: "top 80%",
              toggleActions: "play none none reverse",
            }
          }
        );
      }

      // 2. Heading and text fade up
      const textElements = gsap.utils.toArray(".spotlight-fade-up");
      if (textElements.length > 0) {
        gsap.fromTo(textElements,
          { opacity: 0, y: 30 },
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            stagger: 0.12,
            ease: "power3.out",
            scrollTrigger: {
              trigger: textElements[0] as Element,
              start: "top 85%",
              toggleActions: "play none none reverse",
            }
          }
        );
      }

      // 3. Stagger highlight cards
      const cards = gsap.utils.toArray(".spotlight-card");
      if (cards.length > 0) {
        gsap.fromTo(cards,
          { opacity: 0, y: 25 },
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            stagger: 0.15,
            ease: "power3.out",
            scrollTrigger: {
              trigger: cards[0] as Element,
              start: "top 85%",
              toggleActions: "play none none reverse",
            }
          }
        );
      }
    }, sectionRef);

    return () => ctx.revert();
  }, [isMobile]);

  return (
    <section ref={sectionRef} className="section py-16 sm:py-24 md:py-32 relative overflow-hidden bg-[#FFF5E6]">
      {/* Subtle top border divider */}
      <div className="absolute top-0 inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-accent-gold/20 to-transparent" />

      <div className="container mx-auto px-4 sm:px-6 md:px-8 max-w-[1200px]">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-center">
          
          {/* Right Column (Garment Image - First on Mobile, Right on Desktop) */}
          <div className="lg:col-span-7 order-first lg:order-last flex justify-center w-full">
            <div className="spotlight-image-wrapper relative w-full max-w-[460px] aspect-[3/4] shadow-[0_16px_50px_rgba(28,14,5,0.18)] border border-[#E6C280]/20 rounded-[2px] overflow-hidden bg-cream-warm">
              <Image
                src="/images/models/hero_bridal.png"
                alt="Signature Bridal Lehenga Spotlight"
                fill
                className="object-cover object-top filter brightness-[0.92] hover:brightness-[0.97] transition-all duration-[1000ms]"
                sizes="(max-width: 768px) 100vw, 55vw"
                priority
              />
              <div className="absolute inset-4 border border-[#E6C280]/15 pointer-events-none rounded-[1px] z-10" />
            </div>
          </div>

          {/* Left Column (Details Text - Second on Mobile, Left on Desktop) */}
          <div className="lg:col-span-5 flex flex-col justify-center w-full">
            <span className="spotlight-fade-up font-accent text-[10px] tracking-[0.25em] uppercase text-gold block mb-3">
              Atelier Craftsmanship
            </span>
            
            <h2 className="spotlight-fade-up font-serif text-4xl sm:text-5xl lg:text-6xl font-light text-text-primary tracking-tight leading-[1.1] mb-5">
              Interactive <span className="italic font-normal text-gold font-serif">Details</span>
            </h2>
            
            <p className="spotlight-fade-up font-body text-xs sm:text-sm text-text-muted leading-relaxed mb-8">
              A dissection of our signature heritage pieces, highlighting the generational artistry and craftsmanship details behind every thread of SANA couture.
            </p>

            {/* Staggered Highlights List */}
            <div className="flex flex-col gap-4 w-full">
              {highlights.map((item, idx) => {
                const IconComponent = item.icon;
                return (
                  <div
                    key={idx}
                    className="spotlight-card group w-full bg-[#FFFBF4] border border-[#E6C280]/20 p-4 sm:p-5 flex gap-4 items-start rounded-[2px] transition-all duration-500 hover:shadow-luxury hover:border-[#E6C280]/60 hover:-translate-y-0.5"
                  >
                    <div className="w-9 h-9 rounded-full bg-[#FFF5E6] flex items-center justify-center text-accent-gold flex-shrink-0 group-hover:bg-[#E6C280] group-hover:text-[#121213] transition-colors duration-300">
                      <IconComponent size={16} />
                    </div>
                    <div>
                      <h3 className="font-serif text-base sm:text-lg text-text-primary font-medium mb-1">
                        {item.title}
                      </h3>
                      <p className="font-body text-xs sm:text-sm text-text-muted leading-relaxed">
                        {item.desc}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}


