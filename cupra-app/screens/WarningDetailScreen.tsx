import { useNavigation } from "@react-navigation/native";
import React, { useEffect, useState } from "react";
import {
    ActivityIndicator,
    Image,
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

// Importar los datos de advertencias
import warningLights from "../data/control_lamps.json";

// Definir la interfaz para los datos de advertencia
interface Warning {
    id: string;
    name: string;
    description: string;
    color: string;
    severity: string;
    actionRequired?: string;
    tags?: string[];
}

export default function WarningDetailScreen({
    warningId,
}: { warningId: string }) {
    const [loading, setLoading] = useState(true);
    const [warning, setWarning] = useState<Warning | null>(null);

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
            // Buscar la advertencia por ID
            const foundWarning = warningLights.find((w) => w.id === warningId);
            if (foundWarning) {
                setWarning(foundWarning);
            }
            setLoading(false);
        }, 500);
    }, [warningId]);

    if (warning) {
        navigation.setOptions({ title: "Avisos del tablero" });
    } else {
        navigation.setOptions({ title: "Aviso" });
    }
    
    const handleGoBack = () => {
        navigation.goBack();
    };

    // Obtener color de fondo según el tipo de advertencia
    const getWarningColor = () => {
        if (!warning) return accentColor;
        
        switch(warning.color) {
            case "red": return "#E53935";
            case "amber": return "#FFB300";
            case "green": return "#43A047";
            default: return accentColor;
        }
    };

    if (loading) {
        return (
            <View style={[styles.loadingContainer, { backgroundColor }]}>
                <ActivityIndicator size="large" color={accentColor} />
            </View>
        );
    }

    if (!warning) {
        return (
            <View style={[styles.errorContainer, { backgroundColor }]}>
                <Text style={[styles.errorText, { color: textColor }]}>
                    Aviso no encontrado
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
            {/* Icono y título */}
            <View style={[styles.detailsContainer, { backgroundColor: cardColor }]}>
                <View style={styles.warningHeader}>
                    <View style={[styles.warningIconContainer, { backgroundColor: getWarningColor() }]}>
                        <Ionicons name="warning" size={48} color="white" />
                    </View>
                </View>

                <Text
                    style={[
                        styles.warningTitle,
                        { color: textColor, fontFamily: Typography.fonts.title },
                    ]}
                >
                    {warning.name}
                </Text>
                
                <View style={styles.severityContainer}>
                    <View style={[styles.severityBadge, { backgroundColor: getWarningColor() }]}>
                        <Text style={styles.severityText}>
                            {warning.severity === "alta" ? "Prioridad Alta" : 
                             warning.severity === "media" ? "Prioridad Media" : "Prioridad Baja"}
                        </Text>
                    </View>
                </View>

                <Text
                    style={[
                        styles.warningDescription,
                        { color: textColor, fontFamily: Typography.fonts.regular },
                    ]}
                >
                    {warning.description}
                </Text>

                {/* Acción requerida */}
                {warning.actionRequired && (
                    <View style={styles.actionSection}>
                        <Text
                            style={[
                                styles.sectionTitle,
                                { color: textColor, fontFamily: Typography.fonts.title },
                            ]}
                        >
                            Acción requerida
                        </Text>
                        <View
                            style={[
                                styles.actionContainer,
                                { backgroundColor: cardBackgroundColor },
                            ]}
                        >
                            <Text style={[styles.actionText, { color: textColor }]}>
                                {warning.actionRequired}
                            </Text>
                        </View>
                    </View>
                )}

                {/* Tags o etiquetas relacionadas */}
                {warning.tags && warning.tags.length > 0 && (
                    <View style={styles.tagsSection}>
                        <Text
                            style={[
                                styles.sectionTitle,
                                { color: textColor, fontFamily: Typography.fonts.title },
                            ]}
                        >
                            Etiquetas relacionadas
                        </Text>
                        <View style={styles.tagsContainer}>
                            {warning.tags.map((tag) => (
                                <View
                                    key={tag}
                                    style={[styles.tagChip, { backgroundColor: cardBackgroundColor }]}
                                >
                                    <Text style={[styles.tagText, { color: accentColor }]}>
                                        {tag}
                                    </Text>
                                </View>
                            ))}
                        </View>
                    </View>
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
    warningHeader: {
        alignItems: 'center', 
        marginBottom: 24,
    },
    warningIconContainer: {
        width: 96,
        height: 96,
        borderRadius: 48,
        justifyContent: 'center',
        alignItems: 'center',
    },
    warningTitle: {
        fontSize: 24,
        fontWeight: "bold",
        marginBottom: 12,
        textAlign: 'center',
    },
    severityContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginBottom: 20,
    },
    severityBadge: {
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 20,
    },
    severityText: {
        color: 'white',
        fontWeight: '500',
        fontSize: 14,
    },
    warningDescription: {
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
    actionSection: {
        marginBottom: 16,
    },
    actionContainer: {
        padding: 16,
        borderRadius: 12,
    },
    actionText: {
        fontSize: 16,
        lineHeight: 24,
    },
    tagsSection: {
        marginTop: 8,
    },
    tagsContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
    },
    tagChip: {
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 20,
    },
    tagText: {
        fontSize: 14,
        fontWeight: "500",
    },
    helpButton: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 16,
        borderRadius: 12,
        marginHorizontal: 16,
        marginBottom: 16,
    },
    helpIcon: {
        marginRight: 8,
    },
    helpButtonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: '600',
        fontFamily: Typography.fonts.title,
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