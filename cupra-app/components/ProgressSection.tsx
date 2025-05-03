import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { useThemeColor } from "../hooks/useThemeColor";


interface ProgressSectionProps {
    completedTasks: number;
    totalTasks: number;
    progress: number;
    xpEarned: number;
    accentColor: string;
    textColor: string;
}

const ProgressSection: React.FC<ProgressSectionProps> = ({
    completedTasks,
    totalTasks,
    progress,
    xpEarned,
    accentColor,
    textColor,
}) => {

    // Agrupa todos los colores del tema al inicio del componente
            const backgroundColor = useThemeColor({}, "background");
            const cardColor = useThemeColor({}, "card");
            const cardBackgroundColor = useThemeColor({}, "cardBackground");
            const cardAccentColor = useThemeColor({}, "cardAccent");
            const taskColor = useThemeColor({}, "lightText");
            const taskCompletedColor = useThemeColor({}, "taskCompleted");
            const taskDisabledColor = useThemeColor({}, "taskDisabled");
            const contrastHighlight = useThemeColor({}, "contrastHighlight");
            const contrastText = useThemeColor({}, "plus");
            const backgroundVariant = useThemeColor({}, "backgroundVariant")

    return (
        <View style={[styles.container, {backgroundColor : taskDisabledColor}]}>
            <Text style={[styles.title, {color: textColor}]}>Tu Progreso</Text>

            <View style={[styles.card, { backgroundColor: cardColor}]}>
                {/* Progress Section */}
                <View style={styles.progressSection}>
                    <View style={styles.progressHeader}>
                        <Text style={[styles.label, {color : taskColor}]}>Tareas</Text>
                        <Text style={[styles.taskCount, , {color : textColor}]}>
                            <Text style={[styles.highlight, { color: accentColor }]}>
                                {completedTasks}
                            </Text>
                            /{totalTasks}
                        </Text>
                    </View>

                    <View style={[styles.progressBar, {backgroundColor: backgroundVariant}]}>
                        <View
                            style={[
                                styles.progressBarFill,
                                { width: `${progress * 100}%`, backgroundColor: accentColor },
                            ]}
                        />
                    </View>
                    <Text style={[styles.percentage, {color : taskColor}]}>{Math.round(progress * 100)}%</Text>
                </View>

                {/* XP Section */}
                <View style={styles.xpSection}>
                    <View style={[styles.xpIcon, {backgroundColor: backgroundVariant}]}>
                        <Text style={[styles.xpText, { color: accentColor }]}>XP</Text>
                    </View>
                    <View style={styles.xpDetails}>
                        <Text style={[styles.xpValue, { color: accentColor }]}>{xpEarned}</Text>
                    </View>
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: "#1a1a1a", 
        padding: 16,
        borderRadius: 12,
        shadowColor: "#000",
        shadowOpacity: 0.2,
        shadowRadius: 4,
        marginBottom: 24,
    },
    title: {
        fontSize: 18,
        fontWeight: "bold",
        marginBottom: 16,
    },
    card: {
        padding: 16,
        borderRadius: 12,
        flexDirection: "row",
        justifyContent: "space-between",
    },
    progressSection: {
        flex: 1,
        marginRight: 16,
    },
    progressHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginBottom: 8,
    },
    label: {
        fontSize: 16,
        color: "#aaa",
    },
    taskCount: {
        fontSize: 14,
        fontWeight: "bold",
        color: "#fff",
    },
    highlight: {
        fontWeight: "bold",
    },
    progressBar: {
        height: 8,
        borderRadius: 4,
        overflow: "hidden",
    },
    progressBarFill: {
        height: "100%",
        borderRadius: 4,
    },
    percentage: {
        fontSize: 12,
        textAlign: "right",
        marginTop: 4,
    },
    xpSection: {
        flex: 0.1, // Occupy one-third of the parent container
        flexDirection: "row",
        alignItems: "center",
        borderLeftWidth: 1,
        borderLeftColor: "#444",
        paddingLeft: 16,
    },
    xpIcon: {
        width: 50,
        height: 50,
        borderRadius: 25,
        justifyContent: "center",
        alignItems: "center",
        marginRight: 16,
    },
    xpText: {
        fontSize: 20,
        fontWeight: "bold",
    },
    xpLabel: {
        fontSize: 24,
        color: "#aaa",
    },
    xpValue: {
        fontSize: 24,
        fontWeight: "bold",
    },
    xpDetails: {
        flex: 1,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
});

export default ProgressSection;