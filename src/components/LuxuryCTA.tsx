"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, useInView } from "framer-motion";
import { Send, CheckCircle } from "lucide-react";
import LuxuryButton from "@/components/LuxuryButton";

export default function LuxuryCTA() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-60px" });
  const [form, setForm] = useState({ name: "", email: "", phone: "", service: "", message: "" });
  const [done, setDone] = useState(false);
  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const apiBase = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
      await fetch(`${apiBase}/inquiries`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: form.name, email: form.email, phone: form.phone, subject: form.service || "Inquiry", message: form.message }),
      });
    } catch { /* backend optional */ }
    setLoading(false);
    setDone(true);
  };

  const stagger = { hidden: {}, visible: { transition: { staggerChildren: 0.1 } } };
  const up = { hidden: { opacity: 0, y: 24 }, visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] as [number, number, number, number] } } };

  return (
    <div ref={ref}>
      {/* CTA Banner (Promise Section) */}
      <div className="relative overflow-hidden py-24 sm:py-32 md:py-40 flex items-center justify-center" style={{ background: "linear-gradient(135deg, #2E0D1A 0%, #1C0E05 50%, #1A0A00 100%)" }}>
        {/* BG image */}
        <div className="absolute inset-0 opacity-[0.25]">
          <Image src="/images/models/wedding-collection.jpg" alt="CTA" fill className="object-cover object-top filter brightness-[0.7] contrast-[1.1]" sizes="100vw" />
        </div>
        {/* Dark contrast gradient to make text stand out */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#1C0E05]/95 via-[#2E0D1A]/80 to-[#1C0E05]/95" />

        {/* Vintage corner ornaments */}
        <div className="absolute top-8 left-8 opacity-25 hidden sm:block">
          <svg width="60" height="60" viewBox="0 0 50 50" fill="none">
            <path d="M0 0 L25 0 M0 0 L0 25" stroke="#E6C280" strokeWidth="1" />
          </svg>
        </div>
        <div className="absolute bottom-8 right-8 opacity-25 hidden sm:block">
          <svg width="60" height="60" viewBox="0 0 50 50" fill="none">
            <path d="M50 50 L25 50 M50 50 L50 25" stroke="#E6C280" strokeWidth="1" />
          </svg>
        </div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
          variants={stagger}
          className="relative z-10 editorial-container text-center px-4"
        >
          <motion.span variants={up} className="font-accent text-[11px] tracking-[0.25em] uppercase text-[#E6C280] font-bold block mb-6">
            The Sana Promise
          </motion.span>
          <motion.h2
            variants={up}
            className="font-serif text-4xl sm:text-6xl lg:text-7xl text-white mb-8 mx-auto font-light leading-tight"
            style={{ maxWidth: "900px" }}
          >
            Designed to Make Every <br className="hidden sm:inline" /><span className="italic font-light text-[#E6C280]">Occasion Unforgettable</span>
          </motion.h2>
          <motion.p
            variants={up}
            className="font-body text-sm sm:text-base mb-12 mx-auto max-w-lg font-light leading-relaxed"
            style={{ color: "rgba(255, 245, 230, 0.7)" }}
          >
            From the first consultation to the final fitting, we craft experiences as carefully as we craft your outfit.
          </motion.p>
          <motion.div variants={up} className="flex flex-col sm:flex-row gap-5 justify-center items-center">
            <Link href="#contact-form">
              <LuxuryButton variant="primary" showArrow>
                Book Private Consultation
              </LuxuryButton>
            </Link>
            <a href="https://www.instagram.com/sana___fashion___01/" target="_blank" rel="noopener noreferrer">
              <LuxuryButton variant="secondary" className="!border-[#FFF5E6]/40 !text-[#FFF5E6] hover:!bg-[#FFF5E6] hover:!text-[#121213]">
                View on Instagram
              </LuxuryButton>
            </a>
          </motion.div>
        </motion.div>
      </div>

      {/* Contact Form Section */}
      <div id="contact-form" className="py-20 sm:py-28 md:py-36 bg-[#FFF5E6] relative overflow-hidden">
        <div className="editorial-container">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-start">
            {/* Left Column */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="flex flex-col pr-0 lg:pr-6"
            >
              <span className="font-accent text-[11px] tracking-[0.25em] uppercase text-[#C8851A] font-bold block mb-4">Get in Touch</span>
              <h3 className="font-serif text-3xl sm:text-5xl mb-8 font-light" style={{ color: "var(--ink)", lineHeight: 1.25 }}>
                Begin Your <span className="italic font-light text-[#C8851A]">Fashion Journey</span>
              </h3>
              <div className="w-16 h-[1.5px] bg-[#C8851A]/30 mb-8 sm:mb-12" />
              <p className="font-body text-sm text-text-muted mb-10 leading-relaxed max-w-md" style={{ fontWeight: 300 }}>
                Whether it&apos;s a bridal lehenga, a designer suit, or a festive ensemble, our style consultants will be in touch within 24 hours.
              </p>

              {/* Contact cards */}
              <div className="flex flex-col gap-6">
                {[
                  { label: "Instagram", val: "@sana___fashion___01", href: "https://www.instagram.com/sana___fashion___01/" },
                  { label: "WhatsApp", val: "Chat Directly", href: "https://wa.me/919022591620" },
                ].map(item => (
                  <div key={item.label} className="vintage-card p-6 rounded-[14px] border border-[rgba(200,133,26,0.15)] bg-[#FFFBF4]/40">
                    <span className="font-accent text-[9px] tracking-[0.2em] uppercase text-[#C8851A] mb-2 block font-semibold">{item.label}</span>
                    <a href={item.href} target="_blank" rel="noopener noreferrer" className="underline-grow font-serif text-lg text-text-secondary">
                      {item.val}
                    </a>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Right Column — Form */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              {done ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex flex-col items-center text-center gap-6 py-20 bg-[#FFFBF4]/50 border border-[#E6C280]/20 rounded-[20px]"
                >
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 200, damping: 14 }}
                  >
                    <CheckCircle size={56} color="var(--gold)" />
                  </motion.div>
                  <h4 className="font-serif text-3xl text-text-primary font-light">
                    Thank you, {form.name || "Dear"}
                  </h4>
                  <p className="font-body text-sm text-text-secondary max-w-xs leading-relaxed">
                    We&apos;ll be in touch within 24 hours to discuss your perfect outfit.
                  </p>
                </motion.div>
              ) : (
                <form onSubmit={submit} className="flex flex-col gap-6 sm:gap-7">
                  {[
                    { id: "name", label: "Full Name", type: "text", required: true },
                    { id: "email", label: "Email Address", type: "email", required: true },
                    { id: "phone", label: "Phone Number", type: "tel", required: false },
                  ].map(f => (
                    <div key={f.id} className="luxury-form-group">
                      <input
                        id={f.id}
                        type={f.type}
                        placeholder=" "
                        required={f.required}
                        value={form[f.id as keyof typeof form]}
                        onChange={e => setForm(p => ({ ...p, [f.id]: e.target.value }))}
                        className="luxury-input"
                      />
                      <label htmlFor={f.id} className="luxury-label">{f.label}</label>
                    </div>
                  ))}

                  <div className="luxury-form-group">
                    <select
                      id="service"
                      value={form.service}
                      onChange={e => setForm(p => ({ ...p, service: e.target.value }))}
                      className="luxury-input"
                      style={{ appearance: "none" }}
                    >
                      <option value="">Select an interest</option>
                      <option>Bridal Consultation</option>
                      <option>Festive Wear</option>
                      <option>Designer Suit</option>
                      <option>Custom Design</option>
                      <option>General Inquiry</option>
                    </select>
                    <label htmlFor="service" className={`luxury-label ${form.service ? "float-active" : ""}`}>I&apos;m Interested In</label>
                  </div>

                  <div className="luxury-form-group">
                    <textarea
                      id="message"
                      placeholder=" "
                      rows={4}
                      value={form.message}
                      onChange={e => setForm(p => ({ ...p, message: e.target.value }))}
                      className="luxury-textarea"
                    />
                    <label htmlFor="message" className="luxury-label">Your Message</label>
                  </div>

                  <LuxuryButton
                    type="submit"
                    variant="primary"
                    className="w-full mt-2"
                    disabled={loading}
                  >
                    {loading ? "Sending…" : "Send Inquiry"}
                  </LuxuryButton>
                </form>
              )}
            </motion.div>
          </div>
        </div>

        <style>{`
          .luxury-form-group {
            position: relative;
            width: 100%;
          }
          .luxury-input, .luxury-textarea {
            width: 100%;
            height: 56px;
            padding: 18px 24px;
            background: #FFFFFF;
            border: 1.5px solid rgba(200, 133, 26, 0.25);
            border-radius: 12px;
            font-family: var(--font-body);
            font-size: 14px;
            color: #1C0E05;
            outline: none;
            transition: all 300ms cubic-bezier(0.22, 1, 0.36, 1);
            box-sizing: border-box;
          }
          .luxury-textarea {
            height: 140px;
            resize: none;
            padding-top: 20px;
          }
          .luxury-input:focus, .luxury-textarea:focus {
            border-color: #C8851A;
            box-shadow: 0 0 0 4px rgba(200, 133, 26, 0.12);
            background: #FFFBF4;
          }
          .luxury-label {
            position: absolute;
            top: 18px;
            left: 24px;
            font-family: var(--font-accent);
            font-size: 11px;
            letter-spacing: 0.18em;
            text-transform: uppercase;
            color: #8A6040;
            transition: all 250ms cubic-bezier(0.22, 1, 0.36, 1);
            pointer-events: none;
          }
          .luxury-input:focus ~ .luxury-label,
          .luxury-input:not(:placeholder-shown) ~ .luxury-label,
          .luxury-textarea:focus ~ .luxury-label,
          .luxury-textarea:not(:placeholder-shown) ~ .luxury-label,
          .float-active {
            top: -10px;
            left: 16px;
            font-size: 9px;
            background: #FFF5E6;
            padding: 2px 8px;
            color: #C8851A;
            font-weight: 600;
            letter-spacing: 0.22em;
          }
        `}</style>
      </div>
    </div>
  );
}
