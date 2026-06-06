import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        'madrasa-green': '#064E3B',
        'madrasa-gold': '#D4AF37',
        'madrasa-cream': '#FDFBF7',
      },
    },
  },
  plugins: [],
};
export default config;
