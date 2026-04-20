/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/context/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/hooks/**/*.{js,ts,jsx,tsx}",
    "./src/utils/**/*.{js,ts,jsx,tsx}",
    "./src/lib/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-mulish)", "sans-serif"],
        serif: ["var(--font-cormorant)", "serif"],
        mono: ["var(--font-mulish)", "monospace"],
      },
      colors: {
        brand: {
          green: "#8B6F5E",       // Suede coklat hangat — warna utama BenangBaju
          offwhite: "#FAF8F5",    // Ivory putih susu — background elegan
          softblack: "#1C1C1C",  // Charcoal lembut — teks utama
          gold: "#C9A47E",        // Gold champagne — aksen premium
          champagne: "#F0E6DA",  // Blush nude — background sekunder
          "sale-red": "#A64D32", // Terracotta Sale — aksen Flash Sale yang hangat
        },
      },
    },
  },
  plugins: [],
};
