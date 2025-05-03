import React, { useEffect, useState } from "react";
import {
	ActivityIndicator,
	SafeAreaView,
	StyleSheet,
	Text,
	View,
} from "react-native";
import POIImage from "../components/POIImage";
import { useThemeColor } from "../hooks/useThemeColor";

// Importar datos
import poisData from "../data/pois.json";

export default function POIScreen() {
	const [loading, setLoading] = useState(true);
	const [pois, setPois] = useState<any[]>([]);
	const [selectedPOI, setSelectedPOI] = useState<any>(null);

	const backgroundColor = useThemeColor({}, "background");
	const textColor = useThemeColor({}, "text");
	const accentColor = useThemeColor({}, "tint");

	useEffect(() => {
		// Simular carga de datos
		setTimeout(() => {
			setPois(poisData);
			setLoading(false);
		}, 800);
	}, []);

	const handleSelectPOI = (poi: any) => {
		setSelectedPOI(poi);
	};

	if (loading) {
		return (
			<View style={[styles.loadingContainer, { backgroundColor }]}>
				<ActivityIndicator size="large" color={accentColor} />
			</View>
		);
	}

	return (
		<SafeAreaView style={[styles.container, { backgroundColor }]}>
			<View style={styles.header}>
				<Text style={[styles.title, { color: textColor }]}>
					Explora tu Cupra
				</Text>
				<Text style={[styles.subtitle, { color: textColor }]}>
					Descubre las características interactivas de tu vehículo
				</Text>
			</View>

			<POIImage
				image="https://example.com/cupra-interior.jpg"
				pois={pois}
				onSelectPOI={handleSelectPOI}
			/>

			<View style={styles.instructionsContainer}>
				<Text style={[styles.instructionsTitle, { color: textColor }]}>
					Instrucciones
				</Text>
				<Text style={[styles.instructionsText, { color: textColor }]}>
					Toca los puntos numerados en la imagen para obtener más información
					sobre las características específicas de tu Cupra.
				</Text>
			</View>
		</SafeAreaView>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
	},
	loadingContainer: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
	},
	header: {
		padding: 16,
		paddingBottom: 8,
	},
	title: {
		fontSize: 24,
		fontWeight: "bold",
		marginBottom: 4,
	},
	subtitle: {
		fontSize: 16,
		opacity: 0.8,
		marginBottom: 16,
	},
	instructionsContainer: {
		padding: 16,
	},
	instructionsTitle: {
		fontSize: 18,
		fontWeight: "bold",
		marginBottom: 8,
	},
	instructionsText: {
		fontSize: 14,
		lineHeight: 20,
		opacity: 0.8,
	},
});
