import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      colors : {
        "primary" : "#1877F2",
        "secBlue" : "#718ebf",
        "textGray" : "#606060",
        "thinBlue" : "#e3effd",
        "thinGray" : "#b1b1b1",
        "bodyBg" : "#f5f7fa"


      },
      boxShadow : {
        "shall" : "0px 4px 8px rgba(0, 0, 0, 1)"
      }
    },
  },
  plugins: [],
};
export default config;
