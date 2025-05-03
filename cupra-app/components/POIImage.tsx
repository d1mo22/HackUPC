import React, { useState } from "react";
import {
	Dimensions,
	Image,
	StyleSheet,
	Text,
	TouchableOpacity,
	View,
} from "react-native";
import { useThemeColor } from "../hooks/useThemeColor";

interface POI {
	id: string;
	name: string;
	description: string;
	coordinates: { x: number; y: number };
	category: string;
}

interface POIImageProps {
	image: string;
	pois: POI[];
	onSelectPOI: (poi: POI) => void;
}

export default function POIImage({ image, pois, onSelectPOI }: POIImageProps) {
	const [selectedId, setSelectedId] = useState<string | null>(null);
	const accentColor = useThemeColor({}, "tint");
	const textColor = useThemeColor({}, "text");

	const handlePOIPress = (poi: POI) => {
		setSelectedId(poi.id);
		onSelectPOI(poi);
	};

	return (
		<View style={styles.container}>
			<View style={styles.imageContainer}>
				<Image
					source={{ uri: image }}
					style={styles.image}
					resizeMode="contain"
				/>

				{pois.map((poi) => (
					<TouchableOpacity
						key={poi.id}
						style={[
							styles.poiMarker,
							{
								left: poi.coordinates.x,
								top: poi.coordinates.y,
								backgroundColor:
									selectedId === poi.id
										? accentColor
										: "rgba(255, 255, 255, 0.8)",
							},
						]}
						onPress={() => handlePOIPress(poi)}
						activeOpacity={0.8}
					>
						<Text
							style={[
								styles.poiMarkerText,
								{ color: selectedId === poi.id ? "white" : accentColor },
							]}
						>
							{Number.parseInt(poi.id)}
						</Text>
					</TouchableOpacity>
				))}
			</View>

			{selectedId && (
				<View
					style={[
						styles.poiInfo,
						{ backgroundColor: useThemeColor({}, "background") },
					]}
				>
					<Text style={[styles.poiName, { color: textColor }]}>
						{pois.find((p) => p.id === selectedId)?.name}
					</Text>
					<Text style={[styles.poiDescription, { color: textColor }]}>
						{pois.find((p) => p.id === selectedId)?.description}
					</Text>
					<Text style={[styles.poiCategory, { color: accentColor }]}>
						{pois.find((p) => p.id === selectedId)?.category}
					</Text>
				</View>
			)}
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
	},
	imageContainer: {
		position: "relative",
		width: "100%",
		height: Dimensions.get("window").height * 0.5,
	},
	image: {
		width: "100%",
		height: "100%",
	},
	poiMarker: {
		position: "absolute",
		width: 28,
		height: 28,
		borderRadius: 14,
		justifyContent: "center",
		alignItems: "center",
		borderWidth: 2,
		borderColor: "white",
		elevation: 5,
		shadowColor: "#000",
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.25,
		shadowRadius: 3.84,
		transform: [{ translateX: -14 }, { translateY: -14 }],
	},
	poiMarkerText: {
		fontSize: 12,
		fontWeight: "bold",
	},
	poiInfo: {
		padding: 16,
		borderRadius: 12,
		marginTop: 16,
		marginHorizontal: 16,
		elevation: 2,
		shadowColor: "#000",
		shadowOffset: { width: 0, height: 1 },
		shadowOpacity: 0.2,
		shadowRadius: 1.41,
	},
	poiName: {
		fontSize: 18,
		fontWeight: "bold",
		marginBottom: 8,
	},
	poiDescription: {
		fontSize: 14,
		lineHeight: 20,
		marginBottom: 8,
	},
	poiCategory: {
		fontSize: 12,
		fontWeight: "bold",
		textTransform: "uppercase",
	},
});
