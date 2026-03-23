/** @type {import('tailwindcss').Config} */
export default {
	content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
	darkMode: "class",
	theme: {
		extend: {
			colors: {
				"primary": "#D9534F",
				"on-primary": "#ffffff",
				"secondary": "#FFB800",
				"surface": "#fff8f5",
				"on-surface": "#38312c",
				"background": "#fff8f5",
				"on-background": "#38312c",
			},
			fontFamily: {
				"headline": ["Epilogue"],
				"body": ["Plus Jakarta Sans"],
				"label": ["Plus Jakarta Sans"]
			},
			borderRadius: {"DEFAULT": "1rem", "lg": "2rem", "xl": "3rem", "full": "9999px"},
		},
	},
	plugins: [
		require('@tailwindcss/forms'),
		require('@tailwindcss/container-queries')
	],
}
