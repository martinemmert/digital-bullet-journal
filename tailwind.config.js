const defaultTheme = require("tailwindcss/defaultTheme");

module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx,css,md,mdx,html,json,scss}",
  ],
  darkMode: "class",
  theme: {
    extend: {},
    fontFamily: {
      sans: ["proxima-nova", ...defaultTheme.fontFamily.sans],
      serif: ["adelle", ...defaultTheme.fontFamily.serif],
    },
  },
  plugins: [require("@tailwindcss/typography"), require("daisyui")],
};
