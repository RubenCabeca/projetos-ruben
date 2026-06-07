import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./app/**/*.{js,ts,jsx,tsx}', './components/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      boxShadow: {
        soft: '0 20px 60px rgba(15, 23, 42, 0.08)',
      },
      backgroundImage: {
        hero: 'linear-gradient(135deg, rgba(59,130,246,0.14), rgba(168,85,247,0.12))',
      },
    },
  },
  plugins: [],
};

export default config;
