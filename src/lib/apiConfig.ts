export function getApiBaseUrl(): string {
  const envUrl = process.env.NEXT_PUBLIC_API_URL;
  if (!envUrl || envUrl.includes('your-actual-railway-url')) {
    if (typeof window !== 'undefined') {
      if (envUrl?.includes('your-actual-railway-url')) {
        console.error(
          '[API CONFIG ERROR] NEXT_PUBLIC_API_URL in Vercel is set to a placeholder "your-actual-railway-url". Defaulting to Render URL: https://sana-fasion-backend.onrender.com/api'
        );
      }
      // If deployed on Vercel/Production without env variable, fallback to live Render URL
      if (window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1') {
        return 'https://sana-fasion-backend.onrender.com/api';
      }
    }
    return 'http://localhost:5000/api';
  }
  let cleaned = envUrl.replace(/\/+$/, '');
  if (!cleaned.endsWith('/api') && !cleaned.includes('/api/')) {
    cleaned += '/api';
  }
  return cleaned;
}
