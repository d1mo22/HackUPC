import { type RouteProp, useRoute } from "@react-navigation/native";
import React, { useEffect, useState } from "react";
import {
	ActivityIndicator,
	Image,
	ScrollView,
	StyleSheet,
	Text,
	View,
} from "react-native";
import { useThemeColor } from "../hooks/useThemeColor";

// Importar datos
import features from "../data/features.json";

type FeatureDetailRouteParams = {
	featureId: string;
};

export default function FeatureDetailScreen() {
	const [loading, setLoading] = useState(true);
	const [feature, setFeature] = useState<any>(null);

	const route =
		useRoute<RouteProp<Record<string, FeatureDetailRouteParams>, string>>();
	const { featureId } = route.params;

	const backgroundColor = useThemeColor({}, "background");
	const textColor = useThemeColor({}, "text");
	const accentColor = useThemeColor({}, "tint");

	useEffect(() => {
		// Simular carga de datos
		setTimeout(() => {
			const selectedFeature = features.find((f) => f.id === featureId);
			setFeature(selectedFeature);
			setLoading(false);
		}, 500);
	}, [featureId]);

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
			</View>
		);
	}

	return (
		<ScrollView
			style={[styles.container, { backgroundColor }]}
			contentContainerStyle={styles.contentContainer}
		>
			<Image
				source={{ uri: feature.image }}
				style={styles.image}
				resizeMode="cover"
			/>

			<View style={styles.content}>
				<Text style={[styles.category, { color: accentColor }]}>
					{feature.category.toUpperCase()}
				</Text>

				<Text style={[styles.title, { color: textColor }]}>
					{feature.title}
				</Text>

				<Text style={[styles.description, { color: textColor }]}>
					{feature.description}
				</Text>

				{/* Aquí se puede agregar contenido adicional específico de cada característica */}
				<View style={styles.additionalInfoContainer}>
					<Text style={[styles.sectionTitle, { color: textColor }]}>
						Cómo utilizar esta característica
					</Text>
					<Text style={[styles.paragraph, { color: textColor }]}>
						Esta característica está diseñada para mejorar tu experiencia de
						conducción. Para activarla, simplemente navega a través del menú
						principal del vehículo y selecciona la opción correspondiente.
					</Text>
					<Text style={[styles.paragraph, { color: textColor }]}>
						Recuerda que puedes personalizar la configuración según tus
						preferencias para obtener el máximo rendimiento de tu Cupra.
					</Text>
				</View>

				<View style={styles.tipsContainer}>
					<Text style={[styles.sectionTitle, { color: textColor }]}>
						Consejos y recomendaciones
					</Text>
					<View style={styles.tipItem}>
						<Text style={[styles.tipNumber, { color: accentColor }]}>1.</Text>
						<Text style={[styles.tipText, { color: textColor }]}>
							Utiliza esta característica en condiciones óptimas para maximizar
							su eficiencia.
						</Text>
					</View>
					<View style={styles.tipItem}>
						<Text style={[styles.tipNumber, { color: accentColor }]}>2.</Text>
						<Text style={[styles.tipText, { color: textColor }]}>
							Consulta el manual del usuario para obtener información más
							detallada.
						</Text>
					</View>
					<View style={styles.tipItem}>
						<Text style={[styles.tipNumber, { color: accentColor }]}>3.</Text>
						<Text style={[styles.tipText, { color: textColor }]}>
							Mantén tu vehículo actualizado para disfrutar de las últimas
							mejoras.
						</Text>
					</View>
				</View>
			</View>
		</ScrollView>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
	},
	contentContainer: {
		paddingBottom: 24,
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
	},
	errorText: {
		fontSize: 18,
	},
	image: {
		width: "100%",
		height: 250,
	},
	content: {
		padding: 16,
	},
	category: {
		fontSize: 14,
		fontWeight: "bold",
		marginBottom: 8,
	},
	title: {
		fontSize: 28,
		fontWeight: "bold",
		marginBottom: 16,
	},
	description: {
		fontSize: 16,
		lineHeight: 24,
		marginBottom: 24,
	},
	additionalInfoContainer: {
		marginBottom: 24,
	},
	sectionTitle: {
		fontSize: 20,
		fontWeight: "bold",
		marginBottom: 12,
	},
	paragraph: {
		fontSize: 16,
		lineHeight: 24,
		marginBottom: 12,
	},
	tipsContainer: {
		marginBottom: 16,
	},
	tipItem: {
		flexDirection: "row",
		marginBottom: 12,
	},
	tipNumber: {
		fontSize: 16,
		fontWeight: "bold",
		marginRight: 8,
	},
	tipText: {
		flex: 1,
		fontSize: 16,
		lineHeight: 24,
	},
});
