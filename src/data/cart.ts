"use client";

export interface CartItem {
  id: number;
  title: string;
  price: number;
  thumbnail: string;
  quantity: number;
  productCode: string;
}

export const cartState = {
  items: [] as CartItem[],
  listeners: [] as (() => void)[],
  
  add(product: { id: number; title: string; price: number; thumbnail: string; productCode: string }) {
    this.load();
    const existing = this.items.find(item => item.id === product.id);
    if (existing) {
      existing.quantity += 1;
    } else {
      this.items.push({
        id: product.id,
        title: product.title,
        price: product.price,
        thumbnail: product.thumbnail,
        productCode: product.productCode,
        quantity: 1
      });
    }
    this.notify();
  },

  remove(id: number) {
    this.load();
    this.items = this.items.filter(item => item.id !== id);
    this.notify();
  },

  updateQty(id: number, qty: number) {
    this.load();
    const item = this.items.find(item => item.id === id);
    if (item) {
      item.quantity = Math.max(1, qty);
    }
    this.notify();
  },

  subscribe(listener: () => void) {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  },

  notify() {
    if (typeof window !== "undefined") {
      localStorage.setItem("sana_cart", JSON.stringify(this.items));
      window.dispatchEvent(new CustomEvent("sana_cart_change"));
    }
    this.listeners.forEach(l => l());
  },

  load() {
    if (typeof window !== "undefined" && this.items.length === 0) {
      const data = localStorage.getItem("sana_cart");
      if (data) {
        try {
          this.items = JSON.parse(data);
        } catch (e) {}
      }
    }
  },

  getCount() {
    this.load();
    return this.items.reduce((sum, item) => sum + item.quantity, 0);
  },

  getSubtotal() {
    this.load();
    return this.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  }
};
