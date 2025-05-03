import { useNavigation } from "@react-navigation/native";
import React, { useEffect, useState } from "react";
import {
	ActivityIndicator,
	ScrollView,
	StyleSheet,
	Text,
	View,
} from "react-native";
import FeatureCard from "../components/FeatureCard";
import { useThemeColor } from "../hooks/useThemeColor";

// Importar los datos de características
import features from "../data/features.json";

export default function HomeScreen() {
	const [loading, setLoading] = useState(true);
	const [dailyFeature, setDailyFeature] = useState<any>(null);
	const [otherFeatures, setOtherFeatures] = useState<any[]>([]);

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
			<View style={styles.header}>
				<Text style={[styles.greeting, { color: textColor }]}>
					¡Bienvenido a tu Cupra!
				</Text>
				<Text style={[styles.subtitle, { color: textColor }]}>
					Descubre las características de tu vehículo
				</Text>
			</View>

			<View style={styles.dailyFeatureContainer}>
				<Text style={[styles.sectionTitle, { color: textColor }]}>
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

			<View style={styles.otherFeaturesContainer}>
				<Text style={[styles.sectionTitle, { color: textColor }]}>
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
	header: {
		marginBottom: 24,
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
