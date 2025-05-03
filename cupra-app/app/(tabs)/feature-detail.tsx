import { useLocalSearchParams } from "expo-router";
import React from "react";
import { StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context"; // Importa SafeAreaView
import FeatureDetailScreen from "../../screens/FeatureDetailScreen";
import { Stack } from "expo-router";

export default function FeatureDetailRoute() {
	const { featureId } = useLocalSearchParams<{ featureId: string }>();

	return (
		<>
			<Stack.Screen options={{ headerShown: false }} />

			<SafeAreaView style={styles.container} edges={["top"]}>
				<FeatureDetailScreen featureId={featureId} />
			</SafeAreaView>
		</>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
	},
});
