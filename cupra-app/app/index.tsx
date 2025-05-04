import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React from "react";
import {
	Image,
	SafeAreaView,
	StyleSheet,
	Text,
	TouchableOpacity,
	View,
	useWindowDimensions,
} from "react-native";
import CupraLogo from "../components/CupraLogo";
import { Typography } from "../constants/Typography";
import { useThemeColor } from "../hooks/useThemeColor";

export default function WelcomeScreen() {
	const backgroundColor = useThemeColor({}, "background");
	const textColor = useThemeColor({}, "text");
	const accentColor = useThemeColor({}, "tint");

	// Obtener dimensiones de la pantalla usando el hook
	const { width, height } = useWindowDimensions();

	// Determinar si es un dispositivo móvil (menos de 768px de ancho)
	const isMobile = width < 768;

	// Seleccionar la imagen correspondiente según el tipo de dispositivo
	const backgroundImage = isMobile
		? require("../assets/images/cupra-hero.png")
		: require("../assets/images/cupra-tavascan-2024-roof-box-car-accessory.avif");

	const handleContinue = () => {
		// Navegar a la pantalla de autenticación
		router.push("/(tabs)");
	};

	// Componente de textos de bienvenida (reutilizable)
	const WelcomeTexts = () => (
		<View style={styles.headerTextContainer}>
			<Text style={[styles.title, { fontFamily: Typography.fonts.title }]}>
				Bienvenido a la experiencia CUPRA
			</Text>

			<Text style={[styles.subtitle, { fontFamily: Typography.fonts.regular }]}>
				Descubre el espíritu deportivo, rendimiento y diseño único que definen a
				CUPRA
			</Text>
		</View>
	);

	return (
		<View style={[styles.container, { backgroundColor }]}>
			<StatusBar style="light" />

			{/* Imagen de fondo */}
			<Image
				source={backgroundImage}
				style={[styles.backgroundImage, { width, height }]}
				resizeMode="cover"
			/>

			{/* Contenedor superior con logo */}
			<SafeAreaView style={styles.topContainer}>
				<View style={styles.logoContainer}>
					{/* Pasamos explícitamente el color blanco para asegurar que el logo siempre sea blanco */}
					<CupraLogo width={150} height={60} color="white" />
				</View>

				{/* En tablets o pantallas grandes, mostrar textos arriba */}
				{!isMobile && <WelcomeTexts />}
			</SafeAreaView>

			{/* Gradiente y contenido inferior */}
			<LinearGradient
				colors={["transparent", "rgba(0,0,0,0.8)"]}
				style={styles.gradient}
			>
				<View style={styles.contentContainer}>
					{/* En móvil, mostrar textos abajo */}
					{isMobile && <WelcomeTexts />}

					<View style={styles.buttonContainer}>
						<TouchableOpacity
							style={[styles.button, { backgroundColor: accentColor }]}
							onPress={handleContinue}
						>
							<Text
								style={[
									styles.buttonText,
									{ fontFamily: Typography.fonts.title },
								]}
							>
								Comenzar
							</Text>
						</TouchableOpacity>
					</View>
				</View>
			</LinearGradient>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
	},
	backgroundImage: {
		position: "absolute",
		// width y height se aplican dinámicamente
	},
	topContainer: {
		paddingTop: 60,
		paddingHorizontal: 20,
		zIndex: 10, // Asegurar que esté por encima de la imagen
	},
	logoContainer: {
		alignItems: "center",
		paddingTop: 10,
		marginBottom: 30,
	},
	headerTextContainer: {
		padding: 10,
		marginHorizontal: 10,
	},
	gradient: {
		flex: 1,
		justifyContent: "flex-end",
	},
	contentContainer: {
		padding: 30,
	},
	title: {
		fontSize: 32,
		fontWeight: "bold",
		color: "white",
		textAlign: "center",
		marginBottom: 15,
		// Sombra de texto para mejorar legibilidad
		textShadowColor: "rgba(0, 0, 0, 0.75)",
		textShadowOffset: { width: 1, height: 1 },
		textShadowRadius: 3,
	},
	subtitle: {
		fontSize: 16,
		color: "white",
		textAlign: "center",
		opacity: 0.9,
		// Sombra de texto para mejorar legibilidad
		textShadowColor: "rgba(0, 0, 0, 0.75)",
		textShadowOffset: { width: 0.5, height: 0.5 },
		textShadowRadius: 2,
	},
	buttonContainer: {
		marginTop: 15,
		marginBottom: 20,
	},
	button: {
		height: 56,
		borderRadius: 10,
		justifyContent: "center",
		alignItems: "center",
	},
	buttonText: {
		color: "white",
		fontSize: 18,
		fontWeight: "600",
	},
});
