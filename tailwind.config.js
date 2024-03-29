const defaultTheme = require("tailwindcss/defaultTheme");
const colors = require("tailwindcss/colors");
const aspectRatio = require("@tailwindcss/aspect-ratio");
const lineClamp = require("@tailwindcss/line-clamp");
const typography = require("@tailwindcss/typography");

module.exports = {
	mode: "jit",
	purge: ["./src/**/*.{js,ts,tsx,css,scss,mdx}"],
	darkMode: "class",
	theme: {
		colors,
		extend: {
			fontFamily: {
				NotoSans: [
					'"Noto Sans"',
					"ui-sans-serif",
					"system-ui",
					"-apple-system",
					'"Segoe UI"',
					"Roboto",
				],
			},
			colors: {
				accent: { dark: "#1C1C1E" },
				darkBG: "#323235",
			},
			transitionTimingFunction: {
				DEFAULT: defaultTheme.transitionTimingFunction.out,
			},
		},
	},
	plugins: [aspectRatio, lineClamp, typography],
};
