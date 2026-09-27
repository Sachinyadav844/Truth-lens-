/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: '#2563EB',
        'brand-dark': '#1D4ED8',
        'brand-light': '#EEF2FF',
        'ink-900': '#0F172A',
        'ink-600': '#475569',
        'ink-400': '#94A3B8',
        'status-supportBg': '#ECFDF5',
        'status-supportText': '#166534',
        'status-supportDot': '#22C55E',
        'status-mixedBg': '#FFFBEB',
        'status-mixedText': '#B45309',
        'status-mixedDot': '#F59E0B',
        'status-contraBg': '#FEF2F2',
        'status-contraText': '#B91C1C',
        'status-contraDot': '#EF4444',
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        card: '1rem',
        pill: '9999px',
      },
      boxShadow: {
        card: '0 10px 30px rgba(15, 23, 42, 0.04)',
        search: '0 18px 45px rgba(37, 99, 235, 0.08)',
      },
      spacing: {
        18: '4.5rem',
      },
    },
  },
  plugins: [],
}
