import React, { useEffect, useState } from "react";
import {
	ActivityIndicator,
	FlatList,
	StyleSheet,
	Text,
	TouchableOpacity,
	View,
} from "react-native";
import SearchBar from "../components/SearchBar";
import { useThemeColor } from "../hooks/useThemeColor";

// Importar datos
import glossaryData from "../data/glossary.json";

export default function GlossaryScreen() {
	const [searchQuery, setSearchQuery] = useState("");
	const [glossaryItems, setGlossaryItems] = useState<any[]>([]);
	const [filteredItems, setFilteredItems] = useState<any[]>([]);
	const [loading, setLoading] = useState(true);
	const [expandedId, setExpandedId] = useState<string | null>(null);

	const backgroundColor = useThemeColor({}, "background");
	const textColor = useThemeColor({}, "text");
	const accentColor = useThemeColor({}, "tint");
	const cardColor = useThemeColor({}, "card");

	useEffect(() => {
		// Simular carga de datos
		setTimeout(() => {
			setGlossaryItems(glossaryData);
			setFilteredItems(glossaryData);
			setLoading(false);
		}, 800);
	}, []);

	const handleSearch = () => {
		if (!searchQuery.trim()) {
			setFilteredItems(glossaryItems);
			return;
		}

		const filtered = glossaryItems.filter(
			(item) =>
				item.term.toLowerCase().includes(searchQuery.toLowerCase()) ||
				item.definition.toLowerCase().includes(searchQuery.toLowerCase()) ||
				item.category.toLowerCase().includes(searchQuery.toLowerCase()),
		);

		setFilteredItems(filtered);
	};

	useEffect(() => {
		handleSearch();
	}, [searchQuery, glossaryItems]);

	const toggleExpand = (id: string) => {
		setExpandedId(expandedId === id ? null : id);
	};

	if (loading) {
		return (
			<View style={[styles.loadingContainer, { backgroundColor }]}>
				<ActivityIndicator size="large" color={accentColor} />
			</View>
		);
	}

	return (
		<View style={[styles.container, { backgroundColor }]}>
			<View style={styles.header}>
				<Text style={[styles.title, { color: textColor }]}>Glosario Cupra</Text>
				<Text style={[styles.subtitle, { color: textColor }]}>
					Terminología y definiciones de tu vehículo
				</Text>
			</View>

			<SearchBar
				value={searchQuery}
				onChangeText={setSearchQuery}
				onSearch={handleSearch}
				placeholder="Buscar término"
			/>

			<FlatList
				data={filteredItems}
				keyExtractor={(item) => item.id}
				contentContainerStyle={styles.listContent}
				renderItem={({ item }) => (
					<TouchableOpacity
						style={[styles.glossaryItem, { backgroundColor: cardColor }]}
						onPress={() => toggleExpand(item.id)}
						activeOpacity={0.7}
					>
						<View style={styles.termContainer}>
							<Text style={[styles.term, { color: textColor }]}>
								{item.term}
							</Text>
							<Text style={[styles.category, { color: accentColor }]}>
								{item.category}
							</Text>
						</View>

						{expandedId === item.id && (
							<Text style={[styles.definition, { color: textColor }]}>
								{item.definition}
							</Text>
						)}
					</TouchableOpacity>
				)}
				ListEmptyComponent={
					<View style={styles.emptyStateContainer}>
						<Text style={[styles.emptyStateText, { color: textColor }]}>
							No se encontraron términos que coincidan con tu búsqueda.
						</Text>
					</View>
				}
			/>
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
	header: {
		padding: 16,
	},
	title: {
		fontSize: 24,
		fontWeight: "bold",
		marginBottom: 4,
	},
	subtitle: {
		fontSize: 16,
		opacity: 0.8,
	},
	listContent: {
		padding: 16,
		paddingTop: 8,
	},
	glossaryItem: {
		borderRadius: 12,
		padding: 16,
		marginBottom: 12,
		elevation: 2,
		shadowColor: "#000",
		shadowOffset: { width: 0, height: 1 },
		shadowOpacity: 0.2,
		shadowRadius: 1.41,
	},
	termContainer: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
		marginBottom: expandedId ? 12 : 0,
	},
	term: {
		fontSize: 18,
		fontWeight: "bold",
	},
	category: {
		fontSize: 14,
		fontWeight: "500",
	},
	definition: {
		fontSize: 16,
		lineHeight: 22,
	},
	emptyStateContainer: {
		padding: 24,
		alignItems: "center",
	},
	emptyStateText: {
		fontSize: 16,
		textAlign: "center",
		opacity: 0.8,
	},
});
