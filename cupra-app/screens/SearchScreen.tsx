import { useNavigation } from "@react-navigation/native";
import React, { useEffect, useState } from "react";
import {
	ActivityIndicator,
	FlatList,
	StyleSheet,
	Text,
	View,
} from "react-native";
import FeatureCard from "../components/FeatureCard";
import SearchBar from "../components/SearchBar";
import { useThemeColor } from "../hooks/useThemeColor";

// Importar datos
import features from "../data/features.json";

export default function SearchScreen() {
	const [searchQuery, setSearchQuery] = useState("");
	const [results, setResults] = useState<any[]>([]);
	const [loading, setLoading] = useState(false);

	const navigation = useNavigation();
	const backgroundColor = useThemeColor({}, "background");
	const textColor = useThemeColor({}, "text");
	const accentColor = useThemeColor({}, "tint");

	const handleSearch = () => {
		if (!searchQuery.trim()) {
			setResults([]);
			return;
		}

		setLoading(true);

		// Simular búsqueda con delay
		setTimeout(() => {
			const searchResults = features.filter(
				(feature) =>
					feature.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
					feature.description
						.toLowerCase()
						.includes(searchQuery.toLowerCase()) ||
					feature.category.toLowerCase().includes(searchQuery.toLowerCase()),
			);

			setResults(searchResults);
			setLoading(false);
		}, 300);
	};

	// Buscar a medida que el usuario escribe
	useEffect(() => {
		const delaySearch = setTimeout(() => {
			handleSearch();
		}, 500);

		return () => clearTimeout(delaySearch);
	}, [searchQuery]);

	const handleFeaturePress = (id: string) => {
		navigation.navigate("FeatureDetail", { featureId: id });
	};

	return (
		<View style={[styles.container, { backgroundColor }]}>
			<SearchBar
				value={searchQuery}
				onChangeText={setSearchQuery}
				onSearch={handleSearch}
				placeholder="Buscar características"
			/>

			{loading ? (
				<View style={styles.loadingContainer}>
					<ActivityIndicator size="large" color={accentColor} />
				</View>
			) : (
				<>
					{searchQuery.length > 0 && (
						<View style={styles.resultsHeader}>
							<Text style={[styles.resultsText, { color: textColor }]}>
								{results.length === 0
									? "No se encontraron resultados"
									: `${results.length} resultado${results.length === 1 ? "" : "s"} encontrado${results.length === 1 ? "" : "s"}`}
							</Text>
						</View>
					)}

					<FlatList
						data={results}
						keyExtractor={(item) => item.id}
						renderItem={({ item }) => (
							<FeatureCard
								id={item.id}
								title={item.title}
								description={item.description}
								image={item.image}
								category={item.category}
								onPress={handleFeaturePress}
								isFeatured={item.isFeatured}
							/>
						)}
						contentContainerStyle={styles.listContent}
						ListEmptyComponent={
							searchQuery.length > 0 ? (
								<View style={styles.emptyStateContainer}>
									<Text style={[styles.emptyStateTitle, { color: textColor }]}>
										No se encontraron resultados
									</Text>
									<Text
										style={[styles.emptyStateSubtitle, { color: textColor }]}
									>
										Intenta con otra palabra clave
									</Text>
								</View>
							) : (
								<View style={styles.emptyStateContainer}>
									<Text style={[styles.emptyStateTitle, { color: textColor }]}>
										Busca una característica
									</Text>
									<Text
										style={[styles.emptyStateSubtitle, { color: textColor }]}
									>
										Escribe en la barra de búsqueda para encontrar
										características de tu Cupra
									</Text>
								</View>
							)
						}
					/>
				</>
			)}
		</View>
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
	resultsHeader: {
		paddingHorizontal: 16,
		paddingVertical: 8,
	},
	resultsText: {
		fontSize: 14,
	},
	listContent: {
		padding: 16,
		paddingTop: 8,
		flexGrow: 1,
	},
	emptyStateContainer: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
		padding: 24,
		marginTop: 40,
	},
	emptyStateTitle: {
		fontSize: 18,
		fontWeight: "bold",
		textAlign: "center",
		marginBottom: 8,
	},
	emptyStateSubtitle: {
		fontSize: 14,
		textAlign: "center",
		opacity: 0.7,
	},
});
