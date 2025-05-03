import React from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useThemeColor } from "../hooks/useThemeColor";

interface FeatureCardProps {
	id: string;
	title: string;
	description: string;
	image: string;
	category: string;
	onPress: (id: string) => void;
	isFeatured?: boolean;
}

export default function FeatureCard({
	id,
	title,
	description,
	image,
	category,
	onPress,
	isFeatured = false,
}: FeatureCardProps) {
	const backgroundColor = useThemeColor({}, "background");
	const textColor = useThemeColor({}, "text");
	const accentColor = useThemeColor({}, "tint");

	return (
		<TouchableOpacity
			style={[
				styles.container,
				{ backgroundColor },
				isFeatured && styles.featured,
			]}
			onPress={() => onPress(id)}
		>
			{isFeatured && (
				<View style={[styles.featuredBadge, { backgroundColor: accentColor }]}>
					<Text style={styles.featuredText}>Destacado</Text>
				</View>
			)}

			<Image source={{ uri: image }} style={styles.image} resizeMode="cover" />

			<View style={styles.content}>
				<Text style={[styles.category, { color: accentColor }]}>
					{category.toUpperCase()}
				</Text>
				<Text style={[styles.title, { color: textColor }]}>{title}</Text>
				<Text
					style={[styles.description, { color: textColor }]}
					numberOfLines={2}
				>
					{description}
				</Text>
			</View>
		</TouchableOpacity>
	);
}

const styles = StyleSheet.create({
	container: {
		borderRadius: 12,
		overflow: "hidden",
		marginBottom: 16,
		elevation: 3,
		shadowColor: "#000",
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.1,
		shadowRadius: 4,
	},
	featured: {
		borderWidth: 2,
		borderColor: "#E94560",
	},
	featuredBadge: {
		position: "absolute",
		top: 12,
		right: 12,
		paddingHorizontal: 8,
		paddingVertical: 4,
		borderRadius: 4,
		zIndex: 1,
	},
	featuredText: {
		color: "white",
		fontSize: 12,
		fontWeight: "bold",
	},
	image: {
		width: "100%",
		height: 180,
	},
	content: {
		padding: 16,
	},
	category: {
		fontSize: 12,
		fontWeight: "bold",
		marginBottom: 4,
	},
	title: {
		fontSize: 18,
		fontWeight: "bold",
		marginBottom: 8,
	},
	description: {
		fontSize: 14,
		lineHeight: 20,
	},
});
