"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { X, Trash2, Plus, Minus, MessageCircle, ArrowRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cartState, CartItem } from "@/data/cart";

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CartDrawer({ isOpen, onClose }: CartDrawerProps) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [subtotal, setSubtotal] = useState(0);

  useEffect(() => {
    // Initial load
    cartState.load();
    setItems([...cartState.items]);
    setSubtotal(cartState.getSubtotal());

    // Subscribe to updates
    const unsubscribe = cartState.subscribe(() => {
      setItems([...cartState.items]);
      setSubtotal(cartState.getSubtotal());
    });

    // Also sync on custom window event
    const handleSync = () => {
      setItems([...cartState.items]);
      setSubtotal(cartState.getSubtotal());
    };
    window.addEventListener("sana_cart_change", handleSync);

    return () => {
      unsubscribe();
      window.removeEventListener("sana_cart_change", handleSync);
    };
  }, []);

  const handleQtyChange = (id: number, currentQty: number, change: number) => {
    cartState.updateQty(id, currentQty + change);
  };

  const handleRemove = (id: number) => {
    cartState.remove(id);
  };

  const getWhatsAppLink = () => {
    const list = items.map(
      (item) => `• ${item.title} (${item.productCode}) - Qty: ${item.quantity} @ ₹${item.price.toLocaleString("en-IN")}`
    ).join("\n");
    const text = encodeURIComponent(
      `Hi! I would like to place an order / enquire about these pieces:\n\n${list}\n\n*Total Subtotal: ₹${subtotal.toLocaleString("en-IN")}*\n\nPlease confirm availability and next steps.`
    );
    return `https://wa.me/919022591620?text=${text}`;
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[99999] flex justify-end">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/55 backdrop-blur-xs cursor-pointer"
          />

          {/* Drawer Panel */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "tween", ease: [0.22, 1, 0.36, 1], duration: 0.4 }}
            className="relative w-full max-w-[420px] h-full bg-[#FFFBF4] shadow-2xl flex flex-col border-l border-[#E6C280]/20"
          >
            {/* Header */}
            <div className="p-6 border-b border-[#E6C280]/15 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="font-accent text-[12px] tracking-[0.2em] uppercase font-bold text-accent-gold">Atelier Bag</span>
                <span className="bg-[#8B1A3A] text-white text-[10px] w-5 h-5 rounded-full flex items-center justify-center font-bold font-accent">
                  {items.reduce((sum, item) => sum + item.quantity, 0)}
                </span>
              </div>
              <button
                onClick={onClose}
                className="w-8 h-8 rounded-full flex items-center justify-center border border-accent-gold/25 text-text-primary hover:border-accent-gold transition-colors cursor-pointer"
                aria-label="Close cart"
              >
                <X size={15} />
              </button>
            </div>

            {/* Items List */}
            <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-5 scrollbar-none">
              {items.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center gap-4 py-20">
                  <span className="text-4xl">👜</span>
                  <h3 className="font-serif text-[18px] text-text-primary font-medium">Your bag is empty</h3>
                  <p className="font-body text-xs text-text-muted max-w-[240px] leading-relaxed">
                    Explore our bridal and festive collections to add artisanal luxury pieces to your bag.
                  </p>
                  <button
                    onClick={onClose}
                    className="mt-2 font-accent text-[11px] tracking-[0.2em] uppercase text-accent-gold border-b border-accent-gold/40 pb-0.5 hover:text-[#9A5F0A] cursor-pointer"
                  >
                    Continue Shopping
                  </button>
                </div>
              ) : (
                items.map((item) => (
                  <div key={item.id} className="flex gap-4 pb-5 border-b border-[#E6C280]/10 last:border-0 last:pb-0">
                    {/* Thumbnail */}
                    <div className="relative w-20 aspect-[3/4] bg-cream-warm border border-[#E6C280]/15 rounded-[2px] overflow-hidden flex-shrink-0">
                      <Image src={item.thumbnail} alt={item.title} fill className="object-cover object-top" sizes="80px" />
                    </div>

                    {/* Meta */}
                    <div className="flex-1 flex flex-col justify-between py-0.5">
                      <div>
                        <span className="font-accent text-[9px] text-[#C8851A] tracking-wider uppercase font-bold block mb-1">
                          {item.productCode}
                        </span>
                        <h4 className="font-serif text-sm font-medium text-text-primary leading-snug line-clamp-2">
                          {item.title}
                        </h4>
                      </div>

                      {/* Qty & Price row */}
                      <div className="flex justify-between items-end mt-2">
                        {/* Selector */}
                        <div className="flex items-center border border-[#E6C280]/30 rounded-[4px] h-[30px] bg-white">
                          <button
                            onClick={() => handleQtyChange(item.id, item.quantity, -1)}
                            className="w-7 h-full flex items-center justify-center text-[#9A8070] hover:text-text-primary disabled:opacity-30 cursor-pointer"
                            disabled={item.quantity <= 1}
                          >
                            <Minus size={11} />
                          </button>
                          <span className="w-8 text-center font-accent text-xs font-medium text-text-primary">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => handleQtyChange(item.id, item.quantity, 1)}
                            className="w-7 h-full flex items-center justify-center text-[#9A8070] hover:text-text-primary cursor-pointer"
                          >
                            <Plus size={11} />
                          </button>
                        </div>

                        {/* Price */}
                        <div className="text-right">
                          <span className="font-serif text-sm font-semibold text-text-primary block">
                            ₹{(item.price * item.quantity).toLocaleString("en-IN")}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Remove */}
                    <button
                      onClick={() => handleRemove(item.id)}
                      className="p-1 text-[#B0A090] hover:text-text-primary transition-colors cursor-pointer self-start"
                      aria-label="Remove item"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                ))
              )}
            </div>

            {/* Footer Summary */}
            {items.length > 0 && (
              <div className="p-6 border-t border-[#E6C280]/15 bg-cream-warm flex flex-col gap-4">
                <div className="flex justify-between items-baseline">
                  <span className="font-accent text-[11px] tracking-[0.18em] uppercase text-text-muted">Subtotal</span>
                  <span className="font-serif text-xl font-bold text-text-primary">
                    ₹{subtotal.toLocaleString("en-IN")}
                  </span>
                </div>
                <p className="font-body text-[11px] text-[#9A8070] leading-relaxed">
                  Tax and logistics are calculated based on bespoke fitting requirements during consultation.
                </p>

                <div className="flex flex-col gap-2.5 mt-2">
                  <a
                    href={getWhatsAppLink()}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full h-12 bg-[#1B5E35] text-white rounded-[8px] font-accent text-xs tracking-[0.18em] uppercase font-bold flex items-center justify-center gap-2 hover:bg-[#123C21] transition-colors"
                  >
                    <MessageCircle size={16} /> Checkout on WhatsApp
                  </a>
                  <button
                    onClick={onClose}
                    className="w-full h-12 border border-accent-gold/30 text-accent-gold rounded-[8px] font-accent text-xs tracking-[0.18em] uppercase font-bold flex items-center justify-center gap-2 hover:bg-white hover:border-accent-gold transition-all duration-300 cursor-pointer"
                  >
                    Continue Atelier Browsing
                  </button>
                </div>
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
