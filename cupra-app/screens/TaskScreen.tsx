import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import tasks from "../data/tasks.json"; // Import tasks from tasks.json
import { useThemeColor } from "../hooks/useThemeColor";

export default function TaskScreen() {
    const backgroundColor = useThemeColor({}, "background");
    const textColor = useThemeColor({}, "text");
    const accentColor = useThemeColor({}, "tint");

    const currentDay = 3; // Arbitrary day variable

    // Filter tasks based on the current day
    const todaysTasks = tasks.allTasks.filter((task) => task.day === currentDay);
    const unlockedTasks = tasks.allTasks.filter((task) => task.day <= currentDay && !task.completed);
    const lockedTasks = tasks.allTasks.filter((task) => task.day > currentDay);

    return (
        <ScrollView
            style={[styles.container, { backgroundColor }]}
            contentContainerStyle={styles.contentContainer}
        >
            <Text style={[styles.title, { color: textColor }]}>Your Tasks</Text>

            {/* Today's Tasks */}
            <View style={styles.section}>
                <Text style={[styles.sectionTitle, { color: accentColor }]}>
                    Today's Tasks
                </Text>
                {todaysTasks.map((task) => (
                    <View
                        key={task.id}
                        style={[
                            styles.taskCard,
                            task.completed && styles.taskCardCompleted,
                        ]}
                    >
                        <Text style={styles.taskIcon}>{task.icon}</Text>
                        <View style={styles.taskDetails}>
                            <Text style={[styles.taskTitle, { color: textColor }]}>
                                {task.title}
                            </Text>
                            <Text style={styles.taskPoints}>
                                +{task.points} points
                            </Text>
                        </View>
                        {task.completed && (
                            <Ionicons
                                name="checkmark-circle-outline"
                                size={20}
                                color={accentColor}
                            />
                        )}
                    </View>
                ))}
            </View>

            {/* Unlocked Tasks */}
            <View style={styles.section}>
                <Text style={[styles.sectionTitle, { color: accentColor }]}>
                    Unlocked Tasks
                </Text>
                {unlockedTasks.map((task) => (
                    <View key={task.id} style={styles.taskCard}>
                        <Text style={styles.taskIcon}>{task.icon}</Text>
                        <View style={styles.taskDetails}>
                            <Text style={[styles.taskTitle, { color: textColor }]}>
                                {task.title}
                            </Text>
                            <Text style={styles.taskPoints}>
                                +{task.points} points
                            </Text>
                        </View>
                        {!task.completed && (
                            <Ionicons
                                name="close-circle-outline"
                                size={20}
                                color="red"
                            />
                        )}
                    </View>
                ))}
            </View>

            {/* Locked Tasks */}
            <View style={styles.section}>
                <Text style={[styles.sectionTitle, { color: accentColor }]}>
                    Locked Tasks
                </Text>
                {lockedTasks.map((task) => (
                    <View key={task.id} style={styles.taskCard}>
                        <Text style={styles.taskIcon}>{task.icon}</Text>
                        <View style={styles.taskDetails}>
                            <Text style={[styles.taskTitle, { color: textColor }]}>
                                {task.title}
                            </Text>
                            <Text style={styles.taskPoints}>
                                +{task.points} points
                            </Text>
                        </View>
                        <Ionicons
                            name="lock-closed-outline"
                            size={20}
                            color="gray"
                        />
                    </View>
                ))}
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    contentContainer: {
        padding: 16,
    },
    title: {
        fontSize: 24,
        fontWeight: "bold",
        marginBottom: 16,
    },
    section: {
        marginBottom: 24,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: "bold",
        marginBottom: 12,
    },
    taskCard: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#333",
        borderRadius: 8,
        padding: 16,
        marginBottom: 12,
    },
    taskCardCompleted: {
        borderLeftWidth: 4,
        borderLeftColor: "#CFA56C",
    },
    taskIcon: {
        fontSize: 24,
        marginRight: 16,
    },
    taskDetails: {
        flex: 1,
    },
    taskTitle: {
        fontSize: 16,
        fontWeight: "bold",
    },
    taskPoints: {
        fontSize: 14,
        color: "#CFA56C",
    },
});