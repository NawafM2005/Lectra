/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'lectra-primary': 'var(--color-lectra-primary)',
        'lectra-primary-dark': 'var(--color-lectra-primary-dark)', 
        'lectra-primary-light': 'var(--color-lectra-primary-light)',
        'lectra-bg': 'var(--color-lectra-bg)',
        'lectra-surface': 'var(--color-lectra-surface)',
        'lectra-card': 'var(--color-lectra-card)',
        'lectra-border': 'var(--color-lectra-border)',
        'lectra-text': 'var(--color-lectra-text)',
        'lectra-text-secondary': 'var(--color-lectra-text-secondary)',
        'lectra-accent': 'var(--color-lectra-accent)',
        'lectra-accent-hover': 'var(--color-lectra-accent-hover)',
        'lectra-success': 'var(--color-lectra-success)',
        'lectra-warning': 'var(--color-lectra-warning)',
        'lectra-error': 'var(--color-lectra-error)',
      },
    },
  },
  plugins: [],
}