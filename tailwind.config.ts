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
        aubergine: "#6B2737",
        "aubergine-dark": "#3F1A22",
        gold: "#C9A84C",
        cream: "#FDFBF7",
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
      typography: ({ theme }: { theme: any }) => ({
        'food-mood': {
          css: {
            '--tw-prose-headings': theme('colors.aubergine-dark'),
            '--tw-prose-body': theme('colors.aubergine-dark / 0.8'),
            '--tw-prose-links': theme('colors.gold'),
            '--tw-prose-bold': theme('colors.aubergine-dark'),
            '--tw-prose-bullets': theme('colors.gold'),
            '--tw-prose-quote-borders': theme('colors.gold'),
            fontFamily: theme('fontFamily.sans').join(', '),
            h1: { fontFamily: theme('fontFamily.serif').join(', ') },
            h2: { fontFamily: theme('fontFamily.serif').join(', ') },
            h3: { fontFamily: theme('fontFamily.serif').join(', ') },
          },
        },
      }),
    },
  },
  plugins: [require("@tailwindcss/typography")],
};
export default config;
