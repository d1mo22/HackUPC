import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function TaskCard({ task, onComplete, accentColor, textColor, cardBackgroundColor, cardAccentColor }) {
    return (
        <TouchableOpacity
            style={[styles.taskCard, { backgroundColor: cardBackgroundColor }]}
            onPress={() => onComplete(task.id)}
        >
            <View style={[styles.taskIcon, { backgroundColor: cardAccentColor }]}>
                <Text style={styles.taskIconText}>{task.icon}</Text>
            </View>
            <View style={styles.taskDetails}>
                <Text style={[styles.taskTitle, { color: textColor }]}>{task.title}</Text>
                <View style={styles.taskPoints}>
                    <Text style={[styles.taskPointsText, { color: accentColor }]}>
                        +{task.points} puntos
                    </Text>
                    {task.completed && (
                        <View style={[styles.taskCompletedBadge, { backgroundColor: accentColor }]}>
                            <Ionicons name="checkmark-circle-outline" size={12} color="#fff" />
                            <Text style={styles.taskCompletedText}>Completed</Text>
                        </View>
                    )}
                </View>
            </View>
            <Ionicons name="chevron-forward-outline" size={20} color={textColor} />
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    taskCard: {
        flexDirection: "row",
        alignItems: "center",
        borderRadius: 8,
        padding: 16,
        marginBottom: 12,
    },
    taskIcon: {
        width: 40,
        height: 40,
        borderRadius: 20,
        justifyContent: "center",
        alignItems: "center",
        marginRight: 16,
    },
    taskIconText: {
        fontSize: 18,
    },
    taskDetails: {
        flex: 1,
    },
    taskTitle: {
        fontSize: 16,
        marginBottom: 4,
    },
    taskPoints: {
        flexDirection: "row",
        alignItems: "center",
    },
    taskPointsText: {
        fontSize: 12,
        marginRight: 8,
    },
    taskCompletedBadge: {
        flexDirection: "row",
        alignItems: "center",
        borderRadius: 12,
        paddingHorizontal: 8,
        paddingVertical: 2,
    },
    taskCompletedText: {
        color: "#fff",
        fontSize: 12,
        marginLeft: 4,
    },
});