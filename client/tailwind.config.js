/** @type {import('tailwindcss').Config} */
export default {
  content: ['./client/index.html', './client/src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        void: '#06040B',
        surface: '#0E0A14',
        'surface-2': '#15101C',
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
          '0 0 0 1px rgba(139,92,246,0.15), 0 20px 60px rgba(0,0,0,0.5), 0 0 40px rgba(139,92,246,0.08)',
        card: '0 12px 40px -18px rgba(0,0,0,0.6)',
        'card-hover':
          '0 0 0 1px rgba(139,92,246,0.35), 0 22px 50px -20px rgba(0,0,0,0.7), 0 0 32px rgba(139,92,246,0.10)',
        sheet: '0 -12px 40px rgba(0,0,0,0.45)',
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
      },
      animation: {
        drift: 'drift 24s ease-in-out infinite',
        'drift-slow': 'drift-slow 30s ease-in-out infinite',
        shimmer: 'shimmer 1.6s infinite',
        blink: 'blink 1s step-end infinite',
      },
    },
  },
  plugins: [],
}
