/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ['class'],
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        saffron: {
          DEFAULT: '#E8650A',
          50:  '#FFF7F2',
          100: '#FFF0E5',
          200: '#FFDCC2',
          300: '#FFC49A',
          400: '#FFA06E',
          500: '#E8650A',
          600: '#C4520A',
          700: '#A04208',
          800: '#7C3206',
          900: '#5C2504',
        },
        navy: {
          DEFAULT: '#1A3A5C',
          50:  '#EBF0F7',
          100: '#D7E1EF',
          200: '#AFC3DF',
          300: '#87A5CF',
          400: '#5F87BF',
          500: '#1A3A5C',
          600: '#163050',
          700: '#122644',
          800: '#0E1C38',
          900: '#0A122C',
        },
        teal: {
          DEFAULT: '#00897B',
          light:   '#E0F2F1',
          dark:    '#00695C',
        },
        gold: '#D4AF37',
      },
      fontFamily: {
        heading:     ['var(--font-plus-jakarta)', 'sans-serif'],
        body:        ['var(--font-inter)',         'sans-serif'],
        devanagari:  ['var(--font-tiro-devanagari)', 'serif'],
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
      animation: {
        'fade-in':    'fadeIn 0.3s ease-in-out',
        'slide-up':   'slideUp 0.4s ease-out',
        'pulse-star': 'pulseStar 0.3s ease-in-out',
      },
      keyframes: {
        fadeIn:    { from: { opacity: '0' },                                  to: { opacity: '1' } },
        slideUp:   { from: { transform: 'translateY(20px)', opacity: '0' },   to: { transform: 'translateY(0)',  opacity: '1' } },
        pulseStar: { '0%, 100%': { transform: 'scale(1)' },                   '50%': { transform: 'scale(1.2)' } },
      },
    },
  },
  plugins: [],
}
