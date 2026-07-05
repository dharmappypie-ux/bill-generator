import type { Config } from "tailwindcss";

/**
 * Design tokens lifted from billgenerator.org (assets/css/main.css :root):
 *  --base #af78d4 (purple)  --buttoncolor #4154b9 (indigo)
 *  accent CTA #ff8c00 (orange)  --bgsection #f4f5fc  --text #3f3f3f
 *  deep blues #2942cb / #273db1   green #087982   success #008f20
 *  font: Montserrat
 */
const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: "#af78d4", // --base (purple)
          50: "#f7f1fb",
          100: "#eee0f6",
          200: "#ddc3ec",
          300: "#cba2e1",
          400: "#af78d4",
          500: "#9a5cc6",
          600: "#7e44a8",
          700: "#653586",
          800: "#4d2866",
          900: "#371b49",
        },
        indigoBtn: {
          DEFAULT: "#4154b9", // --buttoncolor
          deep: "#273db1",
          deeper: "#2942cb",
        },
        accent: {
          DEFAULT: "#ff8c00", // CTA orange
          600: "#e67e00",
          700: "#cc7000",
        },
        section: "#f4f5fc", // --bgsection
        ink: "#3f3f3f", // --text
        inkSoft: "#5a5a5a", // --darkextra
        placeholderGray: "#929292",
        success: "#008f20",
        teal: "#087982",
        line: "#ebebeb",
        line2: "#dfe2f3",
      },
      fontFamily: {
        sans: ["var(--font-montserrat)", "Montserrat", "ui-sans-serif", "system-ui", "sans-serif"],
        display: ["var(--font-montserrat)", "Montserrat", "ui-sans-serif", "system-ui", "sans-serif"],
        // Google's Product Sans (used on the original's receipts), loaded via CDN.
        product: ["'Product Sans'", "var(--font-montserrat)", "Montserrat", "sans-serif"],
        // Retro pixel font.
        pixel: ["var(--font-pixel)", "'Press Start 2P'", "monospace"],
      },
      borderRadius: {
        xl2: "1.25rem",
      },
      boxShadow: {
        card: "0 10px 30px -12px rgba(65, 84, 185, 0.18)",
        soft: "0 6px 24px -10px rgba(0,0,0,0.12)",
      },
      keyframes: {
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(24px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "fade-in": {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
      },
      animation: {
        "fade-up": "fade-up 0.6s ease-out both",
        "fade-in": "fade-in 0.5s ease-out both",
      },
    },
  },
  plugins: [],
};

export default config;
