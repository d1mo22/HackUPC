import React from "react";
import { StyleSheet, Text, View, useWindowDimensions } from "react-native";
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
    const backgroundColor = useThemeColor({}, "background");
    const cardColor = useThemeColor({}, "card");
    const backgroundVariant = useThemeColor({}, "backgroundVariant");
    const taskColor = useThemeColor({}, "lightText");

    const { width } = useWindowDimensions();
    const isMobile = width <= 850;

    return (
        <View style={[styles.container, { backgroundColor, paddingHorizontal: isMobile ? 0 : 16 }]}>
            <Text style={[styles.title, { color: textColor }]}>Tu Progreso</Text>

            <View style={[styles.card, { backgroundColor: cardColor }]}>
                {/* Progress Section */}
                <View style={styles.progressSection}>
                    <View style={styles.progressHeader}>
                        <Text style={[styles.label, { color: taskColor }]}>Tareas</Text>
                        <Text style={[styles.taskCount, { color: textColor }]}>
                            <Text style={[styles.highlight, { color: accentColor }]}>
                                {completedTasks}
                            </Text>
                            /{totalTasks}
                        </Text>
                    </View>

                    <View style={[styles.progressBar, { backgroundColor: backgroundVariant }]}>
                        <View
                            style={[
                                styles.progressBarFill,
                                { width: `${progress * 100}%`, backgroundColor: accentColor },
                            ]}
                        />
                    </View>
                    <Text style={[styles.percentage, { color: taskColor }]}>
                        {Math.round(progress * 100)}%
                    </Text>
                </View>

                {/* XP Section */}
                <View style={styles.xpSection}>
                    <View style={[styles.xpIcon, { backgroundColor: backgroundVariant }]}>
                        <Text style={[styles.xpText, { color: accentColor }]}>XP</Text>
                    </View>
                    <Text style={[styles.xpValue, { color: accentColor }]}>{xpEarned}</Text>
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: "#1a1a1a",
        paddingVertical: 16,
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
        flexDirection: "row", // Ensure XP section is on the right
        padding: 16,
        borderRadius: 12,
        justifyContent: "space-between",
        alignItems: "center",
    },
    progressSection: {
        flex: 1, // Take up remaining space
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
        flexDirection: "row",
        alignItems: "center",
    },
    xpIcon: {
        width: 40,
        height: 40,
        borderRadius: 20,
        justifyContent: "center",
        alignItems: "center",
        marginRight: 8,
    },
    xpText: {
        fontSize: 16,
        fontWeight: "bold",
    },
    xpValue: {
        fontSize: 20,
        fontWeight: "bold",
    },
});

export default ProgressSection;