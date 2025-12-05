/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      colors: {
        primary: '#f97316',
        'accent-teal': '#14b8a6',
        'accent-purple': '#6d28d9',
        'background-light': '#f8f7f5',
        'background-dark': '#121018',
      },
      fontFamily: {
        display: ['Lexend', 'sans-serif'],
      },
      borderRadius: {
        DEFAULT: '0.25rem',
        lg: '0.5rem',
        xl: '1rem',
        full: '9999px',
      },
    },
  },
  plugins: [],
};
