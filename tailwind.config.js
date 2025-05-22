/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{svelte,js,ts}",
    "./src/components/**/*.{svelte,js,ts}",
    "./src/routes/**/*.{svelte,js,ts}",
    "./src/lib/**/*.{svelte,js,ts}",
  ],
  theme: {
    extend: {
      colors: {
        ColorPrincipal: "#015ae2",
      },
      fontFamily: {
        PerformanceMark: ['"Permanent Marker"', "sans-serif"],
        pragmatica: ["Pragmatica", "sans-serif"],
        poppins: ["Poppins", "sans-serif"],
      },
      borderRadius: {
        "4xl": "2rem",
        "5xl": "3rem",
        "6xl": "4rem",
        "7xl": "5rem",
        "8xl": "6rem",
      },
      screens: {
        xs: "300px",
        sm: "480px",
        "sm-md": "525px",
        md: "768px",
        lg: "1024px",
        xl: "1280px",
        "xl-md": "1440px",
        "2xl": "1536px",
        "3xl": "1850px",
        "4xl": "2115px",
      },
      backgroundImage: {
        landing: "url('/Bg/bglandin.webp')",
        engine: "url('/bg/bgHoja.webp')",
        history: "url('/Bg/bgNews.webp')",
      },
    },
  },
  plugins: [],
};
