export const shadow = {
  none: 'none',
  xs: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
  sm: '0 2px 8px -2px rgba(28, 16, 8, 0.05), 0 4px 12px -2px rgba(200, 133, 26, 0.03)',
  md: '0 8px 24px -4px rgba(28, 16, 8, 0.08), 0 4px 16px -4px rgba(200, 133, 26, 0.05)',
  lg: '0 12px 32px -4px rgba(28, 16, 8, 0.12), 0 8px 20px -6px rgba(200, 133, 26, 0.08)',
} as const;

export type Shadow = typeof shadow;
export default shadow;
