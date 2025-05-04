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
import { ScrollView, useWindowDimensions } from "react-native";

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

    const { width } = useWindowDimensions();
     const getItemWidth = (screenWidth: number) => {
        if (screenWidth < 500) return '100%';
        if (screenWidth < 900) return '48%';
        if (screenWidth < 1200) return '31%';
        return '23%';
    };
    const featureResults = filteredResults.filter(item => item.type === "feature");
    const otherResults = filteredResults.filter(item => item.type !== "feature");

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

const renderGridItem = (item: SearchResult) => {
    if (item.type === "feature" && item.image) {
        // For features, use the existing FeatureCard component
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
    
    // For warnings and glossary, create a similar card layout
    return (
    <TouchableOpacity
        style={[styles.gridCard, { backgroundColor: cardColor }]}
        onPress={() => handleResultPress(item)}
    >
        {/* Icon header with appropriate background color */}
        <View style={[styles.gridCardIcon, { 
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
                    style={styles.gridIconImage} 
                    resizeMode="contain"
                />
            ) : item.type === "warning" ? (
                <Ionicons name="warning" size={24} color="white" />
            ) : (
                <Ionicons name="book" size={24} color="white" />
            )}
        </View>
        
        <View style={styles.gridCardContent}>
            <Text style={[styles.gridCardTitle, { color: textColor, fontFamily: Typography.fonts.title }]} numberOfLines={1}>
                {item.title}
            </Text>
            
            <Text style={[styles.gridCardCategory, { color: accentColor }]} numberOfLines={1}>
                {item.category}
            </Text>
            
            <Text 
                style={[styles.gridCardDescription, { color: textColor }]}
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
        {loading ? (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color={accentColor} />
            </View>
        ) : (
            <FlatList
                ListHeaderComponent={<>
                    <SearchBar
                        value={searchQuery}
                        onChangeText={setSearchQuery}
                        onSearch={handleSearch}
                        placeholder="Buscar características, averías, pilotos..."
                    />
                           
        {/* Filter type options */}
        <View style={styles.typeFiltersContainer}>
            <TouchableOpacity 
                style={[
                    styles.filterTypeChip, 
                    activeFilters.includes("feature") ? { backgroundColor: accentColor } : null
                ]}
                onPress={() => filterResults("feature")}
            >
                <Ionicons 
                    name="car" 
                    size={16} 
                    color={activeFilters.includes("feature") ? "white" : textColor} 
                />
                <Text 
                    style={[
                        styles.filterTypeText, 
                        activeFilters.includes("feature") ? { color: "white" } : { color: textColor }
                    ]}
                >
                    Características
                </Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
                style={[
                    styles.filterTypeChip, 
                    activeFilters.includes("warning") ? { backgroundColor: accentColor } : null
                ]}
                onPress={() => filterResults("warning")}
            >
                <Ionicons 
                    name="warning" 
                    size={16} 
                    color={activeFilters.includes("warning") ? "white" : textColor} 
                />
                <Text 
                    style={[
                        styles.filterTypeText, 
                        activeFilters.includes("warning") ? { color: "white" } : { color: textColor }
                    ]}
                >
                    Avisos
                </Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
                style={[
                    styles.filterTypeChip, 
                    activeFilters.includes("glossary") ? { backgroundColor: accentColor } : null
                ]}
                onPress={() => filterResults("glossary")}
            >
                <Ionicons 
                    name="book" 
                    size={16}
                    color={activeFilters.includes("glossary") ? "white" : textColor} 
                />
                <Text 
                    style={[
                        styles.filterTypeText, 
                        activeFilters.includes("glossary") ? { color: "white" } : { color: textColor }
                    ]}
                >
                    Glosario
                </Text>
            </TouchableOpacity>
        </View>
                           {searchQuery.length > 0 && (
                               <>
                                   <View style={styles.resultsHeader}>
                                       <Text style={[styles.resultsText, { color: textColor }]}>
                                           {filteredResults.length === 0
                                               ? "No se encontraron resultados"
                                               : `${filteredResults.length} resultado${filteredResults.length === 1 ? "" : "s"} encontrado${filteredResults.length === 1 ? "" : "s"}`}
                                       </Text>
                                   </View>

                                   {/* Filters section remains the same */}
                                   {results.length > 0 && (
                                       <View style={styles.filtersContainer}>
                                           {/* Filter options remain the same */}
                                       </View>
                                   )}
                               </>
                           )}

                           {/* All results in grid layout */}
                           {filteredResults.length > 0 && (
                               <View style={styles.featuresSection}>
                                   <View style={styles.featuresGrid}>
                                       {filteredResults.map(item => (
                                           <View
                                               key={`${item.type}-${item.id}`}
                                               style={[styles.featureCardWrapper, { width: getItemWidth(width) }]}
                                           >
                                               {renderGridItem(item)}
                                           </View>
                                       ))}
                                   </View>
                               </View>
                           )}
                       </>}
                       data={[]} // No data for FlatList since we're rendering everything in the header
                       renderItem={undefined}               
            />
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
    featuresSection: {
        padding: 16,
        paddingTop: 8,
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: "bold",
        marginBottom: 16,
        paddingLeft: 8,
    },
    featuresGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
    },
    featureCardWrapper: {
        marginBottom: 16,
        paddingHorizontal: 8,
    },
    otherResultsSection: {
        padding: 16,
        paddingTop: 8,
    },
    gridCard: {
    borderRadius: 12,
    overflow: "hidden",
    height: 240, // Fixed height to match feature cards
    display: 'flex',
    flexDirection: 'column',
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
},
gridCardIcon: {
    height: 120, // Same height as feature card images
    justifyContent: "center",
    alignItems: "center",
    padding: 8,
},
gridIconImage: {
    width: '50%',
    height: '50%',
    aspectRatio: 1,
},
gridCardContent: {
    padding: 12,
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
},
gridCardTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 4,
},
gridCardCategory: {
    fontSize: 12,
    marginBottom: 6,
},
gridCardDescription: {
    fontSize: 14,
    opacity: 0.8,
    flex: 1,
},
typeFiltersContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    gap: 8,
},
filterTypeChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,

    marginHorizontal: 4,
},
filterTypeText: {
    fontSize: 14,
    marginLeft: 6,
    fontWeight: '500',
},
});