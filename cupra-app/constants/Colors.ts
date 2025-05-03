/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

const tintColorLight = "#00597B"; // Petrol Blue (3035C)
const tintColorDark = "#C56C41"; // Iridescent Copper (10369C)

export const Colors = {
	light: {
		text: "#000",
		background: "#fff",
		tint: tintColorLight,
		tabIconDefault: "#ccc",
		tabIconSelected: tintColorLight,
		card: "#f5f5f5",
	},
	dark: {
		text: "#fff",
		background: "#121212",
		tint: tintColorDark,
		tabIconDefault: "#ccc",
		tabIconSelected: tintColorDark,
		card: "#1e1e1e",
	},
};
