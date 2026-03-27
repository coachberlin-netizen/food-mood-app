import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        navy: "#1a2332",
        gold: "#b08d3e",
        cream: "#faf9f6",
        sage: "#3d7a5f",
        coral: "#d4856e",
        lavender: "#8a80a8",
      },
      fontFamily: {
        sans: ["var(--font-dm-sans)", "sans-serif"],
        serif: ["var(--font-source-serif-4)", "serif"],
      },
      boxShadow: {
        'luxury': '0 1px 3px rgba(26,35,50,0.04)',
        'luxury-hover': '0 4px 12px rgba(26,35,50,0.06)',
      },
    },
  },
  plugins: [require("@tailwindcss/typography")],
};
export default config;
