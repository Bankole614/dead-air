/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./index.html'],
  theme: {
    extend: {
      colors: {
        void: '#06080b',
        crt: '#0c1017',
        bezel: '#131923',
        amber: {
          DEFAULT: '#f59e0b',
          soft: '#fbbf24',
          dim: '#b45309',
        },
        phosphor: {
          DEFAULT: '#34d399',
          dim: '#059669',
        },
        alarm: '#ef4444',
        ink: '#f1f5f9',
        muted: '#94a3b8',
        line: '#1e2736',
      },
      fontFamily: {
        display: ['"Space Grotesk"', 'system-ui', 'sans-serif'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['"IBM Plex Mono"', 'ui-monospace', 'monospace'],
      },
      boxShadow: {
        amberGlow: '0 0 40px -10px rgba(245, 158, 11, 0.35)',
        crtInset: 'inset 0 0 60px rgba(0, 0, 0, 0.75)',
      },
    },
  },
  plugins: [],
};
