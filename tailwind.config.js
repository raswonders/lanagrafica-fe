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
        neutral: {
          1: "var(--neutral-1)",
          2: "var(--neutral-2)",
          3: "var(--neutral-3)",
          4: "var(--neutral-4)",
          5: "var(--neutral-5)",
          6: "var(--neutral-6)",
          7: "var(--neutral-7)",
          8: "var(--neutral-8)",
          9: "var(--neutral-9)",
          10: "var(--neutral-10)",
          11: "var(--neutral-11)",
          12: "var(--neutral-12)",
          a1: "var(--neutral-a1)",
          a2: "var(--neutral-a2)",
          a3: "var(--neutral-a3)",
          a4: "var(--neutral-a4)",
          a5: "var(--neutral-a5)",
          a6: "var(--neutral-a6)",
          a7: "var(--neutral-a7)",
          a8: "var(--neutral-a8)",
          a9: "var(--neutral-a9)",
          a10: "var(--neutral-a10)",
          a11: "var(--neutral-a11)",
          a12: "var(--neutral-a12)",
        },

        accent: {
          DEFAULT: "var(--accent)",
          foreground: "var(--accent-foreground)",
          1: "var(--accent-1)",
          2: "var(--accent-2)",
          3: "var(--accent-3)",
          4: "var(--accent-4)",
          5: "var(--accent-5)",
          6: "var(--accent-6)",
          7: "var(--accent-7)",
          8: "var(--accent-8)",
          9: "var(--accent-9)",
          10: "var(--accent-10)",
          11: "var(--accent-11)",
          12: "var(--accent-12)",
          a1: "var(--accent-a1)",
          a2: "var(--accent-a2)",
          a3: "var(--accent-a3)",
          a4: "var(--accent-a4)",
          a5: "var(--accent-a5)",
          a6: "var(--accent-a6)",
          a7: "var(--accent-a7)",
          a8: "var(--accent-a8)",
          a9: "var(--accent-a9)",
          a10: "var(--accent-a10)",
          a11: "var(--accent-a11)",
          a12: "var(--accent-a12)",
        },

        danger: {
          1: "var(--danger-1)",
          2: "var(--danger-2)",
          3: "var(--danger-3)",
          4: "var(--danger-4)",
          5: "var(--danger-5)",
          6: "var(--danger-6)",
          7: "var(--danger-7)",
          8: "var(--danger-8)",
          9: "var(--danger-9)",
          10: "var(--danger-10)",
          11: "var(--danger-11)",
          12: "var(--danger-12)",
          a1: "var(--danger-a1)",
          a2: "var(--danger-a2)",
          a3: "var(--danger-a3)",
          a4: "var(--danger-a4)",
          a5: "var(--danger-a5)",
          a6: "var(--danger-a6)",
          a7: "var(--danger-a7)",
          a8: "var(--danger-a8)",
          a9: "var(--danger-a9)",
          a10: "var(--danger-a10)",
          a11: "var(--danger-a11)",
          a12: "var(--danger-a12)",
        },

        // shadcn/ui b&w theme
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
        // overwritten because its part of internal component styling
        // destructive: {
        //   DEFAULT: "hsl(var(--destructive))",
        //   foreground: "hsl(var(--destructive-foreground))",
        // },
        destructive: {
          DEFAULT: "var(--danger-11)",
          foreground: "var(--neutral-1)",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        // conflicts with my custom accent
        // accent: {
        //   DEFAULT: "hsl(var(--accent))",
        //   foreground: "hsl(var(--accent-foreground))",
        // },
        popover: {
          DEFAULT: "var(--popover)",
          foreground: "var(--popover-foreground)",
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
