/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      fontFamily: {
        display: ['"familjen-grotesk"', '"Familjen Grotesk"', 'sans-serif'],
        sans: ['"helvetica-w01-roman"', 'Helvetica', 'Arial', 'sans-serif'],
        body: ['"rubik-light"', '"Rubik"', 'sans-serif'],
        menu: ['"din-next-w01-light"', '"DIN Next"', 'sans-serif'],
        light: ['"helveticaneuew01-45ligh"', '"Helvetica Neue"', 'Helvetica', 'sans-serif'],
      },
      colors: {
        brand: {
          dark: '#000000',
          light: '#ffffff',
          olive: '#7a7462',
          card: '#121212',
          border: '#262626',
          accent: '#f5f5f5',
        },
      },
    },
  },
  plugins: [],
};
