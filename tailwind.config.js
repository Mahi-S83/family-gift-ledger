/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        cream: '#FBF1DE',
        paper: '#FFFCF5',
        maroon: '#7A1730',
        'maroon-deep': '#5A0F22',
        marigold: '#FFB100',
        'marigold-deep': '#F2971D',
        mehendi: '#3F6B35',
        'mehendi-deep': '#2C4D26',
        gold: '#C9A227',
        ink: '#2B1B17',
        'ink-soft': '#6B584F',
        line: 'rgba(43, 27, 23, 0.12)',
      },
      fontFamily: {
        'fraunces': ['Fraunces', 'serif'],
        'manrope': ['Manrope', 'sans-serif'],
        'mono': ['IBM Plex Mono', 'monospace'],
      },
    },
  },
  plugins: [],
}