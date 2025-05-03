import { type FontSource, loadAsync } from "expo-font";

// Define las fuentes que queremos cargar
export const fonts = {
	CupraRegular: require("../assets/fonts/CupraRegular.ttf"),
	CupraBook: require("../assets/fonts/CupraBook.ttf"),
};

export async function loadFonts() {
	await loadAsync(fonts as Record<string, FontSource>);
}
