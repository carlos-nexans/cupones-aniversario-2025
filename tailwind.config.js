/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    "app/**/*.{ts,tsx}",
    "components/**/*.{ts,tsx}",
    "./pages/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
    "*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        success: {
          DEFAULT: "hsl(var(--success))",
          foreground: "hsl(var(--success-foreground))",
        },
        kawaii: {
          pink: {
            300: "#FFCCD9",
            DEFAULT: "#FFB6C1",
            600: "#FF91A4",
            900: "#FF6B87",
          },
          blue: {
            300: "#D6E2FF",
            DEFAULT: "#B0C4DE",
            600: "#809ECE",
            900: "#4F78BD",
          },
          yellow: {
            300: "#FFFDE1",
            DEFAULT: "#FFFACD",
            600: "#FFF5A3",
            900: "#FFEE79",
          },
          purple: {
            300: "#F0F0FF",
            DEFAULT: "#E6E6FA",
            600: "#CBCBEB",
            900: "#B1B1DC",
          },
          mint: {
            300: "#B8FFB8",
            DEFAULT: "#98FF98",
            600: "#78FF78",
            900: "#58FF58",
          },
          coral: {
            300: "#FFD6D6",
            DEFAULT: "#FFB6B6",
            600: "#FF8F8F",
            900: "#FF6969",
          },
          lavender: {
            300: "#F0F0FF",
            DEFAULT: "#E6E6FA",
            600: "#CBCBEB",
            900: "#B1B1DC",
          },
          peach: {
            300: "#FFE6CC",
            DEFAULT: "#FFDAB9",
            600: "#FFC799",
            900: "#FFB479",
          },
        },
      },
      fontFamily: {
        pixel: ['"Press Start 2P"', "cursive"],
        fun: ['"Baloo 2"', "sans-serif"],
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      backgroundImage: {
        "kawaii-gradient": "linear-gradient(135deg, #FFB6C1 0%, #B0C4DE 100%)",
        "kawaii-grid":
          "linear-gradient(to right, #ffffff15 1px, transparent 1px), linear-gradient(to bottom, #ffffff15 1px, transparent 1px)",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
}

