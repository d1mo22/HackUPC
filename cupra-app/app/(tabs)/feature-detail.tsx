import { useLocalSearchParams } from "expo-router";
import React from "react";
import { StyleSheet, View } from "react-native";
import FeatureDetailScreen from "../../screens/FeatureDetailScreen";

export default function FeatureDetailRoute() {
	// Obtener el parámetro featureId de la URL
	const { featureId } = useLocalSearchParams<{ featureId: string }>();

	return (
		<View style={styles.container}>
			<FeatureDetailScreen featureId={featureId} />
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
	},
});
