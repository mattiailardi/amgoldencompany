
import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        border: {
          DEFAULT: "#ffd700", // Using gold as border color to match design
        },
        background: {
          DEFAULT: '#ea384c',
          foreground: '#ffffff'
        },
        foreground: {
          DEFAULT: "hsl(var(--foreground))",
        },
        primary: {
          DEFAULT: '#ffd700',
          foreground: '#ffffff'
        },
        gold: {
          DEFAULT: '#ffd700',
          50: '#fffae6',
          100: '#fff4cc',
          200: '#ffea99',
          300: '#ffdf66',
          400: '#ffd700',
          500: '#ccac00',
          600: '#998100',
          700: '#665600',
          800: '#332b00',
          900: '#1a1500'
        },
        cmr: {
          DEFAULT: '#8B0000',
          foreground: '#ffffff'
        }
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)'
      },
      keyframes: {
        'accordion-down': {
          from: {
            height: '0'
          },
          to: {
            height: 'var(--radix-accordion-content-height)'
          }
        },
        'accordion-up': {
          from: {
            height: 'var(--radix-accordion-content-height)'
          },
          to: {
            height: '0'
          }
        }
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out'
      }
    }
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;

