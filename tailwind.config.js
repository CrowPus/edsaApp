/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",
  content: [
    "./app/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}",
    "./context/**/*.{js,jsx,ts,tsx}",
    "./services/**/*.{js,jsx,ts,tsx}",
  ],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        edsa: {
          navy: "#0B2545",
          primary: "#133E87",
          gold: "#F59E0B", // Energy gold/amber
          white: "#FFFFFF",
          surface: "#F8FAFC",
          border: "#E2E8F0",
          muted: "#475569",
          
          success: "#059669",
          successBg: "#ECFDF5",
          danger: "#DC2626",
          dangerBg: "#FEF2F2",
          warning: "#D97706",
          warningBg: "#FFFBEB",
          focus: "#3B82F6",
        },
      },
      fontFamily: {
        mono: ['ui-monospace', 'SFMono-Regular', 'Menlo', 'Monaco', 'Consolas', '"Liberation Mono"', '"Courier New"', 'monospace'],
      }
    },
  },
  plugins: [],
};
