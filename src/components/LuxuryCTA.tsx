"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, useInView } from "framer-motion";
import { ArrowRight, Send, CheckCircle } from "lucide-react";
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
      await fetch("http://localhost:5000/api/inquiries", {
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
      {/* CTA Banner */}
      <div className="relative overflow-hidden" style={{ minHeight: "380px", background: "linear-gradient(135deg, #8B1A3A 0%, #5C1020 40%, #2E0D1A 100%)" }}>
        {/* BG image */}
        <div className="absolute inset-0 opacity-15">
          <Image src="/images/models/wedding-collection.jpg" alt="CTA" fill className="object-cover object-top" sizes="100vw" />
        </div>
        {/* Warm gradient */}
        <div className="absolute inset-0" style={{ background: "linear-gradient(135deg, rgba(200,133,26,0.15) 0%, transparent 60%)" }} />

        {/* Vintage corner ornaments */}
        <div className="absolute top-6 left-6 opacity-20 hidden sm:block">
          <svg width="50" height="50" viewBox="0 0 50 50" fill="none">
            <path d="M0 0 L20 0 M0 0 L0 20" stroke="#E8C07A" strokeWidth="1" />
          </svg>
        </div>
        <div className="absolute bottom-6 right-6 opacity-20 hidden sm:block">
          <svg width="50" height="50" viewBox="0 0 50 50" fill="none">
            <path d="M50 50 L30 50 M50 50 L50 30" stroke="#E8C07A" strokeWidth="1" />
          </svg>
        </div>

        <motion.div
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          variants={stagger}
          className="relative z-10 section container mx-auto text-center"
        >
          <motion.span variants={up} className="label block mb-5 sm:mb-7">
            The Sana Promise
          </motion.span>
          <motion.h2
            variants={up}
            className="heading-xl text-white mb-5 sm:mb-7 mx-auto"
            style={{ maxWidth: "800px" }}
          >
            Designed to Make Every{" "}
            <em className="text-gold">Occasion Unforgettable</em>
          </motion.h2>
          <motion.p
            variants={up}
            className="body-sm mb-8 sm:mb-10 mx-auto max-w-sm"
            style={{ color: "rgba(253,235,210,0.75)" }}
          >
            From the first consultation to the final fitting, we craft experiences as carefully as we craft your outfit.
          </motion.p>
          <motion.div variants={up} className="flex flex-wrap gap-3 sm:gap-4 justify-center">
            <Link href="#contact-form">
              <LuxuryButton variant="primary" showArrow>
                Book Private Consultation
              </LuxuryButton>
            </Link>
            <a href="https://www.instagram.com/sana___fashion___01/" target="_blank" rel="noopener noreferrer">
              <LuxuryButton variant="secondary">
                View on Instagram
              </LuxuryButton>
            </a>
          </motion.div>
        </motion.div>
      </div>

      {/* Contact Form */}
      <div id="contact-form" className="section" style={{ background: "var(--cream-warm)" }}>
        <div className="container mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-start">
          {/* Left */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8 }}
          >
            <span className="label block mb-4">Get in Touch</span>
            <h3 className="heading-lg mb-5" style={{ color: "var(--ink)" }}>
              Begin Your{" "}
              <em className="text-gold">Fashion Journey</em>
            </h3>
            <div className="divider-line mb-7" />
            <p className="body-sm mb-8 sm:mb-10 max-w-sm">
              Whether it&apos;s a bridal lehenga, a designer suit, or a festive ensemble, our style consultants will be in touch within 24 hours.
            </p>

            {/* Contact cards */}
            <div className="flex flex-col gap-5">
              {[
                { label: "Instagram", val: "@sana___fashion___01", href: "https://www.instagram.com/sana___fashion___01/" },
                { label: "WhatsApp", val: "Chat Directly", href: "https://wa.me/919022591620" },
              ].map(item => (
                <div key={item.label} className="vintage-card p-4 sm:p-5">
                  <span className="label block mb-1">{item.label}</span>
                  <a href={item.href} target="_blank" rel="noopener noreferrer" className="underline-grow font-body text-sm" style={{ color: "var(--ink)" }}>
                    {item.val}
                  </a>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Right — Form */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            {done ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex flex-col items-center text-center gap-5 py-16 sm:py-20"
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 200, damping: 14 }}
                >
                  <CheckCircle size={52} color="var(--gold)" />
                </motion.div>
                <h4 className="heading-md" style={{ color: "var(--ink)" }}>
                  Thank you, {form.name || "Dear"}
                </h4>
                <p className="body-sm max-w-xs">
                  We&apos;ll be in touch within 24 hours to discuss your perfect outfit.
                </p>
              </motion.div>
            ) : (
              <form onSubmit={submit} className="flex flex-col">
                {[
                  { id: "name", label: "Full Name", type: "text", required: true },
                  { id: "email", label: "Email Address", type: "email", required: true },
                  { id: "phone", label: "Phone Number", type: "tel", required: false },
                ].map(f => (
                  <div key={f.id} className="float-label">
                    <input
                      id={f.id}
                      type={f.type}
                      placeholder=" "
                      required={f.required}
                      value={form[f.id as keyof typeof form]}
                      onChange={e => setForm(p => ({ ...p, [f.id]: e.target.value }))}
                    />
                    <label htmlFor={f.id}>{f.label}</label>
                  </div>
                ))}

                <div className="float-label">
                  <select
                    id="service"
                    value={form.service}
                    onChange={e => setForm(p => ({ ...p, service: e.target.value }))}
                  >
                    <option value="">Select an interest</option>
                    <option>Bridal Consultation</option>
                    <option>Festive Wear</option>
                    <option>Designer Suit</option>
                    <option>Custom Design</option>
                    <option>General Inquiry</option>
                  </select>
                  <label htmlFor="service">I&apos;m Interested In</label>
                </div>

                <div className="float-label">
                  <textarea
                    id="message"
                    placeholder=" "
                    rows={3}
                    value={form.message}
                    onChange={e => setForm(p => ({ ...p, message: e.target.value }))}
                  />
                  <label htmlFor="message">Your Message</label>
                </div>

                <LuxuryButton
                  type="submit"
                  variant="primary"
                  className="w-full"
                  disabled={loading}
                >
                  {loading ? "Sending…" : "Send Inquiry"}
                </LuxuryButton>
              </form>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
}
