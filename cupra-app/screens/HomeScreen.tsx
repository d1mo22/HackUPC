import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import React, { useEffect, useState } from "react";
import {
	ActivityIndicator,
	Image,
	ScrollView,
	StyleSheet,
	Text,
	View,
	useWindowDimensions,
} from "react-native";
import FeatureCard from "../components/FeatureCard";
import { Typography } from "../constants/Typography";
import { useThemeColor } from "../hooks/useThemeColor";

// Importar los datos de características
import features from "../data/features.json";

export default function HomeScreen() {
	const [loading, setLoading] = useState(true);
	// biome-ignore lint/suspicious/noExplicitAny: <explanation>
	const [dailyFeature, setDailyFeature] = useState<any>(null);
	// biome-ignore lint/suspicious/noExplicitAny: <explanation>
	const [otherFeatures, setOtherFeatures] = useState<any[]>([]);
	const [daysRemaining] = useState(30); // Número fijo de días restantes para recibir el coche

	// Obtenemos las dimensiones de la pantalla
	const { width } = useWindowDimensions();
	const isMobile = width <= 850; // Consideramos móvil cuando es menor o igual a 768px

	const navigation = useNavigation();
	const backgroundColor = useThemeColor({}, "background");
	const textColor = useThemeColor({}, "text");
	const accentColor = useThemeColor({}, "tint");

	useEffect(() => {
		// Simular carga de datos
		setTimeout(() => {
			// Obtener características destacadas
			const featured = features.filter((feature) => feature.isFeatured);
			// Seleccionar una característica destacada aleatoria como característica diaria
			const randomIndex = Math.floor(Math.random() * featured.length);
			setDailyFeature(featured[randomIndex]);

			// Obtener el resto de características que no son la característica diaria
			setOtherFeatures(
				features.filter((feature) => feature.id !== featured[randomIndex].id),
			);

			setLoading(false);
		}, 1000);
	}, []);

	const handleFeaturePress = (id: string) => {
		navigation.navigate("FeatureDetail", { featureId: id });
	};

	const handleUserPress = () => {
		// Navegación al perfil de usuario
		navigation.navigate("Profile");
	};

	if (loading) {
		return (
			<View style={[styles.loadingContainer, { backgroundColor }]}>
				<ActivityIndicator size="large" color={accentColor} />
			</View>
		);
	}

	return (
		<ScrollView
			style={[styles.container, { backgroundColor }]}
			contentContainerStyle={styles.contentContainer}
		>
			{/* Header con icono de usuario a la derecha */}
			<View style={styles.headerWithUser}>
				<View style={styles.headerTexts}>
					<Text
						style={[
							styles.greeting,
							{ color: textColor, fontFamily: Typography.fonts.title },
						]}
					>
						¡Descubre tu Cupra!
					</Text>
					<Text
						style={[
							styles.subtitle,
							{ color: textColor, fontFamily: Typography.fonts.regular },
						]}
					>
						Descubre las características de tu vehículo
					</Text>
				</View>
			</View>

			{/* Widget mejorado de días para recibir el coche */}
			<View style={styles.deliveryCountdownContainer}>
				<View
					style={[
						styles.deliveryCountdownBadge,
						{
							backgroundColor: accentColor,
							width: isMobile ? "80%" : "40%", // Ancho dinámico según el dispositivo
						},
					]}
				>
					<View style={styles.countdownTopRow}>
						<Ionicons
							name="time-outline"
							size={22}
							color="white"
							style={styles.clockIcon}
						/>
						<Text style={styles.deliveryCountdownText}>
							<Text style={styles.deliveryCountdownDays}>{daysRemaining}</Text>{" "}
							días para recibir tu CUPRA
						</Text>
					</View>
				</View>

				{/* Miniatura del coche separada del contador */}
				<View style={styles.carImageWrapper}>
					<Image
						source={require("../assets/images/cupra-tavascan-side-view.png")}
						style={styles.carImage}
						resizeMode="contain"
					/>
					<Text style={[styles.modelName, { color: textColor }]}>
						CUPRA TAVASCAN
					</Text>
				</View>
			</View>

			{/* Daily Feature en la parte superior */}
			<View style={styles.dailyFeatureContainer}>
				<Text
					style={[
						styles.sectionTitle,
						{ color: textColor, fontFamily: Typography.fonts.title },
					]}
				>
					Característica del día
				</Text>
				{dailyFeature && (
					<FeatureCard
						id={dailyFeature.id}
						title={dailyFeature.title}
						description={dailyFeature.description}
						image={dailyFeature.image}
						category={dailyFeature.category}
						onPress={handleFeaturePress}
						isFeatured={true}
					/>
				)}
			</View>

			{/* Resto de características */}
			<View style={styles.otherFeaturesContainer}>
				<Text
					style={[
						styles.sectionTitle,
						{ color: textColor, fontFamily: Typography.fonts.title },
					]}
				>
					Otras características
				</Text>
				{otherFeatures.map((feature) => (
					<FeatureCard
						key={feature.id}
						id={feature.id}
						title={feature.title}
						description={feature.description}
						image={feature.image}
						category={feature.category}
						onPress={handleFeaturePress}
					/>
				))}
			</View>
		</ScrollView>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
	},
	contentContainer: {
		padding: 16,
	},
	loadingContainer: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
	},
	headerWithUser: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
		marginBottom: 20,
		marginTop: 12,
	},
	headerTexts: {
		flex: 1,
	},
	userIconContainer: {
		marginLeft: 12,
		padding: 4,
	},
	greeting: {
		fontSize: 28,
		fontWeight: "bold",
		marginBottom: 8,
	},
	subtitle: {
		fontSize: 16,
		opacity: 0.8,
	},
	// Estilos modificados para el contador de entrega
	deliveryCountdownContainer: {
		marginBottom: 20,
		alignItems: "center",
		width: "100%",
	},
	deliveryCountdownBadge: {
		paddingHorizontal: 18,
		paddingVertical: 14,
		borderRadius: 16,
		shadowColor: "#000",
		shadowOffset: { width: 0, height: 3 },
		shadowOpacity: 0.25,
		shadowRadius: 4,
		elevation: 6,
	},
	countdownTopRow: {
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "center",
	},
	clockIcon: {
		marginRight: 10,
	},
	deliveryCountdownText: {
		color: "white",
		fontSize: 15,
		fontFamily: Typography.fonts.regular,
	},
	deliveryCountdownDays: {
		fontWeight: "bold",
		fontSize: 20,
		fontFamily: Typography.fonts.title,
	},
	// Nuevo contenedor para la imagen del coche
	carImageWrapper: {
		marginTop: 10, // Separación de 20px del contador
		alignItems: "center",
		width: "100%",
	},
	carImage: {
		width: 240,
		height: 110,
		// Eliminado el tintColor para mostrar la imagen con sus colores originales
	},
	modelName: {
		fontSize: 18,
		fontWeight: "bold",
		marginTop: 10,
		fontFamily: Typography.fonts.title,
		letterSpacing: 0.5,
	},
	sectionTitle: {
		fontSize: 20,
		fontWeight: "bold",
		marginBottom: 16,
	},
	dailyFeatureContainer: {
		marginBottom: 24,
	},
	otherFeaturesContainer: {
		marginBottom: 16,
	},
});
