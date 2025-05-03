import { userData } from "@/screens/ProfileScreen";
import { Ionicons } from "@expo/vector-icons";
import { Stack, router, usePathname } from "expo-router";
import React from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useThemeColor } from "../../hooks/useThemeColor";

import CupraLogo from "../../components/CupraLogo";

// Definir la altura del footer como una constante que podamos reutilizar
const FOOTER_HEIGHT = 80;

export default function TabLayout() {
	const accentColor = useThemeColor({}, "tint");
	const backgroundColor = useThemeColor({}, "background");
	const textColor = useThemeColor({}, "text");
	const path = usePathname();

	// Determinar la pestaña activa directamente
	let activeTab = "";
	if (path === "/") {
		activeTab = "home";
	} else if (path === "/explore") {
		activeTab = "explore";
	} else if (path === "/search") {
		activeTab = "search";
	}

	const handleUserPress = () => {
		router.push("/(tabs)/profile");
	};

	// Función para navegar solo si no estamos ya en esa ruta
	const navigateIfNeeded = (route: string) => {
		// Comprobamos si ya estamos en la ruta actual para evitar navegación innecesaria
		if (
			(route === "/" && path === "/") ||
			(route === "/explore" && path === "/explore") ||
			(route === "/search" && path === "/search")
		) {
			console.log("Ya estás en esta ruta:", route);
			return;
		}

		// Navegar a la ruta sin el prefijo "/(tabs)"
		router.push(route);
	};

	return (
		<View style={styles.container}>
			<Stack
				screenOptions={{
					headerStyle: {
						height: 80, // Default header height
						backgroundColor: backgroundColor,
					},
					headerTintColor: textColor,
					headerShadowVisible: false,
					headerBackVisible: false,
					headerLeft: () => null,
					// Añadir padding inferior a todo el contenido para compensar la altura del footer
					contentStyle: { paddingBottom: FOOTER_HEIGHT },
				}}
			>
				<Stack.Screen
					name="index"
					options={{
						headerTitle: () => (
							<CupraLogo width={80} height={30} color={textColor} />
						),
						headerBackVisible: false,
						headerLeft: () => null,
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
					name="task-list"
					options={{
						headerTitle: () => (
							<CupraLogo width={80} height={30} color={textColor} />
						),
						headerBackVisible: false,
						headerLeft: () => null,
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
						headerBackVisible: true,
						headerLeft: undefined,
						headerTitleStyle: {
							fontFamily: "CupraBook",
						},
					}}
				/>
				<Stack.Screen
					name="feature-detail"
					options={{
						title: "",
						headerBackTitle: "Atrás",
						headerBackVisible: true,
						headerLeft: undefined,
						headerTitleStyle: {
							fontFamily: "CupraBook",
						},
					}}
				/>
			</Stack>

			{/* Footer con lógica simplificada */}
			<View style={[styles.footer, { backgroundColor }]}>
				<View style={styles.footerContent}>
					{/* Botón Home */}
					<TouchableOpacity
						style={styles.footerItem}
						onPress={() => navigateIfNeeded("/")}
					>
						<View
							style={[
								styles.footerButton,
								activeTab === "home" && styles.activeButton,
							]}
						>
							<Ionicons
								name="home"
								size={24}
								color={activeTab === "home" ? accentColor : textColor}
							/>
						</View>
						<Text
							style={[
								styles.footerText,
								activeTab === "home"
									? { color: accentColor, fontWeight: "600" }
									: { color: textColor },
							]}
						>
							Inicio
						</Text>
					</TouchableOpacity>

					{/* Botón Discover */}
					<TouchableOpacity
						style={styles.footerItem}
						onPress={() => navigateIfNeeded("/explore")}
					>
						<View
							style={[
								styles.footerButton,
								activeTab === "explore" && styles.activeButton,
							]}
						>
							<Ionicons
								name="compass"
								size={24}
								color={activeTab === "explore" ? accentColor : textColor}
							/>
						</View>
						<Text
							style={[
								styles.footerText,
								activeTab === "explore"
									? { color: accentColor, fontWeight: "600" }
									: { color: textColor },
							]}
						>
							Descubrir
						</Text>
					</TouchableOpacity>

					{/* Botón Search */}
					<TouchableOpacity
						style={styles.footerItem}
						onPress={() => navigateIfNeeded("/search")}
					>
						<View
							style={[
								styles.footerButton,
								activeTab === "search" && styles.activeButton,
							]}
						>
							<Ionicons
								name="search"
								size={24}
								color={activeTab === "search" ? accentColor : textColor}
							/>
						</View>
						<Text
							style={[
								styles.footerText,
								activeTab === "search"
									? { color: accentColor, fontWeight: "600" }
									: { color: textColor },
							]}
						>
							Buscar
						</Text>
					</TouchableOpacity>
				</View>
			</View>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
	},
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
	footer: {
		position: "absolute",
		bottom: 0,
		left: 0,
		right: 0,
		height: FOOTER_HEIGHT,
		paddingBottom: 10,
		borderTopWidth: 1,
		borderTopColor: "rgba(0,0,0,0.1)",
		shadowColor: "#000",
		shadowOffset: { width: 0, height: -2 },
		shadowOpacity: 0.1,
		shadowRadius: 3,
		elevation: 10,
	},
	footerContent: {
		flex: 1,
		flexDirection: "row",
		justifyContent: "space-around",
		alignItems: "center",
		paddingHorizontal: 20,
	},
	footerItem: {
		alignItems: "center",
		justifyContent: "center",
	},
	footerButton: {
		padding: 10,
		borderRadius: 30,
	},
	footerText: {
		fontSize: 12,
		marginTop: 4,
		fontFamily: "CupraBook",
	},
	activeButton: {
		backgroundColor: "rgba(0,0,0,0.05)",
	},
	headerStyle: {
		height: 80, // Specify the height of your custom header
	  },
});
