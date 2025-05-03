import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import { BlurView } from "expo-blur";
import { StyleSheet } from "react-native";

export default function BlurTabBarBackground() {
	return (
		<BlurView
			// System chrome material automatically adapts to the system's theme
			// and matches the native tab bar appearance on iOS.
			tint="systemChromeMaterial"
			intensity={100}
			style={StyleSheet.absoluteFill}
		/>
	);
}

export function useBottomTabOverflow() {
	try {
		return useBottomTabBarHeight();
	} catch (error) {
		// Si no se puede obtener la altura, devolver un valor predeterminado
		console.warn(
			"No se pudo obtener la altura de la barra de pestañas:",
			error,
		);
		return 80; // Valor predeterminado razonable
	}
}
