/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [require('daisyui')],
  daisyui: {
    themes: [
      {
        monochrome: {
          "primary": "#e5e7eb", // light gray
          "secondary": "#9ca3af", // medium gray
          "accent": "#6b7280", // accent gray
          "neutral": "#18181b", // almost black
          "base-100": "#111113", // darkest background
          "base-200": "#18181b", // dark background
          "base-300": "#27272a", // border gray
          "info": "#a3a3a3",
          "success": "#22d3ee",
          "warning": "#fbbf24",
          "error": "#f87171",
          "--rounded-box": "1.5rem",
          "--rounded-btn": "1.25rem",
          "--rounded-badge": "1.25rem",
          "--animation-btn": "0.25s",
          "--animation-input": "0.2s",
          "--btn-text-case": "none",
          "--navbar-padding": "0.5rem",
          "--border-btn": "2px",
        },
      },
      "dark"
    ],
    darkTheme: "monochrome",
  },
}

