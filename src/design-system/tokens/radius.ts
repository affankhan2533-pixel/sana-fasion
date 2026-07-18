export const radius = {
  none: '0px',
  sm: '4px',
  md: '8px',
  lg: '12px',       // Standard card and button radius (12px)
  xl: '16px',
  xxl: '24px',
  full: '9999px',   // Pill rounded shapes
} as const;

export type Radius = typeof radius;
export default radius;
