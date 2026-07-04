import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Paleta quente e acolhedora — terracota + creme, nada corporativo
        creme: {
          50: "#FDFBF7",
          100: "#FAF5EC",
        },
        terracota: {
          400: "#E08F6B",
          500: "#D17B52",
          600: "#B5613B",
          700: "#94492C",
        },
        salvia: {
          400: "#8FA888",
          500: "#728F6A",
          600: "#5B7355",
        },
        alerta: {
          400: "#E5A24A",
          500: "#D4881F",
        },
      },
      fontFamily: {
        display: ["var(--font-display)"],
        body: ["var(--font-body)"],
      },
      borderRadius: {
        card: "1.25rem",
      },
    },
  },
  plugins: [],
};
export default config;
