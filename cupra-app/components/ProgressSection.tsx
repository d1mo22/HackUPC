import React from "react";
import { StyleSheet, Text, View } from "react-native";

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
    return (
        <View style={styles.container}>
            <Text style={styles.title}>Your Progress</Text>

            <View style={styles.card}>
                {/* Progress Section */}
                <View style={styles.progressSection}>
                    <View style={styles.progressHeader}>
                        <Text style={styles.label}>Tasks</Text>
                        <Text style={styles.taskCount}>
                            <Text style={[styles.highlight, { color: accentColor }]}>
                                {completedTasks}
                            </Text>
                            /{totalTasks}
                        </Text>
                    </View>

                    <View style={styles.progressBar}>
                        <View
                            style={[
                                styles.progressBarFill,
                                { width: `${progress * 100}%`, backgroundColor: accentColor },
                            ]}
                        />
                    </View>
                    <Text style={styles.percentage}>{Math.round(progress * 100)}%</Text>
                </View>

                {/* XP Section */}
                <View style={styles.xpSection}>
                    <View style={styles.xpIcon}>
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
        color: "#fff",
        marginBottom: 16,
    },
    card: {
        backgroundColor: "#2a2a2a",
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
        color: "#fff",
    },
    highlight: {
        fontWeight: "bold",
    },
    progressBar: {
        height: 8,
        backgroundColor: "#444",
        borderRadius: 4,
        overflow: "hidden",
    },
    progressBarFill: {
        height: "100%",
        borderRadius: 4,
    },
    percentage: {
        fontSize: 12,
        color: "#aaa",
        textAlign: "right",
        marginTop: 4,
    },
    xpSection: {
        flex: 0.33, // Occupy one-third of the parent container
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
        backgroundColor: "#444",
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