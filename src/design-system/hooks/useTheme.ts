'use client';
import colors from '../tokens/colors';
import spacing from '../tokens/spacing';
import radius from '../tokens/radius';
import shadow from '../tokens/shadow';
import typography from '../tokens/typography';

export function useTheme() {
  return {
    colors,
    spacing,
    radius,
    shadow,
    typography,
  };
}

export default useTheme;
