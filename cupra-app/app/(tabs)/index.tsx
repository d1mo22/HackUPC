import HomeScreen from "@/screens/HomeScreen";
import React from "react";
import { StyleSheet, View } from "react-native";

export default function Index() {
	return (
		<View style={styles.container}>
			<HomeScreen />
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: "#fff",
	},
});
