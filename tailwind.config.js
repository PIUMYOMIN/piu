/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        roboto: ["Roboto", "sans-serif"],
        nato: ["Nato-Sans", "sans-serif"],
        montserrat: ["Montserrat", "sans-serif"],
        oswald: ["Oswald", "sans-serif"],
        merriweather: ["Merriweather", "sans-serif"]
      },
      colors: {
        "dark-purple": "#081A51",
        "primary-background": "#ffffff",
        "secondary-background": "#f5f5f5f5",
        white: "#ffffff",
        dark: "#000000",
        "sky-50": "rgb(240 249 255)",
        "sky-100": "rgb(224 242 254)",
        "sky-200": "rgb(186 230 253)",
        "sky-300": "rgb(125 211 252)",
        "sky-400": "rgb(56 189 248)",
        "sky-500": "rgb(14 165 233)",
        "sky-600": "rgb(2 132 199)",
        "sky-700": "rgb(3 105 161)",
        "sky-800": "rgb(7 89 133)",
        "sky-900": "rgb(12 74 110)",
        "sky-950": "rgb(8 47 73)",
        "slate-100": "rgb(241 245 249)",
        "slate-200": "rgb(226 232 240)",
        "slate-300": "rgb(203 213 225)",
        "slate-400": "rgb(148 163 184)",
        "slate-500": "rgb(100 116 139)",
        "slate-600": "rgb(71 85 105)",
        "slate-700": "rgb(51 65 85)",

        "green-50	": "gb(240 253 244)",
        "green-100": "rgb(220 252 231)",
        "green-200": "rgb(187 247 208)",
        "green-300": "rgb(134 239 172)",
        "green-400": "rgb(74 222 128)",
        "green-500": "rgb(34 197 94)",
        "green-600": "rgb(22 163 74)",
        "green-700": "rgb(21 128 61)",
        "green-800": "rgb(22 101 52)",
        "green-900": "rgb(20 83 45)",
        "green-950": "rgb(5 46 22)",

        "gray-600": "rgb(75 85 99)",
        "gray-700": "rgb(55 65 81)",
        "gray-800": "rgb(31 41 55)",
        "gray-900": "rgb(17 24 39)",
        "gray-950": "rgb(3 7 18)"
      },
      shadow: {
        box: "0px 20px 20px 10px rgba(0,0,0,0.14)"
      }
    },
    fontSize: {
      sm: "0.8rem",
      base: "1rem",
      xl: "1.25rem",
      "2xl": "1.563rem",
      "3xl": "1.953rem",
      "4xl": "2.441rem",
      "5xl": "3.052rem"
    }
  },
  plugins: []
};

