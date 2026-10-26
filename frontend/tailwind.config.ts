import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        syne: ['var(--font-syne)', 'sans-serif'],
        'dm-sans': ['var(--font-dm-sans)', 'sans-serif'],
        mono: ['var(--font-jetbrains-mono)', 'monospace'],
      },
      colors: {
        bg: {
          primary: '#f5f3ed',
          secondary: '#ebe8df',
          tertiary: '#e2ded3',
        },
        accent: {
          primary: '#b54832',
          secondary: '#b54832',
        },
        text: {
          primary: '#191916',
          secondary: '#55544e',
          tertiary: '#77756e',
        },
        success: '#61795f',
        warning: '#FFB340',
        error: '#FF5757',
      },
      animation: {
        'spin-slow': 'spin 8s linear infinite',
        'pulse-slow': 'pulse 3s ease-in-out infinite',
        'bounce-slow': 'bounce 2s ease-in-out infinite',
        'border-rotate': 'border-rotate 4s linear infinite',
        blink: 'blink 1s step-end infinite',
      },
      keyframes: {
        'border-rotate': {
          '0%': { '--border-angle': '0deg' },
          '100%': { '--border-angle': '360deg' },
        },
        blink: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0' },
        },
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from var(--border-angle, 0deg), var(--tw-gradient-stops))',
      },
    },
  },
  plugins: [],
}

export default config
