import type { Config } from 'tailwindcss';
import tailwindcssAnimate from 'tailwindcss-animate';

const config: Config = {
  darkMode: ['class'],
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './lib/**/*.{ts,tsx}',
  ],
  theme: {
    container: {
      center: true,
      padding: {
        DEFAULT: '1rem',
        sm: '1.5rem',
        lg: '2rem',
      },
      screens: {
        sm: '640px',
        md: '768px',
        lg: '1024px',
        xl: '1200px',
        '2xl': '1320px',
      },
    },
    extend: {
      colors: {
        // ─── Brand: Deep Green ───
        brand: {
          50:  '#F0FAF4',
          100: '#DCF1E4',
          200: '#BCE3CB',
          300: '#8DCDA9',
          400: '#5AB082',
          500: '#2A8A4E',
          600: '#1B6B3A',
          700: '#155730',
          800: '#114627',
          900: '#0F3A20',
          950: '#062014',
        },

        // ─── Neutrals ───
        ink: {
          DEFAULT: '#0F1C14',
          90:      '#1E2A22',
          70:      '#3A4A40',
          50:      '#5C6B62',
          30:      '#94A19A',
          20:      '#BFC8C2',
          10:      '#E5EBE7',
          5:       '#F2F5F3',
        },

        // ─── Surfaces ───
        surface: {
          DEFAULT: '#FFFFFF',
          subtle:  '#FAFCFB',
          muted:   '#F2F5F3',
        },

        // ─── Status ───
        success: { DEFAULT: '#1B6B3A', soft: '#E8F5EE' },
        warning: { DEFAULT: '#E07B39', soft: '#FDF1E8' },
        info:    { DEFAULT: '#4F46E5', soft: '#EEF2FF' },
        danger:  { DEFAULT: '#B91C1C', soft: '#FEE2E2' },

        // ─── shadcn semantic tokens ───
        border:      'hsl(var(--border))',
        input:       'hsl(var(--input))',
        ring:        'hsl(var(--ring))',
        background:  'hsl(var(--background))',
        foreground:  'hsl(var(--foreground))',
        primary: {
          DEFAULT:   'hsl(var(--primary))',
          foreground:'hsl(var(--primary-foreground))',
        },
        secondary: {
          DEFAULT:   'hsl(var(--secondary))',
          foreground:'hsl(var(--secondary-foreground))',
        },
        destructive: {
          DEFAULT:   'hsl(var(--destructive))',
          foreground:'hsl(var(--destructive-foreground))',
        },
        muted: {
          DEFAULT:   'hsl(var(--muted))',
          foreground:'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT:   'hsl(var(--accent))',
          foreground:'hsl(var(--accent-foreground))',
        },
        popover: {
          DEFAULT:   'hsl(var(--popover))',
          foreground:'hsl(var(--popover-foreground))',
        },
        card: {
          DEFAULT:   'hsl(var(--card))',
          foreground:'hsl(var(--card-foreground))',
        },
      },

      spacing: {
        18: '4.5rem',
      },

      fontFamily: {
        sans:    ['var(--font-sans)',    'system-ui', 'sans-serif'],
        display: ['var(--font-display)', 'Georgia',   'serif'],
      },

      fontSize: {
        'display-2xl': ['72px', { lineHeight: '1.05', letterSpacing: '-0.02em' }],
        'display-xl':  ['58px', { lineHeight: '1.06', letterSpacing: '-0.025em' }],
        'display-lg':  ['44px', { lineHeight: '1.1',  letterSpacing: '-0.02em' }],
        'display-md':  ['34px', { lineHeight: '1.15', letterSpacing: '-0.015em' }],
        'display-sm':  ['26px', { lineHeight: '1.2',  letterSpacing: '-0.01em' }],
      },

      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },

      boxShadow: {
        soft:    '0 1px 2px rgba(15, 28, 20, 0.04), 0 1px 4px rgba(15, 28, 20, 0.04)',
        card:    '0 2px 16px rgba(15, 28, 20, 0.06)',
        elevate: '0 8px 40px rgba(15, 28, 20, 0.10)',
        ring:    '0 0 0 4px rgba(27, 107, 58, 0.12)',
      },

      keyframes: {
        'accordion-down': { from: { height: '0' }, to: { height: 'var(--radix-accordion-content-height)' } },
        'accordion-up':   { from: { height: 'var(--radix-accordion-content-height)' }, to: { height: '0' } },
        'fade-in-up':     { '0%': { opacity: '0', transform: 'translateY(8px)' }, '100%': { opacity: '1', transform: 'translateY(0)' } },
      },

      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up':   'accordion-up 0.2s ease-out',
        'fade-in-up':     'fade-in-up 0.4s ease-out',
      },
    },
  },
  plugins: [tailwindcssAnimate],
};

export default config;
