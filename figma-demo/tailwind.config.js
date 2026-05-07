/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        canvas: '#09090f',
        panel: '#11111a',
        panelSoft: '#171723',
        stroke: 'rgba(255,255,255,0.08)',
        accent: {
          50: '#f5edff',
          100: '#ead9ff',
          200: '#d7b6ff',
          300: '#bf8dff',
          400: '#a064ff',
          500: '#8c4bff',
          600: '#7d3df0',
          700: '#6932d0',
        },
      },
      boxShadow: {
        glow: '0 18px 50px rgba(124, 58, 237, 0.24)',
        panel: '0 24px 70px rgba(0, 0, 0, 0.42)',
      },
      backgroundImage: {
        'radial-glow': 'radial-gradient(circle at top left, rgba(139,92,246,0.35), transparent 40%), radial-gradient(circle at top right, rgba(59,130,246,0.2), transparent 30%)',
      },
    },
  },
  plugins: [],
};
