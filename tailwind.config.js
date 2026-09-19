/** @type {import('tailwindcss').Config} */

// Espelha constants/design.ts. Ao mexer numa cor, mexa nos dois — design.ts é
// para hex cru (navegação, StyleSheet, ícones), este arquivo é para as classes.
module.exports = {
  content: [
    "./app/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}",
    // modais/ ficava de fora: qualquer classe Tailwind ali era silenciosamente
    // descartada na build, e por isso os modais acabaram todos em StyleSheet.
    "./modais/**/*.{js,jsx,ts,tsx}",
  ],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        canvas: "#FAF8F5",
        surface: {
          DEFAULT: "#FFFFFF",
          alt: "#F3EFE9",
          sunken: "#EDE8E0",
        },
        line: {
          DEFAULT: "#E7E1D8",
          strong: "#D8D0C4",
        },
        ink: {
          DEFAULT: "#1A1A18",
          muted: "#6E6960",
          subtle: "#A09A90",
          inverse: "#FAF8F5",
        },
        brand: {
          DEFAULT: "#B87333",
          strong: "#9A5F27",
          deep: "#7C4A1E",
          soft: "#F7EDE1",
          border: "#E8D5BE",
        },
        success: {
          DEFAULT: "#2F7D5B",
          soft: "#E7F1EC",
          border: "#C9E2D6",
        },
        warning: {
          DEFAULT: "#C9971C",
          soft: "#FBF3DE",
          border: "#EFDFB4",
        },
        danger: {
          DEFAULT: "#B3261E",
          soft: "#FBEBE9",
          border: "#F2D2CE",
        },
        info: {
          DEFAULT: "#2C6E9B",
          soft: "#E8F1F7",
          border: "#CFE1EE",
        },
      },
      fontFamily: {
        // Oswald — títulos, horários, valores.
        display: ["Oswald_600SemiBold"],
        "display-md": ["Oswald_500Medium"],
        "display-rg": ["Oswald_400Regular"],
        // Inter — todo o resto.
        sans: ["Inter_400Regular"],
        medium: ["Inter_500Medium"],
        semibold: ["Inter_600SemiBold"],
        bold: ["Inter_700Bold"],
      },
      borderRadius: {
        chip: "10px",
        control: "12px",
        card: "16px",
        sheet: "24px",
      },
    },
  },
  plugins: [],
}
