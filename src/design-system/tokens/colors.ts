export const colors = {
  primary: {
    gold: '#C8851A',
    goldHover: '#B07414',
    goldLight: 'rgba(200, 133, 26, 0.12)',
    goldLightest: 'rgba(200, 133, 26, 0.04)',
    dark: '#1C1008',
    darkSoft: '#17100A',
    background: '#FAF6F0',
  },
  neutral: {
    white: '#FFFFFF',
    cream: '#FCFAF7',
    muted: '#9B8E7E',
    darkMuted: '#6B5E4C',
    border: '#E8E2D9',
    borderLight: '#E6C280/20',
  },
  feedback: {
    successBg: '#ECFDF5',
    successText: '#047857',
    successBorder: '#A7F3D0/50',
    errorBg: '#FEF2F2',
    errorText: '#EF4444',
    errorBorder: '#FCA5A5/50',
    warningBg: '#FFFBEB',
    warningText: '#D97706',
    warningBorder: '#FDE68A/50',
  }
} as const;

export type Colors = typeof colors;
export default colors;
