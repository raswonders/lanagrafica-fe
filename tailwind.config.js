/** @type {import('tailwindcss').Config} */
import animate from "tailwindcss-animate";

export default {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        mauve: {
          1: "var(--mauve-1)",
          2: "var(--mauve-2)",
          3: "var(--mauve-3)",
          4: "var(--mauve-4)",
          5: "var(--mauve-5)",
          6: "var(--mauve-6)",
          7: "var(--mauve-7)",
          8: "var(--mauve-8)",
          9: "var(--mauve-9)",
          10: "var(--mauve-10)",
          11: "var(--mauve-11)",
          12: "var(--mauve-12)",
        },
        mauveA: {
          1: "var(--mauve-a1)",
          2: "var(--mauve-a2)",
          3: "var(--mauve-a3)",
          4: "var(--mauve-a4)",
          5: "var(--mauve-a5)",
          6: "var(--mauve-a6)",
          7: "var(--mauve-a7)",
          8: "var(--mauve-a8)",
          9: "var(--mauve-a9)",
          10: "var(--mauve-a10)",
          11: "var(--mauve-a11)",
          12: "var(--mauve-a12)",
        },
        plum: {
          1: "var(--plum-1)",
          2: "var(--plum-2)",
          3: "var(--plum-3)",
          4: "var(--plum-4)",
          5: "var(--plum-5)",
          6: "var(--plum-6)",
          7: "var(--plum-7)",
          8: "var(--plum-8)",
          9: "var(--plum-9)",
          10: "var(--plum-10)",
          11: "var(--plum-11)",
          12: "var(--plum-12)",
        },
        plumA: {
          1: "var(--plum-a1)",
          2: "var(--plum-a2)",
          3: "var(--plum-a3)",
          4: "var(--plum-a4)",
          5: "var(--plum-a5)",
          6: "var(--plum-a6)",
          7: "var(--plum-a7)",
          8: "var(--plum-a8)",
          9: "var(--plum-a9)",
          10: "var(--plum-a10)",
          11: "var(--plum-a11)",
          12: "var(--plum-a12)",
        },
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
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [animate],
};
