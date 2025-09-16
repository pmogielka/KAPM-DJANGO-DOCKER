/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./pages/**/*.{html,js}",
    "./components/**/*.{html,js}",
  ],
  theme: {
    extend: {
      colors: {
        // Granatowa paleta kolorów
        navy: {
          50: '#E6F1FE',
          100: '#C3DDF6',
          200: '#8EC5FC',
          300: '#64A9F8',
          400: '#3B82F6',
          500: '#1E293B', // Średni granat
          600: '#334155', // Jasny granat
          700: '#1E293B', // Podstawowy granat
          800: '#0F172A', // Głęboki granat
          900: '#0A0E1A', // Najciemniejszy granat
          950: '#050711'  // Ultra ciemny
        },
        primary: {
          DEFAULT: '#0F172A',
          light: '#1E293B',
          lighter: '#334155',
          dark: '#0A0E1A'
        },
        accent: {
          DEFAULT: '#3B82F6',
          light: '#60A5FA',
          dark: '#2563EB'
        },
        background: {
          DEFAULT: '#F8FAFC',
          secondary: '#F1F5F9',
          tertiary: '#E2E8F0'
        },
        text: {
          primary: '#0F172A',
          secondary: '#64748B',
          tertiary: '#94A3B8'
        },
        status: {
          success: '#10B981',
          warning: '#F59E0B',
          error: '#EF4444',
          info: '#3B82F6'
        }
      },
      fontFamily: {
        'sans': ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        'heading': ['Poppins', 'system-ui', '-apple-system', 'sans-serif'],
        'mono': ['JetBrains Mono', 'monospace']
      },
      fontSize: {
        // Skala typograficzna
        'xs': ['12px', '16px'],
        'sm': ['14px', '20px'],
        'base': ['16px', '24px'],
        'lg': ['18px', '28px'],
        'xl': ['20px', '28px'],
        '2xl': ['24px', '32px'],
        '3xl': ['28px', '36px'],
        '4xl': ['36px', '44px'],
        '5xl': ['48px', '56px'],
        '6xl': ['60px', '72px']
      },
      spacing: {
        // System odstępów bazowany na 4px
        '18': '72px',
        '22': '88px',
        '26': '104px',
        '30': '120px'
      },
      borderRadius: {
        'sm': '4px',
        'DEFAULT': '8px',
        'md': '12px',
        'lg': '16px',
        'xl': '20px',
        '2xl': '24px',
        '3xl': '32px'
      },
      boxShadow: {
        'sm': '0 1px 2px 0 rgba(15, 23, 42, 0.05)',
        'DEFAULT': '0 1px 3px 0 rgba(15, 23, 42, 0.1), 0 1px 2px 0 rgba(15, 23, 42, 0.06)',
        'md': '0 4px 6px -1px rgba(15, 23, 42, 0.1), 0 2px 4px -1px rgba(15, 23, 42, 0.06)',
        'lg': '0 10px 15px -3px rgba(15, 23, 42, 0.1), 0 4px 6px -2px rgba(15, 23, 42, 0.05)',
        'xl': '0 20px 25px -5px rgba(15, 23, 42, 0.1), 0 10px 10px -5px rgba(15, 23, 42, 0.04)',
        '2xl': '0 25px 50px -12px rgba(15, 23, 42, 0.25)',
        'inner': 'inset 0 2px 4px 0 rgba(15, 23, 42, 0.06)',
        'none': 'none',
        'navy': '0 4px 14px 0 rgba(15, 23, 42, 0.15)',
        'navy-lg': '0 10px 30px -5px rgba(15, 23, 42, 0.25)'
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'slide-down': 'slideDown 0.3s ease-out',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite'
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        slideDown: {
          '0%': { transform: 'translateY(-10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        }
      },
      backdropBlur: {
        xs: '2px',
      }
    },
  },
  plugins: [],
}