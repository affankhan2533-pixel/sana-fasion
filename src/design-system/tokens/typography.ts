export const typography = {
  fontFamily: {
    serif: 'Cormorant Garamond, serif',
    sans: 'Outfit, sans-serif',
  },
  fontSize: {
    xs: '11px',
    sm: '12px',
    base: '14px',
    lg: '16px',
    xl: '20px',
    xxl: '26px',
    xxxl: '32px',
  },
  fontWeight: {
    normal: '400',
    medium: '500',
    semibold: '600',
    bold: '700',
  }
} as const;

export type Typography = typeof typography;
export default typography;
