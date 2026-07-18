export const spacing = {
  xs: '4px',
  sm: '8px',
  md: '12px',
  lg: '16px',
  xl: '20px',
  xxl: '24px',
  xxxl: '32px',
  
  // Viewport Container Layout
  layout: {
    mobile: '16px',
    tablet: '24px',
    desktop: '40px',
  },
  
  // Element-specific paddings
  button: {
    paddingX: '24px',
    paddingY: '16px',
    height: '52px',
  }
} as const;

export type Spacing = typeof spacing;
export default spacing;
