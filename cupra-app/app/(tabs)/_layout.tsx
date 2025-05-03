import { userData } from "@/screens/ProfileScreen";
import { Stack, router } from "expo-router";
import React from "react";
import { Image, StyleSheet, TouchableOpacity } from "react-native";
import { useThemeColor } from "../../hooks/useThemeColor";

import CupraLogo from "../../components/CupraLogo";

export default function TabLayout() {
	const accentColor = useThemeColor({}, "tint");
	const backgroundColor = useThemeColor({}, "background");
	const textColor = useThemeColor({}, "text");

	const handleUserPress = () => {
		router.push("/(tabs)/profile");
	};

	return (
		<Stack
			screenOptions={{
				headerStyle: {
					backgroundColor: backgroundColor,
				},
				headerTintColor: textColor,
				headerShadowVisible: false,
				headerBackVisible: false, // Desactivar botón de retroceso para todas las pantallas por defecto
				headerLeft: () => null, // Forzar que no haya ningún componente a la izquierda
			}}
		>
			<Stack.Screen
				name="index"
				options={{
					// Usar el componente CupraLogo en lugar de un título de texto
					headerTitle: () => (
						<CupraLogo width={80} height={30} color={textColor} />
					),
					headerBackVisible: false, // Redundante pero por seguridad
					headerLeft: () => null, // Forzar que no haya elemento en la izquierda
					headerRight: () => (
						<TouchableOpacity
							style={styles.userIconContainer}
							onPress={handleUserPress}
						>
							<Image
								source={{ uri: userData.profileImage }}
								style={styles.userProfileImage}
							/>
						</TouchableOpacity>
					),
				}}
			/>
			<Stack.Screen
				name="profile"
				options={{
					title: "Mi Perfil",
					headerBackTitle: "Atrás",
					headerBackVisible: true, // Aquí sí queremos el botón de retroceso
					headerLeft: undefined, // Usar el botón de retroceso predeterminado
					headerTitleStyle: {
						fontFamily: "CupraBook",
					},
				}}
			/>
		</Stack>
	);
}

const styles = StyleSheet.create({
	userIconContainer: {
		marginRight: 15,
		borderRadius: 20,
		overflow: "hidden",
	},
	userProfileImage: {
		width: 36,
		height: 36,
		borderRadius: 18,
	},
});
