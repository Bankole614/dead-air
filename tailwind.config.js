/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        crt: {
          bg: '#090b0e',
          panel: '#10141a',
          'panel-border': '#1f2937',
          amber: '#f59e0b',
          'amber-bright': '#fbbf24',
          'amber-dim': '#78350f',
          green: '#22c55e',
          'green-bright': '#4ade80',
          'green-dim': '#14532d',
          red: '#ef4444',
          'red-dim': '#450a0a',
          cyan: '#06b6d4',
          blue: '#3b82f6',
        }
      },
      fontFamily: {
        mono: ['"Share Tech Mono"', 'ui-monospace', 'SFMono-Regular', 'Menlo', 'Monaco', 'Consolas', '"Liberation Mono"', '"Courier New"', 'monospace'],
        display: ['"VT323"', '"Share Tech Mono"', 'monospace'],
      },
      animation: {
        'scanline': 'scanline 8s linear infinite',
        'pulse-subtle': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'blink': 'blink 1s step-start infinite',
      },
      keyframes: {
        blink: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0' },
        }
      }
    },
  },
  plugins: [],
}

