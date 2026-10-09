/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        paper: {
          DEFAULT: '#F7F4ED',
          light: '#FAF8F5',
          dark: '#ECE7DD',
          card: '#FFFFFF',
        },
        ink: {
          DEFAULT: '#252820',
          muted: '#5A5D54',
          light: '#8C8F85',
          faint: '#C2C5BC',
        },
        chartreuse: {
          DEFAULT: '#D5F36A',
          dark: '#B4D347',
          light: '#EEFAC0',
          glow: 'rgba(213, 243, 106, 0.4)',
        },
        sage: {
          DEFAULT: '#A7B6A0',
          dark: '#7A8C73',
          light: '#DCE4D8',
          faint: '#EDF2EB',
        },
        warmGrey: {
          DEFAULT: '#E5E1D8',
          light: '#F2EFEB',
          dark: '#CCC7BC',
        },
        terracotta: {
          DEFAULT: '#D9684C',
          light: '#FBEBE7',
        }
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', '"Inter"', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
        serif: ['"Plus Jakarta Sans"', '"Inter"', 'system-ui', 'sans-serif'],
        mono: ['"Plus Jakarta Sans"', '"Inter"', 'system-ui', 'sans-serif'],
        meta: ['"Plus Jakarta Sans"', '"Inter"', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'atelier': '0 2px 0 #252820',
        'atelier-lg': '0 4px 0 #252820',
        'subtle': '0 1px 3px rgba(37, 40, 32, 0.06)',
        'sheet': '0 12px 36px -8px rgba(37, 40, 32, 0.08), 0 1px 3px rgba(37, 40, 32, 0.04)',
      },
      borderWidth: {
        '1.5': '1.5px',
      }
    },
  },
  plugins: [],
}
