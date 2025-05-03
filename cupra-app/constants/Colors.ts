/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

const tintColorLight = "#003e51"; // Petrol Blue (3035C)
const tintColorDark = "#95572b"; // Iridescent Copper (10369C)

export const Colors = {
	light: {
		text: "#000",
		lightText: "#222",
		contrastText: "#fff",
		background: "#fff",
		tint: tintColorLight,
		tabIconDefault: "#ccc",
		tabIconSelected: tintColorLight,
		card: "#f5f5f5",
		task: "#f5f5f5", // Darker background for task cards
		taskCompleted: "#f5f5f5", // Light color for completed tasks
		taskDisabled: "#dbd3cb",
		contrastHighlight: "#2c2c2c", // Dark color for contrast
		backgroundVariant: "#bbb",
	
	},
	dark: {
		text: "#fff",
		lightText: "#aaa",
		contrastText: "#000",
		background: "#121212",
		tint: tintColorDark,
		tabIconDefault: "#ccc",
		tabIconSelected: tintColorDark,
		card: "#1e1e1e",
		task: "#1e1e1e", // Darker background for task cards
		taskCompleted: "#1e1e1e", // Light color for completed tasks
		taskDisabled: "#2c2c2c", // Subtle difference for locked tasks
		contrastHighlight: "#dbd3cb", // Light color for contrast
		backgroundVariant: "#444",
		plus: "#1e1e1e", // Darker color for the plus icon
	},
};
