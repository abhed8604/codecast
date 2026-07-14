/** @type {import('tailwindcss').Config} */
export default {
  content: ['./client/index.html', './client/src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        void: '#050507',
        surface: '#0B0B0F',
        'surface-2': '#131318',
        violet: {
          primary: '#8B5CF6',
          deep: '#4C1D95',
          glow: '#C4B5FD',
        },
        ink: {
          DEFAULT: '#F1EDF7',
          muted: '#948AA3',
          faint: '#4A4058',
        },
        danger: '#EF4444',
        success: '#22C55E',
      },
      fontFamily: {
        display: ['"Space Grotesk"', 'system-ui', 'sans-serif'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'monospace'],
      },
      borderRadius: {
        control: '10px',
        card: '16px',
        panel: '24px',
        modal: '32px',
      },
      fontSize: {
        h1: ['56px', { lineHeight: '1.05', fontWeight: '600' }],
        h2: ['36px', { lineHeight: '1.15', fontWeight: '600' }],
        h3: ['24px', { lineHeight: '1.2', fontWeight: '500' }],
      },
      boxShadow: {
        modal:
          '0 0 0 1px rgba(139,92,246,0.18), 0 36px 90px -28px rgba(0,0,0,0.85), 0 0 50px rgba(139,92,246,0.10)',
        panel:
          '0 30px 80px -32px rgba(0,0,0,0.9), 0 0 0 1px rgba(139,92,246,0.10)',
        card: '0 18px 50px -22px rgba(0,0,0,0.8)',
        'card-hover':
          '0 0 0 1px rgba(139,92,246,0.40), 0 30px 64px -26px rgba(0,0,0,0.88), 0 0 38px rgba(139,92,246,0.14)',
        sheet: '0 -24px 64px -24px rgba(0,0,0,0.8)',
        float: '0 14px 34px -14px rgba(0,0,0,0.7)',
        glow: '0 10px 30px -8px rgba(139,92,246,0.5)',
      },
      keyframes: {
        drift: {
          '0%, 100%': { transform: 'translate3d(0,0,0) scale(1)', opacity: '0.55' },
          '50%': { transform: 'translate3d(6%, -8%, 0) scale(1.15)', opacity: '0.8' },
        },
        'drift-slow': {
          '0%, 100%': { transform: 'translate3d(0,0,0) scale(1.1)', opacity: '0.32' },
          '50%': { transform: 'translate3d(-8%, 6%, 0) scale(1)', opacity: '0.48' },
        },
        shimmer: {
          '100%': { transform: 'translateX(100%)' },
        },
        blink: {
          '0%, 49%': { opacity: '1' },
          '50%, 100%': { opacity: '0' },
        },
        marquee: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
        'marquee-reverse': {
          '0%': { transform: 'translateX(-50%)' },
          '100%': { transform: 'translateX(0)' },
        },
        'gradient-pan': {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        'spin-slow': {
          to: { transform: 'rotate(360deg)' },
        },
      },
      animation: {
        drift: 'drift 24s ease-in-out infinite',
        'drift-slow': 'drift-slow 30s ease-in-out infinite',
        shimmer: 'shimmer 1.6s infinite',
        blink: 'blink 1s step-end infinite',
        marquee: 'marquee 28s linear infinite',
        'marquee-reverse': 'marquee-reverse 32s linear infinite',
        'gradient-pan': 'gradient-pan 6s ease infinite',
        float: 'float 6s ease-in-out infinite',
        'spin-slow': 'spin-slow 18s linear infinite',
      },
    },
  },
  plugins: [],
}
