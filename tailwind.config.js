/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/app/admin/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/admin/**/*.{js,ts,jsx,tsx,mdx}',
    './src/lib/admin/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        // Admin design tokens
        'admin-bg': '#FAFAF8',
        'admin-surface': '#FFFFFF',
        'admin-border': '#E8E2D9',
        'admin-border-strong': 'rgba(200,133,26,0.25)',
        'admin-gold': '#C8851A',
        'admin-gold-light': 'rgba(200,133,26,0.12)',
        'admin-gold-pale': 'rgba(200,133,26,0.06)',
        'admin-text': '#1C1008',
        'admin-text-2': '#6B5E4C',
        'admin-text-3': '#9B8E7E',
        'admin-sidebar': '#17100A',
        'admin-sidebar-hover': 'rgba(200,133,26,0.12)',
        'admin-sidebar-active': 'rgba(200,133,26,0.18)',
        'admin-sidebar-text': 'rgba(255,240,210,0.85)',
        'admin-sidebar-text-muted': 'rgba(255,240,210,0.45)',
        // Status colours
        'status-success': '#16A34A',
        'status-success-bg': '#F0FDF4',
        'status-warning': '#D97706',
        'status-warning-bg': '#FFFBEB',
        'status-danger': '#DC2626',
        'status-danger-bg': '#FEF2F2',
        'status-info': '#2563EB',
        'status-info-bg': '#EFF6FF',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        serif: ['"Cormorant Garamond"', 'Georgia', 'serif'],
      },
      boxShadow: {
        'card': '0 1px 3px rgba(0,0,0,0.06), 0 4px 16px rgba(0,0,0,0.04)',
        'card-hover': '0 4px 12px rgba(0,0,0,0.08), 0 8px 32px rgba(0,0,0,0.06)',
        'dropdown': '0 8px 32px rgba(0,0,0,0.12), 0 2px 8px rgba(0,0,0,0.06)',
        'modal': '0 20px 60px rgba(0,0,0,0.15)',
        'gold': '0 0 0 3px rgba(200,133,26,0.2)',
      },
      borderRadius: {
        'card': '12px',
        'input': '8px',
        'badge': '6px',
      },
      animation: {
        'slide-in-right': 'slideInRight 0.3s cubic-bezier(0.22,1,0.36,1)',
        'slide-up': 'slideUp 0.3s cubic-bezier(0.22,1,0.36,1)',
        'fade-in': 'fadeIn 0.2s ease',
        'pulse-gold': 'pulseGold 2s ease-in-out infinite',
      },
      keyframes: {
        slideInRight: { from: { transform: 'translateX(100%)', opacity: 0 }, to: { transform: 'translateX(0)', opacity: 1 } },
        slideUp: { from: { transform: 'translateY(8px)', opacity: 0 }, to: { transform: 'translateY(0)', opacity: 1 } },
        fadeIn: { from: { opacity: 0 }, to: { opacity: 1 } },
        pulseGold: { '0%,100%': { boxShadow: '0 0 0 0 rgba(200,133,26,0.3)' }, '50%': { boxShadow: '0 0 0 8px rgba(200,133,26,0)' } },
      },
    },
  },
  plugins: [],
}
