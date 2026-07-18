"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Heart, ArrowRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import LuxuryButton from "@/components/LuxuryButton";

const InstagramIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
    <circle cx="12" cy="12" r="4" />
    <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
  </svg>
);

const FacebookIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
  </svg>
);

const PinterestIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 2C6.48 2 2 6.48 2 12c0 4.23 2.63 7.85 6.35 9.32-.09-.79-.17-2 .03-2.87.19-.79 1.22-5.18 1.22-5.18s-.31-.62-.31-1.54c0-1.44.83-2.52 1.88-2.52.88 0 1.31.66 1.31 1.46 0 1.89-1.2 4.71-1.82 7.33-.24 1.03.52 1.87 1.54 1.87 1.85 0 3.27-1.95 3.27-4.76 0-2.49-1.79-4.23-4.34-4.23-2.96 0-4.7 2.22-4.7 4.51 0 .9.35 1.86.78 2.38.09.1.1.19.07.3-.08.33-.26 1.05-.29 1.19-.04.18-.14.22-.32.14-1.22-.57-1.99-2.35-1.99-3.78 0-3.08 2.24-5.91 6.45-5.91 3.39 0 6.01 2.41 6.01 5.63 0 3.37-2.12 6.08-5.07 6.08-1 0-1.93-.52-2.25-1.12l-.61 2.33c-.22.84-.81 1.9-1.21 2.54C10.02 21.84 11 22 12 22c5.52 0 10-4.48 10-10S17.52 2 12 2z" />
  </svg>
);

const collectionsLinks = [
  { label: "Wedding Collection", href: "/collections?category=Wedding+Collection" },
  { label: "Festive Collection", href: "/collections?category=Festive+Collection" },
  { label: "Designer Suits", href: "/collections?category=Designer+Suits" },
  { label: "New Arrivals", href: "/collections" },
];

const customerCareLinks = [
  { label: "Contact Us", href: "/contact" },
  { label: "Sizing Guide", href: "/contact" },
  { label: "Care Instructions", href: "/contact" },
  { label: "Custom Orders", href: "/contact" },
  { label: "FAQs", href: "/contact" },
];

const marqueeWords = [
  "Crafted with Love", "✦", "Est. 2015", "✦", "Premium Atelier", "✦", "Luxury Ethnic Wear", "✦",
  "Crafted with Love", "✦", "Est. 2015", "✦", "Premium Atelier", "✦", "Luxury Ethnic Wear", "✦"
];

const footerVariants = {
  hidden: { opacity: 0, y: 35 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 1.1,
      ease: [0.76, 0, 0.24, 1] as [number, number, number, number],
    }
  }
};

export default function Footer() {
  const [email, setEmail] = useState("");
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [openSection, setOpenSection] = useState<string | null>(null);

  const toggleSection = (section: string) => {
    setOpenSection(openSection === section ? null : section);
  };

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      setIsSubscribed(true);
      setEmail("");
      setTimeout(() => setIsSubscribed(false), 5000);
    }
  };

  return (
    <footer className="border-t border-[#E6C280]/20 relative overflow-hidden bg-[#121213]">
      <div className="absolute inset-0 bg-radial-at-t from-[#1C1C1E] via-transparent to-transparent opacity-40 pointer-events-none" />
      
      {/* Main Spacious Editorial Layout */}
      <div className="py-16 sm:py-24 md:py-36 editorial-container relative z-10">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
          variants={footerVariants}
          className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-24 items-start"
        >
          {/* Column 1: Brand, Logo & Story (4 Cols) */}
          <div className="lg:col-span-4 flex flex-col items-start pr-0 lg:pr-8">
            <Link href="/" className="inline-block mb-8 lg:mb-12 cursor-pointer">
              <div className="relative h-16 w-52 lg:h-24 lg:w-72">
                <Image
                  src="/Logo/image.png?v=3"
                  alt="SANA Fashion House"
                  fill
                  className="object-contain object-left filter brightness-0 invert"
                  unoptimized
                />
              </div>
            </Link>

            <p className="font-serif italic text-sm text-[#FFFBF4]/60 leading-loose mb-8 lg:mb-12">
              SANA is a premium designer fashion house specializing in luxury bridal wear, couture lehengas, and designer silhouettes. Built on generations of artisan craftsmanship and heritage textile hand-weaving, every piece is made to measure to celebrate life's most unforgettable milestones.
            </p>

            <div className="font-body text-sm leading-loose text-[#FFFBF4]/40 mb-8 lg:mb-12">
              <h5 className="font-accent text-[10px] tracking-[0.25em] uppercase text-[#E6C280] mb-4">Mumbai Atelier</h5>
              <p>Shop no 2, Navrang Bldg, Opp. Bharat Cineplex,</p>
              <p>New Mill Road, Kurla (W), Mumbai - 400070</p>
            </div>

            {/* Circular luxury social buttons */}
            <div className="flex gap-4">
              <a
                href="https://www.instagram.com/sana___fashion___01/"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 lg:w-12 lg:h-12 rounded-full border border-[#E6C280]/20 flex items-center justify-center text-[#E6C280] hover:text-[#121213] hover:bg-[#E6C280] hover:border-[#E6C280] transition-all duration-[350ms] cubic-bezier(0.22,1,0.36,1) transform hover:-translate-y-1 hover:shadow-[0_8px_20px_rgba(230,194,128,0.3)] cursor-pointer"
                aria-label="Instagram"
              >
                <InstagramIcon />
              </a>
              <a
                href="#"
                className="w-10 h-10 lg:w-12 lg:h-12 rounded-full border border-[#E6C280]/20 flex items-center justify-center text-[#E6C280] hover:text-[#121213] hover:bg-[#E6C280] hover:border-[#E6C280] transition-all duration-[350ms] cubic-bezier(0.22,1,0.36,1) transform hover:-translate-y-1 hover:shadow-[0_8px_20px_rgba(230,194,128,0.3)] cursor-pointer"
                aria-label="Facebook"
              >
                <FacebookIcon />
              </a>
              <a
                href="#"
                className="w-10 h-10 lg:w-12 lg:h-12 rounded-full border border-[#E6C280]/20 flex items-center justify-center text-[#E6C280] hover:text-[#121213] hover:bg-[#E6C280] hover:border-[#E6C280] transition-all duration-[350ms] cubic-bezier(0.22,1,0.36,1) transform hover:-translate-y-1 hover:shadow-[0_8px_20px_rgba(230,194,128,0.3)] cursor-pointer"
                aria-label="Pinterest"
              >
                <PinterestIcon />
              </a>
            </div>
          </div>

          {/* Column 2: Collections (2 Cols Desktop, Accordion Mobile) */}
          {/* Desktop Link Grid */}
          <div className="hidden lg:block lg:col-span-2">
            <h4 className="font-accent text-[10px] tracking-[0.28em] uppercase text-[#E6C280] mb-8 lg:mb-10">Collections</h4>
            <ul className="flex flex-col gap-4">
              {collectionsLinks.map((l) => (
                <li key={l.label}>
                  <Link
                    href={l.href}
                    className="relative py-1 block text-sm text-[#FFFBF4]/60 tracking-wide hover:text-[#E6C280] transition-colors duration-300 group max-w-max cursor-pointer"
                  >
                    {l.label}
                    <span className="absolute bottom-0 left-0 w-0 h-[1.5px] bg-[#E6C280] transition-all duration-300 group-hover:w-full" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Mobile Accordion */}
          <div className="block lg:hidden w-full border-b border-[#E6C280]/10 py-2">
            <button
              onClick={() => toggleSection("collections")}
              className="w-full flex justify-between items-center py-4 cursor-pointer text-left"
            >
              <h4 className="font-serif text-sm tracking-[0.18em] uppercase text-[#E6C280]">Collections</h4>
              <span className="text-[#E6C280] font-light text-lg">{openSection === "collections" ? "−" : "+"}</span>
            </button>
            <AnimatePresence initial={false}>
              {openSection === "collections" && (
                <motion.ul
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                  className="flex flex-col gap-3 overflow-hidden pb-4 pl-2"
                >
                  {collectionsLinks.map((l) => (
                    <li key={l.label}>
                      <Link
                        href={l.href}
                        className="text-sm text-[#FFFBF4]/70 hover:text-[#E6C280] transition-colors duration-300 block py-0.5 cursor-pointer"
                      >
                        {l.label}
                      </Link>
                    </li>
                  ))}
                </motion.ul>
              )}
            </AnimatePresence>
          </div>

          {/* Column 3: Customer Care (2 Cols Desktop, Accordion Mobile) */}
          {/* Desktop Link Grid */}
          <div className="hidden lg:block lg:col-span-2">
            <h4 className="font-accent text-[10px] tracking-[0.28em] uppercase text-[#E6C280] mb-8 lg:mb-10">Customer Care</h4>
            <ul className="flex flex-col gap-4">
              {customerCareLinks.map((l) => (
                <li key={l.label}>
                  <Link
                    href={l.href}
                    className="relative py-1 block text-sm text-[#FFFBF4]/60 tracking-wide hover:text-[#E6C280] transition-colors duration-300 group max-w-max cursor-pointer"
                  >
                    {l.label}
                    <span className="absolute bottom-0 left-0 w-0 h-[1px] bg-[#E6C280] transition-all duration-300 group-hover:w-full" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Mobile Accordion */}
          <div className="block lg:hidden w-full border-b border-[#E6C280]/10 py-2">
            <button
              onClick={() => toggleSection("care")}
              className="w-full flex justify-between items-center py-4 cursor-pointer text-left"
            >
              <h4 className="font-serif text-sm tracking-[0.18em] uppercase text-[#E6C280]">Customer Care</h4>
              <span className="text-[#E6C280] font-light text-lg">{openSection === "care" ? "−" : "+"}</span>
            </button>
            <AnimatePresence initial={false}>
              {openSection === "care" && (
                <motion.ul
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                  className="flex flex-col gap-3.5 overflow-hidden pb-5 pl-2"
                >
                  {customerCareLinks.map((l) => (
                    <li key={l.label}>
                      <Link
                        href={l.href}
                        className="text-base text-[#FFFBF4]/70 hover:text-[#E6C280] transition-colors duration-300 block py-1 cursor-pointer"
                      >
                        {l.label}
                      </Link>
                    </li>
                  ))}
                </motion.ul>
              )}
            </AnimatePresence>
          </div>

          {/* Column 4: Newsletter & CTA Services (4 Cols) */}
          <div className="lg:col-span-4 flex flex-col items-start w-full">
            <h4 className="font-accent text-[10px] tracking-[0.28em] uppercase text-[#E6C280] mb-6 lg:mb-10">Atelier Services</h4>
            
            {/* Book Appointment CTA Button */}
            <div className="mb-8 lg:mb-12 w-full">
              <Link href="/contact" className="w-full block">
                <LuxuryButton variant="primary" className="w-full">
                  Book Appointment
                </LuxuryButton>
              </Link>
            </div>

            {/* Newsletter Subscription block */}
            <div className="w-full">
              <h5 className="font-accent text-[10px] tracking-[0.2em] uppercase text-[#E6C280] mb-3">Atelier Newsletter</h5>
              <p className="font-serif italic text-sm text-[#FFFBF4]/50 mb-6 leading-loose">
                Join the SANA inner circle for invitations to private flagship previews and collection launches.
              </p>
              
              <form onSubmit={handleSubscribe} className="w-full flex flex-col sm:flex-row gap-3">
                <div className="relative flex-grow w-full">
                  <input
                    type="email"
                    required
                    placeholder="Enter your email address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-[#1A1A1B] text-[#FFFBF4] text-sm font-body placeholder-[#FFFBF4]/30 focus:outline-none border border-[#E6C280]/20 focus:border-[#E6C280] focus:ring-2 focus:ring-[#E6C280]/20 rounded-[12px] px-6 h-[52px] transition-all duration-[250ms] ease-[cubic-bezier(0.22,1,0.36,1)]"
                  />
                </div>
                <LuxuryButton type="submit" variant="primary" className="whitespace-nowrap">
                  Subscribe
                </LuxuryButton>
              </form>
              
              <AnimatePresence>
                {isSubscribed && (
                  <motion.p
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="text-[10px] text-[#E6C280] font-body mt-3"
                  >
                    Thank you for subscribing to SANA newsletter.
                  </motion.p>
                )}
              </AnimatePresence>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Gold Marquee Strip Divider */}
      <div className="marquee-wrapper overflow-hidden border-y border-[#E6C280]/15 bg-[#18181a]">
        <div className="marquee-track py-4">
          {marqueeWords.map((w, i) => (
            <span key={i} className="font-accent text-[9.5px] tracking-[0.25em] uppercase px-5 flex-shrink-0" style={{ color: "rgba(253,235,210,0.85)", whiteSpace: "nowrap" }}>
              {w}
            </span>
          ))}
        </div>
      </div>

      {/* Bottom visually separated copyright bar */}
      <div className="border-t border-[#E6C280]/10 bg-[#0e0e10] py-10 lg:py-16 relative z-10">
        <div className="editorial-container flex flex-col items-center gap-8 text-center">
          {/* Developer Credit */}
          <div className="flex flex-col items-center gap-3 group my-4 lg:my-6">
            <span className="font-accent text-[8.5px] tracking-[0.25em] uppercase text-[#FFFBF4]/60">
              Crafted & Developed by
            </span>
            <a
              href="https://affan.nexcoreinstitute.org"
              target="_blank"
              rel="noopener noreferrer"
              className="dev-credit-link"
            >
              AFFAN KHAN
            </a>
          </div>

          {/* Thin luxury divider line */}
          <div className="w-full max-w-[240px] h-[1px] bg-[#E6C280]/10 my-1" />

          {/* Copyright, Policy Links, and Crafted by */}
          <div className="w-full flex flex-col md:flex-row items-center justify-between gap-6 pt-2">
            <p className="font-accent text-[9px] tracking-[0.18em] text-[#FFFBF4]/40">
              © {new Date().getFullYear()} SANA FASHION HOUSE. ALL RIGHTS RESERVED.
            </p>
            <div className="flex gap-8 font-accent text-[9px] tracking-[0.18em] uppercase text-[#FFFBF4]/50">
              <Link href="/privacy" className="hover:text-[#E6C280] transition-colors duration-300 cursor-pointer">
                Privacy Policy
              </Link>
              <Link href="/terms" className="hover:text-[#E6C280] transition-colors duration-300 cursor-pointer">
                Terms & Conditions
              </Link>
            </div>
            <p className="font-accent text-[9px] tracking-[0.18em] text-[#FFFBF4]/30 flex items-center gap-1.5 justify-center">
              Crafted with <Heart size={8} className="text-[#C8851A] fill-[#C8851A]" /> for luxury ethnic heritage
            </p>
          </div>
        </div>
      </div>

      <style>{`
        .dev-credit-link {
          font-family: var(--font-serif);
          font-size: 14px;
          letter-spacing: 0.25em;
          color: #E6C280;
          text-transform: uppercase;
          font-weight: 400;
          text-decoration: none;
          display: inline-block;
          transition: all 300ms cubic-bezier(0.22, 1, 0.36, 1);
        }
        .dev-credit-link:hover {
          transform: translateY(-1.5px);
          opacity: 0.9;
          color: #FFFBF4;
        }
      `}</style>
    </footer>
  );
}
