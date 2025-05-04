import { useNavigation } from "@react-navigation/native";
import React, { useEffect, useState } from "react";
import {
    ActivityIndicator,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
    useWindowDimensions,
} from "react-native";
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from "@expo/vector-icons";
import { Typography } from "../constants/Typography";
import { useThemeColor } from "../hooks/useThemeColor";

// Importar los datos del glosario
import glossary from "../data/glossary.json";

// Definir la interfaz para los términos del glosario
interface GlossaryTerm {
    id: string;
    term: string;
    definition: string;
    category: string;
    examples?: string[];
    relatedTerms?: string[];
}

export default function GlossaryDetailScreen({
    termId,
}: { termId: string }) {
    const [loading, setLoading] = useState(true);
    const [term, setTerm] = useState<GlossaryTerm | null>(null);

    // Obtenemos las dimensiones de la pantalla
    const { width } = useWindowDimensions();
    const isMobile = width <= 850;

    const navigation = useNavigation();

    // Colores del tema
    const backgroundColor = useThemeColor({}, "background");
    const textColor = useThemeColor({}, "text");
    const accentColor = useThemeColor({}, "tint");
    const cardColor = useThemeColor({}, "card");
    const cardBackgroundColor = useThemeColor({}, "cardBackground");

    const insets = useSafeAreaInsets();

    useEffect(() => {
        // Simular carga de datos
        setTimeout(() => {
            // Buscar el término por ID
            const foundTerm = glossary.find((g) => g.id === termId);
            if (foundTerm) {
                setTerm(foundTerm);
            }
            setLoading(false);
        }, 500);
    }, [termId]);

    if (term) {
        navigation.setOptions({ title: `${term.category}` });
    }
    else {
        navigation.setOptions({ title: "Glosario" });
    }
    
    const handleGoBack = () => {
        navigation.goBack();
    };

    if (loading) {
        return (
            <View style={[styles.loadingContainer, { backgroundColor }]}>
                <ActivityIndicator size="large" color={accentColor} />
            </View>
        );
    }

    if (!term) {
        return (
            <View style={[styles.errorContainer, { backgroundColor }]}>
                <Text style={[styles.errorText, { color: textColor }]}>
                    Término no encontrado
                </Text>
                <TouchableOpacity
                    style={[styles.backButton, { backgroundColor: accentColor }]}
                    onPress={handleGoBack}
                >
                    <Text style={styles.backButtonText}>Volver</Text>
                </TouchableOpacity>
            </View>
        );
    }

    return (
        <ScrollView
            style={[styles.container, { backgroundColor }]}
            contentContainerStyle={styles.contentContainer}
        >
            {/* Título y definición */}
            <View style={[styles.detailsContainer, { backgroundColor: cardColor }]}>
                <View style={styles.termHeader}>
                    <Ionicons name="book-outline" size={24} color={accentColor} style={styles.termIcon} />
                    <Text
                        style={[
                            styles.termTitle,
                            { color: textColor, fontFamily: Typography.fonts.title },
                        ]}
                    >
                        {term.term}
                    </Text>
                </View>

                <View style={styles.categoryBadge}>
                    <Text style={[styles.categoryText, { color: accentColor }]}>
                        {term.category}
                    </Text>
                </View>

                <Text
                    style={[
                        styles.termDefinition,
                        { color: textColor, fontFamily: Typography.fonts.regular },
                    ]}
                >
                    {term.definition}
                </Text>

                {/* Ejemplos (si existen) */}
                {term.examples && term.examples.length > 0 && (
                    <>
                        <Text
                            style={[
                                styles.sectionTitle,
                                { color: textColor, fontFamily: Typography.fonts.title },
                            ]}
                        >
                            Ejemplos
                        </Text>
                        <View style={styles.examplesContainer}>
                            {term.examples.map((example, index) => (
                                <View
                                    key={index}
                                    style={[
                                        styles.exampleItem,
                                        { backgroundColor: cardBackgroundColor },
                                    ]}
                                >
                                    <Text style={[styles.exampleText, { color: textColor }]}>
                                        {example}
                                    </Text>
                                </View>
                            ))}
                        </View>
                    </>
                )}

                {/* Términos relacionados (si existen) */}
                {term.relatedTerms && term.relatedTerms.length > 0 && (
                    <>
                        <Text
                            style={[
                                styles.sectionTitle,
                                { color: textColor, fontFamily: Typography.fonts.title },
                            ]}
                        >
                            Términos relacionados
                        </Text>
                        <View style={styles.relatedTermsContainer}>
                            {term.relatedTerms.map((relatedTerm) => (
                                <TouchableOpacity
                                    key={relatedTerm}
                                    style={[styles.relatedTermChip, { backgroundColor: cardBackgroundColor }]}
                                    onPress={() => {
                                        const relatedTermObj = glossary.find(g => g.term === relatedTerm);
                                        if (relatedTermObj) {
                                            setTerm(relatedTermObj);
                                        }
                                    }}
                                >
                                    <Text style={[styles.relatedTermText, { color: accentColor }]}>
                                        {relatedTerm}
                                    </Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                    </>
                )}
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
    },
    contentContainer: {
        paddingBottom: 40,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    errorContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        padding: 20,
    },
    errorText: {
        fontSize: 18,
        marginBottom: 20,
        textAlign: "center",
        fontFamily: Typography.fonts.regular,
    },
    detailsContainer: {
        padding: 20,
        margin: 16,
        borderRadius: 12,
    },
    termHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
    },
    termIcon: {
        marginRight: 12,
    },
    termTitle: {
        fontSize: 24,
        fontWeight: "bold",
    },
    categoryBadge: {
        marginBottom: 16,
    },
    categoryText: {
        fontSize: 14,
        fontWeight: "bold",
    },
    termDefinition: {
        fontSize: 16,
        lineHeight: 24,
        marginBottom: 20,
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: "bold",
        marginTop: 16,
        marginBottom: 12,
    },
    examplesContainer: {
        gap: 8,
    },
    exampleItem: {
        padding: 12,
        borderRadius: 8,
        marginBottom: 8,
    },
    exampleText: {
        fontSize: 14,
        fontFamily: Typography.fonts.regular,
    },
    relatedTermsContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
    },
    relatedTermChip: {
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 20,
    },
    relatedTermText: {
        fontSize: 14,
        fontWeight: "500",
    },
    backButton: {
        paddingHorizontal: 20,
        paddingVertical: 12,
        borderRadius: 8,
    },
    backButtonText: {
        color: "white",
        fontWeight: "bold",
        fontSize: 16,
        fontFamily: Typography.fonts.title,
    },
});