/** @type {import('tailwindcss').Config} */
module.exports = {
	content: ["./*.{html, ts}"],
	theme: {
		colors: {
			aliceblue: "#f0f8ff",
			primaryColor: "#221d23",
			secondaryColor: "#6290c8",
		},
		extend: {
			colors: { textPrimary: "#221d23" },
			gridTemplateColumns: { myGrid: "2rem 1fr 2rem" },
			gridTemplateRows: { myGrid: "5vh 4fr 2rem" },
			gridColumn: { map: "2/3", mapInstructions: "1/4" },
			gridRow: { map: "2/3", mapInstructions: "1/2" },
		},
	},
	plugins: [],
};
