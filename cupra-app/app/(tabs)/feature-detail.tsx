import { Stack, useLocalSearchParams } from "expo-router";
import React from "react";
import { StyleSheet, View } from "react-native";
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import FeatureDetailScreen from "../../screens/FeatureDetailScreen";

export default function FeatureDetailRoute() {
	const { featureId } = useLocalSearchParams<{ featureId: string }>();

	const insets = useSafeAreaInsets();

const top = typeof insets.top === 'number' ? insets.top : 0;
const bottom = typeof insets.bottom === 'number' ? insets.bottom : 0;
const left = typeof insets.left === 'number' ? insets.left : 0;
const right = typeof insets.right === 'number' ? insets.right : 0;
	return (
		<>
			<Stack.Screen options={{ headerShown: false }} />

			<View style={[{
paddingTop: top,
paddingBottom: bottom,
paddingLeft: left,
paddingRight: right},styles.container]}>
				<FeatureDetailScreen featureId={featureId} />
			</View>
		</>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
	},
});
