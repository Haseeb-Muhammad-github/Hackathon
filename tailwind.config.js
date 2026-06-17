/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: '#0D0D0D',
        surface: '#141414',
        surfaceAlt: '#1A1A1A',
        border: '#2A2A2A',
        primary: '#F59E0B',
        primaryHover: '#D97706',
        textPrimary: '#F5F5F5',
        textSecondary: '#A3A3A3',
        textMuted: '#525252',
        success: '#10B981',
        error: '#EF4444',
        code: '#E5E7EB',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      borderRadius: {
        'md': '4px', // PRD asks for sharp corners (max 4px)
      }
    },
  },
  plugins: [],
}
