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
        cream: {
          DEFAULT: "#FAF8F5",
          50: "#FDFCFA",
          100: "#FAF8F5",
          200: "#F0EBE3",
          300: "#E3D9CE",
        },
        champagne: {
          DEFAULT: "#C9A96E",
          light: "#DFC49A",
          dark: "#A88545",
        },
        espresso: {
          DEFAULT: "#0D0B08",
          50: "#1E1A14",
          100: "#2C2518",
          200: "#3D3321",
        },
        ink: "#111008",
      },
      fontFamily: {
        display: ["'Cormorant Garamond'", "Georgia", "serif"],
        sans: ["'Inter'", "system-ui", "sans-serif"],
      },
      letterSpacing: {
        "ultra-wide": "0.25em",
      },
      transitionTimingFunction: {
        "out-quart": "cubic-bezier(0.25, 1, 0.5, 1)",
        "out-expo": "cubic-bezier(0.16, 1, 0.3, 1)",
      },
    },
  },
  plugins: [],
};

export default config;
