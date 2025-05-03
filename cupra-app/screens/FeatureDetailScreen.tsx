import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import React, { useEffect, useState } from "react";
import {
	ActivityIndicator,
	Image,
	ScrollView,
	StyleSheet,
	Text,
	TouchableOpacity,
	View,
	useWindowDimensions,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Typography } from "../constants/Typography";
import { useThemeColor } from "../hooks/useThemeColor";

// Importar los datos de características
import features from "../data/features.json";

// Definir la interfaz para los datos de la característica
interface Feature {
	id: string;
	title: string;
	description: string;
	image: string;
	category: string;
	fullDescription?: string;
	specs?: { name: string; value: string }[];
	isFeatured?: boolean;
}

export default function FeatureDetailScreen({
	featureId,
}: { featureId: string }) {
	const [loading, setLoading] = useState(true);
	const [feature, setFeature] = useState<Feature | null>(null);

	// Obtenemos las dimensiones de la pantalla
	const { width } = useWindowDimensions();
	const isMobile = width <= 850;

	const navigation = useNavigation();

	// Colores del tema
	const backgroundColor = useThemeColor({}, "background");
	const textColor = useThemeColor({}, "text");
	const accentColor = useThemeColor({}, "tint");
	const cardColor = useThemeColor({}, "card");
	const cardBackgroundColor = useThemeColor({}, "cardBackground");
	const cardAccentColor = useThemeColor({}, "cardAccent");

	useEffect(() => {
		// Simular carga de datos
		setTimeout(() => {
			// Buscar la característica por ID
			const foundFeature = features.find((f) => f.id === featureId);
			if (foundFeature) {
				setFeature(foundFeature);
			}
			setLoading(false);
		}, 500);
	}, [featureId]);

	const handleGoBack = () => {
		navigation.goBack();
	};

	if (loading) {
		return (
			<View style={[styles.loadingContainer, { backgroundColor }]}>
				<ActivityIndicator size="large" color={accentColor} />
			</View>
		);
	}

	if (!feature) {
		return (
			<View style={[styles.errorContainer, { backgroundColor }]}>
				<Text style={[styles.errorText, { color: textColor }]}>
					Característica no encontrada
				</Text>
				<TouchableOpacity
					style={[styles.backButton, { backgroundColor: accentColor }]}
					onPress={handleGoBack}
				>
					<Text style={styles.backButtonText}>Volver</Text>
				</TouchableOpacity>
			</View>
		);
	}

	return (
		<SafeAreaView style={{ flex: 1, backgroundColor }}>
			<ScrollView
				style={[styles.container, { backgroundColor }]}
				contentContainerStyle={styles.contentContainer}
			>
				{/* Header con botón de retroceso */}
				<View style={styles.header}>
					<TouchableOpacity
						onPress={handleGoBack}
						style={styles.backButtonContainer}
					>
						<Ionicons name="arrow-back" size={24} color={textColor} />
					</TouchableOpacity>
					<Text
						style={[
							styles.headerTitle,
							{ color: textColor, fontFamily: Typography.fonts.title },
						]}
					>
						{feature.category}
					</Text>
				</View>

				{/* Imagen principal */}
				<View
					style={[
						styles.imageContainer,
						isMobile && {
							height: 350, // Altura específica para móvil
							backgroundColor,
						},
					]}
				>
					<Image
						source={{ uri: feature.image }}
						style={styles.featureImage}
						resizeMode={isMobile ? "contain" : "cover"} // Cambiar el modo según dispositivo
					/>
				</View>

				{/* Título y descripción */}
				<View style={[styles.detailsContainer, { backgroundColor: cardColor }]}>
					<Text
						style={[
							styles.featureTitle,
							{ color: textColor, fontFamily: Typography.fonts.title },
						]}
					>
						{feature.title}
					</Text>

					<View style={styles.categoryBadge}>
						<Text style={[styles.categoryText, { color: accentColor }]}>
							{feature.category}
						</Text>
					</View>

					<Text
						style={[
							styles.featureDescription,
							{ color: textColor, fontFamily: Typography.fonts.regular },
						]}
					>
						{feature.fullDescription || feature.description}
					</Text>

					{/* Especificaciones técnicas (si existen) */}
					{feature.specs && feature.specs.length > 0 && (
						<>
							<Text
								style={[
									styles.specsSectionTitle,
									{ color: textColor, fontFamily: Typography.fonts.title },
								]}
							>
								Especificaciones
							</Text>
							<View style={styles.specsContainer}>
								{feature.specs.map((spec) => (
									<View
										key={spec.name}
										style={[
											styles.specItem,
											{ backgroundColor: cardBackgroundColor },
										]}
									>
										<Text style={[styles.specName, { color: textColor }]}>
											{spec.name}
										</Text>
										<Text style={[styles.specValue, { color: accentColor }]}>
											{spec.value}
										</Text>
									</View>
								))}
							</View>
						</>
					)}
				</View>
			</ScrollView>
		</SafeAreaView>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
	},
	contentContainer: {
		paddingBottom: 40,
	},
	loadingContainer: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
	},
	errorContainer: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
		padding: 20,
	},
	errorText: {
		fontSize: 18,
		marginBottom: 20,
		textAlign: "center",
		fontFamily: Typography.fonts.regular,
	},
	header: {
		flexDirection: "row",
		alignItems: "center",
		paddingHorizontal: 16,
		paddingVertical: 12,
	},
	backButtonContainer: {
		padding: 8,
	},
	headerTitle: {
		fontSize: 18,
		marginLeft: 12,
		fontWeight: "bold",
	},
	imageContainer: {
		width: "100%",
		height: 550, // Altura base para escritorio
		overflow: "hidden",
	},
	featureImage: {
		width: "100%",
		height: "100%",
	},
	detailsContainer: {
		padding: 20,
		margin: 16,
		borderRadius: 12,
	},
	featureTitle: {
		fontSize: 24,
		fontWeight: "bold",
		marginBottom: 8,
	},
	categoryBadge: {
		marginBottom: 16,
	},
	categoryText: {
		fontSize: 14,
		fontWeight: "bold",
	},
	featureDescription: {
		fontSize: 16,
		lineHeight: 24,
		marginBottom: 20,
	},
	specsSectionTitle: {
		fontSize: 20,
		fontWeight: "bold",
		marginTop: 16,
		marginBottom: 12,
	},
	specsContainer: {
		gap: 8,
	},
	specItem: {
		flexDirection: "row",
		justifyContent: "space-between",
		padding: 12,
		borderRadius: 8,
		marginBottom: 8,
	},
	specName: {
		fontSize: 14,
		fontFamily: Typography.fonts.regular,
	},
	specValue: {
		fontSize: 14,
		fontWeight: "bold",
		fontFamily: Typography.fonts.title,
	},
	actionButton: {
		flexDirection: "row",
		justifyContent: "center",
		alignItems: "center",
		marginHorizontal: 16,
		paddingVertical: 16,
		borderRadius: 12,
		marginTop: 20,
	},
	actionButtonText: {
		color: "white",
		fontWeight: "bold",
		fontSize: 16,
		marginRight: 8,
		fontFamily: Typography.fonts.title,
	},
	backButton: {
		paddingHorizontal: 20,
		paddingVertical: 12,
		borderRadius: 8,
	},
	backButtonText: {
		color: "white",
		fontWeight: "bold",
		fontSize: 16,
		fontFamily: Typography.fonts.title,
	},
});
