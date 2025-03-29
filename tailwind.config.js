module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx,scss}'],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        outfit: ['Epilogue', 'sans-serif'],
      },
      zIndex: {
        '1': '1',
        '9': '9',
        '99': '99',
        '999': '999',
        '9999': '9999',
        '99999': '99999',
        '999999': '999999',
      },
      colors: {
        brand: {
          25: 'var(--color-brand-25)',
          50: 'var(--color-brand-50)',
          100: 'var(--color-brand-100)',
          200: 'var(--color-brand-200)',
          300: 'var(--color-brand-300)',
          400: 'var(--color-brand-400)',
          500: 'var(--color-brand-500)',
          600: 'var(--color-brand-600)',
          700: 'var(--color-brand-700)',
          800: 'var(--color-brand-800)',
          900: 'var(--color-brand-900)',
          950: 'var(--color-brand-950)',
        },
        gray: {
          25: 'var(--color-gray-25)',
          50: 'var(--color-gray-50)',
          100: 'var(--color-gray-100)',
          200: 'var(--color-gray-200)',
          300: 'var(--color-gray-300)',
          400: 'var(--color-gray-400)',
          500: 'var(--color-gray-500)',
          600: 'var(--color-gray-600)',
          700: 'var(--color-gray-700)',
          800: 'var(--color-gray-800)',
          900: 'var(--color-gray-900)',
          950: 'var(--color-gray-950)',
        },
      },
      backgroundOpacity: {
        '12': '0.12',
        '15': '0.15',
        '20': '0.20',
      },
      opacity: {
        '12': '0.12',
        '15': '0.15',
        '20': '0.20',
      },
      fontSize: {
        'theme-xs': ['var(--text-theme-xs)', {
          lineHeight: 'var(--text-theme-xs--line-height)',
        }],
        'theme-sm': ['var(--text-theme-sm)', {
          lineHeight: 'var(--text-theme-sm--line-height)',
        }],
        'theme-xl': ['var(--text-theme-xl)', {
          lineHeight: 'var(--text-theme-xl--line-height)',
        }],
      },
    },
  },
  plugins: [],
};
