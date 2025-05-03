import { Stack } from "expo-router";
import { useEffect, useState } from "react";
import { Text, View } from "react-native";
import "react-native-reanimated";
import { loadFonts } from "../config/fonts";

function LoadingView() {
	return (
		<View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
			<Text>Cargando...</Text>
		</View>
	);
}

export default function RootLayout() {
	const [fontsLoaded, setFontsLoaded] = useState(false);

	useEffect(() => {
		async function prepare() {
			try {
				await loadFonts();
				setFontsLoaded(true);
			} catch (e) {
				console.warn("Error al cargar recursos:", e);
			}
		}

		prepare();
	}, []);

	if (!fontsLoaded) {
		return <LoadingView />;
	}

	return (
		<Stack screenOptions={{ headerShown: false }}>
			{/* Pantalla de bienvenida e inicio de sesión */}
			<Stack.Screen name="index" options={{ headerShown: false }} />
			<Stack.Screen
				name="auth"
				options={{ headerShown: false, presentation: "modal" }}
			/>
			<Stack.Screen name="feature-detail" options={{ headerShown: false }} />

			{/* Navegación principal después de autenticación */}
			<Stack.Screen name="(tabs)" options={{ headerShown: false }} />
		</Stack>
	);
}
