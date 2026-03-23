/** @type {import('tailwindcss').Config} */
export default {
	content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
	darkMode: "class",
	theme: {
		extend: {
			colors: {
				"primary": "#416047",
				"on-primary": "#ffffff",
				"secondary": "#A94B32",
                "on-secondary": "#ffffff",
				"surface": "#F9F6F0",
				"on-surface": "#2D2621",
				"surface-variant": "#EFEBE3",
				"on-surface-variant": "#4A433D",
				"background": "#F9F6F0",
				"on-background": "#2D2621",
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
