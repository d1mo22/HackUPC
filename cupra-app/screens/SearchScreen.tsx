import { useNavigation } from "@react-navigation/native";
import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import {
    ActivityIndicator,
    FlatList,
	Image,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import FeatureCard from "../components/FeatureCard";
import SearchBar from "../components/SearchBar";
import { useThemeColor } from "../hooks/useThemeColor";
import { Typography } from "../constants/Typography";

// Importar todos los datos necesarios
import features from "../data/features.json";
import warningLights from "../data/control_lamps.json"; // Nuevo archivo para luces de avería
import glossary from "../data/glossary.json"; // Glosario existente

// Definir interfaces para los tipos de resultados
interface SearchResult {
	color: string;
    id: string;
    title: string;
    description: string;
    type: "feature" | "warning" | "glossary";
    category: string;
    image?: string;
    priority: number; // Para ordenar resultados por relevancia
}

export default function SearchScreen() {
    const [searchQuery, setSearchQuery] = useState("");
    const [results, setResults] = useState<SearchResult[]>([]);
    const [filteredResults, setFilteredResults] = useState<SearchResult[]>([]);
    const [loading, setLoading] = useState(false);
    const [activeFilters, setActiveFilters] = useState<string[]>([]); // Para filtros de categoría

    const navigation = useNavigation();
    const backgroundColor = useThemeColor({}, "background");
    const textColor = useThemeColor({}, "text");
    const accentColor = useThemeColor({}, "tint");
    const cardColor = useThemeColor({}, "card");

    const handleSearch = () => {
        if (!searchQuery.trim()) {
            setResults([]);
            setFilteredResults([]);
            return;
        }

        setLoading(true);

        // Simular búsqueda con delay para experiencia realista
        setTimeout(() => {
            // Búsqueda en características
            const featureResults: SearchResult[] = features
                .filter(
                    (feature) =>
                        feature.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        feature.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        feature.category.toLowerCase().includes(searchQuery.toLowerCase())
                )
                .map((feature) => ({
                    id: feature.id,
                    title: feature.title,
                    description: feature.description,
                    image: feature.image,
                    category: feature.category,
                    type: "feature",
                    priority: 2,
                }));

            // Búsqueda en luces de avería/advertencia
            const warningResults: SearchResult[] = warningLights
    .filter(
        (light) =>
            light.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            light.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
            (light.tags && 
                light.tags.some(tag => 
                    tag.toLowerCase().includes(searchQuery.toLowerCase())
                ))
    )
    .map((light) => {
        // Asignar prioridad basada en severidad/color
        let severityPriority = 3; // Valor predeterminado
        if (light.color === "red" || light.severity === "alta") {
            severityPriority = 1; // Máxima prioridad para luces rojas o alta severidad
        } else if (light.color === "amber" || light.severity === "media") {
            severityPriority = 2; // Prioridad media para luces ámbar
        } else if (light.color === "green" || light.severity === "baja") {
            severityPriority = 3; // Prioridad baja para luces verdes
        }

        return {
            id: light.id,
            title: light.name,
            description: light.description,
            image: light.icon,
            category: "Tablero de instrumentos",
            type: "warning",
            priority: searchQuery.includes("averia") ? severityPriority : severityPriority + 2, // Prioridad ajustada
            severityLevel: light.severity || (light.color === "red" ? "high" : light.color === "amber" ? "medium" : "low"),
            color: light.color || "unknown"
        };
    });

            // Búsqueda en glosario
            const glossaryResults: SearchResult[] = glossary
                .filter(
                    (item) =>
                        item.term.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        item.definition.toLowerCase().includes(searchQuery.toLowerCase())
                )
                .map((item) => ({
                    id: item.id,
                    title: item.term,
                    description: item.definition,
                    category: item.category,
                    type: "glossary",
                    priority: 4,
                }));

            // Combinar y ordenar todos los resultados
            const allResults = [
                ...featureResults,
                ...warningResults,
                ...glossaryResults,
            ].sort((a, b) => a.priority - b.priority);

            setResults(allResults);
            setFilteredResults(allResults);
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

    // Filtrar resultados por tipo
    const filterResults = (type: string | null) => {
        if (!type) {
            // Si no hay filtro, mostrar todos
            setFilteredResults(results);
            setActiveFilters([]);
            return;
        }

        // Si el filtro ya está activo, quitarlo
        if (activeFilters.includes(type)) {
            const newFilters = activeFilters.filter(f => f !== type);
            setActiveFilters(newFilters);
            
            if (newFilters.length === 0) {
                setFilteredResults(results);
            } else {
                setFilteredResults(
                    results.filter(item => newFilters.includes(item.type))
                );
            }
        } else {
            // Agregar nuevo filtro
            const newFilters = [...activeFilters, type];
            setActiveFilters(newFilters);
            setFilteredResults(
                results.filter(item => newFilters.includes(item.type))
            );
        }
    };

    // Función para manejar la navegación según el tipo de resultado
    const handleResultPress = (item: SearchResult) => {
        switch (item.type) {
            case "feature":
                router.push({
                    pathname: "/(tabs)/feature-detail",
                    params: { featureId: item.id }
                });
                break;
            case "warning":
                router.push({
                    pathname: "/(tabs)",
                    params: { screen: "warning-detail", warningId: item.id }
                });
                break;
            case "glossary":
                router.push({
                    pathname: "/(tabs)",
                    params: { screen: "glossary", initialTerm: item.id }
                });
                break;
        }
    };

    // Renderizar elemento de resultado según su tipo
    const renderSearchResult = ({ item }: { item: SearchResult }) => {
    if (item.type === "feature" && item.image) {
        // Para características, usar el componente existente
        return (
            <FeatureCard
                id={item.id}
                title={item.title}
                description={item.description}
                image={item.image}
                category={item.category}
                onPress={() => handleResultPress(item)}
            />
        );
    }
    
    // Para otros tipos, usar un estilo de tarjeta personalizado
    return (
        <TouchableOpacity
            style={[styles.resultCard, { backgroundColor: cardColor }]}
            onPress={() => handleResultPress(item)}
        >
            {/* Icono según tipo */}
            <View style={[styles.resultIconContainer, { 
                backgroundColor: item.type === "warning" 
                    ? (item.color === "red" ? "#E53935" : 
                       item.color === "amber" ? "#FFB300" : 
					   item.color === "green" ? "#43A047" :
                       accentColor) 
                    : accentColor
            }]}>
                {item.type === "warning" && item.image ? (
                    <Image 
                        source={{ uri: item.image }} 
                        style={styles.warningIcon} 
                        resizeMode="contain"
                    />
                ) : item.type === "warning" ? (
                    <Ionicons name="warning" size={24} color="white" />
                ) : item.type === "glossary" ? (
                    <Ionicons name="book" size={24} color="white" />
                ) : (
                    <Ionicons name="information-circle" size={24} color="white" />
                )}
            </View>
            
            <View style={styles.resultContent}>
                <Text style={[styles.resultTitle, { color: textColor, fontFamily: Typography.fonts.title }]}>
                    {item.title}
                </Text>
                
                <Text style={[styles.resultCategory, { color: accentColor }]}>
                    {item.category} • {item.type === "warning" ? "Aviso" :
                      item.type === "glossary" ? "Glosario" : "Característica"}
                </Text>
                
                <Text 
                    style={[styles.resultDescription, { color: textColor }]}
                    numberOfLines={2}
                >
                    {item.description}
                </Text>
            </View>
        </TouchableOpacity>
    );
};
    return (
        <View style={[styles.container, { backgroundColor }]}>
            <SearchBar
                value={searchQuery}
                onChangeText={setSearchQuery}
                onSearch={handleSearch}
                placeholder="Buscar características, averías, pilotos..."
            />

            {loading ? (
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color={accentColor} />
                </View>
            ) : (
                <>
                    {searchQuery.length > 0 && (
                        <>
                            <View style={styles.resultsHeader}>
                                <Text style={[styles.resultsText, { color: textColor }]}>
                                    {filteredResults.length === 0
                                        ? "No se encontraron resultados"
                                        : `${filteredResults.length} resultado${filteredResults.length === 1 ? "" : "s"} encontrado${filteredResults.length === 1 ? "" : "s"}`}
                                </Text>
                            </View>
                            
                            {/* Filtros de tipo */}
                            {results.length > 0 && (
                                <View style={styles.filtersContainer}>
                                    <TouchableOpacity
                                        style={[
                                            styles.filterChip,
                                            activeFilters.includes("feature") && 
                                            { backgroundColor: accentColor }
                                        ]}
                                        onPress={() => filterResults("feature")}
                                    >
                                        <Text style={[
                                            styles.filterChipText,
                                            activeFilters.includes("feature") && { color: "white" }
                                        ]}>
                                            Características
                                        </Text>
                                    </TouchableOpacity>
                                    
                                    <TouchableOpacity
                                        style={[
                                            styles.filterChip,
                                            activeFilters.includes("warning") && 
                                            { backgroundColor: accentColor }
                                        ]}
                                        onPress={() => filterResults("warning")}
                                    >
                                        <Text style={[
                                            styles.filterChipText,
                                            activeFilters.includes("warning") && { color: "white" }
                                        ]}>
                                            Avisos
                                        </Text>
                                    </TouchableOpacity>
                                    
                                    
                                    <TouchableOpacity
                                        style={[
                                            styles.filterChip,
                                            activeFilters.includes("glossary") && 
                                            { backgroundColor: accentColor }
                                        ]}
                                        onPress={() => filterResults("glossary")}
                                    >
                                        <Text style={[
                                            styles.filterChipText,
                                            activeFilters.includes("glossary") && { color: "white" }
                                        ]}>
                                            Glosario
                                        </Text>
                                    </TouchableOpacity>
                                </View>
                            )}
                        </>
                    )}

                    <FlatList
                        data={filteredResults}
                        keyExtractor={(item) => `${item.type}-${item.id}`}
                        renderItem={renderSearchResult}
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
                                        Intenta con otra palabra clave o revisa la ortografía
                                    </Text>
                                </View>
                            ) : (
                                <View style={styles.emptyStateContainer}>
                                    <Text style={[styles.emptyStateTitle, { color: textColor }]}>
                                        Busca en el manual interactivo
                                    </Text>
                                    <Text
                                        style={[styles.emptyStateSubtitle, { color: textColor }]}
                                    >
                                        Encuentra características, avisos del tablero, soluciones a problemas comunes y términos del glosario
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
    filtersContainer: {
        flexDirection: "row",
        paddingHorizontal: 16,
        paddingBottom: 8,
        flexWrap: "wrap",
    },
    filterChip: {
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 16,
        marginRight: 8,
        marginBottom: 8,
        backgroundColor: "#f0f0f0",
    },
    filterChipText: {
        fontSize: 12,
        color: "#333",
    },
    listContent: {
        padding: 16,
        paddingTop: 8,
        flexGrow: 1,
    },
    resultCard: {
        borderRadius: 12,
        marginBottom: 16,
        overflow: "hidden",
        flexDirection: "row",
    },
    resultIconContainer: {
        width: 70, 
        minHeight: 80,
        justifyContent: "center",
        alignItems: "center",
        padding: 8, 
    },
    resultContent: {
        flex: 1,
        padding: 16,
    },
    resultTitle: {
        fontSize: 16,
        fontWeight: "bold",
        marginBottom: 4,
    },
    resultCategory: {
        fontSize: 12,
        marginBottom: 6,
    },
    resultDescription: {
        fontSize: 14,
        opacity: 0.8,
    },
     warningIcon: {
        width: '100%',
        height: '100%',
        aspectRatio: 1, // Mantener relación de aspecto cuadrada
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